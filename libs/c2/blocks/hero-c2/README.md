# hero-c2

## Authoring

Two rows, read by position. The left cell is merged down across both rows and split by lines containing only `+++`.

```
| text   | media-bg |
| +++    |----------|
| widget | media    |
| +++    |          |
| footer |          |
```

- **text**: eyebrow paragraph, heading, body. The eyebrow is the paragraph directly before the heading and may include an SVG product icon link. The heading comes first in the DOM; `order: -1` shows the eyebrow above it.
- **widget**: optional, after the first `+++`. Plain text and buttons by default. The `merch` variant builds merch content with `libs/c2/utils/merch-widget`; the `event` variant lays out dates (below).
- **footer**: optional caption below the widget, after the second `+++`.
- **media-bg**: image, video, or a CSS color/gradient as plain text. It fills the media area.
- **media**: optional image or video, centered over the media-bg. It is the last cell of the second row.

Empty cells render nothing. Without `+++` lines, the second row's first cell is read as the widget and a third row as the footer.

## Variants

- `content-narrow`, `content-wide`: change how many columns the content takes; the media area takes the rest after a 1-column gap.
- `media-bg-full-height`: from 900px, the media-bg runs from the top of the screen, behind the nav, to the bottom of the block, and to the edge of the block's grid.
- `media-bg-full-width`: like `media-bg-full-height`, but the media-bg always runs to the right edge of the screen.
- `media-wide`, `media-xtra-wide`, `media-full`: the media is 33% of the media area wide by default, and at least 250px (never wider than the media area); these make it 50%, 75%, or 100%. The media never grows the media area: a media taller than the area scales down to fit it and stays against the edge set by its placement variants.
- `media-v-start`, `media-v-end`, `media-h-start`, `media-h-end`: place the media at the start or end of the media-bg, vertically or horizontally. Combine one of each for a corner. The media is centered on any axis without a variant.
- `glassy`: puts the media-bg in a translucent, blurred frame with a thin border and shadow.
- `merch`, `event`: block-level only. Set them on the block name, not on a viewport marker.

### Event widget

Each bold-only paragraph starts a date; the paragraphs after it, up to the next bold date or the buttons, are its details. Dates sit side by side and wrap when there is no room.
