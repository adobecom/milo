# Globe block — port progress & architecture

Porting the **offer-pin-spacer / offer-world** WebGL globe out of the
`hub-creative` prototype into a Milo C2 block (`libs/c2/blocks/globe`).

Status legend: ✅ done · 🚧 in progress · ⬜ todo

| Step | Status |
| --- | --- |
| 1. Consolidated reference (`_reference/globe-reference.html`) | ✅ |
| 2. Study pdf-space pattern + plan | ✅ |
| 3. Port `offer-globe.js` → `globe.js` | ✅ |
| 4. Port CSS slice → `globe.css` + register block | ✅ |
| 5. Visual verification + iterate | ⬜ (next) |

## Decisions made in the first port (verbatim-wrap strategy)

To get the prototype landed with minimal transcription risk, the 3059-line
runtime was copied as-is and wrapped, not rewritten:

- **THREE**: vendored as `./three.min.js` next to `globe.js`, loaded via
  `loadScript(new URL('./three.min.js', import.meta.url).href)` so the global
  `THREE` exists before the runtime instantiates.
- **gsap** dropped → `startTicker`/`stopTicker` (requestAnimationFrame) at the
  top of `createGlobeRuntime()`.
- **Lenis** dropped → `window.scrollY`; modal scroll-lock now via the
  `modal-open` class (`overflow:hidden`) in `globe.css` instead of `Lenis.stop()`.
- **Assets**: 23 arc + 22 globe PNGs copied to `./assets/{offer,globe}/`;
  `ASSET_BASE = new URL('./assets/', import.meta.url)`. (~51MB, unoptimized — webp
  later.)
- **DOM**: `init(el)` builds the canvas/world/ca-svg/arc-copy/pull-quote/modal
  markup (`GLOBE_MARKUP`) inside the block and sets `el.id='offer-pin-spacer'`.
  Runtime still looks nodes up by global id → **one globe per page for now.**
- **Lint**: `globe.js` carries a file-level `/* eslint-disable */` (ES5 `var`,
  naming, max-len would throw hundreds of errors). `.eslintrc.js` ignores
  `three.min.js`, `hub-creative/*`, `_reference/*`. Remove the disable during
  the refactor pass. Parse-correctness still verified (eslint reports 0 errors).
- **Reduced motion / THREE load failure**: skip WebGL, add `.globe--reduced`
  (collapses the tall spacer). Proper static poster fallback is a TODO.
- **Block class**: loader adds `.globe`; CSS targets `.globe.offer-pin-spacer`.

## Authoring layer (added after the port, refined against real content)

### Block row structure
The block has three authored rows (direct child `<div>`s):

| Row | Role | Parsed by |
| --- | --- | --- |
| 0 | Arc-copy (heading + body) | `parseArcCopy` → injected into `.offer-arc-copy__title/body` after `buildGlobeDom` |
| 1 | Fragment link → 45 card sections | `fetchFragmentCards` (async fetch, see below) |
| 2 | Pull-quote (heading + 2× `<p>`) | `parsePullQuote` → injected into `.offer-pullquote__quote/name/role` |

`parseAuthoredContent(el)` detects row roles by whether the row contains a
`<picture>`/`<img>` (card rows do; arc-copy and pull-quote rows don't). Returns
`{ cards, arcCopy, pullQuote, fragmentHref }`.

### Fragment loading — why `.plain.html` is fetched directly, with `#_dnb`

Globe owns its fragment loading entirely rather than relying on Milo's auto-resolver:

1. **`#_dnb` in the authored URL** — appending `#_dnb` to the fragment link tells
   Milo's `decorateAutoBlock()` to skip auto-resolution. The raw `<a href>` stays
   in the DOM untouched, which is exactly what globe needs.
2. **`fetchFragmentCards(href)`** — strips the `#_dnb` hash, fetches
   `href + '.plain.html'`. AEM Edge Delivery's `.plain.html` returns all sections
   as bare `<div>` elements (one per `---` separator, no scripts or styles).
   `parseFragmentCards` parses each section div as one card.
3. **Parallel with THREE** — the fetch runs in `Promise.all` alongside
   `loadScript(THREE_SRC)`, so it adds zero wall-clock cost (the 670KB THREE
   download takes longer anyway).

Without `#_dnb`, Milo would start injecting sections one-by-one before `init()`
fires, creating a race condition where only the first section was in the DOM.

Fragment href survives the `buildGlobeDom` DOM wipe because it's extracted first.
Fallback chain: fetched cards → partial DOM cards (if Milo already resolved the
link, e.g. legacy pages) → `[]` → `buildPlaceholderCards(45)`.

### Card object shape
`{ img, picture, name, role, description, badges:[{app:{id,name,abbr}, role}] }`

Each section in the fragment is flat P/UL elements:
`<p><em>role</em></p>` · `<p><strong>name</strong></p>` · plain `<p>` description ·
`<ul>` with nested `<ul><li>` per badge · `<p><picture>` image.

`APP_CATALOG` (module scope) maps badge app names/abbr/id → `{id,name,abbr}` for
brand icon CSS classes. `getCardMetadata(i)` wraps `CARD_CONTENT` by modulo so any
authored count fills `N_TOTAL` (45/24) without breaking grid math.

**Open:** align `N_TOTAL`/grid to the authored card count instead of wrapping.

## How to test (no Playwright per user)

1. Open `_reference/globe-reference.html` (verbatim prototype, globe-only) to see
   the target behavior.
2. For the *ported block*: the block is now authored at
   `https://www.adobe.com/homepage/drafts/jingleh/globe-dev` with a 45-card
   fragment at `/homepage/fragments/drafts/jingle/globe-cards-filled`. Load with
   `?milolibs=local` against `npm run libs`, or against the stage CDN.

---

## What the globe is

Scroll-driven Three.js animation across a tall (`850vh`) pinned spacer.
Phases (progress 0→1 over the spacer's scroll range):

```
0.00–0.55  Arc      45 cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5 grid (staggered)
~0.37–0.78 Sphere   each card folds onto a fibonacci sphere as it lands in the grid
0.78–1.00  Zoom     perspective camera flies through the sphere
```

Sphere is **interactive** once `sphereFormT >= 0.8` (`SPHERE_INTERACTIVE_T`):
drag to rotate; tap a card to open a detail **modal** (separate WebGL canvas +
HTML chrome). Extras: per-frame chromatic-aberration SVG filter on the canvas,
a fixed arc-copy overlay, a fixed pull-quote (fades in near zoom end), and an
a11y gallery of off-screen buttons mirroring the sphere cards.

## Source files (in `hub-creative/`)

| File | Role | Port? |
| --- | --- | --- |
| `scripts/offer-globe.js` (3059 lines, 150KB) | **The globe.** Single IIFE, `window.offerGlobe = { init, destroy }`. | ✅ this is the main.js |
| `scripts/offer-arc.js` | Tile/arc *variant B* (CSS/GSAP, no WebGL). | ❌ not the globe |
| `scripts/offer-toggle.js` | Dev toggle between globe/tile; sets spacer to `850vh` and calls `offerGlobe.init()`. | ❌ logic folds into the block |
| `styles/offer-section.css` (650 lines) | Both variants' CSS. Globe slice listed below. | ⚠️ slice only |
| `vendor/three.min.js` (670KB, UMD r150-ish) | THREE global. | ⚠️ vendor strategy TBD |
| `vendor/gsap.min.js` | Only `gsap.ticker` is used by the globe. | ❌ replace with rAF |
| `vendor/ScrollTrigger.min.js` | NOT used by the globe (tile variant only). | ❌ drop |
| `assets/images/offer/arc-01..23.png` (23) + `assets/images/globe/{01,02,03,06,12,13,14,15,16,17,28,29,48,49,58,59,60,61,62,63,64,65}.png` (22) | 45 card textures. | ⚠️ asset strategy TBD |

## External dependencies — verdict

- **THREE** — HARD. Code calls global `THREE.*` everywhere. Only real dep.
- **gsap** — SOFT. Used only for `gsap.ticker.add(tick)` / `.remove(tick)` (the
  rAF loop) at `init()`/`destroy()`. Replace with a plain `requestAnimationFrame`
  loop. No other gsap usage in the globe.
- **Lenis** — OPTIONAL. `tick()` reads `window.__lenis ? __lenis.scroll : window.scrollY`
  and the modal calls `__lenis.stop()/start()`. All have `window.scrollY` /
  native fallbacks. Milo doesn't use Lenis → just use `window.scrollY`.
- **ScrollTrigger** — UNUSED by globe.

## DOM contract (what offer-globe.js reads/writes)

`init()` queries these by **global id** (today they live in the page, not a block):

| id / selector | Use |
| --- | --- |
| `#offer-globe-canvas` | main WebGL canvas (position:fixed, z95) — required, else `init()` bails |
| `#offer-pin-spacer` | tall scroll driver; `getBoundingClientRect().top` + `offsetHeight` → `spacerOffsetTop`/`spacerHeight` |
| `#modal-card-canvas` | second WebGL canvas for the flown-out modal card (z115) |
| `#ca-r-offset`, `#ca-b-offset` | `feOffset` nodes in `#ca-filter` SVG; `dx` mutated per-frame |
| `#offer-pullquote` (`.offer-pullquote`) | fixed pull-quote; `.is-active` toggled by `zoomT` |
| `.offer-arc-copy` | fixed arc copy; inline styles driven per-frame |
| `#card-modal` + `.card-modal__backdrop` | modal dim/blur backdrop |
| `#card-modal-chrome` + `.card-modal__{nav--prev,nav--next,close,counter,image,name,description,badges,info}` | modal chrome (JS-positioned to the card's projected bounds) |
| `#globe-gallery-a11y` | **created** by `setupGlobeGalleryA11y()` (off-screen button list) |
| `#bp-badge` | optional dev breakpoint badge (may be absent) |

**Porting gotcha:** some refs are resolved at *module load* (e.g.
`var pqEl = document.getElementById('offer-pullquote')` at line 242), before any
block DOM exists. In the port, all DOM lookups must move into `init(el)` and be
scoped to the block element.

## Scroll model

`progress = clamp((scrollY - spacerOffsetTop) / spacerHeight, 0, 1)`.
Canvas is `position:fixed` covering the viewport; the spacer just supplies the
scroll distance (`850vh`). `arcCopyEntryT` ramps in over the ~1vh before the
spacer top. Phase constants (module-level):

```
P_PAN_END=0.55  P_ARC_PREROLL=0.30  P_GRID_ARC_START=0.30  P_GRID_ARC_END=0.60
P_FOLD_DUR=0.25  P_ZOOM_END=1.00  GRID_PEEL_STAGGER=0.20  SPHERE_INTERACTIVE_T=0.8
CA_ENABLED=true (chromatic aberration master switch)
```

## Breakpoints (resolved once in `init()`; crossing a boundary → `destroy()`+`init()`)

`desktop ≥1024`, `tablet 768–1023`, `mobile <768`. Per-BP knobs in `BREAKPOINTS`
(`N_TOTAL`, `ARC_SPAN`, `SPHERE_R`, `CARD_*`, `CAM_Z_*`, `GRID_COLS/ROWS`,
`ARC_DENSE_COUNT`). Desktop/tablet currently identical (45 cards, 9×5 grid);
mobile = 24 cards, 3×8 grid, smaller sphere.

## Key functions in offer-globe.js (line refs)

`init` 2879 · `destroy` 3010 · `tick` (render loop) 2182–2863 · `loadAllTextures`
676 · `buildCards` 750 · `computeGridLayout` 636 · `buildArcCtx` 343 ·
`fibSpherePos` 619 · modal: `openCardModal` 1561 / `closeCardModal` 1666 /
`navigateModal` 1743 / `populateModal` 1811 / `computeModalTarget` 951 /
`positionModalChrome` 1051 / `setupModal` 1932 · a11y `setupGlobeGalleryA11y` 1844
· CA `applyMotionCA` 2154 · pointer `onPointerDown/Move/Up` 861/870/876 ·
`handleCardClick` 896 · `onHover` 917.

## CSS slice for globe.css (globe-only selectors in offer-section.css)

Keep: `.offer-pin-spacer`, `.offer-world`, `.offer-arc-copy(+__title/__body)`,
`.offer-pullquote(+.is-active/__quote/__attribution/__name/__role)`,
`.card-modal*`, `.card-modal-chrome*`, `.card-modal__badge-icon--*`,
`.globe-gallery-a11y*`, and the `@media (max-width:767px)` block (line 560+).
Drop (tile variant): `.offer-card*`, `.offer-headline`, `.offer-copy*`.

## Reference pattern: pdf-space (`libs/mep/ace1205/pdf-space/`)

Same family of animation (arc→peel→…), already ported from a `prototype.html`.
The contract to mirror:

- `export default function init(el)` — `el` is the block element.
- `parseAuthoredContent(el)` reads the block's child rows for content/images.
- Builds a `.stage`, mounts the rAF loop, owns animation state.
- **Reduced-motion**: `matchMedia('(prefers-reduced-motion: reduce)')` → a static
  `buildNoMotion(el)` fallback; re-mounts on change.
- **Lifecycle**: `IntersectionObserver` (rootMargin 200px) starts/stops the loop;
  debounced `resize`; `MutationObserver` on `el.parentElement` tears down on removal.
- Imports `createTag` from `../../../utils/utils.js`, `debounce` from `../../../utils/action.js`.
- CSS auto-loaded by the block loader (same basename). Registered by adding the
  block name to `C2_BLOCKS` in `libs/utils/utils.js`.
- See pdf-space `README.md` — exemplary phase-timeline + JS↔CSS contract docs to
  emulate for the globe later.

## Porting plan (step 3 + 4)

1. **`globe.js` skeleton**: `export default function init(el)`. Wrap the existing
   IIFE body as an inner factory `createGlobe(root)` that takes the block element
   and returns `{ start, destroy }`. Convert module-load DOM lookups to lazy
   lookups inside `init`.
2. **Build DOM inside the block**: instead of expecting page-level ids, `init`
   creates the canvas / spacer / ca-svg / pullquote / arc-copy / modal chrome
   inside `el` (via `createTag`). Decide id vs class scoping (prefer scoping
   queries to `el`, keep ids the JS already uses by creating them on the built nodes).
3. **Replace gsap.ticker** with a `requestAnimationFrame` loop (`raf`/`cancelAnimationFrame`),
   gated by an `IntersectionObserver` like pdf-space.
4. **Replace Lenis** reads with `window.scrollY`; drop `__lenis.stop/start/scrollTo`
   (use native, or no-op during modal).
5. **THREE strategy** (decide): (a) vendor `three.min.js` into the block and load
   via Milo's `loadScript` so global `THREE` exists before `init` runs; or
   (b) switch to an ESM three build and `import * as THREE`. (a) is the
   lowest-risk first port; (b) is cleaner long-term. **Open question — confirm
   with user / Milo perf budget.**
6. **Assets**: 45 PNGs (~51MB total, unoptimized). For first port, host under a
   known base path (block asset dir or DA/CDN) and keep the `ALL_IMGS` list with
   a configurable base. Later: author via block rows like pdf-space, and optimize
   to webp. **Open question — asset hosting + authoring model.**
7. **Reduced-motion fallback** + **teardown observers** mirroring pdf-space.
8. **`globe.css`**: paste the globe slice, scope under `.globe` block class.
9. **Register** `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js:111`).
10. **Verify** against `_reference/globe-reference.html` per breakpoint.

## Open questions to resolve before/with step 3

- THREE delivery: vendored UMD global vs ESM import (perf budget, bundling).
- Asset hosting + authoring: hardcoded base path vs authored block rows; PNG→webp.
- Does the globe ship with the modal + a11y gallery + CA in v1, or is v1 the
  core arc→sphere→zoom only (modal/CA as fast-follow)?
- Smooth-scroll: ship without Lenis (native scroll) — confirm the feel is
  acceptable, or whether a Milo-approved smooth-scroll exists.

## Files created by this port

- `_reference/globe-reference.html` — trimmed, runnable globe-only host
  (uses `<base href="../hub-creative/">`; single main.js = `scripts/offer-globe.js`).
- `PROGRESS.md` — this file.
- `globe.js` / `globe.css` — the block (todo).
