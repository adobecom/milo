# Cycle-2 R4 — new-block authoring queue

**Session:** `559a6f60-dc1`
**Milo branch:** `forge/session-559a6f60-dc1` (create with `cd /data/_repos/milo/.forge-worktrees/session-559a6f60-ms82hgy7 && git checkout -b forge/session-559a6f60-dc1 forge-a-panel`)
**Tasks:** 2

| # | Block name | Target path |
|---|---|---|
| 1 | `forge-address-your-biggest-customer-experience-challenges-with-adobe` | `/data/_repos/milo/.forge-worktrees/session-559a6f60-ms82hgy7/libs/c2/blocks/forge-address-your-biggest-customer-experience-challenges-with-adobe` |
| 2 | `forge-act-dark` | `/data/_repos/milo/.forge-worktrees/session-559a6f60-ms82hgy7/libs/c2/blocks/forge-act-dark` |

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
