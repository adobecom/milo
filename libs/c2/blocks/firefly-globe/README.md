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
| Entry | Arc → grid → fold cascade on scroll (`timeline.js`, `math.js`, ortho camera) | None. The sphere is fully formed at scroll start. |
| Camera | Zoom tail eased by `camZAtZoomT` | Linear: `camera.z = lerp(CAM_Z_SPHERE, CAM_Z_END, scrollT)` |
| Scroll clock | Six derived clocks (`deriveFrame`) | One: `scrollT = (scrollY − (blockDocTop − H)) / blockHeight`, clamped. Runs from the block's top entering the viewport bottom to its bottom leaving the viewport bottom. |
| Arc copy pill | Authoring row 1 | None |
| "Click & Drag" text plane behind the sphere | WebGL plane (`TEXT_FRAG`) | None. `hintText` (hint row, cell 2) only labels the cursor pill. |
| Custom cursor | Disc + chevron ring + label; native cursor hidden | Label pill only, beside the native cursor (`grab`/`grabbing`/`pointer`). |
| Canvas | `position: fixed`, shown/hidden by scroll range | `position: absolute` inside the sticky `.firefly-globe-world`. |
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`), or a fragment link. Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, CTA to `fireflyUrl`. |
| Three.js | Vendored `three.module.min.js` built by esbuild | Shared `libs/deps/three.js` (r160). A `THREE.*` symbol must be in its export list. |
| Scroll budget | `--gg-runway-height` 550vh, `--gg-formation-vh` | `--fg-runway-height` 350vh only. |
| CSS custom properties | `--gg-*` | `--fg-*` (block-scoped; nothing outside the block reads them). |
| Tuning | md `CAM_Z_SPHERE` 57, sm `CAM_Z_END` −60, `CYL_COLS_FIT` 0.65 | md `CAM_Z_SPHERE` 80, sm `CAM_Z_END` −40, `CYL_COLS_FIT` 0.55 |
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

## Pass-through and the pull-quote cue

The camera travels through the sphere on scroll while the globe is live, so globe-gallery's
inside-sphere rules are unchanged: `cameraInsideSphere` flips the drag direction, and
`yawDeltaToCenter` / `cardCenterYawPitch` default to it. The keyboard focus snap
(`centerCardOnScreen(i, !suppressFocusSnap)`) solves for the outside side; `snapToBrowseView` lands
at `scrollT = BROWSE_VIEW_T`. Orientation and inertia reset only below `SPHERE_ORIENT_RESET_T`.

Scroll input is `readScrollY()`: Lenis' `animatedScroll` when it agrees with `window.scrollY` within
`LENIS_TRUST_PX`, otherwise `deQuantize(window.scrollY)`, which damps steps smaller than
`SCROLL_JUMP_PX` (an iOS URL-bar show/hide moves `scrollY` by the bar height without a user scroll)
and passes larger ones through. `scrollVel` is the per-frame delta of that smoothed value and feeds
the motion CA trail.

`pqAppearT` is the `scrollT` at which the deepest card has faded out (`−SPHERE_R + cardVanishDepth()`
on the camera span). At it: the pointer path retires (`globeLive`: drag, hover, on-canvas controls;
the cursor pill fades `CURSOR_RETIRE_LEAD_T` earlier), the pull-quote reveal starts, and the canvas
hides `CANVAS_HIDE_MARGIN_T` later. The keyboard path (`globeFormed`: modal closed) is not gated on
it.

`--fg-pq-appear-t` and `--fg-pq-pin-top` are published by JS (`publishPqAppearT`, `publishPqPinTop`);
the CSS fallbacks cover only the frames before the script runs.

## Modal and the sticky canvas

While the modal is open, `.firefly-globe-world` is pinned to `position: fixed` at its current top
(`onModalOpen` / `onModalClose`), `camera.z` is frozen (`frozenCameraZ`), `modal.js` shifts the card's
start/return positions by that top offset (`shiftForCanvasOffset`), and `scrollTo(preLockScrollY)`
runs on open and close. When testing the modal, cover: opening with the block only partly scrolled
in, a resize while open, and closing after Lenis restarts.

## Reduced motion

Same contract as globe-gallery: `.firefly-globe-reduced` un-sticks `.firefly-globe-world` and leaves
it at `height: 100vh`. `worldEl.offsetHeight` is the one viewport height every clock reads.

## Tests

`test/c2/blocks/firefly-globe/firefly-globe.test.js` covers the authoring parse (rows, API cell, pull
quote), `buildGlobeDom`, fragment and API card mapping (rendition URL cap, model tags, locale fallback,
alt fallback) and the frame shape. There is no Nala/E2E coverage of the WebGL path.
