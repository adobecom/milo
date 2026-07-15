#!/usr/bin/env python3
"""Deterministic helper for the /jira-refresh skill.

Reads and writes DA tracker pages. Refresh only rewrites the derived columns —
Assignee and the combined Status cell — matched by the Jira key(s) in each row's
first cell (Ticket / Item / Block). Authored cells (first cell, Notes) are never
overwritten. Jira data is read via REST; PR state is supplied by the caller.

Filters are per-section: each jira-tracker block may carry its own `jira-filter`
in the section-metadata beside it, so one page can mix filter-driven sections
(rebuilt from the query) with manually-maintained sections (updated in place).

Subcommands:
  keys     Read a page; per section: index, heading, jira-filter, and keys.
  fetch    Fetch Jira data (summary, status, assignee, PR urls, up to 5 recent
           comments) for given keys, or for all keys on --path.
  resolve  Turn keys / a JQL query / an epic key into a list of keys.
  create   Build a new single-table tracker page from a spec JSON.
  apply    Refresh a page from a spec: update non-filter sections in place and
           rebuild filter sections (by section index), preserving Notes; also
           writes the changelog.

DA auth uses the cached token (~/.aem/da-token.json); on 401 it runs
`da-auth-helper token` once. Jira auth uses $JIRA_TOKEN (Adobe VPN required).

On first run this bootstraps a local `.venv` (next to this file) with its one
dependency (beautifulsoup4) and re-execs under it, so it works under any python3
on PATH without touching global site-packages.
"""
import argparse
import html
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime


def _ensure_venv():
    """Re-exec under a dedicated venv so the tool never depends on whichever
    python3 is on PATH (which may lack bs4 and block installs under PEP 668)."""
    venv = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".venv")
    py = os.path.join(venv, "bin", "python")
    if os.path.realpath(sys.executable) == os.path.realpath(py):
        return
    if not os.path.exists(py):
        import venv as _venv
        _venv.EnvBuilder(with_pip=True).create(venv)
    subprocess.run([py, "-m", "pip", "install", "--quiet", "beautifulsoup4"], check=True)
    os.execv(py, [py, os.path.abspath(__file__), *sys.argv[1:]])


_ensure_venv()
from bs4 import BeautifulSoup

ORG = "adobecom"
REPO = "milo"
TOKEN_FILE = os.path.expanduser("~/.aem/da-token.json")
COLMAP = {
    "block": "block", "ticket": "block", "item": "block",
    "assignee": "assignee", "notes": "notes", "status": "status", "jira": "status",
}
# Generic Jira key (any project), so cross-project trackers (JQL/epic) work.
KEY_RE = re.compile(r"\b[A-Z][A-Z0-9]+-\d+\b")
JIRA_API = os.environ.get("JIRA_BASE_URL", "https://jira.corp.adobe.com").rstrip("/")
JIRA_BROWSE = f"{JIRA_API}/browse/"
PR_URL_RE = re.compile(r"https?://github\.com/[\w.-]+/[\w.-]+/pull/\d+")


def esc(s):
    return html.escape(str(s), quote=True)


def clean_comment(s):
    s = re.sub(r"\{[^}]*\}", " ", s or "")          # drop {code}/{quote}/{color} markers
    s = re.sub(r"\[([^|\]]+)\|[^\]]+\]", r"\1", s)   # [text|url] -> text
    return re.sub(r"\s+", " ", s).strip()


def get_token(force_refresh=False):
    if force_refresh:
        subprocess.run(["da-auth-helper", "token"], check=True, capture_output=True, text=True)
    with open(TOKEN_FILE) as f:
        return json.load(f)["access_token"]


def da_request(method, url, token, data=None, headers=None):
    hdrs = {"Authorization": f"Bearer {token}", "User-Agent": "curl/8.4.0"}
    hdrs.update(headers or {})
    req = urllib.request.Request(url, data=data, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()


def fetch_source(path, token):
    url = f"https://admin.da.live/source/{ORG}/{REPO}{path}.html"
    status, body = da_request("GET", url, token)
    if status == 401:
        token = get_token(force_refresh=True)
        status, body = da_request("GET", url, token)
    if status != 200:
        sys.exit(f"Failed to read DA source ({status}): {body[:300]}")
    return body, token


def upload_source(path, html, token):
    url = f"https://admin.da.live/source/{ORG}/{REPO}{path}.html"
    boundary = "----trackerboundary"
    body = (
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="data"; filename="page.html"\r\n'
        "Content-Type: text/html\r\n\r\n"
        f"{html}\r\n--{boundary}--\r\n"
    ).encode()
    headers = {"Content-Type": f"multipart/form-data; boundary={boundary}"}
    status, resp = da_request("POST", url, token, data=body, headers=headers)
    if status == 401:
        status, resp = da_request("POST", url, get_token(force_refresh=True), data=body, headers=headers)
    if status not in (200, 201):
        sys.exit(f"Failed to upload DA source ({status}): {resp[:300]}")


def trigger_preview(path, token):
    url = f"https://admin.hlx.page/preview/{ORG}/{REPO}/main{path}"
    status, resp = da_request("POST", url, token)
    return status


def rows_of(block):
    return block.find_all("div", recursive=False)


def cells_of(row):
    return row.find_all("div", recursive=False)


def col_map(header_cells):
    m = {}
    for i, c in enumerate(header_cells):
        name = c.get_text(strip=True).lower()
        if name in COLMAP:
            m[COLMAP[name]] = i
    return m


def parse(html):
    soup = BeautifulSoup(html, "html.parser")
    blocks = []
    for block in soup.select(".jira-tracker"):
        rows = rows_of(block)
        if len(rows) < 2:
            continue
        cols = col_map(cells_of(rows[0]))
        page_h2 = block.find_previous("h2")
        page = page_h2.get_text(strip=True) if page_h2 else ""
        blocks.append({"el": block, "rows": rows[1:], "cols": cols, "page": page})
    return soup, blocks


def find_filter(block):
    """A `jira-filter` property in a section-metadata alongside the tracker."""
    section = block.parent
    if not section:
        return None
    for sm in section.find_all("div", class_="section-metadata", recursive=False):
        for row in rows_of(sm):
            cells = cells_of(row)
            if cells and cells[0].get_text(strip=True).lower() == "jira-filter":
                return cells[1].get_text(" ", strip=True) if len(cells) > 1 else None
    return None


def cmd_keys(args):
    token = get_token()
    html, _ = fetch_source(args.path, token)
    _, blocks = parse(html)
    sections, all_keys = [], set()
    for i, b in enumerate(blocks):
        bi = b["cols"].get("block", 0)
        keys = set()
        for row in b["rows"]:
            cells = cells_of(row)
            if bi < len(cells):
                keys.update(KEY_RE.findall(cells[bi].get_text(" ", strip=True)))
        all_keys.update(keys)
        sections.append({
            "index": i,
            "heading": b["page"],
            "filter": find_filter(b["el"]),
            "keys": sorted(keys),
        })
    print(json.dumps({"sections": sections, "all_keys": sorted(all_keys)}, indent=2))


def cmd_fetch(args):
    token = jira_token()
    keys = args.args
    if not keys:
        html_src, _ = fetch_source(args.path, get_token())
        _, blocks = parse(html_src)
        ks = set()
        for b in blocks:
            bi = b["cols"].get("block", 0)
            for row in b["rows"]:
                cells = cells_of(row)
                if bi < len(cells):
                    ks.update(KEY_RE.findall(cells[bi].get_text(" ", strip=True)))
        keys = sorted(ks)
    out = {}
    for k in keys:
        url = f"{JIRA_API}/rest/api/2/issue/{k}?fields=summary,status,assignee,comment"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(req) as r:
                d = json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            out[k] = {"error": e.code}
            continue
        f = d["fields"]
        entry = {
            "summary": f.get("summary"),
            "status": f["status"]["name"],
            "assignee": f["assignee"]["displayName"] if f.get("assignee") else None,
        }
        comments = f.get("comment", {}).get("comments", [])
        prs = sorted({m for c in comments for m in PR_URL_RE.findall(c["body"])})
        if prs:
            entry["pr_urls"] = prs
        if comments:
            # Up to the 5 most recent comments, oldest-to-newest, for summarising.
            entry["comments"] = [
                {
                    "date": c["created"][:10],
                    "author": c["author"]["displayName"],
                    "body": clean_comment(c["body"])[:400],
                }
                for c in comments[-5:]
            ]
        out[k] = entry
    print(json.dumps(out, indent=2, ensure_ascii=False))


def set_cell(cell, html_str):
    cell.clear()
    if not html_str:
        return
    frag = BeautifulSoup(html_str, "html.parser")
    for node in list(frag.contents):
        cell.append(node)


def build_assignee(keys, enr):
    names = []
    for k in keys:
        n = (enr.get(k) or {}).get("assignee")
        if n and n not in names:
            names.append(n)
    return ", ".join(esc(n) for n in names)


def build_status(keys, enr):
    """Single derived cell: labelled Status / Latest update / PR lines."""
    parts = []
    segs = []
    for k in keys:
        e = enr.get(k)
        if e and e.get("status"):
            segs.append(f"{k}: {esc(e['status'])}" if len(keys) > 1 else esc(e["status"]))
    if segs:
        parts.append(f"<p><strong>Status:</strong> {'; '.join(segs)}</p>")

    best = None
    for k in keys:
        u = (enr.get(k) or {}).get("update")
        if not u:
            continue
        date = u[:10]
        tagged = u if len(keys) == 1 else f"{k}: {u}"
        if best is None or date > best[0]:
            best = (date, tagged)
    if best:
        parts.append(f"<p><strong>Latest update:</strong> {esc(best[1])}</p>")

    seen = set()
    for k in keys:
        for pr in (enr.get(k) or {}).get("prs", []):
            url = pr.get("url")
            if not url or url in seen:
                continue
            seen.add(url)
            parts.append(f"<p><strong>PR:</strong> {esc(url)} {esc(pr.get('state', ''))}".rstrip() + "</p>")
    return "".join(parts)


def read_status_cell(cell):
    """Parse an authored Status cell back into (status_text, {pr_url: state})."""
    status_text, prs = "", {}
    for p in cell.find_all("p", recursive=False):
        full = p.get_text(" ", strip=True)
        low = full.lower()
        if low.startswith("status:"):
            status_text = full.split(":", 1)[1].strip()
        elif low.startswith("pr:"):
            rest = full.split(":", 1)[1]
            m = PR_URL_RE.search(rest)
            if m:
                s = re.search(r"\b(open|merged|closed|draft)\b", rest, re.I)
                prs[m.group(0)] = s.group(1).lower() if s else ""
    return status_text, prs


def old_status_map(status_text, keys):
    out = {}
    segs = [s.strip() for s in status_text.split(";") if s.strip()]
    for seg in segs:
        m = re.match(r"([A-Z][A-Z0-9]+-\d+):\s*(.+)", seg)
        if m:
            out[m.group(1)] = m.group(2).strip()
    if not out and segs:
        for k in keys:
            out[k] = segs[0]
    return out


def capture_old(rows, cols):
    """Snapshot per-key status/assignee/PR state from existing rows (pre-refresh)."""
    bi, ai, si = cols.get("block", 0), cols.get("assignee"), cols.get("status")
    status_by, assignee_by, pr_by = {}, {}, {}
    for row in rows:
        cells = cells_of(row)
        if bi >= len(cells):
            continue
        keys = KEY_RE.findall(cells[bi].get_text(" ", strip=True))
        if not keys:
            continue
        if si is not None and si < len(cells):
            st, prs = read_status_cell(cells[si])
            status_by.update(old_status_map(st, keys))
            for k in keys:
                pr_by[k] = prs
        if ai is not None and ai < len(cells) and len(keys) == 1:
            a = cells[ai].get_text(" ", strip=True)
            assignee_by[keys[0]] = a if a and a != "—" else ""
    return status_by, assignee_by, pr_by


def _head(k, enr):
    """Linked Jira key + story title, e.g. '<a href=…>MWPW-1</a> Fix the thing'."""
    title = (enr.get(k) or {}).get("summary") or ""
    link = f'<a href="{JIRA_BROWSE}{esc(k)}" target="_blank" rel="noopener">{esc(k)}</a>'
    return f"{link} {esc(title)}".rstrip()


def compute_changes(old_status, old_assignee, old_pr, enr, scope, added=(), removed=()):
    """Returns one safe-HTML line per story (linked key + title), with all of that
    story's descriptions grouped together."""
    per = {}  # key -> [desc, ...] (dicts preserve insertion order)

    def add(k, desc):
        per.setdefault(k, []).append(desc)

    for k in added:
        st = (enr.get(k) or {}).get("status", "")
        add(k, "added" + (f" ({esc(st)})" if st else ""))
    for k in removed:
        e = enr.get(k) or {}
        st, asg = e.get("status"), e.get("assignee")
        detail = f" (now {esc(st)}" + (f", {esc(asg)}" if asg else "") + ")" if st else ""
        add(k, f"left the filter{detail}")
    for k in sorted(scope):
        e = enr.get(k) or {}
        ns = e.get("status")
        if ns and ns != old_status.get(k):
            add(k, f"status {esc(old_status.get(k) or '—')} → {esc(ns)}")
        na = e.get("assignee")
        if k in old_assignee and na and na != old_assignee.get(k):
            add(k, f"assignee {esc(old_assignee.get(k) or '—')} → {esc(na)}")
        oldp = old_pr.get(k, {})
        for pr in e.get("prs", []):
            url, state = pr.get("url") or "", pr.get("state", "")
            num = esc(url.rsplit("/", 1)[-1])
            if url and url not in oldp:
                add(k, f"PR #{num} added" + (f" ({esc(state)})" if state else ""))
            elif url and oldp.get(url) != state:
                add(k, f"PR #{num} {esc(oldp.get(url) or '—')} → {esc(state)}")
    return [f"{_head(k, enr)} — {'; '.join(descs)}" for k, descs in per.items()]


def changelog_section_html(entries_inner):
    """A section: a rich-content 'Changelog' heading + the changelog block."""
    return (
        '<div>'
        '<div class="rich-content"><div><div><h2>Changelog</h2></div></div></div>'
        f'<div class="jira-tracker-changelog">{entries_inner}</div>'
        '<div class="section-metadata"><div><div><p>style</p></div><div><p>container, fixed</p></div></div></div>'
        '</div>'
    )


def update_changelog(soup, changes):
    """Prepend a timestamped entry to the jira-tracker-changelog block (creating
    it at the bottom if absent); keep the newest 25 entries."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    # change lines from compute_changes are already-safe HTML (linked keys); the
    # create/retrofit callers pass plain, HTML-safe text.
    body = ("<ul>" + "".join(f"<li>{c}</li>" for c in changes) + "</ul>") if changes else "<p>No changes.</p>"
    entry = BeautifulSoup(f"<div><div><p>{ts}</p></div><div>{body}</div></div>", "html.parser").div
    block = soup.select_one(".jira-tracker-changelog")
    if block:
        block.insert(0, entry)
        for extra in rows_of(block)[25:]:
            extra.decompose()
        return
    main = soup.find("main")
    section = BeautifulSoup(changelog_section_html(""), "html.parser").div
    section.select_one(".jira-tracker-changelog").append(entry)
    meta = main.select_one(".metadata")
    if meta:
        target = meta
        while target.parent is not main:
            target = target.parent
        target.insert_before(section)
    else:
        main.append(section)


def rebuild_block(b, rows_spec, enr):
    """Replace a tracker block's data rows from rows_spec, preserving Notes by key."""
    block_el = b["el"]
    all_rows = rows_of(block_el)
    headcells = [c.get_text(strip=True) for c in cells_of(all_rows[0])]
    colkeys = [COLMAP.get(h.lower(), h.lower()) for h in headcells]
    bi = b["cols"].get("block", 0)
    ni = b["cols"].get("notes")
    notes_by_key = {}
    if ni is not None:
        for row in all_rows[1:]:
            cells = cells_of(row)
            if bi >= len(cells) or ni >= len(cells):
                continue
            authored = "".join(str(x) for x in cells[ni].contents).strip()
            if authored:
                for k in KEY_RE.findall(cells[bi].get_text(" ", strip=True)):
                    notes_by_key[k] = authored
    out = "<div>" + "".join(f"<div>{esc(h)}</div>" for h in headcells) + "</div>"
    for r in rows_spec:
        keys = r.get("keys", [])
        item = esc(r.get("summary", "")) + ("" if not keys else " " + " ".join(esc(k) for k in keys))
        by_role = {
            "block": item,
            "assignee": build_assignee(keys, enr),
            "notes": next((notes_by_key[k] for k in keys if k in notes_by_key), ""),
            "status": build_status(keys, enr),
        }
        cells = [by_role.get(colkeys[j], "") for j in range(len(headcells))]
        out += "<div>" + "".join(f"<div>{c}</div>" for c in cells) + "</div>"
    block_el.clear()
    for node in list(BeautifulSoup(out, "html.parser").contents):
        block_el.append(node)


def cmd_apply(args):
    with open(args.args[0]) as f:
        spec = json.load(f)
    # spec: {enrichment, rebuild:{"<section-index>":[rows]}}; or a flat enrichment map.
    if "enrichment" in spec or "rebuild" in spec:
        enr = spec.get("enrichment", {})
        rebuild_map = {str(k): v for k, v in spec.get("rebuild", {}).items()}
    else:
        enr, rebuild_map = spec, {}
    token = get_token()
    html, token = fetch_source(args.path, token)
    soup, blocks = parse(html)

    all_changes, updated, rebuilt = [], 0, 0
    for i, b in enumerate(blocks):
        cols = b["cols"]
        bi = cols.get("block", 0)
        old_status, old_assignee, old_pr = capture_old(b["rows"], cols)
        if str(i) in rebuild_map:
            rows_spec = rebuild_map[str(i)]
            old_keys = set()
            for row in b["rows"]:
                cells = cells_of(row)
                if bi < len(cells):
                    old_keys.update(KEY_RE.findall(cells[bi].get_text(" ", strip=True)))
            new_keys = {k for r in rows_spec for k in r.get("keys", [])}
            rebuild_block(b, rows_spec, enr)
            all_changes += compute_changes(old_status, old_assignee, old_pr, enr,
                                           new_keys & old_keys, new_keys - old_keys, old_keys - new_keys)
            rebuilt += 1
            updated += len(rows_spec)
        else:
            scope = set()
            for row in b["rows"]:
                cells = cells_of(row)
                if bi >= len(cells):
                    continue
                keys = KEY_RE.findall(cells[bi].get_text(" ", strip=True))
                if not keys or not any(k in enr for k in keys):
                    continue
                ai, si = cols.get("assignee"), cols.get("status")
                if ai is not None and ai < len(cells):
                    names = build_assignee(keys, enr)
                    if names:
                        set_cell(cells[ai], names)
                if si is not None and si < len(cells):
                    set_cell(cells[si], build_status(keys, enr))
                scope.update(k for k in keys if k in enr)
                updated += 1
            all_changes += compute_changes(old_status, old_assignee, old_pr, enr, scope)

    update_changelog(soup, all_changes)
    upload_source(args.path, str(soup), token)
    pstatus = trigger_preview(args.path, token)
    print(json.dumps({
        "rows_updated": updated,
        "sections_rebuilt": rebuilt,
        "changes_logged": len(all_changes),
        "preview_status": pstatus,
        "preview_url": f"https://main--{REPO}--{ORG}.aem.page{args.path}",
        "edit_url": f"https://da.live/edit#/{ORG}/{REPO}{args.path}",
    }, indent=2))


def jira_token():
    t = os.environ.get("JIRA_TOKEN")
    if not t:
        sys.exit("JIRA_TOKEN is not set. See the jira-integration skill (Adobe VPN required).")
    return t


def jira_get(path, token):
    req = urllib.request.Request(f"{JIRA_API}{path}", headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())


def jira_search(jql, token, maxr=200):
    from urllib.parse import quote
    d = jira_get(f"/rest/api/2/search?jql={quote(jql)}&fields=key&maxResults={maxr}", token)
    return [i["key"] for i in d.get("issues", [])]


def cmd_resolve(args):
    token = jira_token()
    q = " ".join(args.args).strip()
    tokens = [t for t in re.split(r"[,\s]+", q) if t]
    only_keys = bool(tokens) and all(KEY_RE.fullmatch(t) for t in tokens)
    if only_keys and len(tokens) == 1:
        k = tokens[0]
        itype = jira_get(f"/rest/api/2/issue/{k}?fields=issuetype", token)["fields"]["issuetype"]["name"]
        keys = jira_search(f'"Epic Link" = {k} ORDER BY key ASC', token) if itype.lower() == "epic" else [k]
    elif only_keys:
        keys = tokens
    else:
        keys = jira_search(q, token)
    print(json.dumps({"keys": keys}, indent=2))


def cmd_create(args):
    with open(args.args[0]) as f:
        spec = json.load(f)
    token = get_token()
    path = spec["path"]
    enr = spec.get("enrichment", {})
    col1 = spec.get("column1", "Ticket")
    grad = spec.get("background",
                    "linear-gradient(120deg,rgba(71, 71, 71, 1) 40%, rgba(128, 128, 128, 1) 100%)")

    head = "<div>" + "".join(f"<div>{esc(h)}</div>" for h in (col1, "Assignee", "Notes", "Status")) + "</div>"
    rows = ""
    for r in spec["rows"]:
        keys = r.get("keys", [])
        item = esc(r.get("summary", "")) + ("" if not keys else " " + " ".join(esc(k) for k in keys))
        cells = [item, build_assignee(keys, enr), "", build_status(keys, enr)]
        rows += "<div>" + "".join(f"<div>{c}</div>" for c in cells) + "</div>"

    eyebrow = f"<p>{esc(spec['eyebrow'])}</p>" if spec.get("eyebrow") else ""
    summary = f"<p>{esc(spec['summary'])}</p>" if spec.get("summary") else ""
    hero = (
        '<div><div class="rich-content dark"><div><div>'
        f"{eyebrow}<h1>{esc(spec['title'])}</h1>{summary}"
        '</div></div></div>'
        '<div class="section-metadata">'
        '<div><div><p>style</p></div><div><p>container, fixed, spacing lg</p></div></div>'
        f'<div><div><p>background</p></div><div><p>{grad}</p></div></div>'
        '</div></div>'
    )
    table = (
        '<div>'
        '<div class="jira-tracker-filter"><div><div>Filter</div></div></div>'
        f'<div class="jira-tracker">{head}{rows}</div>'
        '<div class="section-metadata"><div><div><p>style</p></div><div><p>container, fixed</p></div></div></div>'
        '</div>'
    )
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = f"<div><div><p>{ts}</p></div><div><p>Tracker created with {len(spec['rows'])} items.</p></div></div>"
    changelog = changelog_section_html(entry)
    meta = '<div><div class="metadata"><div><div><p>foundation</p></div><div><p>c2</p></div></div></div></div>'
    doc = f"<body><header></header><main>{hero}{table}{changelog}{meta}</main><footer></footer></body>"

    upload_source(path, doc, token)
    pstatus = trigger_preview(path, token)
    print(json.dumps({
        "created": path, "rows": len(spec["rows"]), "preview_status": pstatus,
        "preview_url": f"https://main--{REPO}--{ORG}.aem.page{path}",
        "edit_url": f"https://da.live/edit#/{ORG}/{REPO}{path}",
    }, indent=2))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", choices=["keys", "fetch", "resolve", "create", "apply"])
    ap.add_argument("args", nargs="*", help="apply/create: spec JSON path; fetch: optional Jira keys to scope to")
    ap.add_argument("--path", default="/drafts/ramuntea/tracking/wave3-tracker")
    args = ap.parse_args()
    if args.command == "keys":
        cmd_keys(args)
    elif args.command == "fetch":
        cmd_fetch(args)
    elif args.command == "resolve":
        cmd_resolve(args)
    elif args.command == "create":
        if not args.args:
            sys.exit("create requires a spec JSON path")
        cmd_create(args)
    else:
        if not args.args:
            sys.exit("apply requires a spec/enrichment JSON path")
        cmd_apply(args)


if __name__ == "__main__":
    main()
