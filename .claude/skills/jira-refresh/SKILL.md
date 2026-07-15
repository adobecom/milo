---
name: jira-refresh
description: >
  Creates or updates a DA-hosted engineering tracker page from Jira and GitHub.
  If a tracker page is provided, refreshes its derived cells (Assignee, Status)
  from Jira/Git. If no page is provided, the user supplies Jira items (keys, a
  JQL query, or an epic) and a new single-table tracker page is scaffolded from
  a template and fully populated. On-demand only.
disable-model-invocation: true
---

# Jira Refresh Skill

Two modes, chosen by whether the user gives an existing tracker page:

- **Refresh** — a page path/URL is provided → update its data, **per section**:
  sections with a `jira-filter` are rebuilt from the query; sections without one
  are updated in place. A page can mix both.
- **Create** — no page → the user gives Jira items to track; scaffold a new page.

A page has one or more `jira-tracker` blocks (one per section); each data row's
first cell (**Ticket**, or **Block**/**Item** on older pages) holds zero or more
Jira keys. Refresh fills **Assignee** and **Status**; **Notes** and the first cell
stay authored. Helper: `tracker_tool.py` (next to this file).

## Prerequisites

- **Jira**: `JIRA_TOKEN` set + Adobe VPN (same auth as the `jira-integration`
  skill). Override the instance with `JIRA_BASE_URL` (default `jira.corp.adobe.com`).
- **DA**: cached token at `~/.aem/da-token.json`; on 401 the helper runs
  `da-auth-helper token` automatically.
- **GitHub**: the `github` MCP, for live PR state.
- **Python**: any `python3` on PATH. On first run `tracker_tool.py` bootstraps a
  local `.venv` (next to it) with its one dependency (`beautifulsoup4`) and
  re-execs itself under it, so the invocations below work regardless of which
  interpreter starts them. No global installs, no manual setup.

## Critical rules

- **Never write to authored cells.** Refresh only rewrites Assignee and Status,
  and only for rows with a matching Jira key.
- **Jira data comes from REST** (`tracker_tool.py fetch`); **PR state from the
  `github` MCP**; **page read/write from DA**. You do the PR lookups and the
  comment summarising.
- **Idempotent & non-destructive.** `apply` re-fetches fresh HTML, so edits made
  in da.live between runs are preserved.
- **Changelog is automatic.** `apply` computes the diff against the state already
  on the page and prepends a timestamped entry to a `jira-tracker-changelog`
  block at the bottom — you don't build it. See below.
- Runs only when the user asks. Default new-page location:
  `/drafts/ramuntea/tracking/<slug>` (slug from the title).

## Enrichment shape (both modes)

You build this map (one entry per key) from `fetch` + PR lookups. `update` is a
one-line summary you synthesize from the recent `comments` (dated by the newest):

```json
{
  "MWPW-199018": {
    "summary": "[Site Redesign] [CPro Plans] | Merch Card Tabs (variant)",
    "status": "In Development",
    "assignee": "Jan Ivan Viloria",
    "update": "2026-07-13 Chip Truex: controls switched to radio buttons for a11y/legal",
    "prs": [{ "url": "https://github.com/adobecom/milo/pull/1234", "state": "merged" }]
  }
}
```
Include `summary` (the Jira title) on every entry — the changelog uses it to
label each change and links the key to Jira.
`status` → colored pill, bucketed by keyword: **green** = done/resolved/closed/
complete/deploy/ship/live/release/verified/merged · **blue** = develop/progress/
review/qa/analy/implement/testing/building · **red** = anything else (draft,
backlog, blocked, not started, …). Pass the raw Jira status; the block buckets it.
Omit fields you lack.

## Mode: Refresh (page provided)

1. **Inspect the page.** `python3 .claude/skills/jira-refresh/tracker_tool.py keys --path <page-path>`
   prints `{ sections: [{ index, heading, filter, keys }], all_keys }`. Each
   section is one `jira-tracker` block; `filter` is its `jira-filter` (or null).
2. **Per section, decide the key set:**
   - `filter` set → `resolve "<filter>"` → the section's **new** keys; its
     **dropped** keys are `section.keys` minus the new set.
   - `filter` null → keep the section's existing `keys`.
3. **Fetch + PR state.** `fetch` the union of all sections' keys **plus the
   dropped keys** (dropped ones let the changelog show where they went). Then for
   each PR URL call `mcp__github__pull_request_read` (owner `adobecom`, repo
   `milo`) → `merged`/`draft`/`open`/`closed`.
4. **Build one spec** → `/tmp/spec.json`:
   ```json
   {
     "enrichment": { "MWPW-…": { "summary": "…", "status": "…", "assignee": "…", "update": "…", "prs": [] } },
     "rebuild": { "0": [ { "keys": ["MWPW-…"], "summary": "…" } ] }
   }
   ```
   - `enrichment` = every fetched key (new, existing, and dropped).
   - `rebuild` = only for **filter** sections: the section `index` (as a string) →
     one row per current match (`keys` + Jira `summary`). Omit non-filter sections.
5. **Apply.** `python3 .claude/skills/jira-refresh/tracker_tool.py apply /tmp/spec.json --path <page-path>`
   - Non-filter sections: Assignee + Status updated in place (Notes untouched).
   - Filter sections: table rebuilt from the spec rows, **surviving rows' Notes
     preserved by key**; new matches added; dropped rows removed and logged as
     `<KEY> left the filter — now <status>, <assignee>`.
   - One aggregated changelog entry is written for the whole page.
6. Report `rows_updated` / `sections_rebuilt` / `changes_logged` + preview URL.

`apply` also accepts a plain enrichment map (no `rebuild` key) for pages with no
filter sections.

To make a section query-driven, add a `jira-filter` row to the section-metadata
beside its table, e.g. key `jira-filter`, value `labels = c2-wave4 ORDER BY key ASC`
(accepts the same forms as `resolve`: keys, JQL, or an epic key). It affects only
that section.

## Mode: Create (no page provided)

1. **Resolve the items.** The user gives Jira keys, a JQL query, or an epic key:
   ```sh
   python3 .claude/skills/jira-refresh/tracker_tool.py resolve "<keys | JQL | epic-key>"
   ```
   Prints `{ "keys": [...] }` (auto-detects; an epic expands to its stories).
2. **Fetch** those keys (`fetch MWPW-… MWPW-…`) and **resolve PR states** via the
   `github` MCP, as in Refresh step 3. Keep each ticket's `summary`.
3. **Headline & hero copy.** Ask the user what they're tracking; use their answer
   as the page **title** (the hero H1, which heads the table). If they don't
   answer, generate a short headline from the tickets. Write a 1–2 sentence hero
   `summary` from the user's description or by summarizing the tickets. Optional
   short `eyebrow`.
4. **Build the spec** and write it to `/tmp/spec.json`:
   ```json
   {
     "path": "/drafts/ramuntea/tracking/<slug>",
     "eyebrow": "Site Redesign 2026",
     "title": "…headline…",
     "summary": "…1–2 sentences…",
     "column1": "Ticket",
     "background": "linear-gradient(120deg,rgba(71, 71, 71, 1) 40%, rgba(128, 128, 128, 1) 100%)",
     "rows": [{ "keys": ["MWPW-199018"], "summary": "<Jira summary for the Ticket cell>" }],
     "enrichment": { "MWPW-199018": { "status": "…", "assignee": "…", "update": "…", "prs": [] } }
   }
   ```
   One `rows` entry per item (multi-key rows allowed). The **Ticket** cell is the
   Jira summary + key(s); **Notes** is left empty; Assignee/Status come from
   `enrichment`. `background` is optional (defaults to the gradient shown).
5. **Create the page:**
   ```sh
   python3 .claude/skills/jira-refresh/tracker_tool.py create /tmp/spec.json
   ```
   Builds hero → filter → table → changelog, uploads, and previews. `create` makes
   a single section; a mixed page is made by adding more `jira-tracker` sections
   in da.live (give any of them a `jira-filter` to make it query-driven).
6. Report the created/preview URLs.

## Changelog (automatic on apply)

`apply` diffs the incoming enrichment against what's on the page (the previous
run's output) and prepends one timestamped entry to a `jira-tracker-changelog`
block at the bottom of the page (created on first run under a rich-content
`<h2>Changelog</h2>` heading, just above the `foundation: c2` metadata). Notable
changes captured: status transitions, assignee changes (single-key rows), PR
added / state change, and — for filter sections — items added/removed. There's
**one line per story**, grouping all of that story's changes (e.g. `… — status
Code Review → Done; PR #6307 added (merged)`); each line links the Jira key and
includes the story title (from the enrichment `summary`).
An entry with no changes records `No changes.`; the newest 25 entries are kept.
`jira-tracker-changelog`
is a registered C2 block; nothing extra is needed in the spec.

## Template layout (create)

Single section stack: **rich-content** hero (`dark`, white title + summary over a
CSS gradient background; section style `container, fixed, spacing lg`) →
**jira-tracker-filter** (Assignee + Status chip filters) → **jira-tracker** table
(Ticket · Assignee · Notes · Status) → a **rich-content** `<h2>Changelog</h2>` +
**jira-tracker-changelog** (seeded with a "Tracker created with N items" entry) →
page metadata `foundation: c2`. All are registered C2 blocks.
