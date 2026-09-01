#!/usr/bin/env python3
"""Parses the human-edited "Design Links" input block out of a DA page's raw
source, so a session doesn't have to hand-roll HTML parsing (block markup
quirks, nested tags inside a cell, etc.) each time "Sync from an input page"
runs — same rationale as merge_entry.py/diff_versions.py existing in this
skill instead of inline logic.

This reads the page's *raw* DA source (admin.da.live/source/...), not a
preview/live render — the input block is meant to be hand-edited directly in
DA's own block editor, and a plain source GET needs no preview step.

**DA stores authored blocks as nested `<div>`s, not `<table>`s** (confirmed
directly: a `<table>` uploaded to DA's source API is normalized to div-blocks
on preview, and the block name becomes the wrapper's CSS class). A block the
user names "Design Links" in the DA editor is stored as:

  <div class="design-links">
    <div><div><p>Figma</p></div><div><p>Jira</p></div></div>   <- header row
    <div><div><p><a href="https://www.figma.com/design/...">...</a></p></div>
        <div><p><a href="https://.../browse/MWPW-1234">...</a></p></div></div>
    ...
  </div>

So this identifies the block by its **class** (default `design-links`), not a
header cell. Each direct-child `<div>` of the block is one row; a row's links
are classified by URL (figma.com vs /browse/), not by column position, so
minor authoring differences don't matter. The header row (no Figma link) is
skipped naturally. A row's Jira link is optional (a Figma-only row is valid).
A single row may hold more than one Figma link; each is emitted as its own
row sharing that row's Jira link (one ticket can cover several viewport
variants).

Usage:
  python3 parse_input_block.py \
    --org adobecom --repo milo --path drafts/dusan/wave1 \
    --token <da-auth-helper token> [--block-class design-links]

Output (stdout): {"rows": [{"figmaUrl": ..., "jiraUrl": ...|null}, ...],
"warnings": [...]} or {"error": "..."} with a non-zero exit code.
"""
import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser


class DivBlockCollector(HTMLParser):
    """Walks div depth to pull each row's hrefs out of the first
    `<div class="<block_class>">` block. Rows are the block's direct-child
    divs; cells nest below that but we don't care about cell boundaries — a
    row's links are classified by URL, so collecting every <a> in the row is
    enough."""

    def __init__(self, block_class):
        super().__init__()
        self.block_class = block_class
        self.div_depth = 0
        self.block_depth = None   # depth of the matched block's own div
        self.row_depth = None     # depth of the row div currently open
        self.finished = False     # only capture the first matching block
        self.rows = []            # list of [href, ...]
        self._cur = None          # hrefs of the row currently open
        self.block_count = 0

    def _has_class(self, attrs, cls):
        classes = (dict(attrs).get("class") or "").split()
        return cls in classes

    def handle_starttag(self, tag, attrs):
        if tag == "a" and self.block_depth is not None and self._cur is not None:
            href = dict(attrs).get("href")
            if href:
                self._cur.append(href)
            return
        if tag != "div":
            return
        self.div_depth += 1
        d = self.div_depth
        if not self.finished and self.block_depth is None and self._has_class(attrs, self.block_class):
            self.block_depth = d
            self.block_count += 1
        elif self.block_depth is not None and d == self.block_depth + 1:
            self.row_depth = d
            self._cur = []

    def handle_endtag(self, tag):
        if tag != "div":
            return
        d = self.div_depth
        if self._cur is not None and d == self.row_depth:
            self.rows.append(self._cur)
            self._cur = None
            self.row_depth = None
        elif self.block_depth is not None and d == self.block_depth:
            self.block_depth = None
            self.finished = True
        self.div_depth -= 1


def da_source_get(org, repo, path, token):
    url = f"https://admin.da.live/source/{org}/{repo}/{path}.html"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": "Mozilla/5.0 (compatible; design-tracker-skill/1.0)",
        },
    )
    # Bounded timeout: an unbounded urlopen() blocks forever on a dead
    # connection (laptop sleep/wake, network switch) instead of raising —
    # confirmed directly causing an unrecoverable hang in diff_versions.py.
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def extract_rows(html_text, block_class):
    parser = DivBlockCollector(block_class)
    parser.feed(html_text)

    warnings = []
    if parser.block_count == 0:
        return None, warnings
    if parser.block_count > 1:
        warnings.append(f"found {parser.block_count} '{block_class}' blocks — using the first")

    rows = []
    for href_list in parser.rows:
        figma_hrefs = [h for h in href_list if "figma.com" in h]
        jira_hrefs = [h for h in href_list if "/browse/" in h]
        jira_url = jira_hrefs[0] if jira_hrefs else None
        if not figma_hrefs:
            continue  # header row or an empty/placeholder row — nothing to track
        for figma_url in figma_hrefs:
            rows.append({"figmaUrl": figma_url, "jiraUrl": jira_url})
    return rows, warnings


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--org", required=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--path", required=True, help="e.g. drafts/dusan/wave1 (no .html)")
    parser.add_argument("--token", required=True)
    parser.add_argument("--block-class", default="design-links",
                        help="CSS class of the input block (block named 'Design Links' -> 'design-links')")
    args = parser.parse_args()

    try:
        html_text = da_source_get(args.org, args.repo, args.path, args.token)
    except urllib.error.HTTPError as e:
        print(json.dumps({"error": f"HTTP {e.code} fetching source — {e.reason}"}))
        sys.exit(1)

    rows, warnings = extract_rows(html_text, args.block_class)
    if rows is None:
        print(json.dumps({
            "error": f"no '{args.block_class}' block found on the page — "
                     "has the Design Links table been authored yet?",
        }))
        sys.exit(1)

    print(json.dumps({"rows": rows, "warnings": warnings}, indent=2))


if __name__ == "__main__":
    main()
