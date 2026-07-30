# Cycle-2 R4 — new-block authoring queue

**Session:** `16855dd5-309`
**Milo branch:** `forge/session-16855dd5-309` (create with `cd /Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-16855dd5-ms82f1x7 && git checkout -b forge/session-16855dd5-309 forge-a-panel`)
**Tasks:** 2

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-section-1` | `/Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-16855dd5-ms82f1x7/libs/c2/blocks/forge-section-1` |
| 2 | `forge-section-2` | `/Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-16855dd5-ms82f1x7/libs/c2/blocks/forge-section-2` |

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
