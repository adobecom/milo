# Shared globe layer

Code shared by `libs/c2/blocks/firefly-globe` and `libs/c2/blocks/globe-gallery`. One globe per
page. Each block keeps its entry file, `src/authoring.js` and `src/timeline.js`.

| File | Holds |
| --- | --- |
| `core.js` | Easings, camera/clock math, layout helpers |
| `gl.js` | Shaders, card/modal/text materials, texture and hint-font loaders |
| `interaction.js` | Pointer drag, click-vs-drag, raycast hover, a11y gallery, spin controls, cursor label |
| `authoring.js` | Authored-content parsing, hang-opening-mark, DOM skeleton, `loadGlobeStyles` |
| `globe.css` | Styles shared by both blocks |
| `modal.js` | Card-detail modal |
| `quote-particles.js` | Pull-quote particle transition and `createPullQuote` |

## Styles

`globe.css` holds every rule both blocks share and is loaded by `loadGlobeStyles()` (awaited at the
top of each block's `init`). Each block's own CSS keeps only what must paint before JS runs (root
height, background, `-reduced` / `-empty` states) and what is
specific to it. Block rules are scoped under their root (`.root .globe-*`), so two
globes on one page don't share block styling. A block rule that overrides a shared rule must
out-specify it (e.g. `.firefly-globe .globe-controls`), because load order is not guaranteed.

Naming: the block root keeps its own class (`firefly-globe`, `globe-gallery`); everything inside it,
and every state class, uses the family prefix `globe-` (`globe-modal-info`, `globe-reduced`,
`globe-pq-particles`). The skeleton adds `globe` to the root, which carries the shared custom
properties (`--globe-copy-pad`, `--globe-crosshair-width`, ...). Block-only vars stay on the block
root (`--globe-runway-height`, `--globe-travel-vh`, `--globe-formation-vh`).

## Block hooks

Shared factories take the block `name` (`'firefly-globe'` / `'globe-gallery'`) only where it feeds
`daa-ll` labels.

- `createPullQuote`: `timeline` `{ easePow, spanPx(span), scrollYAt(t, span) }`; `easePow` is
  passed per instance. Options `getFormationVh`, `requireOnSphere`, `manageCanvas` are gallery's.
  The travel length is read from `--globe-travel-vh`.
- `createGlobeModal`: `renderContent(targetEl, meta)` returning `{ descEl, speech }` (`speech` is
  `[text, lang?]` parts announced before the position). `hoistToBody` moves the modal and canvas to
  `<body>` (then `destroy(true)` removes them); `bodyOpenClass` also flags `<body>` while open.
- `buildGlobeSkeleton`: `canvasStyle`, `modalInfoHtml(gid)`, optional `arcCopyHtml`.

## Behaviours

- **Hanging the opening mark** (`hangOpeningMark`): measures the first character with a `Range`
  and sets a negative `text-indent` in `em`; canvas measurement is used when the element isn't laid
  out. It skips centered and non-horizontal text, hangs again once on the next frame if it used the
  canvas, and once when `document.fonts` finishes loading, using the latest gutter it was given.
- **Pull-quote raster text:** each line is drawn with whichever `letter-spacing` (the element's, or
  none) matches the DOM line width. A line that matches neither is drawn word by word from the words'
  DOM rects.
- **Crosshair rules** paint under the DOM text, as under the raster.
- **Scroll lock:** `html:has(.globe)` keeps `scrollbar-gutter: stable`; the gutter is painted
  dark while the modal is open.
- **Modal dialog** is `overflow: clip`; only the description (and, on short landscape viewports,
  `.modal-info`) scrolls.
