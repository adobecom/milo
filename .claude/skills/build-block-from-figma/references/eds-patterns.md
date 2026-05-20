# EDS Patterns Reference

The project is built on **Adobe Edge Delivery Services (EDS)**.
Consult the **Fluffyjaws MCP** for authoritative EDS conventions.
This document captures the key patterns relevant to block building.

---

## EDS block anatomy

An EDS block is a section of authored content (originally a table in a
Google Doc / Word document) that is converted into semantic HTML divs.
By the time `init(el)` runs, the block element looks like:

```html
<div class="block-name variant-a variant-b">
  <div>                        <!-- row -->
    <div>cell 1 content</div>  <!-- column -->
    <div>cell 2 content</div>  <!-- column -->
  </div>
  <div>                        <!-- row -->
    <div>cell content</div>
  </div>
</div>
```

- The **outer div** has the block name as its class, plus any variant
  classes.
- Each **child div** is a row.
- Each **grandchild div** is a column/cell within that row.

---

## Block file conventions (C2)

```
libs/c2/blocks/
  block-name/
    block-name.js        ← init(el) entry point
    block-name.css       ← all styles for the block
```

- JS exports `export default function init(el) { ... }`.
- CSS is loaded automatically by the EDS framework when the block
  appears on a page.
- No build step — files are served as-is from the edge.
- **Registration**: new C2 blocks must be added to the `C2_BLOCKS`
  array (or similar) in `libs/utils/utils.js`.  Without this entry,
  the block loader falls back to `libs/blocks/` and the C2 block
  will not load.

---

## Common shared utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| `decorateBlockText` | `libs/utils/decorate.js` | Applies standard text decoration to block content (headings, body, etc.).  Use the `isC2` flag for C2 naming conventions. |
| `decorateTextOverrides` | `libs/utils/decorate.js` | Handles text size/style overrides from block variant classes.  Also accepts `isC2`.  **Not needed** when using `decorateViewportContent` — it is called internally. |
| `decorateViewportContent` | `libs/utils/decorate.js` | All-in-one handler for blocks with per-viewport content.  Parses viewport sections, runs the block's decoration function on each, applies matchMedia switching, and re-runs text overrides on viewport change.  See `references/viewport-content.md` for the full API. |
| `createTag` | `libs/utils/utils.js` | Creates DOM elements with attributes and children. |

Always import and re-use these rather than writing bespoke DOM
manipulation.

---

## EDS image handling

Images in EDS are delivered as `<picture>` elements with multiple
`<source>` children (WebP + JPEG fallback, with `srcset` for different
widths).  The EDS platform handles:

- Responsive image sources and `srcset`.
- `loading="lazy"` on below-fold images.
- `width` and `height` attributes for CLS prevention.

Blocks should **not** re-implement image optimisation.  If a block
needs to manipulate images (e.g. move a picture element to a different
position in the DOM), it should move the existing `<picture>` element
rather than creating new `<img>` tags.

---

## EDS CTA / button patterns

In authored markup, CTAs (calls to action) are represented as links
wrapped in `<em>` and/or `<strong>` tags:

| Markup | Rendered as |
|--------|-------------|
| `<em><a href="...">Label</a></em>` | Outline / secondary button |
| `<strong><a href="...">Label</a></strong>` | Fill / primary button |
| `<em><strong><a href="...">Label</a></strong></em>` | Fill button (strong takes precedence) |

The `decorateBlockText` utility handles converting these into proper
button elements.  Do not manually parse CTA markup — rely on the
shared utility.

---

## Fluffyjaws MCP

When in doubt about any EDS convention — block loading, page
lifecycle, content transformation, metadata handling — query the
**Fluffyjaws MCP**.  It has authoritative documentation for the
EDS platform.

Examples of good Fluffyjaws queries:
- "How does EDS deliver the markup to the page?"
- "What is the block decoration lifecycle in a regular project?"
- "How does metadata get applied on the page?"
- "How does EDS handle responsive images?"
