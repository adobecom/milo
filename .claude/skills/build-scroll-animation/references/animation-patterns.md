# Animation Patterns & Simplicity Guidelines

Patterns for building scroll-driven animations, with a strong bias
toward simplicity. The guiding principle: **if the effect can be
achieved by setting a CSS variable on the existing `enable-parallax`
keyframe, do not write a new keyframe.**

---

## Decision tree: how to implement an animation

```
Is the effect a combination of move/scale/blur/opacity on entry?
  ├─ YES → Use existing parallax-* classes (compose them)
  │        Done. No new CSS needed.
  │
  └─ NO → Does it need different range/timing but same transform types?
           ├─ YES → Override --parallax-range-* and --parallax-* vars
           │        in a new class. Reuse enable-parallax keyframe.
           │
           └─ NO → Does it animate a property not in enable-parallax
                   (e.g. line-height, clip-path, width)?
                    ├─ YES → Write a new @keyframes + new class.
                    │        Minimal: only the properties needed.
                    │
                    └─ NO → Does it need multiple elements animating
                            independently (different timelines/ranges)?
                             ├─ YES → Multi-keyframe approach.
                             │        Each sub-element gets its own
                             │        animation + timeline + range.
                             │
                             └─ NO → Re-examine. You likely missed
                                     a simpler path above.
```

---

## Pattern 1: Variable override (simplest)

For effects that differ from existing classes only in magnitude or
range.

```css
.parallax-move-up-large {
  --parallax-translate-y: 200px;
  --parallax-range-end-name: cover;
  --parallax-range-end-length: 40%;
}
```

No new keyframe needed. The `enable-parallax` keyframe picks up the
overridden variables automatically.

### When to use
- The effect involves transform, opacity, scale, blur, or any
  combination of these
- Only the magnitude or animation range differs from existing classes

---

## Pattern 2: New keyframe, single element

For effects that animate properties not covered by `enable-parallax`.

```css
.parallax-clip-reveal {
  animation-name: clip-reveal;
  animation-timing-function: var(--parallax-easing);
  animation-fill-mode: both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
  will-change: clip-path;
}

@keyframes clip-reveal {
  from { clip-path: inset(100% 0 0 0); }
  to { clip-path: inset(0); }
}
```

### Rules
- Keep the keyframe minimal: only animate what changes
- Prefer `from` only (omit `to`) when the target is the element's
  natural state
- Always include `will-change` for the animated properties
- Use the `parallax-` prefix so the reduced-motion rule catches it

---

## Pattern 3: Multi-element orchestration

For complex effects where different parts of a component animate
independently (e.g. garage-door-reveal).

```css
.parallax-example-effect {
  animation: effect-main var(--parallax-easing) both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;

  .child-a {
    animation: effect-child-a var(--parallax-easing) both;
    animation-timeline: view();
    animation-range: cover -10% cover 70%;
  }

  .child-b {
    animation: effect-child-b var(--parallax-easing) both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
}
```

### Rules
- Each sub-element declares its own `animation-timeline` and
  `animation-range` (they do not inherit)
- Minimize the number of independent animations; consider whether
  a single parent animation with nested transforms would suffice
- If child animations only differ in delay, consider CSS stagger
  via `animation-delay` or `--index`-based calc instead

---

## Pattern 4: Scroll-position animation (not view-based)

For effects tied to the page scroll position, not element visibility.

```css
.parallax-sticky-shift {
  position: sticky;
  top: 0;
  animation-name: sticky-shift;
  animation-timeline: scroll(root block);
  animation-range: 0 80vh;
}
```

### When to use
- Sticky headers, progress indicators
- Sections that should animate based on how far the user has
  scrolled the page, regardless of element position

---

## Simplicity checklist

Before finalizing any animation, answer these questions:

1. **Can existing classes achieve this?**
   Check `references/existing-animations.md`. Composing
   `parallax-move-up parallax-opacity` may be all you need.

2. **Can variable overrides achieve this?**
   If the effect is the same type (transform/opacity/blur) but
   different values or range, override `--parallax-*` variables.

3. **Is every keyframe property necessary?**
   Remove any property from the keyframe that does not visibly
   change. Animating `transform` when only `opacity` changes is
   wasted work.

4. **Is the animation range as narrow as possible?**
   Wider ranges = slower perceived motion. For entry reveals,
   `entry 0% entry 100%` is usually sufficient. Only extend to
   `cover` if the design requires motion that continues after the
   element is fully visible.

5. **Are there fewer than 3 independent timelines?**
   Each `animation-timeline` declaration on a child creates a
   separate scroll observation. More than 3 on a single component
   is a complexity smell. Consider whether parent-level animation
   with inherited motion would work.

6. **Is `prefers-reduced-motion` respected?**
   If the class uses the `parallax-` prefix, the existing blanket
   rule covers it. If a non-standard name was approved by the user,
   verify an explicit reduced-motion override exists.

7. **Are you using `transform` and `opacity` only?**
   Animating layout properties (`width`, `height`, `margin`,
   `padding`, `top`, `left`) causes layout thrashing on every
   scroll frame. Exceptions exist (e.g. `line-height` for text
   reveal) but must be justified.

---

## Common composition recipes

| Desired effect | Classes / approach |
|---|---|
| Fade in on entry | `parallax-opacity` |
| Slide up + fade in | `parallax-move-up parallax-opacity` |
| Scale up + fade in | `parallax-scale-up parallax-opacity` |
| Zoom out + blur clear | `parallax-scale-down parallax-blur` |
| Card grid stagger (LTR) | `parallax-stagger-ltr` on section |
| Card grid stagger (RTL) | `parallax-stagger-rtl` on section |
| Text line-height reveal | `parallax-line-height` |
| Sticky section with darkening | `parallax-move-up-fast` |
| Section growing from below | `parallax-garage-door-reveal` |
| Custom slide distance | Override `--parallax-translate-y` in new class |
| Custom entry range | Override `--parallax-range-*` vars in new class |
