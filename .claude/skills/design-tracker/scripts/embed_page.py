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

Usage:
  python3 embed_page.py --entries <path to db entries.json> --token <da-auth-helper token> --page-org-repo adobecom/milo --page-branch parallax-garage-door-mask --page-path drafts/dusan/design-tracker --out <output html path>
"""
import argparse
import html
import json
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
    with urllib.request.urlopen(req) as resp:
        return resp.status, resp.read()


def upload_detail_doc(entry, day, changes, token, org_repo, branch, page_path):
    """Uploads one day's full (untrimmed) changedElements as its own DA doc,
    previews it, and returns the resulting relative URL (same-origin with
    the main page) — or None if anything failed, in which case the caller
    falls back to trimming that day instead of leaving a broken reference."""
    org, repo = org_repo.split("/")
    key = f"{entry['figmaFileKey']}-{(entry.get('figmaNodeId') or 'file').replace(':', '-')}-{day}"
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
    return f"./detail/{key}"


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
    <div>
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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries", required=True, help="path to the db entries.json (plain DA URLs)")
    parser.add_argument("--out", required=True, help="output path for the page HTML")
    parser.add_argument("--token", required=True, help="da-auth-helper token, for uploading offloaded detail docs")
    parser.add_argument("--page-org-repo", required=True, help="e.g. adobecom/milo")
    parser.add_argument("--page-branch", required=True, help="branch the page is being previewed on")
    parser.add_argument("--page-path", required=True, help="e.g. drafts/dusan/design-tracker")
    args = parser.parse_args()

    with open(args.entries) as f:
        entries = json.load(f)

    offloaded = offload_oversized_days(entries, args.token, args.page_org_repo, args.page_branch, args.page_path)

    gallery, keys = build_gallery(entries)
    json_text = json.dumps(entries)
    escaped = html.escape(json_text, quote=False)
    page = PAGE_TEMPLATE.format(data=escaped, gallery=gallery)

    with open(args.out, "w") as f:
        f.write(page)

    print(json.dumps({
        "entries": len(entries),
        "images": len(keys),
        "outputBytes": len(page),
        "daysOffloaded": offloaded,
    }))


if __name__ == "__main__":
    main()
