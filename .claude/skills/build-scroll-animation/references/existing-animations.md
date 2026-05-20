# Existing Scroll Animations Reference

Catalog of all scroll-driven animation classes defined in
`libs/c2/styles/styles.css` inside `@supports (animation-timeline: view())`.
**Always check this catalog before writing new CSS.** If an existing
class achieves the desired effect, reuse it.

---

## Architecture

All scroll-driven animations share a common base selector and a
project-wide easing variable:

```css
:root {
  --parallax-easing: cubic-bezier(0.42, 0, 0, 1);
}
```

This easing is the **default for all animations**. Do not use a
different timing function unless the design specs explicitly
require it.

```css
[class*="parallax-"] {
  --parallax-opacity-from: 1;
  --parallax-translate-y: 0;
  --parallax-translate-x: 0;
  --parallax-scale: 1;
  --parallax-blur: 0;

  --parallax-range-start-name: entry;
  --parallax-range-start-length: 0%;
  --parallax-range-start: var(--parallax-range-start-name) var(--parallax-range-start-length);
  --parallax-range-end-name: entry;
  --parallax-range-end-length: 100%;
  --parallax-range-end: var(--parallax-range-end-name) var(--parallax-range-end-length);

  animation-name: enable-parallax;
  animation-timing-function: var(--parallax-easing);
  animation-fill-mode: both;
  animation-timeline: view(block 40% 10%);
  animation-range: var(--parallax-range-start) var(--parallax-range-end);
  will-change: opacity, transform, filter;
}
```

**Key design pattern**: variants override CSS custom properties
rather than re-declaring animation properties. The shared
`enable-parallax` keyframe reads those variables:

```css
@keyframes enable-parallax {
  from {
    opacity: var(--parallax-opacity-from);
    transform: translate3d(var(--parallax-translate-x), var(--parallax-translate-y), 0)
      scale(var(--parallax-scale));
    filter: blur(var(--parallax-blur));
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}
```

This means simple animations (move, scale, blur, opacity) only
need a class that sets the appropriate `--parallax-*` variable.

---

## Simple variant classes

These compose with each other. Applying multiple classes combines
their effects because each sets a different variable.

| Class | Variable set | Effect |
|-------|-------------|--------|
| `parallax-move-up` | `--parallax-translate-y: 100px` | Slides up 100px during entry |
| `parallax-scale-up` | `--parallax-scale: 0.9` | Scales from 90% to 100% |
| `parallax-scale-down` | `--parallax-scale: 1.1` | Scales from 110% to 100% (may need clipping) |
| `parallax-blur` | `--parallax-blur: 10px` | Blurs from 10px to 0 |
| `parallax-opacity` | `--parallax-opacity-from: 0` | Fades from 0 to 1 |

### Composability example

```html
<div class="parallax-move-up parallax-opacity">
```

This element will slide up AND fade in simultaneously, because
`enable-parallax` reads both `--parallax-translate-y` and
`--parallax-opacity-from`.

---

## Grid animation

| Class | Effect |
|-------|--------|
| `parallax-scale-down-grid` | Animates grid max-width and margins. Uses its own keyframe `enable-grid-parallax` that transitions `--grid-max-width` and `--grid-margin-width`. Uses `overflow: clip`. |

---

## Stagger animations

Applied to a **section** (parent of multiple blocks), not to
individual blocks.

| Class | Effect |
|-------|--------|
| `parallax-stagger-ltr` | Children stagger left-to-right based on column position |
| `parallax-stagger-rtl` | Children stagger right-to-left |

**How it works:**
- The section uses `enable-parallax-stagger` keyframe that
  animates `--parallax-stagger-progress` from 1 to 0.
- Each child calculates its own `transform: translateY()` from
  a `--parallax-stagger-from` value based on its column and row
  index.
- Column indices (`--parallax-stagger-index`) are assigned via
  `:nth-child()` selectors per `-up` class.
- Row indices (`--parallax-stagger-row-index`) are assigned
  similarly.
- The `--parallax-stagger-drift` variable (default 48px) controls
  maximum vertical offset.

**Range adjustment for multiple rows:**
- 2 rows: `--parallax-range-end: cover 70%`
- 3+ rows: `--parallax-range-end: cover 80%`

**Desktop only**: stagger animations are wrapped in
`@media (width >= 768px)`.

---

## Custom / complex animations

### Garage door reveal (`parallax-garage-door-reveal`)

A section-level effect where content grows upward from below while
the foreground content reveals with a line-height animation.

- Applied to: a `.section` element
- Uses **4 separate keyframes**: `garage-door-grow`,
  `garage-door-reveal`, `garage-door-bg-scale`,
  `garage-door-line-height`
- Each sub-element has its own `animation-timeline: view()` and
  its own `animation-range`
- Responsive: different `--gd-grow-from` and `--gd-reveal-from`
  values per breakpoint
- The preceding section gets `z-index: 1` via
  `:has(~ .section.parallax-garage-door-reveal)`

### Move up fast (`parallax-move-up-fast`)

A sticky section that scrolls away quickly while darkening.

- Applied to: a `.section` element
- Uses `position: sticky; top: 0; z-index: 0`
- Uses `animation-timeline: scroll(root block)` (page scroll, not view)
- Uses `animation-range: 0 80vh` (absolute length range)
- Has a `::after` overlay that fades to dark (opacity 0 to 0.75)
- Two keyframes: `parallax-move-up-fast` (translateY to -35vh)
  and `parallax-fade-to-dark`

### Line height reveal (`parallax-line-height`)

Text children animate from `line-height: 3` to default, creating
a text "spreading apart then settling" reveal effect.

- Applied to: a container element
- Animates all `*` children
- Uses `animation-timeline: view()`
- Range: `entry 10% cover 40%`
- Keyframe: `text-reveal-up`

---

## Reduced motion

All parallax classes respect `prefers-reduced-motion: reduce` via
a blanket rule:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="parallax-"],
  [class*="parallax-"] *,
  [class*="parallax-"]::before,
  [class*="parallax-"]::after {
    animation: none !important;
  }
}
```

Any new animation class **must** also be disabled by this rule.
If using a class name that does NOT start with `parallax-`, add
an explicit reduced-motion override.

---

## Naming convention

All scroll-driven animation classes use the `parallax-` prefix.
New animations should follow this convention whenever possible.
The `[class*="parallax-"]` base selector and the
`prefers-reduced-motion` blanket rule both depend on this prefix.
If a non-standard name is necessary, it requires user approval and
an explicit `prefers-reduced-motion` override.
