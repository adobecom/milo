# pdf-space

Scroll-driven hero animation: cards fan in along an arc, peel onto a flat
grid, then glide into the slots of an Acrobat product mockup.

The block element is **650vh** tall and pin-scrolled (sticky stage at
`top: 0`). Page scroll (px) is normalized to `0..1` across the pinned range,
then stretched onto an abstract timeline budget `animScrollTotal`
(~4552 on desktop, ~3111 on mobile). All phase boundaries below are positions
on that abstract budget — independent of viewport or block height.

## Phase timeline (desktop)

```
abstract scroll units (desktop):
0       535                     1532                    3132            4552
│        │                       │                       │               │
├────────┴───────────────────────┤                       │               │
│  arcPan: 0 → 1 by scroll 1350  │ (arc pan completes    │               │
│  Cards rotate CCW around       │  before gridEnd;      │               │
│  fanCenter from lower-right    │  rotation done first) │               │
│  through to upper-left.        │                       │               │
│        │                       │                       │               │
│        ├───────────────────────┤                       │               │
│        │ arcToGrid: 0 → 1      │                       │               │
│        │ Arc flattens, cards   │                       │               │
│        │ peel onto flat grid   │                       │               │
│        │ (staggered by fanIdx) │                       │               │
│        │                       │                       │               │
│        │                       ├───────────────────────┤               │
│        │                       │ settle (no phase var) │               │
│        │                       │ Cards rest on grid;   │               │
│        │                       │ column compression +  │               │
│        │                       │ text-block pans up;   │               │
│        │                       │ ADBE logo draws in.   │               │
│        │                       │ Driven by             │               │
│        │                       │ arcTextPanProgress.   │               │
│        │                       │                       │               │
│        │                       │                       ├───────────────┤
│        │                       │                       │ slotting: 0→1 │
│        │                       │                       │ Cards glide   │
│        │                       │                       │ into Acrobat  │
│        │                       │                       │ mockup slots; │
│        │                       │                       │ mockup +      │
│        │                       │                       │ title + CTA   │
│        │                       │                       │ slide up.     │
ANIM_CONFIG.peelStart-  ANIM_CONFIG.arcPanEnd  gridEnd          slottingStart    +slottingDuration
Scroll (535)            (1350 duration)         (ANIM_CONFIG.    (DESKTOP_         (4552 = total
                                                desktopPeelEnd   SLOTTING_START    if post-reveal=0)
                                                = 1532)          = 3132)
```

## Why the phases overlap and gap

- `arcToGrid` starts later than `arcPan` (10% intro window before peel
  begins) and finishes earlier — peel runs over a shorter scroll distance
  than the rotation. The remaining `arcPan` progress past `gridEnd` is
  invisible (cards are already off the arc).
- The 37%-of-timeline gap between `gridEnd` and `slottingStart` is the
  **settle** period. It has no phase variable, but the column compression,
  marketing-text pan-up, and ADBE logo draw all run during it, driven by
  `arcTextPanProgressCached`.

## Mobile differences

Mobile collapses the settle gap and adds a **post-reveal pan** after
slotting so the CTA can clear a tall stack. See `refreshFrameProfile()`
for the mobile timing constants.

## Tuning the animation

All visual parameters live in the `ANIM_CONFIG` object at the top of `pdf-space.js`,
grouped by phase. This section is the reference — pair it with the phase
timeline above. Numbers in the tables below are the current defaults.

### Phase scroll boundaries (desktop)

The four positions/durations that define the desktop timeline. Together
they sum to `animScrollTotal` (excluding any post-reveal pan).

| Key | Default | What it does |
| --- | ---: | --- |
| `peelStartScroll` | 535 | Scroll position where peel begins. Raise to give the arc more rotation airtime before cards start peeling onto the grid; lower to start peeling sooner. |
| `desktopPeelEnd` | 1532 | Scroll position where peel completes (all cards parked on the flat grid). Peel window = `peelStartScroll → desktopPeelEnd`. |
| `arcSettleDuration` | 1600 | Scroll gap between peel-end and slotting-start. Drives column compression, marketing-text pan-up, and the ADBE logo draw. Shorter = snappier transition into the mockup; longer = more breathing room for the marketing copy to land. |
| `desktopSlottingDuration` | 1420 | Length of the slot-into-mockup animation. Shorter = snappier slot-in; longer = more cinematic mockup arrival. |

**Recipe — extend rotation phase without growing the total block scroll:**

1. Raise `peelStartScroll` by Δ (e.g. 535 → 700, Δ = 165).
2. If you want peel pacing preserved, raise `desktopPeelEnd` by the same Δ.
3. To keep `animScrollTotal` constant, subtract Δ from `arcSettleDuration`
   and/or `desktopSlottingDuration`. **Eat from `arcSettleDuration` first** —
   during settle the cards are just sitting on the grid, so shortening it
   is less noticeable than rushing the headline mockup slot-in.

**Recipe — slow rotation feel without changing phase boundaries:**

Lower `arcSweepMultiplier` (e.g. 1.0 → 0.7) and scale `arcCwStart` by the
same factor (e.g. 0.6 → 0.42). Both halves of the rotation slow together,
so the pre-pin and post-pin rates stay matched.

### Arc rotation feel

The rotation is one continuous sweep spanning pre-pin and arc-pan, driven
by two terms summed into `rotationOffset`:

- **`cwBoost = arcCwStart * (blockTop / vh)`** — decays linearly from
  `arcCwStart` to 0 as the block scrolls into pin.
- **`arcSpan * arcSweepMultiplier * phase.arcPan`** — runs post-pin.

For a constant perceived rate across pin, pick
`arcCwStart ≈ arcSpan * arcSweepMultiplier / arcPanScroll_in_vh` (~0.49 at
the defaults). `arcCwStart` also sets the off-screen starting angle — at
pre-pin start it pushes the arc into the lower-right corner via rotation
alone. Raising it lengthens that swing without changing post-pin rotation
speed; lowering it makes cards start closer to their orbital rest position.

`arcPanEnd` and `arcSweepMultiplier` look similar but do different things:

- `arcPanEnd` is the scroll budget for `arcPan` 0 → 1. Lowering it shortens
  arc-pan, but also pulls peel start earlier (peel uses the same `arcPan`).
- `arcSweepMultiplier` scales the total angle swept by `arcPan`. Use this
  to change rotation speed without moving any phase boundary.

| Key | Default | What it does |
| --- | ---: | --- |
| `arcCwStart` | 0.6 | Extra CW rotation (rad) at pre-pin start, decaying to 0 at pin. Sets both the off-screen starting angle (rotates the arc into the lower-right corner before scrolling unwinds it) and the pre-pin rotation rate. |
| `arcApexLift` | 0.10 | Vertical bias of the arc apex (card 7's rest y) as a fraction of vh. Card 7 lands at `vh * (0.5 - arcApexLift)`. |
| `prePinSlideY` | 0.3 | Uniform downward Y offset (fraction of vh) applied during pre-pin, decaying via `1 - easeOutSine(phase.slideT)` to 0 by `phase.slideT = 1`. Pushes the whole arc below its orbital position so short viewports don't clip the lifted apex; no X component and no per-card stagger, so the relative motion between cards stays purely orbital. Set to 0 to disable. |
| `arcPanEnd` | 1350 | Scroll units for `arcPan` to go 0 → 1. |
| `arcSweepMultiplier` | 1 | Multiplier on `arcSpan` for total post-pin sweep. |
| `arcSpan` | 0.80 | Angular span (radians) of the arc fan. Wider = cards spread further along the arc. |
| `arcStagger` | 0.50 | Per-card peel-wave lag. 0 = all cards peel simultaneously; values near 1 = fully staggered. |
| `arcLiftZoom` | 1.00 | Scale boost during arc phase. Higher = bigger card "pop" before peel. |
| `arcFanDepthDelta` | 0.30 | Fake-depth scale falloff across the fan: fanIdx=7 at 1.0×, fanIdx=0 at `(1 - delta)×`. |
| `arcYTilt` | 25 | Y-axis 3D tilt magnitude (degrees) per card during arc. |
| `arcXTilt` | 10 | X-axis 3D tilt, paired with `arcYTilt`. |
| `arcPushDistance` | 60 | Pixels each card pushes outward along the arc normal as peel begins. |
| `arcShadowAlpha` | 0.15 | Base shadow opacity on arc cards; fades to 0 through peel. |

### Pre-pin pan-up compensation

The sticky stage scrolls naturally with the page until it pins, which would
pull every card up in the viewport along with the stage. To keep the
rotation reading as an orbit around `fanCenter`, each card's `translateY`
is offset by `-prePinOffset` (= `max(0, blockTop)`). At pin the offset is 0
and post-pin behavior is unchanged.

The topmost cards sit at negative stage-local Y early in pre-pin and are
clipped at the stage's `overflow: hidden` edge; they reveal as the stage
rises while their viewport position stays put.

`arcApexLift` lifts card 7's resting Y above the viewport center, which on
short viewports would push the lifted apex past the top edge while the arc
is still rotating. Rather than lowering the at-rest apex on those viewports,
the renderer adds a **uniform pre-pin Y slide**: `vh * prePinSlideY *
(1 - easeOutSine(phase.slideT))`. Every card receives the same downward
offset, so cards rotate around the same translating center — relative
motion between cards stays purely orbital. The slide fades out by
`phase.slideT = 1` (≈ `slideOverlap` scroll units past pin); post-pin
behavior is unchanged. Tune `prePinSlideY` upward if a target viewport
still clips at the top during pre-pin; lower it for a subtler entry.

### Card entry ramps

`phase.slideT` (0 → 1 across pre-pin + first ~200 scroll units post-pin)
drives the per-card opacity fade-in, scale ramp, and the uniform
`prePinSlideY` described above. The per-card lag (`slideStagger`) only
affects opacity and scale — the Y slide is unstaggered so cards stay
coherent as a single rotating arc.

| Key | Default | What it does |
| --- | ---: | --- |
| `slideStagger` | 0.45 | Per-card arrival lag. `fanIdx=7` is first, `fanIdx=0` last. |
| `slideScaleStart` | 0.85 | Scale at entry; grows to 1.0 over `slideT`. |
| `slideOverlap` | 200 | Scroll units past pin where `slideT` reaches 1. |
| `slideOpacityRampTo` | 0.25 | Per-card `slideT` value at which opacity hits 1. Lower = sharper appear. |

### Grid layout (post-peel resting positions)

Geometry of the flat 2×4 card grid that cards peel onto. `baseColumnSpread`
and `baseRowGap` set the resting layout; `columnCompressionTarget` is the
target spread the grid compresses toward during settle (to make room for
the marketing text).

| Key | Default | What it does |
| --- | ---: | --- |
| `baseColumnSpread` | 1.20 | Horizontal spread of the 4 columns, as fraction of vW. Higher = cards spaced wider apart. |
| `baseRowGap` | 0.60 | Vertical gap between the 2 rows, as fraction of vH. |
| `columnCompressionTarget` | 0.675 | Column spread the grid compresses toward during settle. Lower = stronger squeeze. |
| `cardScaleDesktop` | 1.035 | Base scale applied to cards on the desktop grid. |

### Mockup positioning (resize-time, not scroll-driven)

These set the *rest position* of the Acrobat mockup, applied during
`resize()`. They don't animate; they just determine where the mockup lives
at the end of the slotting phase.

| Key | Default | What it does |
| --- | ---: | --- |
| `desktopPeekStartH` | 960 | Viewport height (px) below which the mockup peeks above the fold at rest. Used to keep the mockup visible on short viewports. |
| `desktopPeekAmount` | 0.30 | Fraction of mockup height that peeks when peeking is active. |
| `mobileHeadlineY` | 0.12 | Mobile headline Y position at rest, as fraction of vH. |

### Mockup slot-in scale curve

Each pair is `(startScale, endScale)`, driven by `phase.slotting` 0 → 1.
The mockup translates from below the viewport while scaling from start to
end. A start scale > 1 means the mockup arrives oversized and shrinks
into place; useful for emphasis.

| Key | Default |
| --- | ---: |
| `desktopMockupStartScale` | 2.5 |
| `desktopMockupEndScale` | 1.0 |
| `mobileMockupStartScale` | 2.0 |
| `mobileMockupEndScale` | 1.0 |

### Mobile-specific timing

Mobile compresses the settle gap and adds a post-reveal pan after slotting.
The post-reveal scroll budget is computed at resize time from how far the
stack overflows the viewport (mirrors the desktop pattern), so scroll velocity
through the post-reveal pan stays roughly 1:1 with the pan motion.

| Key | Default | What it does |
| --- | ---: | --- |
| `mobileSettleDuration` | 468 | Compressed settle gap on mobile (replaces `arcSettleDuration`). |
| `mobileSlottingDuration` | 900 | Mobile slotting animation length. |
| `mobileArcAngle` | 0.6 | Fixed mobile arc angle (rad). Desktop uses `atan2(vH, vW)` so arc shape varies with aspect ratio; mobile pins this to keep the arc consistent at narrow widths. |

## Authoring contract

`parseAuthoredContent` expects exactly **6 rows** (direct children of the block element),
in this order:

| Row | Columns | Content |
| --- | --- | --- |
| 0 — image row 0 | 4 | One cell per card in desktop grid row 0. Each cell: `<picture><img>` + label text. |
| 1 — image row 1 | 4 | One cell per card in desktop grid row 1. Same format as row 0. |
| 2 — text block | 1 | Marketing copy shown during settle + slotting. Gets class `text-block`. |
| 3 — title | 1 | Headline `<h2>`/`<h3>` + optional subcopy `<p>`. Gets class `acrobat-title`. |
| 4 — mockup | 3 | Col 0: mobile mockup `<picture>`. Col 1: desktop mockup `<picture>`. Col 2: desktop panel/sidebar `<picture>`. |
| 5 — CTA | 1 | Call-to-action link. Gets class `acrobat-cta`. |

Card image dimensions matter: `parseAuthoredContent` reads the `width` and `height` attributes of the card `<img>` to derive the card's aspect ratio and set `card.baseHeight`. Missing attributes fall back to `192×230`.

Row 1 (grid row 1) is **hidden on mobile** (`mobileHidden: true`). The 4 cards from row 0 reflow into a 2×2 mobile grid where `mobileColIdx = colIdx % 2` and `mobileRowIdx = floor(colIdx / 2)`.

## Card data model

Each element of `sceneCards` is a plain object created by `buildCardStack`:

| Property | Type | Description |
| --- | --- | --- |
| `colIdx` | 0–3 | Column in the 2×4 authored grid. |
| `rowIdx` | 0–1 | Row in the 2×4 authored grid. |
| `mobileColIdx` | 0–1 | Column in the mobile 2×2 grid. |
| `mobileRowIdx` | 0–1 | Row in the mobile 2×2 grid. |
| `mobileHidden` | bool | `true` for row-1 cards; hidden on mobile. |
| `fanIdx` | 0–7 | Arc position; see [Fan-index mapping](#fan-index-mapping). |
| `width` | px | Rendered width — `CARD_WIDTH` on desktop, scaled on mobile; updated by `resize()`. |
| `height` | px | Rendered height — aspect-ratio-derived, scaled on mobile; updated by `resize()`. |
| `baseHeight` | px | Intrinsic card height from authored image (never changes after parse). |
| `baseX` / `baseY` | px | Grid resting top-left corner; recomputed each frame by `positionCards()`. |
| `visualCx` / `visualCy` | px | Center of the card as last rendered. `NaN` until the first render pass — `getCanvasCardCenter` falls back to `baseX/Y` when the value is not finite. |
| `el` | Element | The card `<div>` inside `.card-stack`. |
| `labelEl` | Element\|null | The `.card-label-outer` element rendered below the card. |
| `lastZIndex` / `lastArcShadowAlphaKey` | string | Dirty-check cache — avoids writing unchanged inline styles every frame. |

## Fan-index mapping

Cards are authored in a 2×4 grid but mapped to 8 arc positions (`fanIdx` 0–7) by `FAN_INDEX_BY_GRID_POSITION`:

```
Authored grid → fanIdx:

          col 0   col 1   col 2   col 3
row 0  →    7       5       3       1
row 1  →    6       4       2       0
```

`fanIdx = 0` (col 3 / row 1, lower-right) peels off the arc **first**.
`fanIdx = 7` (col 0 / row 0, upper-left) peels off the arc **last**.

On the arc the fan is evenly distributed from upper-left to lower-right; the stagger coefficient `ANIM_CONFIG.arcStagger` gates how much of the `arcToGrid` range each card uses before it starts peeling (`delay = fanIdx / FAN_LAST_INDEX * arcStagger`).

## Render loop pipeline

`loop()` is called once per animation frame (via `requestAnimationFrame`). The
call order within each frame is fixed:

1. **`refreshFrameProfile()`** — update `frame.isMobile/isTablet`; write
   breakpoint-appropriate values into `timing.*`.
2. **`updateAnimationProgress()`** — convert `window.scrollY + block geometry`
   → `scrollCurrent` (abstract units) → `phase.{arcPan, arcToGrid, slotting, slideT}`
   via `derivePhases()`.
3. **`buildArcCtx()`** — precompute arc geometry (radius, center, angles, flatten
   blend). Expensive trig done once per frame here so `getFanCenter` (called once
   per card) only does cheap arithmetic.
4. **`updateMockupAndTitleTransform()`** — drive mockup slot-in scale/translate
   and title/CTA fade via CSS custom properties on `.pdf-space-stage`.
5. **`updateAdbeLogo()`** — drive the stroke-dashoffset draw-on via
   `--adbe-draw` and `--adbe-opacity`.
6. **`updateCompressionAndPan()`** — update `cardGridLayout.columnSpread/rowGap`
   (post-peel compression toward `columnCompressionTarget`) and
   `verticalPan.arcGridY` (pan up to clear room for the marketing text).
7. **`updateTextBlock()`** — position and fade the `.text-block` element.
8. **`positionCards()`** — recompute `card.baseX/baseY` for all cards based on
   current `cardGridLayout` and `frame`. Pure state update; no DOM writes.
9. **`canvasGrid.update()`** — physics tick for the dot grid (spring, damping,
   pointer repel).
10. **`canvasGrid.draw()`** — clear and redraw the canvas.
11. **`updateCardPositions()`** — apply `transform`, `opacity`, `boxShadow`, and
    `zIndex` to each card element; also positions card labels.

`buildArcCtx` (step 3) writes to the closure-level `arcGeometry` object; all
subsequent per-card calls to `getFanCenter` read from it without re-running trig.

## `derivePhases(scroll, prePinY, vph, timing)`

Pure function (exported) that converts raw scroll inputs to the four phase
progress floats. Called by `updateAnimationProgress` each frame; also
importable for unit tests.

| Parameter | Type | Description |
| --- | --- | --- |
| `scroll` | number | Abstract scroll position (`0…animScrollTotal`). |
| `prePinY` | number | `Math.max(0, blockTop)` — positive while the block's top edge is still below the viewport fold. Zero once the block is pinned or scrolled past. |
| `vph` | number | Viewport height in px. |
| `timing` | object | `ANIM_STATE.timing` snapshot (`gridEnd`, `slottingStart`, `slottingDuration`). |

Returns `{ slideT, arcPan, arcToGrid, slotting }` — all clamped to `[0, 1]`.

The four phases intentionally overlap: `arcPan` and `arcToGrid` are both
non-zero between `peelStartScroll` and `arcPanEnd` (the arc rotates *while*
unfolding). Enforcing non-overlap would require fake intermediate states and
would change the visual.

## CSS custom-property bridge

JS writes these custom properties on `.pdf-space-stage` each frame; CSS reads
them to drive transforms and visibility. Any CSS maintainer editing `pdf-space.css`
should treat this table as the JS↔CSS contract — renaming a property here
requires a matching change on the other side.

| Property | Written by | Consumed by | Notes |
| --- | --- | --- | --- |
| `--mockup-y` | `updateMockupAndTitleTransform` | `.acrobat-desktop-mockup`, `.acrobat-mobile-mockup` | translateY for slot-in slide + post-reveal pan. |
| `--mockup-scale` | same | same | Scale for slot-in zoom. |
| `--title-y` | same | `.acrobat-title` | Same value as `--mockup-y` on desktop; on mobile identical offset. |
| `--title-scale` | same | `.acrobat-title` | Subtle grow (0.92 → 1.0) on desktop only. |
| `--title-opacity` | same | `.acrobat-title` | Fades title in during slotting. |
| `--cta-y` | same | `.acrobat-cta` | Moves CTA in sync with mockup. |
| `--adbe-draw` | `updateAdbeLogo` | `.adbe-logo-path` via `stroke-dashoffset` | 0 = fully drawn, 1 = invisible. |
| `--adbe-opacity` | `updateAdbeLogo` | `.adbe-logo-svg` | Separate fade envelope (quick in, fades out at slotting). |
| `--adbe-logo-length` | `buildStage` (once) | `.adbe-logo-path` via `stroke-dasharray` | Total path length × 2 + 500; set once at mount. |
| `--acrobat-mobile-mockup-width` | `buildStage` (once) | mobile mockup centering | Set once at mount; CSS uses it for `width` and `left` offset. |

The ADBE logo draw-on works by setting `stroke-dasharray = pathLength` and
animating `stroke-dashoffset` from `pathLength → 0`. Because
`getTotalLength()` can under-report on some browsers, the stored length is
`max(getTotalLength(), 3000) * 2 + 500` (the buffer ensures the dash starts
fully offscreen).

## Canvas dot-grid

`createCanvasGrid` is an isolated subsystem with its own event listeners. It
renders a spring-physics dot grid behind the cards.

**Physics (runs inside `canvasGrid.update()` each frame):**

Each dot stores `(x, y, velocityX, velocityY, originX, originY)`. Per tick:

1. If the pointer is within `CANVAS.mouseRadius` of a dot, apply an outward
   repel impulse proportional to `(1 - distance / mouseRadius) * repelForce`.
2. Add a spring force back toward `(originX, originY)`: `spring * (origin - pos)`.
3. Multiply velocity by `damping` (0 < damping < 1) each tick to attenuate.
4. Integrate velocity into position.

**Card-proximity boost:** When the pointer is within 280 px of any card
center, `mouseRadius` and `repelForce` scale up (max 2.5× and 1.8× respectively)
so the dot field "breathes" more around interactive cards.

**`settled` flag:** When the pointer has left the element AND all dots'
combined positional error + velocity falls below 0.05, the grid is marked
settled and the physics loop is skipped entirely (snap dots back to origin
and bail). This avoids burning a full physics pass every frame when nothing
is moving.

**Pointer coordinate sync:** `pointerViewport` stores the last known cursor
in `clientX/Y` (viewport space). Each frame `syncPointerCanvas()` translates
it into canvas-local coordinates via `getBoundingClientRect()`. This
translation runs every frame (not just on `mousemove`) because scroll can
shift the canvas under a stationary cursor without firing a new event.

**Fade:** Dot alpha = `0.45 * phase.arcToGrid`. The grid is fully transparent
during the arc phase and reaches full opacity as cards settle onto the grid.

**Mobile:** All physics are skipped on mobile; the canvas is cleared every
frame but never drawn (early-return in `update()`).

## Lifecycle management

The rAF loop runs only while the block is in the visible viewport:

- **Start / re-layout:** An `IntersectionObserver` with `rootMargin: '200px 0px'`
  calls `resize()` then `startLoop()` when the block enters the extended viewport.
  The 200 px buffer ensures the loop is warm before the block scrolls into view.
- **Stop:** The same observer calls `stopLoop()` (which calls
  `cancelAnimationFrame`) when the block leaves the extended viewport.
- **Resize:** `window.resize` is debounced at 120 ms and calls `resize()`,
  which recomputes viewport dimensions, card sizes, mockup geometry, and the
  `timing.*` values for the active breakpoint.
- **Cleanup:** A `MutationObserver` watches the block's **parent** for
  `childList` changes. When the block is removed from the document it:
  stops the rAF loop, disconnects both observers, removes the resize listener,
  and calls `canvasGrid.destroy()` to remove pointer event listeners.

`stopLoop` does not clean up observers — cleanup only happens on DOM removal.
This keeps the re-entry path simple: if a SPA re-inserts the block, the
`IntersectionObserver` will restart the loop automatically.

## Z-index layering

The block uses **two stacking contexts**:

1. `.pdf-space-stage` — the outer context (the sticky stage element).
2. `.card-scene` — an inner context, established by setting `z-index: 25` on
   it inside the stage.

Because `.card-scene` is its own stacking context, any z-index applied to a
card inside it is **scoped to that inner context**. The card z-indexes set
by JS (in the 20s and 30s) look like they overlap with the root layer
numbers below, but they don't actually compete — the `.card-scene` block
always sits at root z=25, so its entire interior renders above everything
at z < 25 in the root layer.

### Root layer (inside `.pdf-space-stage`, set in `pdf-space.css`)

Bottom → top:

| z-index | Element | Purpose |
| ---: | --- | --- |
| auto | `canvas` | Dot-grid backdrop — implicit bottom of the stack (first child, no `z-index`). |
| 10 | `.adbe-logo-svg` | Big Adobe logo flourish that draws in during settle. |
| 12 | `.text-block` | Marketing copy that pans in during settle. |
| 18 (mobile) / 19 (desktop) | `.acrobat-title`, `.acrobat-cta` | Headline + CTA. Sit just below the mockup so they tuck behind it during the slot transition but stay above the dot grid and ADBE logo. |
| 20 | `.acrobat-desktop-mockup`, `.acrobat-mobile-mockup` | The product mockup the cards slot into. |
| 25 | `.card-scene` | Cards always paint above the mockup. **Establishes a new stacking context.** |

### Card layer (inside `.card-scene`, set in `pdf-space.js`)

All values here are relative to the `.card-scene` stacking context — they
don't interact with the root layer numbers above. Cards have **no inline
z-index at rest**; JS only assigns one during the arc and peel phases, when
fan ordering matters.

The base offsets are chosen so that during the staggered peel wave — when
some cards are still on the arc while others have already lifted off via
`arcPushDistance` — **any peeling card sits above any non-peeling card**.

| Card state | z-index range | Where it's set |
| --- | ---: | --- |
| Arc rest / sliding in (peel not yet started) | 20..27 | `renderArcPeelToGrid` |
| Currently peeling | 32..39 | `renderArcPeelToGrid` |
| Peel complete (`peelProgress >= 0.995`) | (cleared) | `renderArcPeelToGrid` |
| Slotting into mockup | (cleared) | `renderGridToSlot` |

Within each band the formula is `base + (FAN_LAST_INDEX - card.fanIdx)`, so:

- `fanIdx=0` (lower-right of the arc, peels first) → highest z within band.
- `fanIdx=7` (upper-left of the arc, peels last) → lowest z within band.

That ordering makes the cards at the "front" of the fan (which visually
overlap the others) render on top.

### Card labels

Labels are appended to `.card-stack` *after* their cards in DOM order, so
they paint above their owning card naturally. They never get an explicit
z-index — they share the card layer and rely on document order.

## Debug overlay

`pdf-space-debug.js` overlays live phase values, scroll position, and computed
layout numbers. The hooking code has been removed from `pdf-space.js` to keep
the production path clean. To restore it, add the three snippets below back into
`mountMotion`:

**1. Just before the render loop comment — declare the variable and lazy-load:**

```js
// ──────────────────── Debug overlay (?pdfspacedebug) ───────────────────
// Lazily loaded from pdf-space-debug.js only when ?pdfspacedebug is set.
let debug = null;
if (new URLSearchParams(window.location.search).has('pdfspacedebug')) {
  import('./pdf-space-debug.js').then(({ default: createDebugOverlay }) => {
    debug = createDebugOverlay(() => {
      const c = scrollCurrent;
      let stageLabel = 'done';
      if (c < ANIM_CONFIG.peelStartScroll) stageLabel = 'arc-pan';
      else if (c < ANIM_STATE.timing.gridEnd) stageLabel = 'peel';
      else if (c < ANIM_STATE.timing.slottingStart) stageLabel = 'settle';
      else if (c < ANIM_STATE.timing.slottingStart + ANIM_STATE.timing.slottingDuration) stageLabel = 'slotting';
      else if (ANIM_STATE.timing.postRevealScrollDistance > 0) stageLabel = 'post-reveal';
      let breakpoint = 'desktop';
      if (ANIM_STATE.frame.isMobile) breakpoint = 'mobile';
      else if (ANIM_STATE.frame.isTablet) breakpoint = 'tablet';
      return {
        stage: stageLabel,
        breakpoint,
        viewportWidth,
        viewportHeight,
        scrollCurrent: c,
        animTotal: ANIM_STATE.timing.slottingStart + ANIM_STATE.timing.slottingDuration
          + ANIM_STATE.timing.postRevealScrollDistance,
        phase: ANIM_STATE.phase,
        settle: arcTextPanProgressCached,
        peelStartScroll: ANIM_CONFIG.peelStartScroll,
        gridEnd: ANIM_STATE.timing.gridEnd,
        slottingStart: ANIM_STATE.timing.slottingStart,
        slottingDuration: ANIM_STATE.timing.slottingDuration,
        columnSpread: ANIM_STATE.cardGridLayout.columnSpread,
        rowGap: ANIM_STATE.cardGridLayout.rowGap,
        arcGridY: ANIM_STATE.verticalPan.arcGridY,
        postRevealY: ANIM_STATE.frame.isMobile
          ? ANIM_STATE.verticalPan.mobilePostRevealY
          : ANIM_STATE.verticalPan.deskPostRevealY,
        blockHeight: el.offsetHeight,
      };
    });
  });
}
```

**2. At the end of `loop()`, after `updateCardPositions()`:**

```js
debug?.update();
```

**3. At the end of the `teardown` function, after `canvasGrid.destroy()`:**

```js
debug?.destroy();
```

## Files

| File | Purpose |
| --- | --- |
| `pdf-space.js` | Block entry: parses authored content, drives rAF loop, owns animation state. |
| `pdf-space.css` | Stage layout, card styling, breakpoint overrides. |
| `pdf-space-debug.js` | Optional debug HUD; dynamic-imported only when `?pdfspacedebug` is set. |
