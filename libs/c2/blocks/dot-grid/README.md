# dot-grid

Scroll-driven hero animation: cards fan in along an arc, peel onto a flat
grid, then glide into the slots of an Acrobat product mockup.

The block element is **600vh** tall and pin-scrolled (sticky stage at
`top: 0`). Page scroll (px) is normalized to `0..1` across the pinned range,
then stretched onto an abstract timeline budget `animScrollTotal`
(~4552 on desktop, ~2977 on mobile). All phase boundaries below are positions
on that abstract budget — independent of viewport or block height.

## Phase timeline (desktop)

```
abstract scroll units (desktop):
0       135                     1132                    2832            4552
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
PEEL_START_  ANIM.arcPanEnd (1350)  gridEnd                slottingStart    +slottingDuration
SCROLL (135)                     (DESKTOP_PEEL_END_      (DESKTOP_        (4552 = total)
                                  SCROLL = 1132)         SLOTTING_START
                                                         = 2832)
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
