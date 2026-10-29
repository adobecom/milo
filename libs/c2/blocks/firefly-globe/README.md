# firefly-globe — C2 block

A simplified fork of `libs/c2/blocks/globe-gallery`. The sphere, drag/inertia, hover, near-camera
fade, modal, on-canvas controls, keyboard/a11y path, pull-quote and reduced-motion handling are the
same code with the class prefix renamed. **Everything not listed under "What is different" is
documented in the globe-gallery README, and that document is the spec for this block too.** Keep the
two in sync when a shared fix lands in either. (`libs/mep/ace1209/globe-gallery` is a separate,
diverged copy of the same block and is **not** the spec.)

Editing conventions are the globe-gallery ones: prose in the README, code comments only as contract or
as a hazard at the exact line an edit would break. Files ship unminified.

## What is different

| Area | globe-gallery | firefly-globe |
|---|---|---|
| Entry | Arc → grid → fold cascade on scroll (`timeline.js`, `math.js`, ortho camera) | Sphere already formed; camera eases in (`entryT³`, gg's fold curve) from `CAM_Z_ENTRY` to `CAM_Z_SPHERE` while the block scrolls in, landing at the travel's starting speed as the world pins. |
| Camera | `camZAtZoomT(zoomT)` from `timeline.js` | Same form, `camZAtTravelT(scrollT)` from `src/utils.js`, from the pin; its own ease power (see Camera ease). |
| Scroll clock | Six derived clocks (`timeline.js` `deriveFrame`) | Two, from `src/utils.js` `deriveFrame` (same producer/consumer split: `computeFrame` derives, every tick stage reads `frame.*`): `entryT = 1 + (scrollY − blockDocTop) / H` reaches 1 at the pin; `scrollT = (scrollY − blockDocTop) / travelSpanPx` is gg's `zoomT`, 0 at the pin and 1 at the end of the travel (`--fg-travel-vh`; the block height with the quote particles off). |
| Arc copy pill | Authoring row 1 | None |
| "Click & Drag" text plane | Entrance and fade on `sphereFormT` / `zoomT` | Same plane and `TEXT_FRAG`, clocked on `entryT` / `scrollT` (see below). |
| Canvas | `position: fixed`, shown/hidden by scroll range | `position: absolute` inside the sticky `.firefly-globe-world`, so it travels with the block: at `entryT` 0 the sphere is centred in a canvas whose top is at the viewport bottom and rises in with the block, never over the section above. Controls are `absolute` with it. |
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`). Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, CTA to `fireflyUrl`. |
| Scroll budget | `--gg-formation-vh` + `--gg-zoom-vh`, per breakpoint | `--fg-travel-vh` only, per breakpoint (no formation: the entry happens in the viewport before the block top). With the quote particles off, `--fg-runway-height` is the block height and the travel span. |
| CSS custom properties | `--gg-*` | `--fg-*` (block-scoped; nothing outside the block reads them). |
| Tuning | — | `SPHERE_R`, `CAM_Z_SPHERE` and `CAM_Z_END` are tuned per breakpoint for the scroll budget below; `CAM_Z_ENTRY` is the only extra breakpoint field. |
| Opening quote | Measured in canvas, hung with a negative `text-indent` | Wrapped in C2's `span.hang-opening-quote` (`styles.css`: absolute, `translateX(-100%)`), so the mark takes no inline space and is not kerned against the first letter; the letter's advance box sits on the column. Marks: `Ps`, `Pi`, `Pf`, ASCII `"` `'`. A mark ≥ 0.8em or wider than the gutter (`--fg-copy-pad`) stays inline. The particle raster draws the hung mark as its own run, at its rendered position. |
| Modules | `math.js` + `timeline.js` | `src/utils.js` (easings, `coverFit`, camera constants, the travel camera pair, `createFrame` / `createFrameInput` / `deriveFrame`). |
| Camera ease | `ZOOM_EASE_POW` | `TRAVEL_EASE_POW` (`utils.js`); the quote shaders bake the same value. |
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
separate gate for what must wait for the pin: the travel camera, the inside-sphere drag flip, and
retiring the hint (`retireHint`: a drag, rotate or card opened before the pin leaves the cursor pill
and the text plane in place, so both go out together, after the pin).
Reduced motion is always formed and interactive.

The entry lift is a CSS scroll-driven animation. `fg-entry-lift` translates the canvas and
`.firefly-globe-a11y-cards` (so the focus ring follows) up by `--fg-entry-lift` (45vh) and releases it
by `1 − entryT²` on the block's `--fg-entry` view timeline over its `entry` range
(`cubic-bezier(0.333, 0, 0.667, 0.333)` is `t²`). At `entryT` 0 the cards sit that far above the
world's top, clipped by its `overflow: clip`; they descend into frame and settle nav-centred as the
world pins. With it, the view offset only nav-centres. **The lift has to move with the page's scroll, not with
rAF:** iOS scrolls on its own thread, so anything JS positions from the scroll steps against the
page, and near the pin the lift unwinds at close to scroll speed. Modal flights read the canvas's
own rect (`getCanvasTop`), which includes the translate. Without `animation-timeline` (Firefox),
`applyCentringOffset` applies the same lift through the view offset each frame from `entryT`;
**`ENTRY_LIFT_H` has to match `--fg-entry-lift`.** Reduced motion has no lift.

The spin toggle has two safe positions: `--fg-controls-entry-top` while the world's top edge is still
below the nav, `--fg-controls-top` once pinned and the nav is over it. It rides the same
`fg-entry-lift` animation, its `--fg-entry-lift` set to the gap between the two. Without
`animation-timeline` it stays at `--fg-controls-top`.

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
through `travelTAtCamZ`, gg's `pqAppearZoomT`). It feeds the pull quote's cue (`setCue`) and the hint
text's fade. The keyboard path (`globeFormed`: interactive and modal closed) is not gated on it.

### Pull quote

`src/quote-particles.js` is globe-gallery's module, copied: read **"Pull quote: particle transition,
DOM text at rest"**, **"Block height"** and the near-camera dissolve in that README; they are the spec.
The differences:

- Vocabulary and imports: `scrollT`/`travel` in place of `zoomT`/`zoom` (`--fg-travel-vh`,
  `input.travelPx`, `travelSpanPx`, `scrollYAtTravelT`), from `utils.js`. There is no formation
  offset, so the travel, the hand-off and the block height all count from the block top (the pin).
- The canvas is always `position: absolute` in the sticky world, so the hand-off doesn't move it.
- Every card is on the sphere, so `cardPlanes` sources every card the modal does not hold.

The section around the block: a rounded section above overlaps the block's first radius (see Entry
reveal), and a rounded next section overlaps its last radius, which at the block's end is the bottom of
the crosshair's vertical lines, as on stage. A `parallax-video-garage-door` next section (≥1024px) enters
from under this block's section, which carries the higher `z-index`, so the video is revealed as the
block scrolls away and never covers the quote.

### Entry reveal

The reveal stays inside the world; the block's box, margins and runway are untouched.

The descent is masked by the page: pre-pin the world tracks the scroll at −1 while the lift unwinds
at `2 · lift · entryT / viewportH`, so the globe still rises, just slower than the page. That
difference is the reveal.

**The lift has to stay at or under 50vh.** `1 − t²` unwinds at up to twice the lift per viewport
scrolled, so a larger lift outruns the page, stalls the globe and then sinks it. The leftover speed
at the pin is `1 − 2 · lift / viewportH`, so a larger lift clips deeper and arrives softer.

The lift also has to stay under what the globe can cover: a 45vh lift needs the entry globe to render
at least 1.45 viewports tall, or empty space shows below it. That is `CAM_Z_ENTRY`'s job.

## Tuning the scroll budget

As in globe-gallery: every length is its own knob and the block height follows. Per breakpoint,
`--fg-travel-vh` sets the camera's pace through the globe, `PULL_BP[band].startR` where along it the
hand-off lands, and `FLY_VH` / `READ_VH` the flight and the still quote; `CAM_Z_END` and the near-fade
bands move the cue (`pqAppearT`). The cue depends on the rendered card height, so read positions off
the page rather than deriving them.

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

Reduced motion builds no quote particles, so the figure is a static DOM quote after the globe.

## Tests

Conventions, fixtures and the no-WebGL modal constraints are the globe-gallery ones; see that
README's **Tests**.

`test/c2/blocks/firefly-globe/firefly-globe.test.js` covers the authoring parse (rows, API cell, pull
quote), `buildGlobeDom`, API card mapping (component rendition template, model tags, locale
fallback, alt fallback), `fireflyRenditionUrl` sizing, the frame shape, the clock endpoints
(`deriveFrame`, including the travel span), the travel camera inverse pair and `plainQuote` (authored
text restored on every call, the opening mark hung once).

`test/c2/blocks/firefly-globe/quote-particles.test.js` runs globe-gallery's shared particle suite
(`quote-particles.suite.js`) against this block's copy, class names and stylesheet.

`test/c2/blocks/firefly-globe/modules.test.js` covers `controls.js`, the `a11y.js` keyboard gallery,
`interaction.js`, `cursor.js`, `materials.js` and `modal.js` DOM behavior.

`mocks/authored.html` is the authoring contract as a fixture.

There is no Nala/E2E coverage of the WebGL path.
