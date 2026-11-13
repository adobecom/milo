# Shared globe layer

Code shared by `libs/c2/blocks/firefly-globe` and `libs/c2/blocks/globe-gallery`. Each block is one entry file
holding its authoring, its timeline and its `spec`; everything else is here. This README is the spec for the shared
modules; each block's README covers only what that block adds.

Files ship unminified, so code comments are kept to contracts and hazards at the line an edit would break. Documented
here: current behaviour that the code alone doesn't make obvious. No history, no rejected alternatives.

| File | Holds |
| --- | --- |
| `core.js` | Easings, `seededRandom`, `clamp01`, camera/clock math, `cylinderMasonryLayout`, `fibSpherePos`, `createDisposer` |
| `runtime.js` | `initGlobeBlock`, `createGlobeRuntime` (lifecycle, `tick`) and its parts: scroll reader, orientation, card slots, card field, hint text |
| `gl.js` | Shaders, card/modal/text materials, texture and hint-font loaders |
| `interaction.js` | Pointer drag, click-vs-drag, raycast hover, a11y gallery, globe controls, cursor label |
| `authoring.js` | Common row parsing, `scatterCards`, `hangOpeningMark`, DOM skeleton, `loadGlobeStyles`, `onRemoved` |
| `globe.css` | Styles shared by both blocks |
| `modal.js` | Card-detail modal |
| `quote-particles.js` | Pull-quote particle transition, near-camera scatter and `createPullQuote` |

`libs/deps/three.js` exports only the symbols listed in `build/three.js`; a missing one is `undefined` at runtime. After
adding a `THREE.*` call, add the symbol there and run `npm run build:three`.

## Block hooks

Shared factories take the block `name` only where it feeds `daa-ll` labels or lana tags.

- `spec`, passed to `initGlobeBlock`: `name`, `breakpoints` (each band's fields land on `bp` as-is), optional
  `bpExtras(cfg, nTotal)` for derived `bp` keys, `timeline`, `pullQuote` and `modal` options, `cardImageUrl(meta, cap)`,
  `modalImageUrl(meta, cap)`, `parseContent(el)`, `buildDom(el, content)`, `loadCards(content)` and
  `createHooks(ctx)`.
- `initGlobeBlock` calls `parseContent` then `buildDom` synchronously, before anything awaits, so the authored rows are
  read before `buildDom` replaces them. `buildDom` returns the `gid`. `loadCards` returns the cards, or null after
  logging why; `content` is also what the runtime receives as its options (`labels`, `hintText`, `instructions`, …).
- `createHooks(ctx)` returns the block's choreography and runs once per build, so its closure state lasts one build.
  It must not read `ctx` while creating the hooks, only when they are called. `ctx.disposer.add(fn)` registers cleanup.
  `entryCamZ`, `viewOffsetY` and `browseScrollTop` are required.
  Optional: `activeCamera`, `fillFrameInput`, `beforeBuild`, `onCameraReady`, `onResize`, `onCardsBuilt`,
  `beforeFrame`, `beforeCards`, `afterFrame`, `hintSphereDist`, `cardPhase` and `placeCard`. `cardPhase(card, i, frame)`
  returns the card's phase for this frame; its `baseCA` adds to the card's chromatic aberration, and the whole object is
  passed to `placeCard(card, mesh, i, frame, phase)`. Without `placeCard`, a card is placed on the sphere and ordered by
  depth.
- `timeline`: `createFrame`, `createFrameInput`, `deriveFrame`, and `TRAVEL_EASE_POW` (the travel camera is `camZAtT` / `tAtCamZ` from `core.js` at that power).
  `createBaseFrame` in `core.js` lists the frame fields the runtime reads. Anything else on the frame is the block's own.
- `ctx` is one read-only view of the instance and the current build: `bp`, `W`, `H`, `navH`, `scene`, `renderer`,
  `camera`, `sphereGroup`, `cards`, `field`, `frameInput`, `disposer`, `drag` and the card content
  (`count`, `cardOrder`, `cardMeta`, `authoredNo`, `stepCard`). The hooks, modal, pull quote, interaction, controls,
  cursor, a11y, orientation, card field and hint read state from it and are handed callbacks only for actions. A module that outlives a build reads `ctx` when called,
  never caches a build object.
- `spec.pullQuote`: `requireOnSphere` and `manageCanvas` are gallery's options.
- `spec.modal`: `renderContent(targetEl, meta)` returns `{ descEl, speech }` (`speech` is `[text, lang?]` parts
  announced before the position). `hoistToBody` moves the modal and its canvas to `<body>`; `bodyOpenClass` also flags
  `<body>` while open; `tracksCanvasTop` offsets the modal by the world canvas's top.
- `buildGlobeSkeleton`: `labels`, `touchHint`, `pullQuote`, `modalInfoHtml(gid)`, optional `arcCopyHtml`. It mints the
  per-instance `gid` suffix, the only thing that makes ids unique; everything else is found by class within the block
  root, so two globes can share a page. Canvas placement is CSS (`.globe-canvas`, `.globe-modal-canvas`).

## Two lifetimes

`createGlobeRuntime` lives as long as the block: content, DOM, `bp`, measurements, orientation, pull quote, modal,
a11y, controls, cursor and interaction.

`createBuild` holds what one build owns: renderer, scene, camera, cards, textures, frame state, card field, hint, hooks
and the disposer. `destroy()` runs `build.disposer.dispose()` and replaces the object, so a rebuild cannot inherit
per-build state. Add per-build state to `createBuild`, not as a `let` that `destroy()` has to reset.

- **Cleanup order is load-bearing.** Cleanups run in reverse order of registration, and the renderer registers first
  so that it is disposed last. A material or texture disposed after `renderer.dispose()` keeps its GPU object.
- **Getters read the live `build`.** A hint font or texture that lands late compares against the current build and
  drops itself.
- Per-build `setup()` calls (interaction, cursor, controls, a11y, hint, pull quote) register their own listeners and reset on
  `ctx.disposer`, so they have no `teardown` to call. `modal.destroy` runs after the disposer, on the empty build;
  `modal.destroy(true)` must also run for a build that never finished, to remove a modal hoisted out of the block.
- **`destroy()` must not `forceContextLoss()`.** The canvas element is reused across rebuilds, and a force-lost context
  never restores.
- A rebuild (band crossing, reduced-motion toggle, context restore) resets orientation, drag and nudge to upright, and
  closes an open modal without reopening it. The spin toggle's paused state survives.

**Context loss.** Both canvases listen for `webglcontextlost` / `webglcontextrestored`. Lost stops the ticker; restored
rebuilds through the same path a band crossing uses. The two canvases' restore events coalesce into one rebuild
(`ctxLoss.recovering` plus a macrotask). Past `MAX_CONTEXT_REBUILDS` the block collapses to `.globe-empty`; the count
resets once a rebuild survives `CONTEXT_STABLE_MS`. To test: `const x = document.querySelector('.globe-canvas')
.getContext('webgl2').getExtension('WEBGL_lose_context'); x.loseContext(); setTimeout(() => x.restoreContext(), 1000);`

A failed `WebGLRenderer` creation, no cards, or no canvas also collapses the block to `.globe-empty`.

## Frame loop

`tick()` runs fixed stages. `computeFrame` fills the persistent `frameInput` and calls the block's pure
`timeline.deriveFrame`, which writes every clock onto the persistent `frame`. Stages read `frame` and producers write
back to it (`activeCamera`, `sphereRotActive`, `sphGroupZ`). Both objects are allocated once; read clocks from `frame`,
never cache them. `prevScrollY` / `prevNow` are the only inter-frame state, re-baselined in `startTicker` so a resume
doesn't spike `scrollVel` or `dtScale`.

- **Stage order is load-bearing.** `modal.updateAnimation` reads this frame's `rotQuat` with last frame's group position;
  `updateA11yFocusRing` must run after the card transforms; `hint.update` advances `exitT` before reading it.
- **Everything per-frame is scaled by `frame.dtScale`** (real frame time over `FRAME_MS`, clamped to
  `DT_SCALE_MIN`/`DT_SCALE_MAX`), in one of three forms:

  | Form | Applies to |
  | --- | --- |
  | `rate × dtScale` | velocity and spin integration, `REVEAL_RATE`, `MASONRY_MORPH_RATE`, `HINT_EXIT_RATE`, `nudge.frame` |
  | `1 − (1 − rate) ** dtScale` | `HOVER_RATE`, `SPHERE_DRAG_WARP_EASE` |
  | `rate ** dtScale` | `DRAG_FRICTION`, `PITCH_RELAX`, `DRAG_CATCHUP`, `MODAL_WARP_DECAY` |

- **Ticker gating.** rAF runs only while `renderReady` (cards built) and `onScreen` (an `IntersectionObserver` with a
  one-viewport vertical `rootMargin`). Stopping it also hides the canvas: a paused globe's canvas would otherwise keep
  catching pointer events. Stopping drops drag inertia.
- **Zero-box gate.** `initRuntime` waits on a `ResizeObserver` while `root.offsetHeight <= 0`. Milo keeps a section
  `display: none` until its blocks and their stylesheets load, so a box also means the block CSS is applied. Measuring
  before that collapses `blockDocTop` onto the scroll position and saturates the clocks. Page-level webfonts are not
  covered, which is why the hint and the pull quote wait on `document.fonts`.

### Scroll input

`readScrollY()` uses `lenis.animatedScroll` while Lenis is smoothing and agrees with `window.scrollY` within
`LENIS_TRUST_PX`. Otherwise (touch, no Lenis, a stopped Lenis) it reads `window.scrollY` through `deQuantize`: iOS
reports whole-pixel positions late in momentum, which the phases amplify into shake. The filter blends by
`mag / (mag + SCROLL_LAG_PX)` and passes jumps over `SCROLL_JUMP_PX` straight through, so programmatic scrolls land in
one frame. Lenis motion outlives the DOM scroll, so the block keeps settling briefly after the page stops.

### One viewport height

`H` is `.globe-world`'s `offsetHeight` (`measureViewportH`, floored at 1), never `window.innerHeight`. Renderer, both
cameras and every clock read it. `.globe-world`'s height is in `vh`, which resolves against the large viewport and
doesn't move with the iOS URL bar, so a bar move is a no-op (`doLayout` exits on unchanged `W`/`H`). Reading
`innerHeight`, or switching to `dvh`, re-fits the scene mid-scroll.

CSS units: vertical lengths use `vh`; horizontal ones use `%` (`vw` includes the scrollbar gutter). `dvh` is used only
by the modal chrome, which must stay reachable and can't affect the timeline because the modal locks scroll.

### Layout and rebuilds

`doLayout` runs on resize, on body resize (`ResizeObserver`), and on a reduced-motion `change`. It reads the CSS vars and
measures the block first, then returns early when `W` and `H` are unchanged (resize paths only). A band crossing or a
reduced-motion change rebuilds; otherwise the renderer, camera and hint resize in place. `setPixelRatio` runs only when
the DPR changed, since it reallocates the drawing buffer. The hint rebuild is debounced only while the hint is hidden.

`readCssVars` keeps the previous value when a property doesn't resolve, so a value is never `NaN`. Every division in
the clocks is guarded, so 0 is safe; keep new divisions guarded.

| Read by JS | Where | Notes |
| --- | --- | --- |
| `--globe-formation-vh` | `readCssVars` | gallery's formation length |
| `--globe-travel-vh` | `quote-particles.js` | camera travel length with the quote particles on |
| `--globe-nav-h` | `readCssVars` | the one `@property` (`<length>`), so `getPropertyValue` returns a length instead of a `calc()` string |
| `--globe-modal-anim-ms` | `modal.setup` | unitless; CSS multiplies by `1ms` |
| `--globe-pq-ink`, `--globe-pq-rule-color`, `--globe-crosshair-width` | `quote-particles.js` | raster matches the DOM |

JS writes only measured or derived values: `--globe-pq-height`, `--globe-pq-rail-h`, `--globe-pq-dom` and the modal's
`--globe-modal-anim-ms` copy. State changes are classes; CSS owns the values.

### The nav band

The sticky gnav covers the top `--globe-nav-h` of the viewport. The scene runs under it; "centred" means centred in the
band below it (`--globe-optical-center`). `--globe-nav-h` is a `calc()` of `--gnav-height-nav` and
`--feds-breadcrumbs-height` with measured fallbacks. Neither var is defined in `libs/` today, so the fallbacks apply;
re-measure them if the nav changes height. Don't use `--feds-height-*`: they are always defined and don't match the
painted nav. The `@property` `initial-value` must equal the fallback sum and can't be a `calc()`.

- **WebGL centring is a projection skew**: `camera.setViewOffset(W, H, 0, -offY, W, H)` from the `viewOffsetY` hook. It
  translates the image only. Anything measuring the scene in screen px must `project()` rather than rebuild the frustum
  by hand. `appliedViewOffsetY` only elides redundant writes.
- **The modal renders through the main camera**, skew included, so the fly lines up between the two renderers.
  `computeModalTarget` lifts the modal photo by the skew so it centres on the viewport. Changing the main camera's
  `aspect`, `fov` or position breaks the modal; a skew is safe.
- `updateA11yFocusRing` calls `camera.updateMatrixWorld()` before projecting, because the camera moved earlier in this
  tick.
- Reduced motion sets `--globe-nav-h: 0`, which clears the offset and every CSS consumer.

## Cards

### Order

`scatterCards` permutes the authored cards once with a seeded Fisher-Yates, so the order is the same for everyone. A
card's array index is its display index (placement, depth, column); `authoredIndex` is its authored position, which
drives everything a reader counts: modal prev/next (`stepCard`), the "n of N" (`authoredNo`) and a11y tab order. The card
order and the sphere roll each seed their own generator from `GLOBE_SEED` (`core.js`); `PARTICLE_SEED` (quote particles)
and gallery's seeds are separate. Generators are created per build, so a rebuild is identical.

### Layout: sphere or barrel

`usesCylinderGeometry` picks the barrel for `sm` width or a coarse primary pointer; `bp.CYLINDER` carries it. Pointer
precision is read once per build, so a mid-session mouse/touch swap needs a reload; a width crossing rebuilds.
`sphereSlots` and `barrelSlots` each return per-card `{ pos, quat, sX, sY, worldH }`. `YAW_ONLY_GEOMETRY` (`core.js`)
supplies the barrel's `CYL_*` defaults, which a band can override (sm sets `CYL_COLS_FIT`); its `CARD_FACE_CAMERA`
replaces the band's on the barrel only.

`bp.CYLINDER` gates: drag pitch (yaw-only for every pointer), keyboard and modal centring (yaw-only), the WebGL hint
plane and the cursor label (sphere only), the barrel's rotate row (`.globe-barrel`), and the texture-landing path.

- **Sphere**: cell-centred Fibonacci slots, sorted by `z` so index equals depth rank. No slot lands on ±Y, where
  `lookAt` with a world up degenerates. Each card gets a seeded roll (`CARD_ROLL_JITTER`). Sizing is equal-area
  (`sphereCardScale`: `sX = √(aspect / CARD_ASPECT)`, `sY = 1/sX`), applied again in `updateCardSphereSizing` when a
  texture lands.
- **Barrel**: `cylinderMasonryLayout` packs columns of equal width with heights from each image's aspect.
  - Column count is the fewest columns whose tallest fits `CYL_COLS_FIT` of the frustum height; sm overrides it.
  - Packing seeds longest-first, then swaps pairs while that lowers the sum of squared column loads (`BALANCE_PASSES`).
    Within a column cards sit in index order.
  - `CYL_COL_GAP_RATIO` also sets card width (pitch / (1 + ratio)); `CYL_ROW_GAP_RATIO` is free.
  - `CYL_ASPECT_CAP` clamps the laid-out aspect; past it the card crops. Keep it above the authored aspect range.
  - `CYL_BULGE` curves the wall (`r = R·(1 − bulge·t²)`). Top/bottom clearance is
    `2R(1−bulge)·sin(π/cols) − cardW·cos(π/cols)`; widening cards spends it.
  - Cards aim along the returned surface normal and get no roll.
  - The layout first solves with placeholder aspects, then once all textures land, re-solves and morphs every card to
    its slot (`resolveMasonryLayout`, `masonryMorph`). The sphere resizes cards in place instead.

### Crop

A decode contributes one number, `card.srcAspect`. Every phase calls `applyCardFit`, which derives the cover crop
(`coverFit`) and the corner SDF's `uAspect` from the plane's live scale on the frame it is drawn. Never cache a crop;
it drifts mid-fold. A uniform scale changes nothing, so the md sphere crops nothing. The modal follows the same rule
(`pushModalCoverUV`, from the plane's live aspect), so the crop opens up over the fly.

### Facing

`applySphereFacing` tilts cards toward the camera by `CARD_FACE_CAMERA` (0 on the sphere, small on the barrel), per
frame. The target is `sign(n.z) × viewDir`, faded to 0 across `FACING_EDGE_ON_BAND` so a card doesn't flip at
edge-on. Three call sites must agree or a card snaps: `placeSphereCard`, `snapCardToSphereSlot` and gallery's fold.

### Draw order

`renderOrder` alone decides card order (`CARD_ORDER_BASE` ± `CARD_ORDER_STEPS` from rotated `z`); live depth never
does. A near-half card with `hoverT` above threshold moves into the `HOVER_ORDER_STEPS` slots above the depth band, scaled
by `hoverT`. The hint plane is below every card (`TEXT_ORDER`). This relies on `|z| ≤ SPHERE_R`: the barrel is yaw-only,
so its slots stay within their ring; enabling barrel pitch would need a wider band.

### Near-camera fade, drag flip and the cue

- **`fadeRefH`** is the mean card world height, written only by `recomputeDragFlip` (at build, when textures land, and
  when the morph ends). The fade bands off this one wall-wide height (`NEAR_FADE_START` / `NEAR_FADE_END`), so the
  nearest card goes first. `cardVanishDepth()` = `NEAR_FADE_END × fadeRefH`.
- **`dragFlipZ`**: once the camera is inside the shell (`scrollT > 0` and `|z| < dragFlipZ`), drag and rotate directions
  invert. It is the largest radial distance plus the vanish depth, scaled by the group scale and capped at
  `DRAG_FLIP_MAX_CAM_FRAC × CAM_Z_SPHERE`.
- **`pqAppearT`** is the `scrollT` at which the deepest card has left the screen:
  `tAtCamZ(−SPHERE_R + cardVanishDepth())`. It feeds the pull-quote cue (`setCue`), the hint-text fade and the
  canvas hide. Before cards exist `fadeRefH` is 0, which errs late.
- While the quote particles are on, cards behind the centre plane keep full opacity: the particles are the far side's
  only break-up. Near-side cards burst into tiles across the near band (`createCardScatter`, one `Points` draw per
  card, tile progress = the card's own dissolve, so it reverses with scroll).

### Textures

Cards render as SDF contours until their photo lands, then un-dissolve (`revealT`). `loadCardTextures` reports per image
and once all settle; results for an old build are disposed. Photos go through `createImageBitmap` with the flip baked in
(`imageOrientation: 'flipY'`, `texture.flipY = false`); a tainted or undecodable image falls back to a solid colour.

Caps are load-bearing on iOS, where an uncapped set kills the tab. Cards cap on height (`bp.CARD_TEX`) and request by
height; the modal loads its own texture lazily, capped on the longest side (`bp.MODAL_TEX`), at most one resident: a
decode that lands after its request was superseded (another card, or the same card reopened) is disposed. Both
come from `BAND_RENDER`. A texture costs `w × h × 4 × 4/3` bytes regardless of file size.

The hint texture's `onUpdate` frees its canvas's 2D backing store after upload. That is safe only when exactly one
renderer uploads the texture, nothing sets `needsUpdate` later, and nothing reads `texture.image` dimensions later. Only
the hint texture qualifies. Card textures don't, because the modal renderer uploads them too.

## Orientation and drag

- **Clamped Euler.** `orient` is pitch `x`, yaw `y` and a keyboard-only roll `z`; `rotQuat` is rebuilt from it each
  frame with order `'XYZ'` (pitch outer, which avoids a gimbal flip). Yaw is free; pitch is clamped to
  `pitchReleaseCap`, normally `RESTING_PITCH`, so the globe self-levels and roll returns to 0 with pitch.
- **Keyboard centring** (`centerCardOnScreen`) eases to the orientation that makes the card's world quaternion
  identity, centring and uprighting it, and may pitch up to `KEY_PITCH_CAP`. After browse ends, `pitchReleaseCap` and
  roll ease back (`PITCH_RELAX`). `snapPending` solves from outside the sphere, where the focus snap lands.
- **Modal traversal** (`centerModalCard`, on prev/next/swipe, not on open) centres the viewed card behind the modal so
  close returns it to centre; pitch caps at `RESTING_PITCH` and there's no roll. A keyboard-opened modal uses
  `centerCardOnScreen`. Inside the globe the target flips to the far wall.
- **Nudges** are one frame-counted `easeInOutCubic` tween (`KEY_BROWSE_FRAMES`, `KEY_MODAL_FRAMES`,
  `ROTATE_STEP_FRAMES`); reduced motion lands them instantly. `nudge.kind` records who armed it; leaving browse cancels
  only a `'browse'` nudge, because a rotate press collapses browse in the same turn it arms its own.
- **Rotate step** eases to the next column boundary, not `y += pitch`. Boundaries are the distinct `yawDeltaToCenter`
  values across cards (`COLUMN_EPS`), so their count is the column count. `ROTATE_DEADZONE` skips a boundary already
  under the camera. A tap during a rotate tween measures from its target, so taps queue. Mid-morph it reads
  `morph.posTo`. Inside the globe `dir` is negated, like drag.
- **Drag while held** is position-driven: `interaction.js` accumulates `pendingX/Y` and the runtime drains it every
  frame (dropping it unless held and live). A step under `MAX_VEL × dtScale` passes through exactly; larger ones are
  capped and eased by `DRAG_CATCHUP`, with the rest banked.
- **Drag release** is velocity-driven: `velX/Y` is an EMA of pointer speed over time (`VEL_SMOOTH_MS`), not per event,
  so momentum doesn't depend on event rate or browser. `endGesture` flushes once more with nothing banked, so a pause
  before lifting decays the fling. `velX/Y` also drives drag CA and warp.
- **Ambient spin** (`AUTO_ROT_SPEED`) is added beside `velX`, never into it, and is off while browsing, under reduced
  motion, or when paused. Inertia keeps coasting below the interactive gate; only `orientReset` zeroes it.
- **Gearing**: `dragSensitivity()` = `(π/2) × DRAG_GEARING` per on-screen ball radius (`SPHERE_R × H / CYL_FRUSTUM_H`).
- **Touch** is yaw-only on the sphere too: a directional axis lock latches from the first `AXIS_LOCK_THRESHOLD` of
  travel (a 45° tie is vertical). Taps don't depend on the lock (`CLICK_MAX_MOVE` is larger). A vertical swipe never
  fires `onDrag`. Gesture ownership is `activePointerId`; `pointercancel` → `cancelDrag` (no tap, no inertia);
  `lostpointercapture` → `endGesture`. Both canvases are `user-select: none` and `-webkit-touch-callout: none`, or an
  iOS long press cancels the drag.

## Interactive gates

- **`globeFormed()`**: `frame.interactive` (the block's `SPHERE_INTERACTIVE_T`) and no modal open. The keyboard path and
  the cursor's live gate use it.
- **`globeLive()`**: `globeFormed()` and `scrollT < pullQuote.liveUntil()` (the hand-off with particles, else
  `pqAppearT`). Drag, tap-to-open, hover and the globe controls use it. Hover is gated in `updateCardTransform`, since
  `hoverTarget` only changes on `pointermove`.
- **`retired`** is a one-way latch set by the first drag (`onDrag`, once per gesture past `CLICK_MAX_MOVE`), a rotate
  press or a card open, but only once `frame.hintRetirable`. It retires the hint plane, the cursor label and the barrel's
  hint copy. Only a rebuild resets it.

### Hint plane

A WebGL "Click & Drag" plane behind the sphere (`TEXT_BEHIND_GAP`, `TEXT_ORDER`), sphere geometry only. Hidden until
`hintEntryT > 0`, it warps in over `hintEntryT`, rests at `TEXT_OPACITY_RESTING` × `1 − scrollT / pqAppearT`, and scales
with the live camera distance (`hintSphereDist`). Once retired, `exitT` runs 0→1 at `HINT_EXIT_RATE` regardless of the
pointer; `TEXT_FRAG`'s alpha reaches 0 exactly where the mesh hides.

- The build waits on both `document.fonts.ready` and `loadHintFont`: `fonts.load` resolves at once on a cold cache.
- A first build that resolves after the entry has started sits out for the session, so the hint never pops in
  mid-entry; reduced motion has no entry and always builds. A rebuild always lands.
- `createClickDragTexture` auto-scales the text to `HINT_FILL` of the width, falls back to `HINT_FALLBACK` when the
  font shorthand doesn't parse, and returns `null` (no plane) if that fails too. Its creation runs in a two-argument
  `then`, so a throw can't re-run it.

### Cursor

The canvas cursor is native: `grab`, `grabbing` while dragging, `pointer` over a card. `interaction.applyCursor()` is the
only writer, diffs its last value, and runs on drag edges and once per frame.

The cursor label (`createCursor`) is a `<body>`-level, `aria-hidden` pill beside the native cursor, on sphere geometry
with `(hover: hover) and (pointer: fine)` outside reduced motion, all checked once at setup. Retiring fades it
(`RETIRE_FADE_MS` must match the CSS); deactivating (modal open, pointer off canvas) snaps it out. Its listeners are on
the canvas; pointer capture keeps coordinates live through a drag. It needs `hasCoords` before showing, so a
`mouseenter` from scroll doesn't flash it at 0,0. It inherits no block vars, so it redeclares `--globe-chrome-blur`.

## Globe controls

A spin play/pause toggle (top inline-end, every shape; hidden under reduced motion) and, on the barrel, a rotate ← /
hint copy / rotate → row. One visibility window for the layer: `globeLive()`. `is-visible` and `inert` flip together.

- Tab order is entry widget → spin → rotate ← → rotate →; `controls.setup()` runs after `a11y.setup()`. Hiding doesn't
  move focus anywhere: the browser keeps the sequential focus start point.
- The spin toggle's `aria-label` and `daa-ll` name the action it performs; no `aria-pressed`.
- A rotate press keeps pitch and roll and doesn't pause the spin.
- The barrel's hint copy fades on `retired` (`.is-dismissed`); the chevrons stay.
- RTL: the rotate arrows don't mirror (they're spatial); `html[dir="rtl"] .globe-hint` uses `row-reverse` to keep the
  row's visual order.
- `--globe-controls-inset` steps with the modal's `--globe-modal-edge`; the spin toggle's top adds `--globe-nav-h`.

## Accessibility

The globe is a two-level gallery of real buttons over the canvas (`pointer-events: none`):

1. **Collapsed**: one entry button, a stable tab stop (out of the tab order only while the modal is open or while
   browsing). Its `.globe-a11y-tip` is both `aria-hidden` and the `aria-labelledby` target, so the instructions are its
   name and the button stays a leaf. Enter/Space enters browse mode.
2. **Browse**: `.globe-a11y-cards` is `inert` unless browsing; that one flag keeps the image buttons out of the tab
   order and the tree. `enterBrowse` and `focusCard` clear `inert` before `focus()`. Tab/Shift+Tab is handled in
   `onCardKeydown` with `focus({ preventScroll: true })`, passing through natively only past either end. Native Tab into
   a descendant of a sticky element scrolls the page. Each focus centres its card; Enter opens it; Esc or tabbing past
   an end collapses. The image buttons' `focusin`, `focusout`, `click` and `keydown` are delegated to
   `.globe-a11y-cards`, so a synthetic event aimed at a button must bubble.

- Focusing the entry or any card runs `snapToBrowseView` to the block's `browseScrollTop`, unless `suppressFocusSnap`
  is armed (window blur or hidden, disarmed a frame after focus) so a tab-return doesn't re-snap. Browsing pauses
  auto-spin.
- The focus ring is the button's own rect, projected each frame; an unprojectable card gets an empty rect
  (`opacity: 0`) and keeps focus. Blurred buttons drop their rect. `.globe-a11y-card` defaults to the viewport centre.
- Card buttons are labelled by alt (`Image N` without one) and carry the prompt or alt `lang`.

### Modal

The chrome is a native `<dialog>` opened with `showModal()`: focus trap, background inert and focus restore are the
platform's. Rules, all checked against VoiceOver and NVDA:

- Focus lands on the name element (`autofocus`, `tabindex="-1"`), never on the `<dialog>`. `open()` doesn't call
  `focus()`; any added `focus()` must stay in the same task as `showModal()`.
- The `<dialog>` has no accessible name. A name must not be card text, or open reads the card twice, and must not change
  per card, or VoiceOver re-announces while NVDA doesn't.
- The position ("N of M") is in two sr-only `.globe-modal-position` spans: an `aria-hidden` one with the id the heading's
  `aria-describedby` points at, and a `role="note"` one between Prev and Next as a VoiceOver cursor stop. One span
  can't do both. The visible counter is `aria-hidden`.
- `role="document"` on the description stops NVDA reading the prose on open. Don't add it to `aria-describedby`; it
  would read twice.
- Prev/Next keep focus on the button; the new card is spoken through `.globe-modal-announce` (`aria-live="polite"`),
  written only on nav and cleared before `showModal()`. It is never cleared on a timer.
- No arrow-key handling, so a screen reader's virtual cursor is never hijacked.
- Esc goes through the `cancel` event (prevented so the close animates). A tap outside the photo closes
  (`backdropTap`); the photo, info scrim, counter and any button or link are exempt, and a moved mouse gesture counts as
  text selection.
- While browsing, `restoreFocusOnClose` moves focus to the last-viewed card after the dialog restores the opener.
- The description is the only scroll region and gets `tabindex="0"` only while it overflows. `.globe-modal-info` carries
  `data-lenis-prevent`, without which Lenis swallows its wheel events.

## Modal

The modal has its own WebGL canvas and scene; its renderer is created on the first `open()` and disposed on `destroy()`.
`MODAL_PHASE` drives open, nav cross-warp and close.

- **Phases**: `close` and `navigate` are ignored while `CLOSING`. Starting a nav or a close first finishes any
  cross-warp in flight. DOM cleanup and the Lenis restart wait for the close animation; `open()` cancels a pending one.
  `close(viaPointer)` ignores a trusted click in the guard window after open (the browser's synthetic click after a
  touch); Escape and pull-to-close go through `clickClose()` and are exempt.
- **Fit**: the photo is contain-fit to the viewport minus `DESKTOP_IMG_MARGIN` (full-bleed with square corners on mobile).
  The corner radius is a constant `MODAL_RADIUS_PX` on screen, so `uRadius` and `uAspect` are re-pushed per frame from
  the displayed texture's aspect (`modalUAspect`: the upgrade's aspect, else `srcAspect`).
- **Uniforms**: `resetModalMaterialUniforms` runs whenever a material is reused. It leaves `uWarpCenter` for the caller.
- **Chrome**: controls are placed in CSS from per-breakpoint constants on `.globe-modal-chrome`; the card is always
  horizontally centred. Elements hold `transition: none` while the reveal writes them, cleared once settled so `:hover`
  animates. Short viewports compress the edge and control size, and the whole info panel scrolls.
- **Gestures** are gated on `(pointer: coarse)`, not width: an axis lock (`AXIS_LOCK_PX`) splits swipe (prev/next,
  warp preview, cross-warp on commit) from pull-down (dismiss, flies back from where it was released). A swipe commit
  zeroes `modalWarp`. A drag starting inside the description doesn't start a gesture.
- **Scroll lock**: `html.globe-modal-open { overflow: hidden }` plus `lenis.stop()`; `bodyOpenClass` also locks
  `<body>`. `html:has(.globe)` keeps `scrollbar-gutter: stable`, painted dark while locked.
- **Stacking**: the `<dialog>` is in the top layer. The backdrop (`.globe-modal`, `z-index` in `globe.css`) and the
  modal canvas (inline `z-index`, one above) are fixed siblings that must cover the gnav (`header.global-navigation`,
  and `header.new-nav:has(.feds-dropdown--active)`) but stay under caas, market-selector, Milo modals and OneTrust.
  With `hoistToBody` both are moved to `<body>` at setup, survive `destroy(false)`, and `--globe-modal-anim-ms` is set
  inline on the moved node.

## Stacking

The block claims nothing at page level: world, arc copy, pull quote and a11y layers paint in DOM order. `.globe-world`
carries a `z-index` that only scopes `.globe-controls` above the a11y layers appended after it. Don't use
`isolation: isolate` there (it would stop the modal backdrop sampling the canvas), and don't put `isolation` or a
`z-index` on the block root (it would trap the modal under the gnav). Any section with a `z-index` (rounded corners,
C2 parallax) covers the block. `.globe-pullquote` isolates so the crosshair's `z-index: -1` stays above the block
background. The cursor label sits above the modal band.

## Pull quote

`createPullQuote` turns the cards into the quote. With no quote, or under reduced motion, it builds nothing and the
figure is static DOM.

**Timing.** `startT` is the hand-off: where the camera is `PULL_BP[band].startR` sphere radii in front of the centre,
capped at `pqAppearT`. There the pointer and controls retire, the spin rests and the flight starts. Flight progress
`p` runs 0→1 over `FLY_VH` viewport heights from `scrollYAtTravelT(startT)`; everything is a pure function of `p`, so
it reverses on scroll-back. Over `HANDOFF_EASE_T` before `startT`, `handoffEase` eases hover and drag warp to 0.

| `p` | |
| --- | --- |
| 0+ | once paired, cards hide and their particles take over, identical on screen |
| `FLIGHT.release` / `.depart` | particles release from the dolly, become dots and depart |
| `arriveStart` → `+ arriveSpan` | landings in reading order (± `ARRIVE_JITTER`), each region turning crisp |
| `QUOTE_LIVE_P` | the quote is the crisp raster; the DOM copy fades in over `SWAP_MS` and the canvas hides |

**Block height.** With particles on, the travel runs over `--globe-travel-vh`, and `syncHeight` writes
`--globe-pq-height` = formation + `startT` × travel + `QUOTE_LIVE_P` × `FLY_VH` + a viewport + `READ_VH`, never ending
before `pqAppearT` + `READ_VH`. It re-solves on layout and when `startT` changes. With particles off the block keeps its
CSS height.

**Mechanism.**
- While `ownsCards()`, orientation is held exactly, so cards return where the particles left them.
- `cardPlanes()` makes each card a world-space plane from its sphere pose; each card is one `Points` draw whose
  fragment ray-casts into the plane and samples the real texture with the card's crop, so the hand-off is pixel-exact.
- `setSources` projects with the runway's canonical camera (`camZAt(zoom, p)`), never the live frame, so a fling and a
  slow scroll get the same layout. The particle budget is shared by on-screen area plus `OFF_VIEW_K` of off-screen area.
- Release is mostly random with a rim lead (`EDGE_LEAD`), and never later than the tile outgrowing `TILE_MAX_K`. A
  released particle keeps the camera's speed and decays to a stop (`RELEASE_REACH`).
- Pairing runs over the frames after the hand-off; until it is ready the cards stay drawn (`isPaired()`).
  `coherentOrder` is a 2D quantile order (`PAIR_BANDS`), softened by `SOFT_Y` noise and `SOFT_SWAP` swaps.
- The swirl is a shared curl-noise displacement (`SWIRL_*`) times `sin(π·t)`, zero at both ends, drifting with `p` only.
- `landingOrders` gives every raster pixel a landing order. Particles and the crisp plane (`uOrder` texture) read the
  same orders, so nothing is kept in step between JS and GLSL. Text lands roughly left to right (mirrored for RTL) by
  `TEXT_END`; the crosshair finishes last, meeting at the bottom-right corner (`RULE_DROP`, `RULE_WEIGHT`).

**Layout.** The DOM figure is the layout engine. `layout` restores the plain quote (`plainQuote`, which hangs the
opening mark) and shrinks the font if the box is taller than the band. After fonts and an idle period it measures one
Range per character, rasterizes each line at DPR with the computed font and `--globe-pq-ink`, adds the crosshair, and
samples targets (alpha ≥ `INK_ALPHA`). Each line is drawn with whichever `letter-spacing` (the element's, or none)
matches the DOM width; a line matching neither is drawn word by word. The figure drops `-webkit-font-smoothing`, the
raster uses the DOM-measured ascent, and positions snap to device pixels. Inputs must hold for `DEBOUNCE_MS` before a
re-raster or re-pair; the old draws stay until the new ones swap in.

**Swap and pinning.** From `QUOTE_LIVE_P` the crisp plane shows without waiting for a pairing, so landing mid-page never
blanks. `--globe-pq-dom` mixes the DOM ink and crosshair in, then the canvas hides; a one-viewport jump skips the tween.
`-pin` covers the block; `-rail` sticks like the world, `--globe-pq-rail-h` tall. With `manageCanvas`, the canvas
switches from `fixed` to `absolute` inside the stuck world once `p > 0`.

**Accessibility.** The canvas has no content. The real `figure > blockquote + figcaption` stays in the tree, transparent
but positioned over the drawn glyphs while the canvas draws it. From `QUOTE_LIVE_P` it takes the pointer.

**Forced colours or no ink**: the figure gets `is-dom` (no particles); the system-coloured DOM text fades in at `is-live`
and the canvas hides at `pqAppearT + CANVAS_HIDE_MARGIN_T`.

**Box.** `.globe-pullquote` is a content-sized `<figure>` whose only vertical knob is `--globe-pq-gap`,
`min(ideal, a fraction of --globe-band-h)`. It centres on `--globe-optical-center` with `translateY(max(-50%, …))`, so it
top-anchors once taller than the band. The crosshair is `::before` (block edges) and `::after` (inline edges), each
spanning the full box so the lines cross. `--globe-crosshair-width` must be a whole pixel value.

**Known limitations**: a card running off screen still converts whole; canvas shaping can differ from the DOM by a pixel
per glyph; `READ_VH` is fixed whatever the quote length; a reload mid-flight shows cards until the raster is ready.

## Hanging the opening mark

`hangOpeningMark(el, room)` measures the first character's advance with a `Range` (canvas when the element isn't laid
out, adding back `letter-spacing`) and sets a negative `text-indent` in `em`. It counts `Ps`, `Pi`, `Pf` and ASCII `"`
`'`. It skips centred and non-horizontal text and any mark at or past the `--globe-hang-max` fraction or wider than the
padding (full-width CJK brackets). It clears `text-indent` before measuring, and hangs once more on the next frame if it
used canvas and once when `document.fonts` finishes, with the latest gutter. `hangParagraphs` hangs every paragraph of
the modal description.

- `--globe-hang-max` is unregistered so its `em` resolves per use site; it must match the literal in `hangOpeningMark`.
- The modal description reserves the gutter as `padding-inline-start` and takes it back as negative margin; its md+ rule
  resets with `margin-block`, since a `margin` shorthand would zero the gutter.
- Don't add `hanging-punctuation`: WebKit hangs some marks natively and would double-outdent them.
- `plainQuote` trims `textContent`; the `ctx.font` readback guards an unparseable shorthand.

## Authoring rows both blocks share

Parsed by `parseCommonRows`; each block documents where these rows sit.

| Row | Content | Fallback |
| --- | --- | --- |
| Hint | two cells: the barrel's bottom-row copy (its `<p>`s kept, one per line), then the "Click & Drag" text (joined to one line) | `DEFAULT_TOUCH_HINT`, `DEFAULT_HINT` |
| A11y | one cell, `\|\|`-separated: instructions, rotate left, rotate right, pause spin, resume spin, prev, `{index} of {count}`, next, close | each part → `DEFAULT_GALLERY_INSTRUCTIONS` / `DEFAULT_LABELS` |
| Pull quote | `<blockquote>` or heading, then name and role paragraphs | none: no figure |

The position template falls back to `{index} of {count}` when either token is missing. No user-facing copy is
hardcoded beyond these fallbacks.

## Analytics

Every interaction is a `daa-ll` on a real element; there is no custom analytics code. Actions without a DOM click of
their own (canvas card tap, swipe, pull-down, Escape) call `.click()` on the control that means that action; DAA
doesn't check `isTrusted`.

- A canvas tap calls `a11y.trackCardOpen(idx)`, which clicks that card's button. Only the canvas path does this; a
  keyboard open is already a real click.
- `onCardClick` ignores untrusted events, so the report-only click doesn't reopen the modal. Tests must use a real
  click API, not `el.click()`.
- Every card button has the same `card_open--<name>`; the entry widget has `enter_gallery_kbd--<name>`; the spin toggle
  swaps `pause_spin` / `resume_spin`; rotate is `rotate_left` / `rotate_right`. Modal controls are
  `prev_card-1`, `next_card-2` and `close-3`, all `--globe_card_modal`.
- `processTrackingLabels` hard-slices each `-`-separated segment to a fixed length (`libs/martech/attributes.js`);
  check new labels against it.
- Don't add `daa-lh` in the block: it makes `decorateSectionAnalytics` skip the whole block.
- A real click on a button whose handler declines (globe not formed) still reports.

## Reduced motion

`prefersReducedMotion()` (the media query, or a short high-density viewport) is read per build, and a `change` rebuilds.
The clocks pin scroll to the formed position (canvas visibility still reads real scroll); auto-spin, hover effects, the
pull-quote particles and the cursor label are off; drag and the rotate row work; nudges and the modal land instantly
(the modal reads it through a live getter). `.globe-reduced` un-sticks `.globe-world` and keeps its height, and
overrides only `position` on the viewport-sized boxes plus `--globe-nav-h: 0`. On md the sphere group scales by
`RM_GLOBE_SCALE_MD`.

## Styles

`globe.css` holds every shared rule, root box and `-reduced` / `-empty` states included. `loadGlobeStyles()` starts it
first in `initGlobeBlock`, which awaits it on every path before returning; Milo keeps the section `display: none` until
every block's `init` resolves, so it is always applied before the block first paints. Block CSS keeps only its runway
vars and block-specific rules, scoped under the block root. A block rule overriding a shared one must out-specify it;
load order isn't guaranteed. Within `globe.css`, min-width media queries for one property stay in ascending order.

- The root keeps its block class; everything inside, and every state class, uses `globe-`. The skeleton adds `globe` to
  the root, which carries the root box and shared vars (`--globe-copy-pad`, `--globe-crosshair-width`, …). Custom
  properties are all `--globe-*`.
- Values on an S2A scale use the token; sizes tied to a design measurement stay literal (counter pill, scrim, badge
  icons, control radii, the `--globe-nav-h` fallbacks). One token name has an underscore, so `custom-property-pattern`
  is disabled on that line only.
- CSS is mobile-first. `--globe-copy-pad` steps at the md grid breakpoint and the `xl` token tier.
- `overflow-x: clip` on the root stops sticky descendants causing a horizontal scrollbar. Modal panels set their own
  `box-sizing`; Milo has no global reset.
- Typography uses Milo's S2A classes (`heading-1`, `body-lg`, `body-md`); block CSS adds only family, weight, colour and
  margins.

## Shaders

`ShaderMaterial` ignores `texture.repeat` / `offset`, so `uRepeat` / `uOffset` apply the crop by hand. Card and modal
fragments round corners with one SDF over the full plane (`rrSDF`), so the plane edge is the photo edge, and flip
`uv.x` on back faces. `HASH21` scales its inputs first to avoid precision loss. `createCardMaterial` proxies `opacity`,
`map` and `needsUpdate` onto uniforms.

## Tests

`@web/test-runner` + chai + sinon (`npm run test:file -- <path>`). Shared suites: `test/utils/globe/authoring.test.js`,
`core.test.js`, `runtime.test.js` (`stepOrientation`, the scroll reader) and `quote-particles.test.js` (run once per
block with its `easePow` and stylesheet). Block suites are listed in each block's README.

- Modal suites run without WebGL: fixtures omit `.globe-modal-canvas`. `close()` defers cleanup, so use
  `sinon.useFakeTimers()`; `close(true)` is a no-op inside the open guard.
- `libs/deps/three.js` has no `MeshBasicMaterial`; build test meshes with `createCardMaterial`.
- `scrollTop` doesn't stick on an unlaid-out element; overflow-fade cases define it with `Object.defineProperties`.
- Per-frame values are left unasserted so tuning doesn't break the suite. There is no Nala/E2E for the WebGL path.
