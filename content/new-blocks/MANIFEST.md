# Cycle-2 R4 — new-block authoring queue

**Session:** `c3346e84-b7c`
**Milo branch:** `forge/session-c3346e84-b7c` (create with `cd /Users/tek10248/Documents/projects/milo-logs-deploy-result-logs/src/forge/shared/data/_repos/milo/.forge-worktrees/session-c3346e84-ms84jaz0 && git checkout -b forge/session-c3346e84-b7c forge-a-panel`)
**Tasks:** 1

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-dark-act` | `/Users/tek10248/Documents/projects/milo-logs-deploy-result-logs/src/forge/shared/data/_repos/milo/.forge-worktrees/session-c3346e84-ms84jaz0/libs/c2/blocks/forge-dark-act` |

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
