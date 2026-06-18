# globe — C2 block

A scroll-driven **Three.js WebGL** hero. Status: **work in progress** — ported
and visually verified in a real Milo page. Core arc→grid→sphere→zoom is the v1
target; modal, a11y gallery, and chromatic aberration (CA) are fast-follow.

## What it is

Over a tall (`850vh`) pinned scroll range, 45 photo cards animate through four
phases:

```
0.00–0.55  Arc       cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5 grid (staggered)
~0.37–0.78 Sphere    each card folds onto a fibonacci sphere as it lands
0.78–1.00  Zoom      a perspective camera flies through the sphere
```

Once the sphere forms (`sphereFormT >= 0.8`) it's **interactive**: drag to spin,
tap a card to open a detail **modal** (separate WebGL canvas + HTML chrome).
Extras: per-frame chromatic-aberration SVG filter, a fixed arc-copy overlay, a
fixed pull-quote that fades in near the zoom end, and an off-screen a11y button
gallery mirroring the sphere cards.

## Files

| File | What it is |
| --- | --- |
| `globe-gallery.js` | The block + sphere render core. `export default init(el)` → builds DOM, runs the runtime (`createGlobeGalleryRuntime()` → `{ init, destroy }`). Holds tuning constants + pure helpers (module scope) and the stateful core (arc/grid/fold/sphere placement, drag-rotation physics + the nav-nudge spring, lifecycle). `tick()` is a thin orchestrator calling one named stage per concern (`computeFrame`, `updateActiveCamera`, `updateSphereRotation`, `updateCardTransforms`, `renderScene`, …) plus `modal.*` and `a11y.*`. The per-card placement is a dispatcher (`updateCardTransform`) over four runtime-scope branch fns (`placeSphereCard`/`placeFoldingCard`/`placeGridCard`/`placeArcCard`) fed a per-frame `frame` context. Instantiates the `modal`/`a11y`/`interaction` DI modules and injects live runtime state into them. |
| `authoring.js` | Authoring layer: `parseAuthoredContent` + `fetchFragmentCards` + `buildGlobeDom(el, labels, { arcCopy, pullQuote })` (+ internal parsers, `APP_CATALOG`). Reads the 3 block rows positionally, fetches the card fragment, and builds the canvas/overlay/modal DOM — minting + returning the per-instance `gid` id suffix and filling the arc-copy / pull-quote slots. |
| `shaders.js` | GLSL strings: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`. |
| `textures.js` | GPU resource factories (DI: `renderer` is passed in, not imported): `createRoundedMask`, `createSphereMaskCache`, `loadCardTextures`. No per-instance state. |
| `materials.js` | Pure material factories: `createCardMaterial` (CA ShaderMaterial + MeshBasicMaterial fallback, with the property-proxy) and `createModalMaterial` (SDF). |
| `a11y.js` | `createGalleryA11y(deps)` DI factory → `{ setup, updateTabStops, updateFocusRing, teardown }`. The hidden keyboard-gallery button list + projected focus ring. All runtime state (cards, camera, viewport, `sphereFormT`, modal-open) is injected as getters; `openModal` is injected so it never imports the modal. Holds no globe state except its own DOM nodes. |
| `modal.js` | `createGlobeModal(deps)` DI factory → `{ setup, resize, render, updateAnimation, updateDesktopNav, open, navigate, close, getModalIdx, isCardManaged, destroy }`. The card-detail modal: its own WebGL canvas/scene, the `MODAL_PHASE` open/close/navigate state machine, SDF material swap, desktop cross-warp nav, mobile swipe/pull gestures, chrome layout. Owns all modal tuning constants. Sphere coupling is injected and narrow: the shared `sphereRotEuler`/`sphereRotQuat` objects (read by the closing anim) + `snapToSphereSlot` / `requestNavNudge` / `applyMotionCA` callbacks (which keep `sphereRotX/Y` + the nav-nudge spring in core). |
| `math.js` | Shared pure helpers used by both core + modal: `easeOutCubic`, `easeInOutCubic`, `easeOutSine`, `lerpN`. |
| `arc.js` | Pure arc-phase geometry (stateless): `arcRotationEase`, `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ`. The fanned-arc layout + the CSS↔WebGL coordinate bridge. Derives everything from the viewport (W, H), `ARC_SPAN`, and the per-frame `arcCtx` the core owns (rebuilt each frame, threaded back in). |
| `interaction.js` | `createInteraction(deps)` DI factory → `{ setup, teardown }`. Canvas pointer/mouse plumbing: drag-to-spin input, click-vs-drag discrimination, raycast picking for hover (cursor + per-card hover state) and click → modal. Owns its listeners + raycaster; reads live state via getters. Drag velocity is shared with the core sphere stage by reference through the `drag` object (`{ isDragging, velX, velY }`) — interaction writes it from pointer deltas, `updateSphereRotation` reads + decays it. |
| `globe-gallery.css` | Globe-only CSS. Also defines `.globe-gallery`-scoped type-scale tokens (see Behavior notes). |
| `three-src.js` | Build entry — re-exports only the Three.js symbols the block uses. |
| `three.module.min.js` | Tree-shaken Three.js r160 ESM build (~453KB). Build artifact — do not edit. |
| `package.json` | Local mini build. `npm install && npm run build` regenerates `three.module.min.js`. |
| `_reference/globe-reference.html` | Trimmed, runnable globe-only copy of the original prototype — the target behavior. |
| `hub-creative-v1/`, `hub-creative-v2/` | Original prototype source (read-only reference; **git-ignored** via `.gitignore` `hub-creative-v*`, so not shipped or linted in CI). |

Registered as `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js`). The prototype dirs
and `_reference/` are git-ignored; `three.module.min.js` is eslint-ignored.

All ten shipped JS files (`globe-gallery.js`, `authoring.js`, `shaders.js`,
`textures.js`, `materials.js`, `a11y.js`, `modal.js`, `math.js`, `arc.js`,
`interaction.js`) are **airbnb-clean**
(`npx eslint` exit 0). The only exception is 1 targeted
`// eslint-disable-next-line no-use-before-define` comment in `globe-gallery.js` for a genuine
forward ref (`doLayout` → `destroy`, a mutual reference). No blanket `/* eslint-disable */`.

### Module layout (post-refactor)

`globe-gallery.js` is organized top-down: (1) module-scope tuning constants grouped by
`// ── Section ──` (layout/breakpoints, phase timeline, entry, grid, drag, CA,
hover, nav-nudge) — the core's tuning surface; (2) the domain helper `fibSpherePos`
(generic easings + `lerpN` live in `math.js`; the arc-phase geometry lives in
`arc.js`); (3) `createGlobeGalleryRuntime()` — the
per-instance closure holding sphere state + behavior. Inside the closure the
**per-frame pipeline** is a sequence of small single-concern stages run in a fixed
order by `tick()`. `computeFrame()` builds one per-frame `frame` context (scroll +
phase t-values + card-entry transforms); each stage reads what it needs from `frame`
(destructured at its top) and the producer stages write their result back onto it
(`activeCamera`, `sphereRotActive`, `sphGroupZ`), so the same object flows through to
the card loop — one context, not several. The per-card placement (the largest stage) is a dispatcher over four
runtime-scope branch fns fed an explicit per-frame `frame` context — kept in this
file, not a module, because they read deeply from the closure (BP constants,
sphere-rotation quats, drag velocity) and run in the per-card hot loop. Four DI
modules are injected with getters over the live runtime state:
GPU resources from `textures.js` / `materials.js`; the keyboard gallery + focus
ring from `a11y.js`; the card-detail modal from `modal.js`; pointer/drag/picking
from `interaction.js` (sharing drag velocity via the `drag` object). The modal owns its own
canvas/scene + the `MODAL_PHASE` (`CLOSED`/`OPENING`/`OPEN`/`CLOSING`) state machine
and reaches into the sphere only through the shared `sphereRotEuler`/`sphereRotQuat`
objects + the `snapToSphereSlot` / `requestNavNudge` callbacks (which keep
`sphereRotX/Y` and the nav-nudge spring in `updateSphereRotation`).

## How to run / verify

No Playwright (per project preference) — eyeball in a browser, served over http
(not `file://`, or textures CORS-taint to gray):

- **Target behavior:** serve the `globe/` dir (`python3 -m http.server`) and open
  `/_reference/globe-reference.html`.
- **The ported block:** authored at
  `https://www.adobe.com/homepage/drafts/jingleh/globe-dev` with a 45-card
  fragment at `/homepage/fragments/drafts/jingle/globe-cards-filled`. Load with
  `?milolibs=local` against `npm run libs`, or against the stage CDN.

To regenerate Three.js after adding a new `THREE.*` call: add the symbol to
`src/three.js`, then `cd libs/c2/blocks/globe && npm install && npm run build`.

## Authoring contract

The block expects **three direct child rows**:

| Row | Purpose | Content |
| --- | --- | --- |
| 0 | **Arc-copy** | heading → `.offer-arc-copy__title`; `<p>` → `.offer-arc-copy__body` |
| 1 | **Cards** | a Milo fragment link with `#_dnb` appended (see below) |
| 2 | **Pull-quote** | heading → quote; first `<p>` → name; second `<p>` → role |

Row roles are detected by whether the row contains a `<picture>`/`<img>` (only
card rows do). `parseAuthoredContent(el)` returns
`{ arcCopy, pullQuote, fragmentHref }`; cards are loaded separately from the
fragment link by `fetchFragmentCards`.

### Fragment loading

Row 1 links a DA fragment **with `#_dnb` appended** (e.g.
`/homepage/fragments/…/globe-cards#_dnb`). `#_dnb` tells Milo's
`decorateAutoBlock()` to skip auto-resolution so the raw `<a href>` stays in the
DOM. `fetchFragmentCards(href)` strips the hash and fetches `href + '.plain.html'`
itself — AEM Edge Delivery returns all card sections as bare `<div>`s (one per
`---`). Without `#_dnb`, Milo injects sections one-by-one before `init()` fires,
racing the parse.

Cards come solely from the fetched fragment. If the fetch yields none — a failed
request, or no fragment link authored — the block collapses to `.globe--reduced`
rather than rendering an empty scene. There is no inline-DOM-card fallback (authoring
is expected to provide a valid fragment link).

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

The block ships **no hardcoded user-facing copy**. Authored text (arc-copy,
pull-quote, card name/role/description) comes from the fragment + rows; everything
else — the chrome aria-labels and the keyboard-gallery button labels — resolves
through Milo's placeholder dictionary via `replaceKeyArray` (`resolveGlobeLabels()`
in `globe-gallery.js`, fetched once per init and threaded into `buildGlobeDom` and the a11y
factory). English is the fallback: the default-locale sheet supplies it, and a
missing key degrades to the de-hyphenated key text.

**Add these keys to the `placeholders` sheet** (default locale = English; translate
per locale):

| Key | English value | Used for |
| --- | --- | --- |
| `image-gallery-intro` | Image gallery intro | `.offer-arc-copy` region label |
| `previous-card` | Previous card | modal prev-arrow `aria-label` |
| `next-card` | Next card | modal next-arrow `aria-label` |
| `close` | Close | modal close-button `aria-label` |
| `apps-used` | Apps used | modal badges list `aria-label` |
| `image-gallery` | Image gallery | keyboard-gallery region label |
| `image-gallery-card-label` | `View photo by {{name}}, {{index}} of {{count}}` | each keyboard-gallery button (`aria-label` + text) |

`image-gallery-card-label` is a **tokenized template** — `{{name}}`, `{{index}}`,
`{{count}}` are substituted at runtime, so each locale controls word order around
them. If the key is absent everywhere, the code falls back to the English template
(the static keys de-hyphenate to readable English on their own).

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
`aria-labelledby` / `aria-describedby` IDREFs). `el` itself is the `850vh` scroll runway
(styled directly on `.globe`, no extra class); the canvas is `position:fixed`. Body-level globals
that remain shared (acceptable, one modal at a time): the `.modal-open` scroll
lock and the keyboard focus-ring overlay.

**Scroll model.** The block element *is* the scroll runway (it's `850vh` tall) —
there's no separate runway element, so progress is measured against the block's own
metrics: `progress = clamp((scrollY - blockDocTop) / blockHeight, 0, 1)`, where
`blockDocTop` is the block's top in document space and `blockHeight` its full scroll
length (both refreshed in `doLayout` + a body `ResizeObserver`). Milo's page-level
Lenis keeps `window.scrollY` in sync (gsap was dropped for a `requestAnimationFrame`
driver, `startTicker`/`stopTicker`). The modal pauses Lenis via
`window.lenis.stop()/start()` plus a `.modal-open { overflow:hidden }` CSS lock.

**Virtual progress.** `computeFrame` reads `virtualScrollY != null ? virtualScrollY
: window.scrollY`, so the whole timeline can be driven from a synthetic position
instead of real scroll. The `setVirtualProgress(p)` closure (p in 0→1, `null` to
release) maps a progress value to that synthetic scroll position and is injected into
the a11y module's deps. It's **plumbing, not yet wired**: the intended consumer is
keyboard focus stepping through phases (tab into the gallery → advance to the
sphere-interactive phase without scrolling). a11y doesn't call it yet.

Phase constants (module scope):

```
P_PAN_END=0.55  P_ARC_PREROLL=0.30  P_GRID_ARC_START=0.30  P_GRID_ARC_END=0.60
P_FOLD_DUR=0.25  P_ZOOM_END=1.00  GRID_PEEL_STAGGER=0.20  SPHERE_INTERACTIVE_T=0.8
CA_ENABLED=true
```

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

**Reduced motion**: skips WebGL and adds `.globe--reduced` (collapses the block).
A static poster fallback is a TODO.

## Behavior notes (intentional differences from the prototype)

- **Desktop/tablet modal — white info card overlaid on the image.** The prototype
  anchored a fixed-width info panel to the viewport's bottom-right, which landed
  beside the (portrait) image in empty space. Desktop/tablet now anchor all chrome
  to the image's projected bounds: a solid white info card overlapping the image's
  lower area (inset by `INSET` = 24px + corner radius), dark text, white nav arrows
  in the margin *outside* the image, a dark frosted close button at the image's
  top-right, and the counter below the image. Styled via `@media (min-width:768px)`
  in `globe-gallery.css`. Mobile (<768px) is unchanged: dark frosted panel + light text
  beneath the asset. The diverging JS block carries a `DELIBERATE DIVERGENCE` comment.
- **`.globe-gallery`-scoped type-scale tokens in `globe-gallery.css`.** The prototype relied on
  `:root` tokens from a typography stylesheet Milo doesn't ship. `globe-gallery.css` defines
  the needed `--font-display`/`--type-title-1-*`/`--type-body-*` tokens scoped to
  `.globe`. Keep in sync with `hub-creative/styles/global/typography.css`.

## Open items / backlog

Done: ~~visual verification~~ (confirmed in a real Milo page); ~~scope DOM to `el`~~
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

Remaining:
1. **Static reduced-motion poster** (currently the section just collapses).
2. **Pause the rAF loop when off-screen** via `IntersectionObserver` (pdf-space does
   this — start/stop the ticker on intersect), instead of running every frame. Behavior
   change (must keep a generous `rootMargin` so the `ENTRY_LEAD_VH` pre-roll + pull-quote
   exit aren't cut off) — verify visually.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
