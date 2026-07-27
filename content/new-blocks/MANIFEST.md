# Cycle-2 R4 — new-block authoring queue

**Session:** `e0abb9ee-a36`
**Milo branch:** `forge/session-e0abb9ee-a36` (create with `cd /data/_repos/milo/.forge-worktrees/session-e0abb9ee-ms3o33dn && git checkout -b forge/session-e0abb9ee-a36 forge-a-panel`)
**Tasks:** 4

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-with-great-power-comes-great-productivity` | `/data/_repos/milo/.forge-worktrees/session-e0abb9ee-ms3o33dn/libs/c2/blocks/forge-with-great-power-comes-great-productivity` |
| 2 | `forge-create-beautifully` | `/data/_repos/milo/.forge-worktrees/session-e0abb9ee-ms3o33dn/libs/c2/blocks/forge-create-beautifully` |
| 3 | `forge-try-pdf-space-knowledge-hubs-for-free` | `/data/_repos/milo/.forge-worktrees/session-e0abb9ee-ms3o33dn/libs/c2/blocks/forge-try-pdf-space-knowledge-hubs-for-free` |
| 4 | `forge-there-s-always-something-new-with-acrobat` | `/data/_repos/milo/.forge-worktrees/session-e0abb9ee-ms3o33dn/libs/c2/blocks/forge-there-s-always-something-new-with-acrobat` |

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
