# Shared globe layer

Code shared by `libs/c2/blocks/firefly-globe` and `libs/c2/blocks/globe-gallery`. One globe per
page. Each block keeps its entry file (its `spec`), `src/authoring.js` and `src/timeline.js`.

This file covers how the layer is organised. The globe-gallery README is the spec for how these
modules behave, including the sections code comments here point to.

| File | Holds |
| --- | --- |
| `core.js` | Easings, `seededRandom`, camera/clock math, layout helpers |
| `runtime.js` | The shared runtime: `initGlobeBlock`, `createGlobeRuntime` (lifecycle, frame order) and its parts: scroll reader, orientation, card field, hint text |
| `gl.js` | Shaders, card/modal/text materials, texture and hint-font loaders |
| `interaction.js` | Pointer drag, click-vs-drag, raycast hover, a11y gallery, spin controls, cursor label |
| `authoring.js` | Authored-content parsing, hang-opening-mark, DOM skeleton, `loadGlobeStyles`, `onRemoved` |
| `globe.css` | Styles shared by both blocks |
| `modal.js` | Card-detail modal |
| `quote-particles.js` | Pull-quote particle transition and `createPullQuote` |

## Styles

`globe.css` holds every rule both blocks share and is loaded by `loadGlobeStyles()`, which each
block's `init` starts first and awaits after fetching its content. Each block's own CSS keeps only what must paint before JS runs (root
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
`daa-ll` labels or lana log tags.

- `spec`, passed to `initGlobeBlock`: `name`, `breakpoints`, `bpExtras(cfg, nTotal)`, `rollSeed`, `timeline`, `pullQuote`
  and `modal` options, `cardImageUrl(meta, cap)`, `modalImageUrl(meta, cap)`, `setup(el)` and `createHooks(ctx)`.
- `createHooks(ctx)` returns the block's choreography and runs once per build, so its closure state lasts one build.
  It must not read `ctx` while creating the hooks, only when they are called. `ctx.disposer.add(fn)` registers cleanup.
  `entryCamZ`, `viewOffsetY` and `browseScrollTop` are required.
  Optional: `activeCamera`, `fillFrameInput`, `beforeBuild`, `onCameraReady`, `onResize`, `onCardsBuilt`,
  `beforeFrame`, `beforeCards`, `afterFrame`, `hintSphereDist`, `cardProgress` and `placeCard`. Without `placeCard`, a
  card is placed on the sphere and ordered by depth.
- `timeline`: `createFrame`, `createFrameInput`, `deriveFrame`, `TRAVEL_EASE_POW`, `camZAtTravelT` and `travelTAtCamZ`.
  `createBaseFrame` in `core.js` lists the frame fields the runtime reads. Anything else on the frame is the block's own.
- `createPullQuote`: `timeline` `{ easePow, spanPx(span), scrollYAt(t, span) }`; `easePow` is
  passed per instance. Options `getFormationVh`, `requireOnSphere`, `manageCanvas` are gallery's.
  The travel length is read from `--globe-travel-vh`.
- `createGlobeModal`: `renderContent(targetEl, meta)` returning `{ descEl, speech }` (`speech` is
  `[text, lang?]` parts announced before the position). `hoistToBody` moves the modal and canvas to
  `<body>` (then `destroy(true)` removes them); `bodyOpenClass` also flags `<body>` while open.
- `buildGlobeSkeleton`: `canvasStyle`, `modalInfoHtml(gid)`, optional `arcCopyHtml`.
- `setup(el)` must read the authored rows before calling `buildGlobeDom`, which replaces the block's children.

## Two lifetimes

`createGlobeRuntime` runs for as long as the block does. It holds the content, DOM, `bp`, measurements, orientation,
pull quote, modal, a11y, controls, cursor and interaction.

`createBuild` holds what one build owns: renderer, scene, camera, cards, textures, frame state, card field, hint, hooks
and the disposer. `destroy()` runs `build.disposer.dispose()` and replaces the object, so a rebuild cannot inherit
per-build state. Add new per-build state to `createBuild`, not as a `let` that `destroy()` has to reset.

- **Cleanup order is load-bearing.** Cleanups run in reverse order of registration, and the renderer registers first
  so that it is disposed last. `renderer.dispose()` clears Three's bookkeeping, so a material or texture disposed after
  it keeps its GPU object.
- **Getters read the live `build`, not a captured one.** A hint font load or texture that lands late compares against
  the current build and drops itself.
- `modal.destroy` and `a11y.teardown` run after the disposer, on the empty build. `modal.destroy(true)` must also run
  for a build that never finished, to remove a modal hoisted out of the block.

## Behaviours

- **Hanging the opening mark** (`hangOpeningMark`): measures the first character with a `Range`
  and sets a negative `text-indent` in `em`; canvas measurement is used when the element isn't laid
  out. It skips centered and non-horizontal text, hangs again once on the next frame if it used the
  canvas, and once when `document.fonts` finishes loading, using the latest gutter it was given.
- **Pull-quote raster text:** each line is drawn with whichever `letter-spacing` (the element's, or
  none) matches the DOM line width. A line that matches neither is drawn word by word from the words'
  DOM rects.
- **Crosshair rules** paint under the text, on the DOM as in the raster. `.globe-pullquote` isolates
  so their `z-index: -1` can't fall behind the block's background.
- **Scroll lock:** `html:has(.globe)` keeps `scrollbar-gutter: stable`; the gutter is painted
  dark while the modal is open.
- **Modal dialog** is `overflow: clip`; only the description (and, on short landscape viewports,
  `.modal-info`) scrolls.
- **Modal phases:** `close` and `navigate` are ignored while `CLOSING`, since navigating would flip back to `OPEN` and
  leave the card in `modalScene`. Starting a nav or a close first finishes any cross-warp in flight.
- **Modal close:** DOM cleanup and the Lenis restart wait for the close animation, because scrolling moves the slot the
  card is flying back to. `open()` cancels a pending cleanup. While browsing, after the native dialog restores opener
  focus, `restoreFocusOnClose` synchronously moves focus to the last-viewed card, so the globe doesn't spin back.
- **Modal uniforms:** `resetModalMaterialUniforms` runs whenever a material is reused, so a mid-fade value can't ghost. It
  leaves `uWarpCenter` alone; callers set that right after.
- **Modal chrome:** elements hold `transition: none` while the reveal writes them each frame, cleared once settled so
  `:hover` animates. The counter's slide keeps its centring `translateX`.
- **Modal gestures:** a swipe commit zeroes `modalWarp` so it can't carry onto the new card. A pull-to-close applies the
  dragged offset and scale to the mesh, so the fly-back starts from where the finger left it.
- **Shaders:** `ShaderMaterial` ignores `texture.repeat` and `texture.offset`, so `uRepeat` and `uOffset` apply the cover
  crop by hand. Card and modal fragments flip `uv.x` on back faces so the back reads like the front. `HASH21` scales its
  inputs first to avoid precision loss at large coordinates.
- **Hint plane:** the text auto-scales to `HINT_FILL` of the canvas width, capped by a height budget. Its creation runs in
  a two-argument `then`, so a throw inside it doesn't reach the rejection handler.
- **Hover:** `hoverTarget` is only rewritten on `pointermove`, so `updateCardHover` forces it to 0 when the globe isn't
  live; otherwise a parked pointer would hold its hover while the page scrolls past the cue.
- **Touch drag:** until the axis latches horizontal, `onPointerMove` doesn't advance `lastMX`, `lastMY` or `lastMoveT`, so
  neither the travel nor the elapsed time is lost.
- **Spin toggle:** the paused state lives in `createGlobeControls`, so it survives rebuilds.
- **Reduced motion:** the scroll pin applies to the clocks only. Canvas visibility still reads real scroll.
- **Focus ring:** `.globe-a11y-card` defaults to the viewport centre, so the frame before the first `setFocusRect` lands
  near the image.
- **CSS:** `overflow-x: clip` on the block root stops sticky descendants creating a horizontal scrollbar. Modal panels set
  their own `box-sizing`, since Milo has no global border-box reset.
