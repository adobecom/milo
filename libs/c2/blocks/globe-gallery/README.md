# globe-gallery — C2 block

A scroll-driven Three.js block. Over a pinned runway the authored photo cards sweep across the viewport on an arc,
peel into a grid, fold onto a sphere (a barrel on sm and touch devices), and the camera then travels through the globe
into the pull quote. Once formed, the globe can be dragged, and a card tap opens a detail modal.

The runtime, sphere, drag, modal, a11y, controls and pull quote are shared with `firefly-globe` and documented in
`libs/utils/globe/README.md`. This file covers what gallery adds. (`libs/mep/ace1209/globe-gallery` is a separate,
diverged copy and is not this block.)

| File | Holds |
| --- | --- |
| `globe-gallery.js` | In order: authoring (`parseAuthoredContent`, `fetchFragmentCards`, `buildGlobeDom`, `renderModalContent`, `optimizeImgUrl`); the timeline (every phase constant and threshold, the pure `createFrame` / `createFrameInput` / `deriveFrame`, `cardFoldStartProgress`, and the arc geometry `buildArcCtx`, `getFanData`, `cssToWorld`, `rotateArcPoint`, `arcCamZ`, which use no THREE and no DOM); then the `spec`: `BREAKPOINTS`, seeds, content loading, and `createHooks(ctx)` with arc, grid and fold placement, the ortho camera and the arc copy |
| `globe-gallery.css` | First-paint rules, the scroll budget vars, arc copy, modal info layout, gallery-only overrides |

## Authoring

Positional rows; a different layout mis-assigns strings, so republish content and code together.

| Row | Content |
| --- | --- |
| 0 | Arc copy: heading → `.globe-arc-copy-title`; the remaining `<p>`s → `.globe-arc-copy-body`, reused as nodes |
| 1 | A Milo fragment link with `#_dnb` appended (the cards) |
| 2 | Hint row (see the shared README) |
| 3 | A11y row (see the shared README) |
| 4 | Optional pull quote |

`#_dnb` stops Milo resolving the fragment into the page before `init` runs. `fetchFragmentCards` fetches
`href + '.plain.html'` and parses it with `DOMParser`, so card images don't load during the parse. No fragment link, a
failed fetch or no usable cards logs to lana and hides the block (`.globe-empty`).

### Cards

Each fragment section is one card, matched by markup, not position:

| Element | Becomes |
| --- | --- |
| `<p>` whose whole content is `<em>` | role (first wins) |
| `<p>` whose whole content is `<strong>`, or `<h1>`–`<h6>` | name (first wins) |
| any other non-empty `<p>` | description paragraph, inline markup kept |
| `<ul>`, one `<li>` per badge | badges |
| `<picture>` / `<img>` (wrapped or a direct child) | image and alt; required, first wins |

- A card with no copy arrives as a bare `<div><picture>`, so section parsing accepts `PICTURE`/`IMG` children too. An
  imageless section is skipped and logged.
- **Badge `<li>`**: the nested `<ul>` is the feature; everything else is the product (optional logo, then the product
  link for name and target). DA wraps the row in `<p>` only when a feature exists; both forms parse the same. The logo
  is an `.svg` link or an `<img>`, rendered `aria-hidden`, resolved through `getFederatedUrl`. The row is read from a
  clone with the feature list detached.
- **Paragraphs are moved, not cloned** (`replaceChildren`), which keeps inline links and
  emphasis. A card's paragraphs must never render into two live containers at once. Both containers are `<div>`s.
- The modal shows name above role whatever the authored order. The description goes through `hangParagraphs`.
- `optimizeImgUrl` rewrites `media_*` URLs to `?width=<cap>&format=webply` (`height=` for cards); other URLs pass through.

## Scroll model

The block is the runway (`--globe-runway-height`). `deriveFrame` maps raw scroll piecewise into `progress`:

| Segment | Raw scroll | `progress` |
| --- | --- | --- |
| formation (arc → grid → fold) | 0 → `--globe-formation-vh` | 0 → `SPHERE_FORMED_PROGRESS` |
| travel (camera through the globe, pull quote) | the rest: `--globe-travel-vh` with quote particles, else the remaining block | → 1 |

Formation has a fixed scroll length, so the runway only sets the travel. `formedScrollPx()` feeds the remap, the
reduced-motion pin and the focus snap. CSS is the source of truth: base rules are sm, the md media query overrides.

| Var | Effect |
| --- | --- |
| `--globe-runway-height` | total height while the quote particles are off |
| `--globe-formation-vh` | formation length; slows or speeds arc → grid → fold |
| `--globe-travel-vh` | camera travel length while the particles are on |
| `--globe-pq-height` | written by `syncHeight`; not a knob |

### Clocks

All in `deriveFrame`. They don't share a zero:

| Clock | 0 → 1 over | Read by |
| --- | --- | --- |
| `arcCopyEntryT` | from `ENTRY_LEAD_VH` viewports before the block top, over `ENTRY_RAMP_VH` (raw scroll) | arc copy fade-in, arc pre-roll, per-card entry rotation |
| `progress` | block top → end of travel | everything below |
| `arcPanT` | `progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL × arcCopyEntryT` | arc geometry, `gridFormT` |
| `gridFormT` | `arcPanT` over `PROGRESS_GRID_ARC_START` → `_END` | per-card peel |
| `sphereFormT` | `FOLD_FIRST_PROGRESS` → `SPHERE_FORMED_PROGRESS` | camera, draw order, interactivity, hint, arc-copy fade-out |
| `scrollT` | sphere formed → `PROGRESS_ZOOM_END` | travel camera, hint fade, pull quote, canvas hide |

`arcPanT` is the only clock that depends on `arcCopyEntryT`, so arc and grid timing depend on how the reader entered.
`scrollT` starts the frame `sphereFormT` reaches 1. `frame.beforeEntry` (scroll above the entry start) hides the canvas;
the canvas must be visible by the time entry starts.

`FOLD_FIRST_PROGRESS` assumes `arcCopyEntryT` is 1, while the per-card fold reads the live `gridFormT`, so entering from
the top, `sphereFormT` can report the fold before any card folds (the camera switches to perspective slightly early).
Anything that must match the cards exactly should gate on `gridFormT` or `fdE`.

### Formation

```
cards       ###arc##|#####peel to grid######|..........peel done............
                       |##################fold to sphere####################
camera      ..ortho.|#############perspective -> CAM_Z_SPHERE###############
arc-copy    ######visible######|~~~~~~~~~~~~~~fade out~~~~~~~~~~~~~~~|gone..
hint text   ....hidden...|#############warp in -> faint##############|#rest#
draw order  ..............index...............|##########depth############
input       ..........................inert..........................|#live#
```

Lanes are in order, not to scale.

### Events

| Gate | What happens |
| --- | --- |
| `scrollY ≥ blockDocTop − ENTRY_LEAD_VH·H` | canvas shown; `arcCopyEntryT` starts |
| `arcCopyEntryT` → `ARC_COPY_IN_ENTRY_T` | arc copy fades in, cards slide in |
| `FOLD_FIRST_PROGRESS` | `sphereFormT` leaves 0: ortho → perspective |
| `arcPanT ≥ PROGRESS_GRID_ARC_START` | peel begins, staggered by index plus jitter |
| `gpLocalT ≥ FOLD_START_LOCAL_T` | that card starts folding |
| `sphereFormT > TEXT_APPEAR_START` | hint plane warps in (sphere only) |
| `ARC_COPY_OUT_FORM_START` → `_END` of the fold window | arc copy fades out |
| `sphereFormT > CARD_ORDER_HANDOVER_T` | draw order switches from index to depth |
| `sphereFormT ≥ SPHERE_INTERACTIVE_T` | drag, hover, tap, auto-spin, cursor, controls go live; hint entrance resolves |
| `BROWSE_VIEW_T` | where a keyboard focus snap lands |
| `SPHERE_FORMED_PROGRESS` | `sphereFormT` = 1, `scrollT` starts |
| `scrollT ≥ startT` | hand-off (see the shared Pull quote) |
| `scrollT ≥ pqAppearT` | last card off screen; hint text at 0 |
| `p ≥ QUOTE_LIVE_P` | DOM quote takes over, canvas hides |
| block end | the world un-sticks; the quote scrolls away with the block |

Texture loading, the barrel's re-solve and the modal aren't scroll-driven.

### Re-deriving the positions

This prints where each event lands per band, from the live constants and CSS. It restates the cue math (`publishCue`,
`syncHeight`) and uses `CARD_H_SPHERE` for the measured `fadeRefH`, so the cue rows are approximate. Paste it into the
browser console on any page served by `npm run libs`:

```js
const T = await import('/libs/c2/blocks/globe-gallery/globe-gallery.js');
const { tAtCamZ, TEXT_APPEAR_START } = await import('/libs/utils/globe/core.js');
const read = (path) => fetch(path).then((r) => r.text());
const css = await read('/libs/c2/blocks/globe-gallery/globe-gallery.css');
const mdCss = css.slice(css.indexOf('@media (width >= 768px)'));
const F0 = T.cardFoldStartProgress(0);
const atForm = (t) => F0 + t * (T.SPHERE_FORMED_PROGRESS - F0);
const cssVh = (p, band) => {
  const re = new RegExp(p + ':\\s*([0-9.]+)vh');
  return parseFloat(((band === 'md' && mdCss.match(re)) || css.match(re))[1]);
};
const js = await read('/libs/c2/blocks/globe-gallery/globe-gallery.js');
const pq = await read('/libs/utils/globe/quote-particles.js');
const pqNum = (k) => +pq.match(new RegExp(k + '\\s*[:=]\\s*(-?[0-9.]+)'))[1];
const liveP = pqNum('arriveStart') + pqNum('arriveSpan') + 2 * pqNum('ARRIVE_JITTER') + pqNum('SETTLE');
const cues = (band) => {
  const body = js.split('\n  ' + band + ': {')[1].split('\n  },')[0];
  const num = (k) => +body.match(new RegExp(k + ': (-?[0-9.]+)'))[1];
  const scrollT = (z) => tAtCamZ(z, num('CAM_Z_SPHERE'), num('CAM_Z_END'), T.TRAVEL_EASE_POW);
  const appear = scrollT(-num('SPHERE_R') + num('NEAR_FADE_END') * num('CARD_H_SPHERE'));
  const startR = +pq.match(new RegExp(band + ': \\{ startR: (-?[0-9.]+)'))[1];
  return { appear, start: Math.min(appear, scrollT(startR * num('SPHERE_R'))) };
};
['sm', 'md'].forEach((band) => {
  const form = cssVh('--globe-formation-vh', band);
  const zoom = cssVh('--globe-travel-vh', band);
  const vh = (p) => (p <= T.SPHERE_FORMED_PROGRESS
    ? (p / T.SPHERE_FORMED_PROGRESS) * form
    : form + ((p - T.SPHERE_FORMED_PROGRESS) / (1 - T.SPHERE_FORMED_PROGRESS)) * zoom);
  const atZoomT = (t) => form + t * zoom;
  const row = (n, v) => console.log(band, String(Math.round(v)).padStart(4) + 'vh', n);
  const { appear, start } = cues(band);
  const done = atZoomT(start) + liveP * pqNum('FLY_VH') * 100;
  row('fold starts / sphereFormT>0', vh(F0));
  row('hint text appears', vh(atForm(TEXT_APPEAR_START)));
  row('arc-copy fade start', vh(T.ARC_COPY_OUT_START));
  row('first card on the shell', vh(T.cardFoldStartProgress(0) + T.PROGRESS_FOLD_DUR));
  row('interactive', vh(atForm(T.SPHERE_INTERACTIVE_T)));
  row('arc-copy gone', vh(T.ARC_COPY_OUT_END));
  row('SPHERE FORMED', vh(T.SPHERE_FORMED_PROGRESS));
  row('hand-off (startT)', atZoomT(start));
  row('last card gone, hint text 0 (pqAppearT)', atZoomT(Math.max(appear, start)));
  row('quote crisp, DOM takes over, canvas hides', done);
  row('block end (--globe-pq-height)', Math.max(done, atZoomT(appear)) + pqNum('READ_VH') * 100 + 100);
});
```

## Phase constants

All in `globe-gallery.js`. To list the exported ones, run
`await import('/libs/c2/blocks/globe-gallery/globe-gallery.js')` in the console of a page served by `npm run libs`.

- **`FOLD_PEEL_OVERLAP`**: each card starts folding while that share of its visible peel is still to run, so the grid
  never fully resolves. The fold opens at raw peel `FOLD_START_LOCAL_T = 1 − FOLD_PEEL_OVERLAP^(1/3)`, the inverse of
  the peel's `easeOutCubic`. The fold window and `cardFoldStartProgress` both derive from it, so camera, draw order and
  interactivity stay aligned. `0` means settle, then fold.
- **`GRID_PEEL_JITTER`** is `2 × GRID_PEEL_STAGGER`, so jitter can move a card to either end of the peel order.
  `GRID_PEEL_WINDOW` is `1 − GRID_PEEL_STAGGER`. Neither is a knob.
- **`SPHERE_INTERACTIVE_T`** is the one gate for everything live. `BROWSE_VIEW_T` must stay above it with margin, or a
  focus snap landing on the threshold can round under it and browse won't enter. `BROWSE_VIEW_SCROLL_FRAC` re-expresses
  it as a fraction of `formedScrollPx()`, which works because formation scroll maps to `progress` linearly.
- **`SPHERE_ORIENT_RESET_T`**: below it, orientation and inertia reset; a dip above it keeps both.
- **Arc copy fade-out** is a fraction of the fold window (`ARC_COPY_OUT_FORM_START` → `_END`) with `easeInOutCubic`.
  `updateArcCopy` also owns `pointer-events`, so the copy is hit-testable only while visible.
- **`ENTRY_LEAD_VH`** (per band) is where entry begins, at most one viewport (the ticker's `rootMargin`).
  `ENTRY_RAMP_VH` is the ramp length. Only `deriveFrame` reads the lead.

### Arc entry and sweep

- Each card's entry rotation (`computeCardEntry`) launches after
  `ARC_ENTRY_STAGGER × min(1, (1 − fanT) / (1 − ARC_DENSE_SPLIT))`, so the far end of the fan launches first, and flies a
  fixed window `1 − ARC_ENTRY_STAGGER`, so cards never catch up. The delay must stay linear in `fanT`, or pairs stop
  separating equally. `ENTRY_ROT_MAX` sets the gap size. Keep `easeInOutQuint`: cards spend the first part of the
  flight off screen.
- `PROGRESS_ARC_PREROLL` equals `PROGRESS_GRID_ARC_START`, so the entry ends where the peel begins.
- **`ARC_RAMP_T`** (per band) is the quadratic start of `arcRotationEase` before it goes linear; `a` is solved so the
  curve ends at (1, 1). Valid only in `(0, 1]`: above 1 the sweep overshoots and past 2 runs backward. A higher ramp
  also keeps cards bunched, since `arcRot0` drives both the fan's swing and its opening.
- `ARC_DENSE_FRACTION` and the card count only redistribute cards between the fan's fixed ends. `ARC_SPAN` narrows the
  fan as it slows it. `ARC_DENSE_COUNT` is clamped to keep at least one card in the spread.

## Choreography

`cardPhase` computes each card's peel ease `gpE` and fold ease `fdE` (and its entry), and returns `baseCA`, a bell over
the entry rotation, peel and fold. `placeCard` then picks one branch, latest phase first:

| Condition | Branch |
| --- | --- |
| `fdE ≥ 1` | `placeSphereCard` (shared); `card.onSphere` is true, which `requireOnSphere` reads |
| `gpE ≥ 1` and `fdE = 0` | `placeGridCard` |
| `fdE > 0` | `placeFoldingCard` |
| otherwise | `placeArcCard` |

- **The fold slerps from `gridQuat`** (upright grid), not the live peel spin, which would flip the face through the
  camera plane. The leftover peel spin (`stage.rotZ − gridTilt`) is reapplied about local Z.
- **The peel lerps its z angle directly**: `peelStartRot` is the first peel frame's rotation normalised to within ±π of
  `gridTilt`. A slerp would take the short way across the wrap and spin backwards.
- The fold's position lerps from the live stage transform, so a fold can open mid-peel without a snap. Its sphere end is
  fully rotated, and the facing tilt blends in by `fdE`. Hover scale is applied during the fold too, or the card pops
  at `fdE` 1.
- Every branch calls `applyCardFit`, including the arc, or a card whose texture lands on the arc keeps stretched UVs.
- **`updateSphereGroupDepth` also runs at `sphereFormT` 0.** It holds `sphereGroup` at `camera.z − foldSphDist`
  while `scrollT` is 0 (`FOLD_SPHERE_DIST → CAM_Z_SPHERE` over `sphereFormT³`), and cards not yet on the sphere subtract
  `sphGroupZ`. Skipping it before the fold makes the group jump on the first fold frame. `foldSphDist`, not the camera
  z, sets apparent size through formation; the hint plane scales off it.
- **Grid**: column-major, card 0 lower-right, sweeping up then left. `GRID_WINDOW_COLS` sets card size and the framing
  window (on sm the window spans the viewport exactly; on md it spans more); `GRID_ROWS` is the column wrap. The grid is
  `max(GRID_WINDOW_COLS, ceil(N / GRID_ROWS))` columns, and `colShift` centres the overflow in whole columns, so
  framing holds at any count. `computeGridLayout` reruns on resize and writes through the existing vectors.

### Cameras and the nav offset

The arc and grid render through an orthographic camera (1 world unit = 1 CSS px; `arcCamZ` puts the perspective camera
at the same scale for the hand-over). `activeCamera` switches at `sphereFormT` 0. The nav offset is
`navH / 2 × sphereFormT`, so the arc stays full-bleed and registered to the viewport.

### Draw order

`applyCardOrder` is the only writer of `renderOrder`, after placement:

| `sphereFormT` | Key |
| --- | --- |
| ≤ `CARD_ORDER_HANDOVER_T` | `CARD_ORDER_BASE + i`: index order, the entrance stack |
| above | the shared depth key, from the card's destination slot |

The key must be per card, or ties fall through to live depth mid-fold. On the sphere the switch is a no-op (slots are
sorted by depth). On the barrel it is a real reorder: slots are sized from their own card, so they can't be permuted.

## Arc copy and layout

- The arc copy is `position: fixed`; CSS sets its edges. `--globe-content-inset` is the pull quote's text edge
  (`max(0px, 100% − --globe-copy-max) / 2 + --globe-copy-pad`), so the two share one left edge. md+ offsets the box back
  by `--globe-arc-pad` to align the copy, not the pill. The logical property handles RTL.
- `beforeBuild` places the arc copy before `.globe-world` under reduced motion and after it otherwise, and clears the
  canvas's inline `position`, which the pull quote's `manageCanvas` left from the previous build. CSS then decides:
  `fixed`, or `absolute` under `.globe-reduced`. The disposer clears the arc copy's inline styles.
- Under reduced motion the arc copy is static in normal flow before a viewport-tall globe, with the quote after it;
  `updateArcCopy` returns early. The focus snap targets the globe's own top. `.globe-reduced` overrides sit at the end
  of `globe-gallery.css`.
- `.globe-a11y-cards` is `position: fixed` in this block.
- The barrel's hint row scrim matches `.globe-modal-info`; its chevrons share the modal arrows' box properties. Its
  position doesn't match the modal arrows, and the pair blinks across a modal open; check changes on a device.

## Breakpoints

`sm` and `md` split at `BREAKPOINTS.md.minWidth`; `md` covers Milo md and lg. Both bands render every authored card.
`bp` carries every `BREAKPOINTS` field; `bpExtras` adds the derived `FOLD_SPHERE_DIST` (≈70% of the viewport height at
fold start) and `ARC_DENSE_COUNT`.

Every authored card is resident at both bands, so check texture memory (shared README, Textures) before growing the
set; iPad takes the md profile.

## Analytics

Labels use `--globe_gallery` (`card_open`, `enter_gallery_kbd`, `rotate_left` / `rotate_right`,
`pause_spin` / `resume_spin`), plus the shared modal labels. Badge CTAs get `<product>--globe_card_modal`, minted in
`renderModalContent` with no index (one product, one label) and cut to the segment length limit. The full chain for a
CTA is `Photoshop|globe_card_modal|b2|globe-gallery|s3`. The ratio the block answers is badge CTA clicks over
`card_open`. Nothing is tracked per card.

## Tests

- `test/c2/blocks/globe-gallery/globe-gallery.test.js`: the reduced-motion arc copy against the CSS, `optimizeImgUrl`,
  `parseAuthoredContent`, `fetchFragmentCards`, `buildGlobeDom`, the timeline math and frame shape, controls and a11y.
- `globe-gallery-decorate.test.js`: `init` against `mocks/*.html` (empty state, labels, modal scaffolding, arc copy,
  pull-quote variants, localized labels, unique ids across two blocks).
- `globe-gallery-interactive.test.js`: pointer interaction, cursor, materials and texture loaders, the modal DOM and
  badge parsing.

There is no E2E for the WebGL path; the scroll choreography is verified by VQA.
