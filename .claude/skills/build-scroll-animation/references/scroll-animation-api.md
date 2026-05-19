# Scroll-Driven Animations API Reference

Core concepts for the CSS Scroll-Driven Animations specification,
baked into this skill to avoid repeated web lookups.

Sources: WebKit blog "So many ranges, so little time" and MDN
`animation-timeline` / `animation-range` documentation.

---

## Two types of scroll-driven timelines

### 1. Scroll Progress Timeline (`scroll()`)

Tracks the **scroll position** of a scroll container along a given
axis. Progress goes from 0% (start) to 100% (end) based on how far
the container has been scrolled.

```css
animation-timeline: scroll();            /* nearest ancestor scroller, block axis */
animation-timeline: scroll(root);        /* document viewport scroller */
animation-timeline: scroll(root block);  /* explicit axis */
animation-timeline: scroll(nearest inline); /* nearest scroller, inline axis */
```

**Parameters:**
| Parameter | Values | Default |
|-----------|--------|---------|
| scroller | `nearest`, `root`, `self` | `nearest` |
| axis | `block`, `inline`, `x`, `y` | `block` |

Use case: animations tied to the **overall page scroll position**
(e.g. a progress bar, a sticky header shrink, parallax background
shift). The animating element does not need to be entering or
leaving the viewport.

### 2. View Progress Timeline (`view()`)

Tracks the **visibility** of a subject element within a scroll
container. Progress goes from 0% to 100% as the element enters,
passes through, and exits the scrollport.

```css
animation-timeline: view();              /* block axis, no inset */
animation-timeline: view(block);         /* explicit axis */
animation-timeline: view(block 20% 10%); /* axis + inset values */
```

**Parameters:**
| Parameter | Values | Default |
|-----------|--------|---------|
| axis | `block`, `inline`, `x`, `y` | `block` |
| inset | 1 or 2 length/percentage values | `0` |

The **inset** parameter shrinks the scrollport for the purposes
of determining visibility. `view(block 20% 10%)` means the top
20% and bottom 10% of the viewport are excluded from the
effective scrollport.

Use case: animations triggered when an element **scrolls into or
out of view** (fade-in on entry, parallax, reveal effects).

---

## Animation range names

When using `view()`, the full 0%-100% timeline is divided into
**named ranges**. Each range corresponds to a phase of the
element's visibility journey. The `animation-range` property lets
you constrain your animation to run during a specific range.

### The six named ranges

| Range | Description | Range size |
|-------|-------------|------------|
| **cover** | From the moment any part of the element first enters the scrollport to the moment the last part exits. Equivalent to the full 0%-100% of `view()`. | scrollport + subject |
| **contain** | From the moment the element is fully contained within the scrollport to the moment it stops being fully contained. | abs(scrollport - subject) |
| **entry** | From the element's leading edge entering the scrollport to its trailing edge entering (i.e. the element becomes fully visible). | min(subject, scrollport) |
| **exit** | From the element's leading edge exiting the scrollport to its trailing edge exiting (i.e. the element fully leaves). | min(subject, scrollport) |
| **entry-crossing** | From the element's leading edge crossing the scrollport start to the element's trailing edge crossing the scrollport start. | subject size (unclamped) |
| **exit-crossing** | From the element's leading edge crossing the scrollport end to the element's trailing edge crossing the scrollport end. | subject size (unclamped) |

### `entry` vs `entry-crossing` (tall elements)

The distinction only matters when the element is **taller than the
viewport**.

- **entry 100%**: reached when the element first fills the viewport,
  even if the bottom edge has not yet entered. Clamped to
  `min(subject, scrollport)`.
- **entry-crossing 100%**: reached when every pixel has crossed
  the viewport's entry edge (the bottom edge has entered). Uses
  the subject's full size, unclamped.

For elements smaller than the viewport, both behave identically.
Same logic applies to `exit` vs `exit-crossing` (mirrored).

### Visual mental model (vertical scroll, element entering from bottom)

```
               Scrollport
          ┌─────────────────┐
          │                 │  ← top of viewport
          │                 │
          │    [element]    │  ← contain range (fully inside)
          │                 │
          │                 │  ← bottom of viewport
          └─────────────────┘

  Timeline progression for a view() timeline:
  ─────────────────────────────────────────────────>
  |  entry   | contain                |   exit   |
  |          |                        |          |
  0% ──── entry ──── contain ──── exit ──── 100%
             100%              starts
```

- **entry 0%**: element's leading edge touches the scrollport edge
- **entry 100%**: element's trailing edge enters the scrollport (element fully inside)
- **contain 0%**: element is just fully contained
- **contain 100%**: element is about to stop being fully contained
- **exit 0%**: element's leading edge starts leaving
- **exit 100%**: element's trailing edge has fully left

### Percentage within a range

Each range has its own local 0%-100% scale:

- `entry 0%` = the very start of the entry phase
- `entry 50%` = halfway through the entry phase
- `entry 100%` = end of the entry phase

You can mix range names in `animation-range-start` and
`animation-range-end`:

```css
animation-range: entry 0% cover 50%;
```

This starts the animation when the element begins entering and
ends it when it covers 50% of the timeline (roughly halfway
through its visibility journey).

---

## `animation-range` property

### Shorthand

```css
animation-range: <range-start> <range-end>;
```

Each value is: `<timeline-range-name> <percentage-or-length>`

```css
/* Examples */
animation-range: entry 0% entry 100%;    /* animate during entry only */
animation-range: entry 0% cover 40%;     /* entry through first 40% of cover */
animation-range: cover 0% cover 100%;    /* entire visibility range */
animation-range: contain 0% contain 100%; /* only while fully contained */
animation-range: normal normal;          /* default: entire timeline */
```

### Longhand

```css
animation-range-start: entry 0%;
animation-range-end: cover 50%;
```

### Single-keyword shorthand resolution

When only one range name is provided, it sets **both** start and end
to that range:

```css
animation-range: entry;
/* resolves to: entry 0% entry 100% */

animation-range: cover 20%;
/* resolves to: cover 20% cover 100% */
```

### Default range (no `animation-range` declared)

The implicit default is `entry 0% exit 100%` (i.e. the animation
runs from the element starting to enter until it fully exits).
This is equivalent to `normal normal`.

### Special value: `normal`

- `animation-range-start: normal` = start of timeline (0%)
- `animation-range-end: normal` = end of timeline (100%)

---

## Key properties reference

### `animation-timeline`

```css
animation-timeline: auto;           /* default: document timeline (time-based) */
animation-timeline: none;           /* no timeline */
animation-timeline: scroll();       /* scroll progress timeline */
animation-timeline: view();         /* view progress timeline */
animation-timeline: --my-timeline;  /* named timeline */
```

### `animation-fill-mode`

Particularly important with scroll-driven animations:

- `both` or `forwards`: the element retains the animated state
  after the animation completes (common for reveal effects)
- `none`: element snaps back to pre-animation state

### `animation-timing-function`

Works the same as time-based animations. `ease-out` is common for
scroll-driven effects because the deceleration feels natural as
elements settle into position.

### `will-change`

Used for compositor hints:

```css
will-change: opacity, transform, filter;
```

Only apply to properties that actually animate. Overuse wastes GPU
memory.

---

## Interaction with `@keyframes` and the `animation` shorthand

**The `animation` shorthand resets `animation-timeline` to `auto`.**
Always declare `animation-timeline` (and `animation-range`) **after**
the `animation` shorthand:

```css
.element {
  animation: fade-in ease-out both;       /* resets timeline to auto */
  animation-timeline: view();             /* must come after */
  animation-range: entry 0% entry 100%;   /* must come after */
}
```

Scroll-driven animations use the same `@keyframes` rules as
time-based animations. The difference is what drives the progress:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fade-in ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

The `from` state maps to the start of the range, `to` maps to the
end. Intermediate keyframe percentages (e.g. `50%`) map linearly
within the range.

You can omit `to` if the target state matches the element's natural
state:

```css
@keyframes slide-up {
  from { transform: translateY(100px); }
  /* 'to' is implicitly the element's default transform: none */
}
```

---

## `@supports` guard

Always wrap scroll-driven animation CSS in a feature query:

```css
@supports (animation-timeline: view()) {
  /* scroll-driven animation styles */
}
```

This ensures browsers without support simply skip the animations
and show the element in its final state.

---

## `prefers-reduced-motion`

Always respect the user's motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="parallax-"] {
    animation: none !important;
  }
}
```

This is the one place `!important` is acceptable (accessibility
override).

---

## Common pitfalls

1. **Forgetting `animation-fill-mode: both`**: without it, the
   element snaps to its un-animated state outside the range.

2. **Using `scroll()` when you mean `view()`**: `scroll()` tracks
   the scroller's position regardless of element visibility.
   `view()` tracks the specific element's visibility.

3. **Conflicting ranges**: `animation-range: entry 100% entry 0%`
   (end before start) produces no animation.

4. **Nested scrollers**: `scroll(nearest)` uses the nearest
   scrolling ancestor, which may not be the document. Prefer
   `scroll(root)` when you mean the page scroll.

5. **Inset confusion**: `view(block 40% 10%)` shrinks the
   effective scrollport from top by 40% and from bottom by 10%.
   The element must cross these inset boundaries to trigger.

6. **Performance**: animating `width`, `height`, `top`, `left`,
   or `margin` triggers layout recalculations on every scroll
   frame. Stick to `transform`, `opacity`, and `filter`.

7. **Stacking contexts**: `will-change: transform` creates a new
   stacking context. Plan your z-index strategy accordingly.

---

## Browser support

Scroll-driven animations are supported in Chromium 115+ and
Safari 18.4+. Firefox has partial support behind flags. The
`@supports` guard ensures graceful degradation.
