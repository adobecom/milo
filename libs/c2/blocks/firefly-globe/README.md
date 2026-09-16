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
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`), or a fragment link. Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, CTA to `fireflyUrl`. |
| Three.js | Vendored `three.module.min.js` built by esbuild | Shared `libs/deps/three.js` (r160). A `THREE.*` symbol must be in its export list. |
| Scroll budget | `--gg-runway-height` + `--gg-formation-vh`, per breakpoint | `--fg-runway-height` only, per breakpoint. The entry happens in the viewport before the block top, so the whole runway is travel. |
| CSS custom properties | `--gg-*` | `--fg-*` (block-scoped; nothing outside the block reads them). |
| Tuning | — | `SPHERE_R`, `CAM_Z_SPHERE` and `CAM_Z_END` are tuned per breakpoint for the scroll budget below; `CAM_Z_ENTRY` is the only extra breakpoint field. |
| Opening quote | Measured in canvas, hung with a negative `text-indent` | Wrapped in C2's `span.hang-opening-quote` (`styles.css`: absolute, `translateX(-100%)`), so the mark takes no inline space and is not kerned against the first letter; the letter's advance box sits on the column. Marks: `Ps`, `Pi`, `Pf`, ASCII `"` `'`. A mark ≥ 0.8em or wider than the gutter (`--fg-copy-pad`) stays inline: each quote line is an `overflow: hidden` mask with `--fg-hang-max` (0.8em) of side bleed, so a wider mark would be clipped; a CJK `「` needs both raised. |
| Modules | `math.js` + `timeline.js` | `src/utils.js` (easings, `coverFit`, camera constants, the travel camera pair, `createFrame` / `createFrameInput` / `deriveFrame`). |
| Analytics | `--globe_gallery` | `--firefly_globe`; modal labels keep `--globe_card_modal`. |

## Authoring

Positional rows. A fragment link is authored with `#_dnb`; the hash is stripped before fetch.

| Row | Content |
|---|---|
| 1 | `categoryId \|\| cgenId \|\| ctaLabel` **or** a fragment link. `cgenId` appends `&promoid=<id>&mv=other` to every `fireflyUrl`. `ctaLabel` is the modal CTA text; the CTA is hidden for cards without a `fireflyUrl`. |
| 2 | Two cells: the barrel's bottom-row copy (touch hint), then the cursor label. |
| 3 | `instructions \|\| rotateLeft \|\| rotateRight \|\| pauseSpin \|\| resumeSpin \|\| prevCard \|\| {index} of {count} \|\| nextCard \|\| close` — empty parts fall back to defaults. |
| 4 | Optional pull quote: `<blockquote>` (or heading), then name and role paragraphs. No row → no pin. |

API prompt locale: `getConfig().locale.ietf` exact match → language-only key → any same-language key →
`en-US` → first available. The API has no alt text; the prompt (first 120 chars) is the card's `alt`,
so it is the a11y card label and the modal's sr-only image label.

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
distance, is held at the canvas top and released by `1 − entryT³`, so the block scrolls in with no
empty band above the cards and they settle nav-centred as the world pins. `wallTopY` is written with
`fadeRefH` in `recomputeDragFlip`, so it follows the masonry morph. The same release factor is
published as `--fg-entry-release` (1 while scrolling in, 0 at the pin) and the spin toggle subtracts
`--fg-nav-h · --fg-entry-release` from `--fg-controls-top`, so it sits `--fg-controls-inset` below the
world's top edge during the entry and under the nav once pinned.

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
plus half its box of that, and the rest is hold. The world un-sticks one viewport before the block ends,
so a hold shorter than the gap between the quote's bottom and the viewport bottom has the canvas
sliding up during the last cards.

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

The scroll lock is `html.firefly-globe-modal-open { overflow: hidden }` + `lenis.stop()`, on `html`
only. With `html` already non-visible, an `overflow: hidden` on `body` applies to `body` itself
instead of propagating to the viewport, which makes `body` a scroll container and un-sticks
`.firefly-globe-world`. globe-gallery can lock both because its canvas and chrome are `fixed`.

## Reduced motion

Same contract as globe-gallery: `.firefly-globe-reduced` un-sticks `.firefly-globe-world` and leaves
it at `height: 100vh`. `worldEl.offsetHeight` is the one viewport height every clock reads.

## Tests

`test/c2/blocks/firefly-globe/firefly-globe.test.js` covers the authoring parse (rows, API cell, pull
quote), `buildGlobeDom`, fragment and API card mapping (rendition URL cap, model tags, locale fallback,
alt fallback), the frame shape, the clock endpoints (`deriveFrame`) and the travel camera inverse pair. There is no Nala/E2E coverage of the WebGL path.
