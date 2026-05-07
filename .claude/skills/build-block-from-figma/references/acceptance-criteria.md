# Acceptance Criteria

Load this reference at the start of Phase 4 (Build the component).
All rules here apply to the block's JS and CSS files.

---

## JS rules

- Follow the exact `init(el)` pattern found in existing C2 blocks.
- Re-use `decorateBlockText` from `libs/utils/decorate.js`.
- Re-use `createTag` from `libs/utils/utils.js` to create elements.
- **Always** use `decorateViewportContent(el, decorateFn)` from
  `libs/utils/decorate.js` as the entry point in `init(el)`, even
  when the block has no viewport variations today. It gracefully
  degrades to `decorateFn(el, el)` when no viewport keywords exist,
  and it keeps the block ready for future per-viewport variations
  without requiring a refactor. It also handles `decorateTextOverrides`
  internally, so do **not** call it separately.
  Extract your block-specific decoration into a named function that
  accepts `(block, root)`, then invoke it via `decorateViewportContent(el, decorateFn)`.
  See `references/viewport-content.md` (loaded conditionally in
  Phase 2) for the full API contract.
- **Media parity across breakpoints**: cross-check the element
  inventory from Phase 3. If an image or media element appears in
  the Figma frame for **every** provided breakpoint, the
  implementation must render that media at every breakpoint too.
  Do not hide media via CSS (`display: none`) at larger breakpoints
  unless the Figma frame explicitly omits it. The most common
  failure is building the mobile layout correctly but forgetting to
  position the media in tablet/desktop CSS.
- Keep logic minimal — this is a presentational block.
- No self-initialisation — `init` is called externally.

## JS quality checklist

- Cache DOM queries — never query inside loops.
- Use event delegation on the block root, not per-child listeners.
- No synchronous layout thrashing: batch DOM reads before DOM writes.
  Never interleave `offsetHeight` / `getBoundingClientRect` reads
  with style writes in the same loop.
- `init()` must be lean; extract helpers for complex logic but keep
  the module's public surface to `export default function init(el)`.
- ESLint must pass.

---

## CSS rules

Refer to `references/design-tokens.md` (loaded in Phase 2) for full
token rules and `references/grid-system.md` for the grid/container
system.

- **Mobile-first**: base styles target mobile (S, < 768 px).
- Use **modern media-query syntax**:
  ```css
  @media (width >= 768px)  { /* M — tablet */ }
  @media (width >= 1280px) { /* L — desktop */ }
  @media (width >= 1440px) { /* XL — HD */ }
  ```
  Never use `min-width:` / `max-width:` syntax.
- Only include breakpoints for which a Figma frame was provided.
- Typography and spacing tokens switch automatically via media
  queries defined in the token layer — do not redefine token values
  per breakpoint unless the Figma design explicitly shows different
  token usage.
- Use `--s2a-` tokens for everything; refer to
  `references/design-tokens.md` for the font-family exceptions
  (`--body-font-family`, `--heading-font-family`).

## CSS quality checklist

- No `!important`.
- No inline styles.
- Use **CSS nesting** only when it reduces repetition. Do **not**
  nest a child rule whose selector already starts with the parent's
  class name — write it as a flat top-level rule instead. Block
  class names already namespace their children, so
  `.block { & .block-child { ... } }` is pure noise; write
  `.block-child { ... }` at the top level.
  Only nest when the child selector genuinely needs the parent for
  scoping or combinatoric selection — e.g. `& .descendant`,
  `&:hover`, `&[aria-expanded="true"]`, `&.variant`, `& > p`.
- **Omit `&` in nested selectors** unless it's required for
  compound selectors (pseudo-classes, pseudo-elements, attribute
  selectors, or class chaining on the same element). For
  descendant or child combinators, drop the `&`: write
  `.pdp-faq-trigger { .icon { ... } }` rather than
  `.pdp-faq-trigger { & .icon { ... } }`. Required `&` cases:
  `&:focus-visible`, `&::before`, `&[aria-expanded="true"]`,
  `&.is-open`.
- Use `:is()` and `:has()` where they reduce duplication.
- Selector chain depth ≤ 3.
- Use **CSS logical properties** (`margin-inline`, `padding-block`,
  `inset-inline-start`, etc.) instead of physical properties.
- No magic numbers — every value maps to a `--s2a-` token or has an
  explanatory comment.
- Scope block-level custom properties with a block-name prefix
  (e.g. `--hero-banner-gap`).
- Nesting depth ≤ 3 levels.
- Prefer `transform` and `opacity` for animations
  (compositor-friendly, won't hurt CLS).
- No bare/unqualified tag selectors (`p`, `div`); always scope
  under the block class.
