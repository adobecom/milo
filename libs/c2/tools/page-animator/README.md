# Page Animator

A bookmarklet tool for designing scroll-based animations on C2 pages. Use the panel to configure animations visually, then copy the settings directly into DA as an `animation` block.

---

## Setup

Install the bookmarklet from [bookmarklet.md](./bookmarklet.md). One bookmarklet works across all environments — it detects localhost, branch previews, and production automatically.

To launch the panel, click the bookmarklet while on any C2 page.

---

## The Panel

The panel opens on the right side of the page and shows a tree of every section and block on the page.

**Selecting an element**
Click any item in the tree to select it. The controls below update to show that element's current animation settings.

**Animated properties**
- **Opacity from** — starting opacity (0 = invisible, 1 = fully visible)
- **Translate Y / X** — vertical and horizontal slide distance in pixels
- **Scale from** — starting scale (1 = normal size)
- **Blur** — starting blur in pixels
- **Easing** — animation curve (ease, ease-in-out, linear, or cubic-bezier)

**Range**
Controls which portion of the scroll timeline triggers the animation.
- **Range start** — when the animation begins (e.g. `entry 0%` = as soon as the element enters the viewport)
- **Range end** — when the animation completes

**Timing**
Each animated property (opacity, transform, blur) has its own start % and end % within the range. This lets properties animate at different moments — for example, opacity fades in during the first 60% while the element slides up across the full 100%.

**Dot colors in the tree**
- No dot — no animation applied
- White dot — animation set via the panel (saved in browser localStorage)
- Green dot — animation loaded from an `animation` block in DA

---

## Buttons

**Reset animation** — removes the animation from this element entirely.

**Reset to block** — appears when a green dot is shown. Discards any panel edits and restores the values from the `animation` block in DA.

**Copy to DA / Copy updated** — copies the current animation settings as a formatted table, ready to paste directly into DA. "Copy updated" appears when a block already exists for this element.

---

## The Animation Block

The animation block lets you store animation settings directly in DA so they apply automatically on page load — no bookmarklet needed for visitors.

### Creating a block

1. Configure the animation in the panel
2. Click **Copy to DA**
3. In DA, place your cursor where you want the block (inside the same section as the element you're animating)
4. Paste — the table appears ready to use

### Block format

The first row is the block header. It defines which element in the section to animate:

| Variant | Target |
|---|---|
| `animation` | The section block |
| `animation marquee` | First `.marquee` in the section |
| `animation (base-card)` | First `.base-card` in the section (use parens for hyphenated names) |
| `animation text 2` | Second `.text` in the section |

The remaining rows are key-value pairs — one property per row:

| animation marquee | |
|---|---|
| --pa-opacity-from | 0 |
| --pa-translate-y | 60 |
| --pa-easing | linear |
| range-start | entry 0% |
| range-end | entry 100% |
| timing-opacity-start | 0 |
| timing-opacity-end | 100 |
| timing-transform-start | 0 |
| timing-transform-end | 100 |
| timing-blur-start | 0 |
| timing-blur-end | 100 |

All 14 properties are always included when copying from the panel. You can edit any value directly in DA.

### How it works on page load

When the page loads, the animation block reads its key-value rows, finds the target element, applies a CSS scroll-driven animation, and hides itself. No bookmarklet required.

### Editing an existing animation block

The panel reflects block values automatically — elements with a block show a green dot. To update:

1. Open the panel and select the element (green dot)
2. Adjust the controls
3. Click **Copy updated**
4. In DA, select and delete the old block, then paste the new one

---

## Workflow Summary

```
Design in panel  →  Copy to DA  →  Paste into DA  →  Preview page
                                                       (animation applies automatically)

Return to refine  →  panel shows green dot  →  adjust  →  Copy updated  →  paste in DA
```
