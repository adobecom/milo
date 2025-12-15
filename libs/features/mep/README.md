# MEP Lingo: Region-Optimized Content

MEP Lingo enables serving region-specific content variants for fragments without requiring separate pages per region.

## Usage

When a page has lingo enabled (via `langFirst=on` URL param or `<meta name="langFirst" content="on">`), fragments with `#_mep-lingo` will attempt to load regional variants.

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
| `getQueryIndexPaths(prefix, checkImmediate, isFederal)` | Check query-index for regional paths |
| `fetchMepLingo(mepLingoPath, fallbackPath)` | Fetch ROC and fallback in parallel, return ROC immediately if successful |
| `processMepLingoAnchors(anchors)` | Process anchors for block swaps |
| `processAnchorForMepLingo(a)` | Process single anchor's mep-lingo hash |

### `utils.js`

| Function | Description |
|----------|-------------|
| `getCountry()` | Get user's country code from akamaiLocale param, sessionStorage, or server timing |
| `lingoActive()` | Check if lingo is enabled via `langFirst` URL param or meta tag |

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

### `getQueryIndexPaths` Details

Checks the query-index for regional paths. Used to optimize fetching by avoiding requests for paths that don't exist.

**Parameters:**
- `prefix` - The regional prefix to search for (e.g., `/ch_de`)
- `checkImmediate` - If `true`, returns immediately if index not yet loaded. Set to `true` for LCP fragments (non-blocking). Defaults to `false`
- `isFederal` - If `true`, uses `'federal'` as siteId. Defaults to `false`

**Returns:** Object with `{ resolved, paths, available }`
- `resolved` - Whether query-index lookup completed
- `paths` - Array of paths found in the index
- `available` - Whether query-index is available

**Important Notes:**
- Uses the same `siteId` logic as `loadQueryIndexes()` in utils.js for consistency
- For production, `config.uniqueSiteId` must be set in the consumer's config for the index lookup to work correctly
- When `checkImmediate=true` (LCP), returns immediately without waiting for index to load to avoid blocking LCP

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

Add `langFirst=on` to URL to enable mep-lingo, then use `akamaiLocale=XX` to spoof country:

```
?langFirst=on&akamaiLocale=ch
```

The MEP preview panel shows:
- Current spoofed region
- Upstream page link
- Downstream pages links

