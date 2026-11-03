# split-hero

Copy and optional offer on one side, framed media on the other, over an
optional background.

## Parallax reveal (experimental)

Use `Split Hero (parallax-reveal)` in the first section, followed by a section
with `rounded-corners-top`. Desktop starts with media behind the rounded
section, reveals the whole frame while holding the copy, then lets the lower
section rise over it. Mobile uses subtle layer drift without pinning or scaling.
Video play/pause controls sit top-left for this variant, instead of bottom-left.
On load, the copy text, merch card and supporting text fade and rise in turn,
with the media after the copy text from 900px and last below that. Copy text
and media start at
`opacity: 0.05`, never 0 (LCP). The intro uses `translate`, so scroll-driven
drifts on the same elements must stay on `transform`.
The variant replaces a section's garage-door animation. Reduced motion and
browsers without scroll-timeline support retain the static layout.
Firefox supports scroll-driven animations but does not create a named view
timeline from the `view-timeline` shorthand, and keeps it inactive if it is
declared while the section is hidden. The timeline is therefore declared with
longhands, and only once Milo removes the section's `data-status`.
Use `?milolibs=local` to test local code with the authored variant.

## Authoring

Three content rows, two columns. Cells are read by position. A cell with
only empty paragraphs renders as empty.

```
| copy       | media                 |
| merch      | background (optional) |
| supporting |                       |
```

- **copy**: eyebrow paragraph, heading, body. The eyebrow is the paragraph
  directly before the heading (standard Milo). It may include an SVG product
  icon link. At render time the heading is moved in front of the eyebrow in
  the DOM, and `order: -1` keeps the eyebrow visually on top, so the heading
  comes first for SEO and assistive tech.
- **media**: image or video-poster pattern, shown inside `.split-hero-media-frame`.
- **background**: image, video, or a CSS color/gradient as plain text.
  Leave the second cell of the second row empty for no background. Invalid
  CSS text renders no background.
- **merch**: headless MAS field links (`&field=…`), legacy inline prices and
  `data-wcs-osi` CTAs, plus authored text.
  Empty cell means no merch card.
- **supporting**: caption text below the copy. Empty cell means none.
  The third row may be omitted when there is no supporting text. If there
  is also neither merch nor background, the second row may be omitted too.
  Keep an empty second row when authoring supporting text without merch
  or background, so the supporting cell stays in the third row.

## Viewport groups

With `mobile-viewport` / `tablet-viewport` / `desktop-viewport` markers, an
empty cell inherits the matching cell from the previous group, but only if the
cell exists. A later group must therefore repeat all three rows to inherit
all content, including an empty second cell in the second row to inherit
the background. Omitting a row or cell renders that viewport without its
corresponding content.

```
mobile-viewport
| copy       | media              |
| merch      | linear-gradient(…) |
| supporting |                    |
tablet-viewport
|            | tablet media       |
|            |                    |
|            |                    |
desktop-viewport
|            |                    |
|            |                    |
|            |                    |
```

## Variants

Same merch variants as `product-marquee-grid`, set on the block name:

- `dark`: dark block background.
- `special-promo`: gives the merch card its own surface that contrasts with
  the hero (a dark card on a light hero, a light card with `dark`).
- `merch-md`: medium MAS description text. Small is the default, so
  `merch-sm` is accepted but changes nothing.
- `legal`: small description text on mobile, medium from 768px.
- `cta-stack`: full-width stacked CTAs.
- `cta-pill`: CTAs move to the end of the card, and from 768px the card is a
  rounded pill with the content and CTAs side by side.

Variants are read from the block's own classes when it is decorated, so
classes added through a viewport marker, e.g. `tablet-viewport (cta-pill)`,
only apply their CSS; they don't change the card structure.
