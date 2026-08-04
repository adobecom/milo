# Accessible build checklist (Deque — per-element/component reference)

Source: Deque University's Web Accessibility Checklist (`dequeuniversity.com/checklists/web/*`). Unlike `accessibility-deque.md` (the axe-core *automated-detection* rule catalog) and `eu-accessibility-law-deque.md` (the *legal* framework), this file is a **build-time reference**: what to actually do, element by element and widget by widget, when authoring a component — including many manual/design requirements axe-core can't detect at all (label meaningfulness, focus order logic, whether alt text is actually descriptive). Use this when building or reviewing markup, not just when running an automated scan.

**MUST vs. SHOULD**: items marked **MUST** are WCAG success-criterion requirements (i.e., legally load-bearing per `eu-accessibility-law-deque.md` for EU-facing content). Items marked **SHOULD** are Deque best practices that go beyond the legal minimum but are still worth doing. Treat a MUST violation the same way the pr-review skill treats a `critical`/`serious` axe finding — Blocker-tier, not a nitpick.

## Custom widgets (tabs, select/listbox, combobox, accordion, dialog, and every other non-native interactive pattern)

**Core Name/Role/Value requirements — MUST (WCAG 4.1.2, 4.1.3):**
- Every interactive UI element (links, buttons, custom-widget controls, form inputs) **MUST have a name** via the accessible-name computation (native text content, `value`, `aria-label`, `aria-labelledby`, or `title`).
- The semantic meaning of every element **MUST be communicated** via the correct native HTML element or ARIA role — **prefer native HTML over an ARIA-equivalent role** (a real `<button>` beats a `<div role="button">` every time — native elements get keyboard behavior, focus, and form semantics for free).
- Static ARIA properties (e.g. `aria-valuemax`) **MUST be specified** where the role requires them.
- The **initial state** of any changeable element **MUST be programmatically designated** (`aria-expanded="false"`, `aria-selected="true"`, `aria-sort="ascending"`, etc.) — not just visually implied.
- When visual/functional state changes, the **ARIA state MUST change with it** (`aria-valuenow`, `aria-pressed`, `aria-expanded`, `aria-checked`, ...). A component that updates its own look on click but forgets to flip the matching ARIA attribute is a real, common bug — check this explicitly on any interactive-state code path.
- If a state change can't be expressed via an ARIA attribute, it **MUST still be communicated** to assistive tech somehow — `aria-live`, an alert role, or explicit focus management — as well as visually.

**Keyboard focus management — MUST (WCAG 2.4.3):**
- Focus **MUST be purposely moved** via JavaScript when a user action requires a context/location change for effective keyboard interaction (e.g. opening a modal moves focus into it).
- Focus **MUST NOT become lost** or silently reset to the top of the page, except on an actual page (re)load.
- Whatever element focus lands on **MUST contain discernible text** (WCAG 1.3.1) — never programmatically focus an empty/unlabeled wrapper `<div>`.

**Per-widget pattern — MUST conform to the matching WAI-ARIA Authoring Practices Guide (APG) pattern.** This is the direct answer to "what do I need for tabs, select, etc." — each of these has a full, standardized keyboard-interaction + ARIA-role model already written; don't improvise one:

| Pattern | Applies to (examples) |
|---|---|
| **Tab Panel** | Any tabbed interface (`role="tablist"`/`"tab"`/`"tabpanel"`, arrow-key navigation between tabs, `aria-selected`, only the active tabpanel in the tab order) |
| **Listbox** | A custom `<select>` replacement (`role="listbox"`/`"option"`, `aria-selected`, typeahead, arrow-key navigation) |
| **Combobox** | Autocomplete/typeahead inputs, custom searchable dropdowns |
| **Accordion** | Expand/collapse sections (`aria-expanded`, `aria-controls`, heading + button pairing) |
| **Dialog (Modal)** | Any modal/overlay — focus trap while open, focus returns to the trigger on close, `Escape` closes it, `aria-modal="true"` |
| **Alert Dialog** | A modal that specifically requires a user response (confirm/cancel) before dismissing |
| **Alert** | Non-modal, time-sensitive messages (`role="alert"`, auto-announced) |
| **Disclosure** | A single show/hide toggle (simpler than a full accordion) |
| **Menu / Menubar / Menu Button** | Dropdown menus, navigation menus with submenus |
| **Carousel** | Slide rotation — directly relevant to milo's `carousel-c2`/`elastic-carousel` blocks; pause/play controls, slide announcements, keyboard-navigable controls |
| **Slider / Slider (Multi-Thumb)** | Range inputs, custom drag controls |
| **Grid** | Interactive data grids (not a plain data table — see Tables below for that) |
| **Tree View** | Expandable hierarchical navigation |
| **Tooltip / Tooltip Dialog** | Hover/focus-triggered supplementary content |
| **Breadcrumb** | Navigation trail |
| **Checkbox / Checkbox (Tri-State)**, **Radio / Radio Group**, **Button / Button (Toggle)**, **Progress Bar**, **Spinbutton**, **Toolbar**, **Window Splitter**, **Feed** | Their respective native-equivalent widgets when a native element can't be used directly |

**General (SHOULD):** follow the WAI-ARIA "Developing a Keyboard Interface" conventions across all custom widgets for consistency. Any widget with a non-standard interaction model should have visible instructions on how to use it.

## Forms, labels & inputs (`<input>`, `<select>`, `<textarea>`, checkboxes/radios)

**Labels — MUST (WCAG 1.3.1, 3.3.2):**
- Labels **MUST be programmatically associated** with their input (`<label for>`, `aria-labelledby`, or wrapping) — not just visually adjacent.
- Labels **MUST be meaningful** and **MUST be visible** (WCAG 3.3.2) — a placeholder-only "label" is explicitly **not sufficient** on its own; placeholders are allowed as a supplement, never the only label.
- An icon can serve as a visual label only if it's self-evident **and** paired with a real programmatic label.
- The **programmatic name must contain the visible label text** (WCAG 2.5.3, "Label in Name") — this matters for voice-control users who speak the visible label to activate a control; a mismatched `aria-label` breaks that.
- Each label maps to exactly one input; if one label visually applies to several inputs (e.g. a shared "Address" heading over street/city/zip), each input still needs its own individual, specific label.

**Instructions & errors — MUST (WCAG 3.3.2):**
- Instructions must be programmatically associated, determinable, meaningful, and visible — same bar as labels.
- **Input purpose for personal-data fields MUST be programmatically defined** (WCAG 1.3.5) — i.e. use the correct `autocomplete` token (`name`, `email`, `tel`, etc.) from the standard input-purposes list.

**Required fields, restrictions, disabled fields (SHOULD, with a MUST floor):** mark required fields both visually and programmatically where possible — but at minimum, WCAG requires an **informative error message after submission** regardless. A disabled field that's essential to understanding the surrounding content needs an alternative way to communicate that (WCAG 1.3.1).

**Time limits — MUST (WCAG 2.2.1):** any time limit needs one of: no limit, a way to disable it, a way to extend it, a way to adjust it, or a 20-hour minimum — except where the time limit is essential to the activity itself (e.g. an auction).

**Redundant entry — MUST (WCAG 3.3.7):** information a user already entered elsewhere in the same process must be auto-populated or selectable, not re-typed from scratch (with narrow exceptions).

**Authentication — MUST (WCAG 3.3.8):** a cognitive test (e.g. a puzzle CAPTCHA) used for login **MUST** have an alternative — an assistance mechanism, object recognition, or personal-content identification — a pure "solve this puzzle" gate with no alternative fails this outright.

## Tables (data tables — for milo, e.g. `comparison-table-c2`)

- Headers **MUST use `<th>`**, not styled `<td>`s (WCAG 1.3.1).
- Header text **MUST accurately describe** its column/row's data.
- Data cells **MUST be associated with their headers** — use `scope="col"`/`scope="row"` (screen readers usually infer column scope automatically, but don't rely on that for row scope). For genuinely complex tables where `scope` can't express the relationship, use `headers`/`id` pairing instead.
- Header/data associations **MUST NOT reach across** separate, nested, or merged tables.
- **SHOULD**: use a real `<table>` for tabular data (not CSS grid pretending to be one) and give it a `<caption>` (or `aria-label`/`aria-labelledby`) that's unique and meaningful.
- **Never use a data table purely for visual layout**, and a layout table (if one somehow exists) must never contain header cells.

## Headings (SHOULD — best practice, not a strict success criterion on its own, but directly supports 1.3.1/2.4.1 in practice)

- Headings should give an accurate structural outline of the page.
- Don't skip levels (h2 → h4 with no h3 in between).
- Main content should start with an `<h1>`, and most pages should have only one.

## Landmarks (supports WCAG 2.4.1 Bypass Blocks)

- Use landmarks (`<header>`/`banner`, `<nav>`, `<main>`, `<footer>`/`contentinfo`, or the equivalent ARIA roles) so screen-reader users can jump past repeated content.
- All page text should sit inside some landmark region.
- At most one `banner`, one `main`, one `contentinfo` per page; give multiple landmarks of the same type (e.g. two `nav`s) distinguishing names via `aria-label`.
- Don't over-fragment the page into excessive landmarks — too many defeats the navigational shortcut they're meant to provide.

## Links

- **MUST** be marked up as real links (`<a href>` or `role="link"`) — don't use a link element for button-like actions (that's what `<button>` is for), and vice versa.
- **MUST** have a discernible accessible name, and that name **MUST make the link's purpose clear** and distinguishable from other links on the page — avoid "click here"/"read more" with no surrounding context.
- Links to the same destination **MUST use consistent text** across the page.
- **MUST** be visually distinguishable from surrounding non-link text (not by color alone — see Color Contrast below for the `link-in-text-block` angle already in `accessibility-deque.md`).
- **MUST** be keyboard-focusable, activate on Enter, and show a visible focus indicator; focus order must stay logical.
- Minimum target size ~44×44px except inline text links (this is stricter than the 24×24px WCAG 2.2 floor in `accessibility-deque.md` — 44px is Deque's own recommended best practice, treat 24px as the legal floor and 44px as the better target where feasible).
- Indicate when a link opens a new window/tab, and indicate the file type for links to non-HTML documents (PDF, etc.).

## Images

- Every informative `<img>`, active image, image-as-form-input, SVG, canvas, or icon-font glyph **MUST have alt text** that's actually meaningful — describes purpose/intent, not just "there is an image here." Roughly 250 characters max; don't include words like "image of"/"graphic of" in the alt text itself.
- Purely decorative or already-redundant-with-visible-text images **should get `alt=""`** (or `role="presentation"`, or be a CSS background) — an empty alt is the *correct*, deliberate choice here, not a mistake to flag.
- A **complex image** (chart, diagram, infographic) needs **both** a brief `alt` and a fuller extended description elsewhere on the page — a single short alt attribute is not enough for these.
- A background image that conveys real information still **MUST** have a text alternative somewhere; if a background image is the *only* content of an interactive element, that element still needs an accessible name.
- Don't bake informative text into an image when real, selectable text would do the same job (WCAG 1.4.5) — directly relevant to any marketing block tempted to ship a designed text-image instead of real HTML text.

## Color contrast & use of color

(Numeric thresholds already captured in `accessibility-deque.md` — repeated here with the *use-of-color* rule Deque's checklist adds on top, which is easy to miss):
- Any information conveyed by color **MUST** also be conveyed by a non-color-dependent, programmatically discernible alternative (text, icon, pattern) — e.g. a form field that only turns red on error, with no icon/text, fails this even if the red has perfect contrast.
- Contrast floors: 4.5:1 (small text), 3:1 (large text, ≥18pt/≥14pt bold), 3:1 (UI control boundaries vs. adjacent areas), 3:1 (focus indicators against their background).
- Don't override the user's OS-level High Contrast Mode settings.

## Reading order & focus order

- **Reading order MUST be logical** (WCAG 1.3.2) — this defaults to DOM order, so a CSS-only visual reorder (e.g. `order`/absolute positioning) that isn't matched in the DOM breaks this for screen-reader users even though it looks fine visually.
- **Focus order MUST be logical** (WCAG 2.4.3) — same DOM-order default, same CSS-visual-reorder trap.
- `tabindex` guidance: **never use a positive value** (`tabindex="1"`, `"2"`, ...) — it almost always produces an illogical order. Use `tabindex="0"` only to make a genuinely non-focusable custom widget focusable (prefer a native focusable element instead if one exists). Use `tabindex="-1"` to let JavaScript programmatically move focus to an element without adding it to the normal tab order (e.g. focusing a heading after a route change).

## Dynamic content (client-side updates, AJAX, JS-driven state)

- If a user action requires a context change, **focus MUST be moved deliberately** via JS to the right place — never leave it stranded.
- Focus **MUST NOT get lost or silently reset to the top** on a dynamic update.
- Merely interacting with a control **MUST NOT** trigger a major unannounced change (auto-navigation, an unexpected popup, an unrequested focus jump) — if a control has that kind of side effect, the user needs to be told about it ahead of time (e.g. "opens in a new window").
- Meaningful content added/changed dynamically needs to actually reach assistive tech — via `aria-live` regions, an alert role, or explicit focus management — not just a silent DOM mutation. A carousel auto-advancing slides, a live search-results list updating, or a toast notification appearing are all real examples of this in a milo-style block.
- State changes (selected/expanded/active) must be reflected via the actual ARIA attribute, not a visual-only change.
- Any session timeout needs an advance warning with a way to extend it before time runs out.

## How to use this alongside the other accessibility reference files

- **This file** = what to build, element/widget by element/widget (the "how do I do it" reference — use it while authoring a block or reviewing one).
- **`accessibility-deque.md`** = what an automated tool (axe-core, already used in this repo's own Nala tests) will actually catch — the automated-detection layer, useful for knowing what CI will flag vs. what needs manual review.
- **`eu-accessibility-law-deque.md`** = why this is a legal requirement for EU-facing content, not optional polish, and how to weigh severity.
- **`reviewer-knowledge.md`'s `[A11y]` section** = how this team actually behaves in review (hands-on screen-reader checks, treating focus-loss as a real regression, standardizing focus styles once flagged).

When building a new block or reviewing one: check the relevant widget pattern here first (does this need to be a `<button>`/`<select>` instead of a styled `<div>`? does this tab/carousel/dialog follow its APG pattern?), cross-check against `accessibility-deque.md`'s rule catalog for anything automatable, and treat any MUST-level gap on EU-facing markup as Blocker-tier per `eu-accessibility-law-deque.md`.
