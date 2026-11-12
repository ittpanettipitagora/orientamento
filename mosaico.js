/*
 * mosaico.js · Orientamento 2026/27 · Liceo Tecnologico Panetti Pitagora
 * Aggiunge a ogni slide Marp il mosaico di tessere, lo "costruisce" quando la slide entra in scena
 * e poi anima 1–2 tessere alla volta, a intervalli. Ogni animazione finisce esattamente com'è iniziata.
 *
 * Uso: nella prima slide del .md inserisci il tag script che carica mosaico.js (vedi LEGGIMI).
 * Il mosaico dipende dalla classe della slide (direttiva _class):
 *   cover · section · closing · indirizzo chi|cat|eln|elt|inf · tutte le altre (angolo in alto a destra)
 */
(function () {
  'use strict';

  // ---------- impostazioni ----------
  const LOGO = 'assets/logo.svg';
  const RITMO_FORTE = 4500;   // ms tra un'animazione e l'altra su cover, section, closing
  const RITMO_LEGGERO = 9000; // ms sulle altre slide (meno frequente)
  const SEME = 2026;          // cambia questo numero per avere composizioni diverse

  const C = {
    blu: '#25377E', giallo: '#EAE463', carta: '#ECEDE6', bianco: '#FFFFFF',
    chi: '#EF7A30', cat: '#5AA845', eln: '#7A4EA3', elt: '#D9362B', inf: '#1FA9D9',
  };
  const FONDI = ['blu', 'blu', 'carta', 'chi', 'cat', 'eln', 'elt', 'inf'];
  const FORME = ['qtl', 'qtr', 'qbl', 'qbr', 'circle', 'dot', 'tri_tl', 'tri_tr', 'tri_br', 'tri_bl', 'semi', 'rhomb'];
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ---------- numeri casuali ripetibili ----------
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)];

  // ---------- layout per classe ----------
  // x, y, size in px della slide (1280 × 720); cols × rows tessere; logo = [col, row] di una tessera doppia
  function layoutFor(cls) {
    if (cls.contains('cover'))   return { x: 680, y: 0, size: 200, cols: 3, rows: 4, logo: [0, 1, 2, 1], logoScala: 0.76, ritmo: RITMO_FORTE };
    if (cls.contains('closing')) return { x: 0, y: 0, size: 160, cols: 8, rows: 5, logo: [2, 1, 4, 2], logoScala: 0.5, ritmo: RITMO_FORTE };
    if (cls.contains('section')) return { x: 860, y: 0, size: 140, cols: 3, rows: 6, ritmo: RITMO_FORTE };
    return { x: 1040, y: 0, size: 120, cols: 2, rows: 1, ritmo: RITMO_LEGGERO, angolo: true };
  }
  const ACCENTI = ['chi', 'cat', 'eln', 'elt', 'inf'];

  function composizione(lay, cls, seed) {
    const r = rng(seed);
    const acc = ACCENTI.find((a) => cls.contains(a));
    const grid = [], map = {};
    const L = lay.logo; // [col, row, larghezza, altezza] in tessere
    const inLogo = (c, w) => L && c >= L[0] && c < L[0] + L[2] && w >= L[1] && w < L[1] + L[3];
    if (L) grid.push({ col: L[0], row: L[1], w: L[2], h: L[3], logo: true });
    for (let row = 0; row < lay.rows; row++) {
      for (let col = 0; col < lay.cols; col++) {
        if (inLogo(col, row)) { map[col + ',' + row] = 'bianco'; continue; }
        const left = map[(col - 1) + ',' + row], up = map[col + ',' + (row - 1)];
        let bg, n = 0;
        do { bg = pick(r, FONDI); n++; } while (n < 50 && (bg === left || bg === up));
        if (lay.angolo && acc && col === 0) bg = acc; // slide indirizzo: prima tessera nel colore dell'indirizzo
        let fg; do { fg = pick(r, ['blu', 'giallo', 'carta', ...ACCENTI]); } while (fg === bg || (bg === 'carta' && fg === 'giallo'));
        if (lay.angolo && acc && col === 1) { if (bg === acc) bg = 'blu'; fg = acc; }
        map[col + ',' + row] = bg;
        grid.push({ col, row, bg, fg, shape: pick(r, FORME) });
      }
    }
    return grid;
  }

  // ---------- disegno ----------
  function el(name, attrs, parent) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function shapeEl(shape, s, color, parent) {
    const a = { fill: color };
    switch (shape) {
      case 'qtl': a.d = `M0 0H${s}A${s} ${s} 0 0 1 0 ${s}Z`; break;
      case 'qtr': a.d = `M${s} 0V${s}A${s} ${s} 0 0 1 0 0Z`; break;
      case 'qbl': a.d = `M0 ${s}V0A${s} ${s} 0 0 1 ${s} ${s}Z`; break;
      case 'qbr': a.d = `M${s} ${s}H0A${s} ${s} 0 0 1 ${s} 0Z`; break;
      case 'tri_tl': a.d = `M0 0H${s}L0 ${s}Z`; break;
      case 'tri_tr': a.d = `M0 0H${s}V${s}Z`; break;
      case 'tri_br': a.d = `M${s} 0V${s}H0Z`; break;
      case 'tri_bl': a.d = `M0 0V${s}H${s}Z`; break;
      case 'semi': a.d = `M0 ${s}A${s / 2} ${s / 2} 0 0 1 ${s} ${s}Z`; break;
      case 'rhomb': a.d = `M${s / 2} ${s * 0.08}L${s * 0.92} ${s / 2}L${s / 2} ${s * 0.92}L${s * 0.08} ${s / 2}Z`; break;
      case 'circle': return el('circle', { cx: s / 2, cy: s / 2, r: s * 0.36, fill: color }, parent);
      case 'dot': return el('circle', { cx: s / 2, cy: s / 2, r: s * 0.13, fill: color }, parent);
    }
    return el('path', a, parent);
  }
  // punto fisso (in % del riquadro della forma) per crescere e "respirare"
  const ORIGINE = {
    qtl: '0% 0%', qtr: '100% 0%', qbl: '0% 100%', qbr: '100% 100%',
    tri_tl: '0% 0%', tri_tr: '100% 0%', tri_br: '100% 100%', tri_bl: '0% 100%',
    semi: '50% 100%', rhomb: '50% 50%', circle: '50% 50%', dot: '50% 50%',
  };

  let uid = 0;
  function build(section, idx) {
    const lay = layoutFor(section.classList);
    const tiles = composizione(lay, section.classList, SEME + idx * 97);
    const s = lay.size;
    const wrap = document.createElement('div');
    wrap.className = 'mosaico';
    const W = lay.cols * s, H = lay.rows * s;
    Object.assign(wrap.style, { left: lay.x + 'px', top: lay.y + 'px', width: W + 'px', height: H + 'px' });
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }, wrap);
    const defs = el('defs', {}, svg);
    for (const t of tiles) {
      const w = t.logo ? t.w * s : s, h = t.logo ? t.h * s : s;
      const g = el('g', { transform: `translate(${t.col * s} ${t.row * s})` }, svg);
      const id = 'mz' + (uid++);
      el('rect', { x: 0, y: 0, width: w, height: h }, el('clipPath', { id }, defs));
      const clip = el('g', { 'clip-path': `url(#${id})` }, g);
      t.bgEl = el('rect', { x: 0, y: 0, width: w, height: h, fill: t.logo ? C.bianco : C[t.bg] }, clip);
      if (t.logo) {
        const lw = w * lay.logoScala, lh = lw * 443.04 / 766.08;
        t.shapeEl = el('image', { href: LOGO, x: (w - lw) / 2, y: (h - lh) / 2, width: lw, height: lh }, clip);
      } else {
        t.shapeEl = shapeEl(t.shape, s, C[t.fg], clip);
        t.shapeEl.style.transformBox = 'fill-box';
        t.shapeEl.style.transformOrigin = ORIGINE[t.shape];
      }
      t.bgEl.style.transformBox = 'fill-box';
    }
    section.insertBefore(wrap, section.firstChild);
    return { section, tiles, lay, timer: null, anims: [] };
  }

  // ---------- costruzione all'ingresso ----------
  const EASE = 'cubic-bezier(.2,.7,.2,1)';
  function costruisci(m) {
    stop(m);
    const r = rng(Date.now());
    const lati = ['0% 50%', '100% 50%', '50% 0%', '50% 100%'];
    for (const t of m.tiles) {
      const delay = 120 + (t.col + t.row) * 85 + r() * 70;
      const lato = pick(r, lati);
      t.bgEl.style.transformOrigin = lato;
      const vert = lato.startsWith('50%');
      const from = vert ? 'scaleY(0)' : 'scaleX(0)';
      m.anims.push(t.bgEl.animate([{ transform: from }, { transform: 'none' }], { duration: 420, delay, easing: EASE, fill: 'backwards' }));
      if (t.logo) {
        m.anims.push(t.shapeEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: delay + 300, easing: 'ease-out', fill: 'backwards' }));
        continue;
      }
      let kf;
      switch (t.shape) {
        case 'circle': case 'dot': kf = [{ transform: 'scale(0)' }, { transform: 'scale(1.1)', offset: .7 }, { transform: 'none' }]; break;
        case 'semi': kf = [{ transform: 'scaleY(0)' }, { transform: 'none' }]; break;
        case 'rhomb': kf = [{ transform: 'rotate(-90deg) scale(0)' }, { transform: 'none' }]; break;
        default: kf = [{ transform: 'scale(0)' }, { transform: 'none' }];
      }
      m.anims.push(t.shapeEl.animate(kf, { duration: 520, delay: delay + 260, easing: EASE, fill: 'backwards' }));
    }
    const fine = 120 + (m.lay.cols + m.lay.rows) * 85 + 900;
    m.timer = setTimeout(() => ciclo(m), fine + m.lay.ritmo * 0.5);
  }

  // ---------- micro-animazioni (seamless: ultimo fotogramma = primo) ----------
  const IO = 'cubic-bezier(.45,0,.55,1)';
  function micro(t) {
    switch (t.shape) {
      case 'circle': return [[{ transform: 'none' }, { transform: 'scale(.6)' }, { transform: 'none' }], 1800];
      case 'dot': return [[{ transform: 'none' }, { transform: 'scale(2.3)' }, { transform: 'none' }], 1800];
      case 'qtl': case 'qtr': case 'qbl': case 'qbr':
        t.shapeEl.style.transformOrigin = '50% 50%'; // giro completo intorno al centro della tessera
        return [[{ transform: 'none' }, { transform: 'rotate(360deg)' }], 2400, () => { t.shapeEl.style.transformOrigin = ORIGINE[t.shape]; }];
      case 'semi': return [[{ transform: 'none' }, { transform: 'translateY(75%)' }, { transform: 'none' }], 2000];
      case 'rhomb': return [[{ transform: 'none' }, { transform: 'rotate(90deg)' }], 1600]; // ruotato di 90° è identico
      default: return [[{ transform: 'none' }, { transform: 'scale(.4)' }, { transform: 'none' }], 1900]; // triangoli
    }
  }
  function vicine(a, b) { return Math.abs(a.col - b.col) <= 1 && Math.abs(a.row - b.row) <= 1; }
  function ciclo(m) {
    const libere = m.tiles.filter((t) => !t.logo && !t.busy);
    const r = Math.random;
    const n = libere.length > 3 && r() < 0.5 ? 2 : 1;
    const scelte = [];
    for (let k = 0; k < 20 && scelte.length < n && libere.length; k++) {
      const t = libere[Math.floor(r() * libere.length)];
      if (!scelte.some((s) => s === t || vicine(s, t))) scelte.push(t);
    }
    scelte.forEach((t, i) => {
      const [kf, dur, after] = micro(t);
      t.busy = true;
      const a = t.shapeEl.animate(kf, { duration: dur, delay: i * 350, easing: IO });
      m.anims.push(a);
      a.finished.catch(() => {}).then(() => { t.busy = false; if (after) after(); });
    });
    const base = m.lay.ritmo;
    m.timer = setTimeout(() => ciclo(m), base * (0.85 + Math.random() * 0.3));
  }
  function stop(m) {
    clearTimeout(m.timer);
    m.anims.forEach((a) => a.cancel());
    m.anims = [];
    m.tiles.forEach((t) => { t.busy = false; if (t.shapeEl && t.shape) t.shapeEl.style.transformOrigin = ORIGINE[t.shape]; });
  }

  // ---------- avvio ----------
  function init() {
    const sections = Array.from(document.querySelectorAll('section[data-marpit-pagination], div.marpit > section, svg[data-marpit-svg] > foreignObject > section'))
      .filter((s, i, a) => a.indexOf(s) === i);
    if (!sections.length) return;
    const ms = sections.map((s, i) => build(s, i));
    const bespoke = document.querySelector('.bespoke-marp-parent, [data-marpit-svg].bespoke-marp-slide');
    if (bespoke) {
      ms.forEach((m) => {
        const svg = m.section.closest('svg');
        let on = false;
        const check = () => {
          const now = svg.classList.contains('bespoke-marp-active');
          if (now && !on) costruisci(m);
          if (!now && on) stop(m);
          on = now;
        };
        new MutationObserver(check).observe(svg, { attributes: true, attributeFilter: ['class'] });
        check();
      });
    } else {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        const m = ms.find((x) => x.section === e.target);
        if (e.isIntersecting) costruisci(m); else stop(m);
      }), { threshold: 0.5 });
      ms.forEach((m) => io.observe(m.section));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
