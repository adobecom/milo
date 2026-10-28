# globe — C2 block

A scroll-driven **Three.js WebGL** block running in Milo C2 page.

**New here, or changing *when* something happens?** Read **Lifecycle timeline** — it maps every
scroll position to what each subsystem is doing, and names the six separate normalized clocks the
code mixes.

## Conventions for editing this block

**Prose belongs here, not in the code.** These files ship unminified, so every comment is payload on
a hero block. A code comment earns its bytes only as **contract** (what a function returns or
mutates, a unit, an invariant) or as a **hazard at the exact line** an edit would break — `// Do NOT
forceContextLoss() here`, `// must run before the branch reads them`, `// Stage order is
load-bearing`. Mechanism, derivations, and rationale go in the matching README section instead.
Practically: one or two lines, never a paragraph, and add `See README (Section)` **only** when the
code alone wouldn't lead you there — the pointer costs bytes too, and `const BREAKPOINTS` doesn't
need to be told it's about breakpoints.

**This README documents current behavior, not how it got here.** It is long because the block is
intricate; keep it that way rather than growing an archaeology of every past decision. When you
change something, *replace* the old explanation instead of appending to it. Specifically:

- No change-logs, no "used to / was removed / shipped at X / now does Y", no reverted-attempt
  write-ups, no rejected-alternative essays — git holds all of that.
- Keep rationale only where it would change a future decision: a constraint that will bite again, a
  number that must not be retuned blindly, a footgun. Prefer the rule over the incident that found it.
- Prefer a table or a runnable snippet over paragraphs. Anything derivable from the code should be
  derived (see **Re-deriving these numbers**) rather than restated and left to drift.

## What it is

Over a tall, pinned scroll range (`--gg-runway-height` in the CSS), the authored photo cards
(any count, every card on every breakpoint — see Card count) animate through four phases:

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
Extras: a fixed arc-copy overlay, a fixed pull-quote whose crosshair draws itself
in near the zoom end, a WebGL **"Click & Drag" hint text** behind the sphere (warps in on fold, dissolves away on first drag — see
Behavior notes), **globe controls** (an auto-spin play/pause toggle everywhere plus a
rotate/hint/rotate row on the barrel — see Globe controls), and a **two-level a11y gallery** (see Accessibility below): a single
focusable entry widget whose Enter opens a keyboard/screen-reader browse mode that tabs
through each image (centring it on the globe) rather than exposing a flat per-card list.

## Files

| File | What it is |
| --- | --- |
| `globe-gallery.js` | The block + sphere render core. `export default init(el)` → builds DOM, runs `createGlobeGalleryRuntime()` → `{ init, destroy }`. Holds the *visual* tuning constants (scroll **timing** lives in `timeline.js`) and the stateful core: arc/grid/fold/sphere placement, drag physics, lifecycle. `tick()` orchestrates single-concern stages; `updateCardTransform` dispatches over four placement branch fns. Instantiates the DI modules. See Module layout. |
| `authoring.js` | `parseAuthoredContent` + `fetchFragmentCards` + `buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint })` (+ internal parsers). Reads the block rows positionally, fetches the card fragment, and builds the canvas/overlay/modal DOM — minting + returning the per-instance `gid` id suffix, filling the arc-copy / pull-quote slots. Badge logos are `/federal` assets resolved via Milo's `getFederatedUrl`. |
| `shaders.js` | GLSL: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`, `TEXT_FRAG`. Card/modal frags round corners with one analytic SDF (`rrSDF`), no rasterized mask. The two use *different* box conventions: `CARD_FRAG` fills the plane edge-to-edge, while `MODAL_FRAG` insets the shape by `uRadius` on all four sides (see Modal chrome). `TEXT_FRAG` adds a barrel warp + particle dissolve, both driven by scroll clocks only. |
| `materials.js` | GPU-asset factories (named exports, no per-instance state). **Materials:** `createCardMaterial`, `createModalMaterial`, `createTextMaterial`. **Textures:** `loadCardTextures({ maxTexH })` (one texture per card, capped on height — see Texture memory budget — reporting each image's native aspect and nothing else), `loadModalTexture(src, maxTex, onReady)` (lazy, longest-side cap, returns the pending `Image` to cancel), `createClickDragTexture(aspect, hintText)`. Card and modal photos load through `imageToTexture`: `createImageBitmap` resizes off the main thread, and because ImageBitmap uploads ignore the GL flipY unpack, the flip is baked into the bitmap (`imageOrientation:'flipY'`) with `texture.flipY = false`. A cross-origin-tainted or undecodable image rejects there and falls back to a solid-color texture. |
| `a11y.js` | `createGalleryA11y(deps)` → `{ setup, updateTabStops, teardown, isBrowsing }`. The two-level gallery (see Accessibility). All runtime state + actions (`centerCard`, `openCard`, `onFocus`) injected; holds no globe state but its DOM. |
| `modal.js` | `createGlobeModal(deps)` → `{ setup, resize, render, updateAnimation, updateDesktopNav, open, navigate, close, getModalIdx, isCardManaged, destroy }`. The card-detail modal: own WebGL canvas/scene, its renderer created on the first `open()` (`ensureModalRenderer`) rather than at `setup()`, so a page view that opens no card holds one WebGL context, the `MODAL_PHASE` state machine, SDF material swap, cross-warp nav, touch swipe/pull gestures, chrome layout in a native `<dialog>`. Owns all modal tuning constants. `getCount()` is the FULL authored count (see Card count). Sphere coupling is narrow + injected. |
| `math.js` | Pure stateless helpers. **Easings:** `easeOutCubic`, `easeInOutCubic`, `easeInOutQuint`, `lerpN`. **Arc-phase geometry:** `arcRotationEase` (takes its ramp `k` from `bp.ARC_RAMP_T`), `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ` — the fanned-arc layout + CSS↔WebGL bridge. **`clamp01`** — the block's one clamp; NaN maps to 0, deliberately, so a divide-by-zero progress blanks nothing downstream. The last three take an optional `out` and **write into it** (the core passes reused scratch objects), so per-frame placement produces no garbage. **Camera geometry:** `CAM_FOV` + `TAN_HALF_FOV` + `pxPerWorldAt(dist, H)` — the single home for the perspective camera's vertical FOV. The camera is *constructed* with `CAM_FOV` and every frustum measure in the block reads the other two. |
| `timeline.js` | **The scroll timeline** — the single place to change **when** something happens. Every phase constant and threshold, plus `createFrame` / `createFrameInput` / `deriveFrame(frame, input)`, the pure derivation of all six clocks, and `cardFoldStartProgress(gpDelay)` (the per-card fold gate; `FOLD_FIRST_PROGRESS` is its `gpDelay = 0` case). No THREE, no DOM, no closure state, so it's unit-testable in isolation. `deriveFrame` writes into a caller-owned frame, allocates nothing, and clamps NaN-safely — one NaN would poison every mesh position. Imported as a namespace (`import * as TL`). See Lifecycle timeline. |
| `interaction.js` | `createInteraction(deps)` → `{ setup, teardown, applyCursor }`. Canvas pointer plumbing: drag-to-spin, click-vs-drag, raycast hover + click→modal. Hover clears on pointer-down and is not raycast while dragging. Shares travel + velocity by reference via the `drag` object (see **Drag physics**). Owns the **touch axis lock**, and fires the injected `onDrag()` once per gesture the first time travel clears `CLICK_MAX_MOVE` (see Behavior notes). Sole owner of the canvas cursor — native `grab`/`grabbing`/`pointer`, all written through `applyCursor()` (see Behavior notes). |
| `cursor.js` | `createCursor(deps)` → `{ setup(canvas), update, teardown }`. The desktop cursor label (see Behavior notes): one body-level pill beside the native cursor, per-frame state from injected getters, the retirement fade. No-op on touch and on the barrel. |
| `quote-particles.js` | `createQuoteParticles({ figureEl, railEl, count })` → `{ object, warm, layout, setSources, update, isReady, isPaired, clearSources, dispose }`. The pull-quote transition: measures the DOM figure, rasterizes it at DPR, samples particle targets from it, and owns the `Points` + crisp text plane. Also exports `createCardScatter({ expand })` → `{ object, warm, setGrid, update, dispose }`, the near-camera card burst on the same shaders, and `createPullQuote(deps)`, the runtime's only handle on both: hold, hand-off, swap to the DOM, card sourcing and the near-band hand-over. `globe-gallery.js` calls it from fixed hook points (`build`, `layout`, `update`, `afterCards`, `takeNear`, `teardown`, …). See **Pull quote**. |
| `controls.js` | `createGlobeControls(deps)` → `{ setup, update, teardown, isSpinPaused }`. The on-canvas globe chrome (see Globe controls): the auto-spin play/pause toggle and the barrel's rotate/hint/rotate bottom row. Owns `paused` (the core reads `isSpinPaused()` each frame); its DOM is minted by `buildGlobeDom`, so it only binds, labels, and toggles classes. |
| `globe-gallery.css` | Globe-only CSS. Also defines `.globe-gallery`-scoped type-scale tokens (see Behavior notes). |

Experimental block: loaded via MEP from `libs/c2/blocks/globe-gallery/` — **not** registered in
`C2_BLOCKS` (`libs/utils/utils.js`). Three.js is the shared `libs/deps/three.js` (r160), the same
module `firefly-globe` imports.

### Module layout

`globe-gallery.js` is organized top-down: (1) module-scope tuning constants; (2) domain helpers
`fibSpherePos` / `cylinderMasonryLayout` (generic easings, `lerpN` and the arc-phase geometry live in
`math.js`); (3) `createGlobeGalleryRuntime()` — the per-instance closure holding sphere state +
behavior. The active breakpoint's render profile is one frozen `bp` object from `resolveBpProfile()`
per (re)init; functions destructure what they need, DI getters read `bp.*` live.

Inside the closure the **per-frame pipeline** is single-concern stages run in a fixed order by
`tick()`. `computeFrame()` refreshes the persistent `frameInput` from live layout/scroll state and
calls `timeline.js`'s pure `deriveFrame`, which writes every clock onto the persistent `frame`
context; each stage reads from it, and producer stages write results back, so one object flows
through to the card loop. **Both objects are allocated once and mutated in place** — stages consume
them synchronously and never retain them, so the pipeline allocates nothing. `frame` is the single
source for the clocks: read `frame.progress` / `frame.zoomT` rather than caching them in the closure.
(The persistent object is `frameState`; stages take it as a parameter named `frame`, so the two don't
shadow.)

Who writes what:

| | fields |
| --- | --- |
| `frameInput` ← the runtime, each tick | `scrollY` (via `readScrollY` — Lenis's un-quantised `animatedScroll` when it agrees with the document, else `window.scrollY`; see Scroll model), `reducedMotion`, `blockDocTop`, `blockHeight`, `formPx` (= `formedScrollPx()`), `viewportH` (= `H`, the CSS viewport height — **not** `innerHeight`; see One viewport height), `arcScale` (= `CARD_W_ARC / CARD_W_SPHERE`), `now` (rAF's frame timestamp, threaded through `tick`), plus `prevLenisY` / `prevNow` — the **only** inter-frame state, carried back after each derive (both re-baselined in `startTicker`, so a resume after an off-screen scroll doesn't spike `scrollVel` or charge the parked interval to `dtScale`) |
| `frame` ← `deriveFrame` | `lenisY`, `scrollVel`, `dtScale` (real frame time ÷ 16.67ms, clamped `[0.25, 3]`), the six clocks (`progress`, `arcCopyEntryT`, `arcPanT`, `gridFormT`, `sphereFormT`, `zoomT`), `gpWin`, `arcScale` — the entry rotation is per-card off `arcCopyEntryT`, see Arc entry cascade |
| `frame` ← the producer stages | `activeCamera` (`updateActiveCamera`), `sphereRotActive` (`updateSphereRotation`), `sphGroupZ` (`updateSphereGroupDepth`), `foldSphDist` (same) — declared in `createFrame` so the object's shape stays monomorphic |

**Grouped closure state.** Related mutable state lives in small plain objects rather than loose
`let`s: `drag` (`isDragging`/`velX`/`velY`/`pendingX`/`pendingY`, shared by reference with
`interaction.js` — see Drag physics),
`masonryMorph` (`active`/`t`), `sphereOrient` (`x` pitch / `y` yaw / `z` roll — see Sphere rotation),
`navNudge` (`active`, `target{X,Y,Z}` destination pose, `start{X,Y,Z}` pose when armed,
`frame`/`frames` elapsed/total from `KEY_BROWSE_FRAMES`, `KEY_MODAL_FRAMES` or
`ROTATE_STEP_FRAMES`; `targetZ` is roll, *changed* by keyboard centring only — the other two
callers pin it), `arcCopy` (`el` + last-written style strings, so `updateArcCopy` only
touches the DOM on change), and `ctxLoss` (see WebGL context loss).

**`tick()`'s stage order is load-bearing** — producers before consumers, and two stages read *last*
frame's value on purpose: `modal.updateAnimation` wants the previous `sphereGroup.position` with this
frame's refreshed `sphereRotQuat`, and `updateA11yFocusRing` must run after the card transforms so it
projects fresh world positions. `updateHintExit` advances `hintExitT` and precedes its one consumer
(`updateClickDragText`). Reordering is a silent one-frame-lag bug, not a crash.

**Per-frame vs. baked.** Anything the sphere's rotation can change is recomputed every frame rather
than stored: the facing tilt (`applyCardFacing` — a baked tilt rotates away from the camera), the
crop (see Architecture notes), and the fold's orientation. Two derived values are cached because
their inputs only change on a rebuild or a texture landing: `dragFlipZ` (`recomputeDragFlip`) and the
masonry solve.

Per-card placement (the largest stage) is a dispatcher over four runtime-scope branch fns — kept in
this file because they read deeply from the closure and run in the hot loop. Six DI modules are
injected with live-state getters: `materials.js`, the a11y widget, the modal, `interaction.js`, the
globe controls, and `cursor.js`. The modal owns its canvas/scene + the `MODAL_PHASE` state machine and reaches the sphere
only through the shared `sphereRotQuat` / `snapToSphereSlot` / `requestNavNudge` callbacks.

## Three.js

`libs/deps/three.js` exports only the symbols listed in `build/three.js`; a missing one is
`undefined` at runtime, not a build error. After adding a new `THREE.*` call, add the symbol to
`build/three.js` and run `npm run build:three` from the repo root. The build is tree-shaken, so most
of the library is simply absent — no `Frustum`, `Sphere` or `Box3`.

## Authoring contract

The block expects up to **five direct child rows** (the pull-quote row is optional):

| Row | Purpose | Content |
| --- | --- | --- |
| 0 | **Arc-copy** | heading → `.globe-gallery-arc-copy-title`; remaining `<p>`s → `.globe-gallery-arc-copy-body` (each authored paragraph is reused as-is, inline markup included) |
| 1 | **Cards** | a Milo fragment link with `#_dnb` appended (see below) |
| 2 | **Hint copy** — two cells | **cell 0** → the barrel's visible bottom row (mobile), the sentence between the rotate arrows; **cell 1** → the WebGL hint plane (the short one). Cell 0 keeps its authored `<p>`s, one per line; cell 1 is a canvas texture, so its `<p>`s are joined with a space. Either may be bare cell text |
| 3 | **A11y strings** | one cell, `\|\|`-separated in on-screen order: **instructions \|\| rotate-left \|\| rotate-right \|\| pause-spin \|\| resume-spin \|\| prev-arrow \|\| card-position template \|\| next-arrow \|\| close** — nine parts, the entry-widget instructions first. Each part falls back to English independently |
| 4 | **Pull-quote** | heading → quote; first `<p>` → name; second `<p>` → role |

Rows are positional. `parseAuthoredContent(el)` returns
`{ arcCopy, pullQuote, fragmentHref, hintText, touchHint, instructions, labels }` (`labels` =
`{ rotateLeft, rotateRight, pauseSpin, resumeSpin, prevCard, nextCard, closeBtn, cardLabel }`, built
by `buildLabels` from row 3's parts — which it indexes 1:1, so `DEFAULT_LABELS[0]` is the
instructions slot even though `buildLabels` itself doesn't expose it); cards are loaded separately
from the fragment link by `fetchFragmentCards`.

**Two cells, not one `||` pair.** The hint strings render in two unrelated places — a WebGL texture
and an HTML row — at different breakpoints and different lengths, so they get a column each rather
than sharing a divider. The divider now means exactly one thing: "this is row 3."

**No back-compat path.** An earlier contract packed rows 2 and 3 into a single row (a `<p>` of
`<hint-plane label> \|\| <touch instruction>`, an instructions `<p>`, a label-list `<p>`) with the
pull-quote at row 3, and content published before the globe controls shipped carried only the four
modal labels. None of that is read any more: the parse is **strictly positional**, because on this
block re-authoring the table is cheaper than carrying a second parse shape forever. A page still on
an old shape doesn't half-work — it mis-assigns strings — so **republish the content and the code
together**.

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

**`destroy()` must not `forceContextLoss()`.** The canvas *element* is reused across rebuilds (band
crossings, reduced-motion toggles), and a force-lost context is never restored — the next renderer on
that canvas is born dead ("Context Lost"). `renderer.dispose()` alone frees this renderer's GPU
resources. There is a comment guarding this line; leave it there.

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
| `<p><picture>…</picture></p>` | **image** (+ its `<img alt>` → **alt**) | required — sections without one are skipped (and logged to `lana`); a `<picture>`/`<img>` **direct child** of the section works too (see below), as does a bare inline `<img>`; the **first** image wins, later ones are ignored; `alt` falls back to an `alt text to be authored` placeholder when the image has none |

**Authored order does not matter.** Every row above is matched by *markup*, never by position: the
`<em>` paragraph is the role and the `<strong>` paragraph (or a heading) is the name, whichever
comes first. The modal renders **name above role** either way — that stacking is
`.globe-gallery-modal-info` DOM order, not the parse.

**A card with no copy is a lone unwrapped image.** When the image is the section's *only* content
the pipeline drops the `<p>`, so `.plain.html` serves `<div><picture>…</picture></div>`. Both the
section/container dispatch (`CARD_CONTENT_TAGS`) and the segment reader must therefore accept
`PICTURE`/`IMG`, not just `P`/`UL` — otherwise the section reads as a *container*, yields no cards,
and drops silently. An imageless section logs to `lana`. A card with no copy renders on the globe
and opens a modal with empty name/role/description/badges — there is no non-clickable-card path.

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

The row is read from a **clone** with the feature `<ul>` detached, so the product half matches with
plain `querySelector` without walking into the feature list or mutating authored DOM. A
direct-children-only read would silently drop every `<p>`-wrapped badge.

### Reusing authored paragraphs

Both the card **description** and the arc-copy **body** hold the authored `<p>` elements
themselves, not extracted strings, and `renderParagraphs(container, paras)` moves them on screen
with `replaceChildren`. Reusing the authored node is what keeps inline `<a>`/`<strong>`/`<em>`
alive — a `textContent` read flattens them, and re-serializing to an HTML string means escaping
and re-parsing markup we already have as DOM. This is also why both containers are `<div>`s in
`buildMarkup`: paragraphs can't nest inside a `<p>`.

**Nothing is cloned, because a paragraph is never in two places.** Each instance parses its own
nodes, and only one modal shows one card at a time. Re-rendering the same card is safe:
`replaceChildren` moves nodes a previous render detached (the parse holds the reference), and
re-rendering the same nodes into the same container is a no-op. Cloning would only be needed to
render one card's paragraphs into two live containers at once.

**Card count.** `N_TOTAL` is the authored count. Every authored card gets a real sphere slot at
every breakpoint, so barrel, modal, and the keyboard/SR browse gallery all run over the same index
range.

Sphere (Fibonacci) and arc (normalized `fanT`) are count-agnostic, and so is the grid. Every
authored card renders at both breakpoints. `GRID_WINDOW_COLS` and `GRID_ROWS` are not two halves of
one nominal dimension — they control different things:

- **`GRID_WINDOW_COLS`** sets card size and gap (`gridCardW`) and the framing window (`totalW`). It
  is **not** the layout's column count, and it does not mean the same thing on both bands: sm's
  `gridCardW` includes the gap term, so its 3 columns span the viewport exactly; md's omits it, so
  its 9 columns span 1.44× the viewport and only 6.33 columns are actually across the screen.
- **`GRID_ROWS`** is the column wrap point. The layout is `ceil(N / GRID_ROWS)` columns wide, floored
  at `GRID_WINDOW_COLS` — 47 cards is 6×8 on sm and 10×5 on md, not 3×8 and 9×5.

`totalW` stays derived from `GRID_WINDOW_COLS`, never from the occupied count: it sets the column
phase against the viewport, and that phase is the framing. Deriving it from the occupied count moves
the phase by half a pitch whenever the count flips parity (at 47 cards sm re-frames from 3 full
columns to 2 full plus two slivers).

`colShift = round((occupied − GRID_WINDOW_COLS) / 2)` slides the occupied range across that fixed
window in whole columns, so the visible columns are the middle of the set and the off-screen
overflow splits both ways. Whole columns is what keeps the framing intact. From 24 to 64 cards sm
holds 3 full columns and md 5 full + a half each side, with overflow balanced to within one column;
the residue is ≤1 column when `occupied − GRID_WINDOW_COLS` is odd.

`colShift` steps only when the occupied count changes by two columns (16 cards on sm, 10 on md). A
step slides the whole set one column pitch, so the framing and relative layout hold but the visible
window shows a different slice.

- **md (≥768).** The grid overflows the viewport ~1.44× as a "more cards beyond" cue. Practical
  ceiling is texture memory, not layout.
- **sm (<768).** `GRID_WINDOW_COLS` columns fit the viewport exactly, so every additional column is
  off-screen. The barrel carries the full set, and the same memory ceiling applies at the sm texture
  cap.

**Modal gallery = all authored images.** The modal's `getCount()` and the a11y gallery's both read
`CARD_CONTENT.length`, which equals `bp.N_TOTAL`. **All** modal nav — on-screen arrows and touch
swipe — routes through the same cross-warp transition on **every** breakpoint (`navigate` →
`startDesktopNavTransition`); touch swipe just builds a warp preview during the drag, then commits
that transition on release. Every modal card has a sphere slot, so it flies to/from the globe on
open/close.

Fewer cards than the nominal grid → the last column is partially filled (no modulo;
`getCardMetadata(i)` indexes directly). `ARC_DENSE_COUNT` = `ARC_DENSE_FRACTION × N_TOTAL`, so the
clustered:spread arc ratio holds at any count.

### Texture memory budget

Card images are downscaled to a per-device cap on upload. This is load-bearing on iOS, which uploads
textures as uncompressed RGBA + mipmaps: uncapped, the base set (all cards resident during the
arc→grid settle) overruns the WebKit per-tab cap and kills the tab with no JS error. Caps live in
`globe-gallery.js` (`CARD_TEX_SM/MD`, `MODAL_TEX_SM/MD`):

- **Base set** (`loadCardTextures({ maxTexH })`), all cards resident — dominates. The cap is on
  **height**, not the longest side (`fitCardDims`): every card slot is portrait-ish, so the
  cover-crop discards width and height is the axis that reaches the screen. Capping the longest side
  instead starves wide sources on exactly that axis — a 16:9 image landed 256×144 and then lost half
  its width to the arc's crop, ~1.8× softer than a portrait card in the same slot. The request asks
  by height too (`optimizeImgUrl(src, px, 'height')`; the media service honours a lone `height=`).
  `WIDE_TEX_RATIO` bounds width for a panorama nobody sized for. `CARD_TEX_SM` / `CARD_TEX_MD`
  cap the height.
  Not an fps cost — mipmapping makes sampling track screen pixels; only memory + upload scale.
  - **Sizing reality check** (measured, DPR 2): the biggest card render is the **arc**, not the grid
    — `CARD_W_ARC` is 220 CSS px at sm, so 440×608 *device* px against a `CARD_TEX_SM`-tall texture (~0.44
    texels/device px, i.e. upscaled ~2×). The sm barrel card is ~140 CSS px (~0.6–0.9 texels/device
    px) and the grid card ~100. md is oversampled everywhere (1.6–4.6). If sm cards ever read as
    soft, `CARD_TEX_SM` is the dial — and the arc is the frame to judge it on.
- **Modal** (opened card only), loaded lazily, disposed on close/nav, so ≤1 resident. `768` on sm,
  `2048` on md (the on-screen modal tops ~1400–1600 device px, so 2048 bounds the transient ~17MB vs
  ~64MB for a 4000px original). When the modal cap ≤ the base cap it reuses the base texture
  (`loadModalUpgrade` returns `null`); with current numbers both upgrade. Wired through `modal.js`:
  `getModalMaterial` placeholders the base texture, `requestModalUpgrade` swaps the sharper one when
  decoded, `releaseModalTexture` disposes on close/nav/destroy.

**Estimating the cost.** GPU textures store uncompressed regardless of file size: `resident ≈ w × h ×
4 × 1.333` (RGBA + the mipmap pyramid, converging to +⅓). Dimensions are the *downscaled canvas*
(**height** = cap, width = height × the source aspect), not the source; the cover-crop doesn't
change residency. So a card costs `cap² × aspect × 5.33` bytes: at 256, a 3:4 source ≈ 0.26MB and a
16:9 ≈ 0.62MB. Every authored card is resident at both breakpoints. Against the authored set
(aspects 0.57–1.79, 50 cards): **sm ≈ 16MB** and **md ≈ 139MB**. Re-measure before growing the set
much past 50. Watch md on iPad, which takes the md profile: if it needs trimming, dropping
`CARD_TEX_MD` to 640 lands ~97MB, and md would still be oversampled (~2.8 texels/device px on the
largest card).

The **"Click & Drag" hint** (`createClickDragTexture`) is a separate line item, but **only on sphere
geometry** — the barrel path never builds it (see Behavior notes), which is what removes it from the
phone budget entirely. Where it is built, its canvas matches the camera aspect, so `TEXT_MAX_SIDE`
caps the *longest* side: uncapped, a portrait phone derived a 2048×4180 ≈ 45MB canvas, mostly empty.
Capped, portrait topped ~1004×2048 (~11MB); a 1512-wide desktop lands 2048×1330 (10.9MB).

**Every `CanvasTexture` costs its pixels twice** — once on the GPU, once in the `<canvas>` 2D backing
store Three keeps referenced as `texture.image`. `releaseCanvasAfterUpload` (`materials.js`) reclaims
the CPU half by zeroing the canvas from `texture.onUpdate`, which Three fires immediately after
`texImage2D` + `generateMipmap`. **Only the hint texture meets its preconditions**, and that is the
only place it is applied — worth a measured **10.39MiB** (2048×1330) on a 1512-wide desktop, the
third-largest canvas on the page and about double the biggest card. It is a desktop-only win now
that the barrel skips the hint plane altogether.

Three preconditions, all load-bearing. Check them before applying it anywhere else:

1. **Exactly one `WebGLRenderer` may ever upload it.** Renderers upload independently, so a texture
   shared across contexts re-uploads from a 0×0 canvas and renders empty.
2. **Nothing may set `needsUpdate` on it afterwards** — same re-upload trap. A resize is fine: it
   rebuilds mesh *and* texture from scratch (`doLayout` → `buildTextMesh`).
3. **Nothing may read `texture.image.width/height` afterwards** — the aspect is gone. `modal.js`'s
   two reads are guarded and run pre-render, but tooling that probes `.image` goes blind to it.

It also pays off **lazily**: Three uploads a texture only when a visible object using it is drawn,
so the canvas survives at full size until the hint first renders (verified — 2048×1330 at scroll 0,
0×0 once formed). A visitor who never scrolls into the globe keeps the whole 10.39MiB. Forcing it
earlier would mean `renderer.initTexture()` at build time, i.e. eagerly uploading ~13.8MB to the GPU
for a plane that may never show — a worse trade.

Deliberately **not** applied elsewhere:

- **The base card set** — where the win would actually be (~105MB on md). `getModalMaterial` hands a
  card's base texture to the *modal* renderer as its fly-out placeholder, so two contexts upload it
  independently, and freeing the canvas after the first would blank the opening card until its
  hi-res decode lands. Claiming it needs the modal card drawn by the main renderer (separate today
  because CSS blurs the main canvas and the modal card must stay sharp above it), or the placeholder
  decoupled from the base texture. Do **not** "fix" this by calling `releaseCanvasAfterUpload` in
  `loadCardTextures`.
- **The modal upgrade** — it would work, but ≤1 is ever resident and it is disposed on close/nav, so
  the ~11MB is transient; and it puts the opened card's aspect out of reach of anything reading
  `map.image`.

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

**Rows 2 and 3 carry all the block-chrome copy**, each string localized inline:

| Where | String | Used for | Fallback |
| --- | --- | --- | --- |
| Row 2, cell 0 | touch instruction | the barrel's visible bottom-row copy, between the rotate arrows (see Globe controls). Real on-screen prose, so it's a sentence, not a label. **The authored `<p>`s are kept as nodes, one per line**, so the author owns the line break; a cell with no `<p>` renders as plain text | `Click and drag to rotate. Tap to dive deep into the artwork.` (`DEFAULT_TOUCH_HINT`) |
| Row 2, cell 1 | "Click & Drag" | WebGL hint plane copy (decorative, not exposed to AT — the a11y instructions cover the real affordance; `createClickDragTexture` auto-scales the font, so keep it short) | `Click & Drag` (`DEFAULT_HINT`) |
| Row 3, part 1 | instructions | a11y entry-widget accessible name (see below) | `Press Enter to enter the gallery, then Tab through the images.` (`DEFAULT_GALLERY_INSTRUCTIONS`) |
| Row 3, parts 2–9 | `rotate left \|\| rotate right \|\| pause \|\| resume \|\| prev \|\| {index} of {count} \|\| next \|\| close` | the eight UI labels: the globe controls' four `aria-label`s (the spin toggle names the action it performs, so it needs both states) + modal prev/next/close `aria-label`s + the sr-only card **position** — `\|\|`-separated in on-screen order (`buildLabels`) | each part → English (`DEFAULT_LABELS`) |

The instructions lead row 3 because they are the a11y row's subject: one cell holding every string
a screen-reader or keyboard user hears, in the order they meet them — the entry announcement first,
then the controls it tells them about.

The card-position part is a **tokenized template**: single-brace ICU-style `{index}`/`{count}`
substituted at runtime so each locale controls word order. Single brace keeps them distinct from
Milo's `{{key}}` placeholder syntax; a value missing either token falls back to `{index} of {count}`.
The `\|\|` divider is safe because the pipe is not natural-language punctuation in any locale.

The entry widget has **no separate name label**: its authored **instructions** (row 3, 1st part)
ARE its accessible name (one hidden-until-focus element serving as both the popup and the
`aria-labelledby` target), so a screen reader announces exactly the on-page instruction — no
redundant "N images" prefix. The modal announcement is position only (the creator name is already
in the heading).

**Also authored:** arc-copy, pull-quote, card name/role/description (rows + fragment); each
browse-image button's `aria-label` and the modal's `role="img"` label is the card's authored
**alt** (→ `alt text to be authored` when none); badge names + logos come straight from the
authored product links.

### Hanging the opening mark

The pull-quote outdents its opening quote into the margin, so the first line's text meets the
same column the rest of the quote and the name/role below it sit on. `hangOpeningMark`
(`authoring.js`) does this in **every** browser by measuring the mark and setting a negative
`text-indent` in `em`.

**Two callers.** `hangOpeningMark(el, room)` takes the gutter in px; `gutterOf(el)` reads it off an
element's `padding-inline-start`. `plainQuote` passes the pull-quote's; the **modal description**
goes through `hangParagraphs(container)`, which hangs **every** paragraph that opens with a mark,
not just the first, and runs from `populateModal` after `renderParagraphs`. `hangOpeningMark` clears
`text-indent` before measuring, so it is idempotent over the authored `<p>`s, which
`renderParagraphs` moves rather than clones. It needs **no resize or breakpoint hook** — the outdent
is the first glyph's advance and does not depend on where lines wrap.

**The description clips, so it reserves a gutter.** `--gg-hang-max` is `0.8em` — the ceiling
`hangOpeningMark` enforces, since it declines any advance at or past `0.8 × font-size`, so the two
move together. It is `em` and **unregistered on purpose**: a custom property substitutes as tokens,
so the `em` resolves against each *use site's* font-size, matching whatever text is being measured.
Give it an `@property` `<length>` syntax and it would resolve once against `.globe-gallery` instead.

The modal description applies it as `padding-inline-start` and takes the same amount straight back
off as `margin-inline-start`, so the text column does not move. It needs it because its
`overflow-y: auto` makes `overflow-x` compute to `auto`; only its start margin is negative, so the
end edge and the scrollbar on it stay put. Its md+ rule resets with `margin-block` — a `margin`
shorthand there zeroes the gutter. The pull quote does not clip, so its hung mark needs no gutter.

**`hanging-punctuation: first` is deliberately not used.** It's the native spelling of this and it
was in the CSS, gated by `CSS.supports` so the measurement only ran where the property is missing
(Chrome, which has never shipped it). That split the behaviour by *character*: **WebKit hangs only
`Ps`/`Pi`/`Pf`** — `“` `«` `(` all hang — **and not ASCII `"` or `'`**, which the CSS Text hangable
set includes and this block's regex therefore includes too. So an authored straight `"` (what
translators and DA authors actually type) outdented in Chrome and sat inline on iOS Safari, while a
curly `“` worked in both. `CSS.supports` is `true` in WebKit either way, so no feature query can
express the difference. The measurement now runs unconditionally and the property stays
out of the CSS entirely — re-adding it would double-outdent WebKit on the marks it does hang.

**Measured, not tabulated.** The mark and its width both change by locale — `“` (~0.49em), `«`,
`„`, `「` (a full em) — and *which* mark appears comes from the **authored copy, not the page's
locale**: a `de` page whose translator typed `"` gets ASCII, not `„`. So the code tests the first
character and measures that glyph in the font the locale actually resolved, rather than keeping a
per-locale table that would be both unmaintainable and keyed on the wrong thing.

**Which characters count** — Unicode general categories, matching the set CSS Text hangs, so the
measured outdent acts on exactly the characters the spec would hang:

| Category | Meaning | Examples |
| --- | --- | --- |
| `Ps` | open bracket | `(` `「` `（` — and `„` `‚`, which Unicode files as brackets, not quotes |
| `Pi` | initial quote | `“` `‘` `«` `‹` |
| `Pf` | final quote | `”` `’` `»` `›` — several locales **open** on these (sv/fi `”`, da `»`) |
| + `"` `'` | ASCII | category `Po`, since one character serves as both opener and closer — and the one WebKit's native path skips |

Categories rather than a literal list, so a new locale needs no code change. `Pe` closers (`」`),
dashes, and the rest of `Po` (`!` `¿`) are excluded.

**Full-width CJK brackets are skipped**, on two tests: the mark measuring **≥ 0.8em** (`「『（` run
~0.96em vs ~0.55em for the widest Latin quote `«`, so the cutoff isn't delicate), or **exceeding the
padding**, where it would be shoved past the viewport edge into the block's `overflow-x: clip` and
sheared. Either test leaves the mark inline. The width test is what makes that result
breakpoint-independent: `--gg-copy-pad` (24→48→64) and `heading-1` (40→56→80px) step at *different*
widths, so the padding test alone leaves
`768–1023` a band where a `「` fits and hangs while being suppressed everywhere else — and since the
measurement runs once at init, a later resize would strand it and shear.

Proper CJK support is a different rule, not a smaller number: JIS sets a line-head opening bracket
half-width, aligning its *ink* to the margin rather than the following character to the column.
Worth building only if a CJK locale ships this block.

**Implementation notes** — each is load-bearing:

- Runs after `document.fonts.ready`: Adobe Clean's metrics differ from the fallback's.
- Canvas, not `getBoundingClientRect` — the quote sits under `transform: scale(.9)` until it
  activates, which scales a client rect but not a canvas measurement.
- Uses the **advance**, not ink width, and adds back the `letter-spacing` that `measureText` omits.
- Emitted in `em`: `heading-1` is responsive, so a px indent would go stale on every breakpoint. The
  ratio drifts ~0.02em (≈1px at 80px) because `letter-spacing` is a fixed px. Also covers text zoom.
- `textContent` is trimmed — authored markup arrives with newlines that would defeat the
  first-character test.
- The `ctx.font` readback guards a silent failure: canvas ignores an unparseable shorthand and keeps
  its `10px sans-serif` default, which would measure a plausible but wrong advance.

## Architecture notes

**Aspect: one crop rule, derived every frame, never stored.** A decode contributes exactly one
number per card — `card.srcAspect`, the image's native aspect (`loadCardTextures`' `onEach`). Every
phase then calls `applyCardFit(mesh, card, planeAspect?)`, which asks `coverFit(srcAspect, aspect)`
(`math.js`) for the UV repeat/offset and pushes the same `aspect` into the corner SDF's `uAspect`.
`planeAspect` defaults to the mesh's **live** scale — `CARD_W_SPHERE = CARD_H_SPHERE × CARD_ASPECT`,
so the geometry's own aspect factors out and `scale.x / scale.y` is the shape on screen. Arc and grid
pass `CARD_ASPECT` explicitly (uniform scale, so it is the same number, just cheaper).

Consequences worth keeping:

- **Nothing to keep in sync.** Caching a crop is what broke this three times: the fold lerped a
  cached `imgAspect` independently of the scale it described (distorted mid-flight); `placeArcCard`
  never pushed the cached crop at all, so a card that decoded while still on the arc rendered
  stretched to `CARD_ASPECT` until the next phase overwrote the uniforms; and the modal fitted itself
  from the base texture's rounded dimensions instead of the one it was displaying.
- **A uniform scale is a no-op**, so the hover scale (`hs` on both axes) and the RM group shrink
  cancel out, and the md sphere — which sizes each card to its own aspect — resolves to identity: the
  desktop globe crops nothing, measurably (`repeat = [1, 1]` on every card).
- **The crop follows the card into the modal, by the same rule.** `MODAL_FRAG` carries the same
  `uRepeat`/`uOffset` pair, and `pushModalCoverUV` crops the *displayed* texture
  (`modalUAspect`) to the aspect the plane is drawn at this frame — read from `mesh.scale` straight
  after the frame's scale write. No eased crop state: it *is* the barrel's crop on the frame the card
  leaves (mid-fold included — the interactive gate is global `SPHERE_INTERACTIVE_T`, not per-card
  `fdE`, so a card can be opened part-way through its fold), and identity once the fly lands, because
  `computeModalTarget` sizes the plane to exactly that aspect. Easing the crop on the animation's `t`
  instead is *not* equivalent — a linear crop lerp against a ratio-of-lerps scale mismatches by ~2%
  mid-flight (measured); tracking the scale is 0.00%.
- **Where cropping is therefore visible:** the arc/grid deck (every card in a `CARD_ASPECT` slot, so
  a 16:9 image keeps ~48% of its width) and the sm/coarse barrel *only past* `CYL_ASPECT_CAP`. The
  desktop globe and the settled modal show the whole photo.

**DOM is JS-built and scoped to the block root.** `init(el)` calls
`parseAuthoredContent(el)` first (arc-copy, pull-quote, fragment href), then
`buildGlobeDom(el, labels, { arcCopy, pullQuote })` wipes the block, injects the
markup, fills the arc-copy / pull-quote slots, and **returns the `gid`** (the
per-instance unique-id suffix it mints from a module-level counter in
`authoring.js`). The runtime finds nodes by **class, queried within
`el`** (`root.querySelector('.globe-gallery-canvas')`, `.globe-gallery-modal-canvas`,
`.globe-gallery-pullquote`, `.globe-gallery-modal*`, …) →
**multiple globes can coexist on a page**. The only id-bearing nodes are made
unique per instance via that `gid` suffix (ids, not classes, because both are
document-wide id references): the modal heading/role-label/position — the heading's own id plus its
`aria-describedby` IDREFs. `el` itself is the scroll runway
(height is `--gg-runway-height` on `.globe-gallery`, collapsed to `100vh` under `.globe-gallery-reduced`);
the canvas is `position:fixed`. The shared body-level global (acceptable, one modal at a
time) is the `.globe-gallery-modal-open` scroll lock.

**Scroll model.** (For *what happens at each point* on that scroll, see **Lifecycle timeline**
below — charts + an event table. This subsection is the mechanism that gets you there.) The block
element *is* the scroll runway (its height is `--gg-runway-height`) — there's
no separate runway element. Raw scroll is measured against the block's own metrics (`blockDocTop` =
top in document space, `blockHeight` = `offsetHeight`, both refreshed in `doLayout` + a body
`ResizeObserver`), then remapped **piecewise** (in `computeFrame`) into the `progress` 0→1 the phase
math consumes. This decouples formation length from the tail, so the runway can be trimmed without
speeding up the globe:

| segment | raw scroll | → progress | owns |
|---|---|---|---|
| **formation** (arc→grid→fold→settle) | `0 → --gg-formation-vh` | `0 → foldLast` (≈0.322) | the `P_*` phase constants |
| **tail** (zoom-through + pull-quote) | `--gg-formation-vh → --gg-runway-height` | `foldLast → 1` | `zoomT`, hint-text + controls retire, pull-quote |

Formation is **locked** to a fixed scroll length, so `--gg-runway-height` sets tail length only.
`formedScrollPx()` is the single source used by the remap, the reduced-motion pin, and the focus-snap.
Within the tail, `zoomT = clamp((scroll − formation) / (runway − formation), 0, 1)` drives the camera
(`CAM_Z_SPHERE → CAM_Z_END`), the hint-text and controls retirement, and the pull-quote.

**The scroll clock is `lenis.animatedScroll`, not `window.scrollY`.** `readScrollY` takes Lenis's
own float position while it agrees with the document to within `LENIS_TRUST_PX`, and the DOM
value otherwise — a stopped Lenis, or one outrun by something else moving the window, can hold a
stale value. Two consequences:

- **With no Lenis on the page the input is quantised** to a device pixel. At reading pace that is one
  step every few frames, and the phases amplify it (~3px of pull-quote line travel per scrolled
  pixel): the arc cards stutter and the quote shakes.
- **Motion outlives the page.** `animatedScroll` converges on its target exponentially (τ ≈ 200ms at
  milo's `lerp: 0.08`), and Lenis resyncs it to the quantised value on any scroll event it did not
  drive. So the block is still moving for a few hundred ms after the DOM has stopped — visible in the
  arc phase as a final small nod, and in the scroll-velocity CA as a fringe fading out over ~370ms.

### Card scatter

`scatterCards` (authoring.js) permutes the parsed fragment cards once, in `init`, before the
runtime ever sees them. The permutation is a Fisher-Yates driven by a MINSTD LCG seeded with the
string `SCATTER_KEY`, so the order is identical for every user and every reload — a QA report
reproduces. Editing `SCATTER_KEY` to any other string re-scatters everything. `seedFrom` is a
polynomial hash rather than a sum of char codes: a sum collides on anagrams, and its small result
makes the LCG's first output tiny, which pins the first swap near `j = 0`.

**Two orders exist, and the index you hold is always the display one.** A card's array position
is its *display* index: it drives arc entry order, grid slot, globe depth rank, and barrel column,
which have no inherent first or last. Its `authoredIndex` field is its pre-shuffle position, which
drives everything the reader can count.

| Reads display order | Reads authored order |
| --- | --- |
| arc / grid / globe / barrel placement | modal next/prev (`stepCard`) |
| `getCardMetadata(i)`, `cards[i]`, `cardAspects[i]` | modal counter and `cardLabel` (`authoredNo`) |
| `applyCardOrder`, `cardButtons[i]`, `dataset.idx` | a11y button DOM order, so tab order matches |

`AUTHORED_ORDER[authoredIndex] = displayIndex` is the inverse map, built once in
`createGlobeGalleryRuntime`; `authoredNo(i)` is the 1-based number to show for display index `i`,
and `stepCard(i, dir)` is the display index one step away *in authored order*. The a11y list keeps
`cardButtons` keyed by display index but appends the buttons in `cardOrder`, so tab order and the
"n of 47" the modal shows agree.

On the barrel the scatter is damped: `cylinderMasonryLayout` assigns columns by load, so a card's
height is driven by its aspect and its column by the balance solve, not by input order. Within a
column cards then sit in index order. The permutation still breaks up same-aspect horizontal bands,
but arc and grid — which key off the index directly — scatter far more.

Cards without an `authoredIndex` fall back to identity, so an unshuffled array behaves as it did
before the scatter existed.

### Card draw order

`renderer.sortObjects` is always `true`, and `applyCardOrder` is the only writer of a card's
`renderOrder` — it runs after whichever `place*` shaped the card, so it wins over all of them.
Three's transparent comparator is `renderOrder` → `z` descending → `id`, so `renderOrder` alone
decides the wall; a card's live depth never does.

Two regimes, switching once at `CARD_ORDER_HANDOVER_T` (just past the last peel landing, so the whole
arc→grid settle is inside the first):

| `sphereFormT` | key | order |
| --- | --- | --- |
| ≤ 0.5 | `CARD_ORDER_BASE + i` | index — card *i* paints over card *i−1*, the entrance stack |
| > 0.5 | quantised `spherePos.z` | destination depth, back to front |

The second key is the card's **destination**, not where it currently is, so it is constant for the
whole fold (`sphereRotQuat` is identity until the globe goes live) and no card can overtake another
mid-flight. At `fdE` 1 a card *is* its destination, so the same key is the formed globe's
back-to-front order; drag rotates it and it stays correct.

**On the sphere the switch is a no-op.** `buildCards` sorts the Fibonacci slots by `z` before
handing them out, so a card's index is its depth rank and both keys produce the identical order.

**On the barrel it is a real reorder**, and unavoidable. `cylinderMasonryLayout` sizes each slot
from its own card's aspect, so slot and card are a matched pair — permuting them re-crops the
photos. The barrel keeps the packer's pairing and pays one reorder at the handover instead.

**Hover overrides the depth key.** Past the handover, a card on the near half (`n >= 0`) with
`hoverT > 0.01` is lifted out of the depth band into the `HOVER_ORDER_STEPS` slots above it
(`-7 … -1`), so the enlarged card paints over every neighbour. The slot is `hoverT`-scaled, so
during a sweep between two cards the one easing in outranks the one easing out. `hoverT` decays over
~30 frames, so a card scrolled out of `globeLive()` while hovered holds its promoted order until the
scale has come back down with it.

Two things the numbers rely on:

- **`|spherePos.z| ≤ SPHERE_R`**, which keeps the depth key inside `[CARD_ORDER_BASE ±
  CARD_ORDER_STEPS]`, and the hover band inside the +8 slack above it — both below `modal.js`'s 0/1
  and above `TEXT_ORDER`. It holds because the sphere's
  slots are all at radius `R`, and the barrel is yaw-only (`interaction.js` zeroes `dy`), so its
  rotation cannot lift a slot's `z` past its ring radius. A barrel slot's distance from centre is
  `hypot(ringR, y)`, up to ~2.3 R on sm, so enabling pitch there would need the clamp widened and
  the band resized with it.
- **The index key must be per-card, not a shared constant.** A shared value ties, and the tiebreak
  falls through to live `z` — equal while the arc is coplanar, but divergent the moment cards fold,
  which resurrects the live depth sort mid-fold.

`resolveMasonryLayout` (sm, once every texture has loaded) morphs `spherePos`, so cards can reorder
during that morph. It is not scroll-driven and cannot oscillate.

### One viewport height

`H` is **not** `window.innerHeight` — that identifier does not appear in the block. It is
`.globe-gallery-world`'s `offsetHeight`. That box is `height: 100vh` and is the canvas' own parent, so
`measureViewportH()` reads 100vh in px straight from CSS. Scroll clocks and rendering both use it, and
it is the only viewport height here. Nav-centring does not add a second one (see **The nav band**): the
canvas stays full-bleed `100vh` and the globe is re-centred by skewing the perspective camera's
projection, not by handing anything a shorter height.

**Anything that gives the renderer, either camera, or the scroll clock a height other than this `H`
will re-fit the composition.** On iOS the URL bar resizes the layout viewport, so `innerHeight` shrinks
and grows mid-scroll while `vh` resolves against the large viewport and never moves. Reading the window
therefore rewinds `progress` (the barrel re-plays) and steps the camera distance and drawing-buffer size
mid-scroll (an "enlarge/shrink" pop). With `H` as the only height, a URL-bar move is a complete no-op:
`doLayout` re-reads the same `H` and takes its unchanged-`W`/`H` exit.

**The trade-off, deliberate:** the canvas is sized to the large viewport, so while the bar is showing,
its bottom ~50–90px sits behind the bar and the globe reads slightly larger than the visible area. That
matches what the block's CSS already does, so the WebGL layer and the DOM chrome agree. The modal's
chrome stays on `100dvh` (its buttons must stay reachable); only its photo canvas rides `H`, and the
scroll lock means the bar can't move while it's open.

**Do not switch to another viewport unit.** `lvh` is what `vh` already means here, and `svh` is constant
too, so both are pure documentation. `dvh` would make CSS agree with `innerHeight` by making the box
grow and shrink mid-scroll — on `.globe-gallery-world` that brings the pop back, on `--gg-runway-height`
it rescales the runway under the scroll mapping. Either way the artifact returns.

**Consequences worth knowing:**
- **`H` is `1` while the section is hidden.** `display: none` → `offsetHeight` 0, clamped to 1 so
  nothing divides by zero. Everything sized from `H` is recomputed at the un-hide.
- **`layoutObs` calls `doLayout({ fromResize: true })`** rather than measuring by hand. The un-hide
  arrives as a body resize with no window resize behind it, so it is the only thing that upgrades `H` at
  that moment.
- **Reduced motion needs no branch.** `.globe-gallery-reduced` leaves `.globe-gallery-world` at
  `height: 100vh` and only un-sticks it. Keep it that way — a `vh` override on that element would put an
  imprecision into the one function every clock depends on.
- A genuine viewport change still lands: 844→600px tall moves `blockHeight` 3882→2760, and the same
  *fraction* of the runway holds the same phase.

**CSS is the source of truth for the scroll budget**, read per layout in `readCssVars()`, so retuning is
a CSS-only edit. The CSS is **mobile-first**: the base `.globe-gallery` rule is sm, `@media (width >=
768px)` overrides md. `--gg-formation-vh` and `--gg-zoom-vh` are authored at both; the runway is
shared.

| prop | effect | ↑ does |
|---|---|---|
| `--gg-runway-height` | total height = formation + tail, while the quote particles are off | scales the whole tail — the zoom, the controls retiring, the hint fade, the reveal point, and the sparse-shell stretch before the quote |
| `--gg-formation-vh` | locked formation length | moves scroll from tail into formation, leaving total height alone; slows arc → grid → fold |
| `--gg-zoom-vh` | the camera dolly's scroll length while the quote particles are on; per breakpoint | slows the zoom: more scroll inside the globe before the hand-off |
| `--gg-pq-height` | block height while the quote particles are on, written inline by `syncHeight`; unset falls back to the runway; `-reduced`/`-empty` still collapse the block | not a knob: derived from formation, zoom, hand-off and flight (see Block height) |

**No JS fallback copy of these numbers exists**, so CSS cannot be quietly overridden by a stale literal.
The zero-box gate means `readCssVars()` always finds the block's properties, so the two rules below
are not load-bearing for first paint. They still cover an authored `0`, and a read that degrades
rather than poisons is worth keeping whatever gates it:

- `readCssVars()` **leaves the previous value in place** when a property doesn't resolve. So
  `formationVh` keeps its declared initializer (`0`) and can never become `NaN` — which matters because
  `Math.max(1, NaN)` is `NaN`, so one unresolved read would poison `progress` and silently kill the
  animation. Its `cssNum` helper tests `Number.isFinite` rather than `||`, so an authored `0` isn't
  swallowed.
- **`0` is a safe value, unlike `NaN`:** every division in `deriveFrame` is guarded (`Math.max(1,
  formPx)`, `Math.max(1, blockHeight - formPx)`) and clamped, so a pre-stylesheet frame renders at
  `progress` 0 or 1 rather than breaking. Keep it that way — a new unguarded `/ formPx` would turn this
  into a crash. `measureViewportH()` clamps to `1` for the same reason: it is a divisor too.

`layoutObs` → `doLayout()`, whose first act is `measureBlock()` + `readCssVars()`, guarantees the real
values land, with no extra listener and no "already resolved" flag: `processSection` un-hides the
section only after both the stylesheet and script resolve, and that un-hide changes the body height, so
the `ResizeObserver` fires at least once with the stylesheet applied. `measureBlock()` sets
`blockDocTop` + `blockHeight`; `blockHeight` is plain `offsetHeight`, which is `0` (never `NaN`) while
hidden. **No JS file holds a copy of these lengths**
— not even for docs, since Milo ships `timeline.js` unbundled, so a doc-only export rides along in every
page's payload. The derivation snippet reads them out of `globe-gallery.css` instead (see
**Re-deriving these numbers**).

**The pull-quote's cue is the camera, not a scroll number.** It is derived in `publishPqAppearZoomT()`
from where the cards are, so it cannot drift when a camera or radius constant moves:

```
clearZ = −SPHERE_R + NEAR_FADE_END × fadeRefH        // where the LAST CARD VANISHES
pqAppearZoomT = zoomTAtCamZ(clearZ, CAM_Z_SPHERE, CAM_Z_END)  // timeline.js, inverse of the dolly ease
```

**The cue is where the last card leaves the *screen*, not where the camera passes the shell** — those
are different frames. `updateCardTransforms` hides a card a whole proximity-fade band before the camera
reaches it (`mesh.visible = proxFade > 0`, at `NEAR_FADE_END` = 1.6 card-heights of depth). The deepest
card *centre* sits at `−SPHERE_R` under any rotation and the fade keys off the centre, so the last thing
on screen goes at `−SPHERE_R + NEAR_FADE_END × fadeRefH`. The card's own extent drops out, so there is
no sm/md branch.

Two consequences of depending on `fadeRefH`:

- **It is not derivable from constants alone.** `fadeRefH` is the mean of per-card `sphereWorldH`,
  measured after the cards are built and re-measured once textures land. So `publishPqAppearZoomT` is
  called from `recomputeDragFlip` — the one place `fadeRefH` is written — and not only from
  `initRuntime`. Before cards exist `fadeRefH` is 0, which falls back to `−SPHERE_R`: later than the
  truth, i.e. the safe direction.
- **The doc snippet can only approximate it**, using `CARD_H_SPHERE` in place of the measured mean,
  landing within ~1vh. For the real number, log `fadeRefH`.

**The WebGL quote starts at `startT`**, where the camera is `PULL_BP[band].startR` sphere radii in
front of the centre (capped at `pqAppearZoomT`). Both are JS-only; nothing is published to CSS.

The next section's top arrives as the world un-sticks at the block's end (see Block height), so it
never overlaps the quote.

**Tuning cheatsheet** (all visual — no test harness, so eyeball each):
- *Scroll after the globe too long or too short:* every length is a knob of its own, and the block
  height follows (see Block height). Per breakpoint:
  - `--gg-zoom-vh`: the dolly's pace. More gives more scroll inside the globe before the hand-off and
    pushes everything after it later.
  - `PULL_BP[band].startR`: where along the dolly the hand-off happens.
  - `FLY_VH`: the scroll the particle flight takes; `READ_VH`: the still quote before the world lets go.
  - `--gg-formation-vh`: formation pacing only.
  - `--gg-runway-height` only matters while the particles are off.
- *Quote lands while cards are still in frame, or waits too long after they go:* nothing to tune — it is
  `zoomTAtCamZ` of the shell's far wall. If it reads early, revisit the card extent in
  `publishPqAppearZoomT`, not a scroll number.
- *"Click & Drag" hint text lingers too long/short:* there is no constant — the globe controls retire
  **on** `liveUntil()` (`startT` with the particles on, else `pqAppearZoomT`) and the hint text's
  linear fade reaches 0 **at** `pqAppearZoomT`. To move either, move that cue.
- *The hint layer retires too eagerly or not eagerly enough:* `CLICK_MAX_MOVE` (in
  `interaction.js`) is the whole trigger — it decides click-vs-drag and fires `onDrag()`, so raising
  it makes short spins stop counting and also makes sloppier taps still open a card. There is no
  separate number for the cursor, the barrel row or the plane; all three read `hintRetired`.
- *Hint plane blows apart too fast or too slowly:* `HINT_EXIT_RATE` (per frame) — the whole
  clock. The shape of the scatter is the `uExitP` terms in `TEXT_FRAG`, not a JS constant.
- *Formation (arc/grid/fold) pacing:* the `P_*` constants below — independent of the runway.

#### Block height

While the quote particles are on, the zoom runs over its own length, `--gg-zoom-vh`
(`input.zoomPx`), not over `runway − formation`, and the block ends one viewport plus `READ_VH`
after the quote is crisp: `syncHeight` writes that as `--gg-pq-height`, from formation + `startT` ×
zoom + `QUOTE_LIVE_P` × `FLY_VH`. Depending on those lengths the block can end before the zoom does
(the camera never finishes its dolly) or after it (the camera rests at `CAM_Z_END`). It
never ends before `pqAppearZoomT` + `READ_VH`, where the no-particles path (forced colours) reveals the
plain quote. It re-solves on layout and whenever `startT` is republished. With the particles off
(reduced motion, no quote) the block is `--gg-runway-height`, as without this feature. See
**CSS → Pull quote**.

### Zero-box gate

`initRuntime` returns without measuring or building anything while `root.offsetHeight <= 0`. It parks
a one-shot `ResizeObserver` on `root` and re-enters when the block has a box. `destroy` disconnects it
with the others, so a pending init is cancelled.

Milo keeps the section `display: none` until `processSection` reaches
`delete section.el.dataset.status`, which is **after** `await Promise.all(loadBlocks)` — and
`loadBlock` awaits `styleLoaded`. Two consequences follow:

- **The gate is what keeps a zero-box measurement off the screen, not the `IntersectionObserver`.**
  `onScreen` starts `true` and `initRuntime` ends with `renderReady = true; syncTicker()`, which
  starts the rAF loop *synchronously*; the observer's first callback is a frame away. On a zero-box
  block the numbers are wrong rather than absent: `getBoundingClientRect().top` is 0, so
  `blockDocTop` collapses onto the current scroll position and `arcCopyEntryT` reads `1` without
  anyone having scrolled — and `.globe-gallery-arc-copy` is `position: fixed`, so it would paint
  over a page nowhere near the block. `H` 1 shrinks the entry ramp to a single pixel and takes
  `camera.aspect` to `W`; `blockHeight` 0 saturates `progress`; `readCssVars` resolves nothing.
- **A box implies the block's stylesheet is applied.** `readCssVars()`, the quote layout and every px
  measured in `initRuntime` read final values on the first pass. This covers the **block's**
  stylesheet only — page-level custom properties (`--heading-font-family`) and webfonts load on
  their own schedule, which is why `buildTextMesh` waits on `fonts.ready`.

`init()` does not await the deferred runtime, so `loadBlock` still resolves and the un-hide — the
thing that opens the gate — still happens.

### Ticker and render loop

Milo's page-level Lenis keeps `window.scrollY` in sync; the driver is a plain `requestAnimationFrame`
loop (`startTicker`/`stopTicker`). The modal pauses Lenis via `window.lenis.stop()/start()` plus a
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

**Pausing must hide the canvas (multi-globe correctness).** The main canvas is `position:fixed` +
full-viewport + `pointer-events:auto`, and `updateCanvasVisibility` — the stage that `display:none`s
it when out of range — runs *inside* `tick()`. So when `syncTicker()` stops the loop it also sets
`display = 'none'` directly; otherwise a paused globe's fixed canvas keeps intercepting pointer events
across the whole viewport, which with **multiple globes per page** silently swallows the clicks meant
for whichever globe is actually on screen. The resumed loop's `updateCanvasVisibility` restores it.

### Progressive texture loading

**Progressive texture loading (contours → un-dissolve).** Card meshes are built before any photo
loads, so the block paints immediately: `initRuntime` runs `buildCards()`/`buildTextMesh()`/
`a11y.setup()` and flips `renderReady` **before** `loadCardTextures`, seeding each card with a shared
1×1 `placeholderTex` and a placeholder aspect. Until a card's photo lands it renders as a **contour**
— a faint rounded-rect fill + ~1px stroke drawn in `CARD_FRAG` from `rrSDF`, driven by `uReveal`
(contour→photo crossfade) and `uContourFade` (proxFade, so the contour respects the near-camera cull).
`loadCardTextures` reports **per image** via `onEach`, plus `onDone` once all settle; the caller owns
the `textureLoadGeneration` stale-guard in both. `onEach` swaps in the real texture, records its
native aspect (`card.srcAspect` — the *only* per-card value a decode contributes) and flips
`hasTexture`; it writes no UV state, because each phase branch calls `applyCardFit` every frame
(`placeArcCard` included, or a card that lands its texture while still on the arc would keep the
identity UVs `buildCards` seeded and render stretched to `CARD_ASPECT`); `revealT` then eases 0→1 and the photo
**un-dissolves** in — the same edge-first particle effect as the near-camera fade (`uDissolve`), so
the two compose in `placeSphereCard` by **max-dissolve / min-opacity**, neither un-hiding what the
other hides. On **md** positions are index-based (`fibSpherePos`), so a landed texture only morphs
scale/aspect in place — never a reflow. On **sm** the masonry barrel is a whole-set solve, so it's
packed once with placeholder aspects and **re-solved once** in `onDone`, each card easing to its final
slot via a one-time `masonryMorph` tween (invisible while the user is still in arc/grid, the common
case). `dragFlipZ` is recomputed in `onDone` / when the morph settles. Images decode off the main
thread (`img.decode()`) so many decode concurrently. So `renderReady` means *cards built* (contours
visible), not *all textures loaded*.

**Right-sized image requests.** `loadCardTextures`' `getSrc` and the modal upgrade both route the
authored URL through `optimizeImgUrl(src, cap)` (`authoring.js`), which for a helix/DA `media_*` asset
rewrites it to `?width=<cap>&format=webply`, mirroring `decoratePictures`' convention. Non-`media_`
URLs pass through. Because we downscale client-side anyway (`fitDims`), this trims bytes on the wire
(≈10–30× on slow links), not the final texture resolution — and it lets the modal request its own cap
(`MODAL_TEX_MD`) rather than being limited by the authored `<img>` src width.

### Rotation through the peel, fold and sphere handoff

**Rotation through the peel → fold → sphere handoff.** Three separate traps, all fixed in the
placement branches:

- **The fold slerps from `gridQuat`, the UPRIGHT grid orientation — not the card's live peel
  orientation.** Slerping from the live spin flips the face through the camera plane mid-fold. The
  residual peel spin (`stage.rotZ − gridTilt`, itself easing to 0 by peel end) is instead reapplied
  *about local Z* afterwards, so it reads as in-plane rotation like the peel it continues.
- **The peel lerps its z-angle directly, not by slerp.** `peelStartRot` snapshots the first peel
  frame's rotation normalized to within ±π of `gridTilt`; a quaternion slerp here picks the shorter
  arc across `atan2`'s wrap and visibly spins the wrong way.
- **Position lerps FROM the live `stage` transform**, which collapses to the grid slot at `gpE ≥ 1`,
  so the fold can open mid-peel (`FOLD_PEEL_OVERLAP`) without a snap. The facing tilt blends in over
  the fold scaled by `fdE` so it lands continuous with `placeSphereCard`.

**`updateSphereGroupDepth` runs at `sphereFormT === 0` too.** During the fold it slides `sphereGroup`
forward so the sphere-camera distance lerps `FOLD_SPHERE_DIST → CAM_Z_SPHERE` (cards not yet on the
sphere subtract `sphGroupZ` to stay at world z≈0). Skipping the stage before the fold starts makes
`sphGroupZ` discontinuous at that boundary — the whole group darts forward on the first fold frame.

### Stacking order

**z-index / stacking order.** The hero claims **nothing at page level** — world, arc copy,
pull-quote, and the a11y layers are all positioned and already in paint order in the DOM, so tree
order alone produces the intended stack. What is left, in `globe-gallery.css` plus the modal
canvas's inline style in `authoring.js`:

- `.globe-gallery-controls` — `1`, scoped inside the world. `a11y.js` appends its two layers to
  `canvas.parentNode` (the world) *after* this markup, so DOM order alone would put them over the
  buttons. `.globe-gallery-world` carries `z-index: 0` purely to scope it — `0` ties with `auto`,
  so DOM order still decides everything at page level. Not `isolation: isolate`, which would make
  the world a **backdrop root** and stop the modal backdrop sampling the canvas beneath it.
- **Cursor label — `17`.** Body-level and above the modal band. `cursor.js` appends it outside the
  block, so it inherits none of its custom properties — `--gg-chrome-blur` is redeclared on
  `.globe-gallery-cursor`, and so is any local var the cursor grows later.
- **Modal — `13` backdrop, `14` modal canvas.** The chrome needs none: `showModal()` puts the
  `<dialog>` in the top layer, above every stacking context. The backdrop and the modal canvas are
  ordinary fixed siblings and do need numbers, because they must cover the gnav.

Consequence: the hero paints in DOM order against the page, so **any section carrying a z-index
covers it** — `.section.rounded-corners{,-top,-bottom}` is `3` in
`libs/c2/blocks/section-metadata/section-metadata.css`, and the C2 parallax rules assign `0`–`2`.
That is accepted; this block does not contend for section layering.

Do not put `isolation` or a `z-index` on `.globe-gallery` itself to tidy this up. The modal is a
sibling *inside* it, so either one would trap `13`/`14` in a new stacking context and drop them
under the gnav.

The modal band sits just above the **C2 gnav (`12`)** so the card view covers the nav, and
deliberately **below** the interrupts that should appear over the globe — caas (`200`),
market-selector (`9999`), georouting / Milo modals (`100000`), and the consent banner. It can't
collapse into the 1–10 range precisely because it must clear the gnav.

## Lifecycle timeline

**Start here if you're changing *when* something happens.** The code that owns all of this is
**`src/timeline.js`** — every phase constant, every threshold, and the pure `deriveFrame` that
produces the clocks. Scroll model (above) explains how raw scroll becomes `progress`. This section
is the cross-section: *at a given scroll position, what is every subsystem doing?*

Nothing here is a source of truth — every number below is derived from `timeline.js`, so if you
retune a constant, re-run the snippet at the end of this section and update the tables from its
output rather than hand-editing them.

### Scroll input

Every clock below derives from `readScrollY()`, which feeds `deriveFrame` as `input.scrollY`.

Lenis is consulted only while it is actually driving the scroll (`lenis.isSmooth` — smooth wheel on
desktop); its `animatedScroll` is fractional there and is used as-is, with `LENIS_TRUST_PX` guarding
a desync. Every other path — all touch scrolling, since milo constructs Lenis without `syncTouch` —
reads `window.scrollY` through `deQuantize`.

`deQuantize` exists because iOS reports whole-CSS-pixel scroll positions while it composites the
page at sub-pixel precision. During the last ~30 frames of momentum the per-frame delta falls under
1px, so the reported position steps `1 0 1 0` while the page itself glides — a ±0.5px ripple the
timeline turns into visible shake at the arc's ~1.4 card-px per scroll-px. The filter blends by
`mag / (mag + SCROLL_LAG_PX)`, keyed on the error's own magnitude, which holds lag constant in
**pixels** rather than frames:

| per-frame scroll | lag | ripple |
| --- | --- | --- |
| 0.1–0.5 px (settle) | 1.5–1.9 px | ±0.10–0.16 px (from ±0.5) |
| 1 px | 2.4 px | 0 |
| 8 px | 4.9 px | 0 |
| 20 px | 6.1 px | 0 |

Above 1px/frame there is no ripple left to remove, and beyond `SCROLL_JUMP_PX` the filter passes
straight through, so programmatic jumps and the a11y focus snap land in one frame. Movement between
8px and 100px in a single frame is the one case that eases rather than cuts — about 5 frames.
Nothing in this block produces that except a sub-100px `snapToBrowseView`; an external anchor scroll
landing in the window would ease in.

### The six clocks

Most confusion in this block comes from code that mixes normalized timers. There are six, and they
do **not** share a zero. All formulas are in `deriveFrame` (`timeline.js`):

| clock | 0 → 1 spans | formula | read by |
| --- | --- | --- | --- |
| `arcCopyEntryT` | `ENTRY_LEAD_VH` before the block top → `ENTRY_RAMP_VH` later | raw `window.scrollY`, *not* `progress` | arc-copy fade-in, arc pre-roll, entry slide |
| `progress` | block top → end of the zoom | piecewise remap: formation, then the zoom span | the master clock; everything below derives from it |
| `arcPanT` | arc pre-roll → arc fully panned | `progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL · arcCopyEntryT` | arc geometry (`buildArcCtx`), `gridFormT` |
| `gridFormT` | peel start → all cards in grid | `arcPanT` over `PROGRESS_GRID_ARC_START` → `_END` | per-card peel (`gpLocalT` after per-card delay + jitter) |
| `sphereFormT` | `FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS` | `progress` over that window (`FOLD_WINDOW`) | camera, depth sort, interactivity, hint text, arc-copy fade-out |
| `zoomT` | sphere formed → end of the zoom | `progress` over `SPHERE_FORMED_PROGRESS` → `PROGRESS_ZOOM_END` | zoom camera, hint-text fade, controls retire, pull quote, canvas hide |

The zoom span is `--gg-zoom-vh` while the quote particles are on, else the rest of the runway (see
Block height). Two consequences worth internalizing: `arcPanT` is the only clock that depends on
`arcCopyEntryT`, so arc/grid timing shifts with *how the user entered the block*; and `sphereFormT`
/ `zoomT` are back-to-back (`zoomT` starts the frame `sphereFormT` reaches 1), so there is no
interactive dwell built into the scroll — the "formed globe" is a single point, not a range.

### Formation — `progress` 0 → `SPHERE_FORMED_PROGRESS`, scroll 0 → `--gg-formation-vh`

```
cards       ###arc##|#####peel to grid######|..........peel done............
                       |##################fold to sphere####################
camera      ..ortho.|#############perspective -> CAM_Z_SPHERE###############
arc-copy    ######visible######|~~~~~~~~~~~~~~fade out~~~~~~~~~~~~~~~|gone..
hint text   ....hidden...|#############warp in -> faint##############|#rest#
depth sort  ................off................|############on##############
input       ..........................inert..........................|#live#
```

The overlap in the top two lanes is the point of `FOLD_PEEL_OVERLAP`: the first cards begin folding
long before the last cards finish peeling, so the grid never visibly "resolves". Lanes are in order,
not to scale; the snippet below gives the positions.

### Tail — `zoomT` 0 → 1

The camera dollies from `CAM_Z_SPHERE` toward `CAM_Z_END` (eased by `ZOOM_EASE_POW`), sweeping
through the globe while the hint text fades. In order:

1. **Hand-off** (`startT`): the pointer and controls retire, the spin rests, the flight starts.
2. **Cue** (`pqAppearZoomT`): the last card has left the screen; the hint text reaches 0.
3. **Quote crisp** (`p = QUOTE_LIVE_P`): the DOM copy takes over and the canvas stops drawing.
4. **Block end**: the world un-sticks, then the quote holds until the block's end reaches its bottom
   edge and scrolls away with it.

`startT` never comes after `pqAppearZoomT`, and every cue on this tail is derived from the camera
and the card geometry (`zoomTAtCamZ`): nothing here is a free scroll constant. Without the particles
(no quote, forced colours, failed raster) the controls retire and the canvas hides off
`pqAppearZoomT` instead, and a quote reveals as plain DOM text at `is-live`.

### Event table

In scroll order. Positions are not listed: run the snippet below for the current ones.

| gate | what happens | where |
| --- | --- | --- |
| `lenisY ≥ blockDocTop − ENTRY_LEAD_VH·H` | canvas `display:block`; `arcCopyEntryT` starts | `updateCanvasVisibility` |
| `arcCopyEntryT` 0→1 over `ENTRY_RAMP_VH` | arc pre-roll speeds up, cards slide up, arc-copy fades **in** (done at `ARC_COPY_IN_ENTRY_T`) | `computeFrame`, `updateArcCopy` |
| block top | `progress` starts; cards on the arc | — |
| `FOLD_FIRST_PROGRESS` | `sphereFormT` leaves 0 → camera switches **ortho → perspective** | `updateActiveCamera` |
| `arcPanT ≥ PROGRESS_GRID_ARC_START` | arc → grid **peel** begins (staggered by `i` + `GRID_PEEL_JITTER`) | `updateCardTransform` |
| `gpLocalT ≥ FOLD_START_LOCAL_T` | first card actually starts **folding** to the sphere | `updateCardTransform` |
| `sphereFormT > TEXT_APPEAR_START` | "Click & Drag" hint plane un-hides, warps in (**sphere geometry only** — the barrel never builds it) | `updateClickDragText` |
| `ARC_COPY_OUT_FORM_START` of the fold window | **arc-copy starts fading out** | `updateArcCopy` |
| `arcPanT = PROGRESS_GRID_ARC_END` | last card lands in the grid (`gridFormT` = 1) | `updateCardTransform` |
| `sphereFormT > CARD_ORDER_HANDOVER_T` | card draw order switches from index order to destination depth (see **Card draw order**) | `applyCardOrder` |
| first card's `fdE` hits 1 | earliest card actually **on the shell** | `updateCardTransform` |
| `ARC_COPY_OUT_FORM_END` of the fold window | **arc-copy fully gone** | `updateArcCopy` |
| `sphereFormT ≥ SPHERE_INTERACTIVE_T` | hover / drag / click / auto-rotate go **live**; a11y browse enabled; the desktop cursor label appears beside the native `grab`; globe controls fade in; hint-plane entrance **resolves** (warp → 0) | `updateSphereRotation`, `updateCardTransform`, `cursor.update`, `interaction.applyCursor`, `controls.update`, `updateClickDragText` |
| `BROWSE_VIEW_T` | where a keyboard focus snap lands (`snapToBrowseView`) | `snapToBrowseView` |
| `SPHERE_FORMED_PROGRESS` | sphere/barrel formed; `sphereFormT` = 1, `zoomT` leaves 0 | `computeFrame` |
| `zoomT ≥ startT` | **hand-off**: drag, tap, cursor and globe controls retire (controls leave the tab order), the spin comes to rest, the flight starts (`p` > 0) and the cards turn into particles | `pullQuote.update`, `controls.update`, `updateSphereRotation` |
| `zoomT ≥ pqAppearZoomT` | the last card has left the screen; **hint text reaches 0** (it fades linearly across the zoom up to here). With no quote particles, this is also where the controls retire | `updateClickDragText`, `controls.update` |
| `p ≥ QUOTE_LIVE_P` | quote crisp; the DOM copy takes over over `SWAP_MS`, then the canvas is `display:none` **and `renderer.render` is skipped**. Without particles the canvas instead goes at `pqAppearZoomT + CANVAS_HIDE_MARGIN_T` | `pullQuote.update`, `updateCanvasVisibility`, `renderScene` |
| block end (`--gg-pq-height`) | the world un-sticks (canvas hidden); the DOM quote holds until the block's end meets its bottom edge, then scrolls away with it | CSS |

Also on the timeline but **not** scroll-driven: texture loading (contours → un-dissolve, plus the
one-time sm masonry re-solve on `onDone`), the modal (`sphereFormT ≥ SPHERE_INTERACTIVE_T` is its
only scroll gate), and `hintRetired` — the whole hint layer's dismissal fires on **the first drag**,
not on scroll, and is a one-way latch that nothing but a rebuild re-arms.

### Known wrinkle: `sphereFormT` leads the cards during entry

`FOLD_FIRST_PROGRESS` is computed as if `arcCopyEntryT` were already 1, but the per-card fold gate
reads the **live** `gridFormT`, which is still ramping. Entering the block from the top, there is a
short stretch where `sphereFormT` reports the fold as underway while every card is still on the arc.
The visible effect is limited to the camera flipping ortho → perspective a little early (accepted).
Anything newly keyed to "the fold has started" should gate on `gridFormT`/`fdE` if it must match
the cards exactly.

### Re-deriving these numbers

`timeline.js` is importable on its own (no THREE, no DOM), so this reads the **live** constants
rather than restating them; it cannot drift from the code. The scroll lengths are scraped out of the
stylesheet, and the per-band camera values and quote constants out of `globe-gallery.js` and
`src/quote-particles.js`, for the same reason: shipping a JS copy of them just to generate a table
would put doc-only bytes in every page's payload. The cue math (`publishPqAppearZoomT`, `setCue`,
`syncHeight`) is the one place the snippet restates runtime logic, so keep the two in step. Run it
from the repo root:

```sh
cd libs/c2/blocks/globe-gallery && node --input-type=module -e "
import { readFileSync } from 'node:fs';
import * as T from './src/timeline.js';
const css = readFileSync('./globe-gallery.css', 'utf8');
const mdCss = css.slice(css.indexOf('@media (width >= 768px)'));
const cssVh = (p, band) => {
  const re = new RegExp(p + ':\\\\s*([0-9.]+)vh');
  return parseFloat(((band === 'md' && mdCss.match(re)) || css.match(re))[1]);
};
const js = readFileSync('./globe-gallery.js', 'utf8');
const pq = readFileSync('./src/quote-particles.js', 'utf8');
const pqNum = (k) => +pq.match(new RegExp(k + '\\\\s*[:=]\\\\s*(-?[0-9.]+)'))[1];
const liveP = pqNum('arriveStart') + pqNum('arriveSpan') + 2 * pqNum('ARRIVE_JITTER') + pqNum('SETTLE');
// APPROXIMATE: the runtime uses fadeRefH (mean per-card sphereWorldH, measured after build);
// CARD_H_SPHERE stands in for it here. Log fadeRefH for the real value.
const cues = (band) => {
  const body = js.split('\n  ' + band + ': {')[1].split('\n  },')[0];
  const num = (k) => +body.match(new RegExp(k + ': (-?[0-9.]+)'))[1];
  const zoomT = (z) => T.zoomTAtCamZ(z, num('CAM_Z_SPHERE'), num('CAM_Z_END'));
  const appear = zoomT(-num('SPHERE_R') + num('NEAR_FADE_END') * num('CARD_H_SPHERE'));
  const startR = +pq.match(new RegExp(band + ': \\\\{ startR: (-?[0-9.]+)'))[1];
  return { appear, start: Math.min(appear, zoomT(startR * num('SPHERE_R'))) };
};
['sm', 'md'].forEach((band) => {
  const form = cssVh('--gg-formation-vh', band);
  const zoom = cssVh('--gg-zoom-vh', band);
  const vh = (p) => (p <= T.SPHERE_FORMED_PROGRESS
    ? (p / T.SPHERE_FORMED_PROGRESS) * form
    : form + ((p - T.SPHERE_FORMED_PROGRESS) / (1 - T.SPHERE_FORMED_PROGRESS)) * zoom);
  const atZoomT = (t) => form + t * zoom;
  const row = (n, v) => console.log(band, String(Math.round(v)).padStart(4) + 'vh', n);
  const { appear, start } = cues(band);
  const done = atZoomT(start) + liveP * pqNum('FLY_VH') * 100;
  row('fold starts / sphereFormT>0', vh(T.FOLD_FIRST_PROGRESS));
  row('hint text appears', vh(T.progressAtFormT(T.TEXT_APPEAR_START)));
  row('arc-copy fade start', vh(T.ARC_COPY_OUT_START));
  row('first card on the shell', vh(T.cardFoldStartProgress(0) + T.PROGRESS_FOLD_DUR));
  row('interactive', vh(T.progressAtFormT(T.SPHERE_INTERACTIVE_T)));
  row('arc-copy gone', vh(T.ARC_COPY_OUT_END));
  row('SPHERE FORMED', vh(T.SPHERE_FORMED_PROGRESS));
  row('hand-off (startT)', atZoomT(start));
  row('last card gone, hint text 0 (pqAppearZoomT)', atZoomT(Math.max(appear, start)));
  row('quote crisp, DOM takes over, canvas hides', done);
  row('block end (--gg-pq-height)', Math.max(done, atZoomT(appear)) + pqNum('READ_VH') * 100 + 100);
});
"
```

## Phase constants

All in **`src/timeline.js`** — these are the *inputs*; **Lifecycle timeline** above shows what they
add up to. The `P_*` values live in **progress-space** (0→1) and shape formation + zoom; the runway
split, pull-quote, and controls retirement are covered under **Scroll model** (driven by the CSS props,
read in JS):

The set is `PROGRESS_PAN_END`, `PROGRESS_ARC_PREROLL`, `PROGRESS_GRID_ARC_START` / `_END`,
`PROGRESS_FOLD_DUR`, `PROGRESS_ZOOM_END`, `GRID_PEEL_STAGGER` and `FOLD_PEEL_OVERLAP`, plus the
gates (`SPHERE_INTERACTIVE_T`, `BROWSE_VIEW_T`, `CANVAS_HIDE_MARGIN_T`). `GRID_PEEL_JITTER` is **derived** from
`GRID_PEEL_STAGGER` (below) and `GRID_PEEL_WINDOW` is its complement, so neither is a knob. Dump the
live values instead of trusting a list here:

```sh
cd libs/c2/blocks/globe-gallery && node --input-type=module -e "
import * as T from './src/timeline.js';
console.log(Object.entries(T).filter(([, v]) => typeof v === 'number')
  .map(([k, v]) => k.padEnd(26) + v).join('\n'))
"
```

`FOLD_PEEL_OVERLAP` (0–1) makes each card begin folding to the sphere that far — in peel
position-space — **before** it fully lands in the grid (folding from its live peel position, no
snap), so the grid never visibly "resolves" and the sphere forms earlier. The fold opens at peel
localT `FOLD_START_LOCAL_T = 1 − FOLD_PEEL_OVERLAP^(1/3)` — the **cube root is the inverse of the
peel's `easeOutCubic`**, so `easeOutCubic(FOLD_START_LOCAL_T) === 1 − FOLD_PEEL_OVERLAP` exactly.
That is what makes `0.35` a number about *what the viewer sees* — the share of the peel still
visibly to run when the fold opens — rather than a raw-progress figure; the gate compares raw
`gpLocalT`, so the root is the conversion out of eased space. The global fold window
(`FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS`) and the per-card fold timer
(`cardFoldStartProgress`) both derive from it in `timeline.js`, so camera / depth-sort /
interactivity stay aligned. `0` restores "settle, then fold."

`GRID_PEEL_JITTER` is likewise not free — it is `2 × GRID_PEEL_STAGGER`, so the jitter's half-range
is exactly the whole stagger window and any card can be displaced to either end of the peel order
(less, and the shuffle becomes a smear; more, and the clamp eats the tails). It applies to the
**grid** peel delay, not the arc.

### Arc entry cascade

`entryRot` is **per-card**, computed in `computeCardEntry` off the frame's `arcCopyEntryT`. The
launch delay is
`ARC_ENTRY_STAGGER × min(1, (1 - fanT) / (1 - ARC_DENSE_SPLIT))`, so it follows position along the
fan: the leading card launches first. No jitter — ordered, unlike the grid peel.

**Only ~17 of 50 cards are ever on screen during the entry.** The entry clock ends exactly at
`arcPanT` = `PROGRESS_GRID_ARC_START`, where the peel begins; everything past that is carried into
frame by the pan, at its settled position. The delay therefore ramps to its full span by
`fanT` = `ARC_DENSE_SPLIT` and flattens below it: the whole budget lands on the spread cards, which
are the visible ones, rather than being diluted across the clustered flank nobody sees during the
entry. That boundary is `ARC_DENSE_SPLIT` itself — the same split that defines which cards are
clustered — so it is derived, not a separate constant. Cards arrive in frame ~0.041 apart in
`arcCopyEntryT`, and every one of the first 15 is still mid-flight when it appears.

`ARC_DENSE_FRACTION` moves entry gap size too, but as a density trade rather than a free one: 0.5 →
224px resting fan spacing / 526px entry peak gap / 26 cards seen during the entry; 0.7 → 384 / 871 /
17; 0.8 → 597 / 1223 / 12, with returns flattening past 0.8. `ENTRY_ROT_MAX` buys entry gap without
touching the resting arc.

The delay must stay **linear** in `fanT`. Adjacent-pair separation is `f'(τ) × Δdelay`, and every pair
sweeps the whole velocity curve during its flight, so with `Δdelay` equal for all pairs every pair
peaks at the same separation (~520px at the shipped values) whatever the easing is. Bending the delay
— an exponent on `(1 - fanT)`, say — buys a larger opening gap by starving the rest: at `^0.6` the
taper runs 1.77× across exactly the cards most visible during the entry.

**`ENTRY_ROT_MAX` is the dial for gap size**, and it scales every pair equally (1.01× spread at any
value): 0.9 → ~520px peak gap, 1.2 → ~580px, 1.6 → ~650px, 2.0 → ~720px, at 1944 / 2592 / 3456 /
4320px of travel. `ARC_ENTRY_STAGGER` is not that dial — `ARC_ENTRY_STAGGER + flight window = 1`
exactly in `arcCopyEntryT` space, so raising it buys launch spread out of flight duration and speeds every
card up.

Gaps are still wider among the first cards to arrive, one tier up: `ARC_DENSE_FRACTION` 0.7 packs 35
of 50 cards into `fanT` 0–0.5, so the 15 spread cards get 2.5× the delay step of the clustered 35, and
the spread cards arrive first. Keying the delay to index instead of `fanT` flattens that, at ~15%
smaller gaps throughout.

**Every card flies the same trajectory over the same duration**: the window is a constant
`1 - ARC_ENTRY_STAGGER`, not `1 - delay`. Cards never catch up to each other — the set is one rigid
offset in time — so no card is ever visibly faster than its neighbour. Adjacent on-screen cards sit a
uniform ~510px apart mid-entry (mean ≈ max), against a settled fan spacing of 256px.

The rotation eases with `easeInOutQuint`. A card is off-screen for the first third of its own flight
— it enters frame at `τ` 0.32–0.61 depending on its `fanT`, and stays visible to `τ` 0.65–1.0 — so the
whole visible stretch sits in the ease's decay phase, so what matters is the velocity profile over
that stretch rather than the ease's name. Cards launch from **below and right** of the viewport (`y`
1881–4299 against a 900px viewport) and swing up, so the off-screen stretch is not clearance for the
section above. **Do not swap in a plain ease-out**: it spends 83% of its travel off-screen
(`easeInOutQuint` 30%) and enters frame already slow, so adjacent cards both spread less and converge
less. Peak velocity 5× average puts cards into frame fast then decelerates hard, so each card is
visibly reeled in by the next — an adjacent pair peaks ~620px apart and closes ~240px (38%) while
both are on screen, roughly double the convergence of `easeInOutCubic`.

The card's entry CA reads its own `entry.rot`, so each card gets its own CA burst as it launches.

**Arc-copy fade-out** (`updateArcCopy`) is expressed as a *fraction of the grid→globe fold window*
(`FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS`), not as raw progress, so it stays aligned if the
fold constants move: `ARC_COPY_OUT_FORM_START` → `ARC_COPY_OUT_FORM_END` of that window (the event
table's derived progress column shows where they land). It therefore starts only once the
fold is underway and is fully gone *before* the sphere (md) / barrel (sm) finishes forming — one
window for both profiles, since the fold constants are shared. The out-ease is `easeInOutCubic`,
**not** the `easeOutCubic` used for the fade-in: `easeOutCubic` is ~88% done at the window's
midpoint, which would collapse the copy to invisible almost as soon as it began; `easeInOutCubic`
spreads the fade over the whole window and still lands exactly on 0 at `ARC_COPY_OUT_END`.

`FOLD_FIRST_PROGRESS` and `SPHERE_FORMED_PROGRESS` are the fold window's two ends, and
`cardFoldStartProgress(gpDelay)` is the same computation per card — `FOLD_FIRST_PROGRESS` is its
`gpDelay = 0` case. All three live in `timeline.js`, so the global window and the per-card gate
cannot drift apart.

**Arc-copy placement is all CSS**; `updateArcCopy` owns the opacity, the 24px entry slide, and
`pointer-events` — the pill keeps its `fixed` box at opacity 0, so it is hit-testable (selectable)
only while that opacity is above 0, which ends at `ARC_COPY_OUT_FORM_END`, before the globe
goes live at `SPHERE_INTERACTIVE_T`.
CSS sets both edges: `bottom` (`--s2a-spacing-xs` at sm, `--s2a-spacing-lg` from `min-width:768px`)
and `inset-inline-start`, which shares the pull-quote's `--gg-content-inset` (see the CSS section
below for the derivation and for why md+ offsets it back by `--gg-arc-pad`). The logical property
handles RTL, so no JS is involved in the side-swap.

**Entry timing** — two independent knobs: `ENTRY_LEAD_VH` viewport-heights before the
block top that entry begins (`0` late; `0.85` is the prototype's hero pre-roll but sweeps meshes
over content above), and `ENTRY_RAMP_VH` the ramp over which `arcCopyEntryT` goes 0→1
(arc-copy fade, arc pre-roll speed, text→arc gap). The lead is per-band in `BREAKPOINTS`; the
ramp is a `timeline.js` constant.

**`ENTRY_LEAD_VH` is a band config, not a timeline constant** — it sits in `BREAKPOINTS`
alongside `ARC_SPAN`, declared outright by **every** band, and reaches the pure clock as
`frameInput.entryLeadVh` the same way `arcScale` does. There is no default and no
`??` fallback: one band never inherits another's tuning, and there is exactly one place to read
the value a given breakpoint uses. `ENTRY_RAMP_VH` stays in `timeline.js` because it genuinely
does not vary.

Per-band is safe here only because **nothing derives from the lead at module scope**. Contrast
the `PROGRESS_*` family, which `SPHERE_FORMED_PROGRESS` and `cardFoldStartProgress()` bake into
load-time constants — those cannot go per-band without re-deriving the chain. The lead has
exactly two runtime consumers, `entryStart` in `deriveFrame` and `showTrigger` in
`updateCanvasVisibility`, and they **must agree**: the canvas has to be shown by the time entry
starts, or the pre-roll draws into a `display:none` canvas. Both read the one `bp` value.

**The ceiling is 1.0**, from the ticker's `IntersectionObserver` `rootMargin: '100% 0px'` — the
loop wakes one viewport-height above the block, so a lead past that would begin entry while rAF
is still gated off. `ENTRY_LEAD_VH` is in viewport-heights.

**Sweep pacing is `ARC_RAMP_T`, also per-band.** `arcRotationEase` ramps quadratically over the
first `ARC_RAMP_T` of the pan then goes linear, and its `a` coefficient is *solved* so the curve
passes through (0, 0) and (1, 1) whatever the ramp is. That is what makes it the right knob for
"the cards sweep in too fast": raising it slows the opening sweep and lets the rest catch up,
while the arc's start, its end, the entry timing, and every phase boundary stay put. During the
pre-roll (`arcPanT` 0 → `PROGRESS_ARC_PREROLL`) it is the *only* thing pacing the fan, and the
curves have reconverged to within ~7% by `PROGRESS_GRID_ARC_END`, where the cards are in the grid
anyway. Radians swept by the end of the pre-roll, sm (`ARC_SPAN` 3.6):

| `ARC_RAMP_T` | 0.08 | 0.15 | 0.20 | 0.35 | 0.5 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| radians | 1.46 | 1.31 | 1.20 | 0.84 | 0.65 | 0.51 | 0.49 |
| share of `0.08` | 100% | 90% | 82% | 58% | 44% | 35% | 33% |

**`ARC_RAMP_T` is valid in `(0, 1]` only, and saturates near 0.8.** `a = 1/(k(2 − k))` is solved
so `ease(1) = 1`, but that identity holds only while `t = 1` falls in the *linear* branch. At
`k ≥ 1` the quadratic branch covers all of `[0, 1]` and `ease(1)` is just `a`, which equals 1 only
at `k = 1`, diverges at `k = 2`, and is **negative** beyond — a fan that sweeps backward. Nor is
there anything to gain: `k(2 − k)` peaks at `k = 1`, so `a` is minimised there and symmetric about
it, making `k = 1` (pure `t²`) simultaneously the slowest possible start and the last correct
value. Past it the sweep speeds back up *and* overshoots.

**`ARC_RAMP_T` also slows the card-to-card spread**, because `arcRot0` drives both `rotOffset`
(how far the fan has swung) and `effectiveSpan` (how far it has *opened*). At a high ramp the
cards therefore stay bunched, and the far end of the fan loses the most relative motion — a card
at `fanT` 1 travels `1.7 · arcSpan` per unit `arcRot0` against `1.3` at `fanT` 0 — which reads as
the stagger collapsing rather than as a slower sweep. Putting `effectiveSpan` on the raw
`arcPanT` splits them if that ever needs fixing; left coupled for now.

Note the per-card entry stagger (`ARC_ENTRY_STAGGER`, `ENTRY_ROT_MAX`) is a *third* thing again
and rides `arcCopyEntryT`, so `ARC_RAMP_T` never touches it — but it has fully decayed by
`arcCopyEntryT = 1`, which on sm is only ~0.55vh into the block. After that point `effectiveSpan`
is the **only** thing separating the cards, which is why the bunching shows up later in the sweep
rather than at the start.

**What does *not* move the leading edge**, both tried: `ARC_DENSE_FRACTION` and the card count.
`fanT` is pinned to 0 for card 0 and 1 for card *n*−1 by construction — the dense split only
redistributes the cards *between* those ends, so the first card's trajectory is identical and only
the gaps change. Nothing about how many cards there are can delay a position that is defined as
the end of the range. `ARC_SPAN` does slow the sweep (angular velocity is proportional to it) but
it scales `effectiveSpan` by the same factor, so the fan narrows as it slows — a composition
change, not a pacing one.

`ENTRY_LEAD_VH` alone fixes where the copy starts fading in: the previous section still
occupies `ENTRY_LEAD_VH` of the viewport at `arcCopyEntryT = 0`. Everything after that is
`ENTRY_RAMP_VH` scroll away, so shortening the ramp pulls the cards toward the copy without
moving the copy. At 1440x900 the first card crosses the viewport edge at `arcCopyEntryT`
0.214 regardless of the ramp; the ramp only decides how much scroll that costs. It also
advances the peel, because `arcPanT` reaches `PROGRESS_GRID_ARC_START` partly on the
`PROGRESS_ARC_PREROLL` term: ramp 1.05 peels 0.39 viewport-heights below the block top,
ramp 0.75 peels at 0.24.

## Globe controls

HTML chrome over the live globe (`controls.js`, markup from `buildGlobeDom`, styled from the
`--gg-controls-*` custom properties): a **spin play/pause** toggle in the top inline-end corner and,
on the barrel only, a **rotate ← / hint copy / rotate →** row on the bottom edge.

| | Where | Why |
| --- | --- | --- |
| Spin toggle | every breakpoint / shape | Auto-spin is motion that starts on its own and never stops. WCAG **2.2.2** wants a pause mechanism, so this ships on the sphere too, not just the barrel. |
| Rotate row | barrel only (`.globe-gallery-barrel`, from `bp.CYLINDER`) | The barrel has neither the WebGL hint plane (`buildTextMesh`) nor the custom cursor (`cursor.setup`) — both skip on `bp.CYLINDER` — so touch users otherwise get **no** affordance at all. The chevrons also make the copy's "click and drag" claim actionable without a drag. The **hint copy** beside them fades out once the user has actually spun the globe (see Behavior notes) — the barrel's bottom edge is too busy to keep it forever; the chevrons stay. |

- **One visibility window** for the whole layer: `sphereFormT >= SPHERE_INTERACTIVE_T`, no modal
  open, `zoomT < liveUntil()` — i.e. exactly while the globe is draggable. `controls.js`
  writes the `is-visible` class only when that boolean flips. CSS transitions `opacity` **and
  `visibility`**; the latter is what pulls the buttons out of the tab order while hidden, so the
  block's tab stops never point at invisible chrome.
- **The hide edge is a place in the scene, not a scalar** — the same cue the pull-quote rides, so
  the two share one number and can't drift apart. A band-independent constant cannot work here:
  every input to the cue is per-band — `publishPqAppearZoomT` derives the clear point from
  `SPHERE_R`, the card's radial extent, `CAM_Z_SPHERE` and `CAM_Z_END` — so any single number fits
  one band and retires the other's controls a third of
  the way early, leaving a stretch where the globe was still in frame and still auto-spinning with
  its pause button already gone (a WCAG **2.2.2** hole, since the ambient spin is the one motion in
  the zoom-through that *isn't* scroll-driven). md is the band that exposes it because its shell is
  proportionally far deeper into the camera's travel — `SPHERE_R/CAM_Z_SPHERE` is 0.538 against
  sm's 0.229 — and because its cards mount radially, so the extent term is the card's full
  diagonal rather than the cylinder's `CARD_W/2`. Anything else keyed to "the globe has left" wants
  `pqAppearZoomT` too, not a fresh constant.
- **Tab order is entry widget → spin → rotate ← → rotate →.** `a11y.js` appends its nodes during
  its own setup, which would leave the controls *ahead* of them in the DOM — where a
  forward-tabbing user would walk past them while they're still hidden and never come back.
  `controls.setup()` therefore runs after `a11y.setup()` and re-appends its layer last. Focusing
  the entry widget snaps the page to the formed globe, so the controls are visible by the time the
  next Tab lands on them. **Hiding does NOT hand focus anywhere, deliberately.** When the fade takes
  a focused control unfocusable, `document.activeElement` goes to `<body>` — which looks like a
  dropped tab stop but isn't: the browser keeps its *sequential focus navigation starting point*
  where the control was, so Tab continues into the sections below and Shift+Tab returns to the entry
  stop. Verified in-browser. Re-focusing the entry widget here would be a regression, not a fix — the
  scroll that hides the controls is the user leaving the block, so pulling focus back would put them
  behind where they were and walk them through the globe chrome a second time.
- **The spin toggle names the action it performs**, so both the `aria-label` and the `daa-ll` swap
  with the state (authored `pause spinning` / `resume spinning`). No `aria-pressed` — a toggle whose
  label already changes would announce twice.
- **A rotate press is a `navNudge`**, the same eased tween keyboard centring uses, with pitch and
  roll pinned to their current values so a tap can never tilt the globe off level. `navNudge.kind`
  records who armed it: the browse-exit edge in `updateSphereRotation` cancels only `'browse'`
  tweens, because a pointer press on a rotate button collapses browse mode (`focusout` → `collapse`)
  in the same event turn it arms its own nudge — without the tag, the next frame would silently eat
  the press and the button would look dead. `dir −1` = the
  surface travels screen-left, matching a leftward drag — **including inside the barrel**, where the
  visible wall moves opposite and `rotateStep` negates `dir` exactly as drag negates via `dragDir`.
  That window is real, not theoretical: `dragFlipZ` is clamped to `[SPHERE_R, 0.95 · CAM_Z_SPHERE]`,
  so the camera can be inside the globe while the controls are still up (until `liveUntil()`).
- **A press eases to the next column BOUNDARY, it does not add a column pitch.** Ambient spin
  leaves the barrel at an arbitrary angle, so `y += 2π/cols` carries that offset forward forever
  — face 1.5 columns, press, face 2.5. Snapping instead means a column lands front-centre from any
  starting yaw, and the first press absorbs the drift. The boundaries come from the **cards**, not
  the layout: every card in a column shares an azimuth and therefore a `yawDeltaToCenter`, so the
  distinct deltas across `cards` *are* the boundaries — which makes their count the column count
  too, so nothing has to be threaded out of `cylinderMasonryLayout`. `ROTATE_DEADZONE` (a fraction
  of a pitch) skips a boundary we're already sitting on, so ambient drift can't turn a press into a
  twitch; travel is therefore 0.15–1.15 columns. Repeat taps **queue**: the boundary search measures
  from `navNudge.targetY` while a rotate tween is in flight, so a second tap adds a column instead of
  re-picking the one already in motion (which made a double-tap slower than a single one). **Mid-morph the read switches to `morph.posTo`**:
  `resolveMasonryLayout` runs off the async texture callback, so on a slow connection the reflow can
  start while the controls are already live, and during it `spherePos` is a per-frame lerp off the
  sphere — no shared azimuths, so the distinct-delta count reads as one column per card and the step
  collapses. The target slot outlives the morph and is what the tween should land on anyway.
- **Auto-spin keeps running through a press.** `AUTO_ROT_SPEED` is ≈1.7°/s against a ~45° pitch
  (8 columns on sm), so an aligned column holds for ~25s and each press re-snaps. Pausing on press
  would make the arrows silently flip the play/pause button — two controls sharing one state.
- **Spacing.** One gap off every viewport edge, `--gg-controls-inset`, stepping `--s2a-spacing-md`
  (sm) → `--s2a-spacing-lg` (md+) in lockstep with the modal's `--gg-modal-edge`, so the two chrome
  layers never disagree about how far off the edge a control sits. The spin toggle's `top` adds that
  same gap to `--gg-nav-h` (124px today, from measured fallbacks — see CSS, Tokens), clearing the sticky gnav +
  breadcrumbs the fixed layer sits under. It is not the only nav-aware rule — see **The nav band**.
- **Reduced motion** keeps the rotate row (it's the non-drag path to the rest of the wall, and the
  nudge lands instantly under RM) and **hides the spin toggle** — there is no auto-spin to pause.
- **RTL pins the row's visual order, and does NOT flip the arrow icons.** The modal's prev/next are
  reading-order, so their SVGs mirror; rotate is *spatial* — `dir −1` sends the surface screen-left
  in every locale — so a mirrored ← would lie about which way the globe goes. Left alone, though,
  the flex row mirrors under `dir="rtl"` and parks the ← button on the right, so
  `html[dir="rtl"] .globe-gallery-hint` sets `flex-direction: row-reverse` to cancel it.

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

The entry widget's `.globe-gallery-a11y-tip` is `aria-hidden` **and** the `aria-labelledby` target:
name computation traverses hidden referenced subtrees, so the button keeps the instructions as its
accessible name while the span stops being a node of its own. Without it the button is not a leaf —
a screen-reader cursor can land on the text inside it, where Enter has nowhere to go, while Tab onto
the button itself works. The span still renders, so the `:focus-visible` pill is unaffected.

**`.globe-gallery-a11y-cards` is `inert` unless browsing** (`setBrowseActive`). That one flag is the
whole browse gate: it keeps the N image buttons out of the tab order **and** out of the accessibility
tree, so the buttons carry no `tabindex` of their own. Collapsed, a screen-reader virtual cursor runs
entry widget → globe controls. Two platform behaviors it rests on: an inert button cannot take focus, so `enterBrowse()`
clears `inert` before `focus()`, and so does `focusCard` (the modal's close-time focus restore can
land before `updateTabStops` has re-run); `trackCardOpen` clears and restores `inert` around its
synthetic `.click()` rather than relying on inert click semantics.

Focusing the entry button or any browse image runs `snapToBrowseView` (`window.lenis.scrollTo` to
`SPHERE_FORMED_PROGRESS`), bringing the block into its interactive state *and* into view before the
ring shows (the pdf-space focus pattern). It lands at **`BROWSE_VIEW_T`** (`sphereFormT` 0.96,
328vh), not at `sphereFormT` 1: `BROWSE_VIEW_SCROLL_FRAC` is that formT re-expressed as a fraction
of `formedScrollPx()`, which works because `deriveFrame` maps scroll to progress linearly below
`formPx`. `centerCardOnScreen`'s `snapPending` still solves for it — `zoomT` is 0 there, so the
camera is outside the sphere.

Apparent size through the formation is set by `foldSphDist`, **not** by `camera.position.z`:
`updateSphereGroupDepth` holds `sphereGroup` at `camera.position.z − foldSphDist` for the whole
`zoomT === 0` span, so the group tracks the camera and only that distance matters. It runs
`FOLD_SPHERE_DIST → CAM_Z_SPHERE` over `sphereFormT³` — on **md** 173 → 57, so landing at
`sphereFormT` 1 put the globe **1.34x bigger** than at `SPHERE_INTERACTIVE_T`; 0.96 lands at 70.4
and takes most of that back. On **sm** the whole span is 89 → 70, so it barely reads either way.
`BROWSE_VIEW_T` must stay **above** `SPHERE_INTERACTIVE_T` with margin: `globeFormed()` gates on
`sphereFormT >= SPHERE_INTERACTIVE_T`, so a landing on the threshold could round under it and
`enterBrowse()` would refuse to enter. A focus guard (`suppressFocusSnap`, armed on window blur /
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
  focus to the opening image**. **Click/tap outside the photo dismisses** (`backdropTap`, wired to
  `touchend` for touch and to `click` for mouse) — the photo rect itself, the info scrim, the counter
  pill, and any `button`/`a` are exempt, and a mouse gesture that moved or changed target is treated as a text
  selection, not a dismiss. No arrow-key globe rotation (browsing replaced it).
- **Modal counter reading order:** the visible `.globe-gallery-modal-counter` ("05 / 47") is
  `aria-hidden`; the spoken form ("5 of 47", from `cardLabel`) lives in **two** sr-only spans, both
  classed `.globe-gallery-modal-position` so one `querySelectorAll` write in `populateModal` keeps
  them in sync. They exist because no single element can do both jobs:
  - the one in `.globe-gallery-modal-info` is `aria-hidden` and carries the `id` the heading's
    `aria-describedby` points at. `aria-describedby` resolves into `aria-hidden` subtrees, so the
    position is announced with the focused heading on open, while staying out of NVDA's sweep of
    the dialog — which would otherwise speak it a second time.
  - the one **between Prev and Next** carries `role="note"` and no `id`. It is there to be a
    VoiceOver virtual-cursor stop, so the cursor reads Prev -> position -> Next -> Close, matching
    the on-screen row. NVDA does not descend into a `note` when it sweeps, so it costs no
    duplicate. The whole bottom row is `position: absolute`, so that markup order is free.

  Do not collapse these into one element. **WebKit skips both `note` and `document` when computing
  a description** (measured), so a single `note` span is silent on open in Safari; a single
  `aria-hidden` span loses the cursor stop; and a single span with no role at all brings NVDA's
  duplicate back. `group` does not stop the sweep; `article`/`region` do, but VoiceOver announces
  entering/leaving them.
- **Safari skips the badge links when tabbing.** The badge names are `<a href>`; Prev/Next/Close
  are `<button>`. Safari keeps links out of the Tab sequence unless the user enables "Press Tab to
  highlight each item on a webpage", so Tab there goes description (only while scrollable) ->
  Prev. Chrome tabs through everything. This is the platform default, not a block bug — the
  VoiceOver cursor reaches the links either way, and `Option`+Tab does too. Do not force
  `tabindex="0"` onto them to paper over it.
- **Instructions popup:** on focus the entry widget shows a **visible pill** so sighted keyboard
  users get the affordance (a11y audit). ONE element (`.globe-gallery-a11y-tip`) — hidden by
  default, shown on `:focus-visible`, and simultaneously the button's `aria-labelledby` target, so
  SRs announce the same text as the accessible name. Copy is `image-gallery-instructions`.
- **Screen reader:** the entry button has **no separate label** — its instructions popup IS its
  accessible name. Each browse image's `aria-label` is its authored **alt**. On modal open focus is
  on the **name heading** (a child), so VoiceOver reads the heading + its `aria-describedby` (role +
  position); forward-nav then walks name → role → description → badges → photo before the controls.
  The photo is a `role="img"` sr-only element placed AFTER the info block (so the heading reads
  first), carrying the card's alt as a real text alternative. The card **position** ("N of M") lives
  in one sr-only element referenced by the heading's `aria-describedby`, so it is read with the
  focused heading on open.
- **The `<dialog>` carries no accessible name**, so VoiceOver falls back to name-from-contents and
  says the card's name before the focused heading repeats it. Safari's fallback takes the heading
  alone; Chrome's takes the whole info subtree plus its group counts, which is why Chrome + VO is
  much the louder of the two. Two rules bound any name added back:
  1. It must not be **card** text (`aria-labelledby` → the heading, role or position). The dialog
     name and the focused heading are two separate announcements on open; if they overlap, the card
     is read twice — the fallback's failure mode as well, so a static non-card `aria-label` is the
     only version that removes the repeat. An empty or whitespace `aria-label` is the same as
     unnamed: name computation ignores it.
  2. It must not **change** per card. VoiceOver re-announces a dialog whose name changed; NVDA never
     does. A changing name is therefore a channel that double-speaks on one AT and is silent on the
     other — it cannot be the carrier for anything.
  axe's `aria-dialog-name` does not match a native `<dialog>` (only an explicit `role="dialog"`), so
  being unnamed passes a full axe run.
- **`role="document"` on `.globe-gallery-modal-description` is load-bearing for NVDA.** Opening a
  **native `<dialog>`** makes NVDA read the dialog's prose aloud; the same markup as a
  `div[role="dialog"][aria-modal="true"]` does not, so this is the element's behavior and not the
  role's. NVDA does not descend into a `document` subtree, so the attribute opts the long copy out.
  Measured in NVDA, not inferred. Three things that do **not** help: focusing a control instead of
  the heading, inserting the copy a frame after the dialog is shown (NVDA re-reads live rather than
  snapshotting at appear-time), and making the copy focusable. Putting it in the dialog's
  `aria-describedby` makes it read **twice**.
- **Only two announcement primitives are portable**: focus moving into the dialog, and a live
  region's text changing. Each event uses exactly one of them — open → the focused heading, nav →
  the live region — and nothing here relies on an AT re-reading a changed name or falling back to
  contents.
- **Focus on open is declarative** — `open()` never calls `focus()`. The heading carries `autofocus`
  and the `<dialog>` has no `tabindex`, so `showModal()` lands on the heading itself. Measured:
  NVDA announces the heading identically whether focus arrives via `autofocus` or via an explicit
  post-`showModal()` `focus()`, so the explicit move earns nothing. Any JS `focus()` here must stay
  in the same task as `showModal()` — a `requestAnimationFrame` later is a separate AX event and
  VoiceOver announces it as one.
- **Prev/Next announcement:** nav keeps focus on the button, so the new card is spoken only through
  `.globe-gallery-modal-announce` — an sr-only `aria-live="polite"` span, last child of the dialog,
  written as `"Name. Role. N of M"` by `populateModal(i, speak)` when `speak` is true (the nav call
  site only; `open()` passes nothing and so clears it, keeping the open path single-read — and it
  clears **before** `showModal()`, so a stale nav line can never be spoken as the dialog appears). It
  carries the **whole** card, position included, because it is the only thing that speaks on nav —
  focus stays on the button and the dialog's name is static by design.
  The text is **not** cleared on a timer — it holds the current card until the next nav or the next
  open, so a queued announcement can never be truncated. Cost: after navigating, a virtual cursor
  reading to the very end hears the current card's name and role once more, after Close.
  `assertive` also works and interrupts the previous card, but VoiceOver prefixes it with a tone.

**Reduced motion** (`prefers-reduced-motion: reduce`, or a viewport height of at most 460 CSS pixels
with resolution of at least 1.5dppx, including small zoomed windows) renders a **static interactive** globe
instead of the scroll choreography, laid out as **plain document flow** (`.globe-gallery-reduced`):
`computeFrame` pins scroll to `SPHERE_FORMED_PROGRESS` (formed sphere, `scrollVel` 0), auto-spin is
off (drag + arrow-spin still work), the hover fisheye/scale/CA is suppressed (`hoverTarget` forced
to 0 in `updateCardTransform`; the `cursor:pointer` affordance stays), and the modal snaps with no
fly/warp (the modal reads RM through a **live getter** — it's built once, before `initRuntime`
resolves the preference, and persists across rebuilds, so a snapshot would go stale). Rather than a tall runway
+ fixed canvas, the arc-copy precedes a static ~100vh globe section that scrolls away, with the
pull-quote below, all in normal flow. Keyboard focus scrolls to the globe's own top, past the copy.
The preference is **re-read on every `initRuntime`**, and a
`matchMedia('(prefers-reduced-motion: reduce)')` `change` listener feeds `doLayout`, so toggling
the OS setting mid-session rebuilds through the same `destroy()`+`init()` path as a band / pointer
change (no reload; the non-RM path clears the canvas `position` so a toggle-off reverts cleanly).

**RM overrides `position` — plus one custom property — and nothing else** for the four
viewport-sized boxes: no duplicated geometry, and `measureViewportH()` reads the same 100vh in both
modes. That works because the base rules are written against the canvas box rather than the window:
`.globe-gallery-a11y` sits at `top: var(--gg-optical-center)` (not `50%`) and
`.globe-gallery-a11y-cards` is a `100vh`-tall box (not `inset: 0`), so each resolves identically
whether it's `fixed` to the viewport or `absolute` inside the `100vh` `.globe-gallery-world`.

The one property is `--gg-nav-h: 0px` on `.globe-gallery-reduced` (see **The nav band**). Nothing is
pinned under RM — the globe scrolls past the gnav like any section, so there is no fixed band to
centre against — and that single declaration retires every consumer at once: the optical centre the
quote rail and a11y widget ride, the controls' top offset, and (through `readCssVars`) the camera's
centring offset, which falls to 0 and clears. The unit on the `0px` is load-bearing — it feeds
`calc(100vh - var(--gg-nav-h))`, which a unitless zero would make invalid — hence the one-line
`length-zero-no-unit` disable. It also fixes the focus-ring overlay on iOS, where `inset: 0` on a
`fixed` element tracked `innerHeight` and so mis-scaled the ring by the URL bar's height (the ring is
positioned in canvas px). The pieces:

- **Canvas** — `position:absolute` (not `fixed`), inside the now-`relative` `.globe-gallery-world`, so
  it scrolls and clips with the page; `updateCanvasVisibility` reveals it once (no coverage math).
- **`.globe-gallery-world`** — `position:relative` (was sticky); keeps its base `height: 100vh`.
- **Globe size (desktop)** — the formed `md` sphere fills ~93% of viewport height, so `buildCards`
  scales `sphereGroup` by `RM_GLOBE_SCALE_MD` on md to bring the whole ball in view (rotation
  is per-card, so a group scale is safe). `sm` (~49%) stays 1.
- **A11y widget + focus-ring overlay** — `position:absolute` (were fixed); with `--gg-nav-h` zeroed
  the base optical centre / `100vh` box already centre on the sphere, so neither override carries
  any offset of its own.
- **Globe controls** — `position:absolute` (was fixed), so the layer scrolls with the static globe;
  the spin toggle is additionally `display:none` (nothing to pause). See Globe controls.
- **Pull-quote** — drops `absolute`/`sticky` → `static`, hugs the top of its
  box so it sits under the globe; `createPullQuote` builds nothing, so CSS owns it.
- **Arc-copy** — visible in normal flow before the globe, with full-width wrapping
  and the shared content inset. `updateArcCopy` early-returns so CSS owns opacity, transform, and
  pointer events; the authored heading, paragraphs, and links remain available without animation.
  `initRuntime` moves it before the globe under RM and restores the original DOM order otherwise.

The `--reduced` overrides are grouped at the **end of `globe-gallery.css`** (`no-descending-specificity`). The no-cards / WebGL-unavailable fallback is the separate `.globe-gallery-empty`.

## Breakpoints & rebuilds

**Breakpoints** resolve once in `init()`: two render profiles split at 768px — `md` (≥768, all
cards, 9×5 grid, large sphere; covers Milo md *and* lg) and `sm` (<768, all cards, 3×8, smaller
sphere). Per-profile knobs in `BREAKPOINTS`: `ARC_SPAN`, `SPHERE_R`, `CARD_*`, `CAM_Z_*`,
`GRID_WINDOW_COLS`, `GRID_ROWS`, `CARD_ROLL_JITTER`, `ARC_DENSE_FRACTION`, `DRAG_GEARING`, plus precise-pointer defaults
for the shape keys (`CARD_FACE_CAMERA`) that `YAW_ONLY_GEOMETRY` overrides. No
md↔lg split — they render identically (code branches only on `'sm'`). Crossing 768px changes the
geometry, card dimensions, and grid shape, so `doLayout` triggers a full `destroy()`+`init()`
rebuild; resizing within a band takes the cheap path (renderer/camera resize). The `resize` handler
is the sole driver of the **width**
boundary — no `matchMedia` listener for 768px. The one `matchMedia` `change` listener is for
reduced motion (see Reduced motion); pointer precision is read at init only (see Shape).

**`doLayout` cost control.** `resize` fires ~once per frame during a desktop window drag. On iOS it
does **not** fire during the URL-bar animation: `visualViewport` resizes many times as the bar moves
(and `innerHeight` reports the new value throughout), then `window.resize` fires **once, at settle** —
so every resize-driven cost lands in a single event, at the one moment the eye is already tracking the
bar. Nothing here listens to `visualViewport`, so the animation itself costs zero. So the handler is split four ways:
- Unchanged `W` **and** `H` → return immediately, skipping two WebGL buffer reallocations. `H` is an
  `offsetHeight`, so that compare is exact integers. This
  is the exit an iOS bar move takes, since `H` doesn't depend on `innerHeight` — see **One viewport
  height**. Only the `resize` path takes it (`doLayout({ fromResize: true })`); the init call and the
  reduced-motion `change` listener run with the viewport unchanged and must still execute the body.
  Both listeners are wrapped rather than passed `doLayout` directly, or the event argument would land
  in its options object.
- **DPR is re-applied only when it actually changed** (`appliedDpr`, and `appliedModalDpr` in
  `modal.js`). `setPixelRatio` calls `setSize(_width, _height, false)` internally, so an unconditional
  call reallocates the drawing buffer at the *old* dimensions immediately before our `setSize`
  reallocates at the new ones — two full reallocations per resize, per canvas. Measured with a
  `canvas.width`/`height` write counter: 4 writes → 2 on a genuine resize.
- Renderer/camera/`computeGridLayout()` stay **synchronous** — a stale `W`/`H` renders the canvas
  stretched and mis-sizes the arc grid against the viewport it's laid out in.
- `buildTextMesh()` is **trailing-debounced** (`TEXT_REBUILD_DEBOUNCE_MS`), but only while
  `textMesh.visible` is false — it disposes a GPU texture, redraws a 2D canvas and uploads a new one.
  On screen it rebuilds synchronously, since a deferred rebuild would leave it stretched at the old
  aspect. `destroy()` clears any pending timer so a band crossing can't rebuild into a torn-down scene.

Because the block's `innerHTML` is built once in the outer `init(el)` (not per `initRuntime`) and
the runtime closure survives a `destroy()`+`initRuntime()` rebuild, `destroy()` resets state a
rebuild would otherwise inherit:
- `modal.destroy()` calls `resetModalDom()` — synchronously returns the modal DOM + page state to
  the closed baseline (clears `is-visible`/`is-open`/`aria-hidden`, hides `.modal-card-canvas`,
  clears `globe-gallery-modal-open`, restarts Lenis). Else a modal open at a breakpoint crossing survives visually
  stuck open (its mesh dropped with the old `modalScene`, `modalIdx` reset to -1 so chrome buttons
  are dead, scroll lock stuck). An open modal closes cleanly on crossing; it doesn't re-open.
- `destroy()` **resets the sphere orientation + drag/nudge state** (`sphereOrient.x/y/z`,
  `sphereOrient.pitchReleaseCap`, `sphereDragWarp`, `drag.velX/velY/pendingX/pendingY`, `navNudge.*`, `wasBrowsing`) to the upright
  pose — else pitch/yaw dragged before a device change carried into the rebuilt barrel and rendered
  it tilted until a scroll-out zeroed it.

## CSS

**Viewport units — one rule per axis.** The block never reads the window in CSS either, for the same
reason the JS doesn't (see **One viewport height**):

| axis | use | never |
| --- | --- | --- |
| vertical | **`vh`** — resolves against the large viewport, so it matches the canvas box and holds still while the iOS URL bar moves | `%` on a `fixed`/`sticky` box (that's the *layout* viewport, which the bar shrinks: `top: 50%` put the a11y widget ~26px off the sphere whenever the bar showed), and `dvh` anywhere the scroll timeline can see |
| horizontal | **`%`** — the containing block / ICB width, which excludes the classic-scrollbar gutter | `vw`, which *includes* it: a `vw`-sized `fixed` box is ~15px wider than the viewport on desktop, and `--gg-content-inset` built from `100vw` put the arc copy half a scrollbar off the pull-quote's column it is supposed to share |

There is no `vw` left in the block. The one place two axes had to share an expression —
`.globe-gallery-a11y`'s square — uses `width: min(80%, calc(var(--gg-band-h) * 0.8))` + `aspect-ratio: 1` rather than
repeating a `min()` per axis, since `%` on `height` would mean the wrong thing. **`dvh` is the modal
chrome only** (`.globe-gallery-modal-chrome`, the description's `max-height`): that layer *must* stay
inside the visible viewport so its buttons stay reachable while the bar is up, and it can't disturb the
timeline because opening the modal locks the scroll.

**Tokens.** Every spacing, radius, border-width, font-size, font-weight and blur value that lands on
an S2A scale uses the token, not the literal — including positional insets (`bottom`,
`inset-inline-start`) and the `p + p` copy rhythm. Sizes tied to a specific design measurement stay
literal, because pinning them to a coincidentally-equal token would imply a relationship that isn't
there: the arc-copy `359px`/`382px` widths, the counter pill (`--gg-counter-w`, which the
md+ nav offsets read), the scrim (`--gg-scrim-w`), and the 24/28px badge icons. These values are **off every S2A scale** and stay literal on purpose — if any is retuned,
snapping it to the nearest token is the cheaper fix:

Inventory of the literals themselves (a snapshot — the CSS is authoritative; where a value has a var,
the var is its home):

| value | where | nearest token |
| --- | --- | --- |
| `13px` font-size | badge app + role (sm) | none (scale is 12 / 14) |
| `10px` gap | badge-left, badges at md+ | `--s2a-spacing-xs` 8 / `--s2a-spacing-sm` 12 |
| `--gg-control-radius` / `--gg-controls-radius` | modal controls / globe controls | `--s2a-border-radius-xs` / `-sm` |
| `--gg-controls-size` 48px | globe controls | none (matches `--gg-control-size`) |
| `--gg-nav-h` 124px (fallbacks) | the sticky-chrome band: optical centre, controls' top offset, the camera's centring offset, the pull-quote gap ceiling | none — *measured* values (top of screen → bottom of the breadcrumbs bar), not design steps. They are the fallbacks inside a live `calc()`, so re-measure them if the gnav or localnav changes height while the vars stay undefined; the `--feds-height-*` pair still can't be trusted for this (see Naming below) |
| `--gg-chrome-blur` | modal arrows, close, info scrim, md counter pill, a11y tip, barrel hint scrim, globe controls | `--s2a-blur-xs` / `--s2a-blur-sm` |
| `18px` blur | modal backdrop | `--s2a-blur-sm` 16 |

`--gg-chrome-blur` exists because that one blur appeared six times across those places. It is
declared once, on `.globe-gallery` — everything that reads it now lives inside the block, so
everything inherits it.

Note the font-size tokens are **rem** (`--s2a-font-size-sm` is `0.875rem`). Neither `libs/styles` nor
`libs/c2/styles` overrides the root font-size, so they resolve to their nominal px while still scaling
with a reader's browser font-size setting — the intended C2 behaviour, and why px literals aren't used.

**Naming.** Classes are `globe-gallery-*` (BEM-ish, matching the block name); every custom property
this block *defines* is `--gg-*`, the initials convention other C2 blocks use (`--bc-` in
brand-concierge, `--rm-` in router-marquee). Nothing here defines an unprefixed property: the block
is a full-viewport hero on shared pages, so a bare `--runway-height` or `--desc-fade-top` could
inherit a stranger's value from an ancestor. **Four props are read from JS**, and CSS is the source of truth for all
four (`--gg-runway-height` stays CSS-only) — grep both files before renaming one:

| prop | read in | why JS needs it |
| --- | --- | --- |
| `--gg-formation-vh` | `readCssVars()` | the scroll clock's phase boundary |
| `--gg-zoom-vh` | `quote-particles.js` `syncHeight()` | the zoom's pace and the block height it derives |
| `--gg-nav-h` | `readCssVars()` | half of it is the camera's centring offset, and a projection matrix is not something CSS can build |
| `--gg-modal-anim-ms` | `modal.js` `setup()`, once | the WebGL fly's duration and the teardown timer must land with the CSS backdrop/chrome fades |

`--gg-nav-h` is the block's one `@property`, registered precisely so that read returns a length
rather than `NaN`; see **The nav band** for why, and do not un-register it without moving the JS
off `parseFloat`. The others need no registration because each is declared as a **literal**, not
a `calc()` — an unregistered prop computes as-specified, so `getPropertyValue` hands back the token
stream, and `parseFloat` copes with `304` or `350` but not with `calc(72px + 52px)`. That is also
why `--gg-modal-anim-ms` is unitless and CSS multiplies it back (`calc(var(--gg-modal-anim-ms) *
1ms)`) rather than storing `350ms` and having JS strip the unit. **JS
writes no layout props** — the narrowness is the rule: where JS decides a *state*, it toggles a class and CSS owns the resulting value
(`updateDescFade` → `.is-faded-top` / `.is-faded-bottom`, length in `--gg-desc-fade-len`), so a
retune stays a CSS-only edit and no magic number is stranded in JS. The pull-quote cue comes off the WebGL
camera curve and stays in JS; the quote's pinning is the world's own sticky box (see **WebGL pull
quote**). Anything that
*could* be a CSS number must not follow it out of the stylesheet. **No upstream (`--feds-*`)
property is read either.** The control layer is `fixed` and would otherwise sit under the sticky
gnav, so the whole nav band has to be reckoned with. **Do not reach for `var(--feds-height-nav, 63px)`
+ `var(--feds-height-breadcrumbs, 33px)`** — both vars are declared upstream (`libs/styles/styles.css` `:root` and
`global-navigation/base.css`), so the px fallbacks never fire and the calc resolves to a fixed 96px
whatever the live nav paints; `--feds-height-breadcrumbs` isn't even a bar height, it's the
`line-height` of breadcrumb links. `--gg-nav-h` names the *other* pair
(`--gnav-height-nav` / `--feds-breadcrumbs-height`), which nothing currently defines, so today the
**measured px fallbacks** are what resolve — 124px, the value in the literals inventory above. It is
still written as the `calc()` rather than baked flat, because those stylesheets load at runtime: if
the nav ever does publish its real heights, the block picks them up instead of holding a stale
number. Re-measure the fallbacks if the gnav or localnav changes height and the vars are still
absent. One of the tokens
(`--s2a-font-letter-spacing-neg-0_48`) has an underscore, which is why `custom-property-pattern` is
disabled on that single line rather than file-wide.

CSS is authored **mobile-first** and keeps its own three type tiers independently of the JS
profiles: sm is the unscoped `.globe` base, then `@media (min-width:768px)` (md) and `1280px` (lg)
layer larger scales on top. Modal/arc-copy is the same — sm (dark frosted panels) base,
`min-width:768px` overrides to the desktop card.

The **arc copy and the pull-quote share one left copy edge**, `--gg-content-inset` on
`.globe-gallery`: `max(0px, 100vw - --gg-copy-max) / 2 + --gg-copy-pad`, i.e. the pull-quote's own
text edge (it centres a `--gg-copy-max` box and pads it by `--gg-copy-pad`, and the rule
consumes the same two vars so the pair cannot drift). The arc copy is `position: fixed`, so its
`inset-inline-start` resolves against the viewport and RTL is handled by the logical property —
there is no JS involved. At sm it pins 8px from the edge and its own `--gg-arc-pad` (16px) lands the
copy on the inset; at md+ the pill background is gone, so the box is offset back by that padding
(`calc(var(--gg-content-inset) - var(--gg-arc-pad))`) to put the *copy*, not the box, on the edge.

### The nav band

The C2 gnav (`12`) is sticky and paints over the hero, so the top `--gg-nav-h` of the
viewport always has chrome in front of it. **This is not a keep-out box.** The nav is a blurred,
translucent scrim and the hero is *meant* to run under it — cropping the scene to avoid the overlap
throws away the effect and shrinks everything. The only real problem is that "centred" was being
measured against the whole viewport, so anything centred read `--gg-nav-h / 2` too high.

So the fix is a **centring offset, and nothing else**:

| token | value | used by |
| --- | --- | --- |
| `--gg-nav-h` | `calc(var(--gnav-height-nav, 72px) + var(--feds-breadcrumbs-height, 52px))` → 124px today | `--gg-controls-top`, `--gg-optical-center`, `--gg-pq-gap`'s ceiling; read into JS as `navH` |
| `--gg-band-h` | `calc(100vh - var(--gg-nav-h))` | the visible strip — a *measure*, not a clip |
| `--gg-optical-center` | `calc(var(--gg-nav-h) + var(--gg-band-h) / 2)` | where "centred" means: `50vh + 62px` |

**`--gg-nav-h` is the block's one `@property`**, and the registration exists purely so JS can read
it. An *unregistered* custom property computes as-specified, so `getPropertyValue` returns the
substituted token stream — the literal string `calc(72px + 52px)` — which `parseFloat`s to `NaN`.
(The fallbacks resolve fine for CSS either way; this is only about the JS read.) Registered with a
`<length>` syntax, the cascade hands JS `124px`. That is what lets the value stay a live `calc()`
off the gnav's own vars, which ship in stylesheets that load at runtime: define
`--gnav-height-nav: 100px` and the token becomes `152px` and everything re-centres (verified).
`initial-value` is `124px`, mirroring the fallback sum, because that is what a *broken* calc
degrades to: if either source var is ever defined as a non-length the declaration is invalid at
computed-value time, and an initial of `0` would silently drop the centring instead (verified both
ways). It cannot be a `calc()` or a `var()` — an initial value must be computationally independent,
and Chrome drops the whole `@property` rule if it isn't. Keep it equal to `72 + 52`.

**DOM chrome** just moves down: the pull-quote figure's `top` and the a11y entry widget's centre both
ride `--gg-optical-center`. Their *sizes* are untouched.

**The WebGL scene** moves down via `applyCentringOffset` → `camera.setViewOffset(W, H, 0, -navH/2,
W, H)`. That is a projection skew: the sub-window is the same size as the virtual frame, so it
translates the image in screen space and changes nothing else. Verified: every world point, at every
depth and every x, moves exactly `+62px` in y with `dx = 0`, and the screen distance between two
world points is bit-identical before and after. The canvas stays `position:fixed; top:0;
height:100vh`, so nothing is scaled, nothing is cropped, and the scene still runs under the scrim.

One thing it deliberately does **not** touch: **the arc and grid phases.** They render through
`cameraOrtho`, and the offset is ramped by `sphereFormT` (0 for the whole arc), so the fan is left
exactly where it was — its copy is registered to the untouched viewport, and it reads as full-bleed
by design.

Everything else needs no help, because **nothing re-derives the projection by hand**, and that is
the rule to keep: a `setViewOffset` skew is invisible to arithmetic written against
`camera.position.z` and a hand-rolled frustum, so anything measuring the scene in screen px must
`project()` rather than restate the frustum.

`updateA11yFocusRing` projects the card's centre and one corner-offset point and reads the NDC
gap — the gap spans a *half* extent and NDC is 2 wide, so `× W` / `× H` yields the **full** size.
It calls `camera.updateMatrixWorld()` first, and that call is load-bearing: `updateActiveCamera`
moves the camera earlier in the same tick and `renderScene` (which normally refreshes
`matrixWorldInverse`) has not run yet, so without it the ring reads the previous frame. It takes
world-axis half-extents, so the card's own tilt is not reflected in the ring.

**The modal renders through the skew, not around it.** It shares the main camera (`getCamera`)
and `modal.render()` hands that camera straight to `modalRenderer` — same projection matrix, skew
included. That is load-bearing rather than incidental: the open/close fly begins and ends on a
*main-scene* world transform (the snapshot of the card on the globe at open; its live sphere slot
at close) while being drawn by the *modal* renderer, so the two passes have to agree
pixel-for-pixel. Un-skew this pass and one world point has two screen positions: the card jumps
`navH / 2` on the first modal frame and drops back on the last.

The modal does still sit *above* the gnav at `13` and cover it, so its photo wants the **viewport**
centre rather than the band's. `computeModalTarget` lifts the target position by `skewOffsetPx() /
pxPerWorld` — the skew read live off `camera.view.offsetY`, converted at the plane's own depth
(`MODAL_CAM_DIST`, which `pxPerWorld` is already computed at). That is the **one** place the
correction lives, and it is a target, not a per-handoff patch: anything else that later flies
between the two scenes is correct for free. Note the pull-to-close nudge nearby
(`modalCard.mesh.position.y -= pulledY / pxPerWorld`) needs nothing — a constant projection skew
does not change px-per-world, so *relative* screen deltas are unaffected.

**The shared camera is the trap for anything else.** Re-centring by shrinking `H` changes
`camera.aspect`, and the modal renders through that same camera, so its photo comes out squashed
with black gutters. Anything done to the main camera must be checked against
`modalRenderer.render(modalScene, getCamera())` — a *projection skew* is safe there (it is a pure
screen-space translate), a change of `aspect`, `fov`, or `position` is not.

A late change to the token propagates on its own: `readCssVars()` sits *before* `doLayout`'s
unchanged-`W`/`H` early exit, so the body `ResizeObserver` refreshes `navH` even on a no-op layout,
and `applyCentringOffset` recomputes from it every frame. The CSS consumers need no help at all. The
one gap is a nav whose height changes with no effect on body size and no resize — CSS still tracks
it instantly, the camera catches up on the next `doLayout`.

`appliedViewOffsetY` is **write elision and nothing more**: `setViewOffset` rebuilds the projection
matrix, so it fires only when the offset actually moves, and the cache is reset wherever the camera
object or `W`/`H` changes since both are baked into the call. No consumer reads it back.
Reduced motion sets `--gg-nav-h: 0` — nothing is pinned there, so the offset falls to 0 and
`clearViewOffset()` runs, with no JS branch.

**Also not nav-aware, on purpose:** the arc copy and the barrel's hint row are bottom-anchored;
nothing occludes the bottom of the viewport.

### Pull-quote box: content-sized, gap-controlled

The quote box has **no height**. It is a column flex container whose only tunable vertical measure is
`--gg-pq-gap`, the space between the `blockquote` and the name/role `.globe-gallery-pullquote-attribution`;
everything else (padding + copy) sizes itself.

`.globe-gallery-pullquote` is a **`<figure>`** and the attribution its **`<figcaption>`**, which is
what associates the name/role with the `<blockquote>` for AT. Its `margin: 0 auto` zeroes the UA
`margin-block`.

`--gg-pq-gap` is `min(--gg-pq-ideal-gap, --gg-band-h × 0.2)`. The ideal steps `--s2a-layout-lg` →
`-xl` (≥768) → `-2xl` (≥1280); the band term tapers it on short viewports, because the box is
content-sized while the band it centres in is not: on a short, wide laptop (1280×720 is the worst
case) a five-line quote at `heading-1`'s 80/76 makes a 684px box for a 596px band, and without the
taper the first line lands under the nav no matter where the box is centred. The gap is the only pure
whitespace in the box, so it is what yields. Raising the ideal runs the top edge into the localnav at
lg/xl, so re-check that clearance first.

The figure is centred on `--gg-optical-center` inside the rail by
`transform: translateY(max(-50%, calc(var(--gg-band-h) * -0.5)))`: centred while it fits the band,
top-anchored (overflowing downward only) once it doesn't. See **Pull quote** for pinning.

### Crosshair frame

`--gg-copy-pad` steps **24px → 48px (≥768) → 64px (≥1440)**, and the pull-quote draws a hairline
crosshair on it — so the quote's own text edge lands on the vertical line, and the hanging opening mark
is the one thing outside it. Because that var also feeds `--gg-content-inset`, **the arc copy widens
with it**: the two share one edge by design and cannot drift.

| Width | `--gg-copy-pad` | Token |
| --- | --- | --- |
| < 768 | 24px | `--s2a-spacing-lg` |
| 768–1439 | 48px | `--s2a-spacing-3xl` |
| ≥ 1440 | 64px | `--s2a-spacing-4xl` |

This uses c2's **grid** breakpoint (768, where `--grid-columns` becomes 12) for the first step and its
**token tier** `xl` (1440) for the second. c2's tiers are `sm` = base, `md` = 1024, `lg` = 1280, `xl` =
1440 — so lg (1280–1439) holds md's 48px here.

**Line weight.** The frame is 1px (`--gg-crosshair-width`) in `--gg-pq-rule-color` (gray-800). It sits
beside the quote and must not out-shout it — gray-400 `#c6c6c6` is close enough to the copy's `#fafafa`
to read as a second headline. **Do not use fractional widths:** `border-width` snaps to device pixels
*per edge*, so 1.5px lands as 1px on some rules and 2px on others at 1dppx and the frame goes
asymmetric.

Drawn as two pseudo-elements, not four: `::before` insets top/bottom and borders its block edges,
`::after` insets inline and borders its inline edges. Each pair spans the full box instead of stopping
at the corners, so the runs **cross** and read as a crosshair rather than a closed rectangle. They are
`position: absolute`, which keeps them out of the flex flow and lets them inherit the parent's fade. The
frame tracks the content-sized box, so both follow a copy or `--gg-pq-gap` change with no second number
to update.

### Pull quote: particle transition, DOM text at rest

The cards turn into the pull quote. Past the hand-off the far-side cards break up into particles,
which swirl into the quote's glyphs and crosshair and resolve, glyph by glyph, into a crisp raster
drawn in the globe's canvas. Once the quote is complete, the real DOM text and CSS crosshair take
over invisibly and the canvas is hidden for the rest of the block. Everything lives in
`src/quote-particles.js`, shaders and tuning constants included (one block at the top of the file).
A figure with no text builds none of it; reduced motion has none of it either: a static DOM figure
after the globe.

**Scroll.** `startT` is the hand-off: one moment at which the globe stops being interactive (drag,
tap, cursor, controls), the spin comes to rest and the far-side cards start to dissolve. It is where
the camera sits `PULL_BP[band].startR` sphere radii in front of the centre (`zoomTAtCamZ`), capped at
`pqAppearZoomT`. At 0 the camera is at the centre and every near-side card is behind it. Below 0,
far-side cards between the centre and the camera are passed as plain cards; above 0, near-side cards
still in front of the camera become quote particles. From that scroll position
(`TL.scrollYAtZoomT`) the flight progress `p` runs 0 → 1 over `FLY_VH` viewport heights. Everything
below is a pure function of `p`, so it all reverses when you scroll back. The block's height follows
from these lengths (see Block height).

| `p` | What |
| --- | --- |
| 0 | Cards as before. Once p > 0 and the pairing is ready, they hide and their particles take over, identical on screen. |
| `FLIGHT.release` | Particles release from the camera dolly and turn to dots, the whole card at once (a tile the dolly has grown too big goes earlier). |
| `FLIGHT.depart` | Every particle departs, right after its release. |
| `arriveStart` → `arriveStart + arriveSpan` | Landings in reading order (± `ARRIVE_JITTER`), each region turning crisp as it lands. |
| `QUOTE_LIVE_P` | The whole quote is the crisp raster; the DOM takes over and the canvas hides. Derived from `FLIGHT`, so it moves with it. |

**One resolve, frozen globe, moving camera.** While particles are on (`isOn()`: not forced colours,
raster ready), `placeSphereCard` gives cards behind the centre plane `proxFade = 1`, so the far side
never runs the near-camera scatter; the quote particles are its only break-up. Near-side cards
scatter as they pass the camera (Near-camera dissolve). Over `HANDOFF_EASE_T` before `startT`,
`handoffEase` eases hover and drag warp to 0; spin and drag run at full strength and stop at `startT`
itself, where the pointer retires and the dissolve starts. `camZAtZoomT` eases out with
`ZOOM_EASE_POW` (`camZAt`/`pAtCamZ` and the shaders' `camZAt` read it too): lower spreads the travel
more evenly, giving the inside of the globe more of the zoom. While the particles own the cards
(`ownsCards()`), the orientation is held exactly, so the cards come back where the particles left
them. The camera keeps dollying throughout.

**Hand-off: the particles are the card.** On the first owned frame, `cardPlanes()` turns each sphere
card into a world-space plane (`origin`, `axisU`, `axisV`), from its sphere pose rather than from what
the frame drew (`placeSphereCard` keeps the transform fresh even behind the camera). Each card is one
`Points` draw. In `POINTS_VERT` each particle is projected with the live camera (it only translates
along z) and sized to its projected cell (`aCell`). The fragment shader casts each sprite pixel's ray
through the card's plane, so its card uv is exact under any perspective and tile size, and samples
the real card texture with the card's crop, mirror, corner SDF and gamma. So the tiles are the card,
pixel for pixel, up to the release.

**Source layout: a pure function of the runway.** `setSources(cards, view)` never reads the live
frame. It projects with the canonical camera of the runway (`camZAt(zoom, p)`, the shader's
`camZAt`), so a fling that first sees a late `p` gets the same layout as a slow scroll. Every card in
view at p 0 converts whole, on a grid. The budget (exactly the particle count) is shared by each
card's on-screen area at p 0 plus `OFF_VIEW_K` of its off-screen area, so a card mostly off screen
still breaks into fine tiles. All draws are seeded; the pairing runs over the next two frames, and
until it is ready the particles stay hidden and the cards stay drawn (`isPaired()`).

**Release.** Each particle's release p is mostly random, with a light rim lead (`EDGE_LEAD`, shared
with the near layer), so a card breaks up all over at once rather than in a ring travelling inward.
A particle releases no later than the dolly growing its tile past `TILE_MAX_K` shares (but not before
the first release, so the hand-off is the card), so a big card never breaks into big chunks. At
release the particle gets its own camera, which carries on at the live camera's speed and decays to a
stop `RELEASE_REACH` of the way to `MIN_DEPTH` in front of it: simple inertia, velocity-continuous, no
clamping (brief off-screen excursions are fine). A released tile turns into a round dot over
`DETACH_P` and holds its place until it departs.

**Pairing (soft).** Card pixels are matched to glyph targets by position on the frames after the
hand-off (the sort one animation frame later, `fillDraw` the frame after), so the hand-off frame costs
no more for it. `coherentOrder` is a 2D quantile order: `PAIR_BANDS` equal-count x bands, each read
top to bottom; rank r of the sources takes rank r of the targets, so left cards feed the left of the
quote and paths don't cross. Plain bands would map each card onto one rectangle of text, so the
source keys get per-particle noise (one band in x, `SOFT_Y` of the height in y) and a `SOFT_SWAP`
share of ranks swap with one up to `SOFT_SWAP_SPAN` of the order away: colours dither across the
seams.

**Flight: the swirl.** Every particle departs within `FLIGHT.depart`, right after its release, by its
target's landing order and, less, its depth in its card (rim first), and flies at least
`FLIGHT.minFly` to its own arrival. Its path is a linear blend from source to target, carried by one
shared curl-noise flow: a displacement of up to `SWIRL_AMP` of the viewport's short side ×
`sin(π·t)`, so it is zero at hand-off and at landing. The flow's feature size is `SWIRL_SCALE` and it
drifts with `p` only (`SWIRL_DRIFT`), so neighbours move as ribbons and the path is the same in both
directions. The sprite shrinks from cell to dot early in the leg and keeps the photo's colour until
`INK_FROM` of its travel, when it turns to the text or rule colour.

**Landing = crisp, locally.** `landingOrders` gives every pixel of the raster a landing order 0 → 1,
once per layout. A particle's arrival is its target pixel's order mapped into
`arriveStart`/`arriveSpan`, plus a fixed ±`ARRIVE_JITTER` that feathers the wave's edge; the crisp
plane reads the same orders from a texture (`uOrder`, one byte per pixel) and reveals each pixel from
its region's mean arrival to past its latest one, while landed particles grow into solid squares and
fade out. One source for both, so the quote goes crisp in one wave behind the landing, and nothing to
keep in step between JS and GLSL.
- **Text:** a mostly horizontal reading order over the figure box, mirrored for RTL, stretched so the
  text's last pixel lands at `TEXT_END` of the order.
- **Crosshair:** the full order, so its lines finish a little after the text. A left-to-right wave
  (over the first 1 − `RULE_DROP` of the order) draws the horizontal rules in left to right and forms
  the left rule whole when it reaches it; the right rule then draws down from its top over the last
  `RULE_DROP`, and the bottom rule lags the wave by up to that much, more and more towards the right,
  so both meet at the bottom-right corner rather than on a diagonal. Its pixels weigh `RULE_WEIGHT` in
  the target pick, so the lines are visibly built from a stream of dots (from the same budget).

**Layout and targets.** The DOM figure is the layout engine. `createPullQuote`'s `layout` restores the
plain authored text (`plainQuote`, which also hangs the opening mark) and shrinks the font if the box
is taller than the band (scaling the heading's px line-height and tracking with it; only short
viewports get there). It then calls the particles' `layout()`, which waits for the fonts and an idle
period and then, in one task:
1. **Measures** one Range per character, grouped into lines, plus the DOM's own ascent (from a
   zero-size inline-block probe on the first baseline).
2. **Rasterizes** each line at `devicePixelRatio` with the computed font, letter-spacing, direction
   and `--gg-pq-ink`, its advance scaled (within a small bound) onto the DOM line, and the figure
   offset and each baseline snapped to device pixels as layout does. The crosshair's rules go into
   the same raster from the figure's padding, `--gg-crosshair-width` and `--gg-pq-rule-color`.
3. **Samples targets**: each ~1 CSS px cell with alpha ≥ `INK_ALPHA`, picked at random (cycled if
   short). The landed dot size follows the sampling density (`DST_SPACING`).
4. **Builds the text plane**: the same canvas as a `CanvasTexture`, one texel per device pixel.

Coordinates are CSS px from the top-left of `.globe-gallery-pullquote-rail`. Layout re-runs when the
figure width, viewport height, nav height or DPR changes, and on `fonts.ready`. The DOM text and its
fit update at once; the raster waits until those inputs have held for `DEBOUNCE_MS`, so a resize drag
rasterizes once. A finished layout, or a change of view (size, projection, zoom span) that has held
for `DEBOUNCE_MS`, re-pairs a flight in progress. The current draws stay on screen until the new ones
are filled and swap in the same callback, so a resize never shows a gap; in between, particles fly to
the old layout's targets. Releasing the cards (scrolling back above `startT`, forced colours) drops
the draws, so the next flight pairs from the cards as they are then.

**The swap to the DOM.** At `QUOTE_LIVE_P` nothing on the canvas changes any more. From there on the
crisp plane shows and the cards hide without waiting for a pairing, so landing past the quote (a
reload or an anchor jump) never shows a blank frame. `update` tweens `--gg-pq-dom` 0 → 1 over
`SWAP_MS`: the DOM copy's ink and the CSS crosshair's border colour mix in from transparent
(`color-mix`), then `updateCanvasVisibility` hides the canvas. Below `QUOTE_LIVE_P` it runs back and
the canvas reappears before the reverse flight. The raster comes from the DOM's own layout, and three
details make the two match: the figure drops the page's `-webkit-font-smoothing: antialiased` (canvas
can't use it), the raster uses the DOM-measured ascent, and it snaps positions to device pixels as
layout does. The frames either side of the swap differ by a fraction of one 8-bit level on average.

**Pinning.** `-pin` covers the whole block, and `-rail` sticks at the top like the world but is only
as tall as the quote's bottom edge (`--gg-pq-rail-h`, measured on layout, capped at a viewport). Once
`p > 0` the canvas switches from `position: fixed` to `absolute` inside the already-stuck world (a
seamless swap). The world un-sticks first, as the block's end reaches the
viewport bottom; the quote stays put until that end reaches its bottom edge, so the crosshair meets
the end of the block and the two scroll away together. Because the world, and the canvas with it,
moves first, the canvas hides and the DOM quote is fully inked as soon as the world un-sticks, even
on a fast scroll.

**Accessibility.** The canvas carries no content. The real `figure > blockquote + figcaption` stays
in the DOM, in reading order after the arc copy, always in the accessibility tree: while the canvas
draws it the text is transparent (never `display: none` or `visibility: hidden`) and sits exactly
over the drawn glyphs, so the VoiceOver cursor and selection land on them; after the swap it is
simply the visible text. From `QUOTE_LIVE_P` the figure takes the pointer and is selectable; leaving
the quote drops a selection anchored in it. The globe's controls leave the tab order as it eases to
rest.

**Forced colours / fallback.** WebGL ignores forced colours, so under `(forced-colors: active)`, or
if the raster found no ink, the figure gets `is-dom`: no particles, the system-coloured DOM text
fades in at `is-live`, and the canvas hides past the reveal as it would with no quote. `is-dom` holds
the figure at `opacity: 0` until then, since forced colours repaints transparent text.

**Perf.** `PULL_BP[band].count` sets the particle budget; sm runs fewer so its dots stay big enough
not to dim as they shrink. There is one `Points` draw per far-side card in view plus the text plane.
The canvas stops drawing once it is hidden. The raster runs in idle time once the fonts are in (`requestIdleCallback`, at most
`IDLE_TIMEOUT_MS` late; `setTimeout` where it is missing). The points shader (one program, shared
with the near burst) and the plane's are compiled at build (`warm`), so the hand-off never waits on a
shader compile. The costliest frames are the hand-off (`setSources`) and the sort one frame after it.

**Known limitations.**
- A card running off screen still converts whole, so some particles fly in from just off screen.
- Ligatures and kerning come from canvas shaping, so an individual glyph in the raster can differ by
  a pixel from the DOM's (most of the swap's residual difference).
- The reading beat after the quote is crisp is a fixed `READ_VH`, whatever the quote's length.
- A reload partway through the flight shows plain cards until the raster is ready, then the
  particles take over at the current `p`.

## Analytics

The block answers one question: **what fraction of card opens lead to a clickthrough to a
product page.** Nothing is tracked per-card — with ~50 cards that is cardinality nobody asked
for. Card identity appears nowhere.

### Why this needs any custom code

Milo's `decorateDefaultLinkAnalytics` (`libs/martech/attributes.js`) runs **once**, from
`documentPostSectionLoading`, and only ever touches `<a>` and `<button>`. That leaves this
block with four holes:

1. A card is WebGL pixels raycast in `interaction.js` — there is no DOM node to decorate.
2. Auto-generated labels are `${label}-${linkCount}--${header}`, where `linkCount` is the ordinal
   among *all* links/buttons in the block. The ~50 `.globe-gallery-a11y-card` buttons precede the
   modal controls, so prev would read `previous card-52--`. That ordinal is **race-dependent** (the
   a11y buttons only exist after the async fragment fetch) and **never re-applied** after a
   breakpoint rebuild recreates them.
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
| Rotate the globe a step | `daa-ll` in `buildMarkup` | `rotate_left--globe_gallery` / `rotate_right--globe_gallery` |
| Pause / resume auto-spin | `daa-ll` rewritten with the state (`controls.js`) — one button, two meanings, so a fixed label would merge them | `pause_spin--globe_gallery` / `resume_spin--globe_gallery` |
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

- **Badge labels carry no index.** Derived from row position it would differ per card (Photoshop
  `-1` on one, `-3` on another), splitting the one aggregate that matters. One product = one label.
  `processTrackingLabels` also strips `-`, so `Photoshop-Web` becomes `Photoshop Web` and can't
  corrupt the level split.
- **20 characters per segment.** `decorateDefaultLinkAnalytics` re-runs every `-`-separated segment
  of an existing `daa-ll` through `processTrackingLabels(part, config, 20)`, which hard-slices at 20
  **silently** — hence `_kbd` rather than `_keyboard`. Check any new label the same way: split on
  `-`, and no piece may exceed 20 characters. Product names are sliced to 20 at mint time.
- **Every card button carries the *same* explicit `daa-ll`** (`CARD_OPEN_DAA_LL` in `a11y.js`). Left
  to auto-decoration each would derive a label from `aria-label` — the card's alt text — producing
  ~50 per-card labels, the exact cardinality this design rejects.
- **`event.isTrusted` separates acting from reporting.** A synthetic click carries
  `isTrusted: false`; genuine user activation is always `true`, including keyboard Enter/Space and
  screen-reader activation (AT goes through the platform accessibility API, which browsers surface as
  a trusted click). So `onCardClick` bails on untrusted events: `trackCardOpen`'s click is
  report-only, and without that bail it would reopen the modal at viewport centre, discarding the tap
  coordinates the raycast passes. The marker rides on the event, so unlike a module-scope flag it
  can't latch or leak.
  **Test gotcha:** driving the block with `page.evaluate(el => el.click())` produces an untrusted
  click and appears to do nothing. Use a real click API (Playwright's `locator.click()`).
- **Only the canvas path calls `trackCardOpen`** (`openModalFromCanvas`, kept separate from
  `openModalAndDismissHint` for this reason). A keyboard open is already a real click on that button,
  so reporting there too would double-count.
- **`enter_gallery` is the one engagement signal here** — one label, ~one event per keyboard session,
  answering whether the two-level gallery is ever entered at all. The widget is only *clicked* to
  enter BROWSE; merely focusing it (which scrolls via `snapToBrowseView`) is not reported.
- **Caveat inherent to `daa-ll` on any button:** a real click reports even when the handler declines
  to act — `enterBrowse()` bails if the sphere isn't formed, `onCardClick` if `isInteractive()` is
  false. Expect a small over-count on both.
- **`close(e.isTrusted)`** (`modal.js`) is the same idea. `close(viaPointer)` ignores a close within
  200ms of open, to swallow the *browser's* synthetic click after a touch pointerup — which is
  trusted, so the guard applies. Escape and pull-to-close route through `clickClose()`, are
  untrusted, and are exempt; otherwise Escape within 200ms of open would be silently ignored.
  `viaPointer` and `isTrusted` are the same predicate, so it's derived from the event, not stashed.
- **Do not add `daa-lh` anywhere in the block.** `attributes.md` forbids it, and a `daa-lh` on the
  block element makes `decorateSectionAnalytics` skip link decoration for the whole block.
- **Not tracked, deliberately:** globe drag/hover/auto-rotation, scroll milestones, card impressions,
  and close *method* (button vs Escape vs swipe collapse to one label). These are the one class of
  signal the all-`daa-ll` design cannot express — nothing is clicked, and no element means "the user
  reached the formed globe". Adding one means reintroducing `sendAnalytics`
  (`libs/martech/helpers.js`) at the `SPHERE_INTERACTIVE_T` gate behind a once-only flag, and with it
  a second reporting path that gates on consent separately from DAA.

## Behavior notes

- **"Click & Drag" hint text (WebGL).** Sphere geometry only — `initRuntime` skips
  `buildTextMesh()` when `bp.CYLINDER`, because the masonry barrel would hide the plane while it
  still cost a full-screen transparent quad every frame and about 17MB. The gate is on the
  geometry, not the pointer, so a narrow desktop window skips it too; the barrel's own DOM hint row
  covers that case. A band crossing rebuilds the whole runtime, and `doLayout`'s rebuild branch is
  already `if (textMesh)`, so nothing needs to add the plane back on a resize.

  A `PlaneGeometry` in `sphereGroup` behind the sphere's back surface
  (`z = -(SPHERE_R + TEXT_BEHIND_GAP)`, `renderOrder = TEXT_ORDER`), so it rotates with the globe
  and draws behind the cards. Hidden until `sphereFormT > TEXT_APPEAR_START`, then warps in (barrel
  warp plus particle dissolve, via `TEXT_FRAG`), settles to a faint resting opacity
  (`TEXT_OPACITY_PEAK` 0.15 to `TEXT_OPACITY_RESTING` 0.06), and fades out over the zoom. Sized to
  fill the frustum at its live camera distance (`textPlaneSize` times a per-frame scale off
  `frame.foldSphDist`), with warp-proportional overflow so letterforms bleed off-screen.

  **The entrance resolves on `SPHERE_INTERACTIVE_T`, not at `sphereFormT` 1.** `sfT` remaps
  `[TEXT_APPEAR_START, SPHERE_INTERACTIVE_T]`, so the warp reaches 0 exactly when the globe goes
  live and the `grab` cursor arrives. The plane's scale is separate: it tracks `foldSphDist` to 1.0
  at `sphereFormT` 1, which holds apparent size constant as the camera moves.

  **It dissolves away on the user's first drag, in one shot.** `uExitP` is `hintExitT`, which runs
  itself 0→1 at `HINT_EXIT_RATE` per 60fps frame (`× dtScale`, ~2.4s) from the moment `hintRetired`
  flips, regardless of what the pointer does next; the mesh goes `visible = false` at 1. Driving it
  from the drag instead is what parks the plane mid-scatter when the user lets go halfway, so the
  clock is deliberately independent of the gesture that started it.

  The dissolve is deliberately slower than the cursor's 0.42s retirement — the plane is full-frame,
  so it reads as an atmospheric drift rather than a blink.

  `TEXT_FRAG` spends `uExitP` on a horizontal stretch, a radial scatter, an amplified barrel warp,
  a push of the particle dissolve toward full scatter, and an alpha fade, so the letterforms blow
  apart rather than cross-fade. That fade is `smoothstep(0, 1, uExitP)`, reaching 0 exactly where
  `hintExitT` hits 1 and the mesh hides — keep the two ends together, or a full-screen transparent
  quad keeps shading for the gap between them. Everything else the plane reads is scroll-driven: `uWarp` is
  `txtWarpEntrance` alone, `uCA` is that same term times `TEXT_CA_WARP_MUL`, and the mesh scale
  tracks only `foldSphDist`. Under reduced motion `updateClickDragText` returns before it reads
  `hintExitT`, pinning `uExitP` to 0, so the plane is static whatever the latch says.

  Built in `buildTextMesh`. The font comes from `--heading-font-family`, so the hint follows the
  page's heading font, including the per-locale swaps (CJK and Thai repoint that variable to a Han
  or Thai family). `loadHintFont` waits for those faces first, because drawing to a canvas does not
  trigger font loading on its own.

  **The build waits on `fonts.ready` AND `loadHintFont`, and both are load-bearing.**
  `loadHintFont` names the family explicitly so Safari actually fetches the face, but
  `document.fonts.load` resolves in a microtask when no matching `@font-face` is registered yet —
  on a cold cache, every first paint — so alone it is no barrier and the hint bakes in whatever
  fallback the canvas had. `fonts.ready` is the wait that survives a cold load. The zero-box gate
  does not replace it: that gate guarantees the *block's* stylesheet, while the webfont arrives via
  a *page* stylesheet it says nothing about.

  **Nothing about the hint degrades to a half-built plane.** A rejected font promise takes the
  `then`'s no-op arm; a `null` from `createClickDragTexture` drops the build; and a **first** build
  (`!replacing`) that resolves once `sphereFormT` is past `TEXT_APPEAR_START` sits out, so the hint
  never pops in over a globe already turning. A **rebuild** lands whatever the scroll is doing — it
  is swapping a plane already on screen. `doLayout` rebuilds only when a `textMesh` exists, so a
  first build that sat out stays out for the session.

  **That skip is off under reduced motion**, which has no entrance to interrupt. RM pins `lenisY` to
  `blockDocTop + formPx`, so `sphereFormT` is `1` on every tick from the first one regardless of
  scroll — without the `!reducedMotion` term the first build would always sit out and RM would never
  get its static plane at all.

  `usableFamilies` probes the shorthand once against the serialised size, falls back to
  `HINT_FALLBACK`, and returns `null` if even that will not parse — an unparseable `ctx.font` is
  **ignored** by canvas, leaving the previous font (10px sans-serif) while `letterSpacing` still
  applies, which stacks every glyph into one column. `measured` guards the same class of thing:
  `Math.max(1, NaN)` is `NaN`, and a `NaN` font size is one more silently ignored assignment.

  At most one build is ever in flight, which is why `create` needs no generation check.

  Known and accepted: on a machine with Adobe Clean Display installed locally, Chrome uses that
  local face while Safari, which hides non-system fonts, uses the webfont, so the baked text
  differs slightly in size between the two. Anyone without the font installed gets the webfont in
  both. Rebuilt on resize, static and faint under reduced motion. Copy is authored (see
  Localization).

- **Desktop cursor label (`src/cursor.js`).** Sphere geometry on `(hover: hover) and
  (pointer: fine)` only, over the live globe: the authored "Click & Drag" label in a pill riding
  32px beside the native cursor (to its left in RTL).

  **The exit is one step, on the same `hintRetired` latch the barrel's hint row reads.** On the
  first drag the label retires, and scrolling past `liveUntil()` (the hand-off with the particles
  on) is the same exit reached by scrolling instead of dragging. The cursor's own live gate is
  `globeFormed` without the scroll cut, so the fade plays out instead of snapping. `RETIRE_FADE_MS`
  must match the CSS duration, because `active` drops only once the fade has run.

  **Two exits.** *Retiring* fades the label's opacity over `0.42s ease`. *Deactivating* (modal open,
  pointer off the canvas, globe no longer formed) snaps it out on untransitioned `visibility`, so it
  never lingers at the click point when a card opens. The `0.15s` entrance stagger lives on the
  `-active` rule as `transition-delay`, so it applies on the way in only.

  **`cursor.js` never writes `canvas.style.cursor`.** `interaction.applyCursor()` is the sole writer,
  so the native `grab` / `grabbing` / `pointer` stays under the label throughout.

  **Every gate is at `setup()`, none per frame.** `initRuntime` calls `cursor.setup(canvas)` only
  when `!bp.CYLINDER && !reducedMotion`: the barrel gate is the one `buildTextMesh` uses — a narrow
  desktop window is hover+fine but renders the barrel, which carries its own hint row, and the two
  affordances would otherwise both claim "click and drag". Both gates can sit at setup because a
  band crossing *and* an RM toggle each run `destroy(); initRuntime()` (`doLayout`), so there is no
  live state to re-check. Inside `setup()`, `(hover: hover) and (pointer: fine)` is read **once**;
  the CSS `@media` mirrors it. Any gate leaves `els` null, so `update()` no-ops for the session.

  It does not test for an open modal either: `globeFormed()` already excludes one.

  **Every pointer listener is on the canvas, not the window** — `mouseenter` / `mouseleave` /
  `mousemove`. Coords stay live through a drag that wanders off the canvas because pointer capture
  retargets the compatibility mouse events to the capture element. `onEnter` seeds the coords from
  its own event, so re-entry positions the cursor before the first `mousemove` lands; `hasCoords`
  still gates activation, since a `mouseenter` synthesised by the globe scrolling under a
  stationary pointer would otherwise play the entrance at `0,0`. Only `focusin` (document) and
  `blur` (window) stay global — a focus anywhere should suppress the cursor.

  **The container is `aria-hidden`.** It is a `<body>` child carrying visible text, outside the
  block and outside its a11y tree, so without it a browse-mode virtual cursor lands on a bare
  "Click & Drag" with nothing around it. The affordance is announced by the gallery instructions
  instead. Keyboard users still retire the hint layer — `openCard` and the rotate chevrons set
  `hintRetired` directly, without going through `onDrag`.

- **Canvas cursor — browser-native (`interaction.js`).** Always shown, with the label beside it.
  Over the live sphere with no modal open the canvas gets `grab`, `grabbing` while
  `drag.isDragging`, and `pointer` when the raycast hits a card — a card opens a modal, which is a
  click, not a drag. Anything else clears the style back to the page default.
  `applyCursor()` is the **sole writer** and diffs against `appliedCursor`, so a `pointermove` storm
  writes nothing. It is called from the two drag edges (`onPointerDown` / `endGesture`, neither of
  which is necessarily followed by a move) **and once per frame from `tick()`** — the interactive
  gate and the modal flip on scroll alone, with no pointer event to hang the update on.

- **`hintRetired` — one latch, three consumers.** The barrel's hint copy, the desktop cursor and
  the WebGL hint plane all retire off this single boolean. It is set by the **first drag**:
  `interaction.js` fires `onDrag()` the moment a gesture's travel clears `CLICK_MAX_MOVE` (the
  same threshold that decides click-vs-drag), so any deliberate spin retires the layer, however
  short. A chevron tap or a card open sets it directly.

  **One-way.** Nothing re-arms it short of `destroy()` (band crossing, RM toggle, context-loss
  recovery), which is per-instance state and stays that way. Do not re-arm it on `sphereFormT`
  dropping below `SPHERE_INTERACTIVE_T`: that gate is ~18vh of scroll-back, so a small nudge would
  bring a dismissed hint straight back.

- **Barrel hint copy retires after interaction.** Touch has no hover cursor and (below md) no WebGL
  hint plane, so the barrel's bottom row is the whole affordance until the user has spun the globe.
  On `hintRetired` `controls.update()` puts `.is-dismissed` on `.globe-gallery-hint`, fading only
  `.globe-gallery-hint-text` over 0.5s; the chevrons stay, so the non-drag path never disappears.

  The row's scrim matches **`.globe-gallery-modal-info`** — `transparent-black-64` +
  `--gg-chrome-blur` + a `transparent-white-00` border — not the lighter arc-copy pill, which
  floats over the arc phase with no chrome around it. The radius is the exception, taken from the
  buttons it abuts (`--gg-controls-radius`).

  **The chevrons read as the modal's prev/next.** Same glyphs (`M15 5l-7 7 7 7` / `M9 5l7 7-7 7`,
  14px, stroke 2), and `.globe-gallery-control` and `.globe-gallery-modal-nav` share every box
  property: 48px, radius 6 (`--gg-controls-radius` / `--gg-control-radius`, separate vars, equal
  values), `transparent-white-24` border, `black-64` + `--gg-chrome-blur`, `scale(1.05)` hover,
  `scale(0.98)` active.

  **Positions are not matched, and the pair blinks across a modal open.** The barrel's chevrons are
  centred against the two-line hint copy between them, so they ride above the inset the modal's
  arrows pin to; and the controls layer drops the frame `modalIdx` goes non-negative while the
  modal's chrome only starts its fade at 90% of the 350ms fly. Both are accepted. Pinning the
  buttons to the inset (`flex-end`, or a fixed row height) misplaces the copy instead, and holding
  the chevrons across the swap needs `modal.js` and `controls.js` to agree per frame on which pair
  is painting. Check any change here on a device.

  At md-coarse they diverge further (an iPad is a barrel — `usesCylinderGeometry` is
  `sm || (pointer: coarse)`): the modal centres its arrows around the 138px counter pill there,
  while the barrel row stays in the corners.

- **Modal chrome — edge-anchored nav arrows + counter; desktop adds a screen-edge scrim.**
  - **Controls — placed entirely in CSS** (`revealModalChrome` only fades them in). Prev/next arrows
    and the counter are independent chrome children (no wrapper, so each one's `:hover` scale
    survives the reveal fade), reading as one bottom-centre row at every breakpoint. Every offset is
    a **per-breakpoint constant**: the modal card is always horizontally centred
    (`computeModalTarget` pins `x` to 0), so "centred under the image" is just `50%` — nothing to
    project, nothing to track. **Desktop/tablet:** the counter pill sits at `left: 50%` (physical, because its
    `translateX(-50%)` is physical) with an arrow `--gg-nav-gap` out each side, offset from
    the centre by `--gg-counter-w / 2 + gap + --gg-control-size` on `inset-inline-start` so RTL
    mirrors for free. All three share one `bottom` — `--gg-modal-edge` from the *viewport* bottom,
    not the image bottom, so the row holds its height whatever the photo's aspect. **Mobile:** the
    same row spread into the bottom corners inside the scrim (`inset-inline-start`/`-end`). The three
    frosted controls (both arrows + close) share one style and one 48×48 `--gg-control-size` hit
    target everywhere; close sits at the top inline-end corner at every breakpoint. Geometry is five
    locals on `.globe-gallery-modal-chrome`: `--gg-modal-edge` (`--s2a-spacing-md` → `-lg` at md+ —
    the single inset for all four controls *and* the scrim padding), `--gg-control-size`,
    `--gg-control-radius` (a literal; no S2A step), `--gg-counter-w` (`auto` at sm, fixed at md+,
    where the pill's own `width` reads it) and `--gg-scrim-w` (md+ only). `--gg-modal-edge` is
    also the sm scrim's `padding-bottom` reserve (`edge + control + edge`, so the arrows clear the
    badges); at md+ the arrows sit under the image, so the override drops it to a flat `edge`.
    At `height ≤ 360px` (e.g. 200 % browser zoom on a small window) `--gg-modal-edge` and
    `--gg-control-size` compress to their WCAG minima; `.globe-gallery-modal-info` switches to
    `display: block` + `overflow-y: auto` so the full panel scrolls as one container. The
    `data-lenis-prevent` on `.globe-gallery-modal-info` is required for this: Lenis intercepts
    wheel events on any child that isn't covered by the attribute (checked via `closest`).
  - **Image fit + corner radius.** The **visible image** is contain-fit to the viewport minus a
    symmetric margin (desktop `DT_IMG_MARGIN`; mobile full-bleed, square corners `uRadius=0`),
    native aspect kept. `MODAL_FRAG`'s rounded-rect is measured against the **full plane**
    (`vec2(uAspect·0.5, 0.5)`, same as `CARD_FRAG`) — the plane edge *is* the photo edge, so the fit
    is plain `min(H − 2·margin, (W − 2·margin) / uAspect)` with nothing to back out. An inset box
    (half-extents minus `uRadius`) would clip `uRadius` worth of photo off all four edges, i.e. the
    modal would show *less* of the image than the globe does. Desktop keeps a constant
    `MODAL_RADIUS_PX` **on screen for every card**, not a fraction of height: `uRadius` is
    normalised to card height, so `modalDesktopFit(uAspect)` derives `radiusFrac = 16 / cardHPx` —
    per card, since `cardHPx` depends on whether that card's aspect makes the fit width- or
    height-limited. `modalRadiusFrac(uAspect)` wraps it with the mobile `0`, taking the **aspect**
    because that's the only per-card input. That aspect is `modalUAspect(card)`: the aspect of the
    texture the modal is actually *displaying* (`card.modalAspect`, set when the hi-res upgrade
    decodes and cleared when it's released), falling back to `card.srcAspect`. Preferring the
    displayed texture matters because `srcAspect` comes from the small *base* texture, whose rounded
    dimensions are off by a few tenths of a percent, and because a card opened before its base photo
    lands would otherwise be fitted at the placeholder aspect. Because both values depend on the fit
    and the live texture, `computeModalTarget` re-pushes `uAspect` + `uRadius` **per-frame**.
  - **The crop opens up with the fly.** The barrel may cover-crop a card (see `CYL_ASPECT_CAP`) while
    the flown-out card shows the whole photo, so `MODAL_FRAG` carries the same `uRepeat`/`uOffset`
    pair as `CARD_FRAG` and `pushModalCoverUV` tracks the plane's live aspect (see *Architecture
    notes*). Without it, the first frame of the fly would show the *whole* image at the *barrel's*
    aspect — a visible horizontal squash that resolves over the modal's fly (`modalAnimMs`). A desktop nav
    cross-warp owns its own cards' uniforms, so the push is skipped while `dnNavActive`.
  - **Scrim + scroll region.** Desktop gets a fixed-width (`--gg-scrim-w`) dark frosted scrim
    on the **viewport's inline-start edge, full height**; mobile gets one full-width bottom chunk
    (content-sized, capped at `60dvh`). Both are **pinned header / scrolling body / pinned footer**: name + role are
    `flex-shrink:0` at the top, **badges** are `flex-shrink:0` at the bottom (so those tabbable
    controls stay on-screen), and the **description** is the only scroll region (`min-height:0;
    overflow-y:auto`). A `mask-image` scroll-shadow (`updateDescFade`, re-measured on
    scroll/resize/card-change) fades whichever edge has more copy, so the affordance survives macOS's
    hidden overlay scrollbar. JS gives the description `tabindex="0"` only while it actually overflows;
    the full text is always in the a11y tree via `aria-describedby`; `touchstart` skips the swipe/pull
    gesture when a drag starts inside it. It also carries **`data-lenis-prevent`** — Milo loads Lenis
    on `foundation:c2` pages, which hijacks wheel/touch and applies it to the (scroll-locked) page, so
    a nested scroll region silently won't scroll without that attribute.
  - **Touch gestures (in the modal) are gated on a coarse primary pointer**
    (`matchMedia('(pointer: coarse)')`, mirroring `usesCylinderGeometry`), not on the `sm` width
    band — so tablets at md (≥768) get them too. A per-gesture axis lock (`AXIS_LOCK_PX`)
    splits horizontal **swipe → prev/next** (warp preview during the drag, cross-warp on commit)
    from a vertical **pull-down → dismiss** (finger-tracked `translate`+`scale`, commit flies the
    card back from where it was released; upward drag is clamped to 0). matchMedia-less → no
    gestures. The gesture code transforms the canvas, not the chrome, so it's layout-agnostic
    across the sm scrim and the md full-height panel.
- **Near-camera dissolve: the card bursts into its own tiles** (`createCardScatter`,
  quote-particles.js). Across the near band (`bp.NEAR_FADE_START` → `NEAR_FADE_END` card-heights of
  depth) `placeSphereCard` hides the card and lists it with its dissolve `d = 1 − proxFade`;
  `afterCards` draws it as one `Points` draw of the quote particles' shaders in scatter mode
  (`uScatterP = d`). So both layers break up into the same tiles, sampling the real card texture
  through a per-pixel ray (pixel for pixel the card at `d = 0`). Each tile detaches at a mostly random
  time, with the far side's light rim lead (`EDGE_LEAD`), all within `SCATTER_SPAN` of the band, so
  the whole card turns to dots together and disperses as one. Each tile flies out from the card's
  centre and the view's (past the camera), at its own speed and a small random angle. Over its flight
  `t` the distance eases in and out to `PULL_BP[band].expand`, the tile shrinks to a fraction of its
  cell, and the opacity fades out well before `d = 1`. A tile stays a square, contiguous with its
  neighbours, until its own detach, then rounds into a dot early in its flight. The shape of these
  curves lives in `POINTS_VERT`'s scatter branch.
  - **A pure function of the card's state.** Tile positions are card-local (`aUv` on the plane of
    the card's live `matrixWorld`) and their progress is the card's own `d`, so spin, drag and scroll
    in either direction re-evaluate them; nothing is snapshotted, nothing can strand.
  - **One shared geometry.** Every card uses the same grid, sized so a tile is `NEAR_TILE_PX` CSS px
    at the band's start; each dissolving card only adds a material slot (pooled) and a draw. The
    program is compiled at init (`warm`), not on the first band frame.
  - Reduced motion never reaches the band; without a scatter the card would just fade.
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
  - **Why capped, not a free trackball.** Trackball roll is path-dependent, so curved drags
    accumulate tilt that never self-cancels (a closed input loop isn't a closed orientation loop).
    Clamped Euler makes orientation a pure function of `(pitch, yaw)`: roll returns to 0 whenever
    pitch does, bounded by `|roll| ≤ |pitch| ≤ 60°`. That self-correction is the reason for the cap;
    don't restore a blanket clamp, drop the roll, or hard-switch the cap without re-breaking polar
    centring, uprighting, or the smooth exit.
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
    keyboard browse never hits it).
- **Two independent axes: viewport WIDTH and INPUT PRECISION** — resolved separately, never
  conflated.
  - **Width** (`resolveBP`, 768px) picks the render profile: card count, grid dims, sphere
    radius, camera Z. `sm` | `md`.
  - **Shape** (`usesCylinderGeometry`) picks cylinder-vs-sphere on an OR: **`sm` width OR a coarse
    primary pointer** — both independently rule out a sphere (a small viewport can't frame one;
    yaw-only drags can't reach its poles). Constants live in the `YAW_ONLY_GEOMETRY` overlay.
  - **Why split** — the shape constants exist only because a yaw-only drag can't change a card's
    latitude. **Do not key them to width**: an **iPad Pro is ≥768px (`md`) but drags with touch**,
    which leaves 7 of its authored cards permanently >60° oblique. Use `(pointer: coarse)` (the
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
  Layout is cylindrical **masonry**: fixed columns around the circumference, cards packed down each.
  - **Uniform WIDTH fixes alignment; varying HEIGHT is the effect.** Width = column width (columns
    read as true verticals); height follows each image's native aspect (the stagger) — which is why
    this path never needed an equal-area dial. `CYL_ASPECT_CAP` stops one panorama dominating a
    column: past the cap the card is laid out at the *clamped* aspect and `applyCardFit` crops the
    overflow (one `coverFit` call drives the crop and the corner SDF, so they cannot disagree). The
    cap is a **guard against pathological input**, not a house style — the masonry packs any aspect
    inside it losslessly, so it is sized to clear the authored set (`1.9` vs a widest 1.79 and a
    tallest 1/0.57 = 1.75) and nothing real is cropped in the barrel. Re-run the column solve before
    lowering it — the cap changes what is cropped without necessarily changing the layout.
    Without that crop a 3:1 image would be **squashed to half its width** in the wall — the barrel
    scales the plane per card, it does not letterbox. **The two gaps are separate dials.**
    `CYL_COL_GAP_RATIO` is the COLUMN gap and also sets card width (= pitch / (1 + ratio)), so lowering
    it *grows* the cards — pitch is fixed by the column count, and the gap comes out of the card.
    `CYL_ROW_GAP_RATIO` is the ROW gap, a fraction of that same card width, and is the only one free
    to move without resizing anything.
  - **Packing: LPT seed, then swap descent** (`balanceColumns`). Longest-processing-time-first fills
    the shortest column, then pairs of cards in different columns are swapped while that lowers
    `Σ(column load)²`, which holds column spread near 3–10% (LPT alone leaves 17–24%). Free to
    reorder: authored order carries no spatial meaning and modal prev/next walks card *index*. Each
    column's stack is centred about y=0.
  - **The swap test is a closed-form delta, not a recomputed cost.** Swapping `i,j` across columns
    `a,b` moves `d = h[i] − h[j]` between them, so `Δ = 2d(load[b] − load[a] + d)` and the guard is
    just its sign. Cost strictly decreases per accepted swap and is bounded below, so it terminates
    on its own — `BALANCE_PASSES` is a ceiling that is never reached (3–5 actual). `O(passes·n²)`,
    0.2 ms at n=24. Equal heights give `d = 0` and swap out by the same test.
  - **A single-card move pass would be dead code.** LPT's output is already move-optimal, so
    re-homing one card never improves on it — every gain comes from swaps. Swaps preserve each
    column's card *count*, which is why the LPT seed matters and a round-robin one will not do: with
    bimodally extreme aspects the balanced answer needs uneven counts, and only the seed can set
    them.
  - **Within a column, cards sit in index order.** The offset loop walks `i` ascending per column,
    so the packer's tallest-first sequence does not leak into vertical position.
  - **Column count is DERIVED** (`CYL_COLS_FIT`, the wall-HEIGHT dial): fewest columns whose tallest
    fits that fraction of frustum height (must scale with count). The shared default is in
    `YAW_ONLY_GEOMETRY`; **sm overrides it lower** (`BREAKPOINTS.sm.CYL_COLS_FIT`) — iPad's md
    cylinder keeps the shared one. The solve does **not** return the count — the rotate buttons
    recover it from the cards' distinct yaw-deltas instead (see Globe controls), so the layout keeps
    returning a flat placements array.
  - **Barrel size is the RADIUS** — the width lever. The wall sizes against the centre-plane frustum,
    but viewers see the FRONT cards at the near radius, magnified
    `CAM_Z_SPHERE / (CAM_Z_SPHERE − SPHERE_R)`. sm runs a much smaller `SPHERE_R` (less near magnification) so
    the barrel clears a narrow phone's screen edges, paired with `CYL_COLS_FIT` for height.
  - **`CYL_BULGE` barrels the wall** — `r = R·(1 − bulge·t²)`, `t = 2y/wallH` — so the
    silhouette curves like a globe while every column keeps a constant azimuth (still projects to a
    vertical line; only radial displacement). Costs ~9° normal tilt on sm / ~14° on md.
    **Its safe ceiling is coupled to `CYL_COL_GAP_RATIO`**: the inter-column chord shrinks with `r`
    while card width doesn't, so the top/bottom rows are where columns collide. Clearance there is
    `2R(1−bulge)·sin(π/cols) − cardW·cos(π/cols)`, and at `CYL_COL_GAP_RATIO` 0.20 it is only ~0.46 on
    sm / ~0.19 on md-touch — near zero already. Widening cards by lowering `CYL_COL_GAP_RATIO` spends
    that margin directly: at 0.10 it goes to −0.64 / −1.27 and the corner rows overlap. Tighten rows
    with `CYL_ROW_GAP_RATIO` instead, or drop `CYL_BULGE` (≤0.138 buys back zero clearance at
    ratio 0.10, ≤0.105 buys 0.5). `0` is an exact cylinder. The layout returns a per-card **`normal`**
    and `buildCards` aims each card along it (target = `pos − normal`, since `lookAt` points local +Z
    from target toward eye) — a plain `lookAt` at the axis would ignore the slope.
  - **Near-camera fade bands off ONE wall-wide height** (`fadeRefH`, the mean `sphereWorldH`,
    recomputed alongside `dragFlipZ`) — **not** each card's own height, and not `bp.CARD_H_SPHERE`
    (only the `PlaneGeometry` base on this path). A per-card height makes the trigger a function of
    *size* while the metric is *depth*, and on this layout those fight: heights span ~2.4×, so a tall
    card starts dissolving ~2.4× farther out than a short one at the same azimuth. Since `pack` places
    **tallest-first at `offset = 0`** — the top of each column — the tall cards ARE the top row, so the
    top row goes first and the physically nearest card often goes last. One shared band gives the read
    the fly-through wants: nearest goes first, and since a barrel column shares one azimuth
    (hence one `z`), the whole column — top, middle and bottom — comes apart together. The cost is
    that a tall card is a bigger share of the frame when it finally vanishes; `NEAR_FADE_START`/`_END`
    are the dial if that goes too far. `dragFlipZ` uses `fadeRefH` too, so the flip still lands
    exactly where cards vanish.
  - **Drag-flip threshold is DERIVED, not `SPHERE_R`** (`dragFlipZ = maxRadial + NEAR_FADE_END ×
    CARD_H_SPHERE`, in `buildCards`, read by `updateActiveCamera`). Once the camera is inside the
    shell the far wall moves opposite the same rotation, so the drag delta is negated. Firing at the
    geometric wall (`SPHERE_R`) drifts from the dissolve distance whenever card heights change; tying
    it to the fade keeps the flip aligned. `maxRadial` is radial (rotation-invariant); `sphereGroup.
    scale` (RM shrink) folded in; capped at `CAM_Z_SPHERE × DRAG_FLIP_MAX_CAM_FRAC` so it
    can't fire at zoom start; gated on `zoomT > 0`.
  - **No roll jitter here** (columns lining up *is* the effect). **`CARD_FACE_CAMERA` is nonzero on the barrel** — on
    a barrel it buys limb legibility at the cost of the curve (below).
  - **Not a masonry sphere:** masonry needs a developable surface. Meridian columns on a sphere
    project to curves, so in-column alignment breaks, and a 0.7 band holds only ~2 cards/column while
    reintroducing latitude obliquity.
- **Density + facing pass** (full-sphere path; fixes the "edgy / unevenly distributed" read). Adding
  cards doesn't help — nearest-neighbour spacing is already even at N=24 and worsens with more cards
  (foreshortening variance). Four independent levers:
  - **Edge-on slivers → `CARD_FACE_CAMERA`** (nonzero on the cylinder via `YAW_ONLY_GEOMETRY`, `0`
    on the full sphere, which faces cards radially outward by definition). A
    radial card's obliquity equals its angular distance from front-centre, so limb cards render as
    lines. `applyCardFacing` turns each card partway toward the camera (slivers 5→0, worst obliquity
    81°→41°). Must be **per-frame** (a baked tilt rotates away from the camera). The target is
    `sign(n.z) × viewDir`, not `viewDir` (a uniform blend toward +Z rotates a back card to
    perpendicular — a new sliver). The effect must **fade to zero at edge-on** or the 180°-apart
    targets teleport a card up to 63° as `normal.z` crosses 0: `FACING_EDGE_ON_BAND` (in
    `|normal.z|`) smoothsteps `k` to 0 across edge-on (max per-frame change 63.3°→1.9°); widening
    past ~0.35 eats the limb correction. Applied at **three** sites that must agree or the card
    snaps: `placeSphereCard`, `snapCardToSphereSlot`, and `placeFoldingCard` (scaled by `fdE` so it
    eases in over the fold, continuous with the sphere branch).
  - **Why the barrel runs `0.10`.** The full-sphere path is `0`, so this dial only ever runs on the
    cylinder, where it fights the geometry as much as it helps. Raising it produces two coupled
    symptoms — cards "popping up" as they face the camera, and appearing to spin on their own near the
    limb. Both come from this one dial: the tilt is a full 3D re-aim, so it partly cancels each card's
    *vertical* slope (the one `cylinderMasonryLayout` computes so cards sit flush on the bulge), and
    it unwinds much faster than it winds up once `|n.z|` enters the edge-on band. On the sm barrel,
    both costs scale linearly with the dial; only the snap responds to the band:

    | `CARD_FACE_CAMERA` / `FACING_EDGE_ON_BAND` | maxSnap °/° | front pitch err | limb width |
    | --- | --- | --- | --- |
    | `0` (true barrel) | `0.00` | `0°` | `1.00×` |
    | **`.10` / `.25` — shipped** | `0.81` | `−1.24°` | `1.33×` |
    | `.10` / `.45` | `0.40` | `−1.24°` | `1.33×` |
    | `.20` / `.45` | `0.80` | `−2.47°` | `1.64×` |
    | `.35` / `.25` | `2.84` | `−4.33°` | `2.07×` |

    Widening the band is close to free — it buys back snap without touching limb width, since the
    pitch error is set by the dial alone — and `FACING_EDGE_ON_BAND` is safe to retune because no
    sphere path reads it. To zero the pop while keeping limb width, make the re-aim **yaw-only** here
    (project `cardNormal` into XZ before `setFromUnitVectors`); the geometry is yaw-only anyway.
  - **Card SIZE is equal-AREA on the sphere path, not equal-height.** `sphereCardScale` splits the
    native aspect across both axes — `sX = √(srcAspect / CARD_ASPECT)`, `sY = 1/sX` — so `sX·sY`
    is exactly 1 and every card covers the same solid angle regardless of aspect. Fibonacci slots
    are isotropic, so equal-*height* sizing would put all of the aspect into width and let a 16:9
    card cover 2.5× a portrait one. Two sites write it (`buildCards`, and `updateCardSphereSizing`
    once a texture reveals the real aspect); both go through the helper, and `modal.js`'s close
    target reads the fields live. The yaw-only path is unaffected — the masonry solves real `w`/`h`
    per slot.
  - **Sparseness → `BREAKPOINTS.sm.CARD_H_SPHERE`** (sphere path only). Coverage scales with **H²**, so
    size is a far stronger lever than count and adds no textures/draw calls. Net ~42% of the sphere
    face.
  - **Sphere sampling is cell-centred** (`fibSpherePos`: `y = 1 − (2i + 1)/n`) — symmetric about the
    equator, and **no card lands on ±Y**. That second property is load-bearing and non-local:
    `buildCards` orients sphere cards with a world up, and `Matrix4.lookAt` degenerates when the
    normal is parallel to it, taking that card's roll off Three's 1e-4 fallback nudge instead. The
    most polar card sits 16.6° out at n=24 and 9.1° at n=80 — `|cross(up, normal)| ≥ 0.16` across
    that range, so world up needs no pole special-casing.
  - **Scatter → `CARD_ROLL_JITTER`** (radians, the roll spans ±half its value). Per-BP, and much
    tighter on sm: at that sparsity md's spread reads as debris, while md keeps the collage
    character.
- **Drag physics — position-driven while held, velocity-driven once released.** The two halves of a
  drag want different inputs, so the shared `drag` object carries both and `updateSphereRotation`
  picks one per frame:
  - **`pendingX`/`pendingY` — exact unapplied travel (rad).** `interaction.js` *accumulates* every
    `pointermove` delta into it; the core **drains it every frame** (unconditionally, even while
    frozen, so it can't pool and dump on resume) and, while `isDragging`, adds it to `sphereOrient`.
    The surface therefore tracks the pointer **1:1 with no smoothing lag**, and no travel is lost
    when several moves land in one frame.
  - **Jerk limiter — the held step is capped at `MAX_VEL`, the remainder stays banked.** Exact 1:1
    can't be the whole story: Chrome coalesces `pointermove` to one event per frame, so a fast flick
    arrives as a *single* several-hundred-pixel delta, and applying it whole rotates the globe tens
    of degrees in one frame — indistinguishable from a dropped frame. Any step under one frame's
    worth of rotation (`MAX_VEL × dtScale`) passes through **untouched**, so ordinary dragging keeps
    its exact tracking; past that the step is rate-capped and then eased down by `DRAG_CATCHUP` as
    the backlog shrinks, with the rest left in `pendingX` for the following frames. Nothing is
    discarded, so total travel still matches the pointer: a 500px single-event jump spreads over
    ~7 frames instead of arriving as one ≈1000°/s rotation. On release the backlog is dropped and `velX`
    — clamped to the same `MAX_VEL` — takes over, so the handoff is continuous.
  - **`velX`/`velY` — an EMA of pointer speed (`VEL_SMOOTH_MS`), in rad per 60fps frame.** This
    is the **release inertia**, and also every drag-driven CA/warp amplitude (normalized by
    `MAX_VEL`). It must be sampled **by elapsed time, not per event** (`flushVel`). Taking `velX`
    from the last event's pixel delta makes release velocity a function of the pointer's event rate —
    ~16× apart between a 60Hz and a 1000Hz pointer for the identical hand motion — and since Chrome
    coalesces moves to rAF while Safari does not, the momentum then differs by browser. Moves sharing
    a millisecond bank into
    `sampX`/`sampY` rather than dividing by a zero dt.
  - **The idle gap before release is part of the measurement.** `endGesture` flushes the EMA one
    last time with nothing banked, so *slowing to a stop before lifting* decays the inertia toward
    0 (a gap of a few `VEL_SMOOTH_MS` time constants is effectively a stop) instead of flinging on a
    stale sample — and *the sample being stale the other way* (a still hold sends no move event, so
    the old `velX` kept its pre-pause value) can't fling either. Both were the "sometimes it stops
    dead / sometimes it lurches" bug.
  - **Everything per-frame is rescaled by `frame.dtScale`.** Unscaled, a per-frame decay coasts for
    half as long on a 120Hz display as on a 60Hz one — the same code, half the feel. The convention
    is file-wide, not drag-only, and takes one of two forms:

    | Form | Applies to |
    | --- | --- |
    | `rate × dtScale` (linear) | velocity/ambient-spin integration, `REVEAL_RATE`, `MASONRY_MORPH_RATE`, `HINT_EXIT_RATE`, `navNudge.frame` |
    | `1 − (1 − rate) ** dtScale` (exponential ease) | `HOVER_RATE`, `SPHERE_DRAG_WARP_EASE` |
    | `rate ** dtScale` (exponential decay) | `DRAG_FRICTION`, `PITCH_RELAX`, `DRAG_CATCHUP`'s backlog term, `MODAL_WARP_DECAY` |

    Coast time constant is `−FRAME_MS / ln(DRAG_FRICTION)` ms, independent of refresh rate. **No
    rate in the block is frame-locked**, `modal.js` included: `updateAnimation(sphereRotActive,
    dtScale)` carries the scale in for `MODAL_WARP_DECAY`, and everything else there is time-based
    off `performance.now()`.
  - **Ambient spin is a separate additive term, never a bias folded into `velX`.** Folded in, it
    *brakes* a leftward coast while extending a rightward one, so inertia decays asymmetrically by
    drag direction. `AUTO_ROT_SPEED` is a true rate: accumulating an increment against friction
    instead would amplify it by `1 / (1 − DRAG_FRICTION)` (≈17× at the friction in code), so if you
    port a value from git history,
    multiply by that factor.
  - **Gearing is derived, not a baked rad/px** (`dragSensitivity()`, injected as
    `getDragSensitivity` and re-read per move). True 1:1 surface tracking is **90° per on-screen
    ball radius** (`SPHERE_R × H / CYL_FRUSTUM_H` px), and `bp.DRAG_GEARING` is a fraction of that:
    geared down on **sm**, where the barrel is only a couple of hundred pixels wide and 1:1 would
    whip it past half a turn per swipe. Deriving it keeps the feel constant across window sizes: a
    bigger ball on screen needs *fewer* rad/px, which one fixed number gets wrong in both directions —
    over-geared on a tall desktop window, under-geared on a phone. Drag by the ball's on-screen radius
    and it turns `90° × DRAG_GEARING`.
  - **`SPHERE_INTERACTIVE_T` is 0.94, not 0.8, because 0.8 is ahead of every card.** Cards land
    between `sphereFormT` 0.883 (the first) and exactly 1 (the last — its fold end *is*
    `SPHERE_FORMED_PROGRESS`). At 0.8 the drag spins a swarm still mid-assembly while a tap is refused
    on cards that already read as part of the globe — both sides of the same gate, wrong in opposite
    directions. 0.94 sits just past the first landing: something is on the shell to grab and to click.
    ONE constant for **everything** that says or does "the globe is live":
    hover, click, drag, auto-rotate, the `grab` cursor, and the GL hint plane's entrance. Do not give
    the cursor its own earlier gate: it puts the affordance 26vh ahead of the input it advertises.
    Raycasting is not the constraint at any value: a tap below the gate still hits, and
    `onPointerUp` discards it.
  - **Hover uniforms are applied in `updateCardTransform`, not `placeSphereCard`** — that gate is
    global, `fdE` is per-card. Between `sphereFormT` 0.9 and 1 the late-staggered cards sit at `fdE`
    0.999: seated to the eye, but routed to `placeFoldingCard`, which sets `opacity = 1` so they pick,
    show `cursor: pointer`, and open on click. If the hover warp is applied in `placeSphereCard` those
    cards raise `hoverT` and render nothing. `placeSphereCard` only adds `sphereDragWarp`;
    `placeFoldingCard` applies `hs` so nothing pops at `fdE` 1.
  - **Inertia coasts below `SPHERE_INTERACTIVE_T`; only `SPHERE_ORIENT_RESET_T` zeroes it.**
    Hard-zeroing at the interactive gate stopped a released spin dead whenever the page was still
    settling across it. A drag *started* below the gate stays inert and can't fling on release, and
    `stopTicker` retires inertia outright (it can't coast while the loop is parked).
  - **Gesture ownership is `activePointerId`, not `hasPointerCapture()`**, so the tap test does not
    depend on *when* the browser releases capture relative to `pointerup`. `pointercancel` →
    `cancelDrag` (no inertia, no tap — routed to `onPointerUp` a cancelled press passes the tap test
    and opens a card); `lostpointercapture` → `endGesture`, a no-op after a normal release and a
    clean exit on a genuine loss (rather than leaving `isDragging` latched true forever).
- **Touch gesture arbitration — yaw-only, via a directional axis lock** (`interaction.js`). On
  touch a vertical drag *is* the page-scroll gesture, so touch gets **yaw only** (horizontal spins,
  vertical scrolls); pitch (`drag.velY`) is written only when `!isTouchDrag && !getYawOnly()` — i.e.
  a mouse on the sphere. `touch-action: pan-y` alone isn't enough
  — moves before the browser commits to the pan leak a pitch kick — so the axis is resolved in JS
  from the first `AXIS_LOCK_THRESHOLD` of travel, then **latched** for the gesture (a curved
  swipe can't flip axes; a 45° tie resolves to vertical). `isTouchDrag` is per-gesture from
  `e.pointerType`, so a touchscreen laptop locks finger input but keeps mouse pitch **on the sphere**
  (its mouse still yaws-only on the barrel, since pitch follows geometry).
  - **Taps aren't gated on the lock** — `CLICK_MAX_MOVE` > `AXIS_LOCK_THRESHOLD`, so a jittery
    tap may have latched an axis; `onPointerUp`'s independent distance/time test keeps tap-to-open
    unchanged.
  - **The lock gates `onDrag()`** — the retirement call sits after the axis-lock early return in
    `onPointerMove`, so a vertical swipe that is really page scroll never retires the hint layer.
  - **Both canvases are `user-select: none` + `-webkit-touch-callout: none`** (`.css`). A long press
    on iOS Safari otherwise selects the canvas as a replaced element — blue overlay, Copy callout —
    and the selection takes the pointer away, so WebKit fires `pointercancel` and `cancelDrag` drops
    the in-flight spin. Scoped to the canvases, so the quote and the modal copy stay selectable.
  - No dwell needed: touch scrolling is self-terminating, so on lift the sphere is stationary and
    `sphereFormT >= 0.8` holds — scroll and spin are mutually exclusive in time. (How easy it is to
    *land* on the pristine formed globe is a pacing matter — see Open items.)
- **Typography rides Milo's S2A type system.** Display/body copy carries the standard `heading-1` /
  `body-lg` / `body-md` classes (added in `buildMarkup`), which supply responsive
  size/line-height/letter-spacing; `globe-gallery.css` sets only family (`--heading-font-family` /
  `--body-font-family`), weight (`--s2a-font-weight-*`), colour, and margins on top.

## Tuning reference

> **One home per number.** A value is written **once, at its definition in code**. This file and the
> code comments name the constant and say what it *means*, its *unit*, and how to derive a human
> figure from it (`rad/frame × 60 × 180/π = °/s`) — never the value itself, and never a figure
> computed from it. Anything else goes stale the first time someone tunes the dial, silently, in a
> place the tuner never opens. Per-band knobs are cited as `BREAKPOINTS.<band>.<KEY>`; read the
> live values out of the source (`globe-gallery.js` module scope, `src/timeline.js`, or the
> per-module blocks in `interaction.js` / `modal.js` / `shaders.js`).
>
> Three deliberate exceptions: **sentinels**, where the number *is* the meaning
> (`CARD_FACE_CAMERA` `0` = faces radially outward); **cross-system contracts**, where the
> number is the interface, not our choice (the 768px Milo band split, the 456/631 card aspect, c2's
> z-index tiers); and **worked examples** — the memory budget, the sizing reality check, the event
> table's `vh`/`progress` columns — which are snapshots measured at the values in code when written.
> Those carry the formula that produced them, so re-derive rather than trust the figure.

The module-scope constants are the core's tuning surface, split by kind: **scroll timing** (phase
constants, entry ramp, and every threshold) lives in `src/timeline.js` — see Lifecycle timeline —
and the **visual/physics** constants below stay in `globe-gallery.js`. The ones whose role isn't
self-evident from the name:

| Constant(s) | Unit | Role |
| --- | --- | --- |
| `DRAG_FRICTION` | per 60fps frame | velocity decay after a drag release (spin coastdown); applied as `** dtScale`. Coast time constant = `−FRAME_MS / ln(FRICTION)` ms — see Drag physics |
| `MAX_VEL` | rad per 60fps frame | one speed ceiling for both the fling and a held drag's step (`× 60 × 180/π` for °/s); also the normalizer every drag-driven CA/warp amplitude divides by |
| `DRAG_CATCHUP` | share per 60fps frame | how fast an over-`MAX_VEL` backlog is worked off (jerk limiter). Higher = snappier catch-up after a flick, lower = softer |
| `AUTO_ROT_SPEED` | rad per 60fps frame | ambient yaw drift when not dragging / browsing — added alongside `velX`, never into it |
| `DRAG_GEARING` (per band) | fraction | pointer→rotation gearing as a fraction of true 1:1 surface tracking; `dragSensitivity()` turns it into rad/px off the live viewport. `1` = the surface follows the pointer exactly |
| `VEL_SMOOTH_MS` (`interaction.js`) | ms | time constant of the release-velocity EMA |
| `HOVER_RATE` | per 60fps frame | ease toward the hover target, applied as `1 − (1 − RATE) ** dtScale`; reaches 80% in `ln(0.2) / ln(1 − RATE)` frames |
| `CA_STRENGTH` | UV | radial shift per channel at transition peaks (bell curve) |
| `CA_MOTION_CAP` (per band) | UV | directional (motion-trail) shift max, resolved into the profile as `bp.CA_MOTION_CAP` from `CA_MOTION_CAP_SM`/`_MD`. Amplitude is `sqrt` of the scroll/drag speed ratio (see `SCROLL_VEL_MAX`), not the ratio itself. The explicit `cap` argument still overrides it, so `modal.js` is unaffected |
| `SPHERE_DRAG_CA_MUL` | uCA per unit of `sphereDragWarp` | adds to `uCA` while spinning the sphere, on top of the transition bell and hover terms |
| `SCROLL_VEL_MAX` | px/frame | scroll speed that saturates the motion-trail amplitude. Since the canvas-wide filter was removed this is the **only** thing in the block gated on scroll speed, so an artefact that appears solely on a fast scroll is the motion trail |
| `GRID_PEEL_JITTER` | fanT | per-card random offset on the peel delay (organic cascade); `2 × GRID_PEEL_STAGGER` |
| `ARC_DENSE_SPLIT` | fanT | boundary between the clustered off-screen flank and the visible spread |
| `NEAR_FADE_START` / `_END` | card-heights | depth in front of the lens where the near-camera dissolve starts / completes |
| `ZOOM_EASE_POW` (`timeline.js`) | power | the dolly's ease-out; `camZAt`/`pAtCamZ` (quote-particles.js) and the shaders' `camZAt` read it |
| `GRAIN_CELLS` (`shaders.js`) | per card height | the texture-ready reveal's RGB grain grid, laid out in the card's OWN uv (× `uAspect`, so cells stay square and travel with the card rather than swimming in screen space) |
| `SPHERE_DRAG_WARP_BASELINE` / `_VEL` / `_MAX` / `_EASE` | uWarp, last per 60fps frame | barrel-warp while dragging: constant baseline + a velocity-driven burst (decays with `DRAG_FRICTION`), capped, then eased toward that target |
| `TEXT_BEHIND_GAP` | world units | how far the hint plane sits behind the sphere's back surface |
| `TEXT_WARP_ENTER_MAX` | uWarp | at the hint's entrance (barrel distortion) |
| `TEXT_CA_WARP_MUL` | × | warp-driven CA boost on the hint text (entrance only — the plane is inert to drag) |
| `TEXT_WARP_OVERFLOW` | mesh scale per uWarp | extra scale so letterforms bleed off-screen |
| `ROTATE_STEP_FRAMES` / `ROTATE_DEADZONE` | 60fps frames / fraction of a column pitch | one rotate-button press: the `navNudge` tween length, and how close to a column boundary counts as already there — see Globe controls |

### Pull-quote particle constants

`quote-particles.js`; `p` is the flight progress 0 → 1.

| Constant(s) | Unit | Role |
| --- | --- | --- |
| `PULL_BP` (per band) `startR` / `expand` / `count` | sphere radii / × offset from the card centre / particles | camera position in front of the centre at the hand-off; how far near-burst tiles fly; quote particle count |
| `FLY_VH` / `READ_VH` | viewport heights | scroll the quote flight takes (`p` 0 → 1); still-quote scroll before the world lets go |
| `HANDOFF_EASE_T` | zoomT | hover lift and drag warp ease to 0 over this before the hand-off |
| `SWAP_MS` | ms | the DOM quote's fade-in over the finished canvas quote |
| `DEBOUNCE_MS` | ms | how long a new layout or view must hold before the raster re-runs or a flight in progress re-pairs |
| `NEAR_TILE_PX` | CSS px | near-camera scatter tile size at the band's start |
| `FLIGHT` | p | `arriveStart` / `arriveSpan`: landing order 0 → 1 lands across this window; `release` and `depart`: [start, spread]; `minFly`: shortest flight |
| `SETTLE` | p | window in which a region's particles hand over to the crisp text |
| `SWIRL_AMP` / `_SCALE` / `_DRIFT` | share of the short side / share of the short side / noise units | largest swirl displacement; swirl flow feature size; how far the flow evolves over the flight |
| `TILE_CAP` | CSS px | largest tile sprite |
| `INK_ALPHA` | raster alpha | lowest alpha that counts as a target pixel |
| `RASTER_PAD` | CSS px | margin rasterized around the figure |
| `PROBE` | grid cells per side | probe grid for a card's on-screen area |
| `DST_SPACING` | × target spacing | landed dot size |
| `PAIR_BANDS` | bands | x bands of `coherentOrder` |
| `SOFT_Y` | share of height | vertical sort-key noise of the soft pairing; the horizontal noise is one pairing band wide |
| `SOFT_SWAP` / `SOFT_SWAP_SPAN` | share of ranks / share of all ranks | ranks that trade sources with a nearby rank, and how near |
| `SEED` | | seed of every random draw, so a scroll position always looks the same |

- `aRand` is (departure p, release p, unused, arrival p).
- The raster puts a run's baseline one ascent below its Range box top: a Range box is the font's
  content area.
- `sortBy` packs (quantized key, index) into one double with 2²⁰ index slots, so a set holds at most
  2²⁰ points.

### `timeline.js` constants

Most of this file's exports are documented where they matter: the `P_*` phase constants and
`FOLD_PEEL_OVERLAP` under Phase constants; the runway split under Scroll model;
`ENTRY_LEAD_VH` / `ENTRY_RAMP_VH` under Entry timing; and
every gate threshold in the Lifecycle timeline event table. The remainder — carried in code as
bare names — are:

| Constant | Space | Role |
| --- | --- | --- |
| `ENTRY_ROT_MAX` | radians | arc sweep-in rotation at each card's launch; its `entryRot` decays from it, and `updateCardTransform` divides by it to renormalize that card's entry CA. Also the dial for entry gap size — it scales every pair equally |
| `ARC_ENTRY_STAGGER` | `arcCopyEntryT` | span of the per-card launch delay; also sets every card's flight window (`1 - ARC_ENTRY_STAGGER`) |
| `ARC_COPY_IN_ENTRY_T` | `arcCopyEntryT` | arc-copy fade-**in** completes here (the fade-out is a fold-window fraction — see Arc-copy fade-out) |
| `SPHERE_ORIENT_RESET_T` | `sphereFormT` | below this a scroll-out resets the sphere orientation **and drag inertia** (a brief dip mid-scroll keeps both) |
| `FRAME_MS` / `DT_SCALE_MIN` / `_MAX` | ms / ratio | the frame every per-frame rate is authored against (`1000/60`), and the clamp on `frame.dtScale` — a stall must not teleport what it drives, a very short frame must not underflow a decay (see Drag physics) |
| `CANVAS_HIDE_MARGIN_T` | offset on `pqAppearZoomT` | the only `zoomT` threshold near the reveal that is still a number, because the canvas is a hard cut rather than a fade and wants slack: it is dropped (and the draw skipped) this far **past** the point the scene is empty. Hint text and controls take `pqAppearZoomT` itself |
| `GRID_PEEL_WINDOW` | `gridFormT` | `1 − GRID_PEEL_STAGGER`; the span each card's peel occupies after its stagger delay (`frame.gpWin`) |
| `GRID_ARC_RANGE` / `FOLD_WINDOW` | — | derived spans: `PROGRESS_GRID_ARC_END − _START`, and `SPHERE_FORMED_PROGRESS − FOLD_FIRST_PROGRESS` |
| `progressAtFormT` | — | maps a `sphereFormT` back to progress; used to derive `ARC_COPY_OUT_START` / `_END`. Nothing here exists only for docs — Milo ships these files unbundled, so a doc-only export is pure payload (the `zoomT` inverse lives in the derivation snippet instead) |

## Tests

Browser unit suites, run with `npm run test:file -- <path>` (`@web/test-runner` + chai + sinon;
Playwright is only the browser launcher, never a test API).

`test/c2/blocks/globe-gallery/globe-gallery.test.js` covers the authoring helpers,
`parseAuthoredContent` (row order, the fragment cell, the pull quote, N=0 and N=1),
`fetchFragmentCards`, `buildGlobeDom`, `math.js` (easing endpoints, the arc/CSS↔WebGL bridge,
`clamp01`'s NaN→0 contract), `timeline.js` clock endpoints, `controls.js`, and the `a11y.js`
keyboard gallery.

`test/c2/blocks/globe-gallery/globe-gallery-interactive.test.js` covers `interaction.js`
(click-vs-drag, the touch axis lock, `onDrag` once per gesture, cursor ownership through
`applyCursor`), `cursor.js` (state transitions, retirement fade, label placement), `materials.js`
(card texture load and fallback, `loadModalTexture` adoption/error/stale disposal, hint texture
orientation and canvas release), `modal.js` DOM behavior, and the quote-layout and fragment edge
cases.

`test/c2/blocks/globe-gallery/quote-particles.suite.js` is the particle suite (raster, sources,
pairing, landing order, the DOM swap, the near burst), shared with firefly-globe: each block's
`quote-particles.test.js` runs it against its own module, class names and stylesheet.

`mocks/authored.html` and `mocks/fragment.html` are the authoring contract as fixtures, loaded with
`readFile` from `@web/test-runner-commands`. The fragment mock mirrors the DA card shape: metadata
before the image, badges as `<li>` with an SVG link plus a product link, image in `<p><picture>`.

Constraints when adding cases:

- **The modal suites run without a WebGL context.** `modal.js` only constructs a renderer when the
  modal canvas exists, so the tests make that lookup return `null` and drive
  open/close/navigate/populate/destroy as plain DOM. `close()` defers cleanup by `modalAnimMs`, so
  those cases need `sinon.useFakeTimers()`, and `close(viaPointer)` is a no-op within 200ms of open.
- **`libs/deps/three.js` does not export `MeshBasicMaterial`.** Build test meshes with the block's
  own `createCardMaterial({ texture, aspect })`, which proxies `opacity`/`map`/`needsUpdate` onto the
  shader uniforms.
- **Assigning `scrollTop` does not stick on an unlaid-out element.** The overflow-fade cases define
  it with `Object.defineProperties` alongside faked `scrollHeight`/`clientHeight`.

Not covered: per-frame transform and easing values, which are left unasserted so tuning passes don't
break the suite; and the WebGL path, which has no Nala/E2E.

## Open items / backlog

Known follow-ups, not blocking this integration branch:

- **No E2E coverage.** Unit coverage landed (see **Tests**), but there is still no Nala/E2E pass over
  the WebGL path, and the per-frame scroll choreography is only verified by VQA.
