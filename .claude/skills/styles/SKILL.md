---
name: styles
description: Generate CSS for a C2 block using --s2a-* design tokens with responsive breakpoints. Use when building or reviewing block styles in /libs/c2/blocks/.
argument-hint: [block-name]
---

# styles

> Generates the CSS for a new C2 block, prioritizing `--s2a-*` design tokens and following the responsive breakpoint strategy used across `/libs/c2/`.

## Description

This sub-skill produces the complete `.css` file for a block. It maps all visual properties to the existing `--s2a-*` token system wherever possible and follows the mobile-first responsive pattern with the standard C2 breakpoints.

## Input

All input is read from `.claude/skills/temp-c2-data.json` (written by the memory skill):
- `blockName`, `blockPrefix` — block identity

Also receives the layout-output from the previous sub-skill in the orchestrator context.

**This skill does NOT use Figma.** All design tokens come from `/libs/c2/styles/styles.css` — the single source of truth for the token system.

## Output

The complete `<block-name>.css` file.

## Instructions

### Step 1 — Read the token system

Read `/libs/c2/styles/styles.css` to confirm the available tokens. Key token families:

**Colors:**
- Grays: `--s2a-color-gray-25` (white) through `--s2a-color-gray-1000` (black)
- Brand: `--s2a-color-brand-adobe-red` (#eb1000)
- Transparent: `--s2a-color-transparent-black-*`, `--s2a-color-transparent-white-*` (04, 08, 12, 16, 24, 32, 48, 64)
- Semantic: `--s2a-color-background-*`, `--s2a-color-content-*`, `--s2a-color-border-*`, `--s2a-color-focus-ring-*`

**Spacing:**
- Primitive: `--s2a-spacing-0` through `--s2a-spacing-240` (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 124, 160, 240)
- Semantic: `--s2a-spacing-none`, `--s2a-spacing-3xs` (2) through `--s2a-spacing-4xl` (64)
- Layout: `--s2a-layout-sm` (80) through `--s2a-layout-2xl` (240)
- Section padding: `--s2a-section-padding-none` through `--s2a-section-padding-xl`

**Typography:**
- Font size: `--s2a-font-size-12` through `--s2a-font-size-96` (also semantic `--s2a-font-size-xs` through `--s2a-font-size-10xl`)
- Font weight: `--s2a-font-weight-adobe-clean-regular` (400), `-medium` (500), `-bold` (700), `-extrabold` (800), `-black` (900)
- Letter spacing: `--s2a-font-letter-spacing-neg-3_84` through `--s2a-font-letter-spacing-0_24`
- Line height: `--s2a-font-line-height-16` through `--s2a-font-line-height-92`
- Responsive typography: `--s2a-typography-font-size-super` through `--s2a-typography-font-size-caption` (change at breakpoints)

**Border radius:**
- `--s2a-border-radius-0` through `--s2a-border-radius-999`
- Semantic: `--s2a-border-radius-none`, `-2xs`, `-xs` (4), `-sm` (8), `-md` (16), `-lg` (32), `-round` (999)

**Blur:**
- `--s2a-blur-xs` (8) through `--s2a-blur-lg` (64)

**Shadows:**
- Levels 1-4 with `--s2a-shadow-level-{n}-{x,y,blur,spread,color}`

### Step 3 — Read existing block CSS patterns

Read `router-marquee.css` and at least one other block's CSS. Key patterns:

**File structure:**
```css
/* 1. Base block selector */
.block-name {
  position: relative;
  overflow: hidden;
}

/* 2. Child elements with prefix */
.<prefix>-content { ... }
.<prefix>-background { ... }

/* 3. State selectors */
.<prefix>-slide.is-active { ... }

/* 4. Shared mobile+tablet overrides */
@media (width < 1280px) { ... }

/* 5. Mobile only */
@media (width <= 767px) {
  .<prefix>-viewport[data-viewport="mobile"] { display: flex; }
}

/* 6. Tablet only */
@media (767px < width < 1280px) {
  .<prefix>-viewport[data-viewport="tablet"] { display: flex; }
}

/* 7. Desktop */
@media (width >= 1280px) {
  .<prefix>-viewport[data-viewport="desktop"] { display: flex; }
}
```

**Common CSS patterns from the codebase:**

Background with cover:
```css
.<prefix>-background img,
.<prefix>-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Content wrapper with max-width:
```css
.<prefix>-content-wrapper {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}
```

Content with z-index layering:
```css
.<prefix>-background { z-index: 0; }
.<prefix>-overlay { z-index: 1; }
.<prefix>-content { position: relative; z-index: 2; }
.<prefix>-controls { z-index: 2; }
```

Glassmorphism / backdrop blur (for cards over dark backgrounds):
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
background: rgba(0, 0, 0, 0.44);
box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.11);
```

Progress bar:
```css
.<prefix>-progress {
  position: absolute;
  inset: auto 0 0;
  height: 4px;
  overflow: hidden;
  border-radius: var(--s2a-border-radius-4);
}
.<prefix>-progress-bar {
  width: 100%;
  height: 100%;
  background: var(--s2a-color-brand-adobe-red);
  transform: translateX(-101%);
}
```

Focus visible:
```css
.<prefix>-element:focus-visible {
  outline: 2px solid var(--s2a-color-gray-25);
  outline-offset: 2px;
  border-radius: <matching-radius>;
}
```

Gradient overlay:
```css
.<prefix>-overlay {
  background: linear-gradient(108deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0) 98.86%);
}
```

**Responsive typography pattern:**
```css
/* Mobile */
.<prefix>-title {
  font-size: var(--s2a-font-size-40);
  line-height: 40px;
  letter-spacing: var(--s2a-font-letter-spacing-neg-1_2);
}

/* Tablet */
@media (767px < width < 1280px) {
  .<prefix>-title {
    font-size: var(--s2a-font-size-56);
    line-height: 56px;
    letter-spacing: var(--s2a-font-letter-spacing-neg-1_68);
  }
}

/* Desktop */
@media (width >= 1280px) {
  .<prefix>-title {
    font-size: var(--s2a-font-size-80);
    line-height: 76px;
    letter-spacing: var(--s2a-font-letter-spacing-neg-3_2);
  }
}
```

**Padding patterns by breakpoint:**
- Mobile: `padding: X var(--s2a-spacing-24)` (24px side padding)
- Tablet: `padding: X 8.333%` (1/12 grid margin)
- Desktop: `padding: X 8.333%`

### Step 4 — Generate the CSS

Produce a complete CSS file following this checklist:

1. **Use tokens everywhere possible.** If a spacing value is 16px, write `var(--s2a-spacing-16)`. If a color is white, write `var(--s2a-color-gray-25)`.
2. **Use the primitive tokens directly** (e.g. `--s2a-spacing-16`) rather than semantic aliases unless the semantic name adds clarity.
3. **Nest selectors sparingly.** The codebase uses some nesting (nested `&` for hover/focus states, nested `a:not(.con-button)`) but keeps nesting shallow — 1 level max.
4. **No `!important`** unless overriding third-party styles.
5. **Use modern CSS.** The codebase uses `:has()`, `:dir(rtl)`, `inset`, `gap`, modern media query syntax (`(width >= 1280px)`).
6. **Absolute slides pattern.** If the block has slides/panels that swap, use `position: absolute; inset: 0;` with `transform: translateX(100%)` for off-screen and `translateX(0)` for active.
7. **`will-change`** only on elements that are frequently animated, and only in the relevant media query scope.
8. **Dark mode considerations.** If the block needs dark/light variants, use the `.dark` class pattern from the token system. The dark class overrides `--s2a-color-*` semantic tokens.

### Step 5 — Validate the CSS

Check that:
- Every color value maps to a `--s2a-color-*` token (or has a comment explaining why not)
- Every spacing value maps to a `--s2a-spacing-*` or `--s2a-layout-*` token
- Every font-size, font-weight, letter-spacing uses a `--s2a-font-*` token
- Breakpoints use the exact syntax: `(width <= 767px)`, `(767px < width < 1280px)`, `(width >= 1280px)`
- No orphaned selectors (every class in CSS corresponds to a class in the JS)
- `overflow: hidden` is on the root block element if it has animated children
