# PR Review sidebar (personal MVP)

A Chrome side-panel extension that runs this repo's `/pr-review` skill against
whatever PR you're viewing, then lets you accept/decline each finding before
posting a review to GitHub.

Two parts:

- `relay/` — a local Node server that shells out to `claude -p "/pr-review <url>"`
  (with `--json-schema` for structured output, each finding carrying an
  optional `file`/`line` anchor) and to `gh api .../reviews` for posting
  (accepted findings with a file/line become native inline GitHub review
  comments; general findings fold into the review's summary). Also proxies
  `/api/simplify` (a cheap, tool-less rewrite call). Binds to `127.0.0.1`
  only. Uses whatever `claude`/`gh` auth already works on this machine — no
  tokens touch the browser.
- `extension/` — an unpacked Chrome extension (Manifest V3):
  - a **side panel** (`sidepanel.js`/`.html`): run review, check/uncheck
    findings, Edit/Simplify each one (and the overview), post as
    **draft** / comment / approve / request-changes. "Send as draft to
    GitHub" creates a genuinely *pending* GitHub review (the REST API's
    `event` field is simply omitted) — invisible to anyone but you until you
    open the PR yourself and hit GitHub's own "Submit review" button. This
    replaced an earlier "Open in GitHub" feature that tried to click
    GitHub's native comment button open via `.js-add-line-comment` — a
    selector confirmed removed from GitHub's own UI back in 2021 (see Known
    limitations). The API-based draft review needs no DOM interaction at
    all and can't go stale the same way.
  - a **content script** (`content.js`) that runs on `github.com/*/pull/*`
    and injects each file/line-anchored finding directly into the real diff
    (Unified view only) as a read-only preview, with its own Accept
    checkbox and Edit/Simplify — purely for reviewing/accepting findings
    in place; actual posting (draft or otherwise) always goes through the
    side panel's buttons.
  - `shared-render.js`: rendering logic (prose/code-block splitting,
    Edit/Simplify UI) used by both surfaces.
  - `background.js`: relays `/api/simplify` calls from the content script,
    since a content script's own `fetch()` is subject to github.com's CSP.
  - The two surfaces share state via `chrome.storage.local` (findings +
    accept/decline), so toggling a checkbox on the actual GitHub page or in
    the side panel keeps both in sync.

## One-time setup

1. **Trust this workspace for headless Claude Code**, if you haven't already
   run `claude` interactively here:
   ```sh
   claude   # run once inside /Users/hit64474/milo, accept the trust dialog, then exit
   ```
2. Confirm `gh auth status` is logged in (already the case per your shell setup).
3. No `npm install` needed — the relay only uses Node built-ins.

## Run it

```sh
node tools/pr-review-extension/relay/server.js
```

Leave that running. Then load the extension:

1. Chrome → `chrome://extensions` → enable **Developer mode**.
2. **Load unpacked** → select `tools/pr-review-extension/extension/`.
3. Click the extension's toolbar icon on any `github.com/.../pull/<n>` page —
   it opens the side panel.

## Using it

1. Open a PR on `github.com/adobecom/milo` (or any repo — the skill degrades
   gracefully outside milo, per its own Phase 0 fallback).
2. Click **Run review** in the side panel. This runs the real skill headlessly
   — same verification-against-source behavior as `/pr-review` in an
   interactive session — and can take 1–3 minutes.
3. Uncheck any finding you don't want included.
4. Click **Send as draft to GitHub** / **Post as comment** / **Approve** /
   **Request changes** — this is the only point anything reaches GitHub, and
   only the checked findings are included. **Send as draft** is the
   recommended default: it creates a pending review (GitHub's own
   `event`-omitted state) that only you can see until you open the PR and
   submit it yourself via GitHub's native review UI — a safer, DOM-free
   alternative to the old per-line "Open in GitHub" button.

## Config

Environment variables for the relay (set before starting it):

| Var | Default | Purpose |
|---|---|---|
| `PR_REVIEW_RELAY_PORT` | `4756` | Port the relay listens on |
| `MILO_DIR` | `~/milo` | Working directory `claude`/`gh` run from (must be a milo checkout so the skill resolves) |
| `PR_REVIEW_MODEL` | `sonnet` | Model alias passed to `claude -p --model` |

## Security posture

- No Anthropic or GitHub credentials ever touch the browser or this relay's
  own code — `runClaudeReview`/`postReview` just spawn `claude`/`gh` as
  subprocesses, which resolve auth themselves exactly as they would if you
  ran them in a terminal.
- The relay binds to `127.0.0.1` only — never reachable from another device.
- `/api/review` and `/api/post` reject any request whose `Origin` header
  isn't `chrome-extension://...` (403). This closes the local CSRF-style gap
  where any other tab's JavaScript could otherwise hit `127.0.0.1:4756` and
  trigger a real `claude`/`gh pr review` run under your credentials — an
  ordinary webpage can't spoof that header, only an installed extension can
  send it. `/api/health` stays open (no side effects) so `curl` works for a
  quick check.
- The claude subprocess runs with `--disallowedTools` blocking `gh pr
  review/comment/merge`, `git push/commit/merge/reset/checkout`, etc. — this
  is defense in depth against a prompt-injected PR description trying to get
  the review session to post/write on its own, bypassing the accept/decline
  step. It's not a full sandbox (Bash access is still broad for reads), so
  treat this as reasonable-for-a-personal-tool, not hardened.

## Known limitations (MVP scope)

- Findings render as prose + distinct code blocks (fenced `​```suggestion​````
  blocks get their own styled box), not full markdown — no bold/links/etc.
  This is deliberate: rendering arbitrary model output as HTML would need
  sanitization this personal tool doesn't take on. Everything is set via
  `.textContent`, never `.innerHTML`, on both the side panel and the
  on-page injected annotations.
- On-page injection (`content.js`) only supports GitHub's default **Unified**
  diff view, not **Split** view (different table structure) — it detects
  Split view and no-ops with a console note rather than misbehaving.
- **The old "Open in GitHub" button was removed.** It tried to click
  GitHub's native "+" add-comment button via `button.js-add-line-comment`
  — a selector that looked corroborated by several independent open-source
  tools, but turned out to be dead: `refined-github` (31.8k★, actively
  maintained) removed its own reliance on that exact class in 2021 after
  GitHub migrated the Files-changed diff view to a React-based renderer with
  no equivalent stable "+" button (current comment textarea target there is
  `div[class*="AddCommentEditor"] textarea`, a hashed CSS-module class with
  no fixed literal name). Rather than keep guessing at a moving, private
  target, posting now goes exclusively through the **Send as draft to
  GitHub** button (see above), which uses GitHub's documented, stable REST
  API instead of DOM simulation.
- Single reviewer, single machine — relay is not meant to be exposed beyond
  `127.0.0.1`.
- **content.js shows a small fixed status badge** (bottom-right corner of any
  GitHub PR page it's active on) reporting its own state — "no stored review
  yet", "N/M annotations injected", or a red error state — without needing
  DevTools open. This exists because the most common cause of "nothing got
  injected" is silent: **reloading the unpacked extension in
  `chrome://extensions` invalidates the JS context of `content.js` in any
  already-open tab** — every subsequent `chrome.storage` call in that stale
  instance throws "Extension context invalidated", and nothing visibly
  happens unless the console is open. If you see the red error badge, refresh
  the GitHub tab (a reload of the *extension* doesn't propagate to
  already-open tabs on its own). Also note: annotations only ever appear on
  the **Files changed** tab (`.../pull/<n>/files`), never on **Conversation**
  — there's no diff DOM to attach to there.
- **A finding's line can be outside every rendered hunk's context window**
  (e.g. citing a rule's opening line rather than the literal changed line) —
  GitHub collapses those regions by default, so there's no row to attach to
  until they're expanded. `content.js` detects this (file matches, line
  doesn't) and clicks GitHub's own per-file "Expand all" button once; the
  existing `MutationObserver` on `#files` then picks up the newly-revealed
  rows and retries injection automatically — confirmed live against
  `adobecom/milo#6263` (line 293 had zero matching cells before the click,
  one right after).
- Cross-surface state uses `chrome.storage.local`, not `.session` — chosen
  deliberately after `.session` turned out to need an extra cross-context
  access grant (`setAccessLevel`) for content scripts, a newer/narrower API
  surface not worth the risk on a corporate-managed Chrome install. The
  tradeoff: `.local` persists across extension reloads (until a fresh review
  overwrites the same PR's entry, or the extension is uninstalled) rather
  than clearing automatically — a stale entry for a PR you're not actively
  looking at is harmless, just not auto-cleaned-up.
