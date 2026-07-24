# Cycle-2 R4 — new-block authoring queue

**Session:** `58469d77-6cf`
**Milo branch:** `forge/session-58469d77-6cf` (create with `cd /data/_repos/milo/.forge-worktrees/session-58469d77-mrzb8sex && git checkout -b forge/session-58469d77-6cf forge-a-panel`)
**Tasks:** 4

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-with-great-power-comes-great-productivity` | `/data/_repos/milo/.forge-worktrees/session-58469d77-mrzb8sex/libs/c2/blocks/forge-with-great-power-comes-great-productivity` |
| 2 | `forge-there-s-more-to-acrobat-than-acrobat` | `/data/_repos/milo/.forge-worktrees/session-58469d77-mrzb8sex/libs/c2/blocks/forge-there-s-more-to-acrobat-than-acrobat` |
| 3 | `forge-section-4` | `/data/_repos/milo/.forge-worktrees/session-58469d77-mrzb8sex/libs/c2/blocks/forge-section-4` |
| 4 | `forge-create-beautifully-with-adobe-express` | `/data/_repos/milo/.forge-worktrees/session-58469d77-mrzb8sex/libs/c2/blocks/forge-create-beautifully-with-adobe-express` |

## Next steps

For each task, invoke the `build-block-from-figma` skill with the inputs in
that task directory's `build-prompt.md`. The skill's Phases 0–8 cover
authoring, visual validation (Playwright), accessibility (axe), and
performance (Lighthouse). After each PR opens, the block becomes available
at `?milolibs=local` against this local milo checkout.

### Authoring contract (block-building.md, enforced by build-block-from-figma)

- `export default async function init(el)` — no other shape.
- Probe outward from required content (typically a heading); never use
  nth-child selectors.
- Move nodes via `appendChild` / `append` / `replaceWith` — never
  `innerHTML =` on elements with listeners.
- `createTag` from `libs/utils/utils.js`; `decorateBlockText` /
  `decorateBlockBg` from `libs/utils/decorate.js`. Don't redefine these.
- Three-phase render: raw → `data-block-status="decorated"` → `"loaded"`.
  LCP structure synchronous; enhancement async.
- `try/catch` + `lana.log` around fetches; LCP must not depend on API
  success.
- Per-module budgets: JS < 300 LOC, CSS < 200 LOC.
