# globe — C2 block

A scroll-driven **Three.js WebGL** hero. Status: **work in progress** — ported
and running in a real Milo page. Core arc→grid→sphere→zoom is the v1
target; modal, a11y gallery, and chromatic aberration (CA) are fast-follow.

## What it is

Over a tall, pinned scroll range (`--runway-height` in the CSS), 45 photo cards animate
through four phases:

```
0.00–0.55  Arc       cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5 grid (staggered)
~0.37–0.78 Sphere    each card folds onto a fibonacci sphere as it lands
0.78–1.00  Zoom      a perspective camera flies through the sphere
```

Once the sphere forms (`sphereFormT >= 0.8`) it's **interactive**: drag to spin,
tap a card to open a detail **modal** (separate WebGL canvas + HTML chrome).
Extras: per-frame chromatic-aberration SVG filter, a fixed arc-copy overlay, a
fixed pull-quote that fades in near the zoom end, a WebGL **"Click & Drag" hint
text** behind the sphere (warps in on fold, dissolves away on first drag — see
Behavior notes), and a single focusable a11y **globe widget** (see Accessibility
below) that exposes the sphere as one keyboard/screen-reader gallery rather than a
per-card list.

## Files

| File | What it is |
| --- | --- |
| `globe-gallery.js` | The block + sphere render core. `export default init(el)` → builds DOM, runs the runtime (`createGlobeGalleryRuntime()` → `{ init, destroy }`). Holds tuning constants + pure helpers (module scope) and the stateful core (arc/grid/fold/sphere placement, drag-rotation physics + the nav-nudge spring, lifecycle). `tick()` is a thin orchestrator calling one named stage per concern (`computeFrame`, `updateActiveCamera`, `updateSphereRotation`, `updateCardTransforms`, `renderScene`, …) plus `modal.*` and `a11y.*`. The per-card placement is a dispatcher (`updateCardTransform`) over four runtime-scope branch fns (`placeSphereCard`/`placeFoldingCard`/`placeGridCard`/`placeArcCard`) fed a per-frame `frame` context. Instantiates the `modal`/`a11y`/`interaction` DI modules and injects live runtime state into them. |
| `authoring.js` | Authoring layer: `parseAuthoredContent` + `fetchFragmentCards` + `buildGlobeDom(el, labels, { arcCopy, pullQuote })` (+ internal parsers, `APP_CATALOG`). Reads the block rows positionally (arc-copy, cards, hint text, pull-quote), fetches the card fragment, and builds the canvas/overlay/modal DOM — minting + returning the per-instance `gid` id suffix and filling the arc-copy / pull-quote slots. |
| `shaders.js` | GLSL strings: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`, `TEXT_FRAG`. The card/modal frag shaders round their corners with the same analytic SDF (`rrSDF`) — `uRadius` (22/631 of height) + `uAspect` (world-space width/height), no rasterized mask. `TEXT_FRAG` (the "Click & Drag" hint, on `CARD_VERT`) is a simplified variant: centered barrel warp + per-pixel particle dissolve + the `uExitP` one-way exit. |
| `textures.js` | `loadCardTextures` (default export) — loads each card image into a cover-cropped `CanvasTexture`; `createClickDragTexture(aspect, hintText)` (named) — renders the authored hint string (font auto-scaled to fit; defaults to "Click & Drag") to a `CanvasTexture`. No per-instance state. (Rounded corners are no longer rasterized here; the card shader computes them.) |
| `materials.js` | Pure material factories: `createCardMaterial` (the card ShaderMaterial — texture cover-crop + optional CA/warp + SDF rounded corners, with the property-proxy), `createModalMaterial` (the modal SDF material), and `createTextMaterial` (the hint-text `TEXT_FRAG` material — driven entirely by uniforms, no proxy). |
| `a11y.js` | `createGalleryA11y(deps)` DI factory → `{ setup, updateTabStops, teardown }`. Exposes the globe as **one** focusable widget (a transparent centered `<button>` over the sphere): a stable tab stop (out of tab order only while the modal traps focus), Left/Right arrows → `spinGlobe`, Enter/Space → `openModal` (first item), and `onFocus` snaps the page to the interactive state (pdf-space pattern). All runtime state (`count`, `sphereFormT`, modal-open) + actions (`spinGlobe`, `openModal`, `onFocus`) are injected; holds no globe state except its own DOM node. |
| `modal.js` | `createGlobeModal(deps)` DI factory → `{ setup, resize, render, updateAnimation, updateDesktopNav, open, navigate, close, getModalIdx, isCardManaged, destroy }`. The card-detail modal: its own WebGL canvas/scene, the `MODAL_PHASE` open/close/navigate state machine, SDF material swap, desktop cross-warp nav, mobile swipe/pull gestures, chrome layout. Owns all modal tuning constants. Sphere coupling is injected and narrow: the shared `sphereRotEuler`/`sphereRotQuat` objects (read by the closing anim) + `snapToSphereSlot` / `requestNavNudge` / `applyMotionCA` callbacks (which keep `sphereRotX/Y` + the nav-nudge spring in core). |
| `math.js` | Shared pure helpers used by both core + modal: `easeOutCubic`, `easeInOutCubic`, `easeOutSine`, `lerpN`. |
| `arc.js` | Pure arc-phase geometry (stateless): `arcRotationEase`, `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ`. The fanned-arc layout + the CSS↔WebGL coordinate bridge. Derives everything from the viewport (W, H), `ARC_SPAN`, and the per-frame `arcCtx` the core owns (rebuilt each frame, threaded back in). |
| `interaction.js` | `createInteraction(deps)` DI factory → `{ setup, teardown }`. Canvas pointer/mouse plumbing: drag-to-spin input, click-vs-drag discrimination, raycast picking for hover (cursor + per-card hover state) and click → modal. Owns its listeners + raycaster; reads live state via getters. Drag velocity is shared with the core sphere stage by reference through the `drag` object (`{ isDragging, velX, velY }`) — interaction writes it from pointer deltas, `updateSphereRotation` reads + decays it. Defers its hover cursor (pointer/default) to the custom cursor via the injected `isCursorActive()`. |
| `cursor.js` | `createCursor(deps)` DI factory → `{ setup, update, teardown, isActive }`. The desktop "Click & Drag" custom cursor (`(hover: hover) and (pointer: fine)` only; no-op on touch). Builds two body-level layers — a `mix-blend-mode: difference` disc (direct body child, so it inverts page content) + a fixed container with squeeze-on-drag chevrons and a label. `update()` (per frame) toggles shown/dragging state from injected getters (`getSphereInteractive`, `getModalOpen`, `getReducedMotion`, `drag`) and follows the pointer; `isActive()` lets interaction.js cede the canvas cursor. Owns its DOM + `mousemove`/canvas listeners; `teardown()` removes them. Label copy is the authored hint string (`deps.labelText`, shared with the WebGL hint text; see Localization). |
| `globe-gallery.css` | Globe-only CSS. Also defines `.globe-gallery`-scoped type-scale tokens (see Behavior notes). |
| `three-src.js` | Build entry — re-exports only the Three.js symbols the block uses. |
| `three.module.min.js` | Tree-shaken Three.js r160 ESM build (~453KB). Build artifact — do not edit. |
| `package.json` | Local mini build. `npm install && npm run build` regenerates `three.module.min.js`. |
| `hub-creative-v3/index.html` | The current-target prototype (self-contained, full page). **Design/source reference for porting.** |
| `hub-creative-v1/`, `hub-creative-v2/`, `hub-creative-v3/` | Original prototype source (read-only reference; **git-ignored** via `.gitignore` `hub-creative-v*`, so not shipped or linted in CI). **`v3` is the newest design reference** — the source for the now-shipped shortened grid phase, WebGL "Click & Drag" text, and desktop custom cursor; `hub-creative-v3/CHANGES.md` explains the design intent if you're tuning them. |

Registered as `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js`). The prototype dirs
are git-ignored; `three.module.min.js` is eslint-ignored.

All eleven shipped JS files (`globe-gallery.js`, `authoring.js`, `shaders.js`,
`textures.js`, `materials.js`, `a11y.js`, `modal.js`, `math.js`, `arc.js`,
`interaction.js`, `cursor.js`) are **airbnb-clean**
(`npx eslint` exit 0). The only exception is 1 targeted
`// eslint-disable-next-line no-use-before-define` comment in `globe-gallery.js` for a genuine
forward ref (`doLayout` → `destroy`, a mutual reference). No blanket `/* eslint-disable */`.

### Module layout (post-refactor)

`globe-gallery.js` is organized top-down: (1) module-scope tuning constants grouped by
`// ── Section ──` (layout/breakpoints, phase timeline, entry, grid, drag, CA,
hover, nav-nudge) — the core's tuning surface; (2) the domain helper `fibSpherePos`
(generic easings + `lerpN` live in `math.js`; the arc-phase geometry lives in
`arc.js`); (3) `createGlobeGalleryRuntime()` — the
per-instance closure holding sphere state + behavior. The active breakpoint's
resolved render profile (card count, sphere radius, grid dims, camera Z, …) is one
frozen `bp` object built by `resolveBpProfile()` on each (re)init; functions
destructure what they need from it at their top (`const { N_TOTAL, SPHERE_R } = bp;`),
the DI getters read `bp.*` live. Inside the closure the
**per-frame pipeline** is a sequence of small single-concern stages run in a fixed
order by `tick()`. `computeFrame()` builds one per-frame `frame` context (scroll +
phase t-values + card-entry transforms); each stage reads what it needs from `frame`
(destructured at its top) and the producer stages write their result back onto it
(`activeCamera`, `sphereRotActive`, `sphGroupZ`), so the same object flows through to
the card loop — one context, not several. The per-card placement (the largest stage) is a dispatcher over four
runtime-scope branch fns fed an explicit per-frame `frame` context — kept in this
file, not a module, because they read deeply from the closure (BP constants,
sphere-rotation quats, drag velocity) and run in the per-card hot loop. Five DI
modules are injected with getters over the live runtime state:
GPU resources from `textures.js` / `materials.js`; the single keyboard/SR globe
widget from `a11y.js`; the card-detail modal from `modal.js`; pointer/drag/picking
from `interaction.js` (sharing drag velocity via the `drag` object); and the desktop
custom cursor from `cursor.js` (its `isActive()` gates interaction's hover cursor).
The modal owns its own
canvas/scene + the `MODAL_PHASE` (`CLOSED`/`OPENING`/`OPEN`/`CLOSING`) state machine
and reaches into the sphere only through the shared `sphereRotEuler`/`sphereRotQuat`
objects + the `snapToSphereSlot` / `requestNavNudge` callbacks (which keep
`sphereRotX/Y` and the nav-nudge spring in `updateSphereRotation`).

## How to run

The block is authored at
`https://www.adobe.com/homepage/drafts/jingleh/globe-dev` with a 45-card fragment
at `/homepage/fragments/drafts/jingle/globe-cards-filled`. Load with
`?milolibs=local` against `npm run libs`, or against the stage CDN. (Serve over
http, not `file://`, or textures CORS-taint to gray.)

The `hub-creative-v*` dirs are **design/source reference only** — read them (and
`hub-creative-v3/CHANGES.md`) to understand what a feature should do when porting.

To regenerate Three.js after adding a new `THREE.*` call: add the symbol to
`src/three.js`, then `cd libs/c2/blocks/globe && npm install && npm run build`.

## Authoring contract

The block expects up to **four direct child rows** (the hint and pull-quote rows
are optional):

| Row | Purpose | Content |
| --- | --- | --- |
| 0 | **Arc-copy** | heading → `.offer-arc-copy__title`; `<p>` → `.offer-arc-copy__body` |
| 1 | **Cards** | a Milo fragment link with `#_dnb` appended (see below) |
| 2 | **Hint text** | plain text for the WebGL "Click & Drag" affordance (falls back to `Click & Drag` if empty/absent) |
| 3 | **Pull-quote** | heading → quote; first `<p>` → name; second `<p>` → role |

Rows are positional. `parseAuthoredContent(el)` returns
`{ arcCopy, pullQuote, fragmentHref, hintText }`; cards are loaded separately from
the fragment link by `fetchFragmentCards`.

### Fragment loading

Row 1 links a DA fragment **with `#_dnb` appended** (e.g.
`/homepage/fragments/…/globe-cards#_dnb`). `#_dnb` tells Milo's
`decorateAutoBlock()` to skip auto-resolution so the raw `<a href>` stays in the
DOM. `fetchFragmentCards(href)` strips the hash and fetches `href + '.plain.html'`
itself — AEM Edge Delivery returns all card sections as bare `<div>`s (one per
`---`). Without `#_dnb`, Milo injects sections one-by-one before `init()` fires,
racing the parse.

Cards come solely from the fetched fragment. If the fetch yields none — a failed
request, or no fragment link authored — the block collapses to `.globe-gallery--empty`
(`height:auto`) rather than rendering an empty scene. There is no inline-DOM-card
fallback (authoring is expected to provide a valid fragment link). (Distinct from
`.globe-gallery--reduced`, the reduced-motion render path — see Accessibility.)

The same `--empty` collapse is the fallback when **WebGL is unavailable**: `initRuntime`
creates the `WebGLRenderer` in a `try/catch` (Three.js throws when `getContext` returns
null — blocklisted GPU/driver, refused software renderer, headless/sandboxed context, or a
context lost on a breakpoint-crossing rebuild). On failure `initRuntime` returns `false`,
the caller adds `--empty`, and no ticker starts — so the block degrades to a collapsed
section instead of throwing out of `init()` or running on a null renderer. (Note: a context
*lost while running* after a successful init is not yet handled — see backlog.)

### Card shape

`{ img, picture, name, role, description, badges:[{app:{id,name,abbr}, role}] }`

Each fragment section is flat P/UL elements:

| Element | Becomes | Notes |
| --- | --- | --- |
| `<p><em>…</em></p>` | **role** | empty if unauthored (no hardcoded default) |
| `<p><strong>…</strong></p>` | **name** | empty if unauthored (no hardcoded default) |
| plain `<p>` | **description** | shown in the modal |
| `<ul>` with nested `<ul><li>` per badge | **badges** | outer li = app name, inner li = role |
| `<p><picture>…</picture></p>` | **image** | required — sections without one are skipped |

Badge app names resolve against `APP_CATALOG` (by name/abbr/id) for brand icon
colors; unknown apps render with a derived abbreviation. `N_TOTAL` follows the
authored card count, capped at the per-BP grid capacity (45 desktop/tablet = 9×5,
24 mobile = 3×8). Fewer cards → the last grid column is partially filled; more →
extras are dropped. No modulo wrapping (`getCardMetadata(i)` indexes directly).

## Localization

The block ships **no hardcoded user-facing copy**. The "Click & Drag" affordance
string is now **authored** (row 2) and feeds both the WebGL hint text
(`createClickDragTexture` auto-scales the font to fit any length) and the desktop
custom-cursor label (`cursor.js`, via `deps.labelText`). Both fall back to
`Click & Drag` when the row is empty/absent, and both are decorative — not exposed to
assistive tech; the a11y widget instructions cover the real affordance.
Authored text (arc-copy,
pull-quote, card name/role/description) comes from the fragment + rows; everything
else — the chrome aria-labels, the globe widget instructions, and the carousel
announcement — resolves through Milo's placeholder dictionary via `replaceKeyArray`
(`resolveGlobeLabels()` in `globe-gallery.js`, fetched once per init and threaded into
`buildGlobeDom`, the a11y factory, and the modal). English is the fallback: the
default-locale sheet supplies it, and a missing key degrades to the de-hyphenated key text.

**Add these keys to the `placeholders` sheet** (default locale = English; translate
per locale):

| Key | English value | Used for |
| --- | --- | --- |
| `image-gallery-intro` | Image gallery intro | `.globe-gallery-arc-copy` region label |
| `previous-card` | Previous card | modal prev-arrow `aria-label` |
| `next-card` | Next card | modal next-arrow `aria-label` |
| `close` | Close | modal close-button `aria-label` |
| `apps-used` | Apps used | modal badges list `aria-label` |
| `image-gallery-instructions` | `Interactive image gallery, {{count}} images. Use the Left and Right arrow keys to rotate the globe, and Enter to browse the gallery.` | globe widget `aria-label` (the screen-reader "what is this" + controls) |
| `image-gallery-card-label` | `View photo by {{name}}, {{index}} of {{count}}` | the modal carousel **live-region** announcement on each navigation (`{{index}} of {{count}}`) |

`image-gallery-instructions` and `image-gallery-card-label` are **tokenized templates**
(`{{count}}`, `{{name}}`, `{{index}}` substituted at runtime, so each locale controls word
order). If a key is absent everywhere, the code falls back to the English template (the
static keys de-hyphenate to readable English on their own).

## Architecture notes

**DOM is JS-built and scoped to the block root.** `init(el)` calls
`parseAuthoredContent(el)` first (arc-copy, pull-quote, fragment href), then
`buildGlobeDom(el, labels, { arcCopy, pullQuote })` wipes the block, injects the
markup, fills the arc-copy / pull-quote slots, and **returns the `gid`** (the
per-instance unique-id suffix it mints from a module-level counter in
`authoring.js`). The runtime finds nodes by **class, queried within
`el`** (`root.querySelector('.offer-globe-canvas')`, `.modal-card-canvas`,
`.offer-pullquote`, `.card-modal*`, `.ca-r-offset`/`.ca-b-offset`, …) →
**multiple globes can coexist on a page**. The only id-bearing nodes are made
unique per instance via that `gid` suffix (ids, not classes, because both are
document-wide id references): the CA SVG filter (referenced from JS as
`filter: url(#ca-filter-<gid>)`) and the modal heading/description (the dialog's
`aria-labelledby` / `aria-describedby` IDREFs). `el` itself is the scroll runway
(height is `--runway-height` on `.globe-gallery`, collapsed to `100vh` under `.globe-gallery--reduced`);
the canvas is `position:fixed`. The shared body-level global (acceptable, one modal at a
time) is the `.modal-open` scroll lock.

**Scroll model.** The block element *is* the scroll runway (its height is the
`--runway-height` custom property) — there's no separate runway element, and nothing
hard-codes the value: progress is measured against the block's own
metrics: `progress = clamp((scrollY - blockDocTop) / blockHeight, 0, 1)`, where
`blockDocTop` is the block's top in document space and `blockHeight` its full scroll
length (both refreshed in `doLayout` + a body `ResizeObserver`). Milo's page-level
Lenis keeps `window.scrollY` in sync (gsap was dropped for a `requestAnimationFrame`
driver, `startTicker`/`stopTicker`). The modal pauses Lenis via
`window.lenis.stop()/start()` plus a `.modal-open { overflow:hidden }` CSS lock.

## Accessibility

The globe is exposed as **one widget**, not a per-card list — a single focusable
`<button>` (`a11y.js`, built over the sphere; `pointer-events:none` so it never blocks
mouse drag). It's a **stable tab stop** (only pulled from the tab order while the modal
traps focus), so the block is never skipped. Focusing it runs `snapToInteractive` —
`window.lenis.scrollTo(top, { force, immediate })` to `SPHERE_FORMED_PROGRESS` (the
`sphereFormT=1, zoomT=0` offset), bringing the block into its interactive state *and*
into view before the focus ring shows (the pdf-space focus pattern). A focus guard
(`suppressFocusSnap`, armed on window blur / `visibilitychange:hidden`) stops a
tab-return from re-snapping.

- **Keyboard:** Tab → globe; Left/Right → `spinGlobe` (velocity impulse into the drag
  inertia; a fixed yaw step under reduced motion); Enter/Space → open carousel mode at
  item 1. In the modal, Prev/Next/Close are all tab stops with a focus trap (WAI-ARIA
  dialog); Left/Right also traverse; Esc / Enter-on-Close exit and restore focus to the
  globe widget.
- **Screen reader:** the widget's `aria-label` (`image-gallery-instructions`) describes
  the globe + controls. The dialog announces the first item on open via
  `aria-labelledby`/`describedby`; each **subsequent** item is announced once by a polite
  live region (`.globe-gallery-modal__live`, updated only on navigation with `cardLabel`
  so it doesn't double the open announcement or read the badge list).

**Reduced motion** (`prefers-reduced-motion: reduce`) renders a **static interactive**
globe instead of the scroll choreography: `computeFrame` pins the scroll input to
`SPHERE_FORMED_PROGRESS` (formed sphere, no arc/grid/fold/zoom, `scrollVel` forced 0),
auto-spin is disabled (drag + arrow-spin still work, arrow-spin steps yaw directly), and
the modal open/close/nav snap with no fly/warp. The block collapses to `100vh`
(`.globe-gallery--reduced`); canvas visibility uses **real** scroll vs the block bounds
(the pinned `frame.lenisY` can't gate it). The no-cards / WebGL-unavailable fallback is
the separate `.globe-gallery--empty` (collapse to nothing).

Phase constants (module scope):

```
P_PAN_END=0.55  P_ARC_PREROLL=0.30  P_GRID_ARC_START=0.30  P_GRID_ARC_END=0.60
P_FOLD_DUR=0.25  P_ZOOM_END=1.00  GRID_PEEL_STAGGER=0.20  SPHERE_INTERACTIVE_T=0.8
FOLD_PEEL_OVERLAP=0.35  CA_ENABLED=true
```

`FOLD_PEEL_OVERLAP` (0–1) makes each card begin folding to the sphere that far — in
peel position-space — **before** it fully lands in the grid, folding from its live peel
position (no snap). Effect: the 9×5 grid never visibly "resolves" as a finished
composition, so the grid phase reads shorter and the sphere forms earlier. The fold opens
at peel localT `FOLD_START_LOCAL_T = 1 − FOLD_PEEL_OVERLAP^(1/3)`; the global fold window
(`SPHERE_FORMED_PROGRESS` / `computeFrame`'s `foldFirst`/`foldLast`) and the per-card fold
timer all derive from it, so camera / depth-sort / interactivity stay aligned.
`FOLD_PEEL_OVERLAP = 0` exactly restores the prior "settle in grid, then fold" behavior.

**Entry timing** is split into two independent constants (module scope):
- `ENTRY_LEAD_VH` (default `0.4`) — viewport-heights before the block top that
  the entry begins. `0` feels late; `0.85` is the prototype's hero pre-roll but
  sweeps card meshes over preceding content.
- `ENTRY_RAMP_VH` (default `1.05`) — ramp length over which `arcCopyEntryT` goes
  0→1 (arc-copy fade, arc pre-roll speed, text→arc gap).

**Breakpoints** resolve once in `init()`. There are **two render profiles** split at
768px (the Milo sm↔md boundary): `md` (≥768 — 45 cards, 9×5 grid, large sphere) and
`sm` (<768 — 24 cards, 3×8, smaller sphere). The `md` band is named for its lower
bound and covers Milo md *and* lg. Per-profile knobs in `BREAKPOINTS`:
`N_TOTAL`, `ARC_SPAN`, `SPHERE_R`, `CARD_*`, `CAM_Z_*`, `GRID_COLS/ROWS`,
`ARC_DENSE_COUNT`. There is deliberately no md↔lg split: Milo md (768–1279) and lg
(1280–1440) render identically, so a third band would never change anything the WebGL
cares about — code branches only on `'sm'`. Crossing 768px on resize changes the card
count, so `doLayout` triggers a full `destroy()`+`init()` rebuild there; resizing within
a band takes the cheap path (renderer/camera resize only). The `resize` handler is the
sole driver — there are no `matchMedia` boundary listeners (a real `resize` always fires
on a real viewport change; the old listeners were a DevTools-emulation crutch).

`modal.destroy()` includes a `resetModalDom()` call that synchronously resets the
modal's DOM + page state to the closed baseline (removes `is-visible`/`is-open`/`aria-hidden`,
hides `.modal-card-canvas`, clears `modal-open` from `<html>`/`<body>`, restarts Lenis).
This is required because the block's `innerHTML` is built once in the outer `init(el)`, not
per `initRuntime`, so a modal that was open when a breakpoint crossing fires would otherwise
survive the rebuild visually stuck open: the flown-out card mesh is dropped with the old
`modalScene` (image gone), `modalIdx` resets to -1 so re-wired chrome buttons early-return
(close/arrows dead), and the scroll lock remains. An open modal is treated as closed cleanly
when the breakpoint crosses — it does not re-open on the other side. CSS is
authored **mobile-first** (Milo convention) and keeps its own three type tiers
independently of these JS profiles: the sm scale is the unscoped `.globe` base, then
`@media (min-width:768px)` (md) and `@media (min-width:1280px)` (lg) layer the larger
scales on top. The modal/arc-copy treatment is the same — sm (dark frosted panels,
clamped copy) is the base; `@media (min-width:768px)` overrides to the desktop card.

**Reduced motion**: renders a static interactive globe (`.globe-gallery--reduced`,
`100vh`) — see Accessibility. The no-cards / WebGL-unavailable case is the separate
`.globe-gallery--empty` collapse.

## Behavior notes (intentional differences from the prototype)

- **"Click & Drag" hint text (WebGL).** A `PlaneGeometry` in `sphereGroup`, positioned
  behind the sphere's back surface (`z = −(SPHERE_R + TEXT_BEHIND_GAP)`, `renderOrder = -1`)
  so it rotates with the globe and draws behind the cards. Hidden until `sphereFormT >
  TEXT_APPEAR_START (0.10)`, then warps in (barrel warp + particle dissolve via `TEXT_FRAG`),
  settles to a faint resting opacity (`TEXT_OPACITY_PEAK 0.15 → RESTING 0.06`), and fades out
  over the zoom. The plane is sized to fill the frustum at the text's live camera distance
  (`textPlaneSize` + a per-frame scale off `frame.foldSphDist`), with warp-proportional
  overflow so letterforms bleed off-screen. On the user's **first drag** it warps/dissolves
  away permanently: `textExitProgress` (0→1) accumulates from drag distance + hold time +
  velocity burst and drives the shader's `uExitP` (horizontal stretch + radial scatter +
  amplified warp + full dissolve + opacity fade); it resets only when the section scrolls out
  of the interactive range (`sphereFormT < SPHERE_INTERACTIVE_T`). Shows on **all** devices
  (no mobile-specific affordance yet — see backlog). Built async in `buildTextMesh` (waits for
  `document.fonts.ready` so it renders in Adobe Clean), driven by the `updateClickDragText`
  tick stage, rebuilt on resize, static-and-faint under reduced motion. Copy is hardcoded
  (see Localization).
- **Desktop custom cursor (`src/cursor.js`).** On `(hover: hover) and (pointer: fine)` only,
  over the interactive sphere with no modal open: the system cursor is replaced by a 48px
  `mix-blend-mode: difference` disc (so it inverts whatever's beneath it) flanked by two
  chevrons that squeeze 4px inward while dragging, plus a faint "Click & Drag" label. Two
  body-level DOM layers (NOT scoped to the block root): the disc **must** be a direct `<body>`
  child — `mix-blend-mode` only reaches page content from outside a `position: fixed`
  (GPU-isolated) container — while the chevrons + label live in a fixed container. The module
  sets `cursor: none` on the canvas while active; `interaction.js` cedes its own hover cursor
  via the injected `isActive()`. No-op on touch (nothing is created). With multiple globes per
  page each instance makes its own pair, but only the hovered one activates (one mouse) and
  inactive discs are `visibility: hidden`. Label copy hardcoded (see Localization).
- **Modal — single bottom-center nav group; desktop adds a screen-edge scrim.**
  The nav prev/counter/next are one centered flex row (`.globe-gallery-modal__navbar`,
  built in `authoring.js`); `positionModalChrome` positions only the container —
  bottom-center of the viewport on mobile, bottom-center of the image on desktop
  (anchored to the image's projected bounds). The close button sits in the viewport's
  top-right margin at every breakpoint. On **desktop/tablet** (`@media min-width:768px`)
  the image fills the viewport height (12px margins, `DT_IMG_VPAD`), centered, width
  capped to the viewport; a fixed-width (`DT_SCRIM_W` = 316px) dark frosted readability
  scrim is attached to the **viewport's left edge, full viewport height** (independent
  of the image — role/name/description hug the top, badges pinned to the bottom via
  `margin-top:auto`), and the counter renders as a frosted pill. Scrim/nav/counter are
  all dark frosted (`rgb(0 0 0 / 64%)` + `blur(12px)`). **Mobile** (<768px): dark
  frosted info panel + light text bottom-anchored above the nav row, asset top-left;
  the counter is plain text in the nav group.
- **`.globe-gallery`-scoped type-scale tokens in `globe-gallery.css`.** The prototype relied on
  `:root` tokens from a typography stylesheet Milo doesn't ship. `globe-gallery.css` defines
  the needed `--font-display`/`--type-title-1-*`/`--type-body-*` tokens scoped to
  `.globe`. Keep in sync with `hub-creative/styles/global/typography.css`.

## Open items / backlog

Done: ~~scope DOM to `el`~~
(now class-scoped to the block root, multiple globes per page supported);
~~align `N_TOTAL`/grid to authored count~~ (fixed grid, partial fill — see
authoring contract); ~~scroll feel~~ (on a c2 page Milo loads Lenis with
`autoRaf:true` in `utils.js`, so `window.scrollY` *is* the Milo-approved
smooth-scroll position — no separate setup needed); ~~v1 scope decided~~ (core
arc→grid→sphere→zoom; modal + a11y + CA are fast-follow); ~~extract the a11y gallery
into its own DI module~~ (`a11y.js`); ~~`MODAL_PHASE` state-machine constants~~
(frozen enum, now in `modal.js`); ~~DRY modal magic numbers~~ (`MODAL_CAM_DIST`,
`SDF_CORNER_RADIUS`); ~~extract the modal into its own DI module~~ (`modal.js` —
`createGlobeModal(deps)`; the sphere coupling stayed narrow: shared
`sphereRotEuler`/`sphereRotQuat` + `snapToSphereSlot` / `requestNavNudge`, with
`sphereRotX/Y` + the nav-nudge spring kept in `updateSphereRotation`).

Done: ~~reduced-motion handling~~ (renders a static interactive globe + snaps the
modal — see Accessibility; supersedes the old "static poster" idea); ~~single-widget
keyboard/SR model~~ (replaced the per-card button list with one focusable globe widget +
carousel-mode modal); ~~unify card rounded corners on the SDF~~ (the card shader now rounds
corners analytically like the modal — `uAspect` set per phase, `uRadius` = 22/631 — so the
canvas mask + per-aspect mask cache + per-frame `alphaMap` swap are gone, corners are sharp
at any size, and the fold morph lerps `uAspect` with no swap pop; `createCardMaterial` is now
always the ShaderMaterial, the `CA_ENABLED` kill switch just zeroes the CA uniforms).

Done: ~~shortened grid phase~~ (`FOLD_PEEL_OVERLAP` — cards fold from their live peel position
before fully landing, so the grid never resolves; see Behavior notes / Phase constants);
~~WebGL "Click & Drag" hint text~~ and ~~desktop custom cursor~~ (both documented under
Behavior notes); ~~authored "Click & Drag" copy~~ (row 2 → both the WebGL hint and the
cursor label; see Localization).

Remaining (each an independent enhancement / fix — no ordering dependency):
1. **Mobile drag affordance.** The cursor is desktop-only and the WebGL hint text is the only
   touch hint today. Options: a brief auto-nudge rotation on first view, a touch-specific
   on-canvas glyph, or leave the text as-is — a design call, judge on a real device.
2. **Pause the rAF loop when off-screen** via `IntersectionObserver` (pdf-space does
   this — start/stop the ticker on intersect), instead of running every frame. Behavior
   change (must keep a generous `rootMargin` so the `ENTRY_LEAD_VH` pre-roll + pull-quote
   exit aren't cut off). Now more worthwhile since reduced motion also
   keeps the ticker running on a static globe.
3. **Handle WebGL context loss while running** (`webglcontextlost`/`webglcontextrestored`):
   today only context-creation *failure* is caught (→ `--empty`); a context lost mid-run
   after a successful init would blank the canvas with no recovery. Listen + rebuild GPU
   resources, or collapse gracefully.
4. **Consider removing the global SVG-filter CA ("Option C", `updateGlobalCA` + the
   `caFilterR`/`caFilterB` feOffsets + the `<filter>` markup in `buildGlobeDom`).** It's a
   second, scroll-velocity-only CA system layered on top of the shader's per-card CA. Its
   magnitude is sub-pixel on slow scroll, ~`CA_PX_MAX` (3px) max on fast scroll, and zero at
   rest (now also dead-banded via `SCROLL_VEL_DEADBAND`) — so it's nearly imperceptible,
   especially on the formed globe (per-card motion CA there is rotation-driven, not
   scroll-driven, so plain scrolling produces almost no per-card CA either). The shader CA
   (radial transition split + motion trails) is the CA users actually see and would stay.
   Product call, not pure cleanup: keep it only if the canvas-wide fringe during *fast*
   scroll is worth it — easiest way to judge is to crank `CA_PX_MAX` temporarily and see
   what it contributes. If dropped, it's a tidy self-contained removal.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
