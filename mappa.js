/*
 * mappa.js · mappa delle due sedi per il tema Marp "panetti"
 * Uso: nella slide, un elemento  div class="mappa"  (vedi esempio.md, slide "Dove siamo").
 * Carica Leaflet da cdnjs e le tessere della mappa CARTO (serve la connessione).
 */
(function () {
  'use strict';
  const SEDI = [
    { nome: 'SEDE PANETTI', via: 'via Re David 186', lat: 41.1110315, lng: 16.8768082, colore: '#25377E', forma: 'circle' },
    { nome: 'SEDE PITAGORA', via: 'corso Cavour 249', lat: 41.1186559, lng: 16.8725987, colore: '#25377E', forma: 'qbl' },
  ];
  const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';

  function load(tag, attrs) {
    return new Promise((ok, ko) => {
      const e = document.createElement(tag);
      Object.assign(e, attrs);
      e.onload = ok; e.onerror = ko;
      document.head.appendChild(e);
    });
  }
  function icona(s) {
    const forma = s.forma === 'circle'
      ? '<circle cx="22" cy="22" r="13" fill="#EAE463"/>'
      : '<path d="M0 44V0A44 44 0 0 1 44 44Z" fill="#EAE463"/>';
    return L.divIcon({
      className: 'pp-pin',
      iconSize: [44, 44], iconAnchor: [22, 22],
      html: `<svg width="44" height="44" viewBox="0 0 44 44"><rect width="44" height="44" fill="${s.colore}"/>${forma}</svg>` +
            `<div class="pp-lbl"><b>${s.nome}</b>${s.via}</div>`,
    });
  }
  async function init() {
    const boxes = document.querySelectorAll('.mappa');
    if (!boxes.length) return;
    if (!document.getElementById('leaflet-css')) await load('link', { rel: 'stylesheet', href: LEAFLET + 'leaflet.min.css' });
    await load('script', { src: LEAFLET + 'leaflet.min.js' });
    boxes.forEach((box) => {
      const map = L.map(box, { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, touchZoom: false, attributionControl: true });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
        attribution: '© OpenStreetMap · © CARTO',
      }).addTo(map);
      map.attributionControl.setPrefix(false);
      const b = L.latLngBounds(SEDI.map((s) => [s.lat, s.lng]));
      SEDI.forEach((s) => L.marker([s.lat, s.lng], { icon: icona(s), interactive: false }).addTo(map));
      const fit = () => { map.invalidateSize(); map.fitBounds(b, { padding: [90, 90] }); };
      fit();
      // in Marp le slide nascoste hanno dimensione zero: ricalcola quando la slide diventa visibile
      const svg = box.closest('svg');
      if (svg) new MutationObserver(fit).observe(svg, { attributes: true, attributeFilter: ['class'] });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
