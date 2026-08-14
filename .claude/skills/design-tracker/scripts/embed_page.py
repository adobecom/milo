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

Usage:
  python3 embed_page.py --entries <path to db entries.json> --out <output html path>
"""
import argparse
import html
import json

# Confirmed via direct testing: Helix's content-bus 409s somewhere between
# ~1MB (succeeds) and ~1.6MB (fails) for this authored-content pipeline —
# and this isn't only about images (fixed separately, see module docstring):
# a single busy design's versionChanges text alone (hundreds of versions,
# each with a full changedElements array of per-element names/details) can
# blow this on its own. Kept comfortably under the confirmed-working size
# rather than the exact boundary, since the true limit isn't documented.
MAX_DOCUMENT_BYTES = 900_000


def trim_to_budget(entries):
    """Degrades gracefully, not silently: drops changedElements (the bulky
    per-element detail list) from the OLDEST versions first, across all
    entries combined — never touches date/magnitude/author/versionId, so
    the full-history magnitude bar chart stays 100% accurate no matter how
    much gets trimmed. Only the "click a day to see exactly what changed"
    detail list degrades, and only for old-enough versions to matter. This
    is a size-budget fallback, not a design choice — see the "Publishing
    the dashboard page" section of SKILL.md for the tradeoff being made
    here, and revisit if a same-origin lazy-fetch alternative is verified
    to work (would remove the need for this entirely)."""
    all_changes = []
    for entry in entries:
        for change in entry.get("versionChanges") or []:
            if change.get("changedElements"):
                all_changes.append((change.get("date") or "", change))
    all_changes.sort(key=lambda pair: pair[0])  # oldest first

    total = len(json.dumps(entries))
    trimmed = 0
    for _, change in all_changes:
        if total <= MAX_DOCUMENT_BYTES:
            break
        # Incremental size accounting (avoids re-serializing the whole
        # multi-hundred-KB document on every single trimmed version).
        before = len(json.dumps(change["changedElements"]))
        change["changedElements"] = []
        after = len(json.dumps(change["changedElements"]))
        total -= (before - after)
        trimmed += 1
    return trimmed


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
    args = parser.parse_args()

    with open(args.entries) as f:
        entries = json.load(f)

    trimmed = trim_to_budget(entries)

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
        "versionsWithDetailTrimmed": trimmed,
    }))


if __name__ == "__main__":
    main()
