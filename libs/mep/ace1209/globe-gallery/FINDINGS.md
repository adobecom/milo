# Globe-gallery — remaining tuning & robustness findings

**A, B, C, D (safe half) and E are done** — see the git log and README (Lifecycle timeline). What
they had in common is recorded below as the lesson; what is left is lower-value or unmeasured.

---

## The lesson these all came from

The pull-quote's reveal cue was *correctly derived* — from the wrong fact. It computed the frame the
camera **geometrically passes** the deepest card, but `updateCardTransforms` **hides** a card a whole
proximity-fade band earlier (`mesh.visible = proxFade > 0`).

Generalised: **a threshold reasons about the scene's geometry while the renderer has already made a
different decision.** Nothing in a review catches that, because both halves are individually correct.
Only a measurement catches it. The fixes above all took the same shape — state the threshold
*relative to the derived cue* instead of as a free number, so the two cannot drift:

| Was | Now |
| --- | --- |
| `TEXT_ZOOM_FADE_RATE = 3` | fades linearly to 0 **at** `pqAppearZoomT` |
| `CURSOR_ZOOM_RETIRE_T = 0.35` | `pqAppearZoomT` (retires with the controls) |
| `CANVAS_HIDE_ZOOM_T = 0.95` | `pqAppearZoomT + CANVAS_HIDE_MARGIN_T`, **and the draw is skipped** |
| `--gg-pq-appear-t` published in `zoomT` space | published in tail space via `ZOOM_TO_TAIL_T` |
| `REVEAL_RATE` / `HOVER_RATE` / `MASONRY_MORPH_RATE` frame-locked | rescaled by `frame.dtScale` |

So the two questions to ask of every threshold below are:

1. Does this number describe *what the viewer sees*, or only *where something is*?
2. If it drifted, would anything fail loudly — or would it just quietly look slightly wrong?

---

## D (remaining). `PROGRESS_ZOOM_END = 1.00` welds camera pacing to quote room

**Confidence: verified. The latent CSS/JS unit bug is fixed (`ZOOM_TO_TAIL_T`); the coupling is
not.** Deferred deliberately — nothing is pressing on it, and the one open question needs eyes on a
real page, not more arithmetic.

`--gg-runway-height: 540vh` minus `--gg-formation-vh: 304vh` leaves a 236vh tail, and `zoomT` spans
**all** of it. So a single number sets both the camera's fly-through pace and how much scroll the
quote gets: a longer quote hold slows the camera, a snappier fly-through starves the quote.

**The change.** Three named additive segments — `--gg-formation-vh` + `--gg-flythrough-vh` +
`--gg-quote-vh` = `--gg-runway-height` — with `zoomT` spanning only the flythrough, plus retargeting
`CAM_Z_END` from `-60` to the geometric clear point (`-24.6` md, `+1.6` sm). The camera currently
travels 35 units md / 62 units sm *past* the point at which nothing is visible.

**What it buys, beyond the tuning freedom.** If the flythrough ends at the clear point then
`pqAppearZoomT ≡ 1` by construction, and a chain of machinery becomes unnecessary:

- `--gg-pq-appear-t` — the JS→CSS handshake — deleted.
- `ZOOM_TO_TAIL_T` deleted; the unit mismatch it guards can no longer exist.
- The pin's `bottom` collapses from
  `(1 - var(--gg-pq-appear-t)) * (runway - formation) - center - min(hold, hold-max)`
  to `var(--gg-quote-vh) - center - min(hold, hold-max)`.

**What it costs.**

- **The canvas-hide fix has to be reworked.** `zoomT >= pqAppearZoomT + CANVAS_HIDE_MARGIN_T`
  becomes `>= 1 + margin`, which is unreachable. It would need to key off progress past the
  flythrough instead.
- **The fly-through's feel changes, and this is the open question.** Same duration over a shorter
  z-span means the camera eases to a near-stop exactly as the quote appears, instead of sailing
  past at speed. That could read as settling into the quote, or as stalling. Only a real page
  answers it — and if the answer is "stalling", the whole change is off, because the
  `pqAppearZoomT ≡ 1` identity is what pays for everything above.
- **`--gg-flythrough-vh` has to track `fadeRefH`**, which is measured after textures land. Either
  JS publishes the segment back to CSS (the handshake returns in a different costume), or someone
  authors a vh number that must stay in sync with scene geometry — the exact drift failure the rest
  of this document is about.

- **Risk:** `zoomT` feeds camera, cursor, hint text, canvas hide, controls and pull-quote; all shift
  together. Behaviour is preserved if `flythrough == current tail`; shorten deliberately afterwards.
- **Do first:** rebuild the probe (J). Retargeting `CAM_Z_END` blind is how the original bug happened.

## E (remainder). `modalWarp *= 0.85` is the last frame-locked rate, and it is in modal.js

**Confidence: verified by inspection; low impact.**

`src/modal.js:837`. Every other per-frame rate in the block now takes `frame.dtScale`; this one
cannot, because `updateAnimation(sphereRotActive)` is not handed the frame. It is the residual
decay of a swipe/pull warp once the modal settles — ~717ms to reach zero at 60Hz, ~358ms at 120Hz.

The rest of modal.js is already refresh-rate independent: its open/close fly is time-based
(`(now - modalAnimT0) / MODAL_ANIM_DURATION`), not frame-counted, so this is genuinely the only one.

- **Direction:** widen `updateAnimation` to take `frame` (or just `dtScale`) and apply
  `** dtScale`, the same form as `DRAG_FRICTION` / `PITCH_RELAX`. It is an API change to the
  modal module for one cosmetic decay — worth doing next time that signature is touched anyway,
  not on its own.

## F. `PQ_HOLD_CLEARANCE_VH = 4` is an unexplained vh

**Confidence: verified as a magic number; low impact.**

`globe-gallery.js:15`. The breathing room kept between the held quote's bottom edge and the next
section's top. 4vh is arbitrary and does not scale with anything. Now that the ceiling is slack
(71–100vh against a 52vh preference) it is not binding, so this is low priority — but it would
become load-bearing again if the runway shrinks.

- **Direction:** express as a share of the quote box or of `--gg-optical-center`, so it scales.

## G. `--gg-nav-h` fallback `124px` is a measured value that can silently drift

**Confidence: verified; already flagged in the README's naming section.**

`calc(var(--gnav-height-nav, 72px) + var(--feds-breadcrumbs-height, 52px))`. The two fallbacks are
*measured* pixel heights of Adobe chrome, not design tokens. If gnav or the localnav changes height
while those vars stay undefined, the optical centre, the controls' offset, the camera's centring and
the hold ceiling all shift together with nothing failing loudly.

- **Direction:** if a runtime measurement of the real chrome is available, prefer it and keep the
  constants only as a last-resort fallback. Failing that, a dev-mode assertion comparing the
  fallback against the measured height would at least make drift loud.

## H. Arc/grid phase constants are undocumented magic

**Confidence: unverified — may all be deliberate.**

`ARC_STAGGER = 0.594`, `ARC_DENSE_SPLIT = 0.50`, `GRID_GAP_RATIO = 0.5`, `ARC_PEEL_JITTER = 0.40`,
`GRID_PEEL_STAGGER = 0.20`, `FOLD_PEEL_OVERLAP = 0.35`. `0.594` in particular looks like a value that
was solved for rather than chosen.

Worth noting that `timeline.js` is otherwise a **good example of the pattern to imitate**:
`FOLD_FIRST_PROGRESS` and `SPHERE_FORMED_PROGRESS` are *derived* from the peel constants rather than
authored alongside them, so they cannot drift apart. The question is only whether the inputs
themselves have recoverable reasons.

- **Direction:** archaeology, then a comment each — or a derivation where one exists. No behaviour
  change.

## I. The unit convention worth spreading

`NEAR_FADE_START = 2.5` / `NEAR_FADE_END = 1.6` are expressed **in card-heights**, not world units.
That is why they survive every change to `SPHERE_R`, card sizing and breakpoint, and it is why the
corrected reveal formula composes cleanly with them.

The same trick applies wherever a distance constant is currently in world units or vh. Candidates:
`PQ_HOLD_CLEARANCE_VH` (F), `DRAG_FLIP_MAX_CAM_FRAC` (already a fraction — good), `CA_PX_MAX = 4`
(pixels; does not scale with viewport or DPR).

## J. Rebuild the probe first, and cover the formation phases this time

The probe that found the reveal bug covered only the pull-quote end of the timeline, and has been
removed. Every finding here was either settled or *created* by having a measurement, and the ones
still unconfirmed (H, and half of D) are unconfirmed precisely because nothing reports them.

- **Direction:** rebuild from **README → Rebuilding the scroll-model probe**, then add rows for
  `sphereFormT`, `arcPanT`, hint-text opacity, cards-with-textures, and the live frame `dtScale`.
  `dtScale` is now applied everywhere, so a live readout is the way to confirm it behaves under load.
- **Carry the caveats over:** the card count tests each card's *centre* against NDC ±1.25, not its
  bounds, because this three build exports no `Frustum`/`Sphere`/`Box3`. It reports *presence*, not
  legibility — one far card counts as one, so "empty" and "sparse" look identical.

---

## Suggested order

1. **J** — rebuild the probe; H and the remaining half of D are guesswork without it.
2. **D (remaining)** — the one real structural change left.
3. **F, G, H** — lower-value.
