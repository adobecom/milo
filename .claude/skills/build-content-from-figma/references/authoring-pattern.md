# Authoring Pattern Reference

HTML structure for authoring DA (Document Authoring) block content.
The block is authored as a `<table>` so media can stack in the right
column while the text column spans the full height via `rowspan`.
The surrounding `section-metadata` and `metadata` sections remain
div-based.

---

## Block structure

A block is a `<table>` whose first row is the block header (block
name + variants), and subsequent rows hold content. The header
spans both columns.

```html
<table>
  <tbody>
    <tr><td colspan="2"><p>block-name (variant-a, variant-b)</p></td></tr>
    <!-- content rows -->
  </tbody>
</table>
```

- Header: a single `<td colspan="2">` with `<p>block-name (variant-a, variant-b)</p>`.
  Variants appear in parentheses, comma-separated. If no variants,
  just `<p>block-name</p>`.
- Subsequent rows hold the content.

---

## Content rows — text column + stacked media column

The main content row has two columns:
- **Left:** text content (icon, eyebrow, heading, body, links).
- **Right:** the first media element (background).

Additional media (foreground, extra) stacks vertically in the right
column. The left `<td>` uses `rowspan="N"` where N is the total
number of media sub-rows, and each extra media element is authored
as a follow-up `<tr>` containing only a right-column `<td>`.

```html
<tr>
  <td rowspan="2">
    <!-- text content: icon, eyebrow, heading, body, links -->
  </td>
  <td>
    <!-- first media (background) -->
  </td>
</tr>
<tr>
  <td>
    <!-- second media (foreground) -->
  </td>
</tr>
```

Match `rowspan` to the number of media sub-rows: 1 media = omit
`rowspan`, 2 = bg + fg, 3 = bg + fg + additional.

### Left column: text content

Elements appear in this order (all optional), inside the left `<td>`:

```html
<td rowspan="N">
  <p><a href="https://main--repo--org.aem.page/path/icon.svg">https://main--repo--org.aem.page/path/icon.svg</a></p>
  <p>Eyebrow text</p>
  <h3>Heading text</h3>
  <p>Body text paragraph.</p>
  <p><strong><a href="https://www.adobe.com/">Link 1</a></strong> <em><a href="https://www.adobe.com/">Link 2</a></em></p>
</td>
```

| Element | Tag | Notes |
|---------|-----|-------|
| Icon (SVG) | `<p><a href="url">url</a></p>` | Both href and display text are the `aem.page` preview URL. SVG icons are uploaded at the same level as the document (not the shadow folder), then previewed via the EDS admin API. |
| Eyebrow | `<p>` | Optional detail text above the heading. |
| Heading | `<hN>` | N comes from `--s2a-typography-font-size-title-X`. Avoid emitting multiple `<h1>` across viewport sections; if mobile and desktop both need one, reuse the same text. |
| Body | `<p>` | One or more paragraphs. |
| Links | `<a>` tags with CTA wrappers | URLs are `https://www.adobe.com/` placeholders. Wrap `<a>` based on button style: `<strong><a>` for primary CTA (filled), `<em><a>` for secondary CTA (outline/ghost), bare `<a>` for plain links. |

### Right column: media (background, foreground, additional)

Each media element sits in its own right-column `<td>`. The first
media sub-row shares its `<tr>` with the text cell; every subsequent
media sub-row has its own `<tr>` containing only the right `<td>`.

**Color background** — a CSS color value placed as plain text inside
the `<td>` (no `<picture>` wrapper). Covers hex, gradient, rgba, and
any other valid color string:

```html
<td>#1a1a1a</td>
<td>linear-gradient(135deg, #1a1a1a, #2d2d2d)</td>
<td>rgba(0, 0, 0, 0.5)</td>
```

**Image media:**

```html
<td>
  <picture>
    <img src="<contentUrl>" alt="description">
  </picture>
</td>
```

Use the **final `content.da.live` URL** for the image, uploaded
directly to the DA admin API. Assets are stored in a dot-prefixed
shadow folder (page `docs/my-page.html` stores media in
`docs/.my-page/`).

Order in the right column: background first, foreground second,
then any additional media.

---

## Viewport rows

Viewport rows are full-width rows containing the viewport keyword.
Use a single `<td colspan="2">`:

```html
<tr><td colspan="2"><p>Mobile-viewport</p></td></tr>
```

Keywords (case-sensitive, capitalized):
- `Mobile-viewport` — up to 767 px
- `Tablet-viewport` — 768 to 1279 px
- `Desktop-viewport` — 1280 px and above

Per-viewport variants go in parentheses, comma-separated (same
convention as the block header):

```html
<tr><td colspan="2"><p>Desktop-viewport (variant-c, variant-d)</p></td></tr>
```

---

## Viewport inheritance

Viewports inherit upward: mobile -> tablet -> desktop.

| Scenario | What to author |
|----------|---------------|
| No viewport differences | No viewport rows. A single content row (plus any media sub-rows) after the header. |
| Mobile + desktop differ (tablet same as mobile) | `Mobile-viewport` and `Desktop-viewport` rows, each followed by their own content row(s). No tablet row. |
| All three differ | All three viewport rows, each followed by content row(s). |
| Only media changes on tablet | `Tablet-viewport` row followed by a content row with an empty left `<td>` and new media in the right `<td>`. |

### Partial viewport sections

When only the right (media) column changes, keep the left cell
empty so the previous viewport's text is inherited:

```html
<tr><td colspan="2"><p>Tablet-viewport</p></td></tr>
<tr>
  <td></td>
  <td><new-tablet-background></td>
</tr>
```

Empty `<td></td>` means "inherit from the next lower viewport."

---

## Complete example

All asset references use final `content.da.live` URLs. Assets are
uploaded directly to the DA admin API before the HTML is uploaded.
The `metadata` block with `foundation: c2` is required for C2
blocks; without it the EDS block loader will not resolve
`libs/c2/blocks/*`.

```html
<body>
  <header></header>
  <main>
    <div>
      <table>
        <tbody>
          <tr><td colspan="2"><p>aside</p></td></tr>
          <tr><td colspan="2"><p>Mobile-viewport</p></td></tr>
          <tr>
            <td rowspan="2">
              <p><a href="https://main--repo--org.aem.page/docs/sparkle.svg">https://main--repo--org.aem.page/docs/sparkle.svg</a></p>
              <p>New feature</p>
              <h3>Get started</h3>
              <p>Create stunning visuals with AI-powered tools.</p>
              <p><strong><a href="https://www.adobe.com/">Try free</a></strong> <em><a href="https://www.adobe.com/">Learn more</a></em></p>
            </td>
            <td>#1a1a1a</td>
          </tr>
          <tr>
            <td>
              <picture>
                <img src="https://content.da.live/org/repo/docs/.my-page/hero.png" alt="Hero illustration">
              </picture>
            </td>
          </tr>
          <tr><td colspan="2"><p>Tablet-viewport</p></td></tr>
          <tr>
            <td></td>
            <td>linear-gradient(135deg, #1a1a1a, #2d2d2d)</td>
          </tr>
          <tr><td colspan="2"><p>Desktop-viewport</p></td></tr>
          <tr>
            <td rowspan="2">
              <p><a href="https://main--repo--org.aem.page/docs/sparkle.svg">https://main--repo--org.aem.page/docs/sparkle.svg</a></p>
              <p>Updated feature</p>
              <h3><strong>Get started today</strong></h3>
              <p>Create stunning visuals with our complete suite of AI-powered creative tools.</p>
              <p><strong><a href="https://www.adobe.com/">Explore Firefly</a></strong></p>
            </td>
            <td>linear-gradient(135deg, #1a1a1a, #2d2d2d)</td>
          </tr>
          <tr>
            <td>
              <picture>
                <img src="https://content.da.live/org/repo/docs/.my-page/hero-wide.png" alt="Hero illustration wide">
              </picture>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="section-metadata">
        <div>
          <div>style</div>
          <div>container, wide</div>
        </div>
      </div>
    </div>
    <div>
      <div class="metadata">
        <div>
          <div>foundation</div>
          <div>c2</div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
```
