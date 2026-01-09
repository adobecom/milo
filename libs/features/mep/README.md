# MEP Lingo: Region-Optimized Content

MEP Lingo enables serving region-specific content variants for fragments without requiring separate pages per region.

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
| `getMepLingoPrefix()` | Get the regional prefix for the current user's country |

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

