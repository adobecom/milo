# globe — C2 block (WORK IN PROGRESS)

> **Future session: start here.** This file is the orientation/handoff. For deep
> architecture (phase timeline, DOM contract, function map, scroll math) read
> [`PROGRESS.md`](./PROGRESS.md) next.

## What this is

A scroll-driven **Three.js WebGL** hero being ported out of the `hub-creative`
prototype (the `offer-pin-spacer` / `offer-world` component) into a Milo C2
block. Over a tall (`850vh`) pinned scroll range, 45 photo cards:

1. **Arc** — rotate across the viewport on a circular arc (orthographic camera)
2. **Grid peel** — peel off the arc into a 9×5 grid (staggered)
3. **Sphere fold** — each card folds onto a fibonacci sphere as it lands
4. **Zoom** — a perspective camera flies through the sphere

Once the sphere forms it's **interactive**: drag to spin, tap a card to open a
detail **modal** (separate WebGL canvas + HTML chrome). Extras: per-frame
chromatic-aberration SVG filter, a fixed arc-copy overlay, a fixed pull-quote
that fades in near the end, and an off-screen a11y button gallery.

## Current state — what's done

The **prototype is ported and lands** (lint passes, parses clean). It was a
deliberate **verbatim-wrap**: the 3000-line prototype runtime was copied as-is
and wrapped in a Milo block entry point, so behavior is 1:1 with the original.
Visual verification in-browser is still **pending** (was not run this session).

| File | What it is |
| --- | --- |
| `globe.js` | The block. `export default init(el)` → loads THREE, builds DOM, runs the ported runtime (`createGlobeRuntime()`). **Has `/* eslint-disable */`** (see Gotchas). |
| `globe.css` | Globe-only CSS slice from the prototype's `offer-section.css`. |
| `three.min.js` | Vendored THREE (UMD global, ~670KB). Loaded via `loadScript`. |
| `assets/offer/*.png`, `assets/globe/*.png` | 23 + 22 card textures (~51MB, unoptimized). |
| `PROGRESS.md` | Deep architecture + porting notes + decisions + open questions. |
| `_reference/globe-reference.html` | Trimmed, runnable globe-ONLY copy of the original prototype. Open in a browser to see the target behavior. |
| `hub-creative/` | The **original prototype source** (read-only reference). Not shipped; eslint-ignored. The globe lives in `hub-creative/scripts/offer-globe.js`. |
| `globe.zip` | Original prototype archive (user-supplied). Ignore. |

Block is registered as `'globe'` in `C2_BLOCKS` (`libs/utils/utils.js`).
`.eslintrc.js` ignores `three.min.js`, `hub-creative/*`, `_reference/*`.

## The port, in one paragraph

`globe.js` = the prototype's `offer-globe.js` copied verbatim, with 5 surgical
changes: (1) the IIFE became a `createGlobeRuntime()` factory returning
`{ init, destroy }`; (2) `gsap.ticker` → a `requestAnimationFrame` driver
(`startTicker`/`stopTicker`); (3) Lenis scroll reads → `window.scrollY`, and the
modal's `Lenis.stop()` → a `.modal-open { overflow:hidden }` CSS lock; (4) texture
paths → `ASSET_BASE` (`import.meta.url`-relative); (5) a new
`export default async init(el)` that vendored-loads THREE, injects the required
DOM (`GLOBE_MARKUP`) into the block, instantiates the runtime, and tears down via
a `MutationObserver`. **Everything between the factory open and its
`return { init, destroy }` is unchanged prototype code** — treat it as such.

## How to run / verify

No Playwright (per project preference) — eyeball in a browser:

- **Original target behavior:** open `_reference/globe-reference.html` (e.g.
  `python3 -m http.server` from the `globe/` dir, then load
  `/_reference/globe-reference.html`). Serve over http, not `file://`, so
  textures aren't CORS-tainted to gray.
- **The ported block:** author a `globe` block on a C2 page/fragment and load
  with `?milolibs=local` against `npm run libs`; or unit-mount `globe.js`'s
  default export onto a `<div class="globe">`.

## What's next (iteration backlog)

Priority order for the refactor phase (the user said: get it ported first, then
"iterate and refactor together"):

1. **Visual verification** of the ported block in a real Milo page; fix any
   breakage vs `_reference/globe-reference.html`.
2. **Remove the `/* eslint-disable */`** — rewrite the runtime to Milo style
   (no-var, naming, max-len). This is the bulk of the cleanup.
3. **Scope DOM to `el`** instead of global ids → allow >1 globe per page.
4. **Asset strategy** — decide authored-rows (like pdf-space) vs bundled; convert
   PNG→webp to cut the ~51MB.
5. **THREE delivery** — keep vendored UMD global, or switch to ESM
   `import * as THREE` / Milo `/deps/`.
6. **Static reduced-motion fallback** (currently the section just collapses via
   `.globe--reduced`).
7. **Authoring contract** — today copy (arc-copy text, pull-quote, card metadata)
   is hardcoded in `globe.js`. Decide what authors control and parse it from the
   block rows, mirroring pdf-space's `parseAuthoredContent`.

See **Open questions** at the bottom of `PROGRESS.md` for the decisions blocking
some of these.

## Gotchas for future-you

- **`globe.js` lint is disabled on purpose.** It's verbatim ES5. Don't "fix lint"
  piecemeal — it's tracked as a single refactor task (#2 above). Parse errors
  still surface; style errors don't.
- **Don't edit inside the factory casually.** The 3000 lines between
  `function createGlobeRuntime()` and its `return { init, destroy }` are ported
  prototype code. Cross-reference `hub-creative/scripts/offer-globe.js` (and its
  line-ref map in `PROGRESS.md`) before changing render/phase logic.
- **DOM is built by JS, not authored.** `init(el)` injects `GLOBE_MARKUP`. The
  runtime finds nodes by **global id** (`#offer-globe-canvas`, `#offer-pullquote`,
  `#card-modal*`, …) → **one globe per page** until step 3 above.
- **`el` becomes the `850vh` scroll spacer** (`.globe.offer-pin-spacer`). The
  canvas is `position:fixed`; the block just supplies scroll distance.
- **Reference, not source of truth:** `hub-creative/` and `globe.zip` are the
  prototype. The block is `globe.js`/`globe.css`. Keep them from drifting — if
  you change animation behavior, note it here.
- **Pattern to copy:** `libs/mep/ace1205/pdf-space/` is the same family of
  animation already fully ported (with an exemplary `README.md`). Use it as the
  model for the refactor (authoring contract, reduced-motion, IntersectionObserver
  lifecycle, JS↔CSS custom-property bridge).
