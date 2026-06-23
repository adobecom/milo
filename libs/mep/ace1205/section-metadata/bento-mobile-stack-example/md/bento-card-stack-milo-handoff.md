# Bento card stack — engineer handoff (Milo mapping)

This document exports how the **mobile offer bento card stack** works in `offer-mobile-proto`, for porting or aligning with **Milo** (`elastic-carousel` mobile pattern).

**Primary source files**

- `src/offer/StackSection.tsx` — DOM, `--title-height` via `ResizeObserver`
- `src/offer/StackCard.tsx` — card markup and layer model
- `src/offer/offer-page.css` — stack section, timelines, keyframes (~L1620–2586)
- `src/App.tsx` — native scroll rationale vs smooth scroll + `view()`

---

## 1. Purpose and Milo reference

The stack is a **scroll-linked elastic card pile**: sticky section title, three **sticky** card rows, per-card `**translateY`** keyed to each row’s `**view()**` timeline, optional **scale + shadow** on the card face, and a **section-level** exit so title and cards move together.

**Milo reference**

- `libs/c2/blocks/elastic-carousel/elastic-carousel.css` (mobile rules ~L291–L376; URLs and line refs are duplicated in `offer-page.css` comments).

**Motion stack**

- Almost all motion is **CSS Scroll-driven Animations** (`animation-timeline: view()` / named `view-timeline-name`).
- **No JS scroll listeners** for the stack (Lenis removed so `view()` stays crisp — see `App.tsx`).

---

## 2. DOM structure

```tsx
<section className="stack-section" data-section={n} style={{ "--cards-count": count }}>
  <h2 className="stack-title">…</h2>
  <div className="stack-cards">
    <div className="card-slot" data-card-idx="0">…<article className="stack-card">…</article></div>
    <div className="card-slot" data-card-idx="1">…</div>
    <div className="card-slot" data-card-idx="2">…</div>
  </div>
</section>
```

- `**.stack-section**`: one scroll chapter; **named view timelines** for title + section exit.
- `**.stack-title`**: sticky **above** the cards.
- `**.stack-cards`**: CSS **grid** of `**.card-slot`** rows.
- `**.stack-card**`: bento chrome, media, type.

**JS (non-motion)**

- `ResizeObserver` on the `<h2>` sets `**--title-height`** so `**--card-front-y**` stays correct when the headline wraps (`StackSection.tsx`).

---

## 3. Layout model

- **Section**: `display: flex; flex-direction: column; gap: var(--title-card-gap)` so title-to-grid spacing does not collapse.
- **Card sticky pin**: `--card-front-y = --title-top + --title-height + --title-card-gap`.
- **Grid `gap`**: small fixed gap between slots (e.g. `8px` token). Shrinking gap changes **timeline overlap**, not each slot’s independent `view()` range.
- **Trailing dwell**: `.stack-cards::after` is a **real grid row** with height (e.g. `calc(12 * var(--phone-vh))`) so the last card has scroll room before sticky release; padding alone is a poor substitute for sticky bounds in this pattern.
- **Anchors**: `scroll-margin-top: var(--title-top)` on `.stack-section` so jump links do not break sticky alignment.

---

## 4. Scroll timelines

### Per slot (`.card-slot`)

- `position: sticky; top: var(--card-front-y); height: var(--card-height);`
- `animation-timeline: view();`
- `animation-range: entry 0% exit 100%;`

**Why this works with sticky:** `view()` tracks the element’s **layout position** in the document as scroll changes, **even while stuck**, so scroll-driven transforms stay in sync (same idea as Milo carousel items).

### Section (`.stack-section`)

- `view-timeline-name: --section-vt, --stack-title-vt` (two named timelines).
- `**stack-section-exit`**: small translate on **section exit** only (no whole-section opacity fade — Hub Router–style parity in comments).

### Title (`.stack-title`)

- Sticky at `--title-top`.
- **Two animations:** entry stagger on `--stack-title-vt`; exit **card-match** on `--section-vt` using the `**translate` property** (not `transform`) so it composes with entry `transform`.
- Catch-up uses `**--title-catchup`**, `**--cards-release-offset**`, `**--title-release-offset**` from scrollport height so title and cards do not drift apart when sticky ranges differ.

---

## 5. Per-depth tokens (three slides)

Mirrors Milo’s elastic mobile math with `**--slides: 3**`:

- `--last-offset`, `--offset-variance-index`, `--offset-adjuster`, etc.
- Per slot `**--stack-offset**` via `data-card-idx` (Milo formula with `slides - n + 1`).
- `**z-index**`: 1 / 2 / 3 (deepest → front).
- `**--stack-contrast**`: often **1** here (contrast filter disabled; **surface tints** carry depth).
- `**--stack-scale`**: buried cards scale down; front forced to **1**.
- `**--bento-surface`**, `**--stack-depth-mask-opacity**`: depth and optional black wash on buried **media-top** cards.

---

## 6. Keyframes

### Slot (`transform` on `.card-slot`)

- `**elasticMobileStackSlides`**: middle — entry, **translate snaps by ~10%** of timeline (early `--offset-adjuster` completion vs Milo’s drift across 100%), hold, buried exit opacity 70%–100%.
- `**elasticMobileStackSlidesIgnoreOpactity`**: deepest — same pattern (typo name kept for Milo parity).
- `**elasticMobileStackSlidesFront**`: front — same translate snap; **opacity stays 1** through exit so nothing shows through the focal card.

### Card face (`.stack-card`)

- `**elasticItemsShrink`**: Milo uses **margins** to narrow; here `**transform: scale(var(--stack-scale))`** + `**box-shadow**` so text does **not** reflow during scroll.
- `**stackDepthMaskDrive`**: animates `**--stack-depth-mask-t**`; buried `**::after**` uses `opacity: mask-opacity * mask-t`.

---

## 7. Bento card composition (visual)

From `StackCard.tsx` / CSS:

- Fixed **card height** row; fixed **image area** aspect (`327/300`); portrait **asset** (`460/850`) overflows downward; **type** layer above with z-index; card `**overflow: hidden`** clips bottom.
- `**media-top**` vs `**photo**` variants for surfaces and legibility.

---

## 8. Milo vs this prototype (summary)


| Topic                  | Milo baseline    | This prototype                                     |
| ---------------------- | ---------------- | -------------------------------------------------- |
| Sticky top for cards   | viewport `%`     | **Pixel** `--card-front-y` under sticky title      |
| Shrink                 | margin width     | `**scale()`** on `.stack-card`                     |
| Depth                  | `contrast()`     | **Surfaces + mask**; contrast often **1**          |
| Front card             | generic keyframe | **Dedicated front keyframe** — opaque through exit |
| Rhythm                 | large `vh` gaps  | **Tighter** gap + shorter `**::after`**            |
| Title vs cards on exit | —                | `**translate` catch-up** + section exit            |


---

## 9. Uniform card height (different Figma sizes)

Heights are **not** animated when cards stack. Each section uses **one `--card-height`** for **all three slots**, set to the **largest** height needed in that trio so:

1. Bottoms align under shared `translateY` (no bottom peek-through).
2. Longest copy still fits.
3. Shorter cards get extra space **between media and type**; type uses `**justify-content: flex-end`** so typography stays anchored to the bottom.

Overrides (see `offer-page.css`):

- Section 1: `--card-height: var(--card-height-520)` (longest type block).
- Sections 2 and 3: `--card-height: var(--card-height-500)`.

**Scroll-time “shrink”** is `**transform: scale()`** on `.stack-card` only; **layout row height** remains `var(--card-height)`.

---

## 10. File read order

1. `src/offer/StackSection.tsx`
2. `src/offer/StackCard.tsx`
3. `src/offer/offer-page.css` — “Stack section — sticky cards” through `elasticItemsShrink` / `stackDepthMaskDrive`
4. `src/App.tsx`

---

*Generated from internal design-prototype documentation. Update this file if the CSS or component contract changes.*