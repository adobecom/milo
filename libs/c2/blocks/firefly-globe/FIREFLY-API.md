# Firefly Community Assets API

Used by `firefly-gallery` (da-cc) and planned for `firefly-globe`.

## Endpoint

```
GET https://community-hubs.adobe.io/api/v2/ff_community/assets
    ?size=32
    &sort=updated_desc
    &include_pending_assets=false
    &cursor=
    &category_id=<categoryId>
```

Header: `x-api-key: milo-ff-gallery-unity`

The `categoryId` is authored into the block. Known values:
- `text2Image` — standard Firefly image generation
- `VideoGeneration` — video assets
- Custom curated categories (e.g. `NQCJQWSV`) — returns empty if the category
  has no published assets or the ID is wrong

### Pagination

`_links.next.href` in the response contains a cursor URL for the next page.
Fetch it as-is (it is already a full URL) to get the next batch.

---

## Response shape

```json
{
  "_links": {
    "next": { "href": "<cursor-url>" },
    "self": { "href": "..." }
  },
  "_embedded": {
    "assets": [ /* Asset[] */ ]
  },
  "total": 32
}
```

---

## Asset object

```jsonc
{
  // Identity
  "id":      "3048085a-e8a9-4946-9652-868a941e8f7a",   // UUID, used for video URL
  "urn":     "urn:aaid:sc:US:3048085a-...",             // used in firefly.adobe.com deep-link
  "alias":   "wehiE",

  // Timestamps
  "created":   "2026-08-12T20:50:09.962Z",
  "updated":   "2026-08-12T20:50:12.452Z",
  "published": "2026-08-13T17:35:39.847Z",

  // Image dimensions / rendition
  "_links": {
    "rendition": {
      "href":      "https://cdn.cp.adobe.io/.../format/{format}/dimension/{dimension}/size/{size}",
      "templated": true,
      "max_width":  448,   // native pixel width
      "max_height": 600    // native pixel height → aspect ratio = max_width / max_height
    }
  },

  // Creator info
  "_embedded": {
    "owner": {
      "id":           "nikolapanovic",
      "display_name": "Crni Zec Studio",   // preferred; fall back through first+last, user_name
      "first_name":   "Crni Zec",
      "last_name":    "Studio",
      "user_name":    "nikolapanovic",
      "city": "Pozega", "country": "Serbia",
      "_links": {
        // Multiple avatar sizes (50, 100, 115, 138, 230, 276 px square)
        "images": [
          { "href": "https://pps.services.adobe.com/api/profile/.../50", "width": 50, "height": 50 },
          { "href": "...", "width": 100, "height": 100 }
          // …
        ]
      }
    }
  },

  // Category
  "category": { "id": "text2Image", "name": "text2Image" },

  // ML tags
  "machine_tags": [ "modelVersionName:Gemini 3 (Nano Banana Pro)", "translated", "..." ],

  // Firefly generation metadata
  "custom": {
    "firefly#model": "{\"docVersion\":\"...\",\"module\":\"text2Image\"}",
    "input": {
      // Aspect ratio used at generation time (string float)
      "firefly#inputModel": "{\"aspectRatio\":\"0.7466666666666667\"}",

      // Localized prompts — key is IETF locale (en-US, ja-JP, zh-Hans-CN, …)
      "firefly#prompts": {
        "en-US": "A lone runner's silhouette …",
        "ja-JP": "…",
        "de-DE": "…"
        // ~30 locales present
      },

      // Original un-translated prompt
      "firefly#originalPrompt": "A lone runner's silhouette …",
      "firefly#locale": "en-US"
    }
  },

  // Engagement stats
  "stats": {
    "detail_count": 2212,
    "custom_counts": { "like": 2, "toggle_like": 1 }
  }
}
```

---

## Derived values used in UI

### Image URL

Replace the three placeholders in `_links.rendition.href`:

```js
const imageUrl = asset._links.rendition.href
  .replace(/{format}/g, 'jpg')
  .replace(/{dimension}/g, 'width')
  .replace(/{size}/g, 400);   // px — pick based on container size
```

### Aspect ratio

```js
// Preferred: from rendition dimensions (always present if rendition exists)
const ar = asset._links.rendition.max_width / asset._links.rendition.max_height;

// Fallback: parse firefly#inputModel
const inputModel = JSON.parse(asset.custom.input['firefly#inputModel']);
const ar = parseFloat(inputModel.aspectRatio);
```

### Prompt text (localized)

```js
const locale = getConfig().locale?.ietf || 'en-US';
const prompts = asset.custom?.input?.['firefly#prompts'];
const prompt = prompts?.[locale]
  ?? prompts?.[locale.split('-')[0]]   // language-only fallback
  ?? prompts?.['en-US']
  ?? asset.title;
```

### Creator name + avatar

```js
const owner = asset._embedded?.owner;
const name = owner.display_name
  || `${owner.first_name} ${owner.last_name}`.trim()
  || owner.user_name;

// Pick avatar closest to target size (e.g. 50px)
const avatar = owner._links.images
  .sort((a, b) => Math.abs(a.width - 50) - Math.abs(b.width - 50))[0].href;
```

### Firefly deep-link (for hover CTA)

```js
// images
`https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=${asset.urn}`

// videos
`https://firefly.adobe.com/open?assetOrigin=community&assetType=VideoGeneration&id=${asset.urn}`
```

### Video stream URL (for video assets)

```js
`https://cdn.cp.adobe.io/content/2/dcx/${asset.id}/content/manifest/version/0/component/path/output/resource`
```

---

## Applying to firefly-globe

The globe currently renders a fixed set of textures. To swap them for live API
images, author a `categoryId` into the block (same pattern as firefly-gallery),
fetch on `init`, then:

1. Map each asset to a globe point (lat/lon) — either from `asset.stats.detail_count`
   (engagement-weighted placement) or random spread.
2. Use the rendition URL at a small fixed size (e.g. 256 px) as the point
   texture / thumbnail.
3. On hover/click show an overlay with prompt text, creator name + avatar, and
   a CTA link to `firefly.adobe.com/open?…`.
4. Attach `data-prompt`, `data-creator`, `data-avatar-url`, `data-firefly-url`
   to each DOM point so the overlay logic stays decoupled from the fetch.
