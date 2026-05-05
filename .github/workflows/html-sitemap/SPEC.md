# HTML Sitemap Generator — Spec

## Summary

This document, together with [`html-sitemap.json`](https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json), defines the html-sitemap pipeline. The implementation derives from these two sources: behavior comes from this spec; data (subdomains, query-index paths, geo mappings, page copy) comes from the JSON config. Code reviews and behavior questions resolve against this spec; content questions resolve against the JSON.

Procedural questions — install, run, debug locally — are answered by [README.md](./README.md). The spec is evergreen: it describes behavior, not project status.

## 1. Introduction

The html-sitemap pipeline produces one human-readable HTML sitemap per locale on `www.adobe.com` and `business.adobe.com`. Output is generated from each subdomain's published query indices and the Adobe Federal global navigation, then uploaded to DA and shipped through standard AEM Live workflows.

### 1.1 Scope

In scope: `www.adobe.com` (CC consumer) and `business.adobe.com` (B2B). Other Adobe subdomains are out of scope.

### 1.2 Page model

Each rendered sitemap page has two sections:

1. **Base-geo links from GNAV** — organized by section/subheading, derived from the subdomain's GNAV structure
2. **Extended-geo links** — pages unique to extended geos that roll up under the base geo, grouped by extended-geo label

A base geo emits a sitemap page only when at least one configured query index returns indexable rows (see [§4.1](#41-page-emission-rule)).

### 1.3 Source models

Two source models share one pipeline interface:

- **`business`** — comparatively direct: sitemap is derived from a local GNAV plus one site family centered on `da-bacom`. Behaves like a single-site extraction problem.
- **`www`** — federated: GNAV comes from the Adobe Federal repo (not the page-hosting site), and query-index coverage spans several site families (`cc`, `da-cc`, `da-dc`, `da-events`, `da-express-milo`, `edu`). Behaves like a multi-source aggregation problem.

This is why the page-emission rule is phrased in terms of "at least one query index from any configured site" rather than assuming a single origin, and why GNAV resolution has fallback discovery rather than a fixed path per subdomain.

## 2. Config schema

The pipeline reads a multi-sheet JSON config. The four sheets and their fields are listed below. The JSON's actual values (current sites, geos, page copy) are owned by the data, not this spec — see the [live config](https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json) for current values.

### 2.1 `config` sheet

One row per pipeline target subdomain.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Short identifier for this pipeline target. Used as the output directory and the `--subdomain` CLI filter; matches subdomain values in other sheets. |
| `domain` | yes | Production hostname (`www.adobe.com`, `business.adobe.com`). Used as the absolute URL host for links in the rendered sitemap. |
| `site` | yes | Host repo / AEM Live site that owns the rendered sitemap.html. Resolves to `https://main--{site}--adobecom.aem.live` for origin URLs. |
| `extendedSitemap` | yes | Scope rule for extended-geo content. `language` includes only the extended geos mapped to each base geo in `geo-map`; `all` includes every extended geo in the subdomain. |
| `template` | no | DA template filename used by `transform-da`. Defaults to `da-sitemap.html`. |

### 2.2 `query-index-map` sheet

Per-subdomain aggregated query-index sources. Lets one subdomain pull pages from multiple host sites.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this query index applies to. |
| `site` | yes | Host site / repo whose query-index.json is fetched. Resolved against `https://main--{site}--adobecom.aem.live`. |
| `queryIndexPath` | yes | Path of the query-index JSON under the host site. Combined with the geo prefix at fetch time. |
| `enabled` | no | Whether this row participates in extraction. `true`/`1`/`yes`/`on` enables; empty or anything else disables. |
| `addHtmlExtension` | no | When truthy (`true`/`1`/`yes`/`on`), append `.html` to paths sourced from this index unless they already end in `.html` or are the root `/`. Use this for indexes whose `path` field omits the extension that the live URL serves (e.g. modern AEM da-* indexes). See [§4.3](#43-url-normalization). |

### 2.3 `geo-map` sheet

One row per `(subdomain, baseGeo)`. Declares the base geo's language, extended-geo assignments, and how far the pipeline deploys it.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this geo belongs to. |
| `baseGeo` | no | Geo code that owns its own sitemap.html. Empty for the default/root geo. |
| `language` | yes | ISO language code. Used to derive language qualifiers on extended-geo labels. |
| `extendedGeos` | no | Comma-separated list of extended geo codes whose unique pages roll up under this base geo. |
| `stage` | no | Deployment stage: `push`, `preview`, `publish`, or empty. Case-insensitive. |
| `note` | no | Free-form editorial notes. Not consumed by the pipeline. |

`stage` is the maximum stage the pipeline reaches for a geo:

- empty — extract and transform only; no DA upload, no AEM preview, no AEM publish
- `push` — also upload to DA
- `preview` — also trigger AEM preview
- `publish` — also trigger AEM publish

All geos are extracted and transformed regardless of `stage`; only the delivery stages gate on it.

### 2.4 `page-copy` sheet

One row per `(subdomain, geo)`. Provides the geo label and localized page title.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this row applies to. |
| `geo` | no | Geo code. Matches a `baseGeo` or `extendedGeo` from `geo-map`. Empty for the default/root sitemap. |
| `label` | no | Human-readable region label shown as the heading for that geo's extended-geo group. A trailing ` - <language>` qualifier is stripped at render time. |
| `pageTitle` | no | Localized H1 and HTML `<title>`. Defaults to `Sitemap` when empty or row is missing. May contain `{{placeholders}}` resolved from the extracted placeholder map. |

For backward compatibility, a `baseGeo` cell is read as `geo` when `geo` is absent.

## 3. Pipeline stages

The atomic stage ids are `clean`, `extract`, `transform-data`, `transform-da`, `diff`, `push`, `preview`, `publish`. The CLI may expose shortcuts but behavior is defined in terms of these atomic stages.

Dependencies are enforced by the generator, not by a metadata schema:

- `transform-data` depends on eligible extracted input
- `transform-da` depends on `sitemap.json`
- `diff`, `push`, `preview`, `publish` depend on local `sitemap.html`
- `diff`, `push`, `preview`, `publish` also depend on `--da-root`

Each stage prints a per-(subdomain, baseGeo) summary on the geos it acted on.

### 3.1 `extract`

Reads:
- config from `--config`
- remote GNAV fragments and placeholders
- per-(site, geo) query-index pages

Writes:
- `html-sitemap.json` — local copy of the resolved config
- `_extract/gnav/*.html` and `_extract/gnav/manifest.json`
- `_extract/placeholders.json`
- `_extract/**/query-index.json` — per-(site, geo)
- `_extract/**/_meta.json` — provenance sidecar (origin URL per fetched query-index)

Behavior:
- a base geo gets a local output folder only if it satisfies the page emission rule ([§4.1](#41-page-emission-rule))
- extended-geo query indices are written under the owning base geo's `_extract/extended/<geo>/<site>/`
- paginated query-index responses are fully fetched ([§4.5](#45-query-index-fetch-and-pagination))
- missing remote resources warn and continue (best-effort)

GNAV resolution order:
1. local `/{geo}/gnav` on the subdomain's host site
2. federal fallback GNAV when the local GNAV is unavailable

For localized geos, discovered GNAV fragment paths inherit the geo prefix.

### 3.2 `transform-data`

Reads:
- previously extracted `_extract` artifacts for each eligible base geo

Writes:
- `sitemap.json` — normalized render contract for one sitemap page (see [§5.1](#51-sitemapjson))
- `sitemap-links.csv` — flat audit view (see [§5.2](#52-sitemap-linkscsv))

Behavior:
- runs only for base geos with eligible extracted input
- resolves placeholder tokens using extracted placeholders ([§4.4](#44-placeholder-resolution))
- normalizes query-index titles ([§4.6](#46-title-cleanup))
- preserves the pre-cleanup value as `originalTitle` on every link
- derives fallback titles from URL slugs when titles are empty
- collapses intra-geo `cc`/`da-*` duplicates ([§4.7](#47-extended-geo-intra-geo-collapsing))
- resolves extended-geo group titles from `page-copy.label` ([§4.8](#48-geo-label-resolution))

### 3.3 `transform-da`

Reads:
- `sitemap.json`
- the DA template (default `templates/da-sitemap.html`; overridable via `config.template`)

Writes:
- `sitemap.html` — DA-compatible HTML source document (see [§5.3](#53-sitemaphtml))
- `manifest.json` and `manifest.csv` per subdomain (see [§5.4](#54-manifestjson--manifestcsv))

Behavior:
- output is plain HTML source, not a DA-specific JSON format
- render semantics come from `sitemap.json` plus the DA page shell
- page copy comes from `page-copy`, with `{{placeholders}}` resolved against the extracted placeholder map
- template syntax: see [README → Template Language](README.md#template-language)
- the manifest is deterministic (no timestamps), supporting cross-run diffing

### 3.4 `diff`

Read-only comparison of local `sitemap.html` against remote DA. Useful as a dry-run companion to `push`.

Reads:
- local `sitemap.html`
- remote DA source document at the corresponding `--da-root` path

Writes:
- nothing

Behavior:
- requires `--da-root` and DA auth
- skips geos with no local `sitemap.html`
- skips geos whose `stage` does not reach `push` (i.e. empty stage)
- compares SHA-256 hashes; reports per-geo `changed`, `unchanged`, or `new`
- a missing remote document is reported as `new`, not as an error

### 3.5 `push`

Uploads local `sitemap.html` to DA.

Reads:
- local `sitemap.html`
- remote DA source document (for change detection)

Writes:
- remote DA source document rooted at `--da-root`
- DA edit URLs in stage output

Behavior:
- requires `--da-root` and DA auth
- skips geos with no local `sitemap.html`
- skips geos whose `stage` does not reach `push`
- compares local content hash against remote; skips unchanged uploads to preserve remote `lastModified`
- `--force` bypasses change detection

DA upload contract:
- `POST https://admin.da.live/source/{org}/{repo}/{path}` with `multipart/form-data` body containing a `data` field as a `text/html` blob
- DA auto-creates intermediate folders; no explicit folder creation is needed
- `GET /source/{org}/{repo}/{path}` is used for change detection
- Edit URLs follow the pattern `https://da.live/edit#/{org}/{repo}/{path}`

### 3.6 `preview`

Triggers AEM preview for pushed pages.

Reads:
- local `sitemap.html` to determine eligible geos

Writes:
- AEM preview state for the corresponding `--da-root` path
- `.page` URLs in stage output

Behavior:
- requires `--da-root` and AEM admin auth
- skips geos with no local `sitemap.html`
- skips geos whose `stage` does not reach `preview` (i.e. empty or `push`)

### 3.7 `publish`

Triggers AEM publish for previewed pages.

Reads:
- local `sitemap.html` to determine eligible geos

Writes:
- AEM live state for the corresponding `--da-root` path
- `.live` URLs in stage output

Behavior:
- requires `--da-root` and AEM admin auth
- skips geos with no local `sitemap.html`
- skips geos whose `stage` is not `publish`

AEM promotion contract (used by both `preview` and `publish`):
- `POST https://admin.hlx.page/{preview|live}/{org}/{repo}/{ref}/*` with body `{ paths, forceUpdate: true }`
- Auth header format: `token {value}` (not `Bearer`)
- Job status polled at `links.self` (append `/details` if needed); 2s interval, up to 30 attempts (60s total)
- Job complete when `stopTime` is present
- Per-resource statuses 200 and 204 are treated as success
- Preview URLs: `https://main--{repo}--adobecom.aem.page/{path}`
- Publish URLs: `https://main--{repo}--adobecom.aem.live/{path}`

## 4. Behavior rules

### 4.1 Page emission rule

A base geo emits sitemap output only when at least one base-geo query index from any configured site returns indexable rows. If all configured query indices for a base geo:

- 404
- fail in a skippable way
- or return no indexable rows

then that base geo emits no sitemap page. This rule controls both whether a base-geo local output folder exists after `extract`, and whether downstream stages have anything to act on.

### 4.2 Query-index row selection

- Each row's source URL is read from the `path` field; falls back to `url` when `path` is absent.
- Rows where `robots` contains `noindex` or `nofollow` are excluded (either substring triggers exclusion, case-insensitive).

### 4.3 URL normalization

All URLs in sitemap output are canonical production URLs:

- Relative paths (`/foo`) resolve to `https://{domain}/foo` using the subdomain's production domain.
- AEM repo hosts (`main--{site}--adobecom.aem.live`) remap to the production domain for that site using the `siteDomains` mapping derived from config.
- Other absolute URLs pass through unchanged.

When the source `query-index-map` row has `addHtmlExtension` enabled, paths are suffixed with `.html` after the steps above. The suffix is skipped when the path already ends in `.html` or is the root `/`. Both `path` and `url` reflect the suffixed value; `originalPath` preserves the path as parsed from the source row before this step (see [§5.2](#52-sitemap-linkscsv) and the link shape in [§5.1](#51-sitemapjson)).

### 4.4 Placeholder resolution

Placeholders use the pattern `{{key}}`:

- Pattern: `\{\{([^}]+)\}\}` with the key trimmed before lookup.
- Unresolved placeholders (no matching key) pass through verbatim.
- Applied to: GNAV headings, GNAV link text and hrefs, `page-copy` strings.

### 4.5 Query-index fetch and pagination

The fetch and merge algorithm for paginated query-index responses:

1. First page is fetched at `https://main--{site}--adobecom.aem.live/{geo}{queryIndexPath}`.
2. If the response lacks a `data` array, it is treated as success with zero indexable rows.
3. `total` defaults to the first-page data length when absent.
4. `limit` (page size) defaults to the first-page data length when absent or zero.
5. Next-page offset = current offset + rows received; falls back to page size when zero rows are returned.
6. The loop continues while merged row count < `total`.
7. The loop breaks on: HTTP error (returns error, not partial data), non-paged response body, or empty data array.
8. The merged result preserves first-page metadata with `data` replaced by the full merged array.

Retry policy (used for all extraction fetches):

- Up to 2 retries (3 total attempts)
- Retryable status codes: 429, 500, 502, 503, 504
- Backoff: 250ms × 2^attempt (250ms, 500ms)
- Network errors are retried with the same policy
- Non-retryable failures (4xx other than 429) return immediately

### 4.6 Title cleanup

Both query-index and GNAV link titles are passed through a `cleanTitle` step that strips trailing Adobe branding while preserving legitimate subtitles.

Algorithm:

1. Locate the last title-segment delimiter (`|`, `-`, en-dash `–`, or em-dash `—`) that has whitespace on both sides — a true delimiter, not a hyphen inside a word like `co-creation`.
2. If "adobe" (case-insensitive) appears anywhere in the substring from that delimiter to the end of the title, strip from the delimiter onward.
3. Otherwise the title is returned unchanged (whitespace collapsed and trimmed).

The pre-cleanup value is preserved on each link as `originalTitle`. When no cleanup occurred, `originalTitle` equals `title`. This field appears in both `sitemap.json` and `sitemap-links.csv`.

See [Appendix A.1](#a1-title-cleanup) for worked input/output examples.

### 4.7 Extended-geo intra-geo collapsing

Extended-geo entries are NOT deduplicated against the base geo. A page that exists at both `/fr/foo` and `/lu_fr/foo` appears in both the base-geo section and under the corresponding extended-geo group.

Within a single extended geo:

1. Across site families (`cc`, `da-cc`, `da-dc`, etc.) collapse entries that resolve to the same canonical path after stripping a trailing `.html`. Prefer the `da-*` variant when both legacy `cc` and modern `da-*` rows exist.
2. Drop entries whose canonical path was already seen in that geo (after step 1, with the geo prefix stripped).

See [Appendix A.2](#a2-extended-geo-intra-geo-collapsing) for worked examples.

### 4.8 Geo label resolution

Section 2 (extended-geo) groups need a display label per geo. Resolution order:

1. **`page-copy.label`**: if a row in `page-copy` matches the geo, use its `label` after stripping any trailing ` - <language>` suffix (regex: `\s+-\s+.+$`).
2. **Inventory-aware fallback**: when no `page-copy.label` is present, use `Intl.DisplayNames` with locale `en`:
   - Split the geo on `_` to get region and optional language.
   - Format the region as a display name (e.g. `fr` → `France`, `be` → `Belgium`).
   - Append the language only when the same region appears in multiple geo variants within the subdomain (e.g. `be_en` and `be_fr` both exist, so `Belgium (english)` and `Belgium (français)`); otherwise omit it.
3. **Empty/root geo**: always `Global`.

See [Appendix A.3](#a3-geo-label-resolution) for worked examples.

### 4.9 GNAV link extraction

GNAV section HTML contributes to section 1. Not every `<a>` element becomes a sitemap link.

A link is included only when it appears inside one of these structural contexts:

- an ancestor element with class `.link-group`
- an `<li>` ancestor
- a direct child of `<p>` or `<strong>`

Hrefs skipped during link grouping:

- `#_inline` and `bookmark://` references
- decorative asset hrefs matching image extensions (`.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`)

Subheading grouping algorithm:

1. Each heading (`h1`–`h6`) starts a new group with the heading text as `subheading`.
2. Links following a heading are collected into that group until the next heading.
3. Groups with zero links after exclusion are dropped.
4. If a GNAV section has inline-column children (recorded in `manifest.json`), those inline-column files are parsed instead of the parent section file.

Placeholders are resolved in both heading text and link text/hrefs before grouping.

## 5. Output contracts

### 5.1 `sitemap.json`

Normalized intermediate data for one sitemap page. Written by `transform-data`, consumed by `transform-da`. Defines the render contract.

Shape:

```json
{
  "subdomain": "business",
  "baseGeo": "",
  "domain": "business.adobe.com",
  "sections": {
    "baseGeoLinks": [
      {
        "heading": "Products",
        "groups": [
          {
            "subheading": "Featured",
            "links": [{
              "title": "Adobe Commerce",
              "originalTitle": "Adobe Commerce",
              "url": "https://business.adobe.com/products/commerce",
              "path": "/products/commerce",
              "originalPath": "/products/commerce"
            }]
          }
        ]
      }
    ],
    "extendedGeoLinks": [
      {
        "geo": "br",
        "title": "Brazil",
        "links": [{
          "title": "Adobe Firefly",
          "originalTitle": "Adobe Firefly | Adobe",
          "url": "https://business.adobe.com/br/products/firefly.html",
          "path": "/br/products/firefly.html",
          "originalPath": "/br/products/firefly",
          "originUrl": "https://main--da-bacom--adobecom.aem.live/br/query-index.json"
        }]
      }
    ]
  }
}
```

| Section | Structure |
|---------|-----------|
| `baseGeoLinks` | Array of GNAV sections, each with a `heading` and `groups[]` of `{ subheading, links[] }`. |
| `extendedGeoLinks` | Array of `{ geo, title, links[] }` groups for extended-geo pages. |

Each `link` has:

- `title` — cleaned title
- `originalTitle` — raw title before [§4.6](#46-title-cleanup) cleanup; equals `title` when no cleanup occurred
- `url` — canonical production URL (reflects `addHtmlExtension` if applied)
- `path` — final URL pathname (reflects `addHtmlExtension` if applied)
- `originalPath` — pathname as parsed from the source row, before any [§4.3](#43-url-normalization) html-suffix manipulation; equals `path` for GNAV links and for query-index rows that did not have `addHtmlExtension` applied
- `originUrl` (optional) — provenance: the GNAV fragment or query-index URL the link was extracted from

### 5.2 `sitemap-links.csv`

Flat audit view of every link in `sitemap.json`. Written alongside `sitemap.json` by `transform-data`. Intended for stakeholder review and content auditing.

Columns: `type`, `heading`, `title`, `originalTitle`, `url`, `path`, `originalPath`, `originUrl`.

- `type`: `base` or `extended`
- `heading`: for base, `<sectionHeading> > <subheading>`; for extended, the geo-group title

### 5.3 `sitemap.html`

DA-compatible HTML source document for one sitemap page. Written by `transform-da`, consumed by `push`/`preview`/`publish`.

Expected shell:

```html
<body>
  <header></header>
  <main>...</main>
  <footer></footer>
</body>
```

Section rendering contract:

- Section 1: grouped navigation links rendered as a multi-column layout
- Section 2: grouped extended-geo links rendered as an expandable or otherwise compact grouped layout

The rendered HTML includes `data-*` attributes on iterated elements for monitoring and programmatic access:

| Attribute | Location | Value |
|-----------|----------|-------|
| `data-section-index` | GNAV section container | Zero-based section index |
| `data-link-index` | Individual `<a>` elements within sections and extended-geo groups | Zero-based link index within its parent loop |
| `data-group-index` | Extended-geo group container | Zero-based group index |

These attributes are stable for the same inputs.

Page-copy contract:
- H1 defaults to `Sitemap`
- metadata `title` rendered from `pageTitle`
- metadata `description` authored literally in the DA template
- metadata `locale` rendered from the current base geo (root → `global`)
- `pageTitle` may contain `{{placeholders}}` resolved against the extracted placeholder map

### 5.4 `manifest.json` / `manifest.csv`

Per-subdomain build manifest summarizing every generated page. Written by `transform-da` at `{subdomain}/manifest.json` and `{subdomain}/manifest.csv`.

Determinism: identical extracted inputs must produce an identical manifest. The manifest contains no timestamps. This enables cross-run diffing — a hash change means the page changed; a missing or new entry means a page was removed or added.

Shape:

```json
{
  "subdomain": "business",
  "pageCount": 11,
  "pages": [
    {
      "baseGeo": "",
      "domain": "business.adobe.com",
      "stage": "publish",
      "sha256": "a1b2c3d4...",
      "baseGeoSectionCount": 6,
      "baseGeoLinkCount": 42,
      "extendedGeoGroupCount": 3,
      "extendedGeoLinkCount": 15,
      "totalLinkCount": 57
    }
  ]
}
```

Page entry fields:

| Field | Meaning |
|-------|---------|
| `baseGeo` | Geo code (empty string = root) |
| `domain` | Production domain |
| `stage` | Deployment stage from `geo-map` |
| `sha256` | SHA-256 of the `sitemap.html` UTF-8 bytes |
| `baseGeoSectionCount` | Number of GNAV navigation sections (section 1 groups) |
| `baseGeoLinkCount` | Total links across all section 1 groups |
| `extendedGeoGroupCount` | Number of extended-geo groups (section 2) |
| `extendedGeoLinkCount` | Total links across all section 2 groups |
| `totalLinkCount` | Sum of all link counts |

Pages are sorted by `baseGeo`. Pages skipped (no `sitemap.html`) are excluded.

The CSV is a flat mirror of the pages array, with the same sort order.

## 6. Conformance

Tests validate the implementation against this spec at three levels.

1. **Unit tests.** Cover the generator's internal behavior: query-index normalization, title cleanup ([§4.6](#46-title-cleanup)), geo label resolution ([§4.8](#48-geo-label-resolution)), intra-geo collapsing ([§4.7](#47-extended-geo-intra-geo-collapsing)), GNAV parsing ([§4.9](#49-gnav-link-extraction)), configuration loading. Run under the `node:test` harness with no network access. Live in `test/`.
2. **Stage tests.** Cover stage-level inputs and outputs against in-process fixtures: an extract step against a stubbed fetcher, a transform step against pre-extracted artifacts. Asserts `sitemap.json` and `sitemap-links.csv` shape and content. Live in `test/stages/`.
3. **End-to-end runs.** Manual today: run the full pipeline against the live config (`node generate.js extract,transform,push,preview,publish --subdomain www --da-root /drafts/...`), then verify the rendered preview/live URLs match the expected page-emission set. Future automation pending.

## 7. Alternatives considered

Decisions whose rejected paths are worth recording so the rationale doesn't have to be rediscovered.

### 7.1 Base/extended deduplication (removed)

**Considered:** Drop any extended-geo entry whose canonical path also exists in the base geo's query-indices, on the theory that the base section already surfaces the page.

**Rejected:** Site families with high URL parity between base and extended geos (notably `da-dc`/Acrobat) had 100% of their extended-geo entries dropped, silently zeroing out an entire class of content from extended sections. Stakeholders cannot tell the difference between "no DC content for this geo" and "all DC content was deduped away," and the dedup hid the latter case.

**Current behavior:** Extended-geo entries are kept regardless of base-geo overlap. Same-page duplication between base and extended sections is acceptable and intentional. Intra-geo collapsing is preserved (see [§4.7](#47-extended-geo-intra-geo-collapsing)).

### 7.2 Federal as the GNAV source for `www`

**Considered:** Pull `www`'s GNAV from the page-hosting site (`da-cc`) rather than the Adobe Federal repo.

**Rejected:** `www`'s navigation is composed federally — section menus, fragments, and placeholders all live under `federal/globalnav/acom/...` and are shared across multiple page-hosting sites. Pulling from `da-cc` would either duplicate the federal structure inside `da-cc` (creating two sources of truth) or be incomplete. `business`, by contrast, has a local GNAV in `da-bacom` and uses that path; the pipeline supports both.

**Current behavior:** GNAV resolution tries the local path first, then federal as fallback. For `www` the federal path is the practical primary source.

### 7.3 `stage` as a string vs. `deploy` as a boolean

**Considered:** A boolean `deploy` field controlling whether to push/preview/publish a geo (the original schema).

**Rejected:** A boolean conflates three distinct decision points (push, preview, publish) into one all-or-nothing flag. Editors needed finer control — e.g., push to DA for review without publishing yet, or stage in preview before promoting to publish.

**Current behavior:** `stage` is a string with values `push`, `preview`, `publish`, or empty. Each value is the maximum stage the pipeline reaches; `preview` implies `push`, `publish` implies `preview`.

### 7.4 `page-copy.geo` vs. `page-copy.baseGeo`

**Considered:** Keep the original `baseGeo` column name in `page-copy`.

**Rejected:** `page-copy` rows are not limited to base geos — extended-geo labels (e.g. `lu_fr`) are also looked up there. The original `baseGeo` name implied a tighter binding to `geo-map` rows than the actual semantics.

**Current behavior:** Column is named `geo`. For backwards compatibility, a `baseGeo` cell is read as `geo` when `geo` is absent.

### 7.5 Schema sheet inside `html-sitemap.json`

**Considered:** Embed a `schema` sheet in the live config JSON describing the column semantics of every other sheet, so editors see field docs co-located with the data.

**Rejected:** Documentation in spreadsheet form is shape-mismatched (one short cell per field; no formatting; no cross-references), and maintaining it as a second source of truth alongside this spec creates drift the moment any field changes. Editors mostly need procedural guidance ("how do I add a geo"), not field-by-field docs.

**Current behavior:** This spec is the single source of truth for config schema. Editor-facing guidance lives in README and in any DA-side help cells linking back here.

## Appendix A. Worked examples

### A.1 Title cleanup

Input → output for the [§4.6](#46-title-cleanup) algorithm:

| Input | Output | Why |
|-------|--------|-----|
| `Premiere Pro - Adobe` | `Premiere Pro` | Last ` - ` followed by "Adobe"; strip from delimiter |
| `Acrobat Pro - DC \| Adobe` | `Acrobat Pro - DC` | Last ` \| ` is the rightmost delimiter; trailing has "Adobe"; only that segment removed |
| `My Page \| adobe.com` | `My Page` | Last ` \| ` followed by "adobe.com"; "adobe" matches case-insensitive |
| `Solution de vectorisation – Adobe Illustrator` | `Solution de vectorisation` | En-dash treated as delimiter |
| `My Page — Adobe Substance 3D` | `My Page` | Em-dash treated as delimiter |
| `Mon site \| Adobe France` | `Mon site` | Localized branding suffix |
| `Tutorials - Pro Tips` | `Tutorials - Pro Tips` | No "adobe" in trailing segment; preserved |
| `co-creation studio` | `co-creation studio` | Hyphen has no surrounding whitespace; not a delimiter |
| `JPEG vs PNG : qu'est-ce qui les différencie ?` | `JPEG vs PNG : qu'est-ce qui les différencie ?` | No `\|`/`-`/dash delimiter at all |
| `Adobe Photoshop` | `Adobe Photoshop` | No delimiter; preserved |

### A.2 Extended-geo intra-geo collapsing

For an extended geo `lu_fr` with rows from both `cc` and `da-cc`:

Input (raw extracted query indices):

| Site | Path |
|------|------|
| `cc` | `/lu_fr/products/photoshop.html` |
| `da-cc` | `/lu_fr/products/photoshop` |
| `cc` | `/lu_fr/products/legacy-only.html` |
| `da-cc` | `/lu_fr/products/firefly` |

After [§4.7](#47-extended-geo-intra-geo-collapsing) collapsing:

| Path kept | Source preferred |
|-----------|------------------|
| `/lu_fr/products/photoshop` | `da-cc` (modern preferred over legacy) |
| `/lu_fr/products/legacy-only.html` | `cc` (no `da-cc` variant) |
| `/lu_fr/products/firefly` | `da-cc` |

### A.3 Geo label resolution

For a `geo-map` where the `www` subdomain has bases including `fr`, `be_fr`, `be_en`, `vn_vi`:

| Geo | `page-copy.label` present? | Resolved label | Why |
|-----|----------------------------|----------------|-----|
| `fr` | yes (`France`) | `France` | Direct lookup |
| `be_fr` | yes (`Belgique - Français`) | `Belgique` | ` - <language>` suffix stripped |
| `be_en` | no | `Belgium (english)` | Inventory-aware fallback; `be` has multiple variants, so language qualifier added |
| `vn_vi` | no | `Vietnam` | Inventory-aware fallback; only one variant, so no qualifier |
| `` (empty) | n/a | `Global` | Root geo |
