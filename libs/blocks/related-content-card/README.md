# Related Content Card

A horizontal card that references another article in the blog ecosystem. It sits in
the main body of a blog post. The "Related content" section heading is authored
separately, outside this block.

## Authoring

The block supports three authoring shapes. Authored fields always win; a linked
article fills any gaps. Leave a field blank to fall back to the linked value.

### 1. Link only

Author a single cell containing a link to the article. Everything (title, image,
date, reading time, category) is pulled from the linked article.

| related-content-card |
| --- |
| https://.../blog/my-article |

### 2. Authored data only

Author the card content directly. The card always renders as a link element; it
only navigates when a destination link is present (authored heading link, or the
link cell in the mixed shape).

| related-content-card | |
| --- | --- |
| ![image](image.png) | **04-20-2026**<br/>Card title.<br/>5 mins<br/>news |

The text cell order is: a bold date, the title heading, then reading-time and
category paragraphs. Keep empty paragraphs as slots when skipping reading time or
category — a blank slot falls back to the linked value.

### 3. Mixed (link + data)

Author a link plus any fields you want to override. Authored fields win; the rest
come from the linked article. The authored heading may contain its own destination
link.

| related-content-card |
| --- |
| https://.../blog/my-article |
| ![image](image.png) |
| A different title than the linked article's. |

## Behavior

- **Title** — rendered as an `h3`, visually clamped to two lines (full text kept
  for accessibility).
- **Navigation** — the card always renders as a whole-card link that opens in the
  same tab. When no destination link is authored, the link element carries no
  `href` and simply does not navigate.
- **Linked metadata** — read from the linked article's `card-metadata` block
  (`Title`, `cardDate`, `cardImage`) first, falling back to `og:title`/`<title>`,
  `publication-date`, and `og:image`.
- **Category** — the first `caas:topic/*` tag from the linked article's `Tags`;
  `primaryTag` is never shown.
- **Date** — valid dates are formatted as a localized month and year.
- **Reading time** — if not authored, computed from the linked article's main text
  at 200 words/minute (minimum 1 minute), excluding the article header,
  card-metadata, related/recommended cards, navigation, scripts, and styles.
  Authored reading-time text is preserved verbatim.
- **Missing fields** — absent optional values are omitted with no dangling
  separators. If no image resolves, the card is text-only.
- **Fetch failure** — logged via Milo's logging; authored fields are preserved. If
  no title can be resolved, the original article link stays visible.
