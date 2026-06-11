# Working on the globe block

This is a scroll-driven Three.js WebGL hero. Before doing anything here, read
**`README.md`** — it's the single source of truth (what it is, files, how to run,
authoring contract, architecture notes, open items). Don't reconstruct context
from the code alone.

## Hard rules (these override default behavior)

- **All four JS files (`globe.js`, `authoring.js`, `markup.js`, `shaders.js`) are
  airbnb-clean — keep them that way (`npx eslint` exit 0, no banners).** The blanket
  `/* eslint-disable */` is gone. The only lint exceptions are 5 targeted
  `// eslint-disable-next-line no-use-before-define` comments in `globe.js` for genuine
  forward refs (the rAF driver → `tick`, the click→modal chain, `init`↔`destroy`);
  don't add blanket disables to silence new issues.
- **DOM is JS-built and scoped to the block root** — the runtime queries nodes by
  class within `el` (`root.querySelector`), so **multiple globes per page are
  supported**. The only per-instance ids use a `gid` suffix (CA filter url +
  modal `aria-labelledby`). Don't reintroduce global ids or assume authored markup.
- **`hub-creative/`, `_reference/` are read-only reference**, not
  shipped code. The block is `globe.js` + `globe.css` (registered in `C2_BLOCKS`,
  `libs/utils/utils.js`).
- **Verify visually against `_reference/globe-reference.html`** (served over http,
  not file://). Playwright is not used in this project.
- **If you change animation behavior or land a milestone, update `README.md`**
  so the next session stays accurate.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
