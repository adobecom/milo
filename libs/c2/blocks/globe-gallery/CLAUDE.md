# Working on the globe-gallery block

This is a scroll-driven Three.js WebGL hero. Before doing anything here, read
**`README.md`** — it's the single source of truth (what it is, files, how to run,
authoring contract, architecture notes, open items). Don't reconstruct context
from the code alone.

## Hard rules (these override default behavior)

- **All eleven shipped JS files (`globe-gallery.js`, `src/authoring.js`, `src/shaders.js`,
  `src/textures.js`, `src/materials.js`, `src/a11y.js`, `src/modal.js`, `src/math.js`,
  `src/arc.js`, `src/interaction.js`, `src/cursor.js`) are airbnb-clean — keep
  them that way (`npx eslint` exit 0, no banners).** The blanket `/* eslint-disable */` is
  gone. Targeted `// eslint-disable-next-line` comments are allowed when a rule genuinely
  misfires — keep them one-line, justified by a comment, never a blanket disable. Current
  exceptions: 1 `no-use-before-define` in `globe-gallery.js` for a genuine forward ref
  (`doLayout` → `destroy`, a mutual reference — the BP-crossing rebuild calls `destroy`
  then re-inits); and 2
  `import/no-relative-packages` on the `getConfig` / `replaceKeyArray` imports in `globe-gallery.js`
  (the block's build-only `package.json` makes eslint see a package boundary that doesn't
  exist at runtime).
- **`tick()` is a thin orchestrator** — `computeFrame()` builds one per-frame `frame`
  context (scroll + phase t-values + card-entry transforms), then named single-concern
  stages (`updateActiveCamera`, `updateSphereRotation`, `updateSphereGroupDepth`,
  `modal.updateAnimation`, `updateCardTransforms`, `renderScene`, …) run in a fixed order;
  producer stages write their result back onto `frame` (`activeCamera`, `sphereRotActive`,
  `sphGroupZ`) and each stage destructures what it reads from `frame` at its top. **Stage
  order matters** (e.g. `updateActiveCamera` sets `camera.z` + `cameraInsideSphere` read by
  the next two stages; `modal.updateAnimation`'s closing branch reads the live
  `sphereRotEuler/Quat` refreshed by `updateSphereRotation` earlier this frame, and
  `sphereGroup.position` from the previous frame; the card loop reads `frame.sphGroupZ`) —
  preserve it. Add new per-frame work as a stage that takes `frame`. The modal is a DI module (`modal.js`, owns its tuning
  constants); the sphere coupling is narrow (shared `sphereRotEuler/Quat` + the
  `snapToSphereSlot` / `requestNavNudge` callbacks, with `sphereRotX/Y` + the nav-nudge
  spring kept in `updateSphereRotation`). Card images come from `src/textures.js`
  (`loadCardTextures`); materials from `src/materials.js`. Rounded corners are an analytic
  SDF in the card/modal shaders (`uAspect`/`uRadius`), not a rasterized mask.
- **DOM is JS-built and scoped to the block root** — the runtime queries nodes by
  class within `el` (`root.querySelector`), so **multiple globes per page are
  supported**. The only per-instance ids use a `gid` suffix (CA filter url +
  modal `aria-labelledby`). Don't reintroduce global ids or assume authored markup.
- **`hub-creative-v1/`, `hub-creative-v2/`, `hub-creative-v3/` are read-only
  reference**, not shipped code (the `hub-creative-v*` dirs are git-ignored). **`hub-creative-v3`
  is the newest design reference** — the source for the now-shipped shortened grid phase,
  WebGL "Click & Drag" text, and desktop custom cursor (`hub-creative-v3/CHANGES.md` explains
  the design intent if you're tuning them). The block ships as
  `globe-gallery.js` + `globe-gallery.css` + `three.module.min.js` + `src/` modules (`authoring.js`,
  `shaders.js`, `textures.js`, `materials.js`, `a11y.js`, `modal.js`, `math.js`, `arc.js`, `interaction.js`,
  `cursor.js`)
  (registered in `C2_BLOCKS`, `libs/utils/utils.js`). The build-only Three.js vendoring
  (`package.json`, `three-src.js`, `node_modules/`) lives at `/globe-gallery/` root — run
  `npm run build` there to regenerate `three.module.min.js`.
- **If you change animation behavior or land a milestone, update `README.md`**
  so the next session stays accurate.

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
