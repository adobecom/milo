# Cycle-2 R4 — new-block authoring queue

**Session:** `1e6c8920-1cf`
**Milo branch:** `forge/session-1e6c8920-1cf` (create with `cd /data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq && git checkout -b forge/session-1e6c8920-1cf forge-a-panel`)
**Tasks:** 6

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-create-at-the-highest-level` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-create-at-the-highest-level` |
| 2 | `forge-orchestrate-customer-experiences-with-ai` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-orchestrate-customer-experiences-with-ai` |
| 3 | `forge-students-and-teachers-save-71` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-students-and-teachers-save-71` |
| 4 | `forge-all-the-best-models-all-in-one-place` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-all-the-best-models-all-in-one-place` |
| 5 | `forge-get-work-done-faster` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-get-work-done-faster` |
| 6 | `forge-sl6` | `/data/_repos/milo/.forge-worktrees/session-1e6c8920-ms7wd9bq/libs/c2/blocks/forge-sl6` |

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
