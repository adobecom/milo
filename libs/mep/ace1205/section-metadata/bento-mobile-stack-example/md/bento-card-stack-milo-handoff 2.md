# Bento card stack — engineer handoff (Milo port)

Concise reference for re-implementing the PDF Capabilities bento stack in Milo.

## 1. What this stack is

It is **not** a React-driven carousel. It is the **Milo elastic-carousel mobile sticky-stack pattern**: each row is `position: sticky` at a shared Y line, while **scroll-linked animations** (`animation-timeline: view()`) move each slot’s `transform`, `opacity`, `filter`, and scale so cards **peek, stack, and exit** as you scroll.

Canonical Milo source called out in-repo: `libs/c2/blocks/elastic-carousel/elastic-carousel.css` (mobile rules ~L291–L376). This prototype uses the **same class contract** as `offer-mobile-proto` (which itself ports Milo’s behavior) so CSS ports cleanly.

**Note on class names:** In Milo’s source the sticky row is described around `.elastic-carousel-item` (see comments in `product-page.css` citing elastic-carousel.css ~L312–L322). Here the slot wrapper is **`.card-slot`** — same role, **offer-mobile-proto / StackCard naming**, not the literal Milo block class string.

## 2. Milo `elastic-carousel` defaults vs this stack

Use this section to see what you can lift **verbatim** from Milo vs what was **already changed in offer-mobile-proto** vs what is **Acrobat / PDF Capabilities–specific**.

### 2.1 Unchanged from Milo’s mobile stack idea

These match the **intent and math** of `libs/c2/blocks/elastic-carousel/elastic-carousel.css` (mobile sticky + scroll-driven motion):

- **`position: sticky`** on each slot with a shared **`top: var(--card-front-y)`** (pin line).
- **Per-slot anonymous `animation-timeline: view()`** with **`animation-range: entry 0% exit 100%`** so motion continues while the element is stuck (timeline follows the element’s scroll progress in the document).
- **Peek offset formula** for `--stack-offset`:

  `var(--last-offset) - (var(--last-offset) / var(--slides) * (slides - n + 1)) - var(--offset-variance-index) * (slides - n + 1)`

  (Same structure Milo documents around L327–L362; **N** is extended when `--slides` > Milo’s shipped slot count — see below.)
- **Keyframe trio** for slot motion: default `elasticMobileStackSlides`, deepest variant **`elasticMobileStackSlidesIgnoreOpactity`** (Milo’s historical typo in the name is **preserved on purpose** for parity), front **`elasticMobileStackSlidesFront`** so the focal card stays at full opacity end-to-end.
- **Slot motion**: `translateY` from `--stack-offset` toward `calc(var(--stack-offset) - var(--offset-adjuster))`, opacity ramp, optional **`filter: contrast(...)`** in the stacked phase.
- **Per-slot** `--stack-scale`, `--stack-shrink`, `z-index`, and the **deepest vs front** animation-name split.

### 2.2 Changed from Milo’s shipped slot count (structural)

- **Milo’s referenced mobile block** is written around **five** stacked slots (see prototype comments: elastic-carousel.css ~L291–L376, **5-slot** mobile sticky-stack).
- **offer-mobile-proto** adapted that to **three** cards for the offer page.
- **This Acrobat prototype** extends the **same nth-child / formula pattern** to **six** cards:
  - Section sets **`--cards-count: 6`** (inline from React) and **`.stack-section`** maps **`--slides: var(--cards-count)`**.
  - CSS defines **`.card-slot:nth-child(1)` … `:nth-child(6)`** with the formula above (each line uses the correct `(slides - n + 1)` multiplier for that slot).

**Milo port implication:** If you only paste Milo’s first N rules, you must **duplicate the pattern** for every card in your fragment, or generate rules from card count.

### 2.3 Changed from Milo `:root` tuning (numeric tokens)

On **`:root`** in `product-page.css`, generic elastic defaults include e.g. **`--slides: 3`**, **`--last-offset: 2.5rem`**, **`--offset-adjuster: 50px`**, **`--offset-variance-index: -2px`**.

**`.pdf-capabilities`** overrides for this page’s tighter stack / motion:

- **`--last-offset: 70px`**
- **`--offset-adjuster: 70px`**

So the **elastic drift amplitude and peek spacing** here are **not** Milo’s global defaults; they match the **six-card Acrobat tuning** called out in comments (“Six-slot peek tuning”).

### 2.4 Changed from Milo: card “shrink” implementation (offer-mobile-proto)

Milo’s original elastic treatment is described in-repo as **margin-based shrink**. **offer-mobile-proto** replaced that with **scale-based shrink** so copy does not reflow mid-scroll:

- **`@keyframes elasticItemsShrink`** on **`.stack-card`**: holds **natural scale ~0–20%** of the view timeline, then scales to **`var(--stack-scale)`** while **`box-shadow`** interpolates from flat (`--bento-shadow-none`) to elevated (`--bento-shadow`).

That **`elasticItemsShrink` + shadow ramp** stack is **offer enhancement**, not the raw Milo margin approach — keep it if you want pixel parity with this prototype / offer page.

### 2.5 Acrobat-only: bento molecule visuals (not Milo elastic defaults)

These layers are **Figma “Bento / Molecule”** layout and depth dressing, layered on top of the elastic slot motion:

- **`.stack-card::after`** + **`bentoOverlayDeepen`** — black overlay opacity tied to scroll, per-slot **`--bento-overlay`** (deepest strongest, front **0**).
- **Six-step** **`--bento-surface-d6-1` … `-d6-6`** assigned per slot so grey ramps read across **six** depths (comments note three Figma anchors expanded to six stops so mid cards don’t merge into one grey).
- **`.stack-card--media-top` / `--photo`**, **327/300** image frame, **460/850** asset slot, **`object-fit: contain`** on media-top exports.
- **`.pdf-capabilities .stack-card`** forces **`--bento-shadow: none`** and **`--bento-shadow-none: none`** — **no** compound drop shadow on these cards in this section (differs from offer’s elevated bento shadow tokens on the same class family).

### 2.6 Acrobat-only: section / title choreography vs generic `.stack-section`

The **generic** `.stack-section` + **`.stack-title`** block in this stylesheet (ported from offer-mobile-proto) assumes a **sticky title** with **dual scroll animations** (entry stagger + exit “card-match” `translate` catchup) and a default **`--card-front-y`** tied to **title height + gap**.

**PDF Capabilities overrides that entire title behavior:**

- **`.pdf-capabilities.stack-section`** sets **`--card-front-y: var(--title-top)`** so cards pin **under the nav**, not under a sticky headline (intro scrolls away in document flow first — Figma choreography).
- **`.pdf-capabilities .stack-title`** resets to **`position: static`**, removes stack-title animations, **`will-change: auto`**, full opacity — **none** of the Milo/offer **stack-title-stagger** / **stack-title-card-match** behavior runs here.

So the **named view timelines** (`--section-vt`, `--stack-title-vt`) still exist on the section for **section exit** and for **downstream content** (e.g. Quick Actions) that keys off the same timeline, but the **headline is not driving `--card-front-y` or sticky title motion** in V1.

### 2.7 Acrobat-only: layout wrappers and scroll slack

Not from Milo elastic-carousel itself:

- **`.pdf-capabilities-sticky-stack`**, **`.pdf-capabilities-sticky-head-bounds`**, **`.pdf-capabilities-sticky-head`** — lede structure, z-index vs cards, **ResizeObserver** height for CSS vars.
- **`.pdf-capabilities .stack-cards`**: **`gap: 0`** (base `.stack-cards` uses **8px** gap elsewhere), **`padding-top: 58px`**, **`padding-bottom: 40px`**, **`::after` spacer height** (`12 * --phone-vh` in V1, shorter in **V2**) to control how long the front card **stays pinned** before exit.

### 2.8 Prototype-only: `data-bento-variant="v2"`

**V2** adds **sticky lede slab**, **`will-change: auto`** on the section (fixes sticky containing-block issues), **JS-computed `--card-front-y`**, adjusted **`.stack-cards` padding-top** and **`::after` height**. Milo’s stock elastic-carousel block does not define this variant; treat it as **authoring / product A–B**, not upstream Milo.

### 2.9 Summary table

| Area | Milo elastic mobile stack | This prototype |
|------|---------------------------|----------------|
| Slot count | ~5 in cited Milo file | **6** (`--cards-count` / nth-child 1–6) |
| Slot class (name) | `.elastic-carousel-item` (in Milo) | **`.card-slot`** (offer / StackCard naming) |
| `--last-offset` / `--offset-adjuster` | `:root` defaults (e.g. 2.5rem / 50px) | **70px / 70px** on `.pdf-capabilities` |
| Card shrink | Margin-based (Milo) | **Scale + shadow** keyframes (**offer** pattern) |
| Card chrome | Generic carousel card | **Bento molecule** + optional **overlay**; **shadows off** in PDF section |
| Title + `--card-front-y` | Sticky title + gap math | **Static title**; **`--card-front-y` = `--title-top`** (V1) or **JS** (V2) |
| Wrapper / slack | Block-internal only | **PDF-specific** sticky stack + **::after** scroll tail |

## 3. React layer (data + layout measurement only)

**File:** `src/product/sections/PdfCapabilities.tsx`

Responsibilities:

1. **Markup shell** — section + sticky group + card list.
2. **`--cards-count`** — set on the section (e.g. `6`) so CSS `--slides` matches the number of DOM children.
3. **ResizeObserver** — measures `.pdf-capabilities-sticky-head` height → sets `--pdf-sticky-header-h` (used in exit math and fallbacks).
4. **Variant V2** — sets `--card-front-y` in px from fixed pin/gap constants + measured slab height (must not use `getBoundingClientRect` every frame on the moving stack; the comment in the source explains why).

The cards themselves are dumb presentational components: **`src/product/sections/BentoCard.tsx`** maps data → DOM with classes `.card-slot` > `.stack-card` > image area / type. **No React state** for scroll.

## 4. DOM contract (what Milo CSS expects)

Rough tree:

```text
section.stack-section.pdf-capabilities  [view-timeline-name: --section-vt, --stack-title-vt]
  .pdf-capabilities-sticky-stack
    .pdf-capabilities-sticky-head-bounds   (V2: bounds sticky to end at stack start)
      .pdf-capabilities-sticky-head        [ref: measured height]
        …eyebrow, h2.stack-title, intro…
    .stack-cards
      .card-slot[data-card-idx] × N
        article.stack-card.stack-card--media-top | --photo
          .stack-card-image-area > .stack-card-asset > img.stack-card-asset-img
          .stack-card-type > h3, p
```

Sticky stacking applies to **`.card-slot`**, not the inner `article`. The **article** (`.stack-card`) runs the **shrink + shadow + overlay** animations on the **same** anonymous `view()` timeline as its parent slot (both use `animation-range: entry 0% exit 100%`).

## 5. Core CSS concepts

**File:** `src/product/styles/product-page.css` (PDF Capabilities + `.stack-*` blocks)

### 5.1 Section as scroll timeline source

`.stack-section` defines:

- `view-timeline-name: --section-vt, --stack-title-vt` on the **section** (block axis).
- `animation: stack-section-exit` with `animation-timeline: --section-vt` and `animation-range: exit 0% exit 100%` so the **whole section translates up** on exit (`--section-exit-y`).

For PDF capabilities, `.pdf-capabilities.stack-section` overrides **`--card-front-y`** to `var(--title-top)` so the **front card pins under the nav**, not under a sticky title (the Figma flow: intro scrolls away, then cards pin).

### 5.2 Each slot: sticky + scroll-driven drift

`.card-slot`:

- `position: sticky; top: var(--card-front-y);`
- `height: calc(var(--card-height) * var(--stack-scale, 1))` so scaled cards still fill the slot vertically.
- `animation: elasticMobileStackSlides` (or **Front** / **IgnoreOpactity** variants on first/last slots).
- `animation-timeline: view();` — **anonymous** timeline per element: progress tracks that slot’s box through the scrollport from **entry → exit**, **even while sticky** (the spec measures the element’s layout box, which keeps moving in document space).

### 5.3 Peek geometry (Milo formula, extended to 6)

On `.stack-section`:

- `--slides: var(--cards-count)` (inline `--cards-count` from React).
- `.pdf-capabilities` also sets `--last-offset: 70px` and `--offset-adjuster: 70px` (tuning for this page; `:root` defaults differ).

Per **nth-child** of `.card-slot`, set:

- **`--stack-offset`** — Milo’s formula (see comments in CSS):

  `last_offset - (last_offset / slides) * (slides - n + 1) - offset_variance_index * (slides - n + 1)`

- **`--stack-scale`** — back cards slightly smaller (0.92 → 1.0 on front).
- **`z-index`** — back = 1, front = N.
- **`--bento-surface` / `--bento-overlay`** — depth tint per layer.
- **Keyframe variant** — deepest uses `elasticMobileStackSlidesIgnoreOpactity` (opacity can dip in the “stacked” phase); front uses `elasticMobileStackSlidesFront` (opacity stays 1).

**Keyframes** (`elasticMobileStackSlides*`): early in the timeline, `translateY` goes from `--stack-offset` toward `calc(--stack-offset - --offset-adjuster)` and opacity ramps in; later holds with optional **contrast** filter. That produces the **elastic lift into the pinned stack**.

### 5.4 Card visual (molecule)

`.stack-card`:

- `animation: elasticItemsShrink` + same `view()` range: **hold full scale ~0–20%**, then **scale down** to `--stack-scale` while **box-shadow** ramps from flat to `--bento-shadow` (shadows are **disabled** in `.pdf-capabilities .stack-card` — see §2.5).
- `::after` black layer: `bentoOverlayDeepen` for **darkening** deeper cards via `--bento-overlay`.

Layout trick: **image area** fixed `aspect-ratio: 327/300`; **asset** is absolutely positioned with `aspect-ratio: 460/850` so it does not inflate the flex column; **type** sits below with `z-index: 2` over the clipped overflow. Media cards use `object-fit: contain` on the image; photo cards use dark surface + gradient on type.

### 5.5 Scroll length and z-order

- **`.stack-cards::after`** — tall spacer (`height: calc(12 * var(--phone-vh))` in V1) so the front card **stays pinned** for a beat before exit scroll consumes the timeline.
- **`.pdf-capabilities .stack-cards`** — `padding-top: 58px` + intro `margin-bottom` so the first card’s upward translate does not **cover the lede**; `z-index` / `isolation` keeps paint order correct vs. `.pdf-capabilities-sticky-head`.

### 5.6 Globals used for geometry

From `:root` in the same file (abbreviated): `--section-pad-x`, `--card-width`, **`--card-height`** (derived from width × 460/327 for this section), `--title-top`, `--paralax-easing`, etc.

### 5.7 Fallback

`@supports not (animation-timeline: view())` — strips sticky animations; plain column stack with gap.

## 6. V1 vs V2 (product decision, same stack engine)

- **V1:** Sticky head is **not** pinned; title is `position: static`; intro scrolls away; **`--card-front-y: var(--title-top)`**.
- **V2:** `data-bento-variant="v2"` — slab is **`position: sticky`**, section **`will-change: auto`** (sticky breaks if an ancestor uses `will-change: transform`), **`--card-front-y`** set in JS from measured head height + constants (`slabPin 40`, `gap 40`, `frontOffset 70`), extra `.stack-cards` padding and shorter `::after` height for a tighter scroll tail.

## 7. Porting checklist for Milo

1. **Reuse or port** `elastic-carousel` mobile CSS: same **class names** if you want drop-in parity (`StackCard`-style markup).
2. Ensure **one scroll ancestor** (usually `document`) and no transforms on sticky ancestors that break pinning (V2 explicitly fixes `will-change` on the section).
3. Set **`--cards-count` / `--slides`** from fragment/card count in the author layer (Helix/Milo equivalent of the inline style).
4. If the **sticky header block** height varies (CMS, wrapping title), mirror **`ResizeObserver` → `--pdf-sticky-header-h`** and any **`--card-front-y`** math you depend on for exit/catchup (V2).
5. Gate behind **`@supports (animation-timeline: view())`** and ship a static stack fallback.
6. **Reduced motion:** extend `@media (prefers-reduced-motion: reduce)` to disable these animations if Milo policy requires it (hero garage-door is handled in this file; confirm bento matches your a11y bar).

## 8. Key file map

| Concern | Location |
|--------|----------|
| Section composition + measurement | `src/product/sections/PdfCapabilities.tsx` |
| Card DOM + kinds | `src/product/sections/BentoCard.tsx` |
| Stack / sticky / keyframes / nth-child | `src/product/styles/product-page.css` (PDF Capabilities + `:root` tokens at top of file) |

## 9. Next step artifact

The highest-signal copy target is **`product-page.css` from the “PDF Capabilities” comment through the `@supports not (animation-timeline)` block**, plus the small **`PdfCapabilities` + `BentoCard`** markup contract—not necessarily the rest of the product page.
