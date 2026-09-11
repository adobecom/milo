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
  "aliases": [],                                         // additional aliases (usually empty)
  "title":   "A lone runner's silhouette …",            // original prompt or editorial title
  "type":    "application/vnd.adobe.firefly-generation-image+dcx",
  "size":    1167303,                                    // bytes
  "version": 0,

  // Timestamps
  "created":          "2026-08-12T20:50:09.962Z",
  "updated":          "2026-08-12T20:50:12.452Z",
  "published":        "2026-08-13T17:35:39.847Z",
  "metadata_updated": "2026-08-12T20:50:12.897Z",

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
      "id":               "nikolapanovic",
      "display_name":     "Crni Zec Studio",   // preferred; fall back through first+last, user_name
      "first_name":       "Crni Zec",
      "last_name":        "Studio",
      "user_name":        "nikolapanovic",
      "city":             "Pozega",
      "state":            "",
      "country":          "Serbia",
      "location":         "Pozega, Serbia",    // pre-formatted city+country string
      "is_valid_profile": true,
      "has_default_image": false,
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
  "tags": [],  // editorial tags (usually empty)

  // Model identification — four tags always present:
  //   "modelId:<provider>"                    → "google" | "openai" | (others TBD)
  //   "modelVersionName:<Human name>"         → e.g. "Gemini 3 (Nano Banana Pro)", "GPT Image 2"
  //   "docVersion_<provider>:firefly:colligo:<codename>"  → internal version string
  //   "translated"                            → prompts were machine-translated
  //
  // Confirmed providers as of 2026-09:
  //   modelId:google   → modelVersionName:"Gemini 3 (Nano Banana Pro)"
  //   modelId:openai   → modelVersionName:"GPT Image 2"
  "machine_tags": [
    "modelId:google",
    "modelVersionName:Gemini 3 (Nano Banana Pro)",
    "docVersion_google:firefly:colligo:nano-banana-pro",
    "translated"
  ],

  // Generation metadata
  "custom": {
    // JSON string — docVersion mirrors the machine_tag; module is always "text2Image" here
    "firefly#model": "{\"docVersion\":\"google:firefly:colligo:nano-banana-pro\",\"module\":\"text2Image\"}",
    "input": {
      // Aspect ratio used at generation time (string float)
      "firefly#inputModel": "{\"aspectRatio\":\"0.7466666666666667\"}",

      // Localized prompts — key is IETF locale (en-US, ja-JP, zh-Hans-CN, …)
      // ~30 locales present
      "firefly#prompts": {
        "en-US": "A lone runner's silhouette …",
        "ja-JP": "…",
        "de-DE": "…"
      },

      // Original un-translated prompt
      "firefly#originalPrompt": "A lone runner's silhouette …",
      "firefly#locale": "en-US"
    },
    "output": {
      "firefly#outputModel": {}   // present but always empty in observed responses
    }
  },

  // Engagement stats
  "stats": {
    "detail_count":          2417,    // total views / engagements
    "anonymous_like_count":  0,
    "purchase_count":        0,
    "original_count":        0,
    "copy_count":            0,
    "add_to_library_count":  0,
    "website_count":         0,
    "video_info_count":      0,       // non-zero for video assets
    "video_stream_count":    0,
    "video_embed_count":     0,
    "comment_count":         0,
    // custom_counts keys vary per asset; only keys with at least one event appear
    "custom_counts": {
      "like": 2, "toggle_like": 1,
      "unliked": 1, "delete_like": 1, "dislike": 1, "unlike": 3,
      "unheart": 1, "favorite": 1, "heart": 1, "liked": 1,
      "remove_like": 1, "unfavorite": 1
    }
  },

  // Viewer-relative state (always false for unauthenticated requests)
  "purchased": false,
  "liked":     false,
  "is_owner":  false,
  "activities": []
}
```

---

## All fields — quick reference

| Field | Notes |
|---|---|
| `id` | UUID — used to build video stream URL |
| `urn` | Used for the `firefly.adobe.com/open?id=` deep-link |
| `alias` / `aliases` | Short alphanumeric IDs |
| `title` | Original prompt or editorial title |
| `type` | MIME type string (always `application/vnd.adobe.firefly-generation-image+dcx` for images) |
| `size` | File size in bytes |
| `version` | Version number (0) |
| `created` / `updated` / `published` / `metadata_updated` | ISO timestamps |
| `machine_tags` | Array of strings — see "Model identification" below |
| `custom.firefly#model` | JSON string — `docVersion` and `module` |
| `custom.input.firefly#prompts` | Map of ~30 IETF locales → prompt string |
| `custom.input.firefly#originalPrompt` | Original un-translated prompt |
| `custom.input.firefly#inputModel` | JSON string — `aspectRatio` (string float) |
| `custom.input.firefly#locale` | Locale the asset was generated in |
| `custom.output.firefly#outputModel` | Present but always `{}` in observed responses |
| `_links.rendition.href` | Templated image URL (`{format}`, `{dimension}`, `{size}`) |
| `_links.rendition.max_width` / `max_height` | Native pixel dimensions → aspect ratio |
| `_embedded.owner.display_name` / `first_name` / `last_name` / `user_name` | Creator name fields |
| `_embedded.owner.city` / `state` / `country` / `location` | Creator location; `location` is pre-formatted |
| `_embedded.owner.is_valid_profile` / `has_default_image` | Profile flags |
| `_embedded.owner._links.images` | Avatar URLs at multiple sizes (50–276 px square) |
| `category.id` | e.g. `text2Image`, `VideoGeneration` |
| `tags` | Editorial tags array (usually empty) |
| `stats.detail_count` | Total views / engagements |
| `stats.anonymous_like_count` | Anonymous likes |
| `stats.purchase_count` / `copy_count` / `add_to_library_count` | Other engagement counters |
| `stats.video_*_count` | Non-zero for video category assets |
| `stats.comment_count` | Comment count |
| `stats.custom_counts` | Map of interaction event names → count; keys vary per asset |
| `purchased` / `liked` / `is_owner` | Viewer-relative booleans (always `false` for unauthenticated requests) |
| `activities` | Array (always empty in observed responses) |

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

### Model provider + display name

The community gallery serves images from multiple AI providers. Parse from `machine_tags`:

```js
function parseModel(asset) {
  const tags = asset.machine_tags || [];
  const modelIdTag = tags.find((t) => t.startsWith('modelId:'));
  const modelNameTag = tags.find((t) => t.startsWith('modelVersionName:'));
  return {
    provider: modelIdTag?.slice('modelId:'.length) || '',          // "google" | "openai" | …
    name: modelNameTag?.slice('modelVersionName:'.length) || '',   // "Gemini 3 (Nano Banana Pro)"
  };
}
```

Confirmed providers as of 2026-09 — no icon URLs are in the API; map them yourself:

| `modelId` | `modelVersionName` | Icon |
|---|---|---|
| `google` | Gemini 3 (Nano Banana Pro) | Google logo |
| `openai` | GPT Image 2 | OpenAI logo |

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
