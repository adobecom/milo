# Working on the globe block

This is a scroll-driven Three.js WebGL hero, **ported from a prototype** and still
WIP. Before doing anything here, read **`README.md`** (orientation, current state,
starter prompts) and **`PROGRESS.md`** (architecture, decisions, open questions).
Don't reconstruct context from the code alone — these docs exist so you don't.

## Hard rules (these override default behavior)

- **`globe.js` is a verbatim ES5 port wrapped in a factory.** The code between
  `function createGlobeRuntime()` and its `return { init, destroy }` is the
  prototype's `offer-globe.js` copied as-is. Do NOT casually edit it; cross-
  reference `hub-creative/scripts/offer-globe.js` (line-map in `PROGRESS.md`)
  before changing any render/phase logic.
- **The `/* eslint-disable */` at the top of `globe.js` is intentional.** Don't
  "fix lint" piecemeal — the style cleanup is one tracked refactor task.
- **DOM is JS-built and uses global ids** (`#offer-globe-canvas`, `#offer-pullquote`,
  `#card-modal*`, …) → **one globe per page** for now. Don't assume authored markup.
- **`hub-creative/`, `_reference/` are read-only reference**, not
  shipped code. The block is `globe.js` + `globe.css` (registered in `C2_BLOCKS`,
  `libs/utils/utils.js`).
- **Verify visually against `_reference/globe-reference.html`** (served over http,
  not file://). Playwright is not used in this project.
- **If you change animation behavior or land a milestone, update `README.md` +
  `PROGRESS.md`** so the next session stays accurate.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
