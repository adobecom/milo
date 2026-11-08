# firefly-globe — C2 block

A globe of Firefly Community images. The sphere is already formed as the block scrolls in; the camera eases in, the
world pins, and the camera then travels through the globe into an optional pull quote.

The runtime, sphere, drag, modal, a11y, controls and pull quote are shared with `globe-gallery` and documented in
`libs/utils/globe/README.md`. This file covers what firefly adds.

| File | Holds |
| --- | --- |
| `firefly-globe.js` | In order: authoring (`parseAuthoredContent`, `fetchFireflyAssets`, `buildGlobeDom`, `renderModalContent`, `fireflyRenditionUrl`); the timeline (`deriveFrame` for `sphereFormT` and `scrollT`, and the travel camera pair); then the `spec`: `BREAKPOINTS`, content loading, and hooks for the entry camera, the entry lift and the browse target |

## Differences from globe-gallery

| Area | firefly-globe |
| --- | --- |
| Entry | No arc or grid. The camera eases from `CAM_Z_ENTRY` to `CAM_Z_SPHERE` on `sphereFormT³` while the block scrolls in |
| Clocks | `sphereFormT = 1 + (scrollY − blockDocTop) / H`, reaching 1 at the pin; `scrollT = (scrollY − blockDocTop) / travelSpanPx`, from the pin |
| Scroll budget | `--globe-travel-vh` only (no formation); with particles off the block height is the travel |
| Canvas | `position: absolute` in the sticky `.globe-world`, so it moves with the block and never covers the section above; controls and `.globe-a11y-cards` are `absolute` with it |
| Cards | Firefly Community API by `categoryId`: image, `modelId`, `modelVersionName`, `prompt`, `fireflyUrl` |
| Modal info | Model icon and version label, prompt, CTA to `fireflyUrl`; hoisted to `<body>` |
| Analytics | `--firefly_globe`; modal labels are the shared `--globe_card_modal` |
| Pull quote | `manageCanvas` and `requireOnSphere` off; travel and hand-off count from the block top |

## Authoring

| Row | Content |
| --- | --- |
| 1 | `categoryId \|\| machineTag \|\| cgenId \|\| ctaLabel` |
| 2 | Hint row (see the shared README) |
| 3 | A11y row (see the shared README) |
| 4 | Optional pull quote |

- No `categoryId`, a failed request or no usable assets hides the block (`globe-empty`) and logs to lana (`error` for
  failures, `warn` otherwise).
- `machineTag` restricts the query to assets with that tag; empty uses `DEFAULT_MACHINE_TAG`. Quotes and backslashes in
  it are backslash-escaped for the API.
- `cgenId` appends `&promoid=<id>&mv=other` to every `fireflyUrl`.
- `ctaLabel` is the modal CTA text; the CTA is hidden for cards without a `fireflyUrl`.

## Firefly Community API

```
GET https://community-hubs.adobe.io/api/v2/ff_community/assets
    ?size=50&sort=updated_desc&include_pending_assets=false&cursor=
    &category_id=<categoryId>&machine_tag=<machineTag>
x-api-key: <FF_API_KEY>
```

`fetchFireflyAssets` takes one page; `_links.next.href` (a full cursor URL) is not followed. Known categories are
`text2Image` and `VideoGeneration`; a curated category with nothing published, or a wrong ID, returns no assets. More
than one `machine_tag` is ANDed. Cards come from `_embedded.assets`; assets without `id` or a rendition `href` are
skipped (logged at `info`).

| Asset field | Card field |
| --- | --- |
| `id`, `_links.rendition.href` | `renditionHref` (see Images) |
| `_links.rendition.max_width` / `max_height` | `maxWidth` / `maxHeight`: native size, picks the modal's request axis |
| `custom.input['firefly#prompts']` / `['firefly#originalPrompt']` / `['firefly#locale']`, `title` | `prompt`, `alt`, `lang` |
| `urn` | `fireflyUrl`: `https://firefly.adobe.com/open?assetOrigin=community&assetType=ImageGeneration&id=<urn>` |
| `machine_tags` `modelId:<provider>` | `modelId`: the modal icon, from `MODEL_ICON` (the API has no icon URLs) |
| `machine_tags` `modelVersionName:<name>` | `modelVersionName`: the modal label, else `modelId` |

Observed providers (2026-09): `google` is "Gemini 3 (Nano Banana Pro)" and `openai` is "GPT Image 2". Assets also carry
owner, stats and timestamp fields the block doesn't read.

### Prompt and locale

`apiAssetToCard` takes the card's `prompt` (and its `alt`, cut to `ALT_MAX_CHARS`) from the first non-blank of:

1. `custom.input['firefly#prompts']`, localized to `getConfig().locale.ietf`.
2. `custom.input['firefly#originalPrompt']`.
3. `title`, as-is.
4. Nothing: the a11y card is `Image N` and the modal image is `aria-hidden`.

`lang` is the matched prompts key, else `firefly#locale` for the original prompt, else none. Tags `Intl.Locale` rejects
are dropped and `_` becomes `-`. Card buttons, the modal image label, the prompt and its spoken part carry it; with no
`lang` the attribute is removed, never set to `""`.

`getLocalizedPrompt` compares maximized tags (`Intl.Locale#maximize`): same language, script and region ranks first;
same language and script second (`es-ES` for `es-MX`; Traditional and Simplified Chinese never cross-match). Otherwise
`en-US`, else the first key. `LANGUAGE_ALIASES` maps Milo's `no` to the API's `nb`. Parsed tags are cached in
`parsedLocales`.

### Images

`apiAssetToCard` ignores the small preview rendition and stores a template for the full-resolution DCX component, built
from the asset `id` and the preview's CDN base:

```
<base>/dcx/<id>/rendition/output/resource/version/0/format/{format}/dimension/{dimension}/size/{size}
```

`fireflyRenditionUrl` fills it as `jpg` (`webp`/`avif` return 415). The CDN caps `size` at the native resolution, which
the API doesn't report, so there's no client clamp. Cards request by height; the modal requests its longer axis from
`max_width` / `max_height`. Textures load `crossOrigin: 'anonymous'`.

## Entry

`SPHERE_INTERACTIVE_T` is reached while the block is still scrolling in, so the globe spins, drags and opens cards
before the pin. What must wait for the pin has its own gate: the travel camera and the inside-sphere drag flip start
with `scrollT`, and `hintRetirable` (`sphereFormT` at 1) holds the hint layer until then. Reduced motion is always
formed.

**Entry lift.** `globe-entry-lift`, a CSS scroll-driven animation on the block's `--globe-entry` view timeline,
translates the canvas and `.globe-a11y-cards` up by `--globe-entry-lift` and releases it by `1 − t²`. It must be driven
by scroll, not rAF: iOS scrolls on its own thread, so a JS-positioned lift steps against the page. The modal reads the
canvas's own rect (`tracksCanvasTop`), which includes the translate. Without `animation-timeline` (Firefox), `viewOffsetY`
applies the same lift from `sphereFormT`, so `ENTRY_LIFT_H` must match `--globe-entry-lift`. Reduced motion has no lift.

- The lift must stay at or under half the viewport height, or it outruns the page and the globe stalls then sinks. The
  speed left at the pin is `1 − 2 · lift / viewportH`.
- The entry globe must render at least a viewport plus the lift tall, or empty space shows below it. `CAM_Z_ENTRY` sets
  that.

The spin toggle sits at `--globe-controls-entry-top` while the world's top is below the nav and at
`--globe-controls-top` once pinned, riding the same animation. `--globe-controls-entry-top` is the section corner radius
plus the inset: a rounded section above overlaps this block's first radius and paints over it.

**Browse target.** `browseScrollTop` is `Math.ceil(blockDocTop)`: `blockDocTop` is usually fractional, and a rounded-down
scroll lands just above the pin.

## Modal and the sticky canvas

- Until the world pins, the world canvas sits its rect's top below the viewport-fixed modal canvas (`tracksCanvasTop`).
  `shiftForCanvasOffset` moves the open snapshot and the close target by that offset, at the card's depth. It is re-read
  when the close starts.
- The scroll lock is on `html` only (`bodyOpenClass` is off). With `html` already non-visible, `overflow: hidden` on
  `body` would make `body` the scroll container and un-stick `.globe-world`.
- `hoistToBody` moves the backdrop and modal canvas to `<body>`: the block sits under a section whose
  `rounded-corners-bottom` sets a stacking context that would clamp their `z-index`.

## Page context

A rounded next section overlaps the block's last radius, at the bottom of the crosshair's vertical lines. A
`parallax-video-garage-door` next section enters from under this block's section, which `rich-content.css` raises with
`.section:has(+ .section.parallax-video-garage-door …)`, so the video never covers the quote.

## Tuning

`SPHERE_R`, `CAM_Z_SPHERE` and `CAM_Z_END` are tuned per breakpoint for the scroll budget; `CAM_Z_ENTRY` is the only
extra breakpoint field. Per breakpoint, `--globe-travel-vh` sets the camera's pace, `PULL_BP[band].startR` the hand-off,
`FLY_VH` / `READ_VH` the flight and the still quote; `CAM_Z_END` and the near-fade bands move the cue. The cue depends on
the rendered card height, so read positions off the page.

## Tests

- `test/c2/blocks/firefly-globe/firefly-globe.test.js`: authoring parse, `buildGlobeDom`, API card mapping (rendition
  template, model tags, locale fallback, alt fallback), `fireflyRenditionUrl`, frame shape and clock endpoints, the
  travel camera pair.
- `modules.test.js`: the shared interaction, core and modal DOM behaviour, run against firefly's markup.
- `mocks/authored.html` is the authoring contract as a fixture.
