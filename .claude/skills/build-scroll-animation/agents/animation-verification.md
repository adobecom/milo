# Animation Verification Agent

This agent is delegated from Phase 5 of the main SKILL.md.
Uses **Playwright MCP** to verify scroll-driven animations
trigger correctly and produce the expected visual result.

---

## Inputs

The main skill provides:

1. **Preview URL** — localhost URL where the page is served.
2. **Block selector** — CSS selector for the animated element.
3. **Expected effect** — description of what should happen
   (e.g. "element slides up 100px and fades in during entry").
4. **Animation class(es)** — the parallax class(es) applied.
5. **Animation range** — the expected `animation-range` values.
6. **Breakpoints to test** — which viewports to verify.

---

## Viewport mapping

| Viewport | Playwright width | Height |
|----------|-----------------|--------|
| S (mobile) | 375 px | 812 px |
| M (tablet) | 1024 px | 768 px |
| L (desktop) | 1360 px | 900 px |

Test at desktop (L) by default. Test additional viewports only if
the animation has responsive-specific behavior (different ranges
or values per breakpoint).

---

## Verification procedure

### Step 1 — Navigate and set viewport

1. Navigate to the preview URL via Playwright MCP.
2. Set viewport to the target width and height.
3. Wait for the page to fully load (network idle).

### Step 2 — Verify animation support

Run in browser console:

```js
const el = document.querySelector('<block-selector>');
const styles = getComputedStyle(el);
const timeline = styles.animationTimeline;
const name = styles.animationName;
console.log('animation-name:', name);
console.log('animation-timeline:', timeline);
```

**Gate**: if `animation-name` is `none` or `animation-timeline` is
`auto` (time-based), the scroll-driven animation is not applying.
Investigate:
- Is the class applied to the element?
- Is `@supports (animation-timeline: view())` passing?
- Is the CSS file loaded?

### Step 3 — Capture pre-scroll state

1. Scroll to position the animated element **below** the viewport
   (before it enters). For most cases, scroll to just above the
   section containing the element.
2. **Screenshot** the element's parent section or a region that
   includes the element.
3. Save as `/tmp/build-scroll-animation/pre-scroll.png`.

### Step 4 — Scroll to trigger animation

1. Scroll the element into view incrementally. Use multiple small
   scroll steps to simulate natural scrolling:

   ```js
   // Scroll element to roughly entry 50%
   const el = document.querySelector('<block-selector>');
   const rect = el.getBoundingClientRect();
   const scrollTarget = window.scrollY + rect.top - (window.innerHeight * 0.5);
   window.scrollTo({ top: scrollTarget, behavior: 'instant' });
   ```

2. **Screenshot** the element mid-animation.
3. Save as `/tmp/build-scroll-animation/mid-scroll.png`.

### Step 5 — Scroll to animation complete

1. Scroll until the element is fully in the viewport (past the
   animation range end):

   ```js
   const el = document.querySelector('<block-selector>');
   const rect = el.getBoundingClientRect();
   const scrollTarget = window.scrollY + rect.top - (window.innerHeight * 0.3);
   window.scrollTo({ top: scrollTarget, behavior: 'instant' });
   ```

2. **Screenshot** the element post-animation.
3. Save as `/tmp/build-scroll-animation/post-scroll.png`.

### Step 6 — Validate visual states

Compare the three screenshots:

#### Pre-scroll state
- The element should reflect the `from` keyframe state.
- For `parallax-opacity`: element should be invisible or nearly so.
- For `parallax-move-up`: element should be offset downward.
- For `parallax-scale-up`: element should appear smaller.
- If the element looks fully normal (no transform/opacity change),
  the animation may not be applying.

#### Mid-scroll state
- The element should be in a visibly intermediate state.
- Partially faded in, partially translated, etc.
- If it looks identical to pre-scroll or post-scroll, the
  animation range may be too narrow or the scroll position is
  outside the range.

#### Post-scroll state
- The element should be in its final, natural state.
- Fully opaque, no transform offset, no blur.
- This is the "designed" appearance of the block.

### Step 7 — Verify reduced motion

1. Enable reduced motion preference:

   ```js
   // In Playwright, use emulateMedia
   await page.emulateMedia({ reducedMotion: 'reduce' });
   ```

2. Reload the page and scroll to the element.
3. **Screenshot** the element.
4. The element should appear in its final state with no animation.
5. Save as `/tmp/build-scroll-animation/reduced-motion.png`.

---

## Iteration loop

If any verification step fails:

1. **Diagnose** the issue:
   - Animation not applying → check class names, CSS specificity,
     `@supports` block
   - Wrong visual state → check keyframe values, animation range
   - No intermediate state → range too narrow or inset values
     preventing trigger
2. **Fix** the CSS.
3. **Reload** and re-verify from Step 2.
4. Maximum **3 iterations** per breakpoint.

---

## Output format

```
Animation Verification Report
──────────────────────────────

Viewport: [size]px

Animation detection:
  animation-name:     [value]    [PASS/FAIL]
  animation-timeline: [value]    [PASS/FAIL]

Visual states:
  Pre-scroll:     [matches expected from-state / FAIL — detail]
  Mid-scroll:     [intermediate state visible / FAIL — detail]
  Post-scroll:    [matches expected final state / FAIL — detail]

Reduced motion:  [element in final state, no animation / FAIL]

Iterations: [N]
```

---

## Obstacles Encountered

Compile and surface back to the main skill:

- Whether the animation was detected and triggered correctly.
- Any visual discrepancies between expected and actual states.
- Breakpoints where verification failed after max iterations.
- Reduced-motion compliance status.
- Screenshots saved to `/tmp/build-scroll-animation/` for
  manual review.
