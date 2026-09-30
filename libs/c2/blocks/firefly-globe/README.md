# firefly-globe — C2 block

A simplified fork of `libs/mep/ace1209/globe-gallery`. The sphere, drag/inertia, hover, near-camera
fade, modal, on-canvas controls, keyboard/a11y path, pull-quote and reduced-motion handling are the
same code with the class prefix renamed. **Everything not listed under "What is different" is
documented in the globe-gallery README, and that document is the spec for this block too.** Keep the
two in sync when a shared fix lands in either.

Editing conventions are the globe-gallery ones: prose in the README, code comments only as contract or
as a hazard at the exact line an edit would break. Files ship unminified.

## What is different

| Area | globe-gallery | firefly-globe |
|---|---|---|
| Entry | Arc → grid → fold cascade on scroll (`timeline.js`, `math.js`, ortho camera) | Sphere already formed; camera eases in (`entryT³`, gg's fold curve) from `CAM_Z_ENTRY` to `CAM_Z_SPHERE` while the block scrolls in, landing at the travel's starting speed as the world pins. |
| Camera | `camZAtZoomT(zoomT)` from `timeline.js` | Same curve, `camZAtTravelT(scrollT)` from `src/utils.js`, from the pin. |
| Scroll clock | Six derived clocks (`timeline.js` `deriveFrame`) | Two, from `src/utils.js` `deriveFrame` (same producer/consumer split: `computeFrame` derives, every tick stage reads `frame.*`): `entryT = 1 + (scrollY − blockDocTop) / H` reaches 1 at the pin; `scrollT = (scrollY − blockDocTop) / blockHeight` is gg's `zoomT`, 0 at the pin and 1 when the block has scrolled away. |
| Arc copy pill | Authoring row 1 | None |
| "Click & Drag" text plane | Entrance and fade on `sphereFormT` / `zoomT` | Same plane and `TEXT_FRAG`, clocked on `entryT` / `scrollT` (see below). |
| Custom cursor | Disc + chevron ring + label; native cursor hidden | Label pill only, beside the native cursor (`grab`/`grabbing`/`pointer`). |
| Canvas | `position: fixed`, shown/hidden by scroll range | `position: absolute` inside the sticky `.firefly-globe-world`, so it travels with the block: at `entryT` 0 the sphere is centred in a canvas whose top is at the viewport bottom and rises in with the block, never over the section above. Controls are `absolute` with it. |
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`). Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, CTA to `fireflyUrl`. |
| Three.js | Vendored `three.module.min.js` built by esbuild | Shared `libs/deps/three.js` (r160). A `THREE.*` symbol must be in its export list. |
| Scroll budget | `--gg-runway-height` + `--gg-formation-vh`, per breakpoint | `--fg-runway-height` only, per breakpoint. The entry happens in the viewport before the block top, so the whole runway is travel. |
| CSS custom properties | `--gg-*` | `--fg-*` (block-scoped; nothing outside the block reads them). |
| Tuning | — | `SPHERE_R`, `CAM_Z_SPHERE` and `CAM_Z_END` are tuned per breakpoint for the scroll budget below; `CAM_Z_ENTRY` is the only extra breakpoint field. |
| Opening quote | Measured in canvas, hung with a negative `text-indent` | Wrapped in C2's `span.hang-opening-quote` (`styles.css`: absolute, `translateX(-100%)`), so the mark takes no inline space and is not kerned against the first letter; the letter's advance box sits on the column. Marks: `Ps`, `Pi`, `Pf`, ASCII `"` `'`. A mark ≥ 0.8em or wider than the gutter (`--fg-copy-pad`) stays inline: each quote line is an `overflow: hidden` mask with `--fg-hang-max` (0.8em) of side bleed, so a wider mark would be clipped; a CJK `「` needs both raised. |
| Modules | `math.js` + `timeline.js` | `src/utils.js` (easings, `coverFit`, camera constants, the travel camera pair, `createFrame` / `createFrameInput` / `deriveFrame`). |
| Analytics | `--globe_gallery` | `--firefly_globe`; modal labels keep `--globe_card_modal`. |

## Authoring

Positional rows.

| Row | Content |
|---|---|
| 1 | `categoryId \|\| machineTag \|\| cgenId \|\| ctaLabel`. No `categoryId` renders nothing (`firefly-globe-empty`). `machineTag` (optional) restricts the API query to assets carrying that machine tag (e.g. `acom_ff_globe_assets`); empty means no restriction. `cgenId` appends `&promoid=<id>&mv=other` to every `fireflyUrl`. `ctaLabel` is the modal CTA text; the CTA is hidden for cards without a `fireflyUrl`. |
| 2 | Two cells: the barrel's bottom-row copy (touch hint), then the cursor label. |
| 3 | `instructions \|\| rotateLeft \|\| rotateRight \|\| pauseSpin \|\| resumeSpin \|\| prevCard \|\| {index} of {count} \|\| nextCard \|\| close` — empty parts fall back to defaults. |
| 4 | Optional pull quote: `<blockquote>` (or heading), then name and role paragraphs. No row → no pin. |

API prompt locale: `getConfig().locale.ietf` exact match → language-only key → any same-language key →
`en-US` → first available. The API has no alt text; the prompt (first 120 chars) is the card's `alt`,
so it is the a11y card label and the modal's sr-only image label.

## Image sourcing

`apiAssetToCard` (`src/authoring.js`) ignores the API's `_links.rendition` (a ≤600px preview) and
instead stores a rendition template for the full-resolution DCX `output/resource` component, built
from the asset `id` and the CDN base taken from the preview href (`<base>/rendition/<id>/…` →
`<base>/dcx/<id>/…`):

```
<base>/dcx/<id>/rendition/output/resource/version/0/format/{format}/dimension/{dimension}/size/{size}
```

`fireflyRenditionUrl(card, px, axis)` fills it as a `jpg` (the component serves only `jpg`/`png`;
`webp`/`avif` → HTTP 415) at the requested px. The CDN caps `size` at the component's native
resolution, which the API does not report, so there is no client-side clamp. Cards request by height
at `CARD_TEX_SM`/`CARD_TEX_MD` (384/768); the modal requests its longest side at
`MODAL_TEX_SM`/`MODAL_TEX_MD` (1024/2048), the axis chosen from `max_width`/`max_height`. Textures load
`crossOrigin: 'anonymous'` because the CDN is cross-origin and the cards go through WebGL. See
`FIREFLY-API.md` for the API response the mapping reads.

## Phases

`interactive` (`entryT >= SPHERE_INTERACTIVE_T`, `src/utils.js`) is globe-gallery's gate, on the
entry clock: before it there is no drag, banked drag travel is dropped, no auto-spin, no drag warp,
no hover, and `globeFormed`/`globeLive` are false so the on-canvas controls, cursor pill, tap-to-open
and keyboard entry are all off. It opens while the block is still scrolling in, so the globe spins,
drags and opens cards before the world pins. `sphereFormed` (`entryT >= 1`, the world pinned) is a
separate gate for what must wait for the pin: the travel camera, the entry lift's release, the
inside-sphere drag flip, and retiring the hint (`retireHint`: a drag, rotate or card opened before
the pin leaves the cursor pill and the text plane in place, so both go out together, after the pin).
Reduced motion is always formed and interactive.

The view offset also carries an entry lift (`entryLiftPx`): the top edge of the cards — the barrel's
front face (z = `SPHERE_R`) or the sphere's silhouette (z ≈ 0) — projected at the live camera
distance, is held at the canvas top and released by `1 − entryT²`, so the block scrolls in with no
empty band above the cards and they settle nav-centred as the world pins. `wallTopY` is written with
`fadeRefH` in `recomputeDragFlip`, so it follows the masonry morph.

The spin toggle has two safe positions and `--fg-entry-release` (1 while scrolling in, 0 at the pin)
crossfades between them: `--fg-controls-entry-top` while the world's top edge is still below the nav,
`--fg-controls-top` once pinned and the nav is over it.

The entry value is one `--s2a-border-radius-xl` plus the inset. A section that rounds its corners
overlaps its neighbour by exactly one radius (`margin-block: calc(-1 * var(--s2a-border-radius-xl))`
in `section-metadata.css`) and carries `z-index: 3`, so it paints over this block's first 32px. No
z-index here escapes that: stacking is settled between the two sections, above this block.

From the pin the camera travels through the sphere, so globe-gallery's inside-sphere rules are
unchanged: `cameraInsideSphere` flips the drag direction, and `yawDeltaToCenter` /
`cardCenterYawPitch` default to it. The keyboard focus snap
(`centerCardOnScreen(i, !suppressFocusSnap)`) solves for the outside side; `snapToBrowseView` lands
at `blockDocTop`, the first formed scroll position. Orientation and inertia reset only while not
yet interactive.

Scroll input is `readScrollY()`: Lenis' `animatedScroll` when it agrees with `window.scrollY` within
`LENIS_TRUST_PX`, otherwise `deQuantize(window.scrollY)`, which damps steps smaller than
`SCROLL_JUMP_PX` (an iOS URL-bar show/hide moves `scrollY` by the bar height without a user scroll)
and passes larger ones through. `scrollVel` is the per-frame delta of that smoothed value and feeds
the motion CA trail.

`pqAppearT` is the `scrollT` at which the deepest card has faded out (`−SPHERE_R + cardVanishDepth()`
through `travelTAtCamZ`, gg's `pqAppearZoomT`). At it: the pointer path retires (`globeLive`: drag, hover, on-canvas controls;
the cursor pill fades `CURSOR_RETIRE_LEAD_T` earlier), the pull-quote reveal starts, and the canvas
hides `CANVAS_HIDE_MARGIN_T` later. The keyboard path (`globeFormed`: pinned and modal closed) is
not gated on it.

`--fg-pq-appear-t` is published by JS (`publishPqAppearT`, gg's `publishPqAppearZoomT`); the CSS
fallback covers only the frames before the script runs. gg's `--gg-formation-vh` is 0 here: the
travel starts at the block top, so the pin starts there too. After the reveal the block
has `(1 − pqAppearT) · runway` left to scroll; the quote scrolls out over the last `--fg-optical-center`
plus half its box of that, and the rest is hold. The pin's `bottom` also adds one
`--s2a-border-radius-xl`: a rounded next section (the C2 convention) is pulled up over this block by
that radius and paints above it (`z-index: 3`, over the un-z-indexed pin), so release lands its painted
top — not its flow top — on the quote's bottom edge. This mirrors the overlap the entry already assumes;
a non-rounded next section leaves that radius as a small gap instead. The world un-sticks one viewport
before the block ends, so a hold shorter than the gap between the quote's bottom and the viewport bottom
has the canvas sliding up during the last cards.

### Pull-quote copy reveal

`PQ_REVEAL_IN_MS` is the whole sweep. `PQ_DRAW_*`, `PQ_COPY_PARTS` and the line timings are shares of
it, so it is the one knob for overall pace. `PQ_REVEAL_OUT_MS` is the scroll-back exit and is
absolute, not a share.

Lines are staggered by `PQ_COPY_LINE_STAGGER` of the sweep, capped at `PQ_COPY_LINE_LAG_MAX` for the
last line, so every line is in flight at once rather than arriving in turn.

Each line carries two vars: `--fg-pq-line-v` for position and `--fg-pq-line-o` for opacity. Position
is `easeOutQuart` over `lag → lag + span`; opacity is linear over `lag → 1`, the same window the name
and role use. The mask clips the line for the first part of that window, so an ease-out would be
spent before the line clears and read as no fade at all. CSS maps the progress onto
`--fg-pq-line-fade-from → 1`, so a line enters partly visible rather than from nothing.

The quote element itself carries no fade or lift: it is always split, so the lines own the motion.
`PQ_COPY_PARTS` and the `--fg-pq-copy-rise` lift apply to the name and role only.

The wave is distance, not timing, and it rides on the mask box rather than the glyphs. A line is
wholly hidden while its offset exceeds its own height, so every line's inner span waits the same
`--fg-pq-line-start` and starts revealing as soon as its own clock does; rolled into that start
distance, the wave would delay each lower line's first appearance.

The mask itself is offset by `rank × --fg-pq-line-wave`, rank being the line's index capped at
`PQ_COPY_LINE_RANK_CAP` and written as `--fg-pq-line-rank` on each split. A mask carries its clip
rect with it, so that offset opens the gap without changing how much of the line shows: the spacing
widens down the stack mid-flight and closes to the authored line-height on landing. Raise
`--fg-pq-line-wave` for a deeper roll, 0 for a flat lift.

### Entry reveal

`entryLiftPx` floors the lift at `ENTRY_LIFT_MIN_H` of the viewport, so at `entryT` 0 the cards sit
that far above the canvas top and are clipped by the render target itself. `1 − entryT²` releases it,
so they descend into frame and are fully in view at the pin. The reveal is entirely inside the canvas;
the block's box, margins and runway are untouched.

The descent is masked by the page: pre-pin the world tracks the scroll at −1 while the lift unwinds
at `2 · lift · entryT / viewportH`, so the globe still rises, just slower than the page. That
difference is the reveal.

A lift that unwinds faster than the page scrolls stalls the globe and then sinks it, so
`entryLiftPx` clamps to `viewportH / ENTRY_RELEASE_PEAK` — the release curve's steepest slope, 2 for
`1 − t²`. **`ENTRY_RELEASE_PEAK` has to move with the curve.** The clamp bounds the geometric term
as well as `ENTRY_LIFT_MIN_H`: `H / 2 + navH / 2 − topPx` passes the ceiling on its own once the
entry globe is small enough that `topPx < navH / 2`. Under the cap, the leftover speed at the pin is
`1 − 2 · lift / viewportH`, so a larger lift clips deeper and arrives softer.

The lift also has to stay under what the globe can cover: displacing it by `ENTRY_LIFT_MIN_H` needs
the entry globe to render at least `1 + ENTRY_LIFT_MIN_H` viewports tall, or empty canvas shows below
it. That is `CAM_Z_ENTRY`'s job.

## Tuning the scroll budget

Per breakpoint, the scroll after the pin splits into three parts that cannot be set independently:

- **travel** — the pin until the last card has faded (`pqAppearT · runway`),
- **scroll-out** — the quote's box moving off with the next section, fixed at
  `--fg-optical-center + half the quote box` (the "floor"),
- **hold** — whatever remains: `(1 − pqAppearT) · runway − floor`.

`--fg-runway-height` scales travel and hold together at the current share; `CAM_Z_END` moves scroll
between them. `pqAppearT` is not a free number — it is `travelTAtCamZ(clearZ)`, and `clearZ` depends
on the rendered card height, so read it from the page rather than deriving it.

Read the inputs at the breakpoint being tuned, on the page as authored (the quote box height is in
them):

```js
(e => [
  getComputedStyle(e).getPropertyValue('--fg-pq-appear-t'),
  e.style.getPropertyValue('--fg-pq-half-box'),
  getComputedStyle(e).getPropertyValue('--fg-optical-center'),
  innerHeight,
].join(' | '))(document.querySelector('.firefly-globe'))
```

Then, with `S = CAM_Z_SPHERE`, `E = CAM_Z_END`, `p` the first value, `H` the last, and everything in
vh (`px / H · 100`):

1. `clearZ = S − (S − E) · (1 − (1 − p)³)` — recovers where the last card fades.
2. `travel = p · runway`; `floor = optical-center + half-box`; `hold = runway − travel − floor`.
   This is the current state; check it matches what is felt before changing anything.
3. Choose the new `travel` and `hold`: `runway = travel + floor + hold`.
4. `p* = travel / runway`; `E* = S − (S − clearZ) / (1 − (1 − p*)³)`.
5. Set `--fg-runway-height` and `CAM_Z_END`, reload, re-read `p` and confirm it landed on `p*`.

Changing `SPHERE_R`, `CAM_Z_SPHERE`, `CARD_H_SPHERE` or the near-fade bands moves `clearZ`, so start
again from the reading. A hold shorter than the gap between the quote's bottom edge and the viewport
bottom (`100vh − floor`) has the sticky world sliding up during the last fading cards.

## "Click & Drag" hint text

globe-gallery's WebGL plane (`buildTextMesh`, `TEXT_FRAG`), sphere geometry only: hidden until
`entryT > TEXT_APPEAR_START`, then warps in over `[TEXT_APPEAR_START, 1]` of `entryT`, so the warp
reaches 0 as the world pins and the globe goes live. Scale tracks `camera.position.z` down to
`CAM_Z_SPHERE`, holding apparent size through the entry; from the pin it stays 1 and the plane
grows as the camera travels toward it. Opacity rests at
`TEXT_OPACITY_RESTING` times `1 − scrollT / pqAppearT`; `uZoom` is `scrollT`. The first drag,
rotate or tap-to-open after the pin flips `hintRetired` (`retireHint`), and `hintExitT` runs itself
0→1 at `HINT_EXIT_RATE` regardless of the gesture. `buildTextMesh` does not create the plane when `entryT` is already past
`TEXT_APPEAR_START` by the time the font loads, so it never pops in mid-entry.

## Modal and the sticky canvas

`modal.js` is globe-gallery's file plus the model icon/label, prompt and CTA rendering, and one
offset: the modal canvas is viewport-fixed while the world canvas, until it pins, sits
`getCanvasTop()` (the world's viewport top) lower. `shiftForCanvasOffset` moves the snapshot the
opening animation starts from and the slot the closing animation lands on by that many pixels,
converted to world units at the card's depth, so the card leaves and returns exactly where it is
drawn. The offset is re-read when the close starts, so a scroll that slips through the lock while
the modal is open still lands the card on its slot.

The modal's `WebGLRenderer` is created lazily on the first `open()` (`ensureModalRenderer()`), not in
`setup()`; it is disposed on every `destroy()` and recreated on the next `open()`.

The scroll lock is `html.firefly-globe-modal-open { overflow: hidden }` + `lenis.stop()`, on `html`
only. With `html` already non-visible, an `overflow: hidden` on `body` applies to `body` itself
instead of propagating to the viewport, which makes `body` a scroll container and un-sticks
`.firefly-globe-world`. globe-gallery can lock both because its canvas and chrome are `fixed`.

### Modal stacking

`modal.js` reparents `.firefly-globe-modal` (the `z-index: 13` backdrop scrim) and
`.firefly-globe-modal-canvas` (`z-index: 14`, the photo) to `<body>` in `setup()`. Their z-indexes
only resolve at the `<body>` root; the block sits under a section whose `rounded-corners-bottom`
gives it a `z-index: 3` stacking context that would otherwise clamp them. The `<dialog>` chrome
stays in the block and paints above both via the top layer (`showModal()`).

The reparented nodes persist across re-inits (band crossing, reduced-motion toggle, WebGL context
restore). `destroy(false)` disposes the modal renderer but keeps the nodes and their once-wired
listeners; `destroy(true)` — the default, on block removal — detaches the nodes. `setup()` re-acquires
a node only when not already held and reparents only when not already at `<body>`: a root-scoped
`q()` cannot find a node that already lives under `<body>`.

`--fg-modal-anim-ms` is set inline on `.firefly-globe-modal` right after the reparent — it is
block-scoped and does not inherit at `<body>`, and the scrim's opacity transition reads it.

`html:has(.firefly-globe)` sets `scrollbar-gutter: stable`, so the modal's `overflow: hidden` lock
leaves the layout width unchanged.

## Reduced motion

Same contract as globe-gallery: `.firefly-globe-reduced` un-sticks `.firefly-globe-world` and leaves
it at `height: 100vh`. `worldEl.offsetHeight` is the one viewport height every clock reads.

The pull-quote copy needs no override to show in full: `updatePullQuote` returns early, so its
progress vars stay unset at their `1` fallbacks. The line rules are the exception — RM can be
toggled after a value has already been written, so they reset `opacity` and `transform` explicitly.

## Tests

`test/c2/blocks/firefly-globe/firefly-globe.test.js` covers the authoring parse (rows, API cell, pull
quote), `buildGlobeDom`, API card mapping (component rendition template, model tags, locale
fallback, alt fallback), `fireflyRenditionUrl` sizing, the frame shape, the clock endpoints
(`deriveFrame`) and the travel camera inverse pair.

`layoutQuote` is covered against real layout — the split reads `offsetTop` per word, so those cases
attach the quote to the document at a width that forces a wrap. They pin the parts a relayout can
break: every word survives in order, lines stay separated by a text node so `textContent` does not
run them together, the `sr-only` node carries the whole quote while the visual lines are
`aria-hidden`, the opening mark hangs off the first line only, and a re-split re-typesets from the
authored text in the `QUOTE_TEXT` map rather than from the already-split DOM — including widening
the box to fewer lines.

The reveal maths (`entryLiftPx`, `entryRelease`, `updatePullQuoteCopy`) are closures inside
`createGlobeGalleryRuntime` and are not reachable from a test. There is no Nala/E2E coverage of the
WebGL path.
