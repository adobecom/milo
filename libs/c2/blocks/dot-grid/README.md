# dot-grid

Scroll-driven hero animation: cards fan in along an arc, peel onto a flat
grid, then glide into the slots of an Acrobat product mockup.

The block element is **600vh** tall and pin-scrolled (sticky stage at
`top: 0`). Page scroll (px) is normalized to `0..1` across the pinned range,
then stretched onto an abstract timeline budget `animScrollTotal`
(~4152 on desktop, ~3111 on mobile). All phase boundaries below are positions
on that abstract budget — independent of viewport or block height.

## Phase timeline (desktop)

```
abstract scroll units (desktop):
0       535                     1132                    2732            4152
│        │                       │                       │               │
├────────┴───────────────────────┤                       │               │
│  arcPan: 0 → 1 by scroll 1350  │ (continues invisibly  │               │
│  Cards arc-rotate in from      │  past gridEnd; cards  │               │
│  upper-right. Slide-in pre-pin │  already off arc)     │               │
│  rises cards into formation.   │                       │               │
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
ANIM.peelStart-  ANIM.arcPanEnd      gridEnd                slottingStart    +slottingDuration
Scroll (535)     (1350 duration)     (ANIM.desktopPeelEnd  (DESKTOP_         (4152 = total
                                      = 1132)              SLOTTING_START    if post-reveal=0)
                                                           = 2732)
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

All visual parameters live in the `ANIM` object at the top of `dot-grid.js`,
grouped by phase. This section is the reference — pair it with the phase
timeline above. Numbers in the tables below are the current defaults.

### Phase scroll boundaries (desktop)

The four positions/durations that define the desktop timeline. Together
they sum to `animScrollTotal` (excluding any post-reveal pan).

| Key | Default | What it does |
| --- | ---: | --- |
| `peelStartScroll` | 535 | Scroll position where peel begins. Raise to give the arc more rotation airtime before cards start peeling onto the grid; lower to start peeling sooner. |
| `desktopPeelEnd` | 1132 | Scroll position where peel completes (all cards parked on the flat grid). Peel window = `peelStartScroll → desktopPeelEnd`. |
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

Lower `arcSweepMultiplier` (e.g. 1.0 → 0.7). Rotation sweeps a smaller total
angle over the same scroll distance, so it visibly slows without compressing
peel or moving any phase boundary. See the next section.

### Arc rotation feel

`arcPanEnd` and `arcSweepMultiplier` are easy to confuse — they're two
different knobs:

- `arcPanEnd` is the scroll-distance budget for `arcPan` to go 0 → 1. Lowering
  it makes `arcPan` advance faster per scroll unit. But because peel timing
  depends on the same `arcPan` progress, this also shifts when peel starts
  visually — not what you usually want if you're aiming for "slower rotation".
- `arcSweepMultiplier` scales the total angular sweep applied per unit of
  `arcPan`. Lowering it makes the rotation cover less angle without changing
  the scroll budget or peel timing. Use this when you want rotation to *feel*
  slower while keeping phase boundaries put.

| Key | Default | What it does |
| --- | ---: | --- |
| `arcPanEnd` | 1350 | Scroll units for `arcPan` to go 0 → 1 (rotation speed per scroll). |
| `arcSweepMultiplier` | 1 | Multiplier on `arcSpan` for total sweep. Lower = visibly slower rotation, independent of peel timing. Independent of `arcStagger`. |
| `arcSpan` | 0.80 | Angular span (radians) of the arc fan. Wider = cards spread further along the arc. |
| `arcStagger` | 0.50 | Per-card peel-wave lag. 0 = all cards peel simultaneously; values near 1 = fully staggered (last card hasn't started peeling when first finishes). |
| `arcLiftZoom` | 1.00 | Scale boost during arc phase. Higher = bigger card "pop" before peel. |
| `arcFanDepthDelta` | 0.30 | Fake-depth scale falloff across the fan: fanIdx=7 at 1.0×, fanIdx=0 at `(1 - delta)×`. Higher = stronger illusion of depth. |
| `arcYTilt` | 25 | Y-axis 3D tilt magnitude (degrees) per card during arc. |
| `arcXTilt` | 10 | X-axis 3D tilt, paired with `arcYTilt`. |
| `arcPushDistance` | 60 | Pixels each card pushes outward along the arc normal as peel begins. Higher = bigger "explosion" before peel collapses cards toward the grid. |
| `arcShadowAlpha` | 0.15 | Base shadow opacity on arc cards; fades to 0 through peel. |

### Slide-in (pre-pin entry)

While the block is scrolling into pin (before `position: sticky` engages),
cards enter from the right and converge on their arc positions.

`arcPrePinRatio` is the key knob here. By default, `arcPan` is 0 until the
block is fully pinned, which causes a visible "click" — translation snaps
into rotation. Mixing a fraction of pre-pin scroll into `arcPan` makes the
arc visibly rotate during slide-in so the transition is continuous.

The tradeoff: higher ratios mean rotation runs while the block is still
partially above the fold, so on shorter viewports the upper-row card can
clip against the previous section's `overflow: hidden` edge as it rotates.
Tune against the shortest viewport you care about.

| Key | Default | What it does |
| --- | ---: | --- |
| `arcPrePinRatio` | 0.1 | Fraction of pre-pin scroll mixed into `arcPan`. Higher = smoother pin handoff, but risks clipping on short viewports. |
| `slideStagger` | 0.45 | Per-card arrival lag. `fanIdx=7` slides in first, `fanIdx=0` last. Higher = larger gap between first and last arrivals. |
| `slideScaleStart` | 0.85 | Scale at slide start; grows to 1.0 on arrival. Lower = cards enter visibly smaller. |
| `slideStartX` | 0.55 | Base X offset at slide start, as fraction of vW. Higher = cards enter from further right. |
| `slideStaggerX` | 0.20 | Additional X offset per later card (fraction of vW). |
| `slideOverlap` | 200 | Scroll units into the post-pin window when slide-in fully completes. |
| `slideOpacityRampTo` | 0.25 | Value of per-card slide progress at which opacity reaches 1. Lower = sharper appear. |

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

## Z-index layering

The block uses **two stacking contexts**:

1. `.dot-grid-stage` — the outer context (the sticky stage element).
2. `.card-scene` — an inner context, established by setting `z-index: 25` on
   it inside the stage.

Because `.card-scene` is its own stacking context, any z-index applied to a
card inside it is **scoped to that inner context**. The card z-indexes set
by JS (in the 20s and 30s) look like they overlap with the root layer
numbers below, but they don't actually compete — the `.card-scene` block
always sits at root z=25, so its entire interior renders above everything
at z < 25 in the root layer.

### Root layer (inside `.dot-grid-stage`, set in `dot-grid.css`)

Bottom → top:

| z-index | Element | Purpose |
| ---: | --- | --- |
| auto | `canvas` | Dot-grid backdrop — implicit bottom of the stack (first child, no `z-index`). |
| 10 | `.adbe-logo-svg` | Big Adobe logo flourish that draws in during settle. |
| 12 | `.text-block` | Marketing copy that pans in during settle. |
| 18 (mobile) / 19 (desktop) | `.acrobat-title`, `.acrobat-cta` | Headline + CTA. Sit just below the mockup so they tuck behind it during the slot transition but stay above the dot grid and ADBE logo. |
| 20 | `.acrobat-desktop-mockup`, `.acrobat-mobile-mockup` | The product mockup the cards slot into. |
| 25 | `.card-scene` | Cards always paint above the mockup. **Establishes a new stacking context.** |

### Card layer (inside `.card-scene`, set in `dot-grid.js`)

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

Append `?dotgriddebug` to the URL to lazy-load `dot-grid-debug.js` and
overlay live phase values, scroll position, and computed layout numbers.
Production builds never download the debug module.

## Files

| File | Purpose |
| --- | --- |
| `dot-grid.js` | Block entry: parses authored content, drives rAF loop, owns animation state. |
| `dot-grid.css` | Stage layout, card styling, breakpoint overrides. |
| `dot-grid-debug.js` | Optional debug HUD; dynamic-imported only when `?dotgriddebug` is set. |
