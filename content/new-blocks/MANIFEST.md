# Cycle-2 R4 — new-block authoring queue

**Session:** `f7456022-5b1`
**Milo branch:** `forge/session-f7456022-5b1` (create with `cd /Users/logan/dev/milo-logs-deploy/src/forge/shared/data/_repos/milo/.forge-worktrees/session-f7456022-ms510ds7 && git checkout -b forge/session-f7456022-5b1 forge-a-panel`)
**Tasks:** 1

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-remove-background-from-your-image-for-free` | `/Users/logan/dev/milo-logs-deploy/src/forge/shared/data/_repos/milo/.forge-worktrees/session-f7456022-ms510ds7/libs/c2/blocks/forge-remove-background-from-your-image-for-free` |

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
