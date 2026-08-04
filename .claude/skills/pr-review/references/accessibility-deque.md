# Accessibility knowledge base (WCAG / axe-core, via Deque)

Source: deque.com's WCAG compliance guidance and Deque University's axe-core rule catalog (`dequeuniversity.com/rules/axe/4.10/`). Deque is the organization behind axe-core, the accessibility testing engine this repo's own test suite already depends on (`@axe-core/playwright`, `nala/libs/accessibility.js`, and the `build-block-from-figma` skill's accessibility-check subagent — see `milo-domain-knowledge.md`). This file supplies the underlying technical spec/rule catalog; `reviewer-knowledge.md`'s `[A11y]` section captures this team's actual real-world review *habits* on top of it — use both together.

## WCAG conformance model

- Levels: **A** (30 success criteria in WCAG 2.1) / **AA** (+20, 50 total) / **AAA** (+31, 81 total, "not possible to satisfy... for some types of content" — rarely a hard requirement).
- **AA is the practical compliance bar** — required by the ADA, Section 508, and the EU's EN 301 549. This matches `milo-domain-knowledge.md`'s existing WCAG 2.2 AA target — not an arbitrary internal choice, it's the industry/legal norm.
- Four **POUR** principles — useful as a fallback mental model when a finding doesn't map cleanly to a single axe rule: **P**erceivable, **O**perable, **U**nderstandable, **R**obust.
- Six criteria called out as the highest-impact/most commonly-violated: **1.4.3** Contrast (Minimum), **4.1.2** Name/Role/Value, **1.3.1** Info and Relationships, **2.4.1** Bypass Blocks, **1.1.1** Non-text Content, **3.1.1** Language of Page.

## Key numeric thresholds (from the WCAG spec itself — these weren't listed on the fetched Deque page, but are the standard published values, worth confirming against the current spec if a PR's claim depends on the exact number)

- **Contrast, 1.4.3 (AA)**: 4.5:1 for normal text, 3:1 for large text (≥18pt, or ≥14pt bold).
- **Non-text contrast, 1.4.11 (AA)**: 3:1 for UI component boundaries/states and meaningful graphics.
- **Enhanced contrast, 1.4.6 (AAA)**: 7:1 normal text, 4.5:1 large text — maps to axe's `color-contrast-enhanced` rule.
- **Target size, 2.5.8 (AA, new in WCAG 2.2)**: minimum 24×24 CSS pixels, with exceptions (inline text links, essential/legally-mandated sizing, or adequate spacing compensating for a smaller target). Matches `milo-domain-knowledge.md`'s existing "touch targets <24×24px" note — same threshold, now tied to the actual spec citation.

## axe-core rule catalog (v4.10) — a concrete checklist for markup/ARIA/CSS changes

Grouped by review-relevant category (impact level in parens: critical > serious > moderate > minor):

**Images & non-text content (1.1.1)**
`image-alt` (critical) — `<img>` needs alt text or `role="none"/"presentation"`. Same requirement extends to `input-image-alt`, `area-alt` (critical, image maps), `object-alt` / `role-img-alt` / `svg-img-alt` (serious). `image-redundant-alt` (minor) — don't repeat alt text as adjacent visible text.

**Forms & labels (1.3.1 / 4.1.2)**
`label` (critical) — every form element needs a real label, not just a `title` attribute or a hidden-only label (`form-field-multiple-labels` moderate, `label-title-only` serious). Every interactive control needs a computed accessible name: `select-name` / `button-name` / `input-button-name` (critical), `aria-input-field-name` / `aria-toggle-field-name` (serious). `autocomplete-valid` (serious) — `autocomplete` values must be from the valid token list.

**ARIA correctness (4.1.2 — the single largest rule category, and the most common failure mode in hand-rolled custom widgets)**
`aria-required-attr` / `aria-allowed-attr` / `aria-valid-attr` / `aria-valid-attr-value` (all critical) — a role's required/allowed attributes and their values must be spec-compliant. `aria-required-children` / `aria-required-parent` (critical) — composite roles (`listbox`/`option`, `tablist`/`tab`/`tabpanel`) need correct DOM containment, not just scattered correct roles. Every ARIA widget role needs a computed accessible name: `aria-command-name` / `aria-progressbar-name` / `aria-meter-name` / `aria-tooltip-name` / `aria-dialog-name` (serious). `aria-hidden-body` (critical) — never `aria-hidden="true"` on `<body>`. `aria-hidden-focus` (serious) — never leave a focusable element inside an `aria-hidden` subtree (a screen-reader user could still tab into content hidden from them). `nested-interactive` (serious) — don't nest interactive controls (e.g. a link/button inside a button) — screen readers won't reliably announce the inner one.

**Headings, landmarks & document structure (1.3.1 / 2.4.1)**
`heading-order` (moderate) — levels shouldn't skip (h2 → h4 with no h3). `page-has-heading-one` (moderate), `empty-heading` (minor). `landmark-one-main` / `landmark-unique` / the `landmark-no-duplicate-*` family (moderate) — exactly one `main`, uniquely-labeled landmarks, no duplicate banner/contentinfo/main. `region` (moderate) — all page content contained by a landmark. `bypass` (serious) — every page needs a skip-navigation mechanism. `html-has-lang` / `html-lang-valid` (serious) — directly relevant to milo's own `setConfig()`-driven `lang`/`dir` attribute logic (see `milo-domain-knowledge.md`'s RTL section) — a locale change that breaks this is a real, checkable regression.

**Tables**
`td-headers-attr` / `th-has-data-cells` (serious), `scope-attr-valid` (moderate) — data tables need correctly *associated* headers, not just visually-styled header cells.

**Media**
`video-caption` (critical) — videos need captions. `no-autoplay-audio` (moderate) — audio/video shouldn't autoplay with sound for more than 3 seconds — directly relevant to any new autoplay-video block, given milo's existing autoplay/viewport-pause video logic in `libs/utils/decorate.js` (see `milo-domain-knowledge.md`).

**Contrast & visual presentation**
`color-contrast` (serious) — the AA thresholds above. `link-in-text-block` (serious) — links inside body text must be distinguishable by more than color alone (underline, weight, etc.) — relevant to any block styling body copy with inline links. `avoid-inline-spacing` (serious) — don't set text spacing via inline styles in a way that blocks a user's custom-stylesheet overrides.

**Keyboard & focus**
`tabindex` (serious) — never a value greater than 0 (breaks natural tab order). `scrollable-region-focusable` (serious) — a scrollable container must be keyboard-reachable. `frame-focusable-content` (serious) — an iframe with focusable content inside shouldn't itself be `tabindex="-1"`.

**Touch targets (WCAG 2.2 — the newest rule in the catalog)**
`target-size` (serious) — matches the 24×24px threshold above; check any new tappable control (icon buttons, carousel dots/arrows, close buttons) against it, not just links in body text.

## How to apply this in a PR review

- Use the rule catalog to **name the specific violation precisely** rather than a vague "this might have accessibility issues" — e.g. cite the actual rule (`aria-required-attr`, `color-contrast`, `target-size`) so the finding is falsifiable and matches what the repo's own axe-core-based Nala tests would actually flag.
- Prioritize by the impact level shown above (critical/serious/moderate/minor) when deciding Blocker vs. Suggestion vs. Nice-to-have in the review template — a `critical`/`serious` finding (missing label, missing ARIA required attribute, insufficient contrast) belongs in Blockers or Suggestions, not buried in Nice-to-haves.
- This is the automated/spec layer. Per `reviewer-knowledge.md`'s `[A11y]` section, this team's reviewers don't stop at automated coverage — they do hands-on screen-reader/keyboard verification and treat focus-loss-on-interaction as a real regression even when no single axe rule would catch it. Automated rule coverage here is necessary, not sufficient.
