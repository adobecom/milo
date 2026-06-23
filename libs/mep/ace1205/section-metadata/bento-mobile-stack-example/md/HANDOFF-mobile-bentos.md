# Handoff: Bento Mobile Stacking Animation

**Branch:** `bentos-mobile`  
**File:** `libs/c2/blocks/section-metadata/section-metadata.css`  
**Last known state:** All animation code has been reverted. The file is currently 149 lines with no bento mobile stacking logic.

---

## What this feature is

On mobile (< 768px), `.section.bento` should display its child `.explore-card` elements as a sticky-scroll stack — cards appear to pile up as the user scrolls, each one slightly smaller and darker than the card on top. A `.rich-content` block is always the first meaningful child and acts as a section title; it should stick at the top while the cards scroll beneath it.

The effect is modeled on the existing implementation in `elastic-carousel.css` starting at line 290.

---

## DOM structure to be aware of

Inside `.section.bento`, the direct children are always in this order:

```
.section.bento
  ├── .section-metadata   ← display: none; must be IGNORED (this shifts :nth-child counts by 1)
  ├── .rich-content       ← section title; sticky at top, no animation
  ├── .explore-card       ← card 1
  ├── .explore-card       ← card 2
  └── ...up to 7 cards
```

**Critical:** `.section-metadata` is `display: none` but still exists in the DOM, which means `:nth-child(1)` is `.section-metadata`, not `.rich-content`. Using positional selectors like `:first-child` or `:nth-child(n)` will target the wrong elements. Only class-based selectors work reliably here.

---

## Selector rules that work

| Need | Use |
|---|---|
| Target only explore-cards | `> .explore-card` |
| Count cards positionally | `> .explore-card:nth-child(n of .explore-card)` |
| Target the title | `> .rich-content` |

**Do NOT use:**
- `> :first-child` (hits `.section-metadata`)
- `> :not(:first-child)` (includes `.rich-content`)
- `:has(.explore-card)` — this checks if an element *contains* a descendant `.explore-card`, not if it *is* one. An element with class `explore-card` does NOT match `:has(.explore-card)`.

---

## CSS that needs to be added

### 1. Mobile stacking block — inside `@media (width < 768px)`

```css
.section.bento {
  --bento-last-offset: 2.5rem;
  --bento-offset-adjuster: 50px;
  --bento-offset-scale: 0.85;
  --bento-offset-variance-index: -2px;

  display: flex;
  flex-direction: column;
  gap: 20vh;
  overflow: visible;
  padding-bottom: calc(var(--bento-last-offset) * var(--bento-offset-scale));

  /* Title: stick at top, no animation */
  > .rich-content {
    position: sticky;
    top: var(--s2a-spacing-xl);
    z-index: 20;
    margin-block-end: 0;
    animation: none;
  }

  /* All cards: sticky + scroll-driven animation */
  > .explore-card {
    position: sticky;
    top: 20%;
    width: 100%;

    animation: bento-mobile-stack-slides linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }

  /* Card 1: already at bottom of stack, fades out (not in) */
  > .explore-card:nth-child(1 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 7) - var(--bento-offset-variance-index) * 7);
    --bento-stack-contrast: 0;
    --bento-stack-scale: 0.85;

    z-index: 1;
    animation-name: bento-mobile-stack-slides-ignore-opacity;
  }

  > .explore-card:nth-child(2 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 6) - var(--bento-offset-variance-index) * 6);
    --bento-stack-contrast: 0.17;
    --bento-stack-scale: 0.875;

    z-index: 2;
  }

  > .explore-card:nth-child(3 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 5) - var(--bento-offset-variance-index) * 5);
    --bento-stack-contrast: 0.33;
    --bento-stack-scale: 0.9;

    z-index: 3;
  }

  > .explore-card:nth-child(4 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 4) - var(--bento-offset-variance-index) * 4);
    --bento-stack-contrast: 0.5;
    --bento-stack-scale: 0.925;

    z-index: 4;
  }

  > .explore-card:nth-child(5 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 3) - var(--bento-offset-variance-index) * 3);
    --bento-stack-contrast: 0.67;
    --bento-stack-scale: 0.95;

    z-index: 5;
  }

  > .explore-card:nth-child(6 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 2) - var(--bento-offset-variance-index) * 2);
    --bento-stack-contrast: 0.83;
    --bento-stack-scale: 0.975;

    z-index: 6;
  }

  /* Card 7 (last): full size, full contrast, never shrinks */
  > .explore-card:nth-child(7 of .explore-card) {
    --bento-stack-offset: calc(var(--bento-last-offset) - (var(--bento-last-offset) / 7 * 1) - var(--bento-offset-variance-index));
    --bento-stack-contrast: 1;
    --bento-stack-scale: 1;

    z-index: 7;
    height: auto;
    animation-name: bento-mobile-stack-slides-top;
  }
}
```

### 2. Keyframes — add at the bottom of the file

```css
@keyframes bento-mobile-stack-slides {
  0% {
    transform: translateY(var(--bento-stack-offset)) scale(1);
    filter: contrast(1);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  20% {
    filter: contrast(1);
  }

  100% {
    transform: translateY(calc(var(--bento-stack-offset) - var(--bento-offset-adjuster))) scale(var(--bento-stack-scale, 1));
    filter: contrast(var(--bento-stack-contrast));
  }
}

@keyframes bento-mobile-stack-slides-ignore-opacity {
  0% {
    transform: translateY(var(--bento-stack-offset)) scale(1);
    filter: contrast(1);
    opacity: 1;
  }

  20% {
    filter: contrast(1);
    opacity: 1;
  }

  100% {
    transform: translateY(calc(var(--bento-stack-offset) - var(--bento-offset-adjuster))) scale(var(--bento-stack-scale, 1));
    filter: contrast(var(--bento-stack-contrast));
    opacity: 0.2;
  }
}

@keyframes bento-mobile-stack-slides-top {
  0% {
    transform: translateY(var(--bento-stack-offset)) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(calc(var(--bento-stack-offset) - var(--bento-offset-adjuster))) scale(1);
    opacity: 1;
  }
}
```

---

## Stylelint requirements

`animation-timeline` and `animation-range` must be in `.stylelintrc.json` under `property-no-unknown.ignoreProperties`. This was already confirmed working — verify the file still has it:

```json
"property-no-unknown": [
  true,
  {
    "ignoreProperties": [
      "animation-timeline",
      "animation-range"
    ]
  }
]
```

### Common lint errors to watch for

- `declaration-empty-line-before`: stylelint requires a **blank line** before any non-custom-property declaration that follows a CSS variable declaration inside a rule block. Each `nth-child` block sets `--bento-stack-*` vars then `z-index` — the blank line before `z-index` is required.
- Keyframe names must be **kebab-case** (`bento-mobile-stack-slides`, not `bentoMobileStackSlides`).
- Zero lengths must be unitless (`0`, not `0rem`).

---

## Outstanding unknown: why did stacking stop working?

The last known state before revert: replacing `:has(.explore-card)` selectors with `> .explore-card` (the correct fix) still resulted in cards not sticking or stacking. **The root cause was not confirmed.**

### Next debugging steps

1. **Verify DOM structure in DevTools.** Open the page on mobile viewport and inspect `.section.bento`. Confirm `.explore-card` elements are *direct children*, not wrapped in grid-span divs like `<div class="grid-span-4">`. If they are wrapped, `> .explore-card` won't match and the selectors need to target the wrapper instead:

   ```css
   > [class*='grid-span']:has(> .explore-card)
   ```

2. **Check if `display: flex` on `.section.bento` conflicts with other layout rules.** The bento section may have `display: grid` applied by other rules that override the mobile flex layout. Inspect computed styles.

3. **Confirm `animation-timeline: view()` is supported.** The `view()` timeline requires the element's scroll container to be the document or a scrollable ancestor. If `.section.bento` has `overflow: hidden` or `overflow: clip` applied by another rule, `view()` won't fire. Check for inherited overflow constraints.

4. **Test with a minimal reproduction.** Strip the bento to just 2–3 cards with no grid/masonry classes and apply only the mobile stacking CSS to confirm the core mechanism works before layering in all the nth-child variants.

---

## Reference

- Existing working implementation: `libs/c2/blocks/elastic-carousel/elastic-carousel.css` lines 290–415
- Stylelint config: `.stylelintrc.json`
- Lint command: `npm run lint`
