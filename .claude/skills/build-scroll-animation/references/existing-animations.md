# Existing Animations Reference

Catalog of the C2 motion classes in `libs/c2/styles/styles.css`.
**Always check this catalog before writing new CSS.** If an existing
class achieves the desired effect, reuse it.

C2 has two kinds of motion, and they must not be mixed:

- **One-time entrances** (`parallax-move-up`, `parallax-opacity`,
  `parallax-scale-up`, `parallax-scale-down`, `parallax-blur`,
  `parallax-stagger-*`, default Rich Content text rise, base-card
  `parallax-featured-card-media`, `parallax-scale-down-grid`, and the
  `social-proof`, `carousel-c2` and desktop `elastic-carousel` block
  entrances). These are timed CSS animations that an
  `IntersectionObserver` triggers once. They have **no** scroll-driven
  CSS: no `animation-timeline`, `view-timeline` or `animation-range`.
- **Scroll-driven moments**: garage-door sections, the Rich Content +
  Split Aside composition inside `parallax-double-garage-door`, and
  block effects that keep changing while content is on screen or leaving
  it (mobile `elastic-carousel` stacking, section stacking, sticky
  effects). Only these use `@supports (animation-timeline: view())`.

An animation is an entrance when it starts offset or hidden, ends at the
element's natural state, and finishes as the element arrives. Entrances
rise and fade only (no scale or blur), with the shared timing below.

Do not add scroll-driven CSS to an entrance class, and do not "lock" a
scroll animation to make it behave like a timed one.

---

## One-time content entrances

`libs/c2/content-animations.js` runs once per section, right after all of
the section's blocks have loaded (`processSection` in `libs/utils/utils.js`),
and re-checks sections on resize so responsive section styles and grid rows
stay correct. It adds `c2-entrance-group` /
`c2-entrance-item`, writes the structural `--c2-entrance-index` and
`--c2-entrance-count` metadata, and adds `c2-entrance-played` when the
content crosses its trigger line. CSS owns all motion. JavaScript does not
listen to scroll, interpolate motion or track scroll direction, and played
content never reverses.

CSS decides what gets an entrance; the JavaScript lists no classes or
blocks. In `libs/c2/styles/styles.css` ("Entrance roles"), each animated
class sets an `--c2-entrance` role: `content` (Rich Content text lines),
`self`, `stagger` / `stagger-rtl`, `children`, `effect` (plays in place), or
`block` (carousels: the block animates its own content, so nothing inside
it gets a separate entrance). To add a new entrance, give its class a role
there. A block can set `--c2-entrance-anchor` on an item's child to start
that item from the child, as FAQ does with its question.

Garage doors, sticky moments and the Rich Content + Split Aside content set
`--c2-entrance-off`, which inherits, so nothing inside them gets an
entrance: that content stays scroll-driven. Content already running any
other animation keeps its own motion and gets no entrance.

### Authored inputs

Every entrance uses one motion: opacity and Y only, with no scale or blur.
The authored classes (`parallax-move-up`, `parallax-opacity`,
`parallax-scale-up`, `parallax-scale-down`, `parallax-scale-down-grid`,
`parallax-blur`, `parallax-featured-card-media`) and `.social-proof`,
`.faq-list`, `.tabs.staggered-intro-merch-cards` and
`.side-by-side.featured` all get the `self` role and play the same rise and
fade. Dense blocks (FAQ list, pricing tabs) enter as one block.
Carousels (`carousel-c2`, `elastic-carousel`) have the `block` role and
animate their own content.

### Timing

Shared values on `.c2-entrance-group` / `.c2-entrance-item` in
`libs/c2/styles/styles.css`:

| Property | Value |
|----------|-------|
| `--c2-entrance-trigger` | `90%` of the viewport (FAQ items measure from the question) |
| `--c2-entrance-distance` | `64px` |
| `--c2-entrance-duration` | `800ms` |
| `--c2-entrance-easing` | `cubic-bezier(0.16, 1, 0.3, 1)` (fast start, soft ease-out, no hold) |

Opacity and Y run on the same curve and finish together. Items that trigger
together form one cascade in page order (eyebrow, headline, body, then
content), 100ms apart, across sections and sources;
`content-animations.js` writes each item's `--c2-entrance-delay`.

Content in view (or scrolled past) when its section is set up shows
settled, without playing. Content jumped past later (in-page links, a fast
scroll while the page grows) still counts as reached, so it never stays
hidden.

Pending items are hidden without a transform, so their viewport trigger is
not delayed by their movement. Played animations fill only backwards: once
finished they leave no animation behind, so hover opacity and transforms
apply normally. Resize and lazy-loaded siblings do not interrupt in-flight
animations. Focus and reduced motion display content immediately.

### Stagger

Applied to a **section** (parent of multiple blocks).

| Class | Effect |
|-------|--------|
| `parallax-stagger-ltr` | Children rise left-to-right |
| `parallax-stagger-rtl` | Children rise right-to-left |

- Grids enter row by row: a row plays once any of its items reaches the
  trigger line, so rows below the fold never play unseen.
- Each item's `--c2-entrance-column` steps its rise: 64px, 128px, then
  192px for the rest of the row.

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

A triggered entrance: the section starts scaled to full bleed
(`--grid-scale-multiplier`) and settles into the grid once over
`--c2-entrance-duration`, through the shared entrance scale slot.
Uses `overflow-x: clip`.

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
