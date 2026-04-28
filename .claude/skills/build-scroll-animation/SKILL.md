---
name: build-scroll-animation
description: >
  Builds CSS-driven scroll animations for C2 blocks. Given a block
  (from libs/c2/blocks/) and animation instructions from the design
  squad, either recommends existing parallax-* classes or creates new
  ones using the Scroll-Driven Animations API, verifies with Playwright,
  and self-critiques for simplicity.
disable-model-invocation: true
---

# Build Scroll Animation Skill

You are implementing a **CSS scroll-driven animation** for a block
in the C2 design system (`adobecom/milo` repository). All animation
CSS lives inside the `@supports (animation-timeline: view()) { ... }`
block in `libs/c2/styles/styles.css`.

> **Critical rules**
>
> - All scroll-driven animation CSS goes in `libs/c2/styles/styles.css`
>   inside the existing `@supports (animation-timeline: view())` block.
>   Do not create separate CSS files for animations.
> - **Simplicity first**: always check whether existing `parallax-*`
>   classes can achieve the effect before creating new ones. If an
>   existing class fits, recommend it to the user. If not, create a
>   new class. The simplicity review agent enforces this.
>> - Animation classes should use the `parallax-` prefix whenever
>   possible. This ensures the existing `prefers-reduced-motion`
>   blanket rule and the `[class*="parallax-"]` base selector cover
>   them automatically. If the prefix genuinely does not fit the
>   effect, ask the user before proceeding with a non-standard name,
>   and add an explicit `prefers-reduced-motion` override for it.
> - The default easing is `var(--parallax-easing)` (defined as
>   `cubic-bezier(0.42, 0, 0, 1)` in `styles.css`). Do not specify
>   a different timing function unless the design specs explicitly
>   call for a different animation curve.
> - Animated properties should be compositor-friendly (`transform`,
>   `opacity`, `filter`) unless the design explicitly requires
>   layout-affecting properties.

## Bundled resources

Do **not** load these upfront. Each phase tells you which file to
read when it becomes relevant.

### references/
| File | Purpose |
|------|---------|
| `scroll-animation-api.md` | Core concepts: `animation-timeline`, `view()`, `scroll()`, animation ranges, `@keyframes` interaction, pitfalls. Baked-in from WebKit and MDN docs. |
| `existing-animations.md` | Catalog of all existing `parallax-*` classes, their variables, keyframes, and composability. |
| `animation-patterns.md` | Decision tree for choosing the simplest implementation path, common composition recipes, simplicity checklist. |

### agents/
| File | Purpose |
|------|---------|
| `simplicity-review.md` | Self-criticism agent: reviews proposed CSS and pushes back toward simpler solutions. |
| `animation-verification.md` | Playwright-based verification: scrolls the page and confirms animations trigger at the right positions. |

---

## Inputs

Ask the user to provide the following before proceeding:

| Input | Required | Example |
|---|---|---|
| **Block name** | Yes | `base-card`, `rich-content` |
| **Preview URL** | Yes | `http://localhost:6456/some-page` |
| **Animation instructions** | Yes | "Cards should fade in and slide up as they enter the viewport, staggered left to right" |
| **Visual reference** | No | Figma URL, screenshots of animation states (start/mid/end), or a verbal description of timing/easing. **Do not accept video files** — they cannot be analyzed and add nothing to the workflow. If the user has a video, ask them to provide screenshots of key animation states instead. |
| **Target element** | No | "The section containing the cards" (defaults to the block element itself) |
| **Breakpoint-specific behavior** | No | "Desktop only" or "Different range on mobile" |

Do not proceed until you have the block name, preview URL, and
animation instructions.

---

## Phase 1 — Understand the animation requirement

### 1a. Parse the instructions

Break the design squad's animation description into discrete
properties:

- **What moves?** (the whole block, individual children, a background,
  text lines)
- **What type of motion?** (translate, scale, rotate, opacity, blur,
  clip-path, line-height, custom)
- **When does it trigger?** (on entry, during cover, on exit, on page
  scroll, on a specific scroll position)
- **Timing/easing?** (default is `--parallax-easing`; only note
  a different curve if the specs explicitly call for one)
- **Staggering?** (do children animate sequentially?)
- **Responsive differences?** (different behavior per breakpoint)

### 1b. Confirm understanding

Present a structured summary to the user:

```
Animation breakdown:
  Target:     [element description]
  Effect:     [transform/opacity/etc. with from→to values]
  Timeline:   [view() / scroll()]
  Range:      [entry 0% entry 100% / cover 0% cover 50% / etc.]
  Easing:     [--parallax-easing (default) / custom if specs require]
  Stagger:    [none / LTR / RTL / custom]
  Responsive: [all breakpoints / desktop only / etc.]
```

Wait for user confirmation before proceeding.

---

## Phase 2 — Check existing animations

**Load `references/existing-animations.md` now.**

Compare the animation requirements from Phase 1 against every
existing `parallax-*` class. This is the most important phase:

1. **Exact match?** Check whether an existing class (or composition
   of classes) already achieves the desired effect. For example,
   "fade in and slide up on entry" is just
   `parallax-move-up parallax-opacity`.
2. **Variable override?** If the effect type matches (transform,
   opacity, blur) but the values or range differ, check whether
   overriding `--parallax-*` variables in a new class (reusing the
   `enable-parallax` keyframe) would work.
3. **New keyframe needed?** Only if steps 1-2 cannot achieve
   the effect.

**Load `references/animation-patterns.md` now** and follow the
decision tree.

### Outcome A: Existing class(es) fit

Recommend the class(es) to the user. Explain which classes to
apply and on which element. No new CSS needed. **Skip to Phase 5**
for verification.

### Outcome B: Variable override class needed

Tell the user a new class is needed, explain why existing classes
fall short, then write the override class and **skip to Phase 4**.

### Outcome C: New keyframe(s) needed

Tell the user a new class is needed, explain what it will do and
why it cannot reuse existing keyframes, then **proceed to Phase 3**.

---

## Phase 3 — Read context and implement

### 3a. Read the block

Read the target block's CSS and JS from `libs/c2/blocks/<name>/`:
- Understand the block's DOM structure
- Identify which elements will be animated
- Note existing class names and selectors

### 3b. Read the animation framework

Read the `@supports (animation-timeline: view())` block in
`libs/c2/styles/styles.css` to understand:
- The base `[class*="parallax-"]` declaration
- The `enable-parallax` keyframe
- How existing animations are structured

**Load `references/scroll-animation-api.md` now** if you need
to reference range names, `view()` parameters, or timeline syntax.

### 3c. Write the CSS

Add the new animation CSS **inside** the existing
`@supports (animation-timeline: view())` block in
`libs/c2/styles/styles.css`.

Follow these rules:

1. **Variable overrides first**: if the effect can be achieved by
   overriding `--parallax-*` variables, write only a class with
   variable overrides. No new keyframe.

2. **Minimal keyframes**: if a new keyframe is needed, animate
   only the properties that change. Prefer `from`-only keyframes
   when the `to` state is the element's natural state.

3. **Use CSS nesting** for scoped child animations.

4. **Responsive overrides** via `@media (width >= Xpx)` nested
   inside the animation class, using CSS custom properties for
   values that change per breakpoint.

5. **Use CSS logical properties** where applicable.

6. **No `!important`** except in the `prefers-reduced-motion`
   override.

7. **Easing**: use `var(--parallax-easing)` (the project default).
   Only use a different timing function if the design specs
   explicitly call for a different curve.

8. **Naming**: prefer the `parallax-` prefix. If the effect
   genuinely does not fit the prefix, ask the user before using
   a non-standard name. If a non-`parallax-` name is approved,
   add an explicit `prefers-reduced-motion` override:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .your-class-name,
     .your-class-name * {
       animation: none !important;
     }
   }
   ```

### 3d. Placement within the file

Insert new CSS in a logical location within the `@supports` block:
- Simple variant classes → near the existing variants
  (`parallax-move-up`, `parallax-opacity`, etc.)
- New keyframes → after the keyframe they are most related to
- Complex multi-element animations → at the end of the
  `@supports` block, before the closing `}`
- Add a short comment header if the animation is complex
  (3+ keyframes or multi-element orchestration)

---

## Phase 4 — Simplicity review

**Load `agents/simplicity-review.md` now** and follow its procedure.

Submit the proposed CSS to the simplicity review agent. Provide:
- The animation instructions from the user
- The proposed CSS (new classes and keyframes)
- The block's CSS file path

If the agent's verdict is "Needs simplification", apply the
suggested changes and re-submit. Maximum 2 review cycles.

Do not proceed to Phase 5 until the simplicity review passes
(verdict is "Approved", "Use existing classes", or "Use variable
override").

---

## Phase 5 — Verify with Playwright

**Load `agents/animation-verification.md` now** and follow its
procedure.

Provide the agent with:
- Preview URL
- Block/element CSS selector
- Expected visual effect (from Phase 1 summary)
- Animation class(es) applied
- Expected animation range
- Breakpoints to test

The agent will:
1. Verify the animation is detected in computed styles
2. Capture pre-scroll, mid-scroll, and post-scroll screenshots
3. Validate visual states match expectations
4. Verify reduced-motion compliance

If verification fails, fix the CSS and re-verify. Maximum 3
iterations.

---

## Phase 6 — Summary

Output:

1. **Animation class(es)**: name(s) and brief description.
2. **Approach**: existing classes recommended / variable override
   created / new keyframe created.
3. **CSS added**: the exact CSS that was added to `styles.css`
   (if any), formatted as a code block. If existing classes were
   recommended, state "No new CSS needed."
4. **File modified**: path and approximate line range (if applicable).
5. **Simplicity review result**: verdict and any simplifications
   applied.
6. **Verification result**: pass/fail per breakpoint, with
   screenshot paths.
7. **Reduced motion**: confirmed compliant / needs manual check.
8. **Obstacles encountered**: anything the user should review
   manually.

### Cleanup

Ask the user whether to remove the `/tmp/build-scroll-animation/`
screenshot cache created during verification. If confirmed:

```bash
rm -rf /tmp/build-scroll-animation
```
