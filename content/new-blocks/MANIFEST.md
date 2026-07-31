# Cycle-2 R4 — new-block authoring queue

**Session:** `3dc1f062-29f`
**Milo branch:** `forge/session-3dc1f062-29f` (create with `cd /Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-3dc1f062-ms939yzw && git checkout -b forge/session-3dc1f062-29f forge-a-panel`)
**Tasks:** 3

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-explore-what-s-new` | `/Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-3dc1f062-ms939yzw/libs/c2/blocks/forge-explore-what-s-new` |
| 2 | `forge-introducing-color-mode` | `/Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-3dc1f062-ms939yzw/libs/c2/blocks/forge-introducing-color-mode` |
| 3 | `forge-work-smarter-than-ever-with-documents` | `/Users/bradjohn/Documents/forge-new/milo/.forge-worktrees/session-3dc1f062-ms939yzw/libs/c2/blocks/forge-work-smarter-than-ever-with-documents` |

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
