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
ANIM.peelStart-  ANIM.arcPanEnd      gridEnd                slottingStart    +slottingDuration
Scroll (535)     (1350 duration)     (ANIM.desktopPeelEnd  (DESKTOP_         (4552 = total
                                      = 1532)              SLOTTING_START    if post-reveal=0)
                                                           = 3132)
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

All visual parameters live in the `ANIM` object at the top of `pdf-space.js`,
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
same factor (e.g. 0.50 → 0.35). Both halves of the rotation slow together,
so the pre-pin and post-pin rates stay matched.

### Arc rotation feel

The rotation is one continuous sweep spanning pre-pin and arc-pan, driven
by two terms summed into `rotationOffset`:

- **`cwBoost = arcCwStart * (blockTop / vh)`** — decays linearly from
  `arcCwStart` to 0 as the block scrolls into pin.
- **`arcSpan * arcSweepMultiplier * phase.arcPan`** — runs post-pin.

For a constant perceived rate across pin, pick
`arcCwStart ≈ arcSpan * arcSweepMultiplier / arcPanScroll_in_vh`. With the
defaults (arc-pan = ~1.63 vh), that lands at ~0.49; we use 0.50.

`arcPanEnd` and `arcSweepMultiplier` look similar but do different things:

- `arcPanEnd` is the scroll budget for `arcPan` 0 → 1. Lowering it shortens
  arc-pan, but also pulls peel start earlier (peel uses the same `arcPan`).
- `arcSweepMultiplier` scales the total angle swept by `arcPan`. Use this
  to change rotation speed without moving any phase boundary.

| Key | Default | What it does |
| --- | ---: | --- |
| `arcCwStart` | 0.50 | Extra CW rotation (rad) at pre-pin start, decaying to 0 at pin. Sets both the off-screen starting angle and the pre-pin rotation rate. |
| `arcApexLift` | 0.10 | Vertical bias of the arc apex (card 7's rest y) as a fraction of vh. Card 7 lands at `vh * (0.5 - arcApexLift)`. |
| `prePinSlideY` | 0.25 | Uniform downward Y offset (fraction of vh) applied during pre-pin, decaying to 0 by `phase.slideT = 1`. Pushes the whole arc below its orbital position so short viewports don't clip the lifted apex; no X component or per-card stagger, so the relative motion between cards stays purely orbital. Set to 0 to disable. |
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
offset, so cards rotate around the same translating center — orbit feel is
preserved. The slide is fully gone by `phase.slideT = 1` (≈ `slideOverlap`
scroll units past pin), so post-pin behavior is unchanged. Tune
`prePinSlideY` upward if a target viewport still clips at the top during
pre-pin; lower it for a subtler entry.

### Card entry ramps

`slideT` (0 → 1 across pre-pin + first ~200 scroll units post-pin) drives
the per-card opacity fade-in, scale ramp, and the uniform `prePinSlideY`
described above. The per-card lag (`slideStagger`) only affects opacity
and scale — the Y slide is unstaggered so cards stay coherent as a single
rotating arc.

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

Append `?pdfspacedebug` to the URL to lazy-load `pdf-space-debug.js` and
overlay live phase values, scroll position, and computed layout numbers.
Production builds never download the debug module.

## Files

| File | Purpose |
| --- | --- |
| `pdf-space.js` | Block entry: parses authored content, drives rAF loop, owns animation state. |
| `pdf-space.css` | Stage layout, card styling, breakpoint overrides. |
| `pdf-space-debug.js` | Optional debug HUD; dynamic-imported only when `?pdfspacedebug` is set. |
