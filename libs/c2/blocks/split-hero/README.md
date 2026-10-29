# split-hero

Copy and optional offer on one side, framed media on the other, over an
optional background.

## Authoring

Two content rows. Cells are read by position.

```
| copy  | media      | background (optional) |
| merch | supporting |
```

- **copy**: eyebrow paragraph, heading, body. The eyebrow is the paragraph
  directly before the heading (standard Milo). It may include an SVG product
  icon link. At render time the heading is moved in front of the eyebrow in
  the DOM, and `order: -1` keeps the eyebrow visually on top, so the heading
  comes first for SEO and assistive tech.
- **media**: image or video-poster pattern, shown inside `.sh-media-frame`.
- **background**: image, video, or a CSS color/gradient as plain text.
  Omit the third cell (2-column row) for no background.
- **merch**: headless MAS field links (`&field=…`) plus authored text.
  Empty cell means no merch card.
- **supporting**: caption text below the copy. Empty cell means none.
  The whole second row may be omitted.

## Viewport groups

With `mobile-viewport` / `tablet-viewport` / `desktop-viewport` markers, an
empty cell inherits the matching cell from the previous group, but only if the
cell exists. A later group must therefore repeat both rows, and must keep the
third column (empty) whenever an earlier group sets a background, or that
viewport renders without one.

```
mobile-viewport
| copy  | media        | linear-gradient(…) |
| merch | supporting   |
tablet-viewport
|       | tablet media |                    |
|       |              |
```
