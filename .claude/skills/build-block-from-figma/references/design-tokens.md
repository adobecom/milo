# Design Tokens Reference

All C2 design tokens live in `libs/c2/styles/styles.css`.
Tokens are prefixed with `--s2a-` and are the **single source of truth**
for the design system.

---

## Token mapping workflow

When building a block from Figma:

1. **Extract the raw value** from the Figma frame (colour, spacing,
   font size, etc.).
2. **Search `libs/c2/styles/styles.css`** for a `--s2a-` variable whose
   value matches (or is very close to) the Figma value.
3. **Use the variable** in your block CSS.  Never hardcode a value when
   a matching token exists.
4. If no matching token exists, hardcode the value **and** leave a
   comment explaining why:
   ```css
   /* No --s2a- token for this 6px radius — verify with design */
   border-radius: 6px;
   ```

---

## Font-family exceptions

Font families do **not** use `--s2a-` tokens.  Instead use:

| Variable | Usage |
|----------|-------|
| `--body-font-family` | Body copy, paragraphs, labels, captions — most text. |
| `--heading-font-family` | Headings (`h1`–`h6`), display text. |

These are the only two font-family variables you should reference.

---

## Responsive token behaviour

Typography and spacing tokens **switch values automatically** via
media queries defined in the token layer (`libs/c2/styles/styles.css`).
This means:

- You do **not** need to redefine `--s2a-font-size-*` or
  `--s2a-spacing-*` per breakpoint in your block CSS.
- Only add breakpoint-specific overrides in your block CSS when the
  Figma design explicitly uses a **different token** at a different
  viewport (e.g. mobile uses `--s2a-spacing-m` but desktop uses
  `--s2a-spacing-xl`).
- If the same token name is used across all Figma frames and the
  rendered size changes, trust the token layer — it handles the switch.

---

## Colour tokens

Colours follow the same `--s2a-` prefix.  Common categories:

- `--s2a-color-*` — brand / UI colours
- `--s2a-bg-*` — background colours
- `--s2a-text-*` — text colours

Always match Figma hex/rgb values against these tokens.  If a Figma
colour is expressed as a gradient (`linear-gradient(...)`) or uses
opacity (`rgb(... / 0.2)`), check whether a corresponding token
exists — some design systems tokenise these, others don't.

---

## Spacing tokens

Spacing tokens (margins, paddings, gaps) are typically:

- `--s2a-spacing-xxs` through `--s2a-spacing-xxl` (or similar scale).

Map every Figma spacing value to the closest token.  If the value falls
exactly between two tokens, prefer the one that matches the Figma spec
and leave a comment.

---

## Checklist before submitting block CSS

- [ ] Every colour value maps to a `--s2a-` token or has a comment.
- [ ] Every spacing value maps to a `--s2a-` token or has a comment.
- [ ] Every font-size / line-height maps to a `--s2a-` token or has a comment.
- [ ] Font families use only `--body-font-family` or `--heading-font-family`.
- [ ] No breakpoint-specific token overrides unless Figma explicitly
      uses a different token at that viewport.
