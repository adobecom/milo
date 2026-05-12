# Token Mapping Reference

Maps `--s2a-typography-*` tokens found in Figma to semantic HTML
elements in the authored content.

---

## Heading tokens

Headings are identified by the `title` keyword in typography tokens.

| Token pattern | Heading level |
|---|---|
| `--s2a-typography-font-size-title-1` | `<h1>` |
| `--s2a-typography-font-size-title-2` | `<h2>` |
| `--s2a-typography-font-size-title-3` | `<h3>` |
| `--s2a-typography-font-size-title-4` | `<h4>` |

Corroborating tokens (same X value confirms the heading level):
- `--s2a-typography-letter-spacing-title-X`
- `--s2a-typography-line-height-title-X`
- `--s2a-typography-font-weight-title-X`

If the font-size token says `title-3` but letter-spacing says
`title-2`, prefer the **font-size** token as the authority.

---

## Body tokens

Body text is identified by the `body` keyword in typography tokens.

| Token pattern | Size class |
|---|---|
| `--s2a-typography-font-size-body-lg` | Large body |
| `--s2a-typography-font-size-body-md` | Medium body (default) |
| `--s2a-typography-font-size-body-sm` | Small body |
| `--s2a-typography-font-size-body-xs` | Extra-small body |

Corroborating tokens:
- `--s2a-typography-letter-spacing-body-X`
- `--s2a-typography-line-height-body-X`
- `--s2a-typography-font-weight-body-X`

Body size can be communicated as a text override variant on the
block or viewport row (e.g. `body-lg`) if the block supports text
overrides via `decorateTextOverrides`.

---

## Eyebrow token

The eyebrow has a single token with no size variant:

| Token | Role |
|---|---|
| `--s2a-typography-font-size-eyebrow` | Eyebrow / detail text |

Corroborating tokens:
- `--s2a-typography-letter-spacing-eyebrow`
- `--s2a-typography-line-height-eyebrow`

The eyebrow is always rendered as a `<p>` element. It appears
between the icon (if present) and the heading.

---

## Fallback heuristics

If Figma does not expose `--s2a-*` tokens directly, use visual
cues to classify text:

| Visual cue | Likely classification |
|---|---|
| Largest text, bold, near the top | Heading |
| Medium text below the heading | Body |
| Small uppercase text above the heading | Eyebrow |
| Small text styled as button/pill/underline, near the bottom | Link / CTA |
| Very small text adjacent to a small icon | Icon label |

When using fallback heuristics, default to:
- Heading: `<h3>` (most common in block content)
- Body: `body-md` (default size)

Document any fallback classifications in the output so the user
can verify.

---

## Token detection in Figma

The `get_design_context` tool from the Figma MCP returns code and
styling hints. Look for token references in:

1. **CSS variable references**: returned code may include
   `var(--s2a-typography-font-size-title-3)` directly.
2. **Style names / text styles**: Figma text styles may be named
   with the token (e.g. "Title 3", "Body MD", "Eyebrow").
3. **Component properties**: if the text lives in a component
   instance, properties may reference the token.
4. **Font size values**: if no token name is visible, match the
   raw font-size pixel value against known token values in
   `libs/c2/styles/styles.css`.

Preference order: direct token reference > style name > component
property > raw value match > visual heuristic.
