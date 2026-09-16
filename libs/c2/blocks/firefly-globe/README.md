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
| Entry | Arc → grid → fold cascade on scroll (`timeline.js`, `math.js`, ortho camera) | Sphere already formed; camera eases `CAM_Z_ENTRY → CAM_Z_SPHERE` while the block scrolls in, landing as the world pins. |
| Camera | Zoom tail eased by `camZAtZoomT` | Linear from the pin: `camera.z = lerp(CAM_Z_SPHERE, CAM_Z_END, travelT)` |
| Scroll clock | Six derived clocks (`deriveFrame`) | `scrollT = (scrollY − (blockDocTop − H)) / blockHeight` over the whole block; `entryT = 1 + (scrollY − blockDocTop) / H` reaches 1 at the pin; `travelT` spans pin → end. |
| Arc copy pill | Authoring row 1 | None |
| "Click & Drag" text plane | Entrance and fade on `sphereFormT` / `zoomT` | Same plane and `TEXT_FRAG`, clocked on `entryT` / `travelT` (see below). |
| Custom cursor | Disc + chevron ring + label; native cursor hidden | Label pill only, beside the native cursor (`grab`/`grabbing`/`pointer`). |
| Canvas | `position: fixed`, shown/hidden by scroll range | `position: absolute` inside the sticky `.firefly-globe-world`. |
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`), or a fragment link. Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, CTA to `fireflyUrl`. |
| Three.js | Vendored `three.module.min.js` built by esbuild | Shared `libs/deps/three.js` (r160). A `THREE.*` symbol must be in its export list. |
| Scroll budget | `--gg-runway-height` 550vh, `--gg-formation-vh` | `--fg-runway-height` 350vh only. |
| CSS custom properties | `--gg-*` | `--fg-*` (block-scoped; nothing outside the block reads them). |
| Tuning | md `CAM_Z_SPHERE` 57, sm `CAM_Z_END` −60, `CYL_COLS_FIT` 0.65 | md `CAM_Z_SPHERE` 80, sm `CAM_Z_END` −40, `CYL_COLS_FIT` 0.55 |
| Opening quote | Measured in canvas, hung with a negative `text-indent` | Wrapped in C2's `span.hang-opening-quote` (`styles.css`: absolute, `translateX(-100%)`), so the mark takes no inline space and is not kerned against the first letter; the letter's advance box sits on the column. Marks: `Ps`, `Pi`, `Pf`, ASCII `"` `'`. A mark ≥ 0.8em or wider than the gutter (`--fg-copy-pad`) stays inline: each quote line is an `overflow: hidden` mask with `--fg-hang-max` (0.8em) of side bleed, so a wider mark would be clipped; a CJK `「` needs both raised. |
| Modules | `math.js` + `timeline.js` | `src/utils.js` (easings, `coverFit`, camera constants, `createFrame`). |
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

`sphereFormed` (`entryT >= 1`, i.e. `scrollY >= blockDocTop`, the world pinned) is globe-gallery's
`interactive` gate: before it there is no drag, banked drag travel is dropped, no auto-spin, no drag
warp, no hover, and `globeFormed`/`globeLive` are false so the on-canvas controls, cursor pill, tap-to-
open and keyboard entry are all off. Reduced motion is always formed.

From the pin the camera travels through the sphere, so globe-gallery's inside-sphere rules are
unchanged: `cameraInsideSphere` flips the drag direction, and `yawDeltaToCenter` /
`cardCenterYawPitch` default to it. The keyboard focus snap
(`centerCardOnScreen(i, !suppressFocusSnap)`) solves for the outside side; `snapToBrowseView` lands
at `blockDocTop`, the first formed scroll position. Orientation and inertia reset only below
`SPHERE_ORIENT_RESET_T`.

Scroll input is `readScrollY()`: Lenis' `animatedScroll` when it agrees with `window.scrollY` within
`LENIS_TRUST_PX`, otherwise `deQuantize(window.scrollY)`, which damps steps smaller than
`SCROLL_JUMP_PX` (an iOS URL-bar show/hide moves `scrollY` by the bar height without a user scroll)
and passes larger ones through. `scrollVel` is the per-frame delta of that smoothed value and feeds
the motion CA trail.

`pqAppearT` is the `scrollT` at which the deepest card has faded out (`−SPHERE_R + cardVanishDepth()`
on the camera span, offset by the pin: `pinT + (1 − pinT) · travelT`). It depends on `H`, so
`doLayout` republishes it. At it: the pointer path retires (`globeLive`: drag, hover, on-canvas controls;
the cursor pill fades `CURSOR_RETIRE_LEAD_T` earlier), the pull-quote reveal starts, and the canvas
hides `CANVAS_HIDE_MARGIN_T` later. The keyboard path (`globeFormed`: pinned and modal closed) is
not gated on it.

`pqAppearTravelT` is the same point on the travel span.

`--fg-pq-appear-t` is published by JS (`publishPqAppearT`, gg's `publishPqAppearZoomT`); the CSS
fallback covers only the frames before the script runs. The pin's `top: 100vh` is gg's
`--gg-formation-vh`: the rail starts at the point where the world sticks.

## "Click & Drag" hint text

globe-gallery's WebGL plane (`buildTextMesh`, `TEXT_FRAG`), sphere geometry only: hidden until
`entryT > TEXT_APPEAR_START`, then warps in over `[TEXT_APPEAR_START, 1]` of `entryT`, so the warp
reaches 0 as the world pins and the globe goes live. Scale tracks `camera.position.z` against
`CAM_Z_SPHERE`, holding apparent size through the entry and the travel. Opacity rests at
`TEXT_OPACITY_RESTING` times `1 − travelT / pqAppearTravelT`; `uZoom` is `travelT`. The first drag or
tap-to-open flips `hintRetired`, and `hintExitT` runs itself 0→1 at `HINT_EXIT_RATE` regardless of the
gesture. `buildTextMesh` does not create the plane when `entryT` is already past
`TEXT_APPEAR_START` by the time the font loads, so it never pops in mid-entry.

## Modal and the sticky canvas

The modal can only open once the world is pinned, so the main canvas and the viewport-fixed modal
canvas share an origin and `modal.js` needs no offset — it is globe-gallery's file plus the model
icon/label, prompt and CTA rendering.

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
alt fallback) and the frame shape. There is no Nala/E2E coverage of the WebGL path.
