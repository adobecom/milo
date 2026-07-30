# Cycle-2 R4 — new-block authoring queue

**Session:** `9f95e6b8-d4c`
**Milo branch:** `forge/session-9f95e6b8-d4c` (create with `cd /Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy && git checkout -b forge/session-9f95e6b8-d4c forge-a-panel`)
**Tasks:** 7

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-with-great-power-comes-great-productivity` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-with-great-power-comes-great-productivity` |
| 2 | `forge-work-faster-no-matter-the-work` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-work-faster-no-matter-the-work` |
| 3 | `forge-there-s-more-to-acrobat-than-acrobat` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-there-s-more-to-acrobat-than-acrobat` |
| 4 | `forge-section-4` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-section-4` |
| 5 | `forge-create-beautifully` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-create-beautifully` |
| 6 | `forge-there-s-always-something-new-with-acrobat` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-there-s-always-something-new-with-acrobat` |
| 7 | `forge-plans-that-work-for-you` | `/Users/victor/dev/milo-forge-fresh/.forge-worktrees/session-9f95e6b8-ms7dztsy/libs/c2/blocks/forge-plans-that-work-for-you` |

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
