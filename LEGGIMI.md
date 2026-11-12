# Kit Marp · Orientamento 2026/27

Tema Marp con lo stile di locandina e brochure, più il mosaico animato.

## Cosa c'è

- `panetti.css`: il tema (colori, Barlow Semi Condensed, fascia gialla, tabelle, layout)
- `mosaico.js`: disegna e anima il mosaico su ogni slide
- `mappa.js`: la mappa con le due sedi (slide «Dove siamo»)
- `assets/`: logo, QR «Prenota» (campagna Matomo `qr-slide`), QR WhatsApp
- `esempio.md`: presentazione di esempio con tutti i layout e i cinque indirizzi (scheda + quadro orario)
- `index.html`: la presentazione compilata, da aprire nel browser

## Compilare

Da terminale, nella cartella del kit:

```
npx @marp-team/marp-cli --html --theme panetti.css esempio.md -o index.html
```

`--html` è obbligatorio, altrimenti lo script del mosaico non parte.
In VS Code (estensione Marp): aggiungi `panetti.css` in `markdown.marp.themes` e attiva `markdown.marp.enableHtml`.

## Pubblicare sul sito

Carica nella stessa cartella: il file `.html`, `mosaico.js`, `mappa.js` e la cartella `assets/`.
Carattere (Google Fonts), libreria della mappa (Leaflet da cdnjs) e sfondo della mappa (OpenStreetMap/CARTO) arrivano da internet: serve la connessione.

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
<script src="mappa.js"></script>
```

| Layout | Come si attiva | Mosaico |
|---|---|---|
| Copertina | `<!-- _class: cover -->` | 3 colonne a destra con il logo |
| Sezione | `<!-- _class: section -->` | fascia di tessere a destra |
| Indirizzo | `<!-- _class: indirizzo inf -->` (o `chi` `cat` `eln` `elt`) | 2 tessere in alto a destra, nel colore dell'indirizzo |
| Quadro orario | `<!-- _class: quadro inf -->` | come indirizzo; tabelle affiancate in `<div class="tabelle">` |
| Dove siamo | `<!-- _class: sedi -->`, con `<div class="mappa"></div>` | 2 tessere in alto a destra; mappa fissa con le due sedi |
| Date e QR | `<!-- _class: date -->` | 2 tessere in alto a destra |
| Chiusura | `<!-- _class: closing -->` | mosaico a tutta pagina con il logo (il testo non si vede) |
| Tutte le altre | nessuna classe | 2 tessere in alto a destra |

Elementi di testo:

- `##### Testo` → etichetta piccola maiuscola sopra il titolo
- `###### Testo` → titoletto delle colonne
- `<div class="cols"> … </div>` → tre colonne con filetto (ogni colonna in un `<div>`, con una riga vuota dentro)
- `<em>Realizza.</em>` nel titolo della copertina → evidenziato in giallo
- `<mark>parola</mark>` → evidenziazione gialla ovunque
- `<div class="ind-list">` → elenco degli indirizzi uno sotto l’altro con il quadratino colorato (vedi esempio.md)

## Animazioni

- **Ingresso:** quando una slide compare, le tessere si costruiscono in diagonale (fondo, poi forma). Riparte ogni volta che torni sulla slide.
- **Movimenti:** a mosaico finito, 1–2 tessere non vicine si muovono e tornano esattamente com'erano: il cerchio si restringe, il punto si allarga, il quarto di cerchio fa un giro, il triangolo si ritrae, il semicerchio scende e risale, il rombo ruota di 90°.
- **Frequenza:** ogni ~4,5 s su copertina, sezioni e chiusura; ogni ~9 s sulle altre slide.

Per cambiare i tempi o la composizione, in cima a `mosaico.js`: `RITMO_FORTE`, `RITMO_LEGGERO`, `SEME` (un altro numero = un altro mosaico).
