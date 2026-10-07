# MEP Lingo: Region-Optimized Content

MEP Lingo enables serving region-specific content variants for fragments without requiring separate pages per region.

## MEP Preview Modules

MEP Next is the default preview when `mep.preview` is enabled; no `mepnext=on`
feature flag is required. Production preview eligibility and Sidekick authentication
requirements remain unchanged.

| Module | Responsibility |
|--------|----------------|
| `mep-next/mep-next.js` | Shared page/config parsing, manifest data and status, API endpoints, MMM saving and popup support for MMM and MMM-2 |
| `mep-next/mep-overlay/mep-overlay-highlight.js` | Badges, highlight toggles and page-update counts; delegates M@S and CaaS badges to their existing helpers |
| `mep-next/mep-overlay/mep-overlay-logic.js` | Overlay-specific summaries, persisted choices, geo spoofing and preview-link logic |
| `mep-next/mep-overlay/mep-overlay.js` | Overlay HTML/DOM generation and event wiring |

The legacy `personalization/preview.js`, its stylesheet and subcollection helper
have been removed. Both manifest managers use the shared MEP Next implementation.
Activity details map the API's `manifestConsentType` and
`manifestCountryRestriction` to the shared consent/country fields. Expanded cards
show the source, consent, countries, schedule and last-seen time, variants, analytics
title, manifest ID, full URL and pathname. Missing metadata is marked explicitly;
empty country restrictions mean no restriction. MySQL zero dates mean no scheduled
boundary, not an invalid date. Historical activity status is derived from available
schedule boundaries when the API does not provide a live disabled state.
The overlay shows a progress timeline for complete schedules, with separate
localized start/end dates and times; open-ended and invalid schedules retain
explicit boundary information without generating invalid Instant links.
MMM-2 keeps the manifest link, experience selector and expand control on one row,
with expanded activity details spanning the full width below.
Manifest order numbers are plain text; only the filenames are linked.
Fragment-highlight preview links now use `otherHighlight=true`; existing
`mepFragments=true` links are still accepted by the overlay.
MMM-2's Manifest Consent Type filter uses checkboxes for Promo Or No Offer Changes,
Non-Personalized Offer Test and Personalized Offer. All are selected by default
(no consent-type restriction). All search checkbox groups can be cleared;
an empty group sends `''` for its API filter property and stays unchecked when restored.
Dropdowns and single-line text filters are grouped above the checkbox groups;
both groups use an aligned three-column grid (two columns on tablets and one on
mobile). The full-width search textarea remains at the bottom of the panel.
Target Activity Historical Data shows daily snapshots when available history for
the selected year spans fewer than 31 days, even across month boundaries;
otherwise it retains monthly aggregation.
Switching historical-data views dims the previous chart and shows a centered
loading overlay until the replacement data has rendered, without shifting the header controls.
The chart starts collapsed. History is retrieved only when it is expanded, with one
`GET /get-target-history?days=400&breakdown=true` request. Geo changes while collapsed
are applied on the next expansion; reopening reuses cached history.
The chart reuses that response and its in-flight request for all views and geo filters
while mounted, sums distinct group members per date, and uses the stored `ALL` totals
for the site-wide line. Missing geo history stays missing. Deploy the matching
backend bulk-response change before releasing this client.

## MMM-2 Authored Content

All three tabs read their content from the MMM-2 page itself. Author an empty
**MMM-2** block and separate **Manifest Manager**, **Inactivity Report** and
**Metadata Lookup** tables in the same section. No tab-name modifiers are required.
Milo nests the tables inside MMM-2 before loading or preloading blocks; MMM-2
consumes them once and retains the parsed content across tab switches and Sidekick
logout/login. The tables are not rendered as separate reports.

The table's first row contains the accordion title in column one and its rich-text
instructions, tutorial/documentation links and notes in column two. Milo's
`decorateBlockText` decorates this authored content before rendering, assigning
`heading-m`, `body-s` and `button-s` classes. Supplemental
text following authored buttons uses `body-xs`, rather than the shared button
decorator's `body-xl` default. Subsequent two-column rows configure these menus:

| Tab | Required menu headers |
|-----|-----------------------|
| Manifest Manager (`?tab=search`) | `Menu: pages`, `Menu: geos`, `Menu: lastSeenManifest`, `Menu: subdomain` |
| Inactivity Report (`?tab=inactivity`) | `Menu: geos`, `Menu: lastSeenManifest` |
| Metadata Lookup (`?tab=metadata-lookup`) | `Menu: metadataRepo` |

Pages and geos accept individual values or comma-separated groups.
Last-seen menus use API time-window values; each tab authors its own available windows.
Metadata repo keys must be `cc`, `dc`, `express` or `bacom`; endpoint and spreadsheet
URLs remain code-defined. Unsupported keys display a configuration error.
The spreadsheet button stays inside the authored instructions, rather than being
duplicated beside the filters. Links to the known repo spreadsheets follow the
selected repo, updating their URL and repo name while retaining their authored placement.

Each menu header's second column is its visible label. Following rows contain an
option value in column one and its label in column two, until the next menu header.
Manifest Manager renders its dropdowns in the authored menu order, without a
separate code-defined dropdown list.
Values preserve case, including `threeMonths` and `sixMonths`; whitespace is removed
from multiline/comma-separated option values. No options are injected: author a
blank value with a **Show All** label when that choice is needed.
Bold an option's label or value to make it the initial selection. Only one option
per menu may be bold; without one, the first authored option is selected.
Valid saved selections, including `''`, override the authored initial default.
Saved choices that no longer exist reset to the authored default, with a visible
notice and pagination reset to page one. Legacy saved `all` values for last-seen
and subdomain migrate to the authored blank option.
For last-seen, `''` maps to the backend's `100 YEAR` interval for both page search
and expanded activity details; it does not default back to three months.
Missing/incomplete local configuration displays an error and prevents that tab's data requests.

Manifest Manager and Inactivity Report have synchronized pagination controls above
and below their results. Either control changes the same current page and items-per-page setting.
When no records match, the top control is hidden and a single "No results" message appears.

The target-setting, manifest-source and consent checkboxes, country-restriction
text field, search textarea and pagination remain code-defined. Manifest Manager
no longer fetches `/docs/authoring/features/mmm/index.plain.html`; Inactivity Report
also no longer fetches `/docs/authoring/features/mmm/mep-target-inactivity.plain.html`.
Code-defined action buttons also obtain their classes from Milo's `decorateButtons`,
rather than hardcoding `con-button`, color and size classes in the views.
Inactivity Report's centered Copy Selected / Open Slack actions dock to the viewport's
bottom edge while scrolling through the report, and stop at the end of the tab's content.
Copy Selected shows an accessible message when no pages are selected, reports the
copied page count only after the clipboard write succeeds, and displays clipboard failures.
Feedback appears absolutely positioned to the right of the action buttons without moving
the layout, and dismisses after three seconds, or sooner
on another copy attempt, selection change or report reload.
Metadata Lookup's Copy Report shows accessible confirmation to the right of the button only
after the clipboard write succeeds; clipboard failures show an error instead.
Both tabs use reddish feedback for errors, greenish feedback for success, and a neutral
message while copying, with corresponding light and dark palettes. Success and error
messages dismiss after three seconds; pending messages remain until copying finishes.
Metadata category Copy buttons show the same feedback independently of the full report.
Both metadata copy messages are absolutely positioned beside their buttons so feedback
does not move the buttons or change the surrounding layout.
On opening Inactivity Report, `/get-report` defaults to `orderBy: 'p.lastSeen'`
and ascending order. Header clicks select another sort column or toggle direction.
Other saved filters are retained, but an old saved sort does not override the initial
page-last-seen ordering. The inactivity cutoff itself remains activity-based.
When a specific geo or region is selected, the expanded history chart shows its authored
label in place of the All pages / By geo dropdown. Show All restores the dropdown.

Author **MMM-2 (Dark)** to opt into a scoped dark theme for all tabs, including controls,
expanded manifest cards, loading states and the history chart. Plain **MMM-2** retains
the light theme. Neither variant changes the surrounding page's theme or follows OS settings.

## MMM-2 UI Authentication

MMM-2 uses `sidekick-auth.js` to gate the entire app before mounting its tabs or
starting MMM data requests. Gated hosts require AEM Sidekick login or a successful
Adobe firewall reachability check, preserving the shared MEP policy. Without firewall
access, logout unmounts the app and removes loaded results; signing in again mounts a
fresh app. Filter preferences remain saved.
The auth subscription disconnects its observers, timers and event listeners when
the gate unmounts.

The existing MEP host policy is preserved: production domains, production config,
public `.aem.live`/`.hlx.live` and unknown hosts require Sidekick login or firewall access.
Localhost,
preview/review, stage, corp and graybox hosts normally bypass the gate unless
production config or `prodDomains` forces authentication.
This is authoring-extension login detection, not an Adobe IMS sign-in flow.

### TODO: Backend Authentication and Authorization

**The UI gate does not secure the backend.** MMM API requests currently carry no
authentication credential, and Sidekick DOM state is not server-verifiable proof
of identity. Before treating MMM data as access-controlled:

- Agree on a supported, server-verifiable identity/credential and the allowed
  Adobe employee or author access policy; Adobe account sign-in alone is not authorization.
- Enforce authentication and authorization on every MMM data/admin endpoint,
  including `/get-pages`, `/get-page`, `/get-report` and `/get-target-history`.
  Validate credential issuer, audience and expiry as applicable; return `401` for
  unauthenticated requests and `403` for identities without access.
- Wire the approved credential into frontend requests and handle expired or
  rejected sessions explicitly. Do not rely on CORS, hostname or the UI gate as API authorization.
- Define the write/ingestion policy separately, including `/save-mep-call`, so
  normal MEP preview recording is not accidentally broken by the read/admin gate.
- Add backend and integration coverage for absent/invalid/expired credentials,
  disallowed identities and authorized access, including direct API requests.

## Usage

When a page has lingo enabled (via `langfirst=on` URL param or `<meta name="langfirst" content="on">`), fragments with `#_mep-lingo` will attempt to load regional variants.

### Fragment Syntax

```html
<!-- Basic mep-lingo fragment -->
<a href="/path/to/fragment#_mep-lingo">Fragment</a>

<!-- Inline mep-lingo fragment -->
<a href="/path/to/fragment#_inline#_mep-lingo">Fragment</a>
```

### Block Swap

To swap an entire block with regional content, add a row with "mep-lingo" in the first cell:

| marquee |
|---------|
| mep-lingo | /path/to/regional/fragment |
| ...existing content... |

## How It Works

1. **Country Detection**: Gets user's country from:
   - `akamaiLocale` URL parameter
   - `akamai` sessionStorage
   - Server timing geo header

2. **Region Mapping**: Maps country to region using:
   - Direct match: `ch` → `ch_de` (country + locale)
   - Config mapping: `mepLingoCountryToRegion: { africa: ['ng', 'za', 'ke'] }`

3. **Content Fetching**: 
   - Checks query-index for path existence (performance optimization)
   - Fetches regional content, falls back to base if unavailable
   - Sets `data-mep-lingo-roc` or `data-mep-lingo-fallback` attribute

## Configuration

In your site's config:

```javascript
// locales.js
export default {
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  de: { 
    ietf: 'de-DE',
    regions: {
      ch_de: { prefix: '/ch_de', ietf: 'de-CH' },
      at: { prefix: '/at', ietf: 'de-AT' },
    }
  },
};

// config.js
mepLingoCountryToRegion: {
  africa: ['ng', 'za', 'ke', 'mu'],
  la: ['bo', 'cr', 'do', 'ec'],
}
```

## Module Exports

### `lingo.js`

| Function | Description |
|----------|-------------|
| `getLocaleCodeFromPrefix(prefix, region, language)` | Derive locale code from prefix, handling special cases like `langstore` and `target-preview` |
| `getMepLingoContext(locale)` | Get full context including country, localeCode, regionKey, matchingRegion |
| `fetchFragment(path)` | Fetch a fragment, stripping `.html` extension to avoid `.html.plain.html` |
| `fetchMepLingo(mepLingoPath, fallbackPath)` | Fetch ROC and fallback in parallel, return ROC if successful, else fallback |
| `handleInvalidMepLingo(a, { env, relHref })` | Handle mep-lingo links on regional pages (removes on prod, marks failed on non-prod) |
| `addMepLingoPreviewAttrs(fragment, { usedFallback, relHref })` | Set `data-mep-lingo-roc` or `data-mep-lingo-fallback` attributes for preview |

### `utils.js`

| Function | Description |
|----------|-------------|
| `getCountry()` | Get user's country code from akamaiLocale param, sessionStorage, or server timing |
| `lingoActive()` | Check if lingo is enabled via `langfirst` URL param or meta tag |
| `getGeoLocalePrefix()` | Get the regional prefix for the current user's country |

### `getLocaleCodeFromPrefix` Details

Derives the locale code from a URL prefix, handling special cases for `langstore` and `target-preview` paths.

**Parameters:**
- `prefix` - The locale prefix (e.g., `/be_fr`, `/langstore/fr`, `/target-preview/en`)
- `region` - The region code (e.g., `us`, `de`). Defaults to `us`
- `language` - The language code (e.g., `en`, `fr`). Defaults to `en`

**Returns:** String - The locale code

**Examples:**
- `/be_fr` → `be_fr`
- `/langstore/fr` → `fr` (extracts second part)
- `/target-preview/de` → `de` (extracts second part)
- `/langstore` (no second part) → `en` (falls back to language)
- `` (empty prefix, region=`us`) → `en`

**Logic:**
1. If prefix is empty or special prefix (`langstore`/`target-preview`) without second part, returns language (or `en` if region is `us`)
2. If prefix starts with `langstore` or `target-preview`, returns the second path segment
3. Otherwise, returns the first path segment

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-mep-lingo` | Fragment is mep-lingo enabled |
| `data-mep-lingo-roc` | Regional content was loaded (value: path) |
| `data-mep-lingo-fallback` | Fallback content was loaded (value: path) |
| `data-mep-lingo-block-fragment` | Block swap fragment URL |
| `data-mep-lingo-section-metadata` | Section-metadata block swap |
| `data-remove-original-block` | Original block should be removed |

## Debugging

Add `langfirst=on` to URL to enable mep-lingo, then use `akamaiLocale=XX` to spoof country:

```
?langfirst=on&akamaiLocale=ch
```

When the MEP panel's "Highlight changes" checkbox is enabled (or `mepHighlight=true` URL param), fragments show preview badges:
- **Green badge**: Regional content loaded (`data-mep-lingo-roc`)
- **Yellow badge**: Fallback content loaded (`data-mep-lingo-fallback`)
