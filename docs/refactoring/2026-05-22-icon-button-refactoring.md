# Icon Button Refactoring - Implementation Guide

**Date:** 2026-05-22  
**PR:** #5907 (MWPW-194632)  
**Context:** Refactor promo-cta arrow from `::after` pseudo-element to reusable `.icon-button` component per reviewer feedback

---

## Table of Contents
1. [Overview](#overview)
2. [Why This Refactoring?](#why-this-refactoring)
3. [Current Implementation](#current-implementation)
4. [Proposed Implementation](#proposed-implementation)
5. [Code Changes Required](#code-changes-required)
6. [DA Authoring Changes](#da-authoring-changes)
7. [Testing Checklist](#testing-checklist)

---

## Overview

**Goal:** Create a reusable `.icon-button` utility component that can be used across different blocks for:
- Arrow buttons (promo-cta in tour block)
- Close buttons (modal X button)
- Play/pause buttons (video controls)
- Any other icon-only buttons

**Reviewer Feedback (zagi25):**
> "Also I would separate arrow cta and not style it as `::after`, from what I understood X button should have the same styles as arrow button, also I am working on a play/pause button for side-2-side videos that looks the same just with different icon, so maybe we can consolidate all these in styles.css, applying one class will style the button and on block level it can be modified and different icons can be added."

---

## Why This Refactoring?

### Problems with Current `::after` Approach:
1. **Limited flexibility** - Can't easily add different icons without creating new CSS rules
2. **Hard to maintain** - Icon styling is tightly coupled to `.promo-cta`
3. **Not reusable** - Other blocks (modal close, video controls) can't reuse the same pattern
4. **Difficult to animate** - Pseudo-elements have limitations for complex animations
5. **Accessibility concerns** - Screen readers may not handle pseudo-element icons well

### Benefits of `.icon-button` Component:
1. **Reusable** - One component, many use cases
2. **Flexible** - Easy to add new icon types (`.play`, `.pause`, `.plus`, etc.)
3. **Maintainable** - All icon button styling in one place
4. **Consistent** - Same look and feel across all icon buttons
5. **Accessible** - Proper element structure for screen readers

---

## Current Implementation

### Current CSS (libs/c2/styles/styles.css)

```css
/* Current promo-cta with ::after pseudo-element */
.promo-cta {
  align-items: center;
  background: var(--s2a-color-background-knockout);
  border-radius: var(--s2a-border-radius-12);
  color: var(--s2a-color-content-knockout);
  display: inline-flex;
  font-size: var(--s2a-typography-font-size-eyebrow);
  font-weight: var(--s2a-font-weight-eyebrow);
  gap: var(--s2a-spacing-12);
  letter-spacing: var(--s2a-typography-letter-spacing-eyebrow);
  line-height: var(--s2a-typography-line-height-eyebrow);
  padding: var(--s2a-spacing-12);
  text-decoration: none;
  white-space: nowrap;
}

/* Arrow icon as ::after pseudo-element */
.promo-cta::after {
  background: var(--s2a-color-transparent-white-16) url('../assets/img/promo-arrow-right.svg') no-repeat center / 12px 12px;
  block-size: 32px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-transparent-white-12);
  border-radius: 6px;
  box-sizing: border-box;
  content: '' / '';
  display: inline-flex;
  flex-shrink: 0;
  inline-size: 32px;
  transition: background 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
}

/* Arrow direction variants */
.promo-cta.arrow-down::after { transform: rotate(90deg); }
.promo-cta.arrow-left::after { transform: rotate(180deg); }
.promo-cta.arrow-up::after { transform: rotate(-90deg); }

/* Hover state */
.promo-cta:hover:not(:active)::after {
  background-color: var(--s2a-color-transparent-white-24);
  background-image: url('../assets/img/promo-arrow-right.svg');
}

/* Active state */
.promo-cta:active::after {
  background-color: var(--s2a-color-content-knockout) !important;
  background-image: url('../assets/img/promo-arrow-right-black.svg') !important;
  border-color: var(--s2a-color-content-knockout) !important;
}
```

### Current JS (libs/mep/ace1205/tour/tour.js)

```javascript
// Lines 102-143
const link = actionArea.querySelector('a');
if (link) {
  // Handle icon image (prepend to link)
  let prev = actionArea.previousElementSibling;
  if (!prev?.querySelector('picture, img')) {
    prev = prev?.previousElementSibling;
  }
  const icon = prev?.querySelector('img');
  if (icon) {
    if (icon.hasAttribute('src') && isSvgUrl(icon.src)) {
      icon.src = getFederatedUrl(icon.getAttribute('src'));
    }
    prev.remove();
    link.prepend(icon);
  }
}

// Add promo-cta class
if (index === 0 && link) {
  link.classList.remove('con-button', 'blue', 'outline', 'fill', 'button-lg', 'button-md', 'button-sm');
  link.classList.add('promo-cta');
  
  // Apply variant classes
  const variantClasses = ['arrow-down', 'arrow-left', 'arrow-up', 'size-small', 'full-width', 'no-icon'];
  variantClasses.forEach((variant) => {
    if (block.classList.contains(variant)) {
      link.classList.add(variant);
    }
  });
}
```

### Current HTML Output

```html
<!-- Current structure (::after creates arrow) -->
<a href="#" class="promo-cta">
  <img src="icon.svg" alt="" />
  Start your tour
  <!-- ::after pseudo-element creates arrow -->
</a>
```

---

## Proposed Implementation

### New HTML Structure

```html
<!-- Proposed structure (real arrow element) -->
<a href="#" class="promo-cta">
  <img src="icon.svg" alt="" />
  Start your tour
  <span class="icon-button arrow" aria-hidden="true"></span>
</a>
```

### New CSS (libs/c2/styles/styles.css)

```css
/* ===== NEW: Icon Button Component ===== */
/* Base styles for icon-only buttons (32×32px default) */
.icon-button {
  align-items: center;
  background: var(--s2a-color-transparent-white-16);
  block-size: 32px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-transparent-white-12);
  border-radius: 6px;
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  inline-size: 32px;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease, filter 0.2s ease;
}

/* Icon type modifiers - background-image only */
.icon-button.arrow {
  background-image: url('../assets/img/promo-arrow-right.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
}

.icon-button.close {
  background-image: url('../assets/img/icon-close.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
}

.icon-button.play {
  background-image: url('../assets/img/icon-play.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
}

.icon-button.pause {
  background-image: url('../assets/img/icon-pause.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
}

.icon-button.plus {
  background-image: url('../assets/img/icon-plus.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 12px 12px;
}

/* Arrow direction variants */
.icon-button.arrow.down { transform: rotate(90deg); }
.icon-button.arrow.left { transform: rotate(180deg); }
.icon-button.arrow.up { transform: rotate(-90deg); }

/* Size variant - 24×24px for smaller contexts */
.icon-button.small {
  block-size: 24px;
  inline-size: 24px;
}

/* Hover state */
.icon-button:hover {
  background-color: var(--s2a-color-transparent-white-24);
}

/* Active state */
.icon-button:active {
  background-color: var(--s2a-color-content-knockout);
  border-color: var(--s2a-color-content-knockout);
}

/* Active state for arrow - swap to black icon */
.icon-button.arrow:active {
  background-image: url('../assets/img/promo-arrow-right-black.svg');
}

/* Focus state for accessibility */
.icon-button:focus-visible {
  outline: 2px solid var(--s2a-color-content-knockout);
  outline-offset: 2px;
}

/* ===== UPDATED: Promo CTA ===== */
/* Remove ::after styles, keep container styles */
.promo-cta {
  align-items: center;
  background: var(--s2a-color-background-knockout);
  border-radius: var(--s2a-border-radius-12);
  color: var(--s2a-color-content-knockout);
  display: inline-flex;
  font-size: var(--s2a-typography-font-size-eyebrow);
  font-weight: var(--s2a-font-weight-eyebrow);
  gap: var(--s2a-spacing-12);
  letter-spacing: var(--s2a-typography-letter-spacing-eyebrow);
  line-height: var(--s2a-typography-line-height-eyebrow);
  padding: var(--s2a-spacing-12);
  text-decoration: none;
  white-space: nowrap;
}

.promo-cta img {
  block-size: 32px;
  flex-shrink: 0;
  inline-size: 32px;
  object-fit: cover;
  overflow: hidden;
}

/* Size variant */
.promo-cta.size-small {
  font-size: var(--s2a-typography-font-size-label);
  gap: var(--s2a-spacing-12);
  padding: var(--s2a-spacing-12);
}

.promo-cta.size-small img {
  block-size: 24px;
  inline-size: 24px;
}

/* When promo-cta has no icon image, add padding */
.promo-cta.no-icon {
  padding-inline-start: var(--s2a-spacing-md);
}

/* Focus state for the link itself */
.promo-cta:focus-visible {
  outline: 2px solid var(--s2a-color-content-knockout);
  outline-offset: 2px;
}

/* ===== REMOVED: All ::after styles ===== */
/* Delete these:
.promo-cta::after { ... }
.promo-cta.arrow-down::after { ... }
.promo-cta.arrow-left::after { ... }
.promo-cta.arrow-up::after { ... }
.promo-cta:hover:not(:active)::after { ... }
.promo-cta:active::after { ... }
*/
```

### New JS (libs/mep/ace1205/tour/tour.js)

```javascript
// UPDATED: Lines 102-143
const link = actionArea.querySelector('a');
if (link) {
  // Handle icon image (prepend to link)
  let prev = actionArea.previousElementSibling;
  if (!prev?.querySelector('picture, img')) {
    prev = prev?.previousElementSibling;
  }
  const icon = prev?.querySelector('img');
  if (icon) {
    if (icon.hasAttribute('src') && isSvgUrl(icon.src)) {
      icon.src = getFederatedUrl(icon.getAttribute('src'));
    }
    prev.remove();
    link.prepend(icon);
  } else {
    const inlineIcon = actionArea.querySelector('picture img');
    if (inlineIcon) {
      if (inlineIcon.hasAttribute('src') && isSvgUrl(inlineIcon.src)) {
        inlineIcon.src = getFederatedUrl(inlineIcon.getAttribute('src'));
      }
      inlineIcon.closest('picture')?.remove();
      link.prepend(inlineIcon);
    }
  }
}

// Add promo-cta class
if (index === 0 && link) {
  link.classList.remove('con-button', 'blue', 'outline', 'fill', 'button-lg', 'button-md', 'button-sm');
  link.classList.add('promo-cta');
  
  // NEW: Create icon button element
  const iconButton = createTag('span', {
    class: 'icon-button arrow',
    'aria-hidden': 'true'
  });
  
  // Apply arrow direction variants from block-level classes
  if (block.classList.contains('arrow-down')) {
    iconButton.classList.add('down');
  } else if (block.classList.contains('arrow-left')) {
    iconButton.classList.add('left');
  } else if (block.classList.contains('arrow-up')) {
    iconButton.classList.add('up');
  }
  // Default is right arrow (no additional class needed)
  
  // Apply size variant
  if (block.classList.contains('size-small')) {
    link.classList.add('size-small');
    iconButton.classList.add('small');
  }
  
  // Apply other variants
  if (block.classList.contains('full-width')) {
    link.classList.add('full-width');
  }
  if (block.classList.contains('no-icon')) {
    link.classList.add('no-icon');
  }
  
  // Append icon button to link (unless no-icon variant)
  if (!block.classList.contains('no-icon')) {
    link.append(iconButton);
  }
  
  link.setAttribute('daa-ll', link.textContent.trim());
  
  modalCta = createTag('div', { class: 'tour-cta' });
  modalCta.append(actionArea);
}
```

---

## Code Changes Required

### 1. libs/c2/styles/styles.css

**Actions:**
- [ ] Add `.icon-button` base styles (lines ~945-980)
- [ ] Add icon type modifiers (`.arrow`, `.close`, `.play`, `.pause`, `.plus`)
- [ ] Add arrow direction variants (`.down`, `.left`, `.up`)
- [ ] Add size variant (`.small`)
- [ ] Add hover/active/focus states
- [ ] Remove all `.promo-cta::after` styles
- [ ] Remove `.promo-cta.arrow-down::after`, `.promo-cta.arrow-left::after`, `.promo-cta.arrow-up::after`
- [ ] Remove `.promo-cta:hover:not(:active)::after`
- [ ] Remove `.promo-cta:active::after`
- [ ] Keep `.promo-cta` container styles unchanged

**Estimated lines:** ~100 lines (adding icon-button, removing ::after styles)

### 2. libs/mep/ace1205/tour/tour.js

**Actions:**
- [ ] Import `createTag` if not already imported (line ~1)
- [ ] After line 129, add icon button creation logic:
  ```javascript
  const iconButton = createTag('span', {
    class: 'icon-button arrow',
    'aria-hidden': 'true'
  });
  ```
- [ ] Move arrow direction logic from applying to link to applying to iconButton
- [ ] Move size variant logic to apply `.small` to iconButton
- [ ] Append iconButton to link (unless `no-icon` variant)
- [ ] Update variant classes array to match new pattern

**Estimated lines:** ~20 lines changed/added

### 3. libs/c2/blocks/tour/tour.js (if exists)

**Note:** Check if this file exists (for non-MEP preview). If it does, apply the same changes as above.

### 4. libs/c2/assets/img/ (Icon Assets)

**Actions:**
- [ ] Verify `promo-arrow-right.svg` exists
- [ ] Verify `promo-arrow-right-black.svg` exists (for active state)
- [ ] Add `icon-close.svg` (if not exists) for modal close button
- [ ] Add `icon-play.svg` (future)
- [ ] Add `icon-pause.svg` (future)
- [ ] Add `icon-plus.svg` (future)

**Note:** Coordinate with design team for missing icons.

---

## DA Authoring Changes

### ✅ No Changes Required for Existing Tour Content

**Good news:** The authoring pattern in DA remains **exactly the same**. Authors don't need to change anything.

### Current DA Authoring (remains unchanged):

```
Tour Block

Section 1:
----
Icon.svg (image)
----
[Button Text](link-url)
----
Description text
```

**Why no changes?**
- Authors still provide: icon image + link text + URL
- JavaScript automatically creates the arrow icon button
- Block-level classes still control variants:
  - `tour (arrow-down)` → creates down arrow
  - `tour (size-small)` → creates smaller button
  - `tour (no-icon)` → hides arrow icon

### Block-Level Class Variants

Authors can still use these classes on the tour block:

| Class | Effect |
|-------|--------|
| `tour` | Default (right arrow) |
| `tour (arrow-down)` | Down arrow |
| `tour (arrow-left)` | Left arrow |
| `tour (arrow-up)` | Up arrow |
| `tour (size-small)` | Smaller button (24×24 icon) |
| `tour (no-icon)` | Text + image only, no arrow |
| `tour (full-width)` | Full-width button |

### Example DA Authoring

**Basic tour with default right arrow:**
```
tour
----
Section 1:
----
/path/to/icon.svg
----
[Start your tour](#next)
----
This is the description text.
```

**Tour with down arrow:**
```
tour (arrow-down)
----
Section 1:
----
/path/to/icon.svg
----
[Continue](#next)
----
This is the description text.
```

**Tour with small button:**
```
tour (size-small)
----
Section 1:
----
/path/to/icon.svg
----
[Learn more](#next)
----
This is the description text.
```

---

## Testing Checklist

### Visual Testing

- [ ] **Default promo-cta** - Right arrow appears, matches Figma
- [ ] **Arrow variants**:
  - [ ] `arrow-down` - Arrow points down
  - [ ] `arrow-left` - Arrow points left
  - [ ] `arrow-up` - Arrow points up
- [ ] **Size variant** - `size-small` creates 24×24 icon button
- [ ] **No-icon variant** - Arrow hidden, text + image only
- [ ] **Icon image** - Optional icon image displays correctly

### Interaction Testing

- [ ] **Hover state** - Icon button background lightens on hover
- [ ] **Active state** - Icon button turns white with black arrow on click
- [ ] **Focus state** - Keyboard focus shows outline on both link and icon button
- [ ] **Click** - Link navigation works correctly

### Responsive Testing

- [ ] **Mobile** (< 600px) - Button layout correct
- [ ] **Tablet** (600-1024px) - Button layout correct
- [ ] **Desktop** (> 1024px) - Button layout correct

### Accessibility Testing

- [ ] **Screen reader** - Link text announced correctly
- [ ] **Keyboard navigation** - Tab focuses link, Enter/Space activates
- [ ] **aria-hidden** - Icon button not announced by screen readers
- [ ] **Color contrast** - Text meets WCAG AA standards

### Cross-Browser Testing

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

### Regression Testing

- [ ] **Other tour sections** - Non-CTA sections unchanged
- [ ] **Modal behavior** - Modal open/close works
- [ ] **Close button** - Modal X button works (separate update)
- [ ] **Other blocks** - No impact on other blocks

---

## Migration Path

### Phase 1: Implement Icon Button Component (Current PR)
1. Add `.icon-button` CSS to `styles.css`
2. Update `tour.js` to create icon button element
3. Remove `.promo-cta::after` styles
4. Test thoroughly

### Phase 2: Update Modal Close Button (Future PR)
1. Refactor modal close button to use `.icon-button.close`
2. Remove inline SVG from modal.js
3. Test modal functionality

### Phase 3: Add Play/Pause Buttons (Future PR)
1. Add `.icon-button.play` and `.icon-button.pause` styles
2. Implement in video block (side-2-side)
3. Test video controls

---

## Notes for Reviewers

### Why This Approach?

1. **Backwards Compatible** - No DA authoring changes required
2. **Reusable** - Icon button component can be used everywhere
3. **Maintainable** - Single source of truth for icon button styling
4. **Accessible** - Proper semantic HTML with aria attributes
5. **Performant** - No additional DOM queries, minimal JS changes

### Potential Concerns

**Q: Why not use actual `<button>` elements?**  
A: The promo-cta is a link (`<a>`), not a button. The icon button is decorative and controlled by the parent link, so `<span>` is appropriate. If we need standalone icon buttons, we can extend the pattern.

**Q: What about icon button colors in dark mode?**  
A: The current implementation uses transparent white colors that work in both light and dark modes. If adjustments are needed, we can add `.dark .icon-button` styles.

**Q: What if we need different icon sizes?**  
A: The `.icon-button.small` modifier handles 24×24. We can add `.icon-button.large` (48×48) if needed.

---

## Rollout Plan

### Step 1: Code Review
- [ ] Get PR review from zagi25 (original reviewer)
- [ ] Get PR review from narcis-radu
- [ ] Address feedback

### Step 2: QA Testing
- [ ] Deploy to preview environment
- [ ] Run through testing checklist
- [ ] Fix any issues

### Step 3: Merge & Deploy
- [ ] Merge to `site-redesign-foundation`
- [ ] Monitor for issues
- [ ] Document any learnings

### Step 4: Follow-up PRs
- [ ] Update modal close button (Phase 2)
- [ ] Add play/pause buttons (Phase 3)

---

## Questions?

Contact: Sekhar Sirivuri (@sirivuri)  
Reviewers: @zagi25, @narcis-radu  
Figma: lOFnBFhsYyFWPbSdiPa9us
