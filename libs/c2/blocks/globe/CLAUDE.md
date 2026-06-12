# Working on the globe block

This is a scroll-driven Three.js WebGL hero. Before doing anything here, read
**`README.md`** — it's the single source of truth (what it is, files, how to run,
authoring contract, architecture notes, open items). Don't reconstruct context
from the code alone.

## Hard rules (these override default behavior)

- **All nine shipped JS files (`globe.js`, `authoring.js`, `markup.js`, `shaders.js`,
  `textures.js`, `materials.js`, `a11y.js`, `modal.js`, `math.js`) are airbnb-clean — keep
  them that way (`npx eslint` exit 0, no banners).** The blanket `/* eslint-disable */` is
  gone. The only lint exceptions are 3 targeted `// eslint-disable-next-line
  no-use-before-define` comments in `globe.js` for genuine forward refs (the rAF driver →
  `tick`, `onPointerUp` → `handleCardClick`, `doLayout` → `destroy`); don't add blanket
  disables to silence new issues.
- **`tick()` is a thin orchestrator** — it runs named single-concern stages
  (`computeFrame`, `updateActiveCamera`, `updateSphereRotation`, `modal.updateAnimation`,
  `updateCardTransforms`, `renderScene`, …) in a fixed order. **Stage order matters**
  (e.g. `modal.updateAnimation`'s closing branch reads the live `sphereRotEuler/Quat`
  refreshed by `updateSphereRotation` earlier this frame, and `sphereGroup.position` from
  the previous frame; the card loop reads `sphGroupZ` from this frame) — preserve it. Add
  new per-frame work as a stage. The modal is a DI module (`modal.js`, owns its tuning
  constants); the sphere coupling is narrow (shared `sphereRotEuler/Quat` + the
  `snapToSphereSlot` / `requestNavNudge` callbacks, with `sphereRotX/Y` + the nav-nudge
  spring kept in `updateSphereRotation`). GPU resources come from `textures.js`/`materials.js`
  (DI: pass `renderer`).
- **DOM is JS-built and scoped to the block root** — the runtime queries nodes by
  class within `el` (`root.querySelector`), so **multiple globes per page are
  supported**. The only per-instance ids use a `gid` suffix (CA filter url +
  modal `aria-labelledby`). Don't reintroduce global ids or assume authored markup.
- **`hub-creative-v1/`, `hub-creative-v2/`, `_reference/` are read-only reference**,
  not shipped code (the `hub-creative-v*` dirs are git-ignored). The block ships as
  `globe.js` + its imports (`authoring.js`, `markup.js`, `shaders.js`, `textures.js`,
  `materials.js`, `a11y.js`, `modal.js`, `math.js`) + `globe.css` (registered in
  `C2_BLOCKS`, `libs/utils/utils.js`).
- **Verify visually against `_reference/globe-reference.html`** (served over http,
  not file://). Playwright is not used in this project.
- **If you change animation behavior or land a milestone, update `README.md`**
  so the next session stays accurate.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
