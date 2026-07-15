# jira-refresh

Create and maintain engineering tracker pages in DA whose Status / Assignee /
PR data comes from Jira and GitHub. Invoke with `/jira-refresh`.

A tracker page is built from three C2 blocks: a **rich-content** hero, a
**jira-tracker-filter** (chip filters), and a **jira-tracker** table
(`Ticket · Assignee · Notes · Status`), plus an auto-maintained
**jira-tracker-changelog** at the bottom.

## Prerequisites

- `JIRA_TOKEN` set and on Adobe VPN (Jira REST).
- A DA token — `da-auth-helper token` if it's expired.
- The `github` MCP (for live PR state).
- Any `python3` on PATH — the helper self-manages its one dependency by creating
  a local `.venv` on first run, so nothing needs installing.

## Create a tracker

Run `/jira-refresh` with **no page** and give the items to track — a list of
Jira keys, a JQL query, or an epic key (auto-detected; an epic expands to its
stories). You'll be asked what you're tracking (used as the page title); if you
skip it, a headline is generated from the tickets. A new page is scaffolded and
fully populated at `/drafts/ramuntea/tracking/<slug>`.

## Update a tracker

Run `/jira-refresh` with an existing tracker **page URL**. It re-reads the page,
refreshes the **Status** and **Assignee** cells from Jira/GitHub, and leaves your
**Notes** (and everything else you authored) untouched.

## Filter-driven pages (auto-rebuild)

Add a `jira-filter` row to the **section-metadata that follows the table**:

| jira-filter | `labels = c2-wave4 ORDER BY key ASC` |
|---|---|

The value accepts keys, a JQL query, or an epic key. When present, a refresh
**re-runs the query and rebuilds that section's table** from all current matches
— adding new stories, dropping ones that no longer match — while **preserving the
Notes** on rows that survive.

The filter is **per section**, so a page can mix a filter-driven section with
manually-maintained ones: on refresh, filter sections are rebuilt from their query
and the rest are updated in place.

## Editing content

- Edit anytime in **da.live**; the refresh only overwrites Status/Assignee, so
  your Notes and layout persist.
- Or append **`?quick-edit`** to the rendered page URL (or trigger Quick Edit
  from the sidekick) to edit existing block content in place; changes save back
  to DA.

## Changelog

Every refresh diffs against what's on the page and prepends a timestamped entry
(status transitions, assignee changes, PRs added/merged, and rows added/removed),
one grouped line per story, to the **Changelog** block at the bottom. Newest 25 kept.

## Under the hood

The agent drives Jira via REST and GitHub via MCP; the deterministic parts live
in `tracker_tool.py` (`keys`, `fetch`, `resolve`, `create`, `apply`).
Full agent instructions are in `SKILL.md`.
