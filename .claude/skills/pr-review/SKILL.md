---
name: pr-review
description: >
  Reviews a GitHub pull request the way adobecom/milo's own reviewers
  actually review it. Built from real review comments mined from ~2,460
  sampled merged PRs by this team's reviewers (spanning the repo's full
  2022-2026 history), plus a domain-knowledge briefing on milo's block
  architecture, C2 conventions, testing, lint, accessibility, and RTL rules.
  Verifies the PR's own claims against the actual current source (not just
  the diff), then produces a review in the team's own adopted "Ultrareview"
  Size/Blockers/Suggestions/Nice-to-haves/Test-plan format. Use when asked
  to review a milo PR, get a second opinion on one, or check a PR before
  requesting review from the team.
argument-hint: "[PR number | PR URL]"
user_invocable: true
---

# pr-review

Review a GitHub PR using patterns mined from this team's real reviews, grounded in milo's actual conventions.

## Phase 0: Resolve the target PR and repo

- If the argument is a bare number, assume `adobecom/milo`. If it's a `github.com/<owner>/<repo>/pull/NNN` URL, extract both the PR number and the `<owner>/<repo>` from it — don't assume `adobecom/milo` if the URL says otherwise.
- If no argument was given, check whether the current branch has an open PR: `gh pr view --json number,url` from inside the milo checkout. If none, ask the user which PR to review.
- Resolve the repo once into a variable (call it `REPO`) and use it — not a hardcoded literal — in every `gh` command in later phases. If the confirmed repo isn't `adobecom/milo` (or an unmodified fork of it), say so explicitly and flag that `references/milo-domain-knowledge.md`'s milo-specific checks (block registry, C2 conventions, etc.) may not apply — fall back to the general themes in `references/reviewer-knowledge.md` plus generic good practice for that repo.
- Fetch `gh pr view <n> -R <REPO> --json number,title,body,author,additions,deletions,changedFiles,baseRefName,headRefName,files,url,state,isDraft,mergedAt` as the first call, before anything else. If this errors (PR not found, wrong repo/number), report the exact error and stop — don't guess a PR number or repo. If `state` is `CLOSED` and `mergedAt` is null (closed without merging), or `isDraft` is true, say so up front in the review output — the findings are still useful but a `--request-changes`/`--approve` post in Phase 5 won't apply to it the same way.

## Phase 1: Gather PR context

Run in parallel (reusing the `gh pr view` JSON already fetched in Phase 0 — don't re-fetch it):
- `gh pr diff <n> -R <REPO>`

From the metadata, compute:
- **Size**: `+additions/-deletions across N files`.
- **Base**: `baseRefName` (flag if it isn't `stage` on `adobecom/milo` — that's this repo's default branch).
- **Oversize**: a heuristic, not a mined constant — roughly 800+ changed lines without an obvious mechanical reason (a rename, a generated file, a large data/fixture update) is worth calling out, but say plainly that this threshold is a reasonable default, not something sourced from the mined review corpus.
- **Triage the file list** using the `files[]` array (path + additions/deletions) before diving into Phase 3: bucket each file as "read in full" (real logic/markup/styles) vs. "diffstat-only" (lockfiles, anything under `libs/deps/`, binary/image assets, generated JSON/data files, vendored bundles). For a PR dominated by diffstat-only files, say so explicitly in the review rather than silently skipping them — this is exactly the kind of thing the "review-depth transparency" norm in `references/reviewer-knowledge.md` expects you to disclose.

## Phase 2: Load review knowledge

Always read both files fresh at the start of each `/pr-review` invocation (they're small — don't rely on an earlier read from the same conversation, since they may have been edited since):
- `references/reviewer-knowledge.md` — a single combined checklist distilled from this team's real review comments, tagged `[CSS]`/`[JS]`/`[Process]`/`[A11y]`/`[Meta]` for quick scanning. It is one knowledge base to apply, not separate voices to roleplay — don't attribute individual findings to any specific person in the output.
- `references/milo-domain-knowledge.md` — milo's real architecture/conventions (block registration, C2 token/CSS rules, testing conventions, lint rules, a11y/perf targets, RTL conventions, known gotchas).
- `references/accessibility-deque.md` — WCAG/axe-specific technical criteria (contrast, ARIA authoring patterns, common automated-vs-manual testing gaps) to pair with the milo-specific accessibility habits in `reviewer-knowledge.md`'s `[A11y]` section.
- `references/eu-accessibility-law-deque.md` — the EU legal-compliance layer (European Accessibility Act, EN 301 549, EN 17161). The EAA's compliance deadline (June 28, 2025) has already passed, so a WCAG conformance gap on EU-facing content isn't just a maintainability nitpick — it's a live legal-compliance gap. Every `[A11y]` finding and every accessibility-deque.md rule violation should be run through this file's framing before it's slotted into the review template.
- `references/accessibility-build-checklist-deque.md` — the per-element/widget build reference (tabs, select/listbox, combobox, dialog, tables, forms, links, images, focus order, dynamic content) with MUST (WCAG-required) vs. SHOULD (best-practice) items and the matching WAI-ARIA Authoring Practices pattern for each custom-widget type. Use this to check whether an interactive element (a tab panel, a custom dropdown, a modal, a carousel, etc.) actually follows its established ARIA pattern, not just whether it passes an automated scan.

Findings in Phase 3 should be traceable to this knowledge base — don't invent generic web-dev advice that isn't grounded in either a mined review pattern or an actual milo convention from the domain files.

## Phase 3: Verify against source, not just the diff

This is the single most important habit this team's reviewers have converged on in their own recent reviews: **don't trust the PR description or the diff hunks alone.** For each file bucketed "read in full" in Phase 1:
- Read the full current file (not just the diff context lines) when the change touches logic, not just copy/text.
- **Give any change to an always-loaded core path (`libs/utils/utils.js`, `libs/martech/martech.js`, `libs/utils/decorate.js`, a GitHub Actions workflow) the highest scrutiny tier regardless of diff size** — per `reviewer-knowledge.md`'s empirical-verification section, a single wrongly-placed import in one of these files has a quantified, repo-documented history of major performance/revenue impact.
- Check for the [Process] `Security` items in `reviewer-knowledge.md`: `innerHTML`/unsanitized-input usage, and — for CI/workflow file changes — third-party GitHub Actions pinned to a tag/branch instead of a commit SHA.
- Check for new dependencies, stray `console.log` (vs. the project's real `lana.log` convention), and whether a new top-level directory needs CODEOWNERS coverage — named explicitly as checklist items in the team's own adopted template.
- **Any markup/ARIA/interactive-widget change gets checked three ways**: (1) against `references/accessibility-build-checklist-deque.md` — does a tab panel/dropdown/modal/carousel/etc. actually follow its listed WAI-ARIA Authoring Practices pattern, and are Name/Role/Value + focus-management basics covered; (2) against `references/accessibility-deque.md`'s axe-core rule catalog for anything automatable; (3) run through `references/eu-accessibility-law-deque.md`'s framing — a MUST-level/`critical`/`serious`-impact violation on EU-facing content (which is effectively all of adobe.com) is a WCAG 2.1 AA / EN 301 549 conformance gap, not just a style nit — it defaults to Blockers, not Nice-to-haves, and should be worded as a compliance gap, not a suggestion. Never accept a "disproportionate burden" or cost/benefit argument to downgrade one yourself — that's a documented legal/business exemption process, not a call to make in a code review.
- **If the PR isn't a C2/block change at all** (a `tools/` change, a CI workflow edit, a docs-only PR, a dependency bump, a test-only PR): skip the block-specific bullets below and instead apply the general `[JS]`/`[Process]`/`[A11y]` themes from `reviewer-knowledge.md` (naming, duplication, architectural boundary-policing, one-PR-per-ticket scope, security) — don't force CSS/block-registry findings onto a PR that has none.
- If the PR adds a new block: confirm it's registered in `C1_BLOCKS`/`C2_BLOCKS` in `libs/utils/utils.js` (a very common, easy-to-miss omission per `references/milo-domain-knowledge.md`).
- If the PR touches CSS in `libs/c2/blocks/`: check token usage, nesting/specificity, logical properties, and remember `npm run lint:css` doesn't cover this directory — manual scrutiny is the only backstop.
- If the PR adds/changes block JS: check whether a corresponding test exists/was updated under `test/blocks/<name>/`.
- If the PR adds a new animation/motion class: check it's covered by the `prefers-reduced-motion` rule (keyed to `[class*="parallax-"]` in `libs/c2/styles/styles.css`) or has its own override.
- If the PR's description makes a specific claim (fixes X, no visual change, improves perf Y) — check whether that claim is actually demonstrated (a test, a before/after description) or just asserted. If you have Playwright MCP available and a live test URL is provided or discoverable, verify visually; otherwise say plainly that the claim wasn't independently verified rather than taking it on faith.

## Phase 4: Produce the review

Output in this format (the "Ultrareview" structure this repo's own reviewers converged on by mid-2026 — use it by default):

```
## PR #<n> — <title>

**Size:** +<additions>/-<deletions> across <changedFiles> files. Base: `<baseRefName>`. Oversize: <yes/no + one-line reason>.

<A verdict, not a summary — is this good to merge or not, that's it. Don't
describe what the PR changes or where (the Size line and the diff already
say that); don't narrate your own verification steps; don't list what it got
right. If there are no blockers and nothing significant in Suggestions:
one line, e.g. "Looks good — no real issues found." and stop there. If there
IS a real problem: one short sentence naming the core issue (not the full
explanation — that's what Blockers/Suggestions below are for).>

### Blockers
<Findings that would block merge: real bugs, missing block registration, a
security/sanitization gap, a critical/serious-impact accessibility violation
(a WCAG 2.1 AA / EN 301 549 conformance gap on EU-facing content — see
eu-accessibility-law-deque.md — not just a style nit), or a change with a
blast radius disproportionate to its benefit. A plain missing-test-coverage
gap does NOT default here — see the Test coverage severity tiebreaker in
reviewer-knowledge.md. None if none.>

### Suggestions
<file:line — specific, actionable finding. Design tokens over hardcoded
values, CSS specificity/nesting, RTL logical properties, naming clarity,
if/else depth, animation logic placement (CSS vs JS), reuse over
duplication, etc. — whichever themes from `references/reviewer-knowledge.md`
actually apply to what changed in this PR, not the full checklist
mechanically.>

### Nice-to-haves
<Lower-stakes polish: breakpoint consistency, further test coverage,
follow-up cleanup TODOs, mobile-first phrasing, etc.>

### Test plan
<What you'd want to see verified before merge/rollout — and, per the
"fine for the test, not settled for rollout" pattern in
`references/reviewer-knowledge.md`, call out explicitly if this looks
scoped-safe for an experiment but needs a broader decision before wider
release.>
```

Tone notes:
- The overview is a verdict, not a summary — good to merge or not, one line if there's nothing wrong. Don't describe what the PR does (the Size line covers that), don't narrate verification methodology ("I read the full file", "I ran git grep"), and don't list what it got right — that's not a finding, so it doesn't belong anywhere in the review, not just not in the overview.
- Don't apply the full checklist from `references/reviewer-knowledge.md` indiscriminately — most PRs will only trip a few of the real recurring themes. Forcing all of them in every review produces noise, which is the opposite of how these reviews actually read.
- Prefer terse, direct phrasing for small, obviously-correct nits; reserve longer explanatory phrasing (stating the *why*) for points that genuinely benefit from it.
- Where you're offering a concrete code fix, a fenced `​`suggestion`​` block (GitHub's suggestion syntax) is idiomatic here.
- State review confidence honestly per section rather than implying uniform certainty everywhere.

## Phase 5: Posting (only with explicit confirmation)

Producing the review as a message to the user is the default and complete outcome of this skill. **Do not post the review to GitHub (`gh pr review`/`gh pr comment`) without first showing the user the drafted review and getting explicit confirmation** — posting a review is a visible action affecting shared state (the PR, notifications to the author, CI-adjacent workflows) and must not happen silently.

If the user confirms, **write the review body to a temp file with the Write tool first, then post with `--body-file`, never inline a large markdown blob into a quoted `--body` argument** — the review text routinely contains backticks (`` `libs/utils/utils.js` ``, fenced `​`suggestion`​` blocks) and possibly `$`, both of which bash will try to interpret inside a double-quoted string:

```
gh pr review <n> -R <REPO> --comment --body-file /path/to/review.md         # non-blocking comment (default)
gh pr review <n> -R <REPO> --request-changes --body-file /path/to/review.md # only if the user explicitly wants to block
gh pr review <n> -R <REPO> --approve --body-file /path/to/review.md         # only if the user explicitly wants to approve
```

Never default to `--request-changes` or `--approve` on the user's behalf — ask which review state they want if they've asked you to post. Note that GitHub rejects `--request-changes`/`--approve` (only `--comment` generally works) once a PR is closed or merged — if Phase 0 found the PR already closed/merged, mention this constraint before posting.
