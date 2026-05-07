# Viewport Content Reference

Some blocks support **per-viewport content variations** — different
text, media, backgrounds, or even variant classes at different
breakpoints.  This is handled by a shared utility that lives in
`libs/utils/decorate.js`.

---

## Authoring markup structure

In the authored HTML (the EDS document markup that arrives at the
block's `init(el)` call), viewport-specific content is separated by
**keyword rows**.  The keywords are:

| Keyword | Viewport |
|---------|----------|
| `mobile-viewport` | S — up to 767 px |
| `tablet-viewport` | M — 768–1279 px |
| `desktop-viewport` | L/XL — 1280 px + |

### How it looks in the DOM

A block with viewport variations arrives as a standard EDS block table
converted to divs.  Within the block's rows, special rows contain the
viewport keywords to delimit sections:

```
block-name (variant-a variant-b)
├── row: [ "mobile-viewport (variant-c)" ]          ← viewport header
├── row: [ col-0 | col-1 ]                          ← content row
├── row: [ extra-content ]                           ← optional extra rows
├── row: [ "tablet-viewport (variant-e variant-g)" ] ← viewport header
├── row: [ col-0 | col-1 ]                          ← content row
├── row: [ "desktop-viewport (variant-c variant-d)" ]← viewport header
├── row: [ col-0 | col-1 ]                          ← content row
├── row: [ extra-content ]                           ← optional extra rows
```

### Content columns

Within each viewport section, content rows follow a **two-column**
pattern.  Blocks interpret these by position:

| Position | rich-content interprets as | base-card interprets as |
|----------|---------------------------|------------------------|
| Column 0 (left) | Text content (headings, body, CTAs) | Foreground content |
| Column 1 (right) | Background (colour, gradient, token) | Media (image) |

If a block does not need the right column, it can be omitted
entirely — the parser handles single-column rows gracefully.

Additional rows after the content row are available as `extraRows`
(e.g. foreground media in rich-content).

### Variant overrides per viewport

The viewport header row can include parenthesised variant classes:

```
mobile-viewport (variant-c)
tablet-viewport (variant-e, variant-g)
desktop-viewport (variant-c, variant-d)
```

These are **additional** variant classes applied only at that viewport,
on top of any base variants defined on the block's root element.
Base variants (e.g. `variant-a variant-b` on the block class) are
never removed — only per-viewport variants are toggled.

Text override classes like `title-3` or `body-lg` can also be
included as per-viewport variants.  They are re-applied automatically
on every viewport switch.

---

## Inheritance rules

Viewports **inherit upward** — higher viewports inherit from lower
ones when content is not explicitly provided:

```
mobile → tablet → desktop
```

Specifically:

1. **Mobile** is the base.  It must always be defined if any viewport
   variations exist.
2. **Tablet** inherits from mobile.  If the `tablet-viewport` section
   is defined but a column (left or right) is **empty**, that column
   inherits from mobile.
3. **Desktop** inherits from tablet (which may itself have inherited
   from mobile).  Same empty-column rule applies.
4. If **tablet is omitted entirely** (no `tablet-viewport` row exists),
   desktop inherits directly from mobile.
5. If **no viewport keywords exist** at all, the block has a single
   set of content used across all viewports — no parsing needed.

### "Empty column" vs "omitted viewport"

- **Omitted viewport** (no keyword row): the viewport does not exist
  in the markup → it inherits everything from the next lower viewport
  **and still renders that content**.  An omitted tablet between mobile
  and desktop does not mean tablet shows nothing — it means tablet
  displays mobile's content.
- **Empty column** within a defined viewport: the viewport is defined
  but one column has no content → that specific column inherits from
  the lower viewport while the other column uses its own content.

This distinction is critical:
- Tablet defined with new media but empty text → tablet gets mobile's
  text + its own media.
- Tablet not defined at all → tablet gets everything from mobile.

---

## The shared utility

### Location

`libs/utils/decorate.js` — three exported functions:
- `decorateViewportContent` — the main API (convenience wrapper)
- `parseViewportContent` — parsing + inheritance (used internally)
- `applyViewportContent` — matchMedia switching (used internally)

### Primary API — `decorateViewportContent`

```js
import { decorateViewportContent } from '../../utils/decorate.js';

function decorate(block, root) {
  // block — the element to decorate.  Either a viewport container
  //         or el itself (when no viewport keywords exist).
  //         Has the same row/column structure the block expects.
  // root  — always the block root element (el).  Use this instead
  //         of .closest() for checking base variant classes, because
  //         viewport containers are detached during decoration.
  const row = block.children[0];
  const foreground = row?.children[0];
  const media = row?.children[1];
  // ... block-specific decoration
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
```

`decorateViewportContent(el, decorateFn)` handles everything:

1. Parses viewport sections and resolves inheritance.
2. Calls `decorateFn(container, el)` on each viewport's content
   (or `decorateFn(el, el)` if no viewport keywords exist).
3. Sets up `matchMedia` listeners to swap content at breakpoints.
4. Toggles per-viewport variant classes on the block root.
5. Re-runs `decorateTextOverrides(el)` after every viewport switch.
6. Returns the viewports object (see below) in case the block
   needs structured data access.

**Blocks that use `decorateViewportContent` must NOT call
`decorateTextOverrides` separately** — it is handled internally.

**Default to `decorateViewportContent` even without viewport
variations.** It falls through to `decorateFn(el, el)` when no
viewport keywords are authored, and keeps the block future-proof
for per-viewport variations without a later refactor.

---

## What belongs in `decorateFn` — and what doesn't

`decorateFn` runs **once per viewport at init time**.  The DOM it
produces is swapped in and out via `replaceChildren` on viewport
changes.  This has a direct consequence for what kind of work is
safe to do inside it.

### Safe: structural decoration

- Adding/removing classes
- Moving or restructuring DOM nodes
- Calling `decorateBlockText`
- Reading content to derive configuration

These operations produce a static DOM subtree that can be swapped
freely without side effects.

### Unsafe: stateful behavior

- Event listeners (`addEventListener`)
- Observers (`ResizeObserver`, `IntersectionObserver`, `MutationObserver`)
- Timers (`setTimeout`, `setInterval`, `requestAnimationFrame`)
- Mutable state objects that close over specific DOM nodes

If `decorateFn` attaches a click listener, that listener runs once
per viewport — so a block with three viewports gets three identical
listeners.  Worse, on viewport switch the nodes those listeners
reference are removed from the document, but the listeners and
closures survive, causing stale references and unexpected behavior.

### Blocks with interactive behavior

Blocks that need listeners, observers, or animation state should
separate their work into two layers:

```
┌─────────────────────────────────┐
│  Behavioral layer               │  Listeners, observers, state.
│  Runs once on the block root.   │  Operates on stable DOM nodes
│  Not managed by the parser.     │  that never get swapped.
├─────────────────────────────────┤
│  Content layer                  │  Classes, DOM structure, text
│  Managed by the parser via      │  decoration. Swapped in/out
│  decorateViewportContent.       │  per viewport.
└─────────────────────────────────┘
```

Call `decorateViewportContent` on the **content container** (not the
block root), and set up behavior separately on the block root:

```js
export default function init(el) {
  // Content layer — viewport-aware, structural only
  contentContainers.forEach((container) => {
    decorateViewportContent(container, decorateContent);
  });

  // Behavioral layer — runs once, stable references
  setupInteraction(el);
}
```

The two layers don't interfere because they operate on different DOM
levels: the parser swaps children inside the content containers while
the behavioral layer holds references to outer shell elements
(wrapper, buttons, etc.) that never leave the DOM.

---

## Return value

`decorateViewportContent` returns an object:

```js
{
  hasViewportVariations: boolean,
  content: {             // only present when hasViewportVariations is true
    mobile: {
      container: Element,      // wrapper div holding all rows
      variants: string[],      // per-viewport class overrides
      columns: Element[],      // columns from the content row, by position
      extraRows: Element[],    // additional rows after the content row
    },
    tablet: { ... },
    desktop: { ... },
  },
  allVariants: string[], // flat list of all per-viewport variant classes
}
```

Most blocks ignore the return value — `decorateViewportContent`
handles everything.  Use it when a block needs post-decoration
access to specific viewport data (e.g. reading a background colour
value from a column).

**Inheritance guarantee**: the parser resolves all inheritance
before returning.  Every viewport in the returned object is fully
populated — if tablet was omitted from the authored markup, `tablet`
still contains mobile's content.  Consuming blocks never need to
implement inheritance logic themselves.

### Breakpoints

Breakpoints align with the C2 grid system:

| Combination | mobile | tablet | desktop |
|-------------|--------|--------|---------|
| mobile + tablet + desktop | `(width < 768px)` | `(768px <= width < 1280px)` | `(width >= 1280px)` |
| mobile + desktop | `(width < 1280px)` | — | `(width >= 1280px)` |
| mobile + tablet | `(width < 768px)` | `(width >= 768px)` | — |

Only one viewport's content is in the DOM at a time.  Inactive
content is held in memory by closures and swapped via
`el.replaceChildren()` on viewport change.

---

## SEO considerations

- Avoid multiple `<h1>` elements across viewport sections.  The
  parser will log a `console.warn` if it detects this.
  If mobile and desktop need different heading text, use a single
  `<h1>` and swap the text content via JS, or use `aria-hidden` to
  hide the duplicate from assistive tech and search engines.
