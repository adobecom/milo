# firefly-globe — C2 block

A simplified fork of `libs/mep/ace1209/globe-gallery`. The sphere, drag/inertia, hover, near-camera
fade, modal, on-canvas controls, keyboard/a11y path, pull-quote and reduced-motion handling are the
same code with the class prefix renamed. **Everything not listed under "What is different" below is
documented in the globe-gallery README, and that document is the spec for this block too** — read it
before editing anything shared, and keep the two in sync when a shared fix lands in either.

Editing conventions are the globe-gallery ones: prose in the README, code comments only as contract or
as a hazard at the exact line an edit would break.

## What is different

| Area | globe-gallery | firefly-globe |
|---|---|---|
| Entry | Arc → grid → fold cascade on scroll (`timeline.js`, `math.js`, ortho camera) | None. The sphere is fully formed at scroll start. |
| Camera | Zoom tail eased by `camZAtZoomT` | Linear: `camera.z = lerp(CAM_Z_SPHERE, CAM_Z_END, scrollT)` |
| Scroll clock | Six derived clocks (`deriveFrame`) | One: `scrollT = (scrollY − (blockDocTop − H)) / blockHeight`, clamped. Starts when the block's top enters the viewport bottom, so the globe already moves while scrolling into view. |
| Arc copy pill | Authoring row 1 | Removed |
| "Click & Drag" text plane behind the sphere | WebGL plane (`TEXT_FRAG`) | Removed. `hintText` (hint row, cell 2) only labels the cursor pill. |
| Custom cursor | Disc + chevron ring + label; native cursor hidden | Label pill only, floated beside the **native** cursor (`grab`/`grabbing`/`pointer` stay). |
| Canvas | `position: fixed`, shown/hidden by scroll range | `position: absolute` inside the sticky `.firefly-globe-world`; scrolls with the block. |
| Cards | Authored fragment: name, role, description, badges | Firefly Community API by `categoryId` (see `FIREFLY-API.md`), or a legacy fragment link. Card = image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl`. |
| Modal info | `<h2>` name, role, description paragraphs, badge list | Model icon + version label, prompt, "Open in Firefly" CTA. |
| Three.js | Vendored `three.module.min.js` built by esbuild | Shared `libs/deps/three.js` (r160). Adding a `THREE.*` symbol means checking it is exported there. |
| Scroll budget | `--gg-runway-height` 550vh, `--gg-formation-vh` | `--gg-runway-height` 350vh, no formation. |
| Tuning | md `CAM_Z_SPHERE` 57, sm `CAM_Z_END` −60, `CYL_COLS_FIT` 0.65 | md `CAM_Z_SPHERE` 80, sm `CAM_Z_END` −40, `CYL_COLS_FIT` 0.55 |
| Modules | `math.js` + `timeline.js` | Folded into `src/utils.js` (easings, `coverFit`, camera constants, `createFrame`). |
| Analytics | `--globe_gallery` | `--firefly_globe`; modal labels keep `--globe_card_modal`. |

## Authoring

Positional rows; the fragment link (if used) is authored with `#_dnb` and stripped before fetch.

| Row | Content |
|---|---|
| 1 | `categoryId \|\| cgenId \|\| ctaLabel` **or** a fragment link. `cgenId` appends `&promoid=<id>&mv=other` to every Firefly deep link. `ctaLabel` is the modal CTA text; the CTA is hidden for cards without a `fireflyUrl`. |
| 2 | Two cells: the barrel's bottom-row copy (touch hint), then the cursor label. |
| 3 | `instructions \|\| rotateLeft \|\| rotateRight \|\| pauseSpin \|\| resumeSpin \|\| prevCard \|\| {index} of {count} \|\| nextCard \|\| close` — any part empty falls back. |
| 4 | Optional pull quote: `<blockquote>` (or heading), then name and role paragraphs. Absent row → no pin. |

The API fetch uses the page locale (`getConfig().locale.ietf`) to pick a prompt: exact match, then
language-only, then any same-language key, then `en-US`. The API carries no alt text, so the prompt
(first 120 chars) doubles as the a11y card label and the modal's sr-only image label.

## Pass-through and the pull-quote cue

The camera travels *through* the sphere on scroll and the globe stays live for most of that, so all of
globe-gallery's inside-sphere rules apply here unchanged: `cameraInsideSphere` flips the drag
direction, and `yawDeltaToCenter` / `cardCenterYawPitch` default to it so rotate-step, modal-centring
and keyboard-centring aim at the far wall while inside. The keyboard focus snap
(`centerCardOnScreen(i, !suppressFocusSnap)`) solves for the *outside* side because the snap that
follows scrolls to `scrollT ≈ 0.1`.

`pqAppearT` is where the deepest card has faded out completely (`−SPHERE_R + cardVanishDepth()` mapped
onto the camera span). It retires the pointer path (drag, hover, cursor pill, on-canvas controls), starts
the pull-quote reveal, and hides the canvas `CANVAS_HIDE_MARGIN_T` later. The keyboard entry point is
**not** gated on it: focusing a card runs `snapToBrowseView`, which scrolls back into range, so the
a11y widget must stay usable past the cue.

`--gg-pq-appear-t` and `--gg-pq-pin-top` are published by JS (`publishPqAppearT`, `publishPqPinTop`);
the CSS fallbacks only cover the frames before the script runs.

## Modal and the sticky canvas

Because the main canvas is absolute inside a sticky box rather than fixed, the modal pins
`.firefly-globe-world` to `position: fixed` at its current top for the duration (`onModalOpen` /
`onModalClose`), freezes `camera.z` (`frozenCameraZ`), and `modal.js` shifts the card's start/return
positions by that top offset (`shiftForCanvasOffset`). `scrollTo(preLockScrollY)` on open and close
guards against the scroll lock moving the page. This is the one modal-path divergence from
globe-gallery; when testing the modal, cover: opening with the block only partly scrolled in, a resize
while open, and closing after Lenis restarts.

## Reduced motion

Same contract as globe-gallery: `.firefly-globe-reduced` un-sticks `.firefly-globe-world` and leaves it
at `height: 100vh`. `worldEl.offsetHeight` is the one viewport height every clock reads — do not give
the world any other height under RM.

## Tests

`test/c2/blocks/firefly-globe/firefly-globe.test.js` covers the authoring parse (rows, API cell, pull
quote), `buildGlobeDom`, fragment and API card mapping (rendition URL cap, model tags, locale fallback,
alt fallback) and the frame shape. There is no Nala/E2E coverage of the WebGL path.
