# Animation Patterns & Simplicity Guidelines

Patterns for building C2 animations, with a strong bias toward
simplicity. The guiding principles:

- **Content entrances are one-time and timed, never scroll-driven.** Use
  the existing `parallax-*` entrance classes; `content-animations.js`
  triggers them. Do not give an entrance any `animation-timeline`,
  `view-timeline` or `animation-range`.
- **Scroll-driven CSS is only for scroll moments** such as garage doors,
  section transitions and sticky effects.

---

## Decision tree: how to implement an animation

```
Is it content appearing once (move/scale/blur/opacity/stagger)?
  ├─ YES → Use existing parallax-* entrance classes (compose them).
  │        Need a different magnitude? Set the --c2-entrance-* input in a
  │        new class. No scroll timeline, no new keyframe.
  │
  └─ NO → Is the motion meant to follow the scroll position
          (garage door, section transition, sticky shift)?
           ├─ YES → Does it animate one element?
           │         ├─ YES → Pattern 2 (new keyframe, single element)
           │         └─ NO  → Pattern 3 (multi-element orchestration)
           │        Page-scroll based → Pattern 4.
           │
           └─ NO → Re-examine. It is probably a timed entrance.
```

---

## Pattern 1: Entrance input override (simplest)

For entrances that differ from existing classes only in magnitude.

```css
.parallax-move-up-large {
  --c2-entrance-y: 200px;
}
```

The shared timed keyframes pick up the input automatically. Never add a
scroll timeline or range to an entrance.

### When to use
- The effect involves move, opacity, scale, blur, or any combination
- Only the magnitude differs from existing classes

---

## Pattern 2: New keyframe, single element

For scroll-driven effects on one element (e.g. a clip reveal tied to a
garage-door moment).

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

2. **Is this really scroll-driven?**
   Content entrances must stay timed. Only garage-door, section
   transition and sticky moments may use scroll timelines.

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
| Fade in once | `parallax-opacity` |
| Slide up + fade in | `parallax-move-up parallax-opacity` |
| Scale up + fade in | `parallax-scale-up parallax-opacity` |
| Zoom out + blur clear | `parallax-scale-down parallax-blur` |
| Card grid stagger (LTR) | `parallax-stagger-ltr` on section |
| Card grid stagger (RTL) | `parallax-stagger-rtl` on section |
| Sticky section with darkening | `parallax-move-up-fast` |
| Section growing from below | `parallax-garage-door-reveal` |
| Custom slide distance | Override `--c2-entrance-y` in new class |
