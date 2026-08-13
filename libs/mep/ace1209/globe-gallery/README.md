# globe — C2 block

A scroll-driven **Three.js WebGL** hero, running in a real Milo page. The core
arc→grid→sphere→zoom, the detail modal, the a11y gallery, and chromatic aberration (CA) are all
shipped; remaining items are in Open items / backlog.

**New here, or changing *when* something happens?** Read **Lifecycle timeline** — it maps every
scroll position to what each subsystem is doing, and names the six separate normalized clocks the
code mixes.

## What it is

Over a tall, pinned scroll range (`--runway-height` in the CSS), the authored photo cards
(any count on desktop; first 24 on mobile — but the **modal browses all** authored images on
mobile, see Card count) animate through four phases:

```
0.00–0.55  Arc       cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5-nominal grid (staggered)
~0.37–0.78 Sphere    each card folds onto a fibonacci sphere as it lands
                     (sm + any touch device: a cylinder wall instead — see below)
0.78–1.00  Zoom      a perspective camera flies through the sphere
```

Once the sphere forms (`sphereFormT >= 0.8`) it's **interactive**: drag to spin,
tap a card to open a detail **modal** (separate WebGL canvas + HTML chrome). Mouse
drags spin **yaw freely** but **pitch is clamped to ±60°** (cards never pass vertical
or read upside down, and the globe self-levels); **touch drags spin yaw only** so
vertical swipes stay page scroll, and **the barrel is yaw-only for mouse too** (pitch
follows the geometry, not the pointer — a cylinder can't centre vertically). See
Sphere rotation + Touch gesture arbitration.
Extras: per-frame chromatic-aberration SVG filter, a fixed arc-copy overlay, a
fixed pull-quote that fades in near the zoom end, a WebGL **"Click & Drag" hint
text** behind the sphere (warps in on fold, dissolves away on first drag — see
Behavior notes), and a **two-level a11y gallery** (see Accessibility below): a single
focusable entry widget whose Enter opens a keyboard/screen-reader browse mode that tabs
through each image (centring it on the globe) rather than exposing a flat per-card list.

## Files

| File | What it is |
| --- | --- |
| `globe-gallery.js` | The block + sphere render core. `export default init(el)` → builds DOM, runs `createGlobeGalleryRuntime()` → `{ init, destroy }`. Holds the *visual* tuning constants + pure helpers (module scope) — all scroll-**timing** constants live in `timeline.js` — and the stateful core (arc/grid/fold/sphere placement, drag-rotation physics + the sphere-to-card alignment ease, lifecycle). `tick()` is a thin orchestrator over named single-concern stages plus `modal.*` / `a11y.*`; per-card placement is a dispatcher (`updateCardTransform`) over four branch fns (`placeSphereCard`/`placeFoldingCard`/`placeGridCard`/`placeArcCard`). Instantiates the DI modules. |
| `authoring.js` | `parseAuthoredContent` + `fetchFragmentCards` + `buildGlobeDom(el, labels, { arcCopy, pullQuote })` (+ internal parsers). Reads the block rows positionally, fetches the card fragment, and builds the canvas/overlay/modal DOM — minting + returning the per-instance `gid` id suffix, filling the arc-copy / pull-quote slots. Badge logos are `/federal` assets resolved via Milo's `getFederatedUrl`. |
| `shaders.js` | GLSL: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`, `TEXT_FRAG`. Card/modal frags round corners with one analytic SDF (`rrSDF`, `uRadius` = 22/631 of height + `uAspect`), no rasterized mask (`MODAL_FRAG` `uRadius` 0 on mobile). `TEXT_FRAG` (the hint) adds a barrel warp + particle dissolve + the `uExitP` one-way exit. |
| `materials.js` | GPU-asset factories (all named exports, no per-instance state). **Materials:** `createCardMaterial` (card ShaderMaterial — cover-crop + optional CA/warp + SDF corners, with the property-proxy), `createModalMaterial` (modal SDF), `createTextMaterial` (hint `TEXT_FRAG`, uniforms only). **Textures:** `loadCardTextures({ maxTex })` (cover-cropped `CanvasTexture` per card, downscaled to the per-device cap — see Texture memory budget), `loadModalTexture(src, maxTex, onReady)` (lazy full image at a higher cap, returns the pending `Image` to cancel), `createClickDragTexture(aspect, hintText)` (renders the hint string, auto-scaled font). |
| `a11y.js` | `createGalleryA11y(deps)` → `{ setup, updateTabStops, teardown, isBrowsing }`. The two-level gallery (see Accessibility). All runtime state + actions (`centerCard`, `openCard`, `onFocus`) injected; holds no globe state but its DOM. |
| `modal.js` | `createGlobeModal(deps)` → `{ setup, resize, render, updateAnimation, updateDesktopNav, open, navigate, close, getModalIdx, isCardManaged, destroy }`. The card-detail modal: own WebGL canvas/scene, the `MODAL_PHASE` state machine, SDF material swap, cross-warp nav (all breakpoints), touch swipe/pull gestures (gated on a coarse primary pointer, so tablets at ≥768 get them too), chrome layout in a native `<dialog>`. Owns all modal tuning constants. `getCount()` is the FULL authored count (see Card count). Sphere coupling is narrow + injected: shared `sphereRotQuat` + `snapToSphereSlot` / `applySphereFacing` / `requestNavNudge` / `applyMotionCA` callbacks. |
| `math.js` | Pure stateless helpers. **Easings:** `easeOutCubic`, `easeInOutCubic`, `easeOutSine`, `lerpN`. **Arc-phase geometry:** `arcRotationEase`, `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ` — the fanned-arc layout + CSS↔WebGL bridge, derived from the viewport + `ARC_SPAN` + the per-frame `arcCtx` the core owns; `getFanData`/`cssToWorld`/`rotateArcPoint` take an optional `out` and **write into it** (the core passes reused scratch objects), so per-frame card placement produces no garbage. |
| `timeline.js` | **The scroll timeline.** Every phase constant, entry knob and threshold, plus `createFrame` / `createFrameInput` / `deriveFrame(frame, input)` — the pure derivation of all six clocks (`progress`, `arcCopyEntryT`, `arcPanT`, `gridFormT`, `sphereFormT`, `zoomT`) — and `cardFoldStartProgress(gpDelay)`, the per-card fold gate that `FOLD_FIRST_PROGRESS` is the `gpDelay = 0` case of. No THREE, no DOM, no closure state, so it is unit-testable in isolation and is the single place to change **when** something happens. `deriveFrame` writes into a caller-owned frame, allocates nothing, and clamps NaN-safely (a degenerate viewport/runway makes the ratios 0/0, and one NaN would poison every mesh position). Imported as a namespace (`import * as TL`, mirroring `THREE`) so adding a threshold doesn't mean editing an import list. See Lifecycle timeline. |
| `interaction.js` | `createInteraction(deps)` → `{ setup, teardown }`. Canvas pointer plumbing: drag-to-spin, click-vs-drag, raycast hover + click→modal. Shares drag velocity by reference via the `drag` object. Owns the **touch axis lock** and exports `isPageScrollGesture()` (see Behavior notes). Cedes its hover cursor to the custom cursor via `isCursorActive()`. |
| `cursor.js` | `createCursor(deps)` → `{ setup, update, teardown, isActive }`. The desktop custom cursor (see Behavior notes): two body-level layers (`mix-blend-mode` disc + fixed chevron/label container), per-frame state from injected getters, the two-step retirement, `isActive()` gating interaction's cursor. No-op on touch. |
| `globe-gallery.css` | Globe-only CSS. Also defines `.globe-gallery`-scoped type-scale tokens (see Behavior notes). |
| `three-src.js` | Build entry — re-exports only the Three.js symbols the block uses. |
| `three.module.min.js` | Tree-shaken Three.js r160 ESM build (~453KB). Build artifact — do not edit. |
| `package.json` | Local mini build. `npm install && npm run build` regenerates `three.module.min.js`. |

Experimental block: loaded via MEP from `libs/mep/ace1209/globe-gallery/` — **not** registered in
`C2_BLOCKS` (`libs/utils/utils.js`). `three.module.min.js` and `src/three-src.js` are eslint-ignored
(the compat config skips them — the tree-shaken bundle and the bare `three` build-entry import).

### Module layout

`globe-gallery.js` is organized top-down: (1) module-scope tuning constants (the core's tuning
surface); (2) domain helpers `fibSpherePos` / `cylinderMasonryLayout` (generic easings + `lerpN` +
the arc-phase geometry live in `math.js`); (3) `createGlobeGalleryRuntime()` — the per-instance closure
holding sphere state + behavior. The active breakpoint's resolved render profile is one frozen `bp`
object built by `resolveBpProfile()` on each (re)init; functions destructure what they need from it,
DI getters read `bp.*` live. Inside the closure the **per-frame pipeline** is single-concern stages
run in a fixed order by `tick()`: `computeFrame()` is a thin wrapper that refreshes the persistent
`frameInput` from live layout/scroll state and calls `timeline.js`'s pure `deriveFrame`, which writes
every clock onto the persistent `frame` context (scroll + the six clocks + card-entry transforms);
each stage reads what it needs from it and the producer stages write results back onto it
(`activeCamera`, `sphereRotActive`, `sphGroupZ`), so one object flows through to the card loop.
**`frame` and `frameInput` are allocated once and mutated in place** — stages consume them
synchronously within a tick and never retain them, so the per-frame pipeline allocates nothing.
`frame` is also the single source for the clocks: read `frame.progress` / `frame.zoomT` rather than
caching them in the closure. (In `globe-gallery.js` the persistent object is named `frameState`;
stages take it as a parameter named `frame`, so the two don't shadow.)

Who writes what:

| | fields |
| --- | --- |
| `frameInput` ← the runtime, each tick | `scrollY`, `reducedMotion`, `blockDocTop`, `blockHeight`, `formPx` (= `formedScrollPx()`), `viewportH`, `arcScale` (= `CARD_W_ARC / CARD_W_SPHERE`), plus `prevLenisY` — the **only** inter-frame scroll state, carried back from `frame.lenisY` after each derive (and re-baselined in `startTicker`, so a resume after an off-screen scroll doesn't spike `scrollVel`) |
| `frame` ← `deriveFrame` | `lenisY`, `scrollingDown`, `scrollVel`, the six clocks (`progress`, `arcCopyEntryT`, `arcPanT`, `gridFormT`, `sphereFormT`, `zoomT`), `gpWin`, and the arc-branch entry transforms `entryRot` / `entryYOffset` / `arcScale` |
| `frame` ← the producer stages | `activeCamera` (`updateActiveCamera`), `sphereRotActive` (`updateSphereRotation`), `sphGroupZ` (`updateSphereGroupDepth`), `foldSphDist` (same) — declared in `createFrame` so the object's shape stays monomorphic |

**Grouped closure state.** Related mutable state is held in small plain objects rather than loose
`let`s, so the runtime closure stays legible: `drag` (`isDragging`/`velX`/`velY`, shared by
reference with `interaction.js`), `masonryMorph` (`active`/`t`), `sphereOrient` (`x` = pitch, `y` =
yaw, `z` = roll — see Sphere rotation), `navNudge` (`active`, `target{X,Y,Z}` = destination pose,
`start{X,Y,Z}` = pose captured when armed, `frame`/`frames` = elapsed/total count from
`KEY_BROWSE_FRAMES` or `KEY_MODAL_FRAMES`; `targetZ` is roll, set by keyboard centring only — the
modal leaves it as-is), `arcCopy` (`el` + the last-written style strings `startSide`/`startStr`/
`opStr`/`transformStr`, so `updateArcCopy` only touches the DOM when a value actually changed), and
`ctxLoss` (`rebuilds`/`stableTimer`/`recovering`/`recoverTimer` — see WebGL context loss).

Per-card placement (the largest stage) is a dispatcher over four runtime-scope branch fns — kept in
this file, not a module, because they read deeply from the closure and run in the hot loop. Five DI
modules are injected with live-state getters: GPU resources (`materials.js`), the a11y widget, the
modal, `interaction.js` (sharing drag velocity via the `drag` object), and the cursor (its
`isActive()` gates interaction's hover cursor). The modal owns its canvas/scene + the `MODAL_PHASE`
state machine and reaches the sphere only through the shared `sphereRotQuat` / `snapToSphereSlot` /
`requestNavNudge` callbacks.

## How to run

To regenerate Three.js after adding a new `THREE.*` call: add the symbol to
`three-src.js`, then `cd libs/c2/blocks/globe-gallery && npm install && npm run build`.

## Authoring contract

The block expects up to **four direct child rows** (the hint and pull-quote rows
are optional):

| Row | Purpose | Content |
| --- | --- | --- |
| 0 | **Arc-copy** | heading → `.globe-gallery-arc-copy-title`; remaining `<p>`s → `.globe-gallery-arc-copy-body` (each authored paragraph is reused as-is, inline markup included) |
| 1 | **Cards** | a Milo fragment link with `#_dnb` appended (see below) |
| 2 | **Hint + instructions + labels** | first `<p>` → WebGL "Click & Drag" affordance (falls back to `Click & Drag` if empty/absent); optional second `<p>` → a11y entry-widget instructions (English fallback); optional third `<p>` → the four UI labels, `\|\|`-separated in on-screen order **prev-arrow \|\| card-position template \|\| next-arrow \|\| close** (each part falls back to English) |
| 3 | **Pull-quote** | heading → quote; first `<p>` → name; second `<p>` → role |

Rows are positional. `parseAuthoredContent(el)` returns
`{ arcCopy, pullQuote, fragmentHref, hintText, instructions, labels }` (`labels` =
`{ prevCard, nextCard, closeBtn, cardLabel }`, built by `buildLabels` from row 2's
third `<p>`); cards are loaded separately from the fragment link by `fetchFragmentCards`.

### Fragment loading

Row 1 links a DA fragment **with `#_dnb` appended** (e.g.
`/homepage/fragments/…/globe-cards#_dnb`). `#_dnb` tells Milo's
`decorateAutoBlock()` to skip auto-resolution so the raw `<a href>` stays in the
DOM. `fetchFragmentCards(href)` strips the hash and fetches `href + '.plain.html'`
itself — AEM Edge Delivery returns all card sections as bare `<div>`s (one per
`---`). Without `#_dnb`, Milo injects sections one-by-one before `init()` fires,
racing the parse.

Cards come solely from the fetched fragment. If the fetch yields none — a failed
request, or no fragment link authored — the block collapses to `.globe-gallery-empty`
(`height:auto`) rather than rendering an empty scene. There is no inline-DOM-card
fallback (authoring is expected to provide a valid fragment link). (Distinct from
`.globe-gallery-reduced`, the reduced-motion render path — see Accessibility.)

The same `--empty` collapse is the fallback when **WebGL is unavailable**: `initRuntime`
creates the `WebGLRenderer` in a `try/catch` (Three.js throws when `getContext` returns
null — blocklisted GPU/driver, refused software renderer, headless/sandboxed context, or a
context lost on a breakpoint-crossing rebuild). On failure `initRuntime` returns `false`,
the caller adds `--empty`, and no ticker starts — so the block degrades to a collapsed
section instead of throwing out of `init()` or running on a null renderer.

**WebGL context loss while running** IS handled. Three.js drops every GPU object on
`webglcontextlost` and doesn't re-upload, so a mid-run loss (GPU process reset, driver TDR,
low-memory eviction) would leave a blank canvas. `initRuntime` binds `webglcontextlost`/
`webglcontextrestored` on **both** canvases (main + modal, `bindContextListeners`): lost stops the
ticker and clears `renderReady`; restored rebuilds all GPU state via the same
`destroy()`+`initRuntime()` path a breakpoint crossing uses. The two canvases' restore events are
coalesced into ONE rebuild (`ctxLoss.recovering` guard + a macrotask defer). A rebuild cap
(`MAX_CONTEXT_REBUILDS`) collapses to `--empty` under sustained GPU pressure rather than looping;
the counter resets once a rebuild survives `CONTEXT_STABLE_MS`. (Three.js's renderer already
`preventDefault()`s the lost event — which is what makes the browser fire `restored`.)

Regression-test with the `WEBGL_lose_context` extension: `const x = document.querySelector('.globe-gallery-canvas').getContext('webgl2').getExtension('WEBGL_lose_context'); x.loseContext(); setTimeout(() => x.restoreContext(), 1000);`
— the globe repaints within a frame or two of `restoreContext()`.

### Card shape

`{ img, alt, picture, name, role, description, badges:[{name, role, href, icon}] }`
(`href` = optional product link on the badge name; `icon` = optional decorated `<picture>` markup for the authored logo SVG, else null;
`description` = an **array of authored `<p>` elements**, not a string — see *Reusing authored paragraphs* below)

Each fragment section is flat P/UL elements:

| Element | Becomes | Notes |
| --- | --- | --- |
| `<p><em>…</em></p>` | **role** | only when the `<em>` is the *whole* paragraph; first one wins; empty if unauthored (no hardcoded default) |
| `<p><strong>…</strong></p>` or `<h1>`–`<h6>` | **name** | `<strong>` must be the *whole* paragraph; first one wins; empty if unauthored (no hardcoded default) |
| every other non-empty `<p>` | **description** | any number of paragraphs, in authored order, shown in the modal — inline `<a>`/`<strong>`/`<em>` are preserved (a sentence with emphasis or a link stays description; it is not mistaken for the name/role) |
| `<ul>`, one `<li>` per badge | **badges** | see below — nested `<ul><li>` = the product feature |
| `<p><picture>…</picture></p>` | **image** (+ its `<img alt>` → **alt**) | required — sections without one are skipped; a bare inline `<img>` works too; the **first** image wins, later ones are ignored; `alt` falls back to an `alt text to be authored` placeholder when the image has none |

**Badge rows.** A badge `<li>` splits into exactly two parts: the **nested `<ul>`** is the
product feature, and **everything else in the row** is the product — an optional logo plus the
product link that supplies the name and its click target. That's the whole rule, so wrapper
markup doesn't matter: DA emits a bare `<li>` when there's no feature and wraps the row in a
`<p>` as soon as there is one, and both parse identically.

```html
<!-- feature authored → DA wraps the row in <p> -->
<li>
  <p><a href="…/photoshop-64.svg">…/photoshop-64.svg</a> <a href="…/photoshop.html">Photoshop</a></p>
  <ul><li>Feature X</li></ul>
</li>

<!-- no feature → bare row, role left empty -->
<li><a href="…/illustrator-64.svg">…/illustrator-64.svg</a> <a href="…/illustrator.html">Adobe Illustrator</a></li>
```

The logo may be an `.svg` link (href *or* visible URL text) or a plain `<img>`; omit it and no
logo renders. It's decorative — the badge name is the labelled link — so it renders
`aria-hidden` with an empty `alt`. Assets live under `/federal` on the federated content root,
so the URL is resolved through Milo's `getFederatedUrl` (NOT `decorateSVG`, which would rewrite
the host to a bare pathname on the consumer origin). A row with no product link takes its name
from its own text and renders as plain text; a row with no feature renders with an empty role.

> The row is read from a **clone** with the feature `<ul>` detached, so the product half can be
> matched with plain `querySelector` without walking into the feature list and without mutating
> authored DOM. The earlier direct-children-only read silently dropped every `<p>`-wrapped badge
> (empty name → no row pushed), which looked like a modal layout bug rather than a parse miss.

### Reusing authored paragraphs

Both the card **description** and the arc-copy **body** hold the authored `<p>` elements
themselves, not extracted strings, and `renderParagraphs(container, paras)` moves them on screen
with `replaceChildren`. Reusing the authored node is what keeps inline `<a>`/`<strong>`/`<em>`
alive — a `textContent` read flattens them, and re-serializing to an HTML string means escaping
and re-parsing markup we already have as DOM. This is also why both containers are `<div>`s in
`buildMarkup`: paragraphs can't nest inside a `<p>`.

**Nothing is cloned, because a paragraph is never in two places.** `buildGlobeDom` and
`fetchFragmentCards` each run once per block instance, so two globes on a page parse their own
nodes and share nothing; within one globe, only one modal exists and only one card is shown at a
time. Re-rendering the same card is safe: `replaceChildren` moves nodes that a previous render
already detached (the parse holds the reference, so they survive detached), and re-rendering the
*same* nodes into the *same* container is a no-op. Cloning would only be needed if some future
feature rendered one card's paragraphs into two live containers at once.

**Card count.** `N_TOTAL` follows the authored count, capped per breakpoint by `N_MAX`:

- **md (≥768) — uncapped.** Every authored card renders. Sphere (Fibonacci) and arc (normalized
  `fanT`) are count-agnostic; the grid's 9×5 is only *nominal* (fixes card size, gap, centering
  origin) and already overflows ~1.44× as a "more cards beyond" cue, so authored cards beyond the
  nominal grid continue into further off-screen columns. `totalW`/`totalH` derive from the nominal
  dims, so **adding cards never shifts already-placed cards**. Practical ceiling is texture memory, not layout.
- **sm (<768) — barrel hard cap of 24, modal gallery uncapped.** The 3×8 grid already exceeds a
  667px viewport, so mobile renders only the first 24 on the arc/grid/barrel (`bp.N_TOTAL`, logged
  via `lana`), loading only their 24 base textures. The modal still browses ALL images (below) —
  touch users get a smaller *arrangement*, not less *content*.

**Modal gallery = all authored images.** The modal's `getCount()` is `CARD_CONTENT.length`, not
`bp.N_TOTAL` (equal on md). On sm the modal navigates past the 24 barrel cards into **overflow
images** (24…N-1) with no sphere slot: it mints a lazy **modal-only carrier** per overflow index (a
quad + SDF material in `modalScene`, its texture disposed on nav-away so ≤1 resident) that
**dissolves** in/out instead of flying to/from the globe. Barrel-slot cards still fly. Overflow is
reached only via modal **navigation** — `open()` is always a barrel card (tap / a11y browse). **All**
modal nav — on-screen arrows and touch swipe — routes through the same cross-warp
transition on **every** breakpoint (`navigate` → `startDesktopNavTransition`); touch swipe just
builds a warp preview during the drag, then commits that transition on release. The old mobile instant-swap /
swipe-neighbour slot reorg was removed — a slotless overflow card can only cross-warp anyway.
The **keyboard/SR browse gallery stays at 24** (its centring targets real sphere cards); SR users
reach every image through modal ←→ nav. Overflow carriers + textures are disposed on `destroy`.

Fewer cards than the nominal grid → the last column is partially filled (no modulo;
`getCardMetadata(i)` indexes directly). `ARC_DENSE_COUNT` = `ARC_DENSE_FRACTION × N_TOTAL`, so the
clustered:spread arc ratio holds at any count.

### Texture memory budget

Card images are downscaled to a per-device cap on upload (iOS uploads textures as uncompressed
RGBA + mipmaps; the full base set — all cards resident during the arc→grid settle — otherwise
overran the WebKit per-tab cap and crashed the tab with no JS error). Caps live in
`globe-gallery.js` (`CARD_TEX_SM/MD`, `MODAL_TEX_SM/MD`):

- **Base set** (`loadCardTextures({ maxTex })`), all cards resident — dominates. `256` on sm (just
  above the ~270 device-px a phone grid card needs, ~6MB for 24), `768` on md (~1:1 with the largest
  card render, downsampled everywhere smaller). Not an fps cost — mipmapping makes sampling track
  screen pixels; only memory + upload scale with it.
- **Modal** (opened card only), loaded lazily, disposed on close/nav, so ≤1 resident. `768` on sm,
  `2048` on md (the on-screen modal tops ~1400–1600 device px, so 2048 bounds the transient ~17MB vs
  ~64MB for a 4000px original). When the modal cap ≤ the base cap it reuses the base texture
  (`loadModalUpgrade` returns `null`); with current numbers both upgrade. Wired through `modal.js`:
  `getModalMaterial` placeholders the base texture, `requestModalUpgrade` swaps the sharper one when
  decoded, `releaseModalTexture` disposes on close/nav/destroy.

**Estimating the cost.** GPU textures store uncompressed regardless of file size: `resident ≈ w × h
× 4 × 1.333` (RGBA + the mipmap pyramid, which converges to +⅓). Dimensions are the *downscaled
canvas* (longest side = cap), not the source; cover-crop doesn't change residency. E.g. a 4:3 source
at 256 → 256×192 → ~0.26MB, ×24 ≈ 6MB; at 768, ~2.3MB (9× area); the 2048 modal texture ≈ 17MB
transient.

The **"Click & Drag" hint** (`createClickDragTexture`) is a separate line item: its canvas matches
the camera aspect, so `TEXT_MAX_SIDE` caps the *longest* side (2048) — else a portrait phone derived
a 2048×4180 ≈ 45MB canvas, mostly empty. Capped, portrait tops ~1004×2048 (~11MB).

`ANTIALIAS_SM`/`ANTIALIAS_MD` toggle MSAA per band (set at renderer creation): on for md (card
silhouettes alias without it), off for sm to save framebuffer memory (MSAA is the largest GPU cost
on high-DPR screens — framebuffers scale with `DPR²`). SDF `fwidth` edge-AA on the corners is
independent, so MSAA only affects the quad silhouettes. `destroy()` disposes every card geometry/
material/texture including each card's cached modal SDF material (Three frees GPU memory only on
explicit `.dispose()`), so a boundary rebuild doesn't leak a card set.

## Localization

The block ships **no hardcoded user-facing copy** and reads **no placeholders sheet**. Every
user-facing string is authored (block rows + card fragment) and localized with the page; hardcoded
literals in the code are only fallbacks that never show on a correctly-authored page.

**Row 2 carries all the block-chrome copy** in up to three `<p>`s, each localized inline:

| Row 2 `<p>` | String | Used for | Fallback |
| --- | --- | --- | --- |
| 1st | "Click & Drag" | WebGL hint + desktop cursor label (decorative, not exposed to AT — the a11y instructions cover the real affordance; `createClickDragTexture` auto-scales the font) | `Click & Drag` (empty-cell) |
| 2nd | instructions | a11y entry-widget accessible name (see below) | `Press Enter to enter the gallery, then Tab through the images.` (`DEFAULT_GALLERY_INSTRUCTIONS`) |
| 3rd | `prev \|\| {index} of {count} \|\| next \|\| close` | the four UI labels: modal prev/next/close `aria-label`s + the sr-only card **position** — `\|\|`-separated in on-screen left→right order (`buildLabels`) | each part → English (`DEFAULT_LABELS`) |

The card-position part is a **tokenized template**: single-brace ICU-style `{index}`/`{count}`
substituted at runtime so each locale controls word order. Single brace keeps them distinct from
Milo's `{{key}}` placeholder syntax; a value missing either token falls back to `{index} of {count}`.
The `\|\|` divider is safe because the pipe is not natural-language punctuation in any locale.

The entry widget has **no separate name label**: its authored **instructions** (row 2, 2nd `<p>`)
ARE its accessible name (one hidden-until-focus element serving as both the popup and the
`aria-labelledby` target), so a screen reader announces exactly the on-page instruction — no
redundant "N images" prefix. The modal announcement is position only (the creator name is already
in the heading).

**Also authored:** arc-copy, pull-quote, card name/role/description (rows + fragment); each
browse-image button's `aria-label` and the modal's `role="img"` label is the card's authored
**alt** (→ `alt text to be authored` when none); badge names + logos come straight from the
authored product links.

## Architecture notes

**DOM is JS-built and scoped to the block root.** `init(el)` calls
`parseAuthoredContent(el)` first (arc-copy, pull-quote, fragment href), then
`buildGlobeDom(el, labels, { arcCopy, pullQuote })` wipes the block, injects the
markup, fills the arc-copy / pull-quote slots, and **returns the `gid`** (the
per-instance unique-id suffix it mints from a module-level counter in
`authoring.js`). The runtime finds nodes by **class, queried within
`el`** (`root.querySelector('.globe-gallery-canvas')`, `.globe-gallery-modal-canvas`,
`.globe-gallery-pullquote`, `.globe-gallery-modal*`,
`.globe-gallery-ca-r-offset`/`.globe-gallery-ca-b-offset`, …) →
**multiple globes can coexist on a page**. The only id-bearing nodes are made
unique per instance via that `gid` suffix (ids, not classes, because both are
document-wide id references): the CA SVG filter (referenced from JS as
`filter: url(#ca-filter-<gid>)`) and the modal role-label/heading/description (the
`<dialog>`'s `aria-labelledby` (role + name) / `aria-describedby` IDREFs). `el` itself is the scroll runway
(height is `--runway-height` on `.globe-gallery`, collapsed to `100vh` under `.globe-gallery-reduced`);
the canvas is `position:fixed`. The shared body-level global (acceptable, one modal at a
time) is the `.globe-gallery-modal-open` scroll lock.

**Scroll model.** (For *what happens at each point* on that scroll, see **Lifecycle timeline**
below — charts + an event table. This subsection is the mechanism that gets you there.) The block
element *is* the scroll runway (its height is `--runway-height`) — there's
no separate runway element. Raw scroll is measured against the block's own metrics (`blockDocTop` =
top in document space, `blockHeight` = `offsetHeight`, both refreshed in `doLayout` + a body
`ResizeObserver`), then remapped **piecewise** (in `computeFrame`) into the `progress` 0→1 the phase
math consumes. This decouples formation length from the tail, so the runway can be trimmed without
speeding up the globe:

| segment | raw scroll | → progress | owns |
|---|---|---|---|
| **formation** (arc→grid→fold→settle) | `0 → --formation-vh` (304vh) | `0 → foldLast` (≈0.322) | the `P_*` phase constants |
| **tail** (zoom-through + pull-quote) | `--formation-vh → --runway-height` | `foldLast → 1` | `zoomT`, cursor retire, pull-quote |

Formation is **locked** to a fixed scroll length: `FORMATION_SCROLL_VH` (JS) = `--formation-vh` (CSS)
= 304vh (≈ `SPHERE_FORMED_PROGRESS` × the original 945vh single-runway tuning). `formedScrollPx()` is
the single source used by the remap, the reduced-motion pin, and the focus-snap. Within the tail,
`zoomT = clamp((scroll − formation) / (runway − formation), 0, 1)` drives the camera
(`CAM_Z_SPHERE → CAM_Z_END`), the cursor retirement, and the pull-quote.

Because formation is fixed, `--runway-height` sets tail length only. `--runway-height` is **shared**
across breakpoints; `--pq-pin-factor` is **per-breakpoint** (`@media (min-width:768px)` overrides the
sm base). CSS custom props on `.globe-gallery`:

| prop | sm (base) | md+ | effect |
|---|---|---|---|
| `--runway-height` | 520vh | 520vh | total height = formation + tail; ↓ = shorter stretch after the globe (shrinks gap **and** hold together) |
| `--formation-vh` | 304vh | 304vh | locked formation length; must equal `FORMATION_SCROLL_VH` in JS |
| `--pq-pin-factor` | 0.65 | 0.55 | share of the tail the (bottom-anchored) quote pin occupies → its hold |

sm uses a **bigger** pin factor than md on purpose: its globe clears earlier (`zoomT≈0.30` vs md
`≈0.42`), so the quote can start sooner *and* hold longer — which sm needs, because the fixed 583px
quote is taller in vh on a phone (~73vh at 800px vs ~54vh at 1080), i.e. it eats more of the pin. md's
factor is capped ~0.55: above it the fade-in would cross md's globe-clear (`zoomT≈0.42`) and land the
quote over the globe.

**Pull-quote timing is derived, not hand-set.** The pin height is `(runway − formation) ×
--pq-pin-factor`, so it always exits exactly at the runway end (no dead scroll), and the JS fade-in
threshold `pqAppearZoomT = (1 − --pq-pin-factor) − PQ_APPEAR_LEAD` (0.03) is **read from the CSS var in
`doLayout`** — so the pin geometry and the opacity trigger can't drift, per breakpoint or across a
768px resize. Higher `--pq-pin-factor` → quote appears earlier **and** holds longer (they trade off at
a fixed runway); to change both together, move `--runway-height`.

**Tuning cheatsheet** (all visual — no test harness, so eyeball each):
- *Whole stretch after the globe too long:* lower `--runway-height` (both breakpoints).
- *Quote hold too short/long, or appears too early/late:* `--pq-pin-factor` for that breakpoint (JS
  threshold auto-follows). md is capped ~0.55 (globe-clear); sm can go to ~0.67.
- *"Click & Drag" cursor lingers too long/short:* `CURSOR_ZOOM_RETIRE_T` (0.40) — keep it ≥ the md
  camera-clear `zoomT` (≈0.42... it currently fires just before, at camz≈−33, accepted) and, on md,
  `< pqAppearZoomT` so it retires before the quote. `CURSOR_ZOOM_DISMISS_T` (0.38) fades the label
  first. (Cursor is desktop-only, so sm's earlier quote doesn't affect it.)
- *Formation (arc/grid/fold) pacing:* the `P_*` constants below — independent of the runway.

Current result (from the progress math; hold is viewport-dependent since the quote is a fixed 583px):
md gap ≈91vh / hold ≈65vh; sm gap ≈69vh / hold ≈68vh.

Milo's page-level Lenis keeps `window.scrollY` in sync (gsap was dropped for a `requestAnimationFrame`
driver, `startTicker`/`stopTicker`). The modal pauses Lenis via `window.lenis.stop()/start()` plus a
`.globe-gallery-modal-open { overflow:hidden }` CSS lock.

**Ticker gating (rAF only while visible).** The loop runs only when BOTH `renderReady`
(cards built — contours paint immediately, textures fill in progressively; see Progressive
texture loading) AND `onScreen` are true; `syncTicker()` reconciles them and
is called whenever either flips. `onScreen` is driven by an `IntersectionObserver` on the
block root with a generous `rootMargin: '100% 0px'` — the root IS the tall runway, so one
extra viewport top and bottom keeps the loop alive through the `ENTRY_LEAD_VH` pre-roll (it
starts before the top edge enters) and the pull-quote exit (it continues past the bottom
edge), stopping only when the block is a full viewport away. This matters more than usual
because reduced motion also keeps the ticker running on an otherwise-static globe.
`startTicker()` resets `prevLenisY = window.scrollY` on every (re)start so a resume after a
long off-screen scroll doesn't read a spurious one-frame `scrollVel` spike. The observer is
created in `initRuntime`, disconnected in `destroy` (mirrors `layoutObs`); it fires once on
`observe()` to correct the `onScreen` default.

**Progressive texture loading (contours → un-dissolve).** Card meshes are built up front,
before any photo loads, so the block paints immediately: `initRuntime` runs
`buildCards()`/`buildTextMesh()`/`a11y.setup()` and flips `renderReady` **before**
`loadCardTextures`, seeding each card with a shared 1×1 `placeholderTex` and a placeholder
aspect. Until a card's photo lands it renders as a **contour** — a faint rounded-rect fill +
~1px edge stroke drawn in `CARD_FRAG` from the existing `rrSDF`, driven by two uniforms
(`uReveal` 0→1 = contour→photo crossfade, `uContourFade` = proxFade so the contour respects the
near-camera cull). `loadCardTextures` reports **per image** via `onEach` (plus `onDone` once all
settle; the caller owns the `textureLoadGeneration` stale-guard in both). `onEach` swaps in the
real texture, refreshes the card's cover-crop UVs + native `sphereScaleX`, and flips
`hasTexture`; `revealT` then eases 0→1 in `updateCardTransform` and the photo **un-dissolves**
in — the same edge-first particle effect as the near-camera proximity fade (`uDissolve`), so the
two compose in `placeSphereCard` by **max-dissolve / min-opacity** (neither un-hides what the
other hides). On **md** (sphere) positions are index-based (`fibSpherePos`), so a landed texture
only morphs the card's scale/aspect in place (`updateCardSphereSizing`) — never a reflow. On
**sm** the masonry barrel is a whole-set solve (packing needs every aspect), so it's packed once
with placeholder aspects and **re-solved once** in `onDone` (`resolveMasonryLayout`); each card
then eases from its provisional slot to the final one via a one-time `masonryMorph` tween
(invisible while the user is still in arc/grid, the common case). `dragFlipZ` (aspect-dependent)
is recomputed in `onDone` / when the morph settles. Images decode off the main thread
(`img.decode()` before rasterizing) so many decode concurrently instead of serializing on
`onload`. Net: `renderReady` now means *cards built* (contours visible), not *all textures
loaded* — the old all-or-nothing barrier is gone.

**Right-sized image requests.** `loadCardTextures`' `getSrc` and the modal upgrade both route the
authored image URL through `optimizeImgUrl(src, cap)` (`authoring.js`), which for a helix/DA
`media_*` asset rewrites it to `?width=<cap>&format=webply` — mirroring `libs/utils/decorate.js`'s
`decoratePictures` convention (strip query, width + `webply`). Non-`media_` URLs pass through
untouched. Because we downscale client-side anyway (`fitDims`), this only trims bytes on the wire
(≈10–30× on slow links), not the final texture resolution. A side benefit: the modal now requests
its own cap (`MODAL_TEX_MD` 2048) explicitly, so it reaches the intended sharpness instead of being
limited by whatever width the authored `<img>` src happened to be.

**Pausing must hide the canvas (multi-globe correctness).** The main canvas is
`position:fixed` + full-viewport + `pointer-events:auto`, and `updateCanvasVisibility` — the
stage that `display:none`s it when the block is out of range — runs *inside* `tick()`. So
when `syncTicker()` stops the loop it also sets `renderer.domElement.style.display = 'none'`;
otherwise a paused globe's fixed canvas keeps intercepting pointer events across the whole
viewport, which with **multiple globes per page** silently blocks whichever globe is actually
on screen (its clicks/drags/hover land on the off-screen globe's paused canvas). The resumed
loop's `updateCanvasVisibility` restores the display. A single off-screen globe hiding its
own canvas is a no-op (it's out of view anyway).

**z-index / stacking order.** All values live in `globe-gallery.css` (plus the two canvas inline
styles in `authoring.js`). Two bands in the page-root stacking context:

- **Hero — 2–5:** world `2`, main canvas `3`, arc-copy / a11y widgets `4`, pull-quote / a11y tip `5`.
- **Modal — 13–17:** backdrop `13`, modal canvas `14`, chrome `15`, cursor disc `16`, cursor container `17`.

The modal band sits just above the **C2 gnav (`12`)** so the immersive card view covers the nav, and
deliberately **below** the higher-priority interrupts that should appear over the globe — caas (`200`),
market-selector (`9999`), georouting / Milo modals (`100000`), and the consent banner. It can't collapse
into the 1–10 range precisely because it must clear the gnav. C1 core blocks (e.g. legacy gnav, the
authored `notification` block) aren't authored alongside C2, so nothing occupies the 18–199 gap here.
The modal chrome is a native `<dialog>`/`showModal()` in the top layer, so its z-index is only a
non-supporting-browser fallback.

## Lifecycle timeline

**Start here if you're changing *when* something happens.** The code that owns all of this is
**`src/timeline.js`** — every phase constant, every threshold, and the pure `deriveFrame` that
produces the clocks. Scroll model (above) explains how raw scroll becomes `progress`. This section
is the cross-section: *at a given scroll position, what is every subsystem doing?*

Nothing here is a source of truth — every number below is derived from `timeline.js`, so if you
retune a constant, re-run the snippet at the end of this section and update the tables from its
output rather than hand-editing them.

### The six clocks

Most confusion in this block comes from code that mixes normalized timers. There are six, and they
do **not** share a zero:

| clock | 0 → 1 spans | formula | read by |
| --- | --- | --- | --- |
| `arcCopyEntryT` | `ENTRY_LEAD_VH` before the block top → `ENTRY_RAMP_VH` later | raw `window.scrollY`, *not* `progress` | arc-copy fade-in, arc pre-roll, entry slide |
| `progress` | block top → runway end | piecewise remap (formation / tail) | the master clock; everything below derives from it |
| `arcPanT` | arc pre-roll → arc fully panned | `progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL · arcCopyEntryT` | arc geometry (`buildArcCtx`), `gridFormT` |
| `gridFormT` | peel start → all cards in grid | `(arcPanT − 0.30) / 0.30` | per-card peel (`gpLocalT` after per-card delay + jitter) |
| `sphereFormT` | `FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS` | `(progress − 0.039) / (0.322 − 0.039)` | camera, depth sort, interactivity, hint text, arc-copy fade-out |
| `zoomT` | sphere formed → runway end | `(progress − 0.322) / (1 − 0.322)` | zoom camera, cursor retire, pull-quote, canvas hide |

Two consequences worth internalizing: `arcPanT` is the only clock that depends on
`arcCopyEntryT`, so arc/grid timing shifts with *how the user entered the block*; and `sphereFormT`
/ `zoomT` are back-to-back (`zoomT` starts the frame `sphereFormT` reaches 1), so there is no
interactive dwell built into the scroll — the "formed globe" is a single point, not a range.

### Formation — `progress` 0 → 0.322, scroll 0 → 304vh

```
            0      37   64    90           156                 251  277   304  (vh)
            |       |    |     |            |                   |    |     |
cards       ###arc##|#####peel to grid######|..........peel done............
                       |##################fold to sphere####################
camera      ..ortho.|#############perspective -> CAM_Z_SPHERE###############
arc-copy    ######visible######|~~~~~~~~~~~~~~fade out~~~~~~~~~~~~~~~|gone..
hint text   ....hidden...|##############warp in -> faint rest###############
depth sort  ................off................|############on##############
input       ........................inert.......................|###live####
```

The overlap in the top two lanes is the point of `FOLD_PEEL_OVERLAP`: the first cards begin folding
(54vh) long before the last cards finish peeling (156vh), so the grid never visibly "resolves".

### Tail — `zoomT` 0 → 1, scroll 304 → 520vh

```
            0.00             0.30   0.42                              0.95
            |                  |      |                                 |  |
camera      ###################CAM_Z_SPHERE -> CAM_Z_END####################
globe       #sweeps past viewer|.........gone (sm 0.30 / md 0.42)...........
hint text   ~~~~~~~~~fade~~~~~~~~|..................gone....................
cursor      ##########live##########||...............retired................
quote (sm)  .......hidden.......|############in -> hold -> exit#############
quote (md)  ..........hidden..........|#########in -> hold -> exit##########
canvas      ###########################visible##########################|...
```

### Event table

`vh` assumes the default `--runway-height: 520vh` / `--formation-vh: 304vh`; `progress` and the
gate columns are runway-independent.

| vh | `progress` | gate | what happens | where |
| ---: | ---: | --- | --- | --- |
| −40 | — | `lenisY ≥ blockDocTop − ENTRY_LEAD_VH·H` | canvas `display:block`; `arcCopyEntryT` starts | `updateCanvasVisibility` |
| −40→65 | — | `arcCopyEntryT` 0→1 over `ENTRY_RAMP_VH` | arc pre-roll speeds up, cards slide up, arc-copy fades **in** (done at `entryT` 0.336) | `computeFrame`, `updateArcCopy` |
| 0 | 0.000 | block top | `progress` starts; cards on the arc | — |
| 37 | 0.039 | `FOLD_FIRST_PROGRESS` | `sphereFormT` leaves 0 → camera switches **ortho → perspective** | `updateActiveCamera` |
| ~41 | ~0.041 | `arcPanT ≥ PROGRESS_GRID_ARC_START` | arc → grid **peel** begins (staggered by `i` + `ARC_PEEL_JITTER`) | `updateCardTransform` |
| ~54 | ~0.057 | `gpLocalT ≥ FOLD_START_LOCAL_T` | first card actually starts **folding** to the sphere | `updateCardTransform` |
| 64 | 0.067 | `sphereFormT > TEXT_APPEAR_START` (0.10) | "Click & Drag" hint plane un-hides, warps in | `updateClickDragText` |
| 90 | 0.096 | 20% of the fold window | **arc-copy starts fading out** | `updateArcCopy` |
| 156 | 0.165 | `arcPanT = PROGRESS_GRID_ARC_END` | last card lands in the grid (`gridFormT` = 1) | `updateCardTransform` |
| 170 | 0.180 | `sphereFormT > 0.5` | `renderer.sortObjects` on (arc needs manual order, sphere needs depth sort) | `tick` |
| 251 | 0.265 | `sphereFormT ≥ SPHERE_INTERACTIVE_T` (0.8) | hover / drag / click / auto-rotate go **live**; a11y browse enabled | `updateSphereRotation`, `updateCardTransform` |
| 277 | 0.294 | 90% of the fold window | **arc-copy fully gone** | `updateArcCopy` |
| 304 | 0.322 | `SPHERE_FORMED_PROGRESS` | sphere/barrel formed; `sphereFormT` = 1, `zoomT` leaves 0; keyboard focus snaps here | `computeFrame` |
| 376 | 0.548 | `zoomT ≥ 1/3` | hint text fully faded | `updateClickDragText` |
| 369 / 395 | 0.525 / 0.607 | camera passes the cards | globe clears the viewport — sm ≈ `zoomT` 0.30, md ≈ 0.42 | `updateActiveCamera` |
| 373 / 395 | 0.539 / 0.607 | `zoomT ≥ pqAppearZoomT` | pull-quote fades in — sm 0.32, md 0.42 (from `--pq-pin-factor`) | `updatePullQuote` |
| 386 | 0.580 | `CURSOR_ZOOM_DISMISS_T` (0.38) | cursor label fades | `cursor.update` |
| 390 | 0.593 | `CURSOR_ZOOM_RETIRE_T` (0.40) | cursor disc retires | `cursor.update` |
| 509 | 0.966 | `zoomT ≥ 0.95` | canvas `display:none` (quote alone to the end) | `updateCanvasVisibility` |
| 520 | 1.000 | runway end | pull-quote pin exits | CSS (`--pq-pin-factor`) |

Also on the timeline but **not** scroll-driven, so absent from the charts: texture loading
(contours → un-dissolve, plus the one-time sm masonry re-solve on `onDone`), the modal
(`sphereFormT ≥ SPHERE_INTERACTIVE_T` is its only scroll gate), and `textExitProgress` — the hint
dissolve / cursor retirement accrue from **drag activity**, not scroll, and reset whenever
`sphereFormT` drops below the interactive threshold.

### Known wrinkle: `sphereFormT` leads the cards during entry

`FOLD_FIRST_PROGRESS` is computed as if `arcCopyEntryT` were already 1, but the per-card fold gate
reads the **live** `gridFormT`, which is still ramping. Entering the block from the top,
`arcCopyEntryT` only reaches 1 at `progress` ≈ 0.069, so between `progress` 0.039 and ~0.057
`sphereFormT` reports the fold as underway while every card is still on the arc. Visible effect is
limited to the camera flipping ortho → perspective ~17vh early (existing, accepted behavior). Anything newly keyed
to "the fold has started" should gate on `gridFormT`/`fdE` if it must match the cards exactly.

### Re-deriving these numbers

`timeline.js` is importable on its own (no THREE, no DOM), so this reads the **live** constants
rather than restating them — it cannot drift from the code:

```sh
cd libs/mep/ace1209/globe-gallery && node --input-type=module -e "
import * as T from './src/timeline.js';
const RUNWAY_VH = 520; // --runway-height
const tail = RUNWAY_VH - T.FORMATION_SCROLL_VH;
const vh = (p) => (p <= T.SPHERE_FORMED_PROGRESS
  ? (p / T.SPHERE_FORMED_PROGRESS) * T.FORMATION_SCROLL_VH
  : T.FORMATION_SCROLL_VH
    + ((p - T.SPHERE_FORMED_PROGRESS) / (1 - T.SPHERE_FORMED_PROGRESS)) * tail);
const row = (n, p) => console.log(String(Math.round(vh(p))).padStart(4) + 'vh', p.toFixed(3), n);
row('fold starts / sphereFormT>0', T.FOLD_FIRST_PROGRESS);
row('hint text appears', T.progressAtFormT(T.TEXT_APPEAR_START));
row('arc-copy fade start', T.ARC_COPY_OUT_START);
row('depth sort on', T.progressAtFormT(T.DEPTH_SORT_FORM_T));
row('interactive', T.progressAtFormT(T.SPHERE_INTERACTIVE_T));
row('arc-copy gone', T.ARC_COPY_OUT_END);
row('SPHERE FORMED', T.SPHERE_FORMED_PROGRESS);
row('hint text faded', T.progressAtZoomT(1 / T.TEXT_ZOOM_FADE_RATE));
row('cursor label / retire', T.progressAtZoomT(T.CURSOR_ZOOM_RETIRE_T));
row('canvas hidden', T.progressAtZoomT(T.CANVAS_HIDE_ZOOM_T));
"
```

## Accessibility

The globe is exposed as a **two-level gallery** (`a11y.js`), not a flat per-card list. Both levels
are real `<button>`s over the sphere (`pointer-events:none` so they never block mouse drag):

1. **Collapsed** — a single entry `<button>`, a **stable tab stop** (pulled from tab order only
   while the modal traps focus, or while browsing) so the block is never skipped. Enter/Space
   **enters browse mode**.
2. **Browse** — focus moves into per-image buttons that join the tab order only while entered.
   Tab/Shift+Tab walks image→image; on focus the globe rotates that image to screen centre
   (`centerCardOnScreen`; yaw-only on the cylinder) with a `:focus-visible` ring, via the shared
   frame-counted `easeInOutCubic` tween (`KEY_BROWSE_FRAMES`; see Behavior notes → Sphere rotation).
   RM snaps. Enter opens the detail modal for **that** image.

Focusing the entry button or any browse image runs `snapToInteractive` (`window.lenis.scrollTo` to
`SPHERE_FORMED_PROGRESS`), bringing the block into its interactive state *and* into view before the
ring shows (the pdf-space focus pattern). A focus guard (`suppressFocusSnap`, armed on window blur /
`visibilitychange:hidden`) stops a tab-return from re-snapping. While browsing the core pauses
auto-spin (`a11y.isBrowsing()`); mouse drag still works.

- **Keyboard:** Tab → entry; Enter/Space → browse (focus first image). Tab/Shift+Tab moves
  image→image; **Esc**, or tabbing past either end, collapses to the entry stop. Enter on an image
  opens the modal. The modal chrome is a **native `<dialog>` opened with `showModal()`**, so the
  focus trap, background `inert`, and focus-restore are the platform's. On open, focus goes to the
  **name heading** (`tabindex="-1"`), NOT the dialog container — focusing the `<dialog>` makes
  VoiceOver enumerate it as a group and swallow its name; landing on a child makes VO announce the
  dialog name then the heading. Prev/Next/Close are tab stops (native inert keeps focus in);
  navigation is via the on-screen Prev/Next buttons or touch swipe. There is **no arrow-key
  card nav** — the buttons cover keyboard + SR users, and with no document-level key handler a
  screen reader arrowing through the description text (browse / virtual-cursor mode) is never
  hijacked. **Esc** (the `cancel` event,
  `preventDefault`'d so the close animation plays) / Enter-on-Close exit and the dialog **restores
  focus to the opening image**. No backdrop-click-to-close; no arrow-key globe rotation (browsing
  replaced it).
- **Instructions popup:** on focus the entry widget shows a **visible pill** so sighted keyboard
  users get the affordance (a11y audit). ONE element (`.globe-gallery-a11y-tip`) — hidden by
  default, shown on `:focus-visible`, and simultaneously the button's `aria-labelledby` target, so
  SRs announce the same text as the accessible name. Copy is `image-gallery-instructions`.
- **Screen reader:** the entry button has **no separate label** — its instructions popup IS its
  accessible name. Each browse image's `aria-label` is its authored **alt**. On modal open focus is
  on the **name heading** (a child), so VoiceOver reads the heading + its `aria-describedby` (role +
  position); forward-nav then walks role → name → description → badges → photo before the controls.
  The photo is a `role="img"` sr-only element placed AFTER the info block (so the heading reads
  first), carrying the card's alt as a real text alternative. The card **position** ("N of M") lives
  in one sr-only element referenced by BOTH the dialog's `aria-labelledby` and the heading's
  `aria-describedby` — **no `aria-live`** — so it's deterministic on both paths: on open it's read
  with the focused heading; on nav (focus stays on Prev/Next) the accessible-name text changes, so
  VoiceOver re-announces the dialog name. (A live region would be more portable across AT but
  couldn't reliably cover the open case, which is why it was dropped.)

**Reduced motion** (`prefers-reduced-motion: reduce`) renders a **static interactive** globe
instead of the scroll choreography, laid out as **plain document flow** (`.globe-gallery-reduced`):
`computeFrame` pins scroll to `SPHERE_FORMED_PROGRESS` (formed sphere, `scrollVel` 0), auto-spin is
off (drag + arrow-spin still work), the hover fisheye/scale/CA is suppressed (`hoverTarget` forced
to 0 in `updateCardTransform`; the `cursor:pointer` affordance stays), and the modal snaps with no
fly/warp (the modal reads RM through a **live getter** — it's built once, before `initRuntime`
resolves the preference, and persists across rebuilds, so a snapshot would go stale). Rather than a tall runway
+ fixed canvas, the globe is a static ~100vh section that scrolls away, with the pull-quote below in
normal flow. The preference is **re-read on every `initRuntime`**, and a
`matchMedia('(prefers-reduced-motion: reduce)')` `change` listener feeds `doLayout`, so toggling
the OS setting mid-session rebuilds through the same `destroy()`+`init()` path as a band / pointer
change (no reload; the non-RM path clears the canvas `position`/`top` so a toggle-off reverts
cleanly). The pieces:

- **Canvas** — `position:absolute` + `top:8vh` (not `fixed`), inside the now-`relative`
  `.globe-gallery-world`, so it scrolls and clips with the page; `updateCanvasVisibility` reveals it
  once (no coverage math).
- **`.globe-gallery-world`** — `position:relative` (was sticky); height `108vh` = 8vh + the canvas.
- **Globe size (desktop)** — the formed `md` sphere fills ~93% of viewport height, so `buildCards`
  scales `sphereGroup` by `RM_GLOBE_SCALE_MD` (0.9) on md to bring the whole ball in view (rotation
  is per-card, so a group scale is safe). `sm` (~49%) stays 1.
- **A11y widget** — `position:absolute` (was fixed), re-centred at `top:58vh` since the base
  `top:50%` would track the taller world.
- **Pull-quote** — drops `absolute`/`sticky` → `static`, forced `opacity:1`, hugs the top of its
  box so it sits under the globe; `updatePullQuote` early-returns (CSS owns it).
- **Arc-copy** — `display:none` (no arc phase; a fixed pill would hang over the scrolling page).

The `--reduced` overrides are grouped at the **end of `globe-gallery.css`** (`no-descending-specificity`). The no-cards / WebGL-unavailable fallback is the separate `.globe-gallery-empty`.

Phase constants (all in **`src/timeline.js`**) — these are the *inputs*; **Lifecycle timeline**
above shows what they add up to. The `P_*` values live in **progress-space** (0→1) and shape formation
+ zoom; the runway split, pull-quote, and cursor retirement are covered under **Scroll model → the
runway / progress model** above (they're driven by `--runway-height` / `--formation-vh` /
`--pq-pin-factor` in CSS, read/derived in JS):

```
P_PAN_END=0.55  P_ARC_PREROLL=0.30  P_GRID_ARC_START=0.30  P_GRID_ARC_END=0.60
P_FOLD_DUR=0.25  P_ZOOM_END=1.00  GRID_PEEL_STAGGER=0.20  SPHERE_INTERACTIVE_T=0.8
FOLD_PEEL_OVERLAP=0.35  CA_ENABLED=true
FORMATION_SCROLL_VH=304  PQ_APPEAR_LEAD=0.03  CURSOR_ZOOM_DISMISS_T=0.38  CURSOR_ZOOM_RETIRE_T=0.40
```

`FOLD_PEEL_OVERLAP` (0–1) makes each card begin folding to the sphere that far — in peel
position-space — **before** it fully lands in the grid (folding from its live peel position, no
snap), so the grid never visibly "resolves" and the sphere forms earlier. The fold opens at peel
localT `FOLD_START_LOCAL_T = 1 − FOLD_PEEL_OVERLAP^(1/3)`; the global fold window
(`FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS`) and the per-card fold timer
(`cardFoldStartProgress`) both derive from it in `timeline.js`, so camera / depth-sort /
interactivity stay aligned. `0` restores "settle, then fold."

**Arc-copy fade-out** (`updateArcCopy`) is expressed as a *fraction of the grid→globe fold window*
(`FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS`), not as raw progress, so it stays aligned if the
fold constants move: `ARC_COPY_OUT_FORM_START = 0.20` → `ARC_COPY_OUT_FORM_END = 0.90`, i.e.
progress ≈ `0.096` → `0.294` against a formed sphere at `0.322`. It therefore starts only once the
fold is underway and is fully gone *before* the sphere (md) / barrel (sm) finishes forming — one
window for both profiles, since the fold constants are shared. The out-ease is `easeInOutCubic`,
**not** the `easeOutCubic` used for the fade-in: `easeOutCubic` is ~88% done at the window's
midpoint, which would collapse the copy to invisible almost as soon as it began; `easeInOutCubic`
spreads the fade over the whole window and still lands exactly on 0 at `outEnd`.

`FOLD_FIRST_PROGRESS` and `SPHERE_FORMED_PROGRESS` are the fold window's two ends, and
`cardFoldStartProgress(gpDelay)` is the same computation per card — `FOLD_FIRST_PROGRESS` is its
`gpDelay = 0` case. All three live in `timeline.js`, so the global window and the per-card gate
cannot drift apart.

**Arc-copy placement** is split between CSS and JS: CSS owns the block edge (`bottom` — `8px` at
sm, `24px` from `min-width:768px`, docking it to the viewport bottom on the same 24px gutter the JS
uses inline-start), JS owns the inline-start inset per frame in `updateArcCopy` (`8px` at sm; at md
`24 + max(0, (W − 48 − 1392) / 2)`, the 24px-grid-aligned position with centering) plus the opacity
and the 24px entry slide.

**Entry timing** — two independent constants: `ENTRY_LEAD_VH` (`0.4`) viewport-heights before the
block top that entry begins (`0` late; `0.85` is the prototype's hero pre-roll but sweeps meshes
over content above), and `ENTRY_RAMP_VH` (`1.05`) the ramp over which `arcCopyEntryT` goes 0→1
(arc-copy fade, arc pre-roll speed, text→arc gap).

**Breakpoints** resolve once in `init()`: two render profiles split at 768px — `md` (≥768, all
cards, 9×5 grid, large sphere; covers Milo md *and* lg) and `sm` (<768, first 24, 3×8, smaller
sphere). Per-profile knobs in `BREAKPOINTS`: `N_MAX` (0=uncapped), `ARC_SPAN`, `SPHERE_R`, `CARD_*`,
`CAM_Z_*`, `GRID_COLS/ROWS`, `CARD_ROLL_JITTER`, `ARC_DENSE_FRACTION`, plus precise-pointer defaults
for the shape keys (`CARD_FACE_CAMERA`, `SPHERE_AREA_NORM`) that `YAW_ONLY_GEOMETRY` overrides. No
md↔lg split — they render identically (code branches only on `'sm'`). Crossing 768px changes the
card count, so `doLayout` triggers a full `destroy()`+`init()` rebuild; resizing within a band takes
the cheap path (renderer/camera resize). The `resize` handler is the sole driver of the **width**
boundary — no `matchMedia` listener for 768px. The one `matchMedia` `change` listener is for
reduced motion (see Reduced motion); pointer precision is read at init only (see Shape).

Because the block's `innerHTML` is built once in the outer `init(el)` (not per `initRuntime`) and
the runtime closure survives a `destroy()`+`initRuntime()` rebuild, `destroy()` resets state a
rebuild would otherwise inherit:
- `modal.destroy()` calls `resetModalDom()` — synchronously returns the modal DOM + page state to
  the closed baseline (clears `is-visible`/`is-open`/`aria-hidden`, hides `.modal-card-canvas`,
  clears `globe-gallery-modal-open`, restarts Lenis). Else a modal open at a breakpoint crossing survives visually
  stuck open (its mesh dropped with the old `modalScene`, `modalIdx` reset to -1 so chrome buttons
  are dead, scroll lock stuck). An open modal closes cleanly on crossing; it doesn't re-open.
- `destroy()` **resets the sphere orientation + drag/nudge state** (`sphereOrient.x/y/z`,
  `sphereOrient.pitchReleaseCap`, `sphereDragWarp`, `drag.velX/velY`, `navNudge.*`, `wasBrowsing`) to the upright
  pose — else pitch/yaw dragged before a device change carried into the rebuilt barrel and rendered
  it tilted until a scroll-out zeroed it.

CSS is authored **mobile-first** and keeps its own three type tiers independently of the JS
profiles: sm is the unscoped `.globe` base, then `@media (min-width:768px)` (md) and `1280px` (lg)
layer larger scales on top. Modal/arc-copy is the same — sm (dark frosted panels) base,
`min-width:768px` overrides to the desktop card.

## Analytics

The block answers one question: **what fraction of card opens lead to a clickthrough to a
product page.** Nothing is tracked per-card — with ~50 cards that is cardinality nobody asked
for. Card identity appears nowhere.

### Why this needs any custom code

Milo's `decorateDefaultLinkAnalytics` (`libs/martech/attributes.js`) runs **once**, from
`documentPostSectionLoading`, and only ever touches `<a>` and `<button>`. That leaves this
block with four holes:

1. A card is WebGL pixels raycast in `interaction.js` — there is no DOM node to decorate.
2. Auto-generated labels are `${label}-${linkCount}--${header}`, where `linkCount` is the
   ordinal among *all* links/buttons in the block. The ~50 `.globe-gallery-a11y-card` buttons
   precede the modal controls, so prev used to read `previous card-52--`. That ordinal is also
   **race-dependent** (the a11y buttons only exist after the async fragment fetch) and is
   **never re-applied** after a breakpoint rebuild destroys and recreates them.
3. Badge CTAs are minted per card inside `populateModal`, always after the decoration pass.
4. Escape and the mobile gestures produce no DOM click at all.

### The approach

**Everything is a `daa-ll` on a real element. There is no custom analytics code in this block.**

Every interaction that lacks a DOM click of its own — a canvas card tap, a swipe, a pull-down,
Escape — is routed through the real control that already means that action, via `.click()`.
DAA reads `daa-ll` off the clicked node and does not check `isTrusted`, so a synthetic click
reports exactly like a user's. Same idiom as Milo's own modal (`libs/blocks/modal/modal.js`,
Escape → `close.click()`).

For a card tap, that control is the card's own `.globe-gallery-a11y-card` button — the one real
element that already means "open card i". It is `pointer-events: none` and 0×0, but `.click()`
dispatches programmatically and ignores hit-testing entirely. `a11y.trackCardOpen(idx)` is the
explicit entry point, so this dependency shows up in the module's contract rather than being an
implicit reach into the DOM.

Every `daa-ll` is set explicitly — in `buildMarkup`, at card-button creation, or at badge mint
time — so none of it depends on when decoration runs. `attributes.js` preserves an existing
`daa-ll`, re-running each `-`-separated segment through `processTrackingLabels` for localization
only, which round-trips these values unchanged. **That removes the race in hole 2 rather than
working around it.**

| Interaction | Mechanism | Label |
| --- | --- | --- |
| Card open (canvas tap) | `a11y.trackCardOpen` clicks the card's button | `card_open--globe_gallery` |
| Card open (keyboard) | real click on that same button | `card_open--globe_gallery` |
| Enter keyboard gallery (BROWSE) | `daa-ll` on the entry widget | `enter_gallery_kbd--globe_gallery` |
| Badge CTA | `daa-ll`, minted in `populateModal` | `Photoshop--globe_card_modal` |
| Prev (button or swipe) | `daa-ll` in `buildMarkup` | `prev_card-1--globe_card_modal` |
| Next (button or swipe) | `daa-ll` in `buildMarkup` | `next_card-2--globe_card_modal` |
| Close (button, Escape, pull-down) | `daa-ll` in `buildMarkup` | `close-3--globe_card_modal` |

Pointer and keyboard opens converge on the *same element and label*, so parity is structural
rather than something to remember.

Full DAA chain for a CTA, via the block's inherited `daa-lh`:
`Photoshop|globe_card_modal|b2|globe-gallery|s3`. `showModal()` moves the dialog to the top
layer but does not change DOM ancestry, so that chain survives.

**The ratio:** `sum(globe_card_modal CTA clicks) / sum(card_open)`. It is session-level, not
strictly per-card — a user may browse several cards before clicking through. Cards-viewed
(opens + navs) is derivable if a deeper denominator is ever wanted. Because both sides now go
through DAA, they share one consent path; there is no gate on one and not the other.

### Details worth not re-deriving

- **Badge labels carry no index.** Derived from badge row position it would differ per card
  (Photoshop `-1` on one card, `-3` on another), splitting the one aggregate that matters. One
  product = one label. Milo's gnav ships numberless labels too (`daa-ll="Brand"`).
  `processTrackingLabels` also strips `-`, so a product name like `Photoshop-Web` becomes
  `Photoshop Web` and cannot corrupt the level split.
- **20 characters per segment.** `decorateDefaultLinkAnalytics` re-runs every `-`-separated
  segment of an existing `daa-ll` through `processTrackingLabels(part, config, 20)`, which
  hard-slices at 20 — silently. `enter_gallery_keyboard` became `enter_gallery_keyboa`, hence
  the `_kbd` abbreviation. Check any new label the same way: split on `-`, and no piece may
  exceed 20 characters. Product names are already sliced to 20 at mint time.
- **Every card button carries the *same* explicit `daa-ll`** (`CARD_OPEN_DAA_LL` in `a11y.js`).
  Left to auto-decoration they would each derive a label from `aria-label` — the card's alt
  text — producing ~50 per-card labels, exactly the cardinality this design rejects. Explicit
  also means the label cannot drift with the button's ordinal.
- **`event.isTrusted` separates acting from reporting.** A synthetic click carries
  `isTrusted: false`; genuine user activation is always `true`, including keyboard Enter/Space
  and screen-reader activation (AT goes through the platform accessibility API, which browsers
  surface as a trusted click). So `onCardClick` bails on untrusted events: `trackCardOpen`'s
  click is report-only, and without that bail it would reopen the modal at viewport centre,
  discarding the tap coordinates the raycast passes. The marker rides on the event, so unlike a
  module-scope flag it cannot latch, leak, or need a `finally`.
  **Test gotcha:** an E2E test driving the block with `page.evaluate(el => el.click())` produces
  an untrusted click and will appear to do nothing. Use the real click API (Playwright's
  `locator.click()` dispatches trusted input).
- **Only the canvas path calls `trackCardOpen`** (`openModalFromCanvas` in `globe-gallery.js`,
  kept separate from `openModalAndDismissHint` for exactly this reason). A keyboard open is
  already a real click on that button, so reporting there too would double-count it.
- **`enter_gallery` is the one engagement signal here.** The entry widget is a real button, so
  it costs a single label and roughly one event per keyboard session. It answers a question
  nothing else does: whether the two-level a11y gallery is ever entered at all. Note the widget
  is only *clicked* to enter BROWSE; merely focusing it (which scrolls the page to the
  interactive globe via `snapToInteractive`) is a focus event and is not reported.
- **Caveat inherent to `daa-ll` on any button:** a real click reports even when the handler
  then declines to act — `enterBrowse()` bails if the sphere isn't formed, and `onCardClick`
  bails if `isInteractive()` is false. Expect a small over-count on both.
- **`close(e.isTrusted)`** (`modal.js`) is the same idea. `close(viaPointer)` ignores a close
  within 200ms of open, to swallow the *browser's* synthetic click after a touch pointerup —
  which is trusted, so the guard still applies to it. Escape and pull-to-close route through
  `clickClose()`, are untrusted, and so are exempt; without that, Escape within 200ms of open
  would be silently ignored. `viaPointer` and `isTrusted` turn out to be the same predicate,
  so it is derived from the event rather than stashed.
- **Do not add `daa-lh` anywhere in the block.** `attributes.md` forbids it, and a `daa-lh` on
  the block element makes `decorateSectionAnalytics` skip link decoration for the whole block.
- **Not tracked, deliberately:** globe drag/hover/auto-rotation, scroll milestones, card
  impressions, and close *method* (button vs Escape vs swipe all collapse to one label). The
  first two are the highest-volume signals here. Note these are the one class of signal the
  all-`daa-ll` design cannot express: nothing is clicked, and there is no element that means
  "the user reached the formed globe". Adding one would mean reintroducing `sendAnalytics`
  (`libs/martech/helpers.js`) at the `SPHERE_INTERACTIVE_T` gate behind a once-only flag — and
  with it a second reporting path, which gates on consent separately from DAA. Worth weighing
  against the consolidation before adding the first one.

## Behavior notes (intentional differences from the prototype)

- **"Click & Drag" hint text (WebGL).** A `PlaneGeometry` in `sphereGroup` behind the sphere's back
  surface (`z = −(SPHERE_R + TEXT_BEHIND_GAP)`, `renderOrder = -1`), so it rotates with the globe and
  draws behind the cards. Hidden until `sphereFormT > TEXT_APPEAR_START (0.10)`, then warps in (barrel
  warp + particle dissolve via `TEXT_FRAG`), settles to a faint resting opacity (`TEXT_OPACITY_PEAK
  0.15 → RESTING 0.06`), fades out over the zoom. Sized to fill the frustum at its live camera
  distance (`textPlaneSize` × a per-frame scale off `frame.foldSphDist`), with warp-proportional
  overflow so letterforms bleed off-screen. On **first drag** it dissolves away permanently:
  `textExitProgress` (0→1, from drag distance + hold time + velocity) drives the shader's `uExitP`;
  it resets only on scroll-out (`sphereFormT < SPHERE_INTERACTIVE_T`). Owned by its own tick stage
  (`updateHintExitProgress`, not `updateClickDragText`, which early-returns before the interactive
  range — the very scroll-out that must reset it — and the cursor reads it too). Shows on all
  devices. Built async in `buildTextMesh` (waits for `document.fonts.ready` → Adobe Clean), rebuilt
  on resize, static-and-faint under RM. Copy is hardcoded (see Localization).
- **Desktop custom cursor (`src/cursor.js`).** On `(hover: hover) and (pointer: fine)` only, over the
  interactive sphere with no modal open: the system cursor becomes a 48px `mix-blend-mode: difference`
  disc (inverts what's beneath) flanked by chevrons that squeeze 4px inward while dragging, plus a
  "Click & Drag" label in a **frosted pill** (the modal-chrome glass, so `backdrop-filter` frosts the
  cards behind it). It **retires in two steps** on the same `textExitProgress` signal as the hint
  text: at `CURSOR_HINT_DISMISS_T` (0.12, `getHintDismissed`) the label fades with the text; at the
  later `CURSOR_RETIRE_T` (0.55, `getCursorRetired`) the disc + chevrons fade over `RETIRE_FADE_MS`
  (0.42s, mirrored by `--retiring` CSS), then `active` drops, clearing `cursor: none` so the system
  cursor takes back over. The disc **shrinks** rather than fades (partial opacity under
  `mix-blend-mode: difference` is a gray wash). Opening a card sets `textExitProgress = 1` (instant
  retire); both steps reset on scroll-out. Two **body-level** DOM layers: the disc **must** be a
  direct `<body>` child (`mix-blend-mode` only reaches page content from outside a `position: fixed`
  container); chevrons + label live in a fixed container. Sets `cursor: none` while active;
  `interaction.js` cedes its hover cursor via `isActive()`. No-op on touch: `(hover: hover) and
  (pointer: fine)` is read **once at setup** (a device that gains a fine pointer mid-session needs a
  reload, unless a re-init — e.g. an RM toggle — re-reads it). With multiple globes each
  makes its own pair but only the hovered one activates (inactive discs `visibility: hidden`). Label
  copy is the authored hint string (see Localization).
- **Modal chrome — edge-anchored nav arrows + counter; desktop adds a screen-edge scrim.** The
  prev/next arrows and counter are independent chrome children (no wrapper), positioned per-frame by
  `positionModalChrome`, reading as one bottom-centre row at every breakpoint. **Desktop/tablet:** the
  counter pill centres horizontally on the image, an arrow `DT_NAV_GAP` (12px) each side; the pill is
  a fixed `DT_COUNTER_W` (138px, mirror its CSS `width`) so the flank offset needs no measuring; all
  three share one `bottom` — a fixed 24px from the *viewport* bottom (not the image bottom), so the
  row sits at the same height across images regardless of the photo's aspect ratio — 44px tall. **Mobile:** the same row spread wide into the bottom-left/right
  corners inside the bottom scrim. The three frosted controls (both arrows + close) share one style
  (1px `--s2a-color-transparent-white-24` border, `--s2a-border-radius-4`,
  `--s2a-color-transparent-black-64`, `blur(12px)`); close sits top-right at every breakpoint. The
  **visible image** is contain-fit to the viewport minus a symmetric margin (desktop `DT_IMG_MARGIN`
  12px; mobile full-bleed to screen width, square corners `uRadius=0`), native aspect kept — the
  sizing math backs the geometry out of the SDF corner inset (`uRadius·cardHPx`) so the *photo*, not
  the geometry, reaches the margin. Desktop adds a fixed-width (`DT_SCRIM_W` 316px) dark frosted
  scrim on the **viewport's left edge, full height**; mobile's scrim is one full-width bottom chunk
  (content-sized, capped at `60dvh`). Both are a **pinned header / scrolling body / pinned footer**:
  role + name are `flex-shrink:0` at the top, the **badges** are `flex-shrink:0` at the bottom (so
  those tabbable controls are always on-screen), and the **description** is the only scroll region
  (`min-height:0; overflow-y:auto`) — long copy scrolls instead of overflowing or
  hiding the badges. A `mask-image` scroll-shadow (`updateDescFade`, re-measured on
  scroll / resize / card-change) fades whichever edge has more copy, so the scroll affordance
  survives macOS's hidden overlay scrollbar. JS gives the description `tabindex="0"` only while it actually overflows, so it's
  keyboard-scrollable then without leaving a pointless tab stop when the copy fits; the full text is
  always in the a11y tree via the dialog's `aria-describedby`; `touchstart` skips the swipe/pull
  gesture when a drag starts inside it so the copy scrolls rather than closing the modal. It also
  carries **`data-lenis-prevent`** — Milo loads the Lenis smooth-scroll lib on `foundation:c2` pages
  (`utils.js`), which hijacks the wheel/touch and applies it to the (scroll-locked) page, so a nested
  scroll region silently won't scroll without opting out via that attribute. All dark frosted
  (`rgb(0 0 0 / 64%)` + `blur(12px)`, light text).
  - **Touch gestures (in the modal) are gated on a coarse primary pointer**
    (`matchMedia('(pointer: coarse)')`, mirroring `usesCylinderGeometry`), not on the `sm` width
    band — so tablets at md (≥768) get them too. A per-gesture axis lock (`AXIS_LOCK_PX` 10px)
    splits horizontal **swipe → prev/next** (warp preview during the drag, cross-warp on commit)
    from a vertical **pull-down → dismiss** (finger-tracked `translate`+`scale`, commit flies the
    card back from where it was released; upward drag is clamped to 0). matchMedia-less → no
    gestures. The gesture code transforms the canvas, not the chrome, so it's layout-agnostic
    across the sm scrim and the md full-height panel.
- **Sphere rotation — clamped Euler pitch/yaw (yaw free, pitch capped ±60°).** The orientation
  SOURCE is a pitch/yaw pair (`sphereOrient.x`, `sphereOrient.y`); the shared `sphereRotQuat` every
  consumer reads (card transforms, modal close, snap) is **rebuilt from it each frame**
  (`refreshSphereRotQuat` → `setFromEuler`, order `'XYZ'`). Yaw is an unclamped turntable spin;
  pitch tilts about world X, **clamped ±π/3 (±60°)**, so cards never pass vertical and the globe
  **self-levels**. `'XYZ'` puts the clamped pitch *outer* to dodge a gimbal flip: with `'YXZ'`
  (unclamped yaw outer) the pitch axis's world-X component hits 0 at 90° of yaw (vertical drag
  dead) and −1 at 180° (drag down tilts up).
  - **Keyboard-gallery centring drives the FULL orientation to `card.sphereQuat⁻¹` — centre +
    upright.** `centerCardOnScreen` targets the one orientation making the card's world quaternion
    identity, which (outward normal = radial position) both centres the card (normal → +Z) and
    cancels its slot orientation + baked `CARD_ROLL_JITTER` (up → +Y). Decomposed into the Euler
    triple and eased per-axis (yaw shortest-path, pitch, upright **roll**). **On `YAW_ONLY`
    geometry it's yaw-only** (`cardCenterYawPitch` holds pitch) — a barrel can't centre vertically,
    so a top image stays high and only its column turns front.
  - **Roll (`sphereOrient.z`) exists ONLY for keyboard uprighting** — 0 for drag/ambient, set by
    `centerCardOnScreen`, eased back to 0 (`PITCH_RELAX`) when browsing ends.
  - **Pitch exception (±85°) via a GLIDING cap.** Drag keeps ±60°, but sphere keyboard-centring
    may tilt to **±85°** (`KEY_PITCH_CAP`) so a near-polar image reaches vertical centre. The seam
    is `sphereOrient.pitchReleaseCap`: while browsing it tracks the held pitch; on exit it eases back
    to ±60° (`PITCH_RELAX`) with `sphereOrient.x` clamped to it each frame, so leaving a beyond-cap card slides
    down to level instead of snapping. (Yaw-only browse never leaves ±60°, so the glide never fires.)
  - **No-overshoot ease.** Keyboard and modal centring share one **frame-counted `easeInOutCubic`
    tween** (`KEY_BROWSE_FRAMES` visible; `KEY_MODAL_FRAMES` faster, behind the blur) — never
    overshoots, and a low frame rate stretches the spin smoothly instead of jumping. RM snaps.
  - **Why capped, not a free trackball.** A pure-trackball version was tried and **reverted** (git
    commit `desktop no clamp, drag yaw-only`): full tumbling read as too free, and — the deciding
    factor — trackball roll is path-dependent, so curved drags accumulate tilt that never
    self-cancels (a closed input loop isn't a closed orientation loop). Clamped Euler makes
    orientation a pure function of `(pitch, yaw)`: roll returns to 0 whenever pitch does, bounded by
    `|roll| ≤ |pitch| ≤ 60°`. That self-correction is the reason for the cap; don't restore a
    blanket clamp / drop the roll / hard-switch the cap without re-breaking polar centring,
    uprighting, or the smooth exit.
  - **Modal TRAVERSAL centres the viewed card (shared with the keyboard gallery); it doesn't
    "nudge."** `centerModalCard` (injected as `requestNavNudge`, called on modal **prev / next /
    swipe** — NOT open) rotates the sphere so the revealed card faces centre behind the modal, so
    **closing returns it to centre**. `open()` deliberately does *not* centre — the user tapped an
    already-front card, so the globe holds still and the card flies back to where it was tapped. It
    reuses `cardCenterYawPitch` + the tween at `KEY_MODAL_FRAMES`; differences from browse: pitch
    caps at ±60° (so a near-polar card can't over-tilt then snap when the drag clamp resumes) and
    no upright-roll (stays self-levelled). **Exception:** a keyboard-opened modal (`isBrowsing()`)
    routes to `centerCardOnScreen` instead, carrying the upright roll so there's no roll delta on
    close and the focus ring hugs the card. On **yaw-only geometry** pitch is held. **Camera INSIDE
    the globe** (modal opened mid-zoom-through then traversed): once inside the camera sees the FAR
    (−Z) wall, so `cardCenterYawPitch` flips the target to −Z (keyed off `cameraInsideSphere`;
    keyboard browse never hits it). Replaced an earlier capped-spring "reactivity nudge" that never
    reached centre.
- **Two independent axes: viewport WIDTH and INPUT PRECISION** — resolved separately, never
  conflated.
  - **Width** (`resolveBP`, 768px) picks the render profile: card count, grid dims, sphere
    radius, camera Z. `sm` | `md`.
  - **Shape** (`usesCylinderGeometry`) picks cylinder-vs-sphere on an OR: **`sm` width OR a coarse
    primary pointer** — both independently rule out a sphere (a small viewport can't frame one;
    yaw-only drags can't reach its poles). Constants live in the `YAW_ONLY_GEOMETRY` overlay.
  - **Why split** — the shape constants exist only because a yaw-only drag can't change a card's
    latitude. Keying them to width was wrong: an **iPad Pro is ≥768px (`md`) but drags with
    touch**, which left 7 of its authored cards permanently >60° oblique. Use `(pointer: coarse)` (the
    *primary* pointer's precision), not `(hover: none)` or a UA sniff. Precision is read **once at
    init** (`usesCylinderGeometry`), so the geometry that bakes at `buildCards()` matches the device
    the page loaded on; a **mid-session mouse/trackpad swap needs a reload** (out of scope — rare,
    and not worth a live-rebuild listener). The width half *is* live, though: crossing 768px rebuilds
    the geometry and flips `bp.YAW_ONLY`, and drag-pitch follows it (`getYawOnly: () => bp.YAW_ONLY`),
    so a desktop window narrowed to `sm` gets the barrel *and* yaw-only mouse drags in lockstep.
  - **Pitch is gated on `bp.YAW_ONLY` (geometry), not `e.pointerType`.** The barrel is yaw-only for
    everyone — mouse included — because a cylinder can't centre a card vertically (matching the
    keyboard/modal centring path, which holds pitch on `YAW_ONLY`). Pointer type still matters for
    the *touch* half: a finger on the sphere is yaw-only (vertical = scroll) even though the sphere
    itself pitches, so the drag path suppresses `velY` when `isTouchDrag || getYawOnly()`.

    ```
    device                  band cards  shape            cols  cardW  wall@near  col imb
    iPhone (393, touch)     sm      24  cylinder masonry    8  13.09      83%      1.05
    iPad Pro (1024, touch)  md       N  cylinder masonry   14  13.09     164%*     1.22
    iPad Pro + trackpad     md       N  full sphere         -      -        n/a       -
    Desktop (1440, mouse)   md       N  full sphere         -      -        n/a       -
    Narrow desktop (500)    sm      24  cylinder masonry    8  13.09      83%      1.05
    * >100% = wall bleeds past top/bottom — intended immersive framing (77% of centre frustum).
    ```

- **Yaw-only devices render a barrelled CYLINDER, not a sphere** (`cylinderMasonryLayout`). Every
  card's normal is **horizontal**, so obliquity depends only on azimuth — exactly what yaw controls
  — so yaw brings any card face-on at any height. Reads as the sphere's caps unfolded into a wall.
  Layout is cylindrical **masonry**: fixed columns around the circumference, cards packed down each
  (replacing a golden-angle helix that clumped and sized unevenly).
  - **Uniform WIDTH fixes alignment; varying HEIGHT is the effect.** Width = column width (columns
    read as true verticals); height follows each image's native aspect (the stagger). Makes
    `SPHERE_AREA_NORM` unnecessary here (0). `CYL_ASPECT_CAP` (1.5) stops one panorama dominating a
    column (cover-crop UVs crop harder; `imgAspect` derives from the *solved* size so the corner SDF
    still matches). `CYL_GAP_RATIO` (0.20) sets both gaps (card width = pitch / (1 + ratio)).
  - **Packing: shortest column, tallest card first** (longest-processing-time-first) — cuts column
    imbalance from 1.64× to ~1.05 vs source order. Free to reorder: the layout scatters consecutive
    cards, so authored order carries no spatial meaning and modal prev/next walks card *index*. Each
    column's stack is centred about y=0.
  - **Column count is DERIVED** (`CYL_COLS_FIT`, the wall-HEIGHT dial): fewest columns whose tallest
    fits that fraction of frustum height (must scale with count). Default `0.80`; **sm overrides to
    `0.65`** (`BREAKPOINTS.sm.CYL_COLS_FIT`) to trim height after `SPHERE_R` was pulled in. iPad's md
    cylinder keeps 0.80.
  - **Barrel size is the RADIUS.** The wall sizes against the centre-plane frustum, but viewers see
    the FRONT cards at the near radius, magnified `CAM_Z_SPHERE / (CAM_Z_SPHERE − SPHERE_R)`. On a
    narrow phone the sm barrel clipped the screen edges, so **sm `SPHERE_R` was reduced 20 → 16**
    (radius is the width lever; 1.4×→1.30× near magnification), paired with the `CYL_COLS_FIT` 0.65
    for height. md unchanged.
  - **`CYL_BULGE` (0.12) barrels the wall** — `r = R·(1 − bulge·t²)`, `t = 2y/wallH` — so the
    silhouette curves like a globe while every column keeps a constant azimuth (still projects to a
    vertical line; only radial displacement). Costs ~9° normal tilt on sm / ~14° on md. **Don't push
    past ~0.2**: the inter-column chord shrinks with `r` while card width doesn't, so edges overlap
    (0.25 → −0.20 clearance). `0` is an exact cylinder. The layout returns a per-card **`normal`**
    and `buildCards` aims each card along it (target = `pos − normal`, since `lookAt` points local +Z
    from target toward eye) — a plain `lookAt` at the axis would ignore the slope.
  - **Near-camera fade scales with each card's OWN rendered height** (`card.sphereWorldH`), not
    `bp.CARD_H_SPHERE` (only the `PlaneGeometry` base on this path; solved heights run 8.7–19.6). Per
    card gives every card the intended ~1.85× fill-margin at any band/count/bulge.
  - **Drag-flip threshold is DERIVED, not `SPHERE_R`** (`dragFlipZ = maxRadial + NEAR_FADE_END ×
    CARD_H_SPHERE`, in `buildCards`, read by `updateActiveCamera`). Once the camera is inside the
    shell the far wall moves opposite the same rotation, so the drag delta is negated. Firing at the
    geometric wall (`SPHERE_R`) drifted from the dissolve distance when card heights changed; tying
    it to the fade keeps the flip aligned. `maxRadial` is radial (rotation-invariant); `sphereGroup.
    scale` (RM shrink) folded in; capped at `CAM_Z_SPHERE × DRAG_FLIP_MAX_CAM_FRAC` (0.95) so it
    can't fire at zoom start; gated on `zoomT > 0`.
  - **No roll jitter here** (columns lining up *is* the effect). **`CARD_FACE_CAMERA` is `0.35`** (vs
    the sphere's 0.5) — only limb polish, since a cylinder has no polar cards to rescue.
  - **Why not a chopped masonry globe** (rejected): meridian columns on a sphere project to curves,
    so in-column alignment breaks; a 0.7 band holds only ~2 cards/column and returns latitude
    obliquity. Masonry needs a developable surface — a cylinder is one, a sphere isn't.
- **Density + facing pass** (full-sphere path; fixes the "edgy / unevenly distributed" read).
  Adding cards fixes none of it — nearest-neighbour spacing is already even at N=24 and worsens with
  more cards (foreshortening variance). Four independent levers:
  - **Edge-on slivers → `CARD_FACE_CAMERA` (`0.35` cylinder / `0` full sphere).** A radial card's
    obliquity equals its angular distance from front-centre, so limb cards render as lines.
    `applyCardFacing` turns each card partway toward the camera (slivers 5→0, worst obliquity
    81°→41°). Must be **per-frame** (a baked tilt rotates away from the camera). The target is
    `sign(n.z) × viewDir`, not `viewDir` (a uniform blend toward +Z rotates a back card to
    perpendicular — a new sliver). The effect must **fade to zero at edge-on** or the 180°-apart
    targets teleport a card up to 63° as `normal.z` crosses 0: `FACING_EDGE_ON_BAND` (0.25, in
    `|normal.z|`) smoothsteps `k` to 0 across edge-on (max per-frame change 63.3°→1.9°); widening
    past ~0.35 eats the limb correction. Applied at **three** sites that must agree or the card
    snaps: `placeSphereCard`, `snapCardToSphereSlot`, and `placeFoldingCard` (scaled by `fdE` so it
    eases in over the fold, continuous with the sphere branch).
  - **Uneven card SIZE → `SPHERE_AREA_NORM` (`0.5` yaw-only / `0` else).** Native-aspect sizing
    (height `CARD_H_SPHERE`, width `sphereScaleX`) makes a 16:9 image 2.67× the area of a 2:3 one, so
    wide cards blot out neighbours. Scaling *both* axes by `sphereScaleX^-norm` equalizes area at
    `norm=0.5` (area ∝ ssx·ssx⁻¹ = 1) with the aspect — and the image — undistorted (spread
    2.67×→1.00×). Baked into `card.sphereScaleSX/SY` at build (raw `sphereScaleX` kept for arc/grid/
    modal); applied at the same three sites **plus** `modal.js`'s close target (needs
    `applySphereFacing` injected, else it jumps when `snapToSphereSlot` runs). `norm=0` reproduces
    the old scaling exactly (precise-pointer untouched); uniform scale preserves `uAspect` so corners
    stay circular.
  - **Sparseness → `CARD_H_SPHERE` 6.0 → 11.0 on sm** (sphere path only). 24 cards at 6.0 covered
    only 12.4% of the sphere face. Coverage scales with **H²**, so size is a far stronger lever than
    count and adds no textures/draw calls. Nominal height before `SPHERE_AREA_NORM`; net ~42%.
  - **Scatter → `CARD_ROLL_JITTER` (sm `0.18` ≈ ±5°, md `0.5` ≈ ±14°).** Per-BP now; at sm's
    sparsity the old fixed ±14° read as debris. md keeps the collage character.
- **Touch gesture arbitration — yaw-only, via a directional axis lock** (`interaction.js`). On
  touch a vertical drag *is* the page-scroll gesture, so touch gets **yaw only** (horizontal spins,
  vertical scrolls); pitch (`drag.velY`) is written only when `!isTouchDrag && !getYawOnly()` — i.e.
  a mouse on the sphere. `touch-action: pan-y` alone isn't enough
  — moves before the browser commits to the pan leak a pitch kick — so the axis is resolved in JS
  from the first `AXIS_LOCK_THRESHOLD` (8px) of travel, then **latched** for the gesture (a curved
  swipe can't flip axes; a 45° tie resolves to vertical). `isTouchDrag` is per-gesture from
  `e.pointerType`, so a touchscreen laptop locks finger input but keeps mouse pitch **on the sphere**
  (its mouse still yaws-only on the barrel, since pitch follows geometry).
  - **Taps aren't gated on the lock** — `CLICK_MAX_MOVE` (10px) > the 8px threshold, so a jittery
    tap may have latched an axis; `onPointerUp`'s independent distance/time test keeps tap-to-open
    unchanged.
  - **`isPageScrollGesture()`** (exported) lets per-frame stages distinguish a scroll swipe from a
    globe drag while `drag.isDragging` is still true — e.g. `updateHintExitProgress` skips it, or its
    hold-time term would retire the hint during ordinary scrolling. Gated on `drag.isDragging`
    (`isTouchDrag` persists after pointerup).
  - No dwell needed: touch scrolling is self-terminating, so on lift the sphere is stationary and
    `sphereFormT >= 0.8` holds — scroll and spin are mutually exclusive in time. (How easy it is to
    *land* on the pristine formed globe is a pacing matter — see Open items.)
- **Typography rides Milo's S2A type system.** Display/body copy carries the standard `heading-1` /
  `body-lg` / `body-md` classes (added in `buildMarkup`), which supply responsive
  size/line-height/letter-spacing; `globe-gallery.css` sets only family (`--heading-font-family` /
  `--body-font-family`), weight (`--s2a-font-weight-*`), colour, and margins on top.

## Tuning reference

The module-scope constants are the core's tuning surface, split by kind: **scroll timing** (phase
constants, entry ramp, and every threshold) lives in `src/timeline.js` — see Lifecycle timeline —
and the **visual/physics** constants below stay in `globe-gallery.js`. The ones whose *value* isn't
self-explanatory (and whose rationale used to live in long inline comments):

| Constant(s) | Value | Role |
| --- | --- | --- |
| `DRAG_FRICTION` | `0.94` | per-frame velocity decay after a drag release (spin coastdown) |
| `MAX_VEL` | `0.06` | drag-velocity clamp; the core normalizes speed by it (shared with `interaction.js`) |
| `AUTO_ROT_SPEED` | `0.000045` | idle yaw drift per frame when not dragging / browsing |
| `HOVER_RATE` | `0.15` | per-frame lerp toward the hover target (~125ms to 80%) |
| `CA_STRENGTH` | `0.012` | radial UV shift per channel at transition peaks (Option B bell curve) |
| `CA_MOTION_STRENGTH` / `…_ARC` | `1.0` / `0.04` | directional (motion-trail) UV-shift max — full during peel/fold/sphere/modal, softly clamped on the arc |
| `SCROLL_VEL_MAX` / `_DEADBAND` | `14` / `7` | px/frame that saturates the motion trail / below which Lenis settle-noise is ignored (anti-shimmer) |
| `CA_PX_MAX` | `4` | max vertical px shift for the global canvas SVG filter (Option C, md only) |
| `ARC_STAGGER` | `0.594` | span of the per-card peel-time stagger along the arc |
| `ARC_PEEL_JITTER` | `0.40` | per-card random offset on the peel delay (organic cascade) |
| `ARC_DENSE_SPLIT` | `0.50` | `fanT` boundary between the clustered off-screen flank and the visible spread |
| `SPHERE_DRAG_WARP_BASELINE` / `_VEL` / `_MAX` | `0.05` / `3.5` / `0.25` | barrel-warp while dragging: constant baseline + a velocity-driven burst (decays with `DRAG_FRICTION`), capped |
| `TEXT_BEHIND_GAP` | `15` | world units the hint plane sits behind the sphere's back surface |
| `TEXT_WARP_ENTER_MAX` | `4.50` | `uWarp` at the hint's entrance (barrel distortion) |
| `TEXT_DRAG_WARP_MUL` | `3.0` | hint drag-warp vs sphere cards (more violent) |
| `TEXT_CA_DIR_STRENGTH` / `_WARP_MUL` | `0.05` / `1.5` | drag-CA strength on the hint text / warp-driven CA boost |
| `TEXT_WARP_OVERFLOW` | `0.6` | extra mesh scale per warp unit, so letterforms bleed off-screen |

### `timeline.js` constants

Most of this file's exports are documented where they matter: the `P_*` phase constants and
`FOLD_PEEL_OVERLAP` under Behavior notes → Phase constants; `FORMATION_SCROLL_VH` /
`PQ_APPEAR_LEAD` under Scroll model; `ENTRY_LEAD_VH` / `ENTRY_RAMP_VH` under Entry timing; and
every gate threshold in the Lifecycle timeline event table. The remainder — carried in code as
bare names — are:

| Constant | Value | Space | Role |
| --- | --- | --- | --- |
| `SLIDE_IN_PROGRESS` | `0.07` | progress | progress by which the card entry slide-up has completed |
| `ARC_ENTRY_HOLD_T` | `0.05` | `arcCopyEntryT` | hold before the arc starts sweeping in |
| `ENTRY_ROT_MAX` | `0.9` | radians | arc sweep-in rotation at `arcCopyEntryT` = 0; `entryRot` decays from it, and `updateCardTransform` divides by it to renormalize for the per-card entry CA |
| `ENTRY_SLIDE_H_FRAC` | `0.30` | fraction of `H` | `entryYOffset` at slide 0 — how far below its arc position a card starts |
| `ARC_COPY_IN_ENTRY_T` | `0.336` | `arcCopyEntryT` | arc-copy fade-**in** completes here (the fade-out is a fold-window fraction — see Arc-copy fade-out) |
| `SPHERE_ORIENT_RESET_T` | `0.01` | `sphereFormT` | below this a scroll-out resets the sphere orientation (a brief dip mid-scroll keeps it) |
| `TEXT_ZOOM_FADE_RATE` | `3` | `zoomT` | hint text is fully faded at `zoomT` = 1/rate |
| `GRID_PEEL_WINDOW` | `0.8` | `gridFormT` | `1 − GRID_PEEL_STAGGER`; the span each card's peel occupies after its stagger delay (`frame.gpWin`) |
| `GRID_ARC_RANGE` / `FOLD_WINDOW` | `0.30` / `0.283` | — | derived spans: the grid-peel arc range, and `SPHERE_FORMED_PROGRESS − FOLD_FIRST_PROGRESS` |
| `progressAtFormT` / `progressAtZoomT` | — | — | helpers mapping a `sphereFormT` / `zoomT` back to progress. For docs and tests — not called per frame |

Constants whose rationale is covered in the sections above (and so kept terse in code): the phase
timeline + `FOLD_PEEL_OVERLAP`, `ENTRY_*` (all now in `timeline.js`), the `CYL_*` / `SPHERE_AREA_NORM` / `CARD_FACE_CAMERA`
shape knobs, the near-fade + `dragFlipZ` constants, and the keyboard/modal centring frames + pitch
caps (all under Behavior notes / Card count).

## Open items / backlog

Known follow-ups, not blocking this integration branch:

- **Bundle-drift isn't CI-checked.** `package.json`'s build step (esbuild → `three.module.min.js`
  from `src/three-src.js` + the pinned `three`) is a manual local step; nothing in CI verifies the
  committed minified bundle still matches its source. As more `THREE.*` symbols are added the
  bundle can silently drift from the pin. Worth a CI check (rebuild + diff) before this leaves the
  experimental wave.
- **No automated tests.** The block ships without unit or Nala E2E coverage. The initial pass leans
  on the planned VQA; a test suite (at least the authoring/parse paths, the N=0/N=1 edge cases, and
  a modal open/nav/close smoke) should land before it graduates from the experimental wave.
- **Pacing: landing on the pristine formed globe.** On touch, scroll-spin arbitration is correct
  (see Behavior notes → Touch gesture arbitration), but how easily a user *comes to rest* exactly on
  the fully-formed, still globe is a scroll-pacing tuning matter still open.
- **Pull-quote uses a hardcoded `--pq-height: 583px`.** It's a shortcut (enables `top: calc(50vh -
  h/2)` centering + a predictable hold = `pin − h`), but it's brittle to copy length — longer/localized
  strings overflow the fixed box (no `overflow` handling), shorter copy leaves a dead gap under
  `justify-content: space-between`. Make it copy-flexible (revisit in a future session). Two options:
  - **A (recommended) — content-sized, transform-centered.** `position: sticky; top: 50vh;
    transform: translateY(-50%) scale(…)` (the `-50%` is own-height-relative, so no fixed height);
    drop `height` + `justify-content: space-between` for a `gap`; add `max-height: 90vh; overflow`
    for pathologically long quotes. Keeps the "small quote → longer hold, no runway penalty" property;
    the attribution sits directly under the quote (grouped, not spread). Retune `PQ_APPEAR_LEAD` — the
    stick/centre point shifts by ~½ the quote height — and re-verify pacing. (A "100vh sticky wrapper +
    `place-items:center`" variant is bulletproof but costs ~+100vh of runway for the same hold, so it's
    not preferred.)
  - **B — keep the top/bottom spread look.** Retain a defined height (`min-height` instead of a hard
    `height`) so the quote/attribution stay spread; tolerates overflow better than today but partly
    keeps the rigidity. Only if the spread is a deliberate editorial layout worth preserving.
  - Decision needed from design: grouped (A) vs spread (B). See Scroll model → runway / progress model
    for how `--pq-height` feeds the hold.
