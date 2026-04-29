# Grid System Reference

The C2 layout grid is defined primarily in
`libs/c2/blocks/section-metadata/section-metadata.css`.
The `.container` class is typically already applied on the page by the
time a block renders — blocks do not add it themselves, but must
understand how it constrains their layout.

---

## Breakpoints & column counts

| Name | Range | Columns | Typical use |
|------|-------|---------|-------------|
| **S** (small) | 0 – 767 px | 6 | Mobile & tablet-portrait.  Simplified, single-column layouts. |
| **M** (medium) | 768 – 1279 px | 12 | Tablet-landscape.  "Tablet-desktop" feel. |
| **L** (large) | 1280 – 1440 px | 12 | Standard desktop range. |
| **XL** (extra-large) | 1441 px + | 12 | HD / stress-test (e.g. 2560 px). |

Use **mobile-first** overrides with modern syntax:

```css
/* base = S (mobile) */
@media (width >= 768px)  { /* M */ }
@media (width >= 1280px) { /* L */ }
@media (width >= 1440px) { /* XL */ }
```

Never use `min-width:` / `max-width:` shorthand.

---

## Container variants

| Class | Behaviour |
|-------|-----------|
| `.container` | Standard: max-width **1440 px** content area. |
| `.container.wide` | HD: max-width **1920 px** content area. |
| `.container.fluid` | No max-width cap (stretches to **2560 px** max). |

Blocks should respect whichever container they are placed inside.
Do not hardcode max-width on a block unless explicitly required by
the Figma design.

---

## Multi-column distribution (n-up)

Applied on the **section** wrapping the blocks, not on the blocks
themselves.  The classes are:

| Class | Behaviour |
|-------|-----------|
| `.two-up` | 2 blocks per row |
| `.three-up` | 3 blocks per row |
| `.four-up` | 4 blocks per row |

These are handled at the section/grid level.  Blocks should be built
to work at any width — they will be placed into n-up layouts by the
page author.

---

## Grid-width classes

Classes like `.grid-width-4`, `.grid-width-6`, `.grid-width-8`, etc.
constrain a block or section to span a specific number of grid columns.
These are also applied externally, not inside the block itself.

---

## Masonry layouts

In masonry configurations, individual items can span a set number of
columns using grid-column spans.  The masonry grid itself is defined
at the section level.  Blocks inside a masonry layout should be
flexible and not assume a fixed width.

---

## Key takeaway for block authors

Blocks should be **width-agnostic**.  They sit inside a container
and/or n-up grid that controls their outer width.  A block's CSS
should use relative units, percentages, or flex/grid to fill its
allocated space — never assume a fixed pixel width.
