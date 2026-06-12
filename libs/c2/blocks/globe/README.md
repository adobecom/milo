# globe — C2 block

A scroll-driven **Three.js WebGL** hero. Status: **work in progress** — ported
and visually verified in a real Milo page. Core arc→grid→sphere→zoom is the v1
target; modal, a11y gallery, and chromatic aberration (CA) are fast-follow.

## What it is

Over a tall (`850vh`) pinned scroll range, 45 photo cards animate through four
phases:

```
0.00–0.55  Arc       cards rotate across the viewport on a circular arc (ortho cam)
0.30–0.60  Grid peel cards peel off the arc into a 9×5 grid (staggered)
~0.37–0.78 Sphere    each card folds onto a fibonacci sphere as it lands
0.78–1.00  Zoom      a perspective camera flies through the sphere
```

Once the sphere forms (`sphereFormT >= 0.8`) it's **interactive**: drag to spin,
tap a card to open a detail **modal** (separate WebGL canvas + HTML chrome).
Extras: per-frame chromatic-aberration SVG filter, a fixed arc-copy overlay, a
fixed pull-quote that fades in near the zoom end, and an off-screen a11y button
gallery mirroring the sphere cards.

## Files

| File | What it is |
| --- | --- |
| `globe.js` | The block. `export default init(el)` → builds DOM, runs the runtime (`createGlobeRuntime()` → `{ init, destroy }`). Holds tuning constants + pure helpers (module scope, grouped by `// ── Section ──`) and the stateful render core (`tick`, modal, a11y, pointer, lifecycle). |
| `authoring.js` | Authoring layer: `parseAuthoredContent` + `fetchFragmentCards` (+ internal parsers, `APP_CATALOG`). Reads the 3 block rows, fetches the card fragment. |
| `markup.js` | `GLOBE_MARKUP` + `buildGlobeDom(el)` — the canvas/overlay/modal DOM the runtime expects. Default export. |
| `shaders.js` | GLSL strings: `CARD_VERT`/`CARD_FRAG`, `MODAL_VERT`/`MODAL_FRAG`. |
| `globe.css` | Globe-only CSS. Also defines `.globe`-scoped type-scale tokens (see Behavior notes). |
| `src/three.js` | Build entry — re-exports only the 21 Three.js symbols globe.js uses. |
| `three.module.min.js` | Tree-shaken Three.js r160 ESM build (~453KB). Build artifact — do not edit. |
| `package.json` | Local mini build. `npm install && npm run build` regenerates `three.module.min.js`. |
| `_reference/globe-reference.html` | Trimmed, runnable globe-only copy of the original prototype — the target behavior. |
| `hub-creative/` | Original prototype source (read-only reference, not shipped, eslint-ignored). |

Registered as `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js`). `.eslintrc.js`
ignores `three.module.min.js`, `hub-creative/*`, `_reference/*`.

All four JS files are **airbnb-clean** (`npx eslint` exit 0). The only exceptions
are 5 targeted `// eslint-disable-next-line no-use-before-define` comments in
`globe.js` for genuine forward refs (rAF driver → `tick`, click → `openCardModal`,
`initRuntime` ↔ `destroy`). No blanket `/* eslint-disable */`.

## How to run / verify

No Playwright (per project preference) — eyeball in a browser, served over http
(not `file://`, or textures CORS-taint to gray):

- **Target behavior:** serve the `globe/` dir (`python3 -m http.server`) and open
  `/_reference/globe-reference.html`.
- **The ported block:** authored at
  `https://www.adobe.com/homepage/drafts/jingleh/globe-dev` with a 45-card
  fragment at `/homepage/fragments/drafts/jingle/globe-cards-filled`. Load with
  `?milolibs=local` against `npm run libs`, or against the stage CDN.

To regenerate Three.js after adding a new `THREE.*` call: add the symbol to
`src/three.js`, then `cd libs/c2/blocks/globe && npm install && npm run build`.

## Authoring contract

The block expects **three direct child rows**:

| Row | Purpose | Content |
| --- | --- | --- |
| 0 | **Arc-copy** | heading → `.offer-arc-copy__title`; `<p>` → `.offer-arc-copy__body` |
| 1 | **Cards** | a Milo fragment link with `#_dnb` appended (see below) |
| 2 | **Pull-quote** | heading → quote; first `<p>` → name; second `<p>` → role |

Row roles are detected by whether the row contains a `<picture>`/`<img>` (only
card rows do). `parseAuthoredContent(el)` returns
`{ cards, arcCopy, pullQuote, fragmentHref }`.

### Fragment loading

Row 1 links a DA fragment **with `#_dnb` appended** (e.g.
`/homepage/fragments/…/globe-cards#_dnb`). `#_dnb` tells Milo's
`decorateAutoBlock()` to skip auto-resolution so the raw `<a href>` stays in the
DOM. `fetchFragmentCards(href)` strips the hash and fetches `href + '.plain.html'`
itself — AEM Edge Delivery returns all card sections as bare `<div>`s (one per
`---`). Without `#_dnb`, Milo injects sections one-by-one before `init()` fires,
racing the parse.

Fallback chain: fetched cards → partial DOM cards (legacy auto-resolved pages) → `[]`.

### Card shape

`{ img, picture, name, role, description, badges:[{app:{id,name,abbr}, role}] }`

Each fragment section is flat P/UL elements:

| Element | Becomes | Notes |
| --- | --- | --- |
| `<p><em>…</em></p>` | **role** | defaults to "Photographer" |
| `<p><strong>…</strong></p>` | **name** | |
| plain `<p>` | **description** | shown in the modal |
| `<ul>` with nested `<ul><li>` per badge | **badges** | outer li = app name, inner li = role |
| `<p><picture>…</picture></p>` | **image** | required — sections without one are skipped |

Badge app names resolve against `APP_CATALOG` (by name/abbr/id) for brand icon
colors; unknown apps render with a derived abbreviation. `N_TOTAL` follows the
authored card count, capped at the per-BP grid capacity (45 desktop/tablet = 9×5,
24 mobile = 3×8). Fewer cards → the last grid column is partially filled; more →
extras are dropped. No modulo wrapping (`getCardMetadata(i)` indexes directly).

## Architecture notes

**DOM is JS-built and scoped to the block root.** `init(el)` calls
`parseAuthoredContent(el)` first (arc-copy, pull-quote, fragment href), then
`buildGlobeDom(el, gid)` wipes the block and injects the markup. The runtime
finds nodes by **class, queried within `el`** (`root.querySelector('.offer-globe-canvas')`,
`.modal-card-canvas`, `.offer-pullquote`, `.card-modal*`, `.ca-r-offset`/`.ca-b-offset`,
…) → **multiple globes can coexist on a page**. The only id-bearing nodes are
made unique per instance via a `gid` suffix: the CA SVG filter (referenced as
`filter: url(#ca-filter-<gid>)`) and the modal heading (the dialog's
`aria-labelledby` target). `el` itself becomes the `850vh` scroll spacer
(`.globe.offer-pin-spacer`); the canvas is `position:fixed`. Body-level globals
that remain shared (acceptable, one modal at a time): the `.modal-open` scroll
lock and the keyboard focus-ring overlay.

**Scroll model.** `progress = clamp((scrollY - spacerOffsetTop) / spacerHeight, 0, 1)`.
Milo's page-level Lenis keeps `window.scrollY` in sync (gsap was dropped for a
`requestAnimationFrame` driver, `startTicker`/`stopTicker`). The modal pauses
Lenis via `window.lenis.stop()/start()` plus a `.modal-open { overflow:hidden }`
CSS lock. Phase constants (module scope):

```
P_PAN_END=0.55  P_ARC_PREROLL=0.30  P_GRID_ARC_START=0.30  P_GRID_ARC_END=0.60
P_FOLD_DUR=0.25  P_ZOOM_END=1.00  GRID_PEEL_STAGGER=0.20  SPHERE_INTERACTIVE_T=0.8
CA_ENABLED=true
```

**Entry timing** is split into two independent constants (module scope):
- `ENTRY_LEAD_VH` (default `0.4`) — viewport-heights before the spacer top that
  the entry begins. `0` feels late; `0.85` is the prototype's hero pre-roll but
  sweeps card meshes over preceding content.
- `ENTRY_RAMP_VH` (default `1.05`) — ramp length over which `arcCopyEntryT` goes
  0→1 (arc-copy fade, arc pre-roll speed, text→arc gap).

**Breakpoints** resolve once in `init()`; crossing a boundary → `destroy()`+`init()`.
`desktop ≥1024`, `tablet 768–1023`, `mobile <768`. Per-BP knobs in `BREAKPOINTS`
(`N_TOTAL`, `ARC_SPAN`, `SPHERE_R`, `CARD_*`, `CAM_Z_*`, `GRID_COLS/ROWS`,
`ARC_DENSE_COUNT`). Desktop/tablet identical (45 cards, 9×5); mobile = 24 cards,
3×8, smaller sphere.

**Reduced motion**: skips WebGL and adds `.globe--reduced` (collapses the spacer).
A static poster fallback is a TODO.

## Behavior notes (intentional differences from the prototype)

- **Desktop/tablet modal — white info card overlaid on the image.** The prototype
  anchored a fixed-width info panel to the viewport's bottom-right, which landed
  beside the (portrait) image in empty space. Desktop/tablet now anchor all chrome
  to the image's projected bounds: a solid white info card overlapping the image's
  lower area (inset by `INSET` = 24px + corner radius), dark text, white nav arrows
  in the margin *outside* the image, a dark frosted close button at the image's
  top-right, and the counter below the image. Styled via `@media (min-width:768px)`
  in `globe.css`. Mobile (<768px) is unchanged: dark frosted panel + light text
  beneath the asset. The diverging JS block carries a `DELIBERATE DIVERGENCE` comment.
- **`.globe`-scoped type-scale tokens in `globe.css`.** The prototype relied on
  `:root` tokens from a typography stylesheet Milo doesn't ship. `globe.css` defines
  the needed `--font-display`/`--type-title-1-*`/`--type-body-*` tokens scoped to
  `.globe`. Keep in sync with `hub-creative/styles/global/typography.css`.

## Open items / backlog

Done: ~~visual verification~~ (confirmed in a real Milo page); ~~scope DOM to `el`~~
(now class-scoped to the block root, multiple globes per page supported);
~~align `N_TOTAL`/grid to authored count~~ (fixed grid, partial fill — see
authoring contract); ~~scroll feel~~ (on a c2 page Milo loads Lenis with
`autoRaf:true` in `utils.js`, so `window.scrollY` *is* the Milo-approved
smooth-scroll position — no separate setup needed); ~~v1 scope decided~~ (core
arc→grid→sphere→zoom; modal + a11y + CA are fast-follow).

Remaining:
1. **Static reduced-motion poster** (currently the section just collapses).

## Model to copy

`libs/mep/ace1205/pdf-space/` is the same family of animation, already fully
ported (authoring contract, reduced-motion, IntersectionObserver lifecycle,
JS↔CSS custom-property bridge). Use it as the reference for refactor work.
