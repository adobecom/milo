# Accessibility Check Subagent

This script is delegated from Phase 6 of the main SKILL.md.
Run **only after** the visual comparison loop (Phase 5) is complete.

---

## Target

**WCAG 2.2 AA** — full compliance.  No violations, no incomplete
checks left unresolved.

---

## Tool

Uses `@axe-core/playwright` which is installed as a project dev
dependency.  Axe-core is injected into the page via Playwright MCP.

---

## Procedure

1. **Navigate** to the preview URL using Playwright MCP.
2. **Set viewport** to 1360 px wide (desktop) for the initial scan.
3. **Inject and run axe-core** scoped to the block's root element:
   ```js
   const { AxeBuilder } = require('@axe-core/playwright');

   const results = await new AxeBuilder({ page })
     .include('.block-name')      // scope to the block
     .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
     .analyze();
   ```
4. **Repeat** the scan at mobile viewport (375 px) to catch
   responsive-specific issues (e.g. touch target sizes, focus
   visibility at small sizes).

---

## Processing results

### Violations (must fix)

For each violation in `results.violations`:

1. **Log** the rule ID, impact level, description, and affected nodes.
2. **Fix** the violation:
   - If it's a CSS issue (contrast, focus indicator, sizing), update
     the block's CSS file.
   - If it's an HTML/DOM issue (missing alt text, incorrect ARIA,
     missing labels), update the block's JS file (the JS is
     responsible for DOM manipulation at init time).
   - If it's an authoring issue (e.g. missing alt text on an
     `<img>` that came from the authored content), note it as an
     authoring concern but do not modify authored content.
3. **Re-run** axe-core to confirm the fix.
4. **Repeat** until zero violations.

### Incomplete checks (review)

For each item in `results.incomplete`:

- Assess whether the block can resolve it or whether it requires
  manual review (e.g. colour contrast on complex backgrounds).
- If resolvable, fix it.
- If not, document it in Obstacles Encountered.

### Common block-level a11y issues to watch for

- **Missing focus indicators** on interactive elements.
- **Insufficient colour contrast** between text and background,
  especially on dark/gradient backgrounds.
- **Touch target size** — interactive elements must be at least
  24×24 px (WCAG 2.2 AA target size).
- **Missing or decorative alt text** — ensure `<img>` elements have
  appropriate `alt` attributes.  Decorative images should have
  `alt=""` and ideally `aria-hidden="true"`.
- **Heading hierarchy** — no skipped levels within the block's
  content.  The block should not introduce heading hierarchy issues.
- **Keyboard navigation** — interactive elements must be reachable
  and operable via keyboard.

---

## Iteration limits

- Maximum **3 fix-and-rerun cycles**.
- If violations persist after 3 cycles, document them and move on.

---

## Obstacles Encountered

Compile and surface back to the main skill:

- List of violations found and fixed (rule ID + description).
- List of violations that could not be fixed, with explanation.
- List of incomplete checks that require manual review.
- Any authoring-level concerns (content the block cannot control).
