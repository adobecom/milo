# hero-c2

## Authoring

Three rows, read by position.

```
| text   | background |
| widget | foreground |
| footer |            |
```

- **text**: eyebrow paragraph, heading, body. The eyebrow is the paragraph directly before the heading and may include an SVG product icon link. The heading comes first in the DOM; `order: -1` shows the eyebrow above it.
- **background**: image, video, or a CSS color/gradient as plain text. It fills the media area.
- **widget**: optional. Plain text and buttons by default. The `merch` variant builds merch content with `libs/c2/utils/merch-widget`; the `event` variant lays out dates (below).
- **foreground**: optional image or video, centered over the background.
- **footer**: optional caption below the widget.

Empty cells render nothing. Rows must not be skipped: an empty `| |` row still occupies its position.

## Variants

- `narrow-content`, `wide-content`: change how many columns the content takes; the media takes the rest after a 1-column gap.
- `full-height`: from 900px, the background runs from the top of the screen, behind the nav, to the bottom of the block, and to the edge of the block's grid.
- `full-width`: like `full-height`, but the background always runs to the right edge of the screen.
- `wide-media`, `extra-wide-media`, `full-media`: the foreground is 33% of the media area wide by default; these make it 50%, 75%, or 100%. The foreground never grows the media area: a foreground taller than the area scales down to fit it and stays against the edge set by its placement variants.
- `media-v-start`, `media-v-end`, `media-h-start`, `media-h-end`: place the foreground at the start or end of the background, vertically or horizontally. Combine one of each for a corner. The foreground is centered on any axis without a variant.
- `glassy`: puts the background in a translucent, blurred frame with a thin border and shadow.
- `merch`, `event`: block-level only. Set them on the block name, not on a viewport marker.

### Event widget

Each bold-only paragraph starts a date; the paragraphs after it, up to the next bold date or the buttons, are its details. Dates sit side by side and wrap when there is no room.
