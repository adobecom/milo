# Milo domain knowledge (for grounding review comments in real project conventions)

## Architecture

- No build step for the site — Adobe Edge Delivery Services (EDS/Helix), served as static ES modules.
- `libs/blocks/` — ~120 "C1" (classic) blocks: `<name>.js` + `<name>.css` pair per folder.
- `libs/c2/` — the newer C2 ("Foundation") block system. **New blocks go here per this repo's CLAUDE.md.** `libs/c2/blocks/`, `libs/c2/styles/` (shared tokens + parallax system), `libs/c2/assets/img/`.
- `libs/utils/utils.js` — block registry (`C1_BLOCKS`, `C2_BLOCKS`, `AUTO_BLOCKS`, `DO_NOT_INLINE` arrays), config singleton (`getConfig`/`setConfig`/`updateConfig`), block lifecycle (`loadBlock`), locale/lingo resolution, link decoration, `createTag`, `loadStyle`/`loadScript`/`loadLink`, `getMetadata`.
- `libs/utils/decorate.js` — shared decoration primitives used by both C1 and C2: `decorateButtons`, `decorateBlockText`, `decorateBlockBg`, `decorateViewportContent`/`decorateTextOverrides`, video helpers, `decoratePictures`.
- `libs/features/` — opt-in page features (MEP personalization, georouting, dynamic-navigation, jarvis-chat, etc.), loaded conditionally, not part of the block lifecycle.
- `libs/deps/` — vendored third-party libs, checked in rather than npm-installed at runtime.
- `tools/` — authoring/ops tooling (DA admin API, loc, floodgate/graybox content-promotion workflows, sidekick) — separate from runtime code.
- `test/` — unit tests (web-test-runner), mirrors `libs/` structure.
- `nala/` (repo root) — Playwright E2E suite: `nala/blocks/`, `nala/features/`, `nala/libs/` (shared page-object base classes), `nala/utils/`.

### Block authoring model
EDS converts authored content into `<div class="block-name variant-a">` with row/cell divs as children. Each block is a `<name>.js` + `<name>.css` pair with **no build step** — served as-is.

**Block registration is mandatory and easy to forget**: a new block file not added to `C1_BLOCKS`/`C2_BLOCKS` in `libs/utils/utils.js` silently mis-resolves its load path. On a C2 page (`<meta name="foundation" content="c2">`), a C1-only block name not in `C2_BLOCKS`/`AUTO_BLOCKS` is rejected outright. **Always check the registry array when a PR adds a new block.**

## C2 block system specifics

Registered C2 blocks include: `base-card`, `box`, `brand-concierge`, `carousel-c2`, `comparison-table-c2`, `elastic-carousel`, `explore-card`, `faq`, `floating-cta`, `global-footer`, `global-navigation`, `hover-list`, `hub-hero`, `iframe`, `logo-ticker`, `martech-metadata`, `modal-metadata`, `modal`, `news`, `offer-hero`, `pdf-space`, `plans-hero`, `product-marquee-grid`, `quick-actions`, `region-nav`, `rich-content`, `router-marquee`, `section-metadata`, `side-by-side`, `social-proof`, `split-aside-grid`, `tabs`, `tour`, `visually-hidden`.

**Mandated entry point:**
```js
export default function init(el) {
  el.closest('.section').classList.add('<name>-section');
  decorateViewportContent(el, decorateFn);
}
```
Use `decorateViewportContent(el, decorateFn)` even when there are no per-viewport variations today — it degrades gracefully and internally calls `decorateTextOverrides`. **Calling `decorateTextOverrides` separately in addition to `decorateViewportContent` is redundant/wrong** — flag it.

**Per-viewport authoring**: authors add delimiter rows named `mobile`/`tablet`/`desktop` (optionally `mobile(variant)`); breakpoints: mobile `<768px`, tablet `768–1279px`, desktop `≥1280px`. Content can inherit from the nearest lower viewport when a cell is empty.

**Design tokens**: `libs/c2/styles/styles.css` (~1580 lines) is the single source of truth for `--s2a-*` tokens (colors, border-radius, spacing, etc.), plus `--body-font-family`/`--heading-font-family` as the only non-tokenized font vars. Map any hardcoded value to a token; if none exists, hardcode with an explanatory comment.

**Grid/breakpoints:**

| Name | Range | Columns |
|---|---|---|
| S | 0–767px | 6 |
| M | 768–1279px | 12 |
| L | 1280–1440px | 12 |
| XL | 1441px+ | 12 |

Multi-column layout (`.two-up`/`.three-up`/`.grid-width-N`) is applied at the **section** level — blocks must be width-agnostic, not assume a column count.

**CSS rules to check in review** (from this repo's own build-block-from-figma acceptance criteria — applicable to any C2 CSS, not just Figma-sourced blocks):
- Never `min-width:`/`max-width:` media query syntax — use range syntax `width >= Npx`.
- No `!important`, no inline styles.
- Don't nest a child selector that repeats the parent's own class name — write it flat. Nesting is fine for `&:hover`, `&::before`, `&[aria-expanded]`, `&.variant`, `& > p`.
- Selector chain depth ≤ 3, nesting depth ≤ 3.
- No magic numbers — map to `--s2a-` tokens or comment why not.
- Scope block-level custom properties with a block-name prefix (e.g. `--hero-banner-gap`).
- No bare/unqualified tag selectors (`p`, `div`) — always scope under the block class.
- Prefer `transform`/`opacity` for animation (compositor-friendly).
- **Note: `npm run lint:css` only globs `libs/blocks/**/*.css` and `libs/styles/*.css` — C2 block CSS in `libs/c2/blocks/` is NOT covered by CI stylelint today.** Manual review is the only backstop for C2 CSS style issues — check more carefully here, not less.

**JS conventions**: reuse `decorateBlockText`, `createTag`, `decorateViewportContent` instead of hand-rolling DOM decoration; cache DOM queries (never query inside loops); batch reads before writes (no interleaved `getBoundingClientRect`/style-write layout thrashing); CTA markup (`<em><a>` → outline, `<strong><a>` → fill, both → fill wins) is handled by `decorateBlockText`/`decorateButtons` — don't hand-parse it; EDS already handles responsive images/lazy-loading/CLS-safe dimensions — move existing `<picture>` elements rather than fabricating new `<img>` tags.

**Media-parity-across-breakpoints** is explicitly called out in this repo's own docs as "the most common failure": media present in every Figma/design breakpoint gets hidden via `display: none` at some breakpoint instead of repositioned. Check this whenever a new block's CSS has more `display: none` overrides at larger breakpoints than the design would suggest.

## Testing conventions

- **Unit tests**: `npm run test` → web-test-runner + `@esm-bundle/chai` + `sinon`, coverage enforced. Location: `test/blocks/<name>/<name>.test.js`, fixtures in `mocks/`. Typical pattern: load fixture HTML into `document.body.innerHTML`, call `setConfig({})` first, dynamically import the block and call its default export directly, assert on resulting DOM state (classes, `aria-*`, `data-*`) rather than internals. `sinon.stub` for `window.fetch`, `sinon.restore()` after.
- **CONTRIBUTING.md states 100% patch coverage is a CI gate** — flag new/changed JS in a PR that lacks a matching test file/case under `test/blocks/<name>/`.
- **Nala E2E**: `npm run nala local [test=<file>]`, Playwright-based. Page-object triad per block in `nala/blocks/<block>/`: `<block>.page.js` (Locators + expected class strings per variant), `<block>.spec.js` (test-case fixtures with `tcid`/`path`/`tags`), `<block>.test.js` (actual `test.describe` blocks using `test.step()`, verifying content → analytics attrs (`daa-lh`/`daa-ll`) → `runAccessibilityTest`).

## Lint/style conventions

- `npm run lint` = eslint (`airbnb-base` + react-hooks + compat + ecmalist) + stylelint (`stylelint-config-standard` + prettier config).
- `import/extensions` required — `.js` extensions mandatory on all imports (no bundler).
- `no-restricted-syntax` bans `for..in`, labeled statements, `with` — flag `for..in`, don't flag sequential `await` in loops (`no-await-in-loop` is explicitly disabled here, that's accepted style).
- `no-console` **is** enforced (as a `warn`-level ESLint rule, inherited from `airbnb-base`, not an error) outside `test/`/`nala/` overrides — flag stray `console.log`; the project's real logging convention is `window.lana?.log(message, { tags, severity, clientId })` (see `libs/utils/lana.md`), not console output.
- `.browserslistrc`: last 1 chrome/firefox/edge, safari ≥15, ios_saf ≥15 — flag anything requiring a newer baseline without a fallback.

## Accessibility & performance conventions

- **Reduced motion**: `isReducedMotion` computed once in `libs/utils/decorate.js` via `matchMedia('(prefers-reduced-motion: reduce)')`, used to skip autoplay. At the CSS layer, the blanket disable rule in `libs/c2/styles/styles.css` is keyed to `[class*="parallax-"]` — **any new scroll-driven animation class that doesn't start with `parallax-` needs its own explicit `prefers-reduced-motion` override**, or it will silently ignore the user's motion preference. This is a real, checkable gap, not a hypothetical.
- **Video**: explicit accessible play/pause controls (`aria-label`/`aria-pressed` kept in sync), keyboard activation, `IntersectionObserver` (threshold 0.8, `rootMargin: 1000px`) to pause off-screen autoplay and lazily attach sources.
- **Images**: EDS delivers responsive `<picture>`/`srcset`/`loading="lazy"`/explicit dimensions automatically — blocks shouldn't reimplement this.
- **CLS-avoidance patterns**: `aspect-ratio` on card media, `contain: layout` on block roots, `clip-path`/`overflow: clip` instead of animating box size for rounded corners.
- **Targets** (from this repo's own performance-check reference): Lighthouse ≥90; LCP ≤2.5s (check whether the LCP element is inside the new block, whether block JS/CSS delays first paint via opacity-reveal transitions or eager large images); CLS ≤0.1; INP ≤200ms; TBT ≤200ms. Triage method: hide the block (`display:none`) and re-run to isolate whether it's the cause.
- **WCAG 2.2 AA**: missing focus indicators, insufficient contrast on gradients, touch targets <24×24px, missing/decorative alt text, heading-hierarchy skips, keyboard reachability.

## RTL / i18n conventions

- `dir` is set programmatically in `setConfig()` from `content-direction` meta → `locale.dir` → `Intl.Locale(...).textInfo.direction` → falls back to `'ltr'`.
- CSS logical properties (`margin-inline`, `padding-block`, `inset-inline-start`, etc.) are the stated convention **but not yet universal** — of the 18 CSS files under `libs/c2/blocks/**`, only 3 (`base-card`, `news`, `section-metadata`) use logical properties exclusively; 3 more (`carousel-c2`, `elastic-carousel`, `router-marquee`) mix logical and physical properties in the same file; the rest use physical properties only. Flagging physical `left`/`right`/`margin-left` in new C2 CSS is a real, checkable review point, not a nitpick against a convention that doesn't exist yet.
- `[dir="rtl"]` overrides are used where a logical property alone can't express mirroring (e.g. `transform: translateX(...)`).

## Known milo-specific pitfalls to watch for

- **Parallax "garage door reveal" overflow/z-index gotcha** (`libs/c2/styles/styles.css`, `.section.parallax-garage-door-reveal` / `.parallax-double-garage-door`): the *preceding* section needs `z-index: 1` and the section's `.section-background` needs `overflow: hidden`/`clip` to contain the scaling background image. **Do not suggest adding `overflow: clip`/`hidden` to `.section.parallax-garage-door-reveal` itself** — it was intentionally removed there; the containment belongs on `.section-background` and the z-index fix belongs on the preceding section.
- **Deprecated extension points still present**: `localizeLink` (superseded by `localizeLinkAsync`), `decorateLinks` (superseded by `decorateLinksAsync`), `shouldAllowKrTrial`/`shouldBlockFreeTrialLinks` (marked for removal). New code building on these should be discouraged.
- **Auto-block trust boundary**: `isTrustedAutoBlock()` in `utils.js` restricts which hostnames can trigger auto-blocking — treat changes to auto-block URL-matching logic as security-relevant.
