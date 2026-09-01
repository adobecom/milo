#!/usr/bin/env python3
"""Builds the design-tracker page's authored HTML: entries.json (dates,
magnitudes, changed-element names — no images) embedded as text in the
block's own content cell, plus a hidden gallery of real <img> tags for every
thumbnail/day-screenshot the data references.

Why two different mechanisms for text vs. images, not one: a page's own
fetch()/img.src against content.da.live is a confirmed 401 in every hosting
context tried (see the skill's "Data lives in DA" section) — so nothing can
be left as a live content.da.live reference for the *browser* to resolve.
Embedding images as base64 text alongside the JSON fixed that, but blew a
different limit: Helix's content-bus rejects (409) documents past roughly
1-2MB, and screenshots alone (500KB+ each as PNGs) blow that fast with more
than a couple of days tracked.

The fix: author images as real <img> tags instead of inline base64 text.
Confirmed directly (see git history / session notes) — Helix downloads and
re-hosts any image actually referenced via <img src="..."> in authored
content onto its own aem.page/aem.live media domain (a `media_<hash>.<ext>`
same-origin URL), at *preview/publish* time, not read by the browser at all.
That URL is same-origin with the page, so no content.da.live fetch, no
auth problem — and the image stays a lightweight reference in the source
document (not inline base64), so no document-size problem either.

design-tracker.js reads this gallery at decorate() time: each hidden <img>'s
`alt` carries a unique key (thumbnail or day-screenshot identity); JS builds
a {key: renderedSrc} lookup from the already-rendered (already re-hosted)
img elements, and uses that src instead of the raw DA URL from the JSON.

The SAME size limit also applies to per-element changedElements detail text
(confirmed: one busy design's versionChanges text alone hit 1.59MB, no
images involved). Same fix, applied to text instead of images: any day
whose full detail would blow the budget gets that day's full changedElements
uploaded as its own separate small DA document (same upload+preview
mechanism as the main page), instead of embedded inline. The embedded copy
keeps date/magnitude/author/changedElementCount for every version (so the
history bar chart and version list are always complete) but replaces
changedElements with a `detailUrl` pointer for those specific days; design-
tracker.js fetches that URL only when a user actually opens that day's
summary, not upfront.

Each tracker is one self-contained page: a hand-edited "Design Links" input
table plus the generated design-tracker dashboard block, side by side, with
its own data stored beside it (page `<path>` → data at `<path>/entries.json`,
`<path>/thumbnails/`, `<path>/detail/`). So this script REGENERATES the
dashboard block in place but PRESERVES the existing "Design Links" table it
finds on the page verbatim — otherwise every publish would wipe the input
the user just edited. Points people can make a wave1 page, a wave2 page, etc.,
each independently tracked, and re-sync any of them by sending its link.

Usage:
  python3 embed_page.py --entries <path to db entries.json> --token <da-auth-helper token> --page-org-repo adobecom/milo --page-branch design-tracker-dashboard --page-path drafts/dusan/wave1 --out <output html path> [--input-block-name "Design Links"]
"""
import argparse
import html
import json
import re
import urllib.error
import urllib.request

# Confirmed via direct testing: Helix's content-bus 409s somewhere between
# ~1MB (succeeds) and ~1.6MB (fails) for this authored-content pipeline.
# Kept comfortably under the confirmed-working size rather than the exact
# boundary, since the true limit isn't documented.
MAX_DOCUMENT_BYTES = 900_000

DETAIL_DOC_TEMPLATE = """<body>
  <header></header>
  <main>
    <div>
      <div>{data}</div>
    </div>
  </main>
  <footer></footer>
</body>
"""


def da_request(method, url, token, data=None, content_type=None):
    # Cloudflare (fronting admin.da.live/admin.hlx.page) 403s on urllib's
    # default User-Agent ("Python-urllib/3.x") even with a valid auth token
    # — same issue already fixed once for image downloads in this file.
    headers = {
        "Authorization": f"Bearer {token}",
        "User-Agent": "Mozilla/5.0 (compatible; design-tracker-skill/1.0)",
    }
    if content_type:
        headers["Content-Type"] = content_type
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    # Bounded timeout: an unbounded urlopen() blocks forever on a dead
    # connection (laptop sleep/wake, network switch) instead of raising —
    # confirmed directly causing an unrecoverable hang in diff_versions.py.
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, resp.read()


def upload_detail_doc(entry, day, changes, token, org_repo, branch, page_path):
    """Uploads one day's full (untrimmed) changedElements as its own DA doc,
    previews it, and returns the resulting relative URL (same-origin with
    the main page) — or None if anything failed, in which case the caller
    falls back to trimming that day instead of leaving a broken reference.

    Confirmed directly: Helix serves the previewed webPath all-lowercase
    regardless of the source doc's path casing (e.g. a Figma fileKey with
    mixed case like "6FQTDUAttFbukvtskDAkPS" gets served at
    ".../6fqtduattfbukvtskdakps-..."). HTTP paths are case-sensitive, so a
    mixed-case reference 404s even though the doc genuinely exists — the
    key must be lowercased here to match what will actually be fetchable."""
    org, repo = org_repo.split("/")
    key = f"{entry['figmaFileKey']}-{(entry.get('figmaNodeId') or 'file').replace(':', '-')}-{day}".lower()
    doc_path = f"{page_path}/detail/{key}"
    payload = json.dumps({c["versionId"]: c.get("changedElements") or [] for c in changes})
    body = DETAIL_DOC_TEMPLATE.format(data=html.escape(payload, quote=False)).encode()

    try:
        da_request(
            "POST", f"https://admin.da.live/source/{org}/{repo}/{doc_path}.html",
            token, data=body, content_type="text/html",
        )
        da_request(
            "POST", f"https://admin.hlx.page/preview/{org}/{repo}/{branch}/{doc_path}",
            token,
        )
    except Exception as e:
        print(json.dumps({"detailDocError": key, "reason": str(e)}))
        return None
    # Absolute (leading /), not "./detail/{key}" — confirmed directly that a
    # relative reference resolves against the page URL's own "directory"
    # (everything up to the last /), which for a page at .../design-tracker
    # (no trailing slash) is .../drafts/dusan/, not .../design-tracker/ —
    # silently 404ing at a sibling path instead of the intended nested one.
    return f"/{page_path}/detail/{key}"


def offload_oversized_days(entries, token, org_repo, branch, page_path):
    """Same-day grouping as the UI itself (one summary panel per day) — a
    day either keeps all its versions' full detail inline, or all of them
    move to one shared detail doc for that day, never a partial mix."""
    by_entry_day = {}
    for entry in entries:
        for change in entry.get("versionChanges") or []:
            if change.get("changedElements"):
                day = (change.get("date") or "")[:10]
                by_entry_day.setdefault((id(entry), day), []).append(change)

    total = len(json.dumps(entries))
    # Largest days first — offloading one big day frees more budget per
    # network round-trip than offloading many small ones.
    ranked = sorted(
        by_entry_day.items(),
        key=lambda kv: len(json.dumps([c["changedElements"] for c in kv[1]])),
        reverse=True,
    )
    offloaded = 0
    trimmed = 0
    entry_by_id = {id(e): e for e in entries}
    for (entry_id, day), changes in ranked:
        if total <= MAX_DOCUMENT_BYTES:
            break
        entry = entry_by_id[entry_id]
        before = len(json.dumps([c["changedElements"] for c in changes]))
        detail_url = upload_detail_doc(entry, day, changes, token, org_repo, branch, page_path)
        for c in changes:
            c["changedElements"] = []
        if detail_url is not None:
            entry.setdefault("offloadedDays", {})[day] = detail_url
            offloaded += 1
        else:
            # Upload failed — falls back to the old degrade-gracefully
            # behavior (drop detail, keep magnitude/count) rather than
            # leaving this day's full data embedded and risking the whole
            # page blowing past the size limit at upload time.
            trimmed += 1
        after = len(json.dumps([c["changedElements"] for c in changes]))
        total -= (before - after)
    if trimmed:
        print(json.dumps({"daysTrimmedAfterOffloadFailure": trimmed}))
    return offloaded


def thumb_key(entry):
    return f"dt-thumb-{entry['figmaFileKey']}-{(entry.get('figmaNodeId') or 'file').replace(':', '-')}"


def day_key(entry, day):
    return f"dt-day-{entry['figmaFileKey']}-{(entry.get('figmaNodeId') or 'file').replace(':', '-')}-{day}"


def build_gallery(entries):
    images = []  # (key, url)
    for entry in entries:
        if entry.get("figmaThumbnailUrl"):
            images.append((thumb_key(entry), entry["figmaThumbnailUrl"]))
        for day, shot in (entry.get("dayScreenshots") or {}).items():
            if shot.get("path"):
                images.append((day_key(entry, day), shot["path"]))
    tags = "\n".join(
        f'          <img src="{html.escape(url, quote=True)}" alt="{html.escape(key, quote=True)}">'
        for key, url in images
    )
    return tags, [k for k, _ in images]


PAGE_TEMPLATE = """<body>
  <header></header>
  <main>
{title}{input_table}    <div>
      <div class="design-tracker">
        <div>
          <div>{data}</div>
        </div>
        <div style="display:none">
          <div>
{gallery}
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
"""


def fetch_page_source(org_repo, page_path, token):
    """Returns the current page's raw DA source HTML, or None if it doesn't
    exist yet (first-ever publish of a brand-new page). Source is
    branch-independent, so no branch in this URL."""
    org, repo = org_repo.split("/")
    url = f"https://admin.da.live/source/{org}/{repo}/{page_path}.html"
    try:
        _, body = da_request("GET", url, token)
        return body.decode("utf-8")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


_DIV_TAG = re.compile(r"<\s*(/?)\s*div\b[^>]*>", re.IGNORECASE)
_H1_RE = re.compile(r"<h1\b[^>]*>.*?</h1>", re.IGNORECASE | re.DOTALL)


def extract_title(page_html):
    """Pulls the page's own <h1>...</h1> (its display title) out of the
    current source verbatim, same rationale as extract_input_table: this
    script rebuilds the whole page body each sync, so anything not
    explicitly carried across is silently dropped."""
    if not page_html:
        return None
    m = _H1_RE.search(page_html)
    return m.group(0) if m else None


def extract_input_table(page_html, block_class):
    """Pulls the hand-edited input block's `<div class="<block_class>">...</div>`
    substring out of the current page verbatim, so republishing the dashboard
    beside it never reformats or drops it.

    DA stores authored blocks as nested divs (not <table> — confirmed a raw
    <table> upload is normalized to div-blocks on preview), so this finds the
    block's opening div by class, then balances <div>/</div> to its matching
    close. Returns the raw block HTML (to re-embed untouched) or None if the
    page has no such block yet (first publish of a new page)."""
    if not page_html:
        return None
    open_re = re.compile(
        r'<div\b[^>]*\bclass\s*=\s*"[^"]*\b' + re.escape(block_class) + r'\b[^"]*"[^>]*>',
        re.IGNORECASE,
    )
    m = open_re.search(page_html)
    if not m:
        return None
    start = m.start()
    depth = 0
    for tag in _DIV_TAG.finditer(page_html, start):
        if tag.group(1):   # </div>
            depth -= 1
            if depth == 0:
                return page_html[start:tag.end()]
        else:              # <div ...>
            depth += 1
    return None            # unbalanced — treat as no table rather than half a block


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries", required=True, help="path to the db entries.json (plain DA URLs)")
    parser.add_argument("--out", required=True, help="output path for the page HTML")
    parser.add_argument("--token", required=True, help="da-auth-helper token, for uploading offloaded detail docs")
    parser.add_argument("--page-org-repo", required=True, help="e.g. adobecom/milo")
    parser.add_argument("--page-branch", required=True, help="branch the page is being previewed on")
    parser.add_argument("--page-path", required=True, help="e.g. drafts/dusan/wave1")
    parser.add_argument("--input-block-class", default="design-links",
                        help="CSS class of the hand-edited input block to preserve verbatim")
    parser.add_argument("--title", default=None,
                        help="page display title (<h1>); sets it on first publish or "
                             "overrides an existing one. Omit to carry across whatever "
                             "title (if any) is already on the page.")
    args = parser.parse_args()

    with open(args.entries) as f:
        entries = json.load(f)

    # Preserve the user's hand-edited input table: read the current page and
    # carry its "Design Links" table across untouched, so regenerating the
    # dashboard block beside it never clobbers what they just authored.
    current_page = fetch_page_source(args.page_org_repo, args.page_path, args.token)
    input_table = extract_input_table(current_page, args.input_block_class)
    if input_table:
        input_block = f"    <div>\n      {input_table}\n    </div>\n"
    else:
        input_block = ""

    title_html = f"<h1>{html.escape(args.title)}</h1>" if args.title else extract_title(current_page)
    # Wrapped in its own section <div> — a bare <h1> as a direct child of
    # <main> breaks Franklin's per-section block-decoration pass (confirmed
    # directly: the whole page stayed hidden behind the pre-decoration
    # `display: none` since decoration never completed). Every top-level
    # child of <main> must itself be a section div.
    title_block = f"    <div>{title_html}</div>\n" if title_html else ""

    offloaded = offload_oversized_days(entries, args.token, args.page_org_repo, args.page_branch, args.page_path)

    gallery, keys = build_gallery(entries)
    json_text = json.dumps(entries)
    escaped = html.escape(json_text, quote=False)
    page = PAGE_TEMPLATE.format(data=escaped, gallery=gallery, input_table=input_block, title=title_block)

    with open(args.out, "w") as f:
        f.write(page)

    print(json.dumps({
        "entries": len(entries),
        "images": len(keys),
        "outputBytes": len(page),
        "daysOffloaded": offloaded,
        "inputTablePreserved": bool(input_table),
        "title": args.title or (extract_title(current_page) and "preserved") or None,
    }))


if __name__ == "__main__":
    main()
