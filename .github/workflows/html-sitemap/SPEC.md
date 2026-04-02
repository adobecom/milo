# HTML Sitemap Generator — Spec

Design, architecture, and source-of-truth data for the HTML sitemap generator.

See [README.md](./README.md) for CLI usage, setup, and GitHub Actions workflow inputs.

## Why

Crawlers (Googlebot, Bingbot) and LLM agents need a navigable, indexable entry point to discover all pages across Adobe's international sites. Without one, bots rely on XML sitemaps alone, which lack human-readable context and titles.

This work is especially important alongside **Project Lingo**, which is consolidating Adobe's country-first site structure into a language-first model. Google has been dropping ~20% of local pages due to content duplication across geos. Lingo reduces the indexable footprint; these HTML sitemaps ensure the remaining pages are explicitly surfaced for discovery, consolidating SEO value in the pages that matter.

**Who it serves**: Googlebot and search engine crawlers, LLM agents, and humans who navigate to these pages directly.

## Terminology

| Term | Definition |
|------|-----------|
| **Geo** | A region/locale (e.g. `fr`, `be_en`, `ch_fr`) |
| **Base Geo** | Primary region/locale with a dedicated `sitemap.html` page |
| **Extended Geo** | Secondary region/locale whose pages surface inside a base geo's page; no dedicated sitemap page |

## Requirements

- **Performance**: Pages must be fast. Googlebot penalizes slow pages, and slow CrUX scores defeat the purpose. Humans may also visit.
- **Full automation**: Authors must not be required to author or maintain anything that can be automated. Pages are generated entirely from live data sources -- no manual curation, no spreadsheets to maintain, no per-geo authoring.
- **Lingo compatibility**: As Lingo rolls out in phases (French first), sitemap pages will need updating based on which query indices are available at the time.
- **Static production URLs**: Generated pages contain hardcoded production URLs. Client-side JavaScript rewrites URLs in non-production environments.
- **Monitoring**: Both the generation process and the resulting pages will be monitored.

## Page Structure

Each generated sitemap page has three stacked sections:

```mermaid
graph TD
    subgraph page["sitemap.html"]
        direction TB
        S1["<b>Base Geo Links</b><br/><br/><small>Product & feature links from the global navigation</small>"]
        S2["<b>Other Sitemap Links</b><br/><br/><small>Cross-links to every other locale's sitemap</small>"]
        S3["<b>Extended Geo Links</b><br/><br/><small>Region-specific pages unique to extended geos</small>"]
        S1 ~~~ S2 ~~~ S3
    end
```

### Section 1: Base Geo Links

The main event. Product and feature links organized by category -- the same structure visitors see in the site's global navigation, flattened into a browsable list. Section headings (H3) group top-level categories like "Creativity & Design" or "Products"; sub-headings (H4) break them into groups like "Featured products" or "Online tools".

Sourced from GNAV fragments -- see [GNAV Sources](#gnav-sources) and [Content Rendering Rules](#content-rendering-rules).

### Section 2: Other Sitemap Links

A flat list of links to every other base geo's `sitemap.html` in the same domain (the current page is excluded). This is how crawlers and humans hop between localized sitemaps.

Auto-generated from the [geo map](#geo-map) -- no authoring required.

### Section 3: Extended Geo Links

Pages that only exist in extended geos, grouped by region (e.g. "Belgium (fr)", "Canada (fr)"). If an extended geo URL shares a path with something already in the base geo's index, it's dropped -- only genuinely unique content shows up here.

Sourced from query index JSON files -- see [Query Index Sources](#query-index-sources).

## Scope

Each of Adobe's two primary subdomains gets its own set of HTML sitemaps. Each base geo within a subdomain gets a localized sitemap page.

| Subdomain | DA Host |
|---|---|
| business.adobe.com | [da-bacom](https://da.live/sheet#/adobecom/da-bacom/) |
| www.adobe.com | [da-cc](https://da.live/sheet#/adobecom/da-cc/) |

Output pages: `https://{subdomain}/sitemap.html` and `https://{subdomain}/{baseGeo}/sitemap.html` for each base geo with indexable content.

### Query Index Sources

Each site contributes a query index per geo. The generator fetches `/{geo}/{queryIndexPath}` from each site.

Out of scope for www: `genuine` (only in-app) and `upp` (only homepage).

Note: cc is missing `title, robots`.

```tsv
domain	site	queryIndexPath
business	da-bacom	/query-index.json
www	cc	/cc-shared/assets/query-index.json
www	da-cc	/cc-shared/assets/query-index.json
www	da-dc	/dc-shared/assets/query-index.json
www	da-events	/events/query-index.json
www	da-express-milo	/express/query-index.json
www	edu	/edu-shared/assets/query-index.json
```

### Geo Map

Each row defines a base geo and its extended geos. Extended geos share the base geo's language -- their pages appear on the base geo's sitemap. Not every extended geo will have a query index for every site -- the generator warns and continues on 404.

A sitemap page is only generated for a base geo when **at least one query index from any site returns indexable URLs** for that geo. If all indices for a base geo are 404 or contain no indexable URLs (e.g. all pages are noindex/nofollow), the page is skipped. This means new geos automatically get sitemap pages the moment content is published, and empty geos are never produced.

```tsv
domain	baseGeo	language	extendedGeos
business		en
business	au	en
business	de	de
business	fr	fr
business	in	en
business	it	it
business	jp	ja
business	kr	ko
business	pt	pt
business	sp	es	es
business	uk	en
www		en	ae_en, africa, be_en, ca, cis_en, cy_en, eg_en, gr_en, hk_en, id_en, ie, il_en, kw_en, lu_en, mena_en, mt, my_en, ng, nz, ph_en, qa_en, sa_en, sg, th_en, vn_en, za
www	ara	ar	ae_ar, eg_ar, kw_ar, mena_ar, qa_ar, sa_ar
www	au	en
www	az	az
www	bg	bg
www	bn	ms
www	br	pt
www	cn	zh	hk_zh, tw
www	cz	cs
www	de	de	at, ch_de, lu_de
www	dk	da
www	ee	et
www	el	el	gr_el
www	es	es	ar, cl, co, cr, ec, gt, la, mx, pe, pr
www	fi	fi
www	fr	fr	be_fr, ca_fr, ch_fr, lu_fr
www	hr	hr
www	hu	hu
www	hy	hy
www	id_id	id
www	il_he	he
www	in	en
www	in_hi	hi
www	it	it	ch_it
www	jp	ja
www	kr	ko
www	lt	lt
www	lv	lv
www	my_ms	ms
www	nl	nl	be_nl
www	no	no
www	ph_fil	fil
www	pl	pl
www	pt	pt
www	ro	ro
www	ru	ru	cis_ru
www	se	sv
www	si	sl
www	sk	sk
www	sr	sr
www	th_th	th
www	tr	tr
www	ua	uk
www	uk	en
www	vn_vi	vi
www	zh	zh
```

## Architecture

### Data Sources

1. **Sitemap Config** (source of truth for this generator):
   Query index sources and geo maps defined in the [Scope](#scope) section above. Will eventually be backed by a DA spreadsheet.

2. **GNAV Fragments** (section headings and link groupings):
   The global navigation provides localized section headings and categorized product/page links. Each subdomain sources its GNAV differently. See [GNAV Sources](#gnav-sources) for the full mapping.

3. **GNAV Placeholders** (localized UI strings):
   The GNAV fragments use `{{placeholder}}` tokens for certain link labels (e.g. `{{premiere}}` resolves to "Premiere"). These are resolved via the federal globalnav placeholders:
   [`/federal/globalnav/placeholders.json`](https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json) (English) |
   [`/fr/federal/globalnav/placeholders.json`](https://main--federal--adobecom.aem.live/fr/federal/globalnav/placeholders.json) (French example)
   No additional placeholder keys are needed beyond what the GNAV already uses.

4. **Query Index JSON** (per site, per geo):
   Provides localized URLs and page titles for each region, as well as robots tag.
   URL pattern: `https://main--{repo}--adobecom.aem.live/{geo}/{query-index-path}`

### GNAV Sources

The two subdomains use different GNAV structures and origins.

#### business.adobe.com (da-bacom)

**Source**: Local GNAV in the [da-bacom](https://github.com/adobecom/da-bacom) repo.

| Fragment | Path | Content |
|---|---|---|
| Top-level GNAV | [`/gnav`](https://main--da-bacom--adobecom.aem.live/gnav.plain.html) | Flat list of `<a>` links to section fragments |
| Products | [`/fragments/gnav/products`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/products.plain.html) | 28 links: product pages |
| AI | [`/fragments/gnav/ai`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/ai.plain.html) | 19 links: AI features and solutions |
| Industries | [`/fragments/gnav/industries`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/industries.plain.html) | 17 links: industry verticals |
| Roles | [`/fragments/gnav/roles`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/roles.plain.html) | 19 links: persona/role pages |
| Resources | [`/fragments/gnav/resources`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/resources.plain.html) | 15 links: blog, reports, events |
| Support | [`/fragments/gnav/support`](https://main--da-bacom--adobecom.aem.live/fragments/gnav/support.plain.html) | 14 links: help, services, docs |

All fragment paths are relative to the da-bacom repo origin (`https://main--da-bacom--adobecom.aem.live`).
Links resolve to `business.adobe.com` in production.

#### www.adobe.com (da-cc)

**Source**: [Federal](https://github.com/adobecom/federal) repo (da-cc has no local `/gnav`).

| Fragment | Path | Content |
|---|---|---|
| Top-level GNAV | [`/federal/globalnav/acom/acom-gnav`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/acom-gnav.plain.html) | Headings with `<a>` links to section sub-fragments |
| Creativity & Design | [`/federal/globalnav/acom/sections/section-menu-cc`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-cc.plain.html) | References 3 column fragments |
| -- CC Column 1 | [`/federal/globalnav/acom/fragments/cc/cc-column-1`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/cc/cc-column-1.plain.html) | Plans and pricing links |
| -- CC Column 2 | [`/federal/globalnav/acom/fragments/cc/cc-column-2`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/cc/cc-column-2.plain.html) | Product links (Photoshop, Illustrator, etc.) |
| -- CC Column 3 | [`/federal/globalnav/acom/fragments/cc/cc-column-3`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/cc/cc-column-3.plain.html) | AI feature links |
| PDF & E-signatures | [`/federal/globalnav/acom/sections/section-menu-dc`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-dc.plain.html) | References 3 column fragments |
| -- DC Column 1 | [`/federal/globalnav/acom/fragments/dc/dc-column-1`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/dc/dc-column-1.plain.html) | Acrobat product links |
| -- DC Column 2 | [`/federal/globalnav/acom/fragments/dc/dc-column-2`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/dc/dc-column-2.plain.html) | Use-case links |
| -- DC Column 3 | [`/federal/globalnav/acom/fragments/dc/dc-column-3`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/fragments/dc/dc-column-3.plain.html) | Business/enterprise links |
| ~~Marketing & Commerce~~ | [`/federal/globalnav/acom/sections/section-menu-dx`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-dx.plain.html) | **Excluded** -- all links point to business.adobe.com |
| Learn & Support | [`/federal/globalnav/acom/sections/section-menu-help`](https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-help.plain.html) | Inline links (no column fragments) |

All fragment paths are relative to the federal repo origin (`https://main--federal--adobecom.aem.live`).
Links resolve to `www.adobe.com` or `business.adobe.com` in production.

**Note**: Marketing & Commerce (`section-menu-dx`) is excluded from www sitemaps because its links all point to business.adobe.com. This is hardcoded in the generator.

**Localization**: Localized GNAV fragments are fetched by prepending the geo prefix, e.g.:
[`/fr/federal/globalnav/acom/acom-gnav`](https://main--federal--adobecom.aem.live/fr/federal/globalnav/acom/acom-gnav.plain.html) (French)

#### GNAV Resolution Fallback Chain

The generator resolves the GNAV source using this chain:
1. `gnav-source` page metadata (if present)
2. Local `/{geo}/gnav` on the site's own repo
3. Federal `/{geo}/federal/globalnav/acom/acom-gnav` (fallback)

#### Link Domain Mapping

All rendered links use production URLs. The domain mapping:

| Repo Pattern | Production Domain |
|---|---|
| da-bacom and da-bacom-* repos | `https://business.adobe.com` |
| All other repos | `https://www.adobe.com` |

Links to external domains (helpx.adobe.com, experienceleague.adobe.com, etc.) are preserved as-is.

#### Content Rendering Rules

Each GNAV section fragment produces a block of content within the sitemap page. The rendering follows these rules:

**Heading hierarchy**:
- **H3**: Section heading (from the top-level GNAV, e.g. "Creativity & Design", "Products")
- **H4**: Sub-heading (from heading tags within section fragments, e.g. "Shop for", "Featured products", "Online tools")
- Sub-headings break the content into multiple `<ul>` groups within a section. Each sub-heading is followed by its own `<ul>` of links.

**Fragment parsing**:
- Section fragments use two structures: `.link-group` divs (federal pattern) or `<ul><li>` lists. Both are supported.
- Federal CC and DC sections use nested `#_inline` column fragment references. These are followed and their content is merged in document order.
- Heading tags (`<h5>`, `<h6>`, etc.) within fragments become H4 sub-headings.
- `<a>` tags within `.link-group`, `<li>`, `<p>`, or `<strong>` elements become links.
- Description text in `<p>` tags after links (e.g. "Image editing and design", "AI-powered content creation") is **discarded** -- these are GNAV mega-menu descriptions, not sitemap content.

**Placeholders**: `{{placeholder}}` tokens in link text (e.g. `{{premiere}}`) are resolved via [`/federal/globalnav/placeholders.json`](https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json). Only placeholders already used by the GNAV are needed.

**Excluded content**:
- `bookmark://` links (internal GNAV anchor plumbing, not navigable URLs)
- `#_inline` fragment references (internal GNAV plumbing -- followed for content, but the reference itself is not rendered)
- Image-only content (SVG icons, product logos) -- stripped after link decoration
- Promo fragments (promotional aside content within column references)
- Marketing & Commerce section (`section-menu-dx`) on www (all links point to business.adobe.com -- hardcoded exclusion)

**Page generation rule**: A sitemap page is only produced for a base geo when at least one query index from any site returns indexable URLs. Empty or all-noindex geos are skipped.

### Pipeline

```mermaid
flowchart LR
    subgraph Extract
        GNAV[GNAV Fragments\nheadings + links]
        QI[Query Index\nJSON files]
        SC[Sitemap\nConfig]
    end

    subgraph Transform
        GEN[Generator\nNode.js]
        JSON[Page JSON\nper geo]
    end

    subgraph Push
        DADOC[DA-compatible\ndocument]
        DA[DA PUT]
    end

    subgraph Preview
        PREV[AEM Preview]
    end

    subgraph Publish
        PUB[AEM Publish]
    end

    GNAV --> GEN
    QI --> GEN
    SC --> GEN
    GEN --> JSON --> DADOC --> DA --> PREV --> PUB
```

### Generator Logic

For each domain (business, www) and for each base geo in the geo map:

1. **Resolve GNAV source** for the base geo using the fallback chain:
   1. `gnav-source` page metadata (if present)
   2. Local `/{geo}/gnav` on the host repo (e.g. da-bacom)
   3. Federal `/{geo}/federal/globalnav/acom/acom-gnav` (fallback)
2. **Parse top-level sections** from the GNAV document:
   - Federal pattern: heading tags containing `<a>` links to section sub-fragment paths
   - Local pattern: flat `<a>` links with paths containing `/fragments/`
   - Exclude sections in the hardcoded exclusion list (e.g. `section-menu-dx` for www)
3. **Fetch each section fragment** and extract content in document order:
   - If the fragment contains `#_inline` column references, follow each (skip promos), fetch, and merge content
   - Heading tags (`h5`, `h6`, etc.) become sub-headings
   - Links inside `.link-group`, `<li>`, `<p>`, or `<strong>` become links
   - Description `<p>` text after links is discarded
   - `bookmark://` links are discarded
4. **Resolve placeholders** (`{{key}}` tokens) via federal globalnav placeholders for the geo
5. **Fetch query index JSON** for the base geo (and its extended geos) from each site in the query index map. Warn and skip on 404 or empty results.
6. **Check page generation rule**: if no site returned indexable URLs for this base geo, skip -- do not produce a page.
7. **Build page structure** (H3 section heading > H4 sub-headings > UL link groups):
   - GNAV sections with localized headings and sub-headings
   - Links to HTML sitemaps of every other base geo in the same domain
   - Links from each extended geo related to this base geo
   - All links use hardcoded production URLs (`business.adobe.com` for da-bacom repos, `www.adobe.com` for all others)
   - Strip images/SVGs that may have been generated from URL decoration
8. **Transform** the page structure into a DA-compatible document (see [DA Document Format](#da-document-format))
9. **Push** the document to DA via the DA Admin API (IMS-authenticated)
10. **Trigger** AEM preview and publish via the Helix Admin API

**Query index title fallback**: When a query index entry is missing a `title` field (e.g. the cc site), generate a title from the URL slug: split on hyphens, capitalize each word. Naive but better than a blank entry.

### DA Document Format

> **TODO**: Document the DA page format -- how to represent an HTML page as a DA-compatible document for upload via the DA Admin API. This will be informed by DA documentation and iteration on the pipeline's push stage.

### Scheduling

The generator runs on a recurring schedule. Options:
- GitHub Actions `schedule` trigger (cron)
- External cron (e.g. Adobe I/O Runtime / OpenWhisk action) triggering via `repository_dispatch`

Full rebuild on each run (no incremental state management needed). The entire dataset is processed from scratch each time.

## Prototype

A client-side prototype of the GNAV extraction is implemented in the `sitemap-base` block on the `sitemap-gnav-proto` branch. It demonstrates the GNAV-sourced rendering using the same CSS and layout as the authored sitemap pages.

**Test URLs** (append `&cache=bust` if seeing stale content):
- business: `https://main--da-bacom--adobecom.aem.live/drafts/hgpa/sitemap?milolibs=sitemap-gnav-proto--milo--adobecom&sitemap-source=gnav`
- www: `https://main--da-cc--adobecom.aem.live/drafts/hgpa/sitemap?milolibs=sitemap-gnav-proto--milo--adobecom&sitemap-source=gnav`

The prototype activates via `?sitemap-source=gnav` and implements the same GNAV resolution fallback chain, placeholder resolution, and content filtering described above. The production pipeline will replicate this logic server-side in Node.js, generating static HTML with hardcoded production links instead of client-side rendering.

## Open Questions

- [ ] Scheduling frequency: hourly? daily?
- [ ] Should this live in milo or a separate repo?
- [ ] Reuse preview-indexer's DA/IMS/Helix client modules (`internal/da-client.js`, `internal/helix-client.js`) or rewrite in TypeScript?
- [ ] OpenWhisk cron vs. GitHub Actions scheduled trigger?
