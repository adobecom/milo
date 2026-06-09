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
| 5. Authoring layer (3-row contract + fragment fetch) | ✅ |
| 6. THREE → ESM import; local `package.json` build | ✅ |
| 7. Visual verification + iterate | ⬜ (next) |

## Decisions made in the port

The 3059-line prototype runtime was adapted into a Milo block entry point:

- **THREE**: `import * as THREE from './three.module.min.js'` — static ES module
  import. `three.module.min.js` is a tree-shaken build (~453KB vs 655KB full)
  produced by esbuild from `src/three.js`, which re-exports only the 21 symbols
  globe.js uses. Built via `npm run build` in the globe directory (local
  `package.json`, `devDependencies: { three: "0.160.1", esbuild }`). Not part of
  milo's root `package.json`.
- **gsap** dropped → `startTicker`/`stopTicker` (requestAnimationFrame) at the
  top of `createGlobeRuntime()`.
- **Lenis** dropped → `window.scrollY`; modal scroll-lock now via the
  `modal-open` class (`overflow:hidden`) in `globe.css` instead of `Lenis.stop()`.
- **Assets**: card images come entirely from authored content (DA fragment).
  The old 45 bundled placeholder PNGs and `ASSET_BASE` have been removed.
- **DOM**: `init(el)` builds the canvas/world/ca-svg/arc-copy/pull-quote/modal
  markup (`GLOBE_MARKUP`) inside the block and sets `el.id='offer-pin-spacer'`.
  Runtime still looks nodes up by global id → **one globe per page for now.**
- **Lint**: `globe.js` carries a file-level `/* eslint-disable */` (ES5 `var`,
  naming, max-len). `.eslintrc.js` ignores `three.module.min.js`, `hub-creative/*`,
  `_reference/*`. Remove the disable during the refactor pass. Parse-correctness
  still verified (eslint reports 0 errors).
- **Reduced motion**: skip WebGL, add `.globe--reduced` (collapses the tall
  spacer). Proper static poster fallback is a TODO.
- **Block class**: loader adds `.globe`; CSS targets `.globe.offer-pin-spacer`.

## Module split (readability pass)

`globe.js` (3381 → ~3024 lines) was partially split. Three **self-contained**
modules were extracted: `authoring.js`, `markup.js`, `shaders.js` (GLSL strings).
`globe.js` imports all three.

The tuning constants (`CARD_ASPECT`, `BREAKPOINTS`, `resolveBP`, the phase/physics/CA
block) and pure helpers (easing, `lerpN`/`lerpV3`, `fibSpherePos`) live **at module
scope inside `globe.js`**, grouped under `// ── Section ──` headers (pdf-space style).
They were briefly extracted to `config.js`/`math.js` but folded back in on request —
bare const names are kept (no `ANIM_CONFIG`-object collapse) so the render loop
reads them unchanged.

What did **not** move: the stateful render core (`tick`, modal, a11y, pointer/hover,
`init`/`destroy`) and its ~80 shared closure `let`s. Splitting those needs a shared
state object threaded through every function — a tracked refactor task, deferred
(see the "Aggressive" option that was declined). The only mechanical edit in that
region was relocating `let _sphereDragWarp` from the
(now module-scope) constants block into the State section. Each extracted module
keeps the `/* eslint-disable */` banner so delint stays one tracked task.

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
Without `#_dnb`, Milo would start injecting sections one-by-one before `init()`
fires, creating a race condition where only the first section was in the DOM.

Fragment href survives the `buildGlobeDom` DOM wipe because it's extracted first.
Fallback chain: fetched cards → partial DOM cards (if Milo already resolved the
link, e.g. legacy pages) → `[]`.

### Card object shape
`{ img, picture, name, role, description, badges:[{app:{id,name,abbr}, role}] }`

Each section in the fragment is flat P/UL elements:
`<p><em>role</em></p>` · `<p><strong>name</strong></p>` · plain `<p>` description ·
`<ul>` with nested `<ul><li>` per badge · `<p><picture>` image.

`APP_CATALOG` (module scope) maps badge app names/abbr/id → `{id,name,abbr}` for
brand icon CSS classes. `getCardMetadata(i)` wraps `CARD_CONTENT` by modulo so any
authored count fills `N_TOTAL` (45/24) without breaking grid math.

**Open:** align `N_TOTAL`/grid to the authored card count instead of wrapping.

## Deliberate divergences from the prototype

These are the places `globe.js`/`globe.css` intentionally differ from
`hub-creative/scripts/offer-globe.js` in *behavior*. Keep this list current.

- **Desktop/tablet modal layout — white info card overlaid on the image.** The
  `hub-creative` source anchored a fixed-width (`DT_INFO_WIDTH`) info panel to
  the viewport's bottom-right (`positionModalChrome` desktop branch); because the
  authored card images are portrait, that panel landed in empty space *beside*
  the centered image. The actual design target (user screenshots) is a **solid
  white info card** overlapping the image's lower portion with **dark text**,
  plus **white nav buttons in the margin outside the image**, and a dark frosted
  close button at the image's top-right. So the desktop branch now anchors all
  chrome to the image's projected bounds:
  - info card → overlays the image's lower area, left-aligned, inset by `INSET`
    (24px + SDF corner radius) on left/right/bottom so it nests inside the
    image's rounded corners. Styled white + dark text via `@media (min-width:
    768px)` in `globe.css` (`.card-modal__info` background `#fff`, name `#1d1d1d`
    40px, role/desc/badge-role grey, badge-app dark). The 96px desktop
    `__badges` gap was cut to 20px.
  - nav arrows → white buttons (`@media min-width:768px`) positioned OUTSIDE the
    image's left/right edges (`visLeft − NAV_GAP − DT_NAV_W` / `visRight +
    NAV_GAP`), clamped to a 16px viewport inset, vertically centered on the image.
  - close → dark frosted, image top-right. counter → just below the image.

  Mobile (<768px) is unchanged: dark frosted panel + light text, panel beneath
  the asset. The diverging JS block carries a `DELIBERATE DIVERGENCE` comment.
  The old `DT_INFO_WIDTH`/`DT_INFO_MARGIN`/`DT_CLOSE_INSET`/`DT_NAV_INSET`/
  `DT_IMG_INFO_GAP` constants are now unused on desktop but left in place (they
  document the old design).

- **Entry timing split into `ENTRY_LEAD_VH` + `ENTRY_RAMP_VH`.** The prototype
  hardcoded the entry as `entryStart = spacerOffsetTop − H*0.85`, `entryRange =
  H*0.85 + H*0.20` (≈1.05H). The `0.85` did double duty: it was both *when* the
  entry starts (0.85 viewport-heights before the block top) and part of *how
  long* the ramp is. With blocks above the globe, starting 0.85H early sweeps the
  arc across the preceding content (the WebGL canvas is transparent, so it's the
  card meshes — not a dark sheet — that overlap). These are now two independent
  constants (module scope in `globe.js`, under the "Entry timing" section):
  - `ENTRY_LEAD_VH` (default `0.4`) — viewport-heights before the spacer top that
    the entry begins. Feeds `entryStart` and the canvas `showTrigger`. `0` = only
    once the block top hits the viewport top (no overlap, feels late); `0.85` =
    the prototype's hero pre-roll.
  - `ENTRY_RAMP_VH` (default `1.05`, = prototype) — ramp length over which
    `arcCopyEntryT` goes 0→1; sets arc-copy fade speed, arc pre-roll speed, and
    the text→arc gap. Feeds `entryRange`. Keeping this independent of the lead
    fixes the regression where dropping the lead to 0 compressed the ramp to
    0.20H and made the arc rotate/peel ~5× too fast.

- **`.globe` type-scale tokens in `globe.css`.** The prototype relied on
  `:root` tokens from its `styles/global/typography.css` (not shipped); Milo
  defines none of them, so the pull-quote/arc-copy fell back to default 16px
  text. `globe.css` now defines the needed `--font-display`/`--type-title-1-*`/
  `--type-body-*` tokens scoped to `.globe`, with the prototype's tablet/mobile
  breakpoints. Keep in sync with `hub-creative/styles/global/typography.css`.

## How to test (no Playwright per user)

1. Open `_reference/globe-reference.html` (original prototype, globe-only) to see
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
| `scripts/offer-arc.js` | CSS/GSAP arc (not WebGL, not ported). | ❌ |
| `scripts/offer-toggle.js` | Prototype dev toggle; spacer height + init call. | ❌ logic folds into the block |
| `styles/offer-section.css` (650 lines) | Prototype CSS. Globe slice ported to `globe.css`. | ⚠️ slice only |
| `vendor/three.min.js` (670KB, UMD r160) | THREE global. | ✅ replaced by `three.module.min.js` (ESM, local `package.json`) |
| `vendor/gsap.min.js` | Only `gsap.ticker` is used by the globe. | ❌ replace with rAF |
| `vendor/ScrollTrigger.min.js` | Not used by the globe. | ❌ drop |
| `assets/images/offer/arc-01..23.png` (23) + `assets/images/globe/…` (22) | 45 card textures. | ✅ removed — images are authored via DA fragment |

## External dependencies — verdict

- **THREE** — ✅ resolved. `import * as THREE from './three.module.min.js'` (ESM r160).
  Built locally via `package.json` in this directory; not in milo's root deps.
- **gsap** — ✅ dropped. Replaced by `startTicker`/`stopTicker` (requestAnimationFrame).
- **Lenis** — ✅ dropped. `window.scrollY` throughout; modal scroll-lock via CSS.
- **ScrollTrigger** — ✅ unused, never ported.

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

**Porting gotcha:** some refs are resolved at *module load* (e.g.
`var pqEl = document.getElementById('offer-pullquote')` at line 242), before any
block DOM exists. In the port, all DOM lookups must move into `init(el)` and be
scoped to the block element.

## Scroll model

`progress = clamp((scrollY - spacerOffsetTop) / spacerHeight, 0, 1)`.
Canvas is `position:fixed` covering the viewport; the spacer just supplies the
scroll distance (`850vh`). `arcCopyEntryT` ramps 0→1 over `ENTRY_RAMP_VH`
viewport-heights (default `1.05`), starting `ENTRY_LEAD_VH` (default `0.4`)
before the spacer top — see the entry-timing divergence note above. Phase constants (module-level):

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

Ported: `.offer-pin-spacer`, `.offer-world`, `.offer-arc-copy(+__title/__body)`,
`.offer-pullquote(+.is-active/__quote/__attribution/__name/__role)`,
`.card-modal*`, `.card-modal-chrome*`, `.card-modal__badge-icon--*`,
`.globe-gallery-a11y*`, and the `@media (max-width:767px)` block.
Not ported (prototype-only): `.offer-card*`, `.offer-headline`, `.offer-copy*`.

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

## Completed porting steps (historical)

1. ✅ `globe.js` skeleton: `export default async init(el)`, runtime as `createGlobeRuntime()` factory.
2. ✅ DOM built inside the block via `GLOBE_MARKUP` / `buildGlobeDom(el)`.
3. ✅ gsap.ticker replaced with `startTicker`/`stopTicker` (requestAnimationFrame).
4. ✅ Lenis replaced with `window.scrollY`; modal scroll-lock via `.modal-open` CSS.
5. ✅ THREE: ESM import (`./three.module.min.js`), built via local `package.json`.
6. ✅ Authoring: 3-row block contract + fragment fetch via `.plain.html`.
7. ✅ Reduced-motion: `.globe--reduced` collapses the spacer (static poster TBD).
8. ✅ `globe.css`: globe slice from `offer-section.css`, scoped under `.globe`.
9. ✅ Registered as `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js`).

## Open questions

- Does the globe ship with the modal + a11y gallery + CA in v1, or is v1 the
  core arc→sphere→zoom only (modal/CA as fast-follow)?
- Smooth-scroll: confirm native `window.scrollY` feel is acceptable, or whether a
  Milo-approved smooth-scroll exists.
- Align `N_TOTAL`/grid to the authored card count instead of wrapping to fill 45/24.

## Files in this directory

- `globe.js` / `globe.css` — the block. `globe.js` holds the tuning constants +
  pure helpers (module scope, grouped by `// ── Section ──`), the stateful runtime
  core (`createGlobeRuntime()` + `export default init`), and imports the modules below.
- `authoring.js` — `parseAuthoredContent`, `fetchFragmentCards` (+ internal parsers).
- `markup.js` — `GLOBE_MARKUP` + `buildGlobeDom`.
- `shaders.js` — `CARD_VERT`/`CARD_FRAG`, `_MODAL_VERT`/`_MODAL_FRAG` GLSL strings.
- `src/three.js` — build entry; re-exports the 21 Three.js symbols globe.js uses.
- `three.module.min.js` — tree-shaken Three.js r160 ESM build (~453KB, build artifact, do not edit).
- `package.json` / `package-lock.json` — local build; `npm install && npm run build` regenerates `three.module.min.js`.
- `_reference/globe-reference.html` — trimmed, runnable globe-only host (uses `<base href="../hub-creative/">`).
- `hub-creative/` — original prototype source (read-only reference).
- `PROGRESS.md` — this file.
