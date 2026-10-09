# Existing Animations Reference

Catalog of the C2 motion classes in `libs/c2/styles/styles.css`.
**Always check this catalog before writing new CSS.** If an existing
class achieves the desired effect, reuse it.

C2 has two kinds of motion, and they must not be mixed:

- **One-time entrances** (`parallax-move-up`, `parallax-opacity`,
  `parallax-scale-up`, `parallax-scale-down`, `parallax-blur`,
  `parallax-stagger-*`, `parallax-line-height`, base-card
  `parallax-featured-card-media`, and the `social-proof` block's stretch). These are timed CSS animations that an
  `IntersectionObserver` triggers once. They have **no** scroll-driven
  CSS: no `animation-timeline`, `view-timeline` or `animation-range`.
- **Scroll-driven moments**: garage-door sections, the Rich Content +
  Split Aside composition inside `parallax-double-garage-door`, the
  `parallax-scale-down-grid` section transition, and block-specific
  scroll effects. Only these use `@supports (animation-timeline: view())`.

Do not add scroll-driven CSS to an entrance class, and do not "lock" a
scroll animation to make it behave like a timed one.

---

## One-time content entrances

`libs/c2/content-animations.js` finds entrance sources once their block has
loaded and its section is revealed. It adds `c2-entrance-group` /
`c2-entrance-item`, writes the structural `--c2-entrance-index` and
`--c2-entrance-count` metadata, and adds `c2-entrance-played` when the
content crosses its trigger line. CSS owns all motion. JavaScript does not
listen to scroll, interpolate motion or track scroll direction, and played
content never reverses.

Sources inside a garage-door section (`SPECIALTY_SELECTOR`) are skipped:
that content is part of the door interaction. Content already running any
other animation keeps its own motion and gets no entrance.

### Authored inputs

The authored classes only feed custom-property inputs to the shared timed
keyframes (all outside `@supports`):

| Class | Input | Timed effect |
|-------|-------|--------------|
| `parallax-move-up` | `--c2-entrance-y: 100px` (opacity stays 1 without `parallax-opacity`) | Slides up 100px |
| `parallax-opacity` | `--c2-entrance-y: 0` (fade only) | Fades from 0 to 1 |
| `parallax-scale-up` | `--c2-entrance-scale-from: 0.9` | Scales from 90% to 100% |
| `parallax-scale-down` | `--c2-entrance-scale-from: 1.1` | Scales from 110% to 100% (may need clipping) |
| `parallax-blur` | `--c2-entrance-blur-from: 10px` | Blurs from 10px to 0 |

These compose: `parallax-move-up parallax-opacity` slides and fades.
Scale, blur and the base-card clip on their own (no move/opacity class)
are "effect-only" (`c2-entrance-effect`): the element stays visible and in
place while only that effect plays. Block CSS can add one extra animation
through the non-inheriting `--c2-entrance-clip-animation` slot (used for
the featured base-card radius below 2560px).

### Timing

Existing entrances keep stage's start line (90% of the viewport, measured
from the FAQ question for FAQ items), distances, stagger offsets and
`--parallax-easing`, with the fade running for the whole movement. They
finish after the shared 1050ms duration.

New `parallax-line-height` text entrances and the hover list following the
aside composition use the prototype's 1050ms timing, curve and fade
windows, triggered at 80% and 90% of the viewport respectively. CSS
distributes any number of items within the prototype's displacement and
opacity windows; there are no numbered step selectors or maximum count.

Pending items are hidden without a transform, so their viewport trigger is
not delayed by their movement. Played animations fill only backwards: once
finished they leave no animation behind, so hover opacity and transforms
apply normally. Resize and lazy-loaded siblings do not interrupt in-flight
animations. Focus and reduced motion display content immediately.

### Stagger

Applied to a **section** (parent of multiple blocks).

| Class | Effect |
|-------|--------|
| `parallax-stagger-ltr` | Children rise left-to-right based on column position |
| `parallax-stagger-rtl` | Children rise right-to-left |

- `--parallax-stagger-index` (column) and `--parallax-stagger-row-index`
  are assigned via `:nth-child()` per `two-up`/`three-up`/`four-up`/
  `six-up` class; `masonry-layout` uses its own drift (150px at 768px+).
- `--parallax-stagger-drift` (default 48px) and the indices produce
  `--parallax-stagger-from`, which becomes each item's `--c2-entrance-y`.
- Each item is delayed by its step (up to 150ms). Card rows trigger
  independently, so lower rows on mobile start when they arrive.

---

## Scroll-driven moments

Everything below lives inside `@supports (animation-timeline: view())`
and uses the project easing:

```css
:root {
  --parallax-easing: cubic-bezier(0.42, 0, 0, 1);
}
```

Use a different timing function only if the design specs require it.
Each scroll-driven class declares its own `animation`,
`animation-timeline` and `animation-range`; there is no shared base rule
or shared `enable-parallax` keyframe.

### Grid animation (`parallax-scale-down-grid`)

A section transition that animates the grid max-width and margins with
`enable-grid-parallax` (`--grid-max-width`, `--grid-margin-width`) on
`view(block 40% 10%)`, range `entry 0% entry 100%`. Uses `overflow: clip`.

### Rich Content + Split Aside composition

Inside `parallax-double-garage-door`, a CSS-only shared view timeline
reveals eyebrow, heading, body, media, then aside. A following hover list
resumes one-time triggered entrances.

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

---

## Reduced motion

Timed entrances show content immediately under reduced motion. All
scroll-driven parallax classes respect `prefers-reduced-motion: reduce` via
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

All C2 motion classes use the `parallax-` prefix.
New animations should follow this convention whenever possible.
The `prefers-reduced-motion` blanket rule depends on this prefix.
If a non-standard name is necessary, it requires user approval and
an explicit `prefers-reduced-motion` override.
