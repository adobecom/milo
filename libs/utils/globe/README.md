# Shared globe layer

Code shared by `libs/c2/blocks/firefly-globe` and `libs/c2/blocks/globe-gallery`. One globe per
page. Each block keeps its entry file, `src/authoring.js` and `src/timeline.js`.

| File | Holds |
| --- | --- |
| `core.js` | Shaders, easings, camera/clock math, material and texture factories, layout helpers |
| `interaction.js` | Pointer drag, click-vs-drag, raycast hover |
| `ui.js` | A11y gallery, spin controls, cursor label, authoring helpers, hang-opening-mark, DOM skeleton |
| `modal.js` | Card-detail modal |
| `quote-particles.js` | Pull-quote particle transition and `createPullQuote` |

## Block hooks

Shared factories take the block name (`'firefly-globe'` / `'globe-gallery'`) and derive class names
and `daa-ll` labels from it.

- `createPullQuote`: `cssVars` (`'fg'` / `'gg'`), `travelVar` (CSS var, in `vh`, sizing the camera
  travel), `timeline` `{ easePow, spanPx(span), scrollYAt(t, span) }`. Options `getFormationVh`,
  `requireOnSphere`, `manageCanvas` are gallery's. Naming and easing are kept in module state
  (`configureGlobe`).
- `createGlobeModal`: `cssVars`, `descClass` (`'prompt'` / `'description'`),
  `renderContent(targetEl, meta)` returning `{ descEl, speech }` (`speech` is `[text, lang?]` parts
  announced before the position). `hoistToBody` moves the modal and canvas to `<body>` (then
  `destroy(true)` removes them); `bodyOpenClass` also flags `<body>` while open.
- `buildGlobeSkeleton`: `canvasStyle`, `modalInfoHtml(gid)`, optional `arcCopyHtml`.

## Behaviours

- **Hanging the opening mark** (`hangOpeningMark`): measures the first character with a `Range`
  and sets a negative `text-indent` in `em`; canvas measurement is used when the element isn't laid
  out. It skips centered and non-horizontal text, hangs again once on the next frame if it used the
  canvas, and once when `document.fonts` finishes loading, using the latest gutter it was given.
- **Pull-quote raster text:** each line is drawn with whichever `letter-spacing` (the element's, or
  0) matches the DOM line width. A line that matches neither is drawn word by word from the words'
  DOM rects.
- **Crosshair rules** paint under the DOM text (`z-index: -1`), as under the raster.
- **Scroll lock:** `html:has(.<block>)` keeps `scrollbar-gutter: stable`; the gutter is painted
  dark while the modal is open.
- **Modal dialog** is `overflow: clip`; only the description (and, on short landscape viewports,
  `.modal-info`) scrolls.
