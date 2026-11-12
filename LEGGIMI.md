# Kit Marp · Orientamento 2026/27

Tema Marp con lo stile di locandina e brochure, più il mosaico animato.

## Cosa c'è

- `panetti.css`: il tema (colori, Barlow Semi Condensed, fascia gialla, tabelle, layout)
- `mosaico.js`: disegna e anima il mosaico su ogni slide
- `assets/`: logo, QR «Prenota» (campagna Matomo `qr-slide`), QR WhatsApp, icone dei cinque indirizzi (`icone/`), mappa delle sedi (`mappa-sedi.png` per le slide, `mappa-sedi-stampa.pdf` vettoriale per la stampa)
- `index.md`: presentazione con tutti i layout e i cinque indirizzi (scheda + quadro orario)
- `index.html`: la presentazione già compilata, da aprire nel browser

## Compilare

Da terminale, nella cartella del kit:

```
npx @marp-team/marp-cli --html --theme panetti.css index.md -o index.html
```

`--html` è obbligatorio, altrimenti lo script del mosaico non parte.
In VS Code (estensione Marp): aggiungi `panetti.css` in `markdown.marp.themes` e attiva `markdown.marp.enableHtml`.

## Pubblicare sul sito

Carica nella stessa cartella: il file `.html`, `mosaico.js` e la cartella `assets/`.
Il carattere arriva da Google Fonts, quindi serve la connessione.

## Scrivere le slide

All'inizio del file:

```
---
marp: true
theme: panetti
paginate: true
footer: panettipitagora.edu.it/orientamento
---
```

Nella **prima slide**, una volta sola:

```
<script src="mosaico.js"></script>
```

| Layout | Come si attiva | Mosaico |
|---|---|---|
| Copertina | `<!-- _class: cover -->` | 3 colonne a destra con il logo |
| Sezione | `<!-- _class: section -->` | fascia di tessere a destra |
| Indirizzo | `<!-- _class: indirizzo inf -->` (o `chi` `cat` `eln` `elt`) | in alto a destra l'icona dell'indirizzo più una tessera animata |
| Quadro orario | `<!-- _class: quadro inf -->` | come indirizzo (icona + tessera); tabelle affiancate in `<div class="tabelle">` |
| Dove siamo | `<!-- _class: sedi -->`, con `<img class="mappa" src="assets/mappa-sedi.png">` | 2 tessere in alto a destra; mappa delle due sedi |
| Date e QR | `<!-- _class: date -->` | 2 tessere in alto a destra |
| Chiusura | `<!-- _class: closing -->` | mosaico a tutta pagina con il logo (il testo non si vede) |
| Tutte le altre | nessuna classe | 2 tessere in alto a destra |

Elementi di testo:

- `##### Testo` → etichetta piccola maiuscola sopra il titolo
- `###### Testo` → titoletto delle colonne
- `<div class="cols"> … </div>` → tre colonne con filetto (ogni colonna in un `<div>`, con una riga vuota dentro)
- `<em>Realizza.</em>` nel titolo della copertina → evidenziato in giallo
- `<mark>parola</mark>` → evidenziazione gialla ovunque
- `<div class="ind-list">` → elenco degli indirizzi uno sotto l’altro con la loro icona (vedi index.md)

## Animazioni

- **Ingresso:** quando una slide compare, le tessere si costruiscono in diagonale (fondo, poi forma). Riparte ogni volta che torni sulla slide.
- **Movimenti:** a mosaico finito, 1–2 tessere non vicine si muovono e tornano esattamente com'erano, e la stessa tessera non si muove mai due volte di seguito. Il cerchio si restringe, il punto si allarga, il quarto di cerchio si chiude a ventaglio sul suo angolo o accorcia il raggio, il semicerchio fa mezzo giro sulla base o si abbassa nel bordo, il triangolo si ritrae, il rombo ruota di 90°.
- **Frequenza:** ogni ~3,6 s su copertina, sezioni e chiusura; ogni ~7 s sulle altre slide.

Per cambiare i tempi o la composizione, in cima a `mosaico.js`: `RITMO_FORTE`, `RITMO_LEGGERO`, `SEME` (un altro numero = un altro mosaico).

## Quadri orari

Nella riga del totale, le ore di laboratorio vanno fra parentesi: `17 <span class="lab">(8)</span>`.
Sotto le tabelle compare da sola la legenda «Fra parentesi le ore di laboratorio».

## Mappa

`assets/mappa-sedi.png` è disegnata dai dati aperti del Comune di Bari (stradario e confine comunale, licenza CC-BY): niente Google Maps, niente chiavi, niente servizi esterni. La fonte è citata in basso a destra sulla mappa: lasciala.
