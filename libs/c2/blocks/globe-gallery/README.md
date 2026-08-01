# globe — C2 block

A scroll-driven **Three.js WebGL** hero. Status: **work in progress** — ported
and running in a real Milo page. Core arc→grid→sphere→zoom is the v1
target; modal, a11y gallery, and chromatic aberration (CA) are fast-follow.

## What it is

Over a tall, pinned scroll range (`--runway-height` in the CSS), the authored photo cards
(any count on desktop; first 24 on mobile) animate through four phases:

```
0.00–0.55  Arc       cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5-nominal grid (staggered)
~0.37–0.78 Sphere    each card folds onto a fibonacci sphere as it lands
                     (sm: truncated to a latitude band — see POLAR_BAND)
0.78–1.00  Zoom      a perspective camera flies through the sphere
```

Once the sphere forms (`sphereFormT >= 0.8`) it's **interactive**: drag to spin,
tap a card to open a detail **modal** (separate WebGL canvas + HTML chrome). Mouse
drags rotate **freely** (trackball — no pitch limit, so cards can tumble past vertical
and read upside down); **touch drags spin yaw only** so vertical swipes stay page
scroll (see Free rotation + Touch gesture arbitration).
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
| `shaders.js` | GLSL strings: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`, `TEXT_FRAG`. The card/modal frag shaders round their corners with the same analytic SDF (`rrSDF`) — `uRadius` (22/631 of height) + `uAspect` (world-space width/height), no rasterized mask. `MODAL_FRAG`'s `uRadius` is set to 0 on mobile (square, full-bleed image). `TEXT_FRAG` (the "Click & Drag" hint, on `CARD_VERT`) is a simplified variant: centered barrel warp + per-pixel particle dissolve + the `uExitP` one-way exit. |
| `textures.js` | `loadCardTextures` (default export) — loads each card image into a cover-cropped `CanvasTexture`; `createClickDragTexture(aspect, hintText)` (named) — renders the authored hint string (font auto-scaled to fit; defaults to "Click & Drag") to a `CanvasTexture`. No per-instance state. (Rounded corners are no longer rasterized here; the card shader computes them.) |
| `materials.js` | Pure material factories: `createCardMaterial` (the card ShaderMaterial — texture cover-crop + optional CA/warp + SDF rounded corners, with the property-proxy), `createModalMaterial` (the modal SDF material), and `createTextMaterial` (the hint-text `TEXT_FRAG` material — driven entirely by uniforms, no proxy). |
| `a11y.js` | `createGalleryA11y(deps)` DI factory → `{ setup, updateTabStops, teardown }`. Exposes the globe as **one** focusable widget (a transparent centered `<button>` over the sphere): a stable tab stop (out of tab order only while the modal traps focus), Left/Right arrows → `spinGlobe`, Enter/Space → `openModal` (first item), and `onFocus` snaps the page to the interactive state (pdf-space pattern). All runtime state (`count`, `sphereFormT`, modal-open) + actions (`spinGlobe`, `openModal`, `onFocus`) are injected; holds no globe state except its own DOM node. |
| `modal.js` | `createGlobeModal(deps)` DI factory → `{ setup, resize, render, updateAnimation, updateDesktopNav, open, navigate, close, getModalIdx, isCardManaged, destroy }`. The card-detail modal: its own WebGL canvas/scene, the `MODAL_PHASE` open/close/navigate state machine, SDF material swap, desktop cross-warp nav, mobile swipe/pull gestures, chrome layout. Owns all modal tuning constants. Sphere coupling is injected and narrow: the shared `sphereRotQuat` object (read by the closing anim) + `snapToSphereSlot` / `applySphereFacing` / `requestNavNudge` / `applyMotionCA` callbacks (which keep the orientation + the nav-nudge spring in core). |
| `math.js` | Shared pure helpers used by both core + modal: `easeOutCubic`, `easeInOutCubic`, `easeOutSine`, `lerpN`. |
| `arc.js` | Pure arc-phase geometry (stateless): `arcRotationEase`, `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ`. The fanned-arc layout + the CSS↔WebGL coordinate bridge. Derives everything from the viewport (W, H), `ARC_SPAN`, and the per-frame `arcCtx` the core owns (rebuilt each frame, threaded back in). |
| `interaction.js` | `createInteraction(deps)` DI factory → `{ setup, teardown }`. Canvas pointer/mouse plumbing: drag-to-spin input, click-vs-drag discrimination, raycast picking for hover (cursor + per-card hover state) and click → modal. Owns its listeners + raycaster; reads live state via getters. Drag velocity is shared with the core sphere stage by reference through the `drag` object (`{ isDragging, velX, velY }`) — interaction writes it from pointer deltas, `updateSphereRotation` reads + decays it. Also owns the **touch axis lock** (yaw-only on touch so vertical swipes stay page scroll; pitch is mouse-only) and exports `isPageScrollGesture()` so per-frame stages can tell a page-scroll swipe from a globe drag — see Behavior notes. Defers its hover cursor (pointer/default) to the custom cursor via the injected `isCursorActive()`. |
| `cursor.js` | `createCursor(deps)` DI factory → `{ setup, update, teardown, isActive }`. The desktop "Click & Drag" custom cursor (`(hover: hover) and (pointer: fine)` only; no-op on touch). Builds two body-level layers — a `mix-blend-mode: difference` disc (direct body child, so it inverts page content) + a fixed container with squeeze-on-drag chevrons and a label. `update()` (per frame) toggles shown/dragging state from injected getters (`getSphereInteractive`, `getModalOpen`, `getReducedMotion`, `drag`), follows the pointer, and runs the **two-step retirement**: `getHintDismissed()` fades the label out (with the WebGL hint, on first drag), and the later `getCursorRetired()` fades the disc/chevrons over `RETIRE_FADE_MS`, after which `active` drops and the **ordinary system cursor takes back over**. `isActive()` lets interaction.js cede (and then re-take) the canvas cursor. Owns its DOM + `mousemove`/canvas listeners; `teardown()` removes them. Label copy is the authored hint string (`deps.labelText`, shared with the WebGL hint text; see Localization). |
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
and reaches into the sphere only through the shared `sphereRotQuat`
object + the `snapToSphereSlot` / `requestNavNudge` callbacks (which keep the
orientation and the nav-nudge spring in `updateSphereRotation`).

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
colors; unknown apps render with a derived abbreviation.

**Card count.** `N_TOTAL` follows the authored card count, capped per breakpoint by
`N_MAX`:

- **md (≥768) — uncapped.** Every authored card renders. The sphere (Fibonacci) and the
  arc (normalized `fanT`) are both count-agnostic, and the grid's 9×5 is only *nominal*:
  it fixes the card size, gap, and centering origin, and the grid already overflows the
  viewport ~1.44× by design as a "more cards beyond" cue. Cards past 45 continue into
  further (negative-index, off-screen) columns. `totalW`/`totalH` derive from the nominal
  dims, never the actual column count, so **adding cards never shifts cards 0–44**.
  Practical ceiling is texture memory / load time, not layout.
- **sm (<768) — hard cap of 24.** The 3×8 grid already exceeds a 667px-tall viewport and
  the sphere is small, so mobile renders the **first 24** authored cards and ignores the
  rest (logged via `lana` at `info`). Surplus cards are never fetched, so mobile pays no
  texture cost for them.

Fewer cards than the nominal grid → the last column is partially filled. No modulo
wrapping (`getCardMetadata(i)` indexes directly). `ARC_DENSE_COUNT` is derived from
`ARC_DENSE_FRACTION × N_TOTAL`, so the clustered:spread arc ratio holds at any count.

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
| `image-gallery-label` | `Interactive image gallery, {{count}} images` | globe widget `aria-label` — the concise accessible **name** (screen-reader "what is this") |
| `image-gallery-instructions` | `Use the Left and Right arrow keys to rotate the globe, and Enter to browse the gallery.` | globe widget `aria-describedby` — the operating **instructions**, announced once |
| `image-gallery-card-label` | `View photo by {{name}}, {{index}} of {{count}}` | the modal carousel **live-region** announcement on each navigation (`{{index}} of {{count}}`) |

The globe widget's **name** (`image-gallery-label`) is kept separate from its **controls**
(`image-gallery-instructions`, wired as a visually-hidden `aria-describedby` child) so a
screen reader reads a terse name on every focus and the how-to-drive-it once. `image-gallery-label`
and `image-gallery-card-label` are **tokenized templates** (`{{count}}`, `{{name}}`, `{{index}}`
substituted at runtime, so each locale controls word order). If a key is absent everywhere the
code falls back to the English text (the tokenized keys are detected by their missing `{{…}}`;
`image-gallery-instructions` by its de-hyphenated key string).

### Localization readiness

Every user-facing string is **localizable** — it comes either from the placeholders sheet
or from authored content, so a localized page can carry fully localized copy. Hardcoded
literals in the code are only **fallbacks** for when a sheet key or authored field is
missing; on a correctly-authored page they never show. Specifically:

- **Sheet-backed:** all chrome `aria-label`s (modal nav/close, badges list), the arc-copy
  region label, the globe widget **name** + **instructions**, and the carousel live-region
  announcement — via the `image-gallery-*` / `previous-card` / `next-card` / `close` /
  `apps-used` keys above. **Setup action for localized pages:** add these keys to the
  `placeholders` sheet per locale (`// TODO: finalize authoring these keys` in
  `resolveGlobeLabels`); the English values in the table are the fallbacks.
- **Authored:** arc-copy, pull-quote, and card name/role/description come from the block
  rows + fragment; the "Click & Drag" hint + cursor label come from **row 2** (the
  `Click & Drag` literal is just the empty-row fallback). Badge app labels come from the
  authored token (the `App`/`Ap` literal is only the empty-token fallback).

The one string with **no** sheet/authoring path is the modal's `1/N` counter (generated in
`populateModal`, marked `// TODO:`); it's `aria-hidden` (screen readers get the localized
`image-gallery-card-label` live region), so it's a visual-only concern for locales that
format numerals differently. Adobe brand names (`Photoshop`, …) in `APP_CATALOG` are left
untranslated by design. There are no CSS `content:` text strings.

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
- **Screen reader:** the widget's `aria-label` (`image-gallery-label`) is a concise name;
  its controls come from `image-gallery-instructions` via a visually-hidden
  `aria-describedby` child, so the terse name reads on every focus and the how-to once. The
  dialog announces the first item on open via
  `aria-labelledby`/`describedby`; each **subsequent** item is announced once by a polite
  live region (`.globe-gallery-modal__live`, updated only on navigation with `cardLabel`
  so it doesn't double the open announcement or read the badge list).

**Reduced motion** (`prefers-reduced-motion: reduce`) renders a **static interactive**
globe instead of the scroll choreography, laid out as **plain document flow**:
`computeFrame` pins the scroll input to `SPHERE_FORMED_PROGRESS` (formed sphere, no
arc/grid/fold/zoom, `scrollVel` forced 0), auto-spin is disabled (drag + arrow-spin still
work, arrow-spin steps yaw directly), and the modal open/close/nav snap with no fly/warp.

Rather than a tall runway + fixed pinned canvas, `.globe-gallery--reduced` lays the block
out as normal flow: the globe is a **static ~100vh section that scrolls away naturally**,
then the **pull-quote follows below in normal flow** — no sticky, no pin, no scroll
gating. The pieces:

- **Canvas** — `initRuntime` sets `position:absolute` + `top:8vh` (instead of the default
  `fixed`), so it lives inside the now-`position:relative` `.globe-gallery-world`, scrolls
  with the page, clips naturally, and sits a touch below the section top (clear of the
  section above). `updateCanvasVisibility` just reveals it once (no coverage math).
- **`.globe-gallery-world`** — `position:relative` (was `sticky`); anchors the absolute
  canvas + a11y widget. Height `108vh` = 8vh clearance + the 100vh canvas, no slack below.
- **Globe size (desktop)** — the formed `md` sphere fills ~93% of viewport height by
  design, so top/bottom cards bleed off screen. Under RM the ball is static, so
  `buildCards` scales the `sphereGroup` by `RM_GLOBE_SCALE_MD` (0.9) on `md` to bring the
  whole ball into view (rotation is per-card, so a group scale is safe). `sm` (~49%) is
  left at 1.
- **A11y widget** — `position:absolute` (was `fixed`) so it scrolls with the globe;
  re-centred on the sphere with `top:58vh` (canvas `top` + half the canvas) since the base
  `top:50%` would track the taller world. Focus still snaps to `blockDocTop`.
- **Pull-quote** — the pin drops `position:absolute`/bottom-of-runway and the quote drops
  `sticky`; both go `static`, the quote is forced `opacity:1` (no scroll-driven reveal),
  and hugs the top of its box (`min-height:0`, `justify-content:flex-start`, modest
  padding) so it sits close under the globe rather than a screen away. `updatePullQuote`
  early-returns under RM (CSS owns it).
- **Arc-copy** — `display:none` (no arc phase to introduce; a fixed pill would hang over
  the scrolling page).

The `--reduced` flow overrides are grouped at the **end of `globe-gallery.css`** (after the
base rules they override — `no-descending-specificity`). The no-cards / WebGL-unavailable
fallback is the separate `.globe-gallery--empty` (collapse to nothing).

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
768px (the Milo sm↔md boundary): `md` (≥768 — all authored cards, 9×5 nominal grid,
large sphere) and `sm` (<768 — first 24 cards, 3×8, smaller sphere). The `md` band is
named for its lower bound and covers Milo md *and* lg. Per-profile knobs in
`BREAKPOINTS`: `N_MAX` (0 = uncapped), `ARC_SPAN`, `SPHERE_R`, `CARD_*`, `CAM_Z_*`,
`GRID_COLS/ROWS`, `CARD_ROLL_JITTER`, `ARC_DENSE_FRACTION`, plus precise-pointer defaults
for the shape keys (`POLAR_BAND`, `CARD_FACE_CAMERA`, `SPHERE_AREA_NORM`) that
`YAW_ONLY_GEOMETRY` overrides on coarse-pointer devices. There is deliberately no md↔lg split: Milo md (768–1279) and lg
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

**Reduced motion**: renders a static interactive globe as plain document flow
(`.globe-gallery--reduced` — globe section scrolls away, pull-quote follows) — see
Accessibility. The no-cards / WebGL-unavailable case is the separate
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
  of the interactive range (`sphereFormT < SPHERE_INTERACTIVE_T`). That signal is owned by its
  own tick stage (`updateHintExitProgress`) rather than by `updateClickDragText`, because the
  text stage early-returns before the interactive range — exactly the scroll-out that has to
  reset it — and the custom cursor reads it too. Shows on **all** devices
  (no mobile-specific affordance yet — see backlog). Built async in `buildTextMesh` (waits for
  `document.fonts.ready` so it renders in Adobe Clean), driven by the `updateClickDragText`
  tick stage, rebuilt on resize, static-and-faint under reduced motion. Copy is hardcoded
  (see Localization).
- **Desktop custom cursor (`src/cursor.js`).** On `(hover: hover) and (pointer: fine)` only,
  over the interactive sphere with no modal open: the system cursor is replaced by a 48px
  `mix-blend-mode: difference` disc (so it inverts whatever's beneath it) flanked by two
  chevrons that squeeze 4px inward while dragging, plus a faint "Click & Drag" label. It
  **retires in two steps** as the user drags, both riding the same `textExitProgress` signal
  as the WebGL hint text: at `CURSOR_HINT_DISMISS_T` (0.12, injected as `getHintDismissed`)
  the label fades out along with the background text; at the later `CURSOR_RETIRE_T` (0.55,
  `getCursorRetired`) the **whole effect goes away** — the disc + chevrons fade over
  `RETIRE_FADE_MS` (0.42s, mirrored by the `--retiring` CSS transitions), then `active` drops,
  clearing `cursor: none` so the **ordinary system cursor** (back under `interaction.js`)
  takes over. The disc shrinks rather than fades because `mix-blend-mode: difference` turns
  partial opacity into a gray wash. Opening a card sets `textExitProgress = 1`, so a click
  retires the cursor immediately. Both steps reset on scroll-out. Two
  body-level DOM layers (NOT scoped to the block root): the disc **must** be a direct `<body>`
  child — `mix-blend-mode` only reaches page content from outside a `position: fixed`
  (GPU-isolated) container — while the chevrons + label live in a fixed container. The module
  sets `cursor: none` on the canvas while active; `interaction.js` cedes its own hover cursor
  via the injected `isActive()`. No-op on touch (nothing is created). With multiple globes per
  page each instance makes its own pair, but only the hovered one activates (one mouse) and
  inactive discs are `visibility: hidden`. Label copy is the authored hint string (see Localization).
- **Modal — edge-anchored nav arrows + bottom-center counter; desktop adds a screen-edge scrim.**
  The prev/next arrows and the counter are independent chrome children (no shared wrapper),
  each positioned per-frame by `positionModalChrome`. At **every** breakpoint they read as one
  bottom-center row. **Desktop/tablet**: the counter pill centers on the image's horizontal
  center at its bottom edge, with an arrow `DT_NAV_GAP` (12px) away on each side; the pill is a
  fixed `DT_COUNTER_W` (138px, mirroring its CSS `width` — keep the two in sync) so the flank
  offset needs no measuring. All three share one `bottom` and are 44px tall, so they align as a
  row. **Mobile**: the same row spread wide — arrows in the bottom-left/right corners, counter
  centered between them, inside the bottom scrim. The three frosted controls (both arrows + close) share one style: 1px
  `--s2a-color-transparent-white-24` border, `--s2a-border-radius-4` (6px) radius,
  `--s2a-color-transparent-black-64` background, `blur(12px)`. The close button sits in the
  viewport's top-right margin at every breakpoint. On **desktop/tablet** (`@media min-width:768px`)
  the **visible** image is contain-fit to the viewport minus a symmetric `DT_IMG_MARGIN`
  (12px) on every edge, centered: with its native aspect kept it fills whichever axis binds
  first (up to the inner box) and gaps only the other (never both) — as big as that box
  allows. The sizing math backs the geometry out of the SDF corner inset (`uRadius·cardHPx`
  on all four sides) so the visible photo — not the geometry — reaches the margin (mirrors
  the mobile branch). A fixed-width (`DT_SCRIM_W` = 316px) dark frosted readability
  scrim is attached to the **viewport's left edge, full viewport height** (independent
  of the image — the role/name/description block is **left-aligned and vertically
  centered**: `margin-top:auto` on `.globe-gallery-modal__role-label` plus the badges'
  existing `margin-top:auto` gives the flex column two auto margins that split the scrim's
  free space, with the badges still pinned to the bottom), and the counter renders as a
  frosted pill. Scrim/nav/counter are
  all dark frosted (`rgb(0 0 0 / 64%)` + `blur(12px)`). **Mobile** (<768px, the CSS base
  — styles are mobile-first, desktop layered in the `min-width:768px` query): the image is
  full-bleed to the screen width (top-aligned, aspect kept) with **square corners**
  (`uRadius` = 0 on mobile); the scrim is one full-width
  266px chunk pinned to the bottom holding the description (top), badges, and — in its bottom
  row — the arrows in the left/right corners with the plain-text counter centered. Same
  `rgb(0 0 0 / 64%)` + `blur(12px)` + light text as desktop.
- **Free rotation (trackball) — the orientation is one accumulated quaternion.** The sphere's
  drag orientation is a single `sphereRotQuat`, not a pitch/yaw Euler pair. Each frame's drag
  deltas are applied as world-axis rotations **premultiplied** onto it
  (`applySphereRotDelta(WORLD_Y, velX)` / `(WORLD_X, velY)`). Premultiplying by a *world*
  axis is what makes "drag right" always the screen's horizontal axis however far the globe
  has been tumbled — post-multiplying would use the sphere's own tumbled local axis. There is
  **no pitch clamp**: the globe tumbles freely, cards pass through vertical, and past 90° they
  read upside down. That's accepted as the honest result of the gesture (`CARD_FRAG` already
  flips back-facing fragments for the camera-inside-sphere case). `sphereRotQuat` is
  renormalized every frame — repeated products drift off the unit sphere.
  - **What this replaced, and why.** Previously an `'XYZ'` Euler pair with pitch clamped ±60°
    as the *outer* rotation. That ordering existed only to dodge a gimbal flip: with `'YXZ'`
    (unclamped yaw outside) the local pitch axis's world-X component goes to 0 at 90° of yaw
    (vertical drag does nothing) and −1 at 180° (drag down tilts *up*). Quaternion
    accumulation has no such failure — measured response to a vertical drag is flat
    (27.5 ± 0.01) at 0/90/180/270/450° of yaw, and pitch passes through ±90° and beyond with
    no loss of response.
  - **Tradeoff: roll becomes PATH-DEPENDENT.** Pitch and yaw rotations don't commute, and
    their commutator is a **roll** term (order ε² per frame, integrated along the drag path).
    A closed loop in *input* space is not a closed loop in *orientation* space, so curved
    drags accumulate tilt the user never asked for and it does not self-cancel.
    **Note precisely what changed here — the old clamped-Euler scheme also produced roll.**
    It is not true that the ±60° clamp prevented roll: the screen-horizontal axis picks up a
    y-component of `sin(yaw)·sin(pitch)`, so e.g. pitch 45° + yaw 45° gave 30° of roll, and
    pitch 60° + yaw 90° gave 60° — all well inside the clamp. What the old scheme gave was
    roll that is **bounded and non-hysteretic**: a pure function of the current
    `(pitch, yaw)` with no memory of the path, returning to exactly 0 whenever pitch returns
    to 0, and bounded by `|roll| ≤ |pitch| ≤ 60°` (verified by scanning the whole reachable
    space). The same circular drag under both schemes:

    ```
     loop |  OLD roll | OLD pitch |  NEW roll
     -----+-----------+-----------+----------
      1   |     0.0   |     0.0   |    25.6
      2   |     0.0   |     0.0   |    49.8
      3   |     0.0   |     0.0   |    67.2
      4   |     0.0   |     0.0   |    60.3   ← wanders, doesn't settle
    ```

    So the regression is the loss of **self-correction**, not the introduction of roll. Under
    the old scheme dragging back to horizontal always returned the globe level; now it
    doesn't. Accumulated roll clears only on scroll-out (`sphereFormT < 0.01` →
    `sphereRotQuat.identity()`).
  - **Why absolute angles vs. an accumulated rotation (and why Google Earth differs).** Earth
    stores absolute lat/lon/tilt and keeps north-up (closer to `OrbitControls`); roll is only
    reachable via a deliberate Ctrl+drag. That fits its problem: Earth's state is a *camera
    pose over a fixed, oriented world*, the globe has a real north pole, and those angles are
    exactly the user's mental model — so they can be displayed, deep-linked, and restored.
    Ours is an *object's orientation with no canonical up*: a Fibonacci sphere of cards has no
    pole and no meaningful latitude, so there is nothing to name or link to. The general
    tradeoff: **absolute angles buy predictability by restricting reachable orientations;
    accumulated quaternions buy all of SO(3) by giving up path-independence.** Gimbal
    degeneracy is a *symptom* of the angle approach (hence the clamp), not its purpose.
  - **CURRENT DECISION (open — may revisit).** Shipping pure trackball (option 1 below).
    The drifting horizon has **not** been judged on a real device yet; the numbers above are
    computed, not felt. Three options if it proves unacceptable — do not "fix" this by
    quietly reverting one piece:
    1. **Pure trackball** *(shipped)* — maximum freedom; drifting horizon; no self-correction.
    2. **Trackball + spring-to-upright on release** — free during the gesture, settles level.
       Keeps the gimbal fix and restores the self-correcting property the clamp gave. This is
       the recommended fallback and the most likely next step.
    3. **Revert to clamped Euler** — accepts bounded roll and the ±60° pitch limit, but gets
       path-independence back for free.
  - **The nav-nudge became a minimal-arc slerp.** `triggerModalNavNudge` now builds one
    rotation about the single axis carrying the card's world direction to front-center
    (`setFromUnitVectors`), scaled to `NAV_NUDGE_FACTOR` and capped at `NAV_NUDGE_MAX_ANGLE`
    (one angle, replacing the per-axis `NAV_NUDGE_MAX_Y`/`_X`). The spring then runs on the
    **slerp parameter** (`navNudgeT`, 0→1) between two captured orientations. This is both
    simpler and strictly more correct than the old two-Euler version — whose own comment
    conceded that Y and X rotations don't commute — and it can't inject roll, since the
    rotation axis is perpendicular to both directions.
- **Two independent axes: viewport WIDTH and INPUT PRECISION.** These are resolved
  separately and must not be conflated:
  - **Width** (`resolveBP`, 768px) picks the render profile — card count, grid dims, sphere
    radius, camera Z. `sm` | `md`.
  - **Input precision** (`prefersYawOnlyGeometry`, `(pointer: coarse)`) picks the sphere's
    SHAPE, via the `YAW_ONLY_GEOMETRY` overlay — `POLAR_BAND`, `CARD_FACE_CAMERA`,
    `SPHERE_AREA_NORM`, `CYLINDER` / `CYL_COLS_FIT` / `CYL_GAP_RATIO` / `CYL_ASPECT_CAP`.
  - **Why split.** Those shape constants exist *only* because a yaw-only drag can't change a
    card's latitude. They were originally keyed to the `sm` width band, which was wrong: an
    **iPad Pro is ≥768px (so `md`) but drags with touch**, leaving **7 of its 45 cards
    permanently >60° oblique** — precisely the bug `POLAR_BAND` was written to fix, on a
    device that never received the fix. Width tells you nothing about input.
  - **`(pointer: coarse)`, not `(hover: none)` and not a UA sniff.** It describes the
    *primary* pointer's precision. iPad Pro with touch alone reports `pointer: coarse`; attach
    a trackpad and it flips to `pointer: fine` — and that flip is handled, since geometry is
    baked at `buildCards()` time and can't be swapped in place: `doLayout` compares
    `bp.YAW_ONLY` and does the same `destroy()` + `init()` rebuild as a width-band crossing.
    A `change` listener on the media query drives it, because attaching a trackpad fires no
    `resize`.
  - **This is distinct from the per-gesture check.** `interaction.js` decides yaw-only per
    *gesture* from `e.pointerType`, so a hybrid device gets full pitch from its mouse and
    yaw-only from a finger. Geometry can't be per-gesture, so it commits to the primary input.
  - Resolved matrix:

    ```
    device                  band cards  shape            cols  cardW  wall@near  col imb
    iPhone (393, touch)     sm      24  cylinder masonry    8  13.09      83%      1.05
    iPad Pro (1024, touch)  md      45  cylinder masonry   14  13.09     164%*     1.22
    iPad Pro + trackpad     md      45  full sphere         -      -        n/a       -
    Desktop (1440, mouse)   md      45  full sphere         -      -        n/a       -
    Narrow desktop (500)    sm      24  banded sphere       -      -        n/a       -
    * >100% = the wall bleeds past the top/bottom edges — intended immersive framing on a
      large screen (77% of the centre-plane frustum).
    ```

- **Yaw-only devices render a CYLINDER, not a sphere.** This replaced the truncated-sphere
  approach and is a *solution* to the yaw-only problem rather than a mitigation of it: every
  card's normal is **horizontal**, so obliquity depends only on azimuth — exactly what yaw
  controls. Yaw can therefore bring **any** card to 0° face-on at any height. (The banded
  sphere could only reduce worst-case obliquity to 44°, because latitude tilted every card
  and yaw couldn't touch it.) Reads as the sphere's caps unfolded up and down into a wall.
  - **Layout is cylindrical MASONRY** (`cylinderMasonryLayout`) — fixed columns around the
    circumference with cards packed down each one. This replaced a golden-angle helix, which
    had two visible faults: golden-angle spacing is only even in the *limit*, so at 24 cards a
    45° sector held anywhere from **2 to 4** cards (crowded and bare verticals); and equal-area
    normalization traded height against width, so heights varied **1.63×** and nothing lined up.
  - **Uniform WIDTH is what fixes the alignment; varying HEIGHT is the effect.** Card width is
    set to the column width — identical for every card, so columns read as true verticals —
    while height follows each image's native aspect (**2.25×** range), which is the masonry
    stagger. This makes `SPHERE_AREA_NORM` unnecessary on this path (set to 0).
  - **Cards go to the currently SHORTEST column, TALLEST CARD FIRST** — the classic
    longest-processing-time-first heuristic. Greedy alone isn't enough: packing in source order
    leaves the tall cards until last, where nothing balanced remains, leaving one column
    **1.64×** another. Placing tall cards while every column is still short drops that to
    **1.05**. Reordering is free here — the layout already scatters consecutive cards (0 of 23
    adjacent pairs share a column), so authored order carries no spatial meaning, and modal
    prev/next walks card *index* and spins to whatever slot the card holds. Each column's stack
    is then centred about y=0, so a short column sits centred rather than hanging from the top.
  - **Column count is DERIVED, not fixed** (`CYL_COLS_FIT` 0.80): the fewest columns whose
    tallest column still fits that fraction of the frustum height. It has to scale with the
    card count — a fixed count suited to sm's 24 cards left md's 45 stacked ~6× past the
    viewport. Resolves to 8 columns on sm, 14 on md (and at 50 cards); ~3–4 cards per column.
    **This is the wall-HEIGHT dial**: lowering it adds a column, which narrows the cards and
    shortens the wall (0.95 → 0.80 took sm from 117% of the near-face frustum, bleeding well
    past the edges, to 83%).
  - **`CYL_ASPECT_CAP` (1.5)** clamps how extreme a card's aspect may get, so one 16:9
    panorama can't dominate a column. Not a distortion — the existing cover-crop UVs simply
    crop harder. Note `imgAspect` is therefore derived from the *solved* size, not the raw
    image aspect, so the rounded-corner SDF still matches the rendered shape.
  - **`CYL_GAP_RATIO` (0.20)** is the breathing-room dial, setting both gaps (card width =
    column pitch / (1 + ratio)). Verified no overlap in either direction: min vertical gap
    in-column 2.62 and horizontal *chord* clearance 2.22–2.49 (the chord matters, not the arc
    — flat cards cut across the curve).
  - **No roll jitter on this path** — the columns lining up *is* the effect, so any tilt
    reintroduces the ragged look it was built to fix.
  - **`CARD_FACE_CAMERA` drops 0.5 → 0.35.** Still wanted — limb cards are edge-on until spun
    round — but a cylinder has no polar cards to rescue, so it's only limb polish now.
  - `POLAR_BAND` is retained in the overlay as an inert `1` (it means nothing for a cylinder)
    so the shape-key contract stays uniform across both paths.
- **Superseded — the truncated sphere (`POLAR_BAND`), kept because precise-pointer narrow
  windows still use it.** Under it
  the Fibonacci distribution is clipped to a latitude band — `fibSpherePos` spreads
  `cos(polar)` over `[−band, +band]` instead of `[−1, +1]`, chopping the polar caps off and
  leaving a barrel / "sphere section": still curved like a globe, just wider than tall
  (1.26:1 silhouette at `band = 0.7`).
  - **Why.** Touch is yaw-only, and yaw can never change a card's latitude. A card's
    best-case obliquity at its ideal yaw is exactly `|polar − 90°|`, so polar-cap cards stay
    edge-on however far the user spins — at `band = 1`, 3 of a phone's 24 cards (and 7 of an
    iPad Pro's 45) sat at 66–90° oblique and were effectively unseeable. `band = 0.7` gives a
    46–134° polar range, dropping worst-case obliquity to 44°, so **every card becomes legible
    with yaw alone** (cards >60° oblique: 3 → 0 on sm, 7 → 0 on md-touch). Neighbour spacing
    also improves (8.16 → 11.46 world units).
  - **Precise-pointer devices keep `POLAR_BAND: 1`** (full sphere) at any width — free
    rotation can pitch any card to face the camera, so nothing is permanently oblique. The implementation scales the original
    full-sphere expression (`band * (1 - 2i/total)`), so `band = 1` reproduces the previous
    positions **bit-for-bit** — verified across 179 positions at N = 24/45/50/60, max
    deviation 0. Desktop is untouched.
  - **Two side effects worth knowing.** (1) The banded sm globe covers ~41% of viewport height
    instead of ~55%. This is deliberately *not* compensated by pulling `CAM_Z_SPHERE` in: the
    equator is unchanged, so the globe already fills ~98% of the frustum width in portrait
    and any closer clips it horizontally. (2) `lookAt` with `worldUp = (0,1,0)` is degenerate
    exactly *at* the poles, which the band now excludes — so banding is strictly safer
    numerically than the full sphere.
- **Density + facing pass (fixing the "edgy / unevenly distributed" touch-device read).** Three
  independent causes were measured; note that **adding cards fixes none of them** — screen-space
  nearest-neighbour spacing is already even at N = 24 (CV 0.26) and gets *worse* with more
  cards (CV 0.41 at N = 48, 0.46 at N = 60) because near/far foreshortening variance grows.
  - **Edge-on slivers → `CARD_FACE_CAMERA` (`0.5` under the yaw-only overlay, else `0`).** `POLAR_BAND` only fixed the
    *latitude* component of obliquity. A radially-facing card's obliquity equals its angular
    distance from front-center, so cards at the left/right limb render as near-invisible
    lines — the *azimuthal* component, intrinsic to a sphere and unfixable by redistribution.
    `applyCardFacing` turns each card partway from radial-outward toward the camera. Result:
    slivers 5 → 0, front-hemisphere worst obliquity 81° → 41°.
    - **It must be per-frame, not baked into `card.sphereQuat`.** The sphere rotates, so a
      build-time tilt rotates with it and stops pointing at the camera — and since sm is
      yaw-only, *every* card cycles through the limb.
    - **The alignment target is `sign(n.z) × viewDir`, not `viewDir`.** A uniform blend
      toward `+Z` rotates a back-hemisphere card (normal ≈ −Z) to perpendicular — creating
      the very sliver it removes (verified: back card 180° → 90°). Aligning each card toward
      whichever pole it already faces keeps back cards fully facing away (visible from
      behind; `CARD_FRAG` mirrors `uv.x` for back faces).
    - Applied at **three** sites, all of which must agree or the card visibly snaps:
      `placeSphereCard`, `snapCardToSphereSlot` (reparent — the one-frame flash it exists to
      prevent), and `placeFoldingCard` **scaled by `fdE`** so the tilt eases in over the fold
      and arrives exactly continuous with the sphere branch (verified: 0.00e+0° apart).
  - **Uneven card SIZE → `SPHERE_AREA_NORM` (`0.5` under the yaw-only overlay, else `0`).** This was the actual cause
    of the remaining "some places dense, some sparse" read, and it is not a distribution
    problem at all. On the sphere a card keeps its image's **native aspect**: height is fixed
    at `CARD_H_SPHERE` and width scales with `sphereScaleX`, so a 16:9 image ends up **2.67×
    the area** of a 2:3 one. Wide cards blot out their neighbours (at the previous sizing the
    widest had `gap/maxHalfDiag` = 1.25 — they physically **intersected**) while tall narrow
    ones leave gaps. Scaling *both* axes by `sphereScaleX^-norm` equalizes area exactly at
    `norm = 0.5` (area ∝ scaleX·scaleY = ssx·ssx⁻¹ = 1) and leaves the aspect ratio — and
    therefore the image — completely undistorted. Area spread **2.67× → 1.00×**.
    - Baked once into `card.sphereScaleSX` / `sphereScaleSY` at build time (raw
      `sphereScaleX` is kept because the arc/grid phases and the modal still size from it).
      Applied at the same three sites as the facing tilt, **plus** `modal.js`'s close-animation
      target — that one also needed `applySphereFacing` injected, since it lands on the sphere
      orientation and would otherwise jump on the final frame when `snapToSphereSlot` runs.
    - `norm = 0` reproduces the old `(sphereScaleX, 1)` scaling **exactly**, so
      precise-pointer devices are untouched (verified across ssx 0.5–3.0). The rounded-corner SDF is unaffected: uniform
      scaling preserves w/h, so `uAspect` still matches and corners stay circular.
  - **Sparseness → `CARD_H_SPHERE` 6.0 → 11.0 on sm** (the sphere path; the cylinder path
    solves its own sizing from the column layout). The other half of the "uneven" read was
    plain low coverage: 24 cards at 6.0 covered only **12.4%** of the sphere face, so the eye
    saw accidental clusters in black space rather than a surface. Coverage scales with
    **H²**, making size a far stronger lever than count — and unlike count it adds **no
    textures and no draw calls**. This is the *nominal* height before `SPHERE_AREA_NORM`
    rebalances it; net **~42%** coverage with the widest card still clearing its neighbours
    (`gap/maxHalfDiag` 1.60). Only affects the sphere phase; `CARD_W_ARC` drives the arc.
  - **Scatter → `CARD_ROLL_JITTER` (sm `0.18` ≈ ±5°, md `0.5` ≈ ±14°).** The per-card random
    roll was previously a hardcoded ±14°, which at sm's sparsity read as scattered debris
    rather than a structured surface. Now per-BP; md keeps the original collage character.
- **Touch gesture arbitration — yaw-only, via a directional axis lock** (`interaction.js`).
  On a touch device a vertical drag *is* the page-scroll gesture, so the globe can't also
  claim it. Touch therefore gets **yaw only**: horizontal drag spins the sphere, vertical
  drag scrolls the page. Pitch (`drag.velY`) stays **mouse-only** — a pointer has no
  competing gesture. The canvas's `touch-action: pan-y` (`authoring.js`) makes the browser
  hand vertical pans to the page, but that alone isn't sufficient: moves arriving *before*
  the browser commits to the pan would still leak a pitch kick into `velY`. So the axis is
  resolved in JS from the first decisive movement — `AXIS_LOCK_THRESHOLD` (8px) of travel
  from the down point, then **latched** for the rest of the gesture (a curved swipe can't
  flip axes mid-drag). Below the threshold *neither* axis acts, and a 45° tie resolves to
  vertical (scroll wins ambiguity). `isTouchDrag` is recorded **per gesture** from
  `e.pointerType` (`touch`/`pen`), so a touchscreen laptop gets the lock for finger input
  and full pitch for its mouse — no capability sniff.
  - **Taps are deliberately not gated on the lock.** `CLICK_MAX_MOVE` (10px) exceeds the
    8px lock threshold, so a jittery fingertip tap may well have latched an axis; gating
    the tap on it would swallow those taps. `onPointerUp`'s distance/time test is
    independent, so tap-to-open-modal is unchanged.
  - **`isPageScrollGesture()`** is exported for per-frame stages that read
    `drag.isDragging` as "the user is working the globe." During a vertical touch drag
    `isDragging` is still true, so the hint-dismissal stage (`updateHintExitProgress`)
    must skip it — its hold-time term (`+0.0022`/frame ≈ 0.13/s) would otherwise accrue
    during an ordinary scroll and retire the "Click & Drag" hint past
    `CURSOR_HINT_DISMISS_T` (0.12) in ~1s of scrolling, without the user ever having spun
    the globe. The predicate is gated on `drag.isDragging` too, since `isTouchDrag`
    persists after pointerup.
  - No dwell is required for this to work: touch scrolling is self-terminating, so on
    lift the sphere is stationary and `sphereFormT >= 0.8` holds for the rest of the
    runway — the user can stop anywhere and spin. Scroll and spin are mutually exclusive
    in *time*, so they never arbitrate. (The separate question of how easy it is to
    *land* on the pristine formed globe is a pacing matter — see Open items.)
- **`.globe-gallery`-scoped type-scale tokens in `globe-gallery.css`.** The prototype relied on
  `:root` tokens from a typography stylesheet Milo doesn't ship. `globe-gallery.css` defines
  the needed `--font-display`/`--type-title-1-*`/`--type-body-*` tokens scoped to
  `.globe`. Keep in sync with `hub-creative/styles/global/typography.css`.

## Open items / backlog

Done: ~~scope DOM to `el`~~
(now class-scoped to the block root, multiple globes per page supported);
~~align `N_TOTAL`/grid to authored count~~ (md renders every authored card, surplus
flowing into off-screen grid columns; sm hard-caps at 24 — see authoring contract); ~~scroll feel~~ (on a c2 page Milo loads Lenis with
`autoRaf:true` in `utils.js`, so `window.scrollY` *is* the Milo-approved
smooth-scroll position — no separate setup needed); ~~v1 scope decided~~ (core
arc→grid→sphere→zoom; modal + a11y + CA are fast-follow); ~~extract the a11y gallery
into its own DI module~~ (`a11y.js`); ~~`MODAL_PHASE` state-machine constants~~
(frozen enum, now in `modal.js`); ~~DRY modal magic numbers~~ (`MODAL_CAM_DIST`,
`SDF_CORNER_RADIUS`); ~~extract the modal into its own DI module~~ (`modal.js` —
`createGlobeModal(deps)`; the sphere coupling stayed narrow: shared
`sphereRotQuat` + `snapToSphereSlot` / `requestNavNudge`, with the orientation +
the nav-nudge spring kept in `updateSphereRotation`).

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
   Now that touch is **yaw-only** (see Behavior notes), the hint arguably wants copy that
   says *swipe sideways* rather than the desktop "Click & Drag" — it's the authored hint
   string (row 2), so it's an authoring/localization change, not code.
2. **Zoom landing zone (pacing, not interaction).** `zoomT` begins the instant the fold
   ends, and the zoom uses `easeOutCubic` (3× speed at onset ≈ 91 world units of camera
   travel per viewport-height). The window where the sphere is interactive *and* the
   camera is still parked is only `progress` 0.265→0.322 ≈ **238px of scroll** at the
   default 630vh runway — narrower than one casual flick, so users often meet the globe
   already partway into the zoom rather than at its composed best. If that reads as a
   problem on a real device, the cheap fix is delaying the zoom's start (a gap between
   `foldLast` and where `zoomT` climbs) rather than a true scroll-park, which would mean
   remapping `progress` across the whole timeline. Affects desktop equally.
3. **Pause the rAF loop when off-screen** via `IntersectionObserver` (pdf-space does
   this — start/stop the ticker on intersect), instead of running every frame. Behavior
   change (must keep a generous `rootMargin` so the `ENTRY_LEAD_VH` pre-roll + pull-quote
   exit aren't cut off). Now more worthwhile since reduced motion also
   keeps the ticker running on a static globe.
4. **Handle WebGL context loss while running** (`webglcontextlost`/`webglcontextrestored`):
   today only context-creation *failure* is caught (→ `--empty`); a context lost mid-run
   after a successful init would blank the canvas with no recovery. Listen + rebuild GPU
   resources, or collapse gracefully.
5. **Consider removing the global SVG-filter CA ("Option C", `updateGlobalCA` + the
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
