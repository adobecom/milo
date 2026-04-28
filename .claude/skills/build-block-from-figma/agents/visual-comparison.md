# Visual Comparison Subagent

This script is delegated from Phase 5 of the main SKILL.md.
Use **Playwright MCP** for all browser interactions.

---

## Viewport → width mapping

| Viewport | Playwright width | Figma input |
|----------|-----------------|-------------|
| S (mobile) | 375 px | Figma Mobile URL |
| M (tablet) | 1024 px | Figma Tablet URL |
| L (desktop) | 1360 px | Figma Desktop URL |
| XL (HD) | 1920 px | Figma HD URL |

Only test viewports for which a Figma frame was provided.

---

## Comparison procedure (per breakpoint)

For each breakpoint:

1. **Navigate** to the Playwright URL (constructed in Phase 5b).
2. **Set viewport width** to the value from the table above.
   Set height to a generous value (e.g. 900 px) to avoid scroll
   clipping.
3. **Wait** for the block to finish rendering — wait for the block's
   root element to be visible and for any images inside it to load.
4. **Screenshot** the block's bounding box (not the full page).
   Use Playwright's element screenshot to capture just the component.
5. **Load the cached Figma frame** for this breakpoint from
   `/tmp/build-block-figma/<viewport>.png` (saved during Phase 3).
   Do **not** re-fetch from the Figma MCP — the cached file is the
   source of truth for visual comparison.  If the cache file is
   missing for a breakpoint, skip that breakpoint and document it
   in Obstacles Encountered.
6. **Compare** the screenshot against the Figma frame.

---

## What to assess

For each breakpoint, evaluate:

### Layout & stacking
- Are elements stacked vertically vs placed side-by-side correctly?
  This is the most common error — if Figma shows a mobile layout with
  heading above image, the implementation must stack them, not place
  them in a row.
- Flex/grid direction, wrapping, and alignment.
- Element ordering matches Figma layer order.

### Spacing
- Padding, margins, and gaps between elements.
- Spacing between the block and its container edges.
- Spacing between text elements (heading → body → CTA).

### Typography
- Font size, weight, and line height are visually consistent.
- Heading vs body font family is correct.
- Text colour matches the design.

### Colours & backgrounds
- Background colours, gradients, or images match Figma.
- Foreground element colours (text, icons, borders) match.
- Verify colours against `--s2a-` CSS variables.

### Media
- **Element presence check (critical)**: cross-reference the
  per-breakpoint element inventory from Phase 3.  If an image or
  media element exists in the Figma frame for this breakpoint, it
  **must** be visible in the implementation screenshot.  A missing
  image at tablet/desktop when it exists at mobile is the most
  common failure — flag this immediately.
- Images are positioned correctly relative to text content.
- Image aspect ratios are preserved.
- Image sizing fills or fits the container as shown in Figma.

### Overall fidelity
- The implementation looks like the Figma design at a glance.
- No missing elements, no extra elements.
- No overflow or clipping issues.

---

## Iteration loop

If a breakpoint differs meaningfully from the Figma design:

1. **Identify** the specific CSS properties causing the discrepancy.
   Be precise — e.g. "the flex-direction should be column on mobile
   but is currently row" or "the gap between heading and body is
   --s2a-spacing-s but Figma shows --s2a-spacing-m".
2. **Update** the local CSS file (and JS if DOM restructuring is needed).
3. **Make changes visible**:
   - **Localhost mode:** reload the page in Playwright.
   - **Remote-branch-mode:** the main skill (Phase 5e) handles
     pushing updated files to the feature branch and
     force-refreshing the CDN. Follow those instructions rather
     than simply reloading.
4. **Re-screenshot** and **re-assess** the breakpoint.
5. **Repeat** until fidelity is high.

### Iteration limits

- Maximum **5 passes** per breakpoint.
- If after 5 passes there are still discrepancies, **stop iterating**
  and document the remaining issues in the **Obstacles Encountered**
  section.

---

## Obstacles Encountered

At the end of the visual comparison phase, compile a list of:

- Breakpoints that reached high fidelity (pass).
- Breakpoints that still have discrepancies after 5 passes, with
  specific details of what differs and which CSS properties were
  attempted.
- Any Figma ambiguities (e.g. unclear auto-layout settings, unusual
  spacing that doesn't match any token).

Surface this list back to the main skill for inclusion in the final
summary.
