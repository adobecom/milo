# Bento `stack-mobile` — optional follow-ups (circle back if needed)

These two items came out of the final code review. **Neither is a bug** and neither blocks
the feature — they are pixel-parity refinements vs the `offer-mobile-proto` reference that
only matter in specific situations. Documented here so you can decide later.

The JS-failure hardening from the same review **was applied** (the stacking now gates on a
JS-added `.bento-stack-ready` class via `:where()`, so if `bento-stack.js` fails to load the
bento degrades to its normal static layout instead of a broken pile).

---

## 1. Bottom-anchor card content (`justify-content: flex-end`)

**What it is:** In the prototype, each card's type (headline + body) is anchored to the
**bottom** of the card. Because we now normalize every card in a stack to the *tallest*
card's height (so bottoms align and nothing peeks), any card whose natural content is
**shorter** than the tallest gets extra vertical space.

**Current behavior:** that shorter card's content sits **centered** in the extra space
(the existing bento `.explore-card-container` / `.explore-card-content` centers content).
The prototype instead pins it to the bottom, so headlines line up consistently across the
pile regardless of card height.

**When it matters:** only when a stack mixes cards with very different content lengths. If
your authored cards are similar heights, you won't notice. If short cards look "floaty"
(text centered with empty space) compared to the reference, apply this.

**Where to change:** `libs/mep/ace1205/section-metadata/section-metadata.css`, inside the
mobile stack block, add to the card's content/face (mobile only):
```css
/* inside @media (width < 768px) { .section.bento.stack-mobile:where(.bento-stack-ready) { … } } */
> .explore-card .explore-card-content { justify-content: flex-end; }
```
Verify against the live reference (https://offer-mobile-proto.entapp.adproto.com/) and
double-check it doesn't shift the *tallest* card's layout.

---

## 2. Exact prototype surface + mask values (image-less cards only)

**What it is:** The prototype's depth tint for a 3-card stack uses these exact values:

| layer | surface color | black depth-mask opacity |
|---|---|---|
| front | `#f6f6f6` | `0` |
| middle | `#edebeb` | `0.1` |
| deepest | `#e3e2e2` | `0.15` |

**Current behavior:**
- `--bento-surface-front` is `#fff` (not `#f6f6f6`).
- The depth-mask is a **linear ramp** `calc(var(--depth) * 0.15)` → front `0`, middle
  `0.075` (not `0.1`), deepest `0.15`.

So the front surface is pure white instead of off-white, and the middle card is slightly
**lighter** than the prototype.

**When it matters:** **only on bento cards that have no full-bleed background image.** On
image cards (the common case here), the `<img>` covers the surface entirely, so the surface
color is invisible and depth is carried by the mask + scale + shadow. If you author
color-only / solid-surface bento cards and want exact parity, fix both:

**Where to change:** `libs/mep/ace1205/section-metadata/section-metadata.css`
- Token block: `--bento-surface-front: #f6f6f6;` (instead of `#fff`).
- For the middle mask, either accept the linear ramp, or add an explicit per-card override
  for the 3-card case:
  ```css
  /* middle card of a 3-card stack */
  > .explore-card:nth-child(2 of .explore-card):nth-last-child(2 of .explore-card) {
    --stack-depth-mask-opacity: 0.1;
  }
  ```
  (The `nth-child(2)` + `nth-last-child(2)` combination targets the middle of exactly three
  cards; a pure linear ramp is fine for other counts.)

Verify by frame-diffing a solid-surface card against the reference.

---

## 3. Title exit timing (catch-up lags the cards) — needs design-tuning pass

**What it is:** On exit, the title is meant to slide up *in lockstep* with the card stack
(it "catches up"). In practice it starts a bit late: the cards begin scrolling up while the
title is still pinned, so the title briefly **overlaps** the cards before it leaves. The title
*does* fully exit (nothing breaks) — it's a polish/timing gap, not a functional one. Most
visible on the `rounded-corners-bottom` bento ("Bring it all together in a PDF Space").

**Why it lags:** the catch-up math (`rich-content.css`,
`--cards-release-offset` / `--title-release-offset` / `--title-catchup` and the title's
`animation-range: exit … exit …`) is calibrated off a hardcoded `--phone-h: 775px` — the
prototype's exact phone-frame height. The prototype hits tight lockstep because its scroll
container *was* 775px tall. On a real responsive viewport (~707–844px) the timing drifts, so
the catch-up starts later than the cards' release.

**Why it's not a quick fix:** there's no confident one-liner. Options to explore (each needs
iterative verification against the live reference, and all three titled-bento cases must be
re-checked together because they share the formula):
- Drive `--scrollport-h` off the real viewport (`100svh`) instead of `min(--phone-h, 100svh)`,
  and/or set `--phone-h` from JS (measured viewport) so the timing tracks the device.
- Start the catch-up earlier (reduce/remove the `--cards-release-offset` start delay) and
  re-tune the end so it doesn't overshoot.
- Re-derive the catch-up from the card's actual sticky-release point rather than the
  scrollport approximation.

**Recommendation:** dial this in with the design team against
https://offer-mobile-proto.entapp.adproto.com/ ("Get insights quickly") so the feel matches
frame-by-frame. Touch `rich-content.css` title block only; re-verify the title exit on BOTH
titled bentos after any change.

---

## 4. Whole-section exit lift — DISABLED (one-value re-enable)

**What it was:** On exit, the entire `.section.bento.stack-mobile` translated up by
`--section-exit-y` (40px) — the prototype's `stack-section-exit` "lift off." In Milo the
section also carries the full-bleed `has-background` layer + padding, so lifting the whole
backgrounded block read like it was detaching. Disabled per design.

**How it's disabled:** `--section-exit-y: 0` (in `section-metadata.css`, near the top tokens).
The `stack-section-exit` `@keyframes` and the section's `animation` + `--section-vt` timeline
are **kept intact** (the title catch-up depends on `--section-vt`), so this is purely a value
change — translate resolves to 0, no lift.

**To re-enable (one value):** set `--section-exit-y` back to `40px` (or any value). Nothing
else to touch. Verified: disabling it does not affect the card stacking, depth, pin, or the
title exit (the title still leaves correctly).
