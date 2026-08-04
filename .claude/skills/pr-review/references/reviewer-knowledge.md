# Milo PR review knowledge base

Mined from real inline review comments and review bodies left by this team's most active reviewers across a combined **~2,460 sampled PRs** in `adobecom/milo`, stratified across the repo's full history (April 2022 → July 2026, out of 5,211 merged PRs total). This is one combined checklist, not separate voices to roleplay — apply whichever themes below are actually relevant to what a given PR changes, not the full list mechanically. Every theme is backed by real quotes with PR-number citations so a claim here can be independently re-checked against the actual GitHub comment (`gh api repos/adobecom/milo/pulls/<n>/comments` / `.../reviews`) if it ever looks stale or wrong.

**Contents** — `[CSS]` styling/CSS-architecture themes, `[JS]` code-shape/logic themes, `[Process]` scope/governance/workflow themes, `[A11y]` accessibility, `[Meta]` how to write the review itself. Skim to the tags relevant to what changed in the PR under review rather than reading top to bottom every time.

## [CSS] Design tokens over hardcoded/magic values (the single most repeated theme across all reviewers)

Any raw color, spacing, radius, or font-weight value that has a `--s2a-*` token equivalent should use the token instead. Hardcoded values break dark-mode propagation and drift out of sync with the Consonant library the tokens are generated from.

- "You can use `--s2a-color-transparent-white-00` and `--s2a-color-transparent-white-80` instead. This will help when we need to implement dark mode." — PR #6010
- "This is already defined... all of the `--s2a-*` tokens come from the Consonant library and should always be in sync. As soon as there is a new release on the Consonant side, any changes manually made by developers will get lost." — PR #6252
- "There should be a token for font-weight. 400 should be the default." / "Font family should be inherited from styles.css. You shouldn't need to declare it here." — PR #5549
- "I see `--s2a-spacing-lg` being used in the specs." — PR #5559; "`padding-inline-start` and `padding-inline-end` are the same value, why not write as `padding-inline: var(--s2a-spacing-sm);`?" — PR #5907
- Sometimes delivered with zero framing at all — just the token name or "token?" — treat a bare hardcoded value as worth flagging even briefly.

**Build-pipeline gotcha (easy to miss without deep history):** "If the S2A tokens don't satisfy your needs, I advise against naming variables with the `--s2a-` prefix. The pipeline script will remove anything following that pattern from the `c2/styles.css` file." — PR #5483. A custom property named `--s2a-*` that isn't an actual generated token will silently get stripped by the build pipeline — flag any `--s2a-*`-prefixed variable that isn't in the real token set, not just "isn't this hardcoded."

Token drift itself is a known, acknowledged problem, not just an author mistake: "There's an issue with the tokens which I already brought up with the Consonant team. But we should aim to use the appropriate tokens and fix those instead of defining non-S2A values." — PR #5491. Also watch for token *sizing* changes breaking assumptions: "Keep in mind token t-shirt sizes have changed, the ones applied by this method are likely not mapped to C2 available helper classes. Maybe add a TODO so we don't forget about this." — PR #5603

## [CSS] Reuse existing typography/utility classes instead of redeclaring CSS

Redeclaring `font-size`/`line-height` etc. instead of applying a shared class (`.eyebrow`, `.heading-6`) causes drift when the design system updates.

- "Apply a `.heading-6` class via JS instead of redeclaring typography." — PR #6010
- "I know it's unintuitive, but there's a token for this as well, `--s2a-font-weight-adobe-clean-bold`." — PR #5549

**A related but distinct unit-choice rule: `rem` for font-size, `px` for horizontal spacing/padding.** `rem` scales with the user's font-size zoom setting (which is the whole accessibility point of using it for text), but the same property applied to padding/margins can cause layout to reflow or feel cramped as zoom increases, when a fixed pixel gutter would have stayed visually stable. "Padding should probably be in pixels - as a rule you don't want to use rem for horizontal padding" — PR #320. Don't reflexively flag every `px` value in CSS as "should be a token/rem" — check whether it's a spacing value (where `px` can be the more correct accessible choice) or a font-size (where `rem`/a token is correct).

## [CSS] CSS specificity / nesting discipline

Selectors should start with the block name and stay flat ("linear specificity"). Avoid nesting/`:not()` where it exists purely to inflate specificity or repeats the parent's own class name — that increases specificity and makes future overrides harder. No bare/unqualified tag selectors (`p`, `div`) — always scope under the block class. Selector chain/nesting depth should stay shallow (≤3). Collapse near-duplicate selectors into one general selector (e.g. `[class*="hub-hero-"]`, or grouping RTL variants with `:is()`) where it meaningfully cuts code footprint.

- "No need to nest, since the selector starts with the block name, this will make edits easier in the future, due to linear specificity." — PR #6010
- "I don't think we need `[dir='ltr']` here, we can just write as: `.table:not(.merch) .row .col span.milo-tooltip { margin-right: -4px; }`..." — PR #3456
- `!important` is "the absolute last solution given a huge list of justifications, not something you just use" — near-never acceptable. "It breaks the CSS specificity & it is horrible for maintainability." — PR #2317

**Important nuance — the anti-nesting stance is about specificity bloat, not nesting syntax itself.** As native CSS nesting (`&`) became production-viable in the shared C2 `styles.css`, the same reviewers who'd earlier pushed to flatten selectors started actively requesting `&`-nesting for modifiers/pseudo-selectors: "We can nest CSS. Given we only need the arrow, we can do: `.icon-button { ... &.arrow { ... } }`" / "let's nest" / "we can nest" (three separate asks in one PR) — PR #5907 (2026). Read this as: nest for `&:hover`, `&::before`, `&[aria-expanded]`, `&.variant`, `& > p` — don't nest to avoid restating a selector chain that should just be flat and specific.

## [CSS] Keep animation/visual logic in CSS, state logic in JS

Distrust of JS-driven `transform`/`translateY` when it could be a CSS custom property set by JS and read by a CSS rule: "keeps animation logic grouped in CSS... to understand where effects come from." — PR #6133

## [CSS] Performance-conscious CSS

- Question whether `will-change` should list all animated properties, or whether it adds anything when `transition` already promotes to the compositor.
- Flag subpixel values in transforms ("Subpixel values will not always be consistent... can this be rounded?" — PR #6023 / #6037).
- Flag animating expensive properties like `max-width` ("processor intensive... some alternatives might be needed for rollout" — PR #6129).
- Push for one consistent transform method (`translate` vs `translate3d`) rather than mixing both — PR #6322.
- Prefer `transform`/`opacity` for animation generally (compositor-friendly).
- **z-index chaos** is its own recurring, concrete complaint (distinct from generic specificity gripes): "Could we have variables around this? E.g. `--base-z-index: 0` `--promobar-z-index: calc(var(--base-z-index) + 1)`... base-z-index: 0, modals: 1, promos: 2, above-all: 9999?" — PR #2991; "z-index 10000 seems pretty random and hacky to me." — PR #4496. Push toward a centralized, documented z-index scale rather than ad hoc large numbers.

## [CSS] RTL / logical properties

Flag physical properties (`left`/`right`, `text-align: left`, one-off RTL re-declarations) in favor of `inset-inline-*`/`margin-inline-*`/logical `text-align: start|end`. Only a minority of C2 block CSS files use logical properties consistently as of this writing (see `milo-domain-knowledge.md` for the current count) — flagging physical properties in new C2 CSS is a real, checkable gap, not a nitpick against a convention that doesn't exist yet. `[dir="rtl"]` overrides are still used where a logical property alone can't express mirroring (e.g. a `transform: translateX(...)` flip), grouped with `:is()` where multiple variants need the same override.

- "This will not work on RTL, `start` might be a better option." — PR #1189
- "According to MDN: 'start — The same as left if direction is left-to-right and right if direction is right-to-left.'" — PR #959
- Ask directly rather than assume, repeatedly and even on PRs that don't look RTL-relevant at a glance: "how will this behave on RTL locales?" (asked 3 times in one PR — PR #2533) / "is RTL covered?" (PR #2810) / "does this work on RTL?" (PR #6194).
- Consistency of the `dir` attribute check itself matters: "nitpick - there's mixed `dir='rtl'` and `dir = \"rtl\"` throughout the code, we should be consistent." — PR #581. Tests should explicitly cover both directions: "make sure your tests cover both `ltr` and `rtl` use-cases." — PR #777

## [CSS] Mobile-first / breakpoint consistency

Standard breakpoints: 768 / 1024 / 1280 / 1920 (roughly matching grid tiers S/M/L/XL). Question deviations without a comment explaining why. Check the *exact* boundary value against sibling files — "Mobile is defined up to 768. This will create a 1px discrepancy... Lets stay consistent with what's been used elsewhere: `@media (768px <= width < 1280px)`" (with a link to the precedent file/line) — PR #5559. Build mobile-first ("styles → min-width: 600px → min-width: 1200px → min-width: 1440px" — PR #786) rather than starting from desktop and overriding down; sort media queries by ascending size within a file rather than scattering them (PR #778).

## [JS] Naming clarity

Names should reflect intent, not just current usage — a color-only-sounding variable that's actually typography, a variant named "video" that now supports other media, a boolean like `hasHeroGradient` that only checks whether a gradient *could* apply (PR #6239), a boolean set to `false` where `null`/`undefined` would better express "not applicable" (PR #1152). "As a good mind-model & pattern, reading any single line of code in isolation should still provide you with most of the context that you need to understand what it does." — PR #3909 — especially in core/shared logic where a misleading name has outsized impact. Prefer descriptive suffixes for DOM references (`body` → `bodyEl`) so it's clear at a glance what a variable holds (PR #1377). Watch for inconsistent naming conventions for parallel concepts (one query param `caasver`, the sibling `caas-host` — PR #1643 — pick one convention and apply it to both).

## [JS] Avoid if/else chains and deep nesting; prefer early returns / guard clauses

Treated as a code smell that inevitably grows into an unmaintainable pyramid: "having more than (4/5?) levels of indentation is a code smell that things are overly complicated." — PR #3797. If/else chains "usually get added on and long-term turn into huge if/if-else/if-else/else statements that are very hard to decipher," and multi-branch chains ("while, try, if, if, else, if...") become "impossible to test" as branch count grows — PR #4641. Prefer extracting to helper functions with early returns, and — a more specific technique worth applying, not just "simplify" — **collapse compound conditions into intentionally-named boolean variables** once you're past ~3 conditions or a 2x2 matrix of conditions, so the branch itself reads as a sentence rather than a boolean expression that needs mental evaluation — PR #3909.

## [JS] Sensible defaults / config objects over long parameter lists

Prefer a config-object pattern (`const config = {}`) over many positional parameters. Question parameters that don't appear to have more than one real call site/use case, and functions whose "get" secretly also "sets." — PR #3809

## [JS] Code simplification vs. code duplication — two rules that can point opposite ways; here's the tiebreaker

These two are adjacent on purpose because an LLM skimming a JS diff under time pressure can otherwise apply the wrong one to a given snippet. **The distinguishing question is reuse and clarity, not "more/fewer functions is always better."**

**Kill unnecessary abstraction** — don't wrap a one-liner that's used exactly once in its own helper function; move the logic inline, closer to where it's actually used, unless it's reused elsewhere. Don't introduce a named variable for a value that's used once and doesn't add clarity.
- "If this is a one-liner that isn't re-used, I'd not make it a helper function and move it closer to where its actual used." — PR #3593
- "I'd get rid of this helper function, given it's a simply one liner" — PR #2557
- "I personally prefer skipping on variables if they don't provide context or are used multiple times." — PR #1471

**Eliminate duplication** — when the *same logic* (not a trivial one-liner) is repeated across files or within a file, extract it to a shared function instead of copy-pasting.
- "Let's not just duplicate the code but re-use code / extract them to smaller functions." — PR #5164
- "This whole block of code is the exact same as what's in `share.js`... We need a better way to handle this." — PR #467
- "We already have a `resize` event listener here... Could we consolidate the two?" — PR #3028
- "Twice the hidden, twice the accessibility! Let's remove the duplicate." — PR #3247 (near-duplicate accessibility side-effects applied twice)

**Tiebreaker**: is this exact logic needed in more than one place, or will it plausibly be reused soon? Extract it. Is it a short, one-off convenience used once, purely for readability? Leave it inline rather than adding a function just to have one.

## [JS] Real bugs found via defensive/edge-case reasoning (highest-value catches — read the logic, don't skim)

These are genuine runtime bugs caught by actually tracing what a function returns/does, not style preferences:

- `isMobile()` returning a `MediaQueryList` object, not a boolean — every call site treating it as truthy makes it always truthy. — PR #5986
- A guard like `!playInViewport` that's always true for a code path where `playInViewport` is never set, silently making the following condition irrelevant. — PR #6122
- Deprecated APIs still in use: `window.pageYOffset` (should be `window.scrollY`). — PR #6128
- Unsafe optional-chained index access (`arr[1]?.offsetHeight`) where the access *before* it isn't guarded and can still throw. — PR #6128
- Real memory leaks: `IntersectionObserver`/listeners that are attached but never disconnected/cleared — flag with a concrete disconnect/cleanup-function suggestion, not just "this might leak." — PR #5739
- **`forEach` + `async`/`await` misuse** — a specific, recurring, near-verbatim catch across many unrelated files/years: `forEach` does not await its callback, so an `async` callback inside `forEach` silently doesn't serialize/await as the author likely intended. "`forEach` and `async` don't work together, so this definitely doesn't achieve anything." — PR #1080. Prefer `for...of` when the iteration body needs to `await`.
- **Legacy-integration race conditions** (a milo-specific historical pattern, concentrated in `libs/martech/martech.js` and login/IMS code): timeout/ordering bugs inherited from the old FEDS integration pattern — "This pattern has been used by FEDS to expose multiple utilities, data attributes and we ended up with race conditions because there was no order in which scripts are loaded" — PR #1649; catching a caught-and-swallowed timeout that lets execution continue past a library that never actually loaded — "I don't think that will work if the library gets blocked altogether... the timeout error is caught and execution continues... `if (window.adobeIMS?.isSignedInUser()) return;`" (silently proceeds as if signed out rather than surfacing the failure) — PR #1157. Treat any code path touching `martech.js`, IMS/login, or Alloy `sendEvent` as needing this kind of trace-through, not a skim.
- Subtle string-shape mismatches between similar-looking values from different sources: "the previous `source.name` property returned `app-switcher`, while `workflow` returns `app switcher`. Using workflow without trimming will break the existing use-cases." — PR #1967
- **Root-cause over band-aid**: when a fix looks like it's papering over a symptom (a flaky test, an arbitrary coverage-threshold carve-out, a config that "just works" after a weird one-character change), push to actually find the underlying cause rather than accepting the workaround — "I don't want to allow for thresholds... I'd like to investigate what the root cause of them is first," followed up later with the actual diagnosis: "it seems to me that this difference in code coverage is being caused by some of our tests not being idempotent" — PR #621. In one case this went as far as personally debugging and writing up a full root-cause fix for a CI test-runner crash rather than approving a workaround the author was uncertain about — PR #5842.

## [JS] Performance-first critical-path discipline — parallelize async work, don't gate first paint on it

A distinct, recurring architectural doctrine, most visible in `libs/utils/utils.js` and any code touching georouting/localization/personalization: **kick off a fetch/import/promise as early as possible without awaiting it immediately, and only await the result right before the code that actually needs it** — never let an unrelated async operation block the page's first render.

- "I think this is great, but think it really only makes sense to `await`... This call should be non-blocking so that we can load the first section still right away, but at the same time, the moment we get a response... we load the modal as quickly as we can." — PR #1806
- "I'd put all these promises in a `promise.all` and await that, just so this for loop can truly run in parallel." — PR #2647
- "Could you try to have these promises loading in parallel to each other? Just so we don't have cases of loading a file, executing the code, then loading the next file..." — PR #2928
- "this looks like it'll hurt performance - if [a feature] is active on a base page, we now need to await a js file loading in before the code can continue." — PR #5381
- On a flag-gated feature that added a blocking await to a core path: "This feature must not block page load... it's a hard platform requirement... A flag-gated feature that establishes the precedent 'things can block the critical path' is itself the problem." — PR #5829

This is the JS-side counterpart to the CSS-side "always-loaded core path gets highest scrutiny" rule elsewhere in this file — treat any new `await` added to `utils.js`, fragment-loading, or similarly early-executing code as needing to justify why it can't be fired-and-forgotten or parallelized instead.

## [Process] Architectural boundary-policing — does this belong in milo core?

The strongest, most blocking-toned language in the whole corpus is reserved here, not for style nits:

- "This automation doesn't belong in milo." / "Does this CSS need to exist at all?" / "The milo team doesn't own every repo under adobecom... we only own adobecom/milo (& blog, and a few weird small repos)." — PR #5777
- "Bleeding consumer implementation details back into milo is an anti-pattern." — PR #3909
- A concrete gate specific to new C2 blocks: **Consonant design-system governance is a hard prerequisite, not a suggestion.** "there is no Consonant approval or review: one needs to be performed... If we need exceptions, they are documented here." — PR #4882. A new/visually-distinct block without a linked Consonant review or documented exception is a real, checkable gap — flag it explicitly, not just as a style question.
- Cross-project coupling is treated as a specific risk category (CSOs — Critical Site Outages), not just generic coupling: "we are introducing a dependency between separate projects, specifically homepage and cc... this setup could result in CSOs if a placeholder is unexpectedly removed or updated by one of the teams." — PR #4827
- **A specific, recurring sub-argument for keeping `utils.js` lean is a literal byte-budget one, not just abstraction purity**: "All code below here should be in a separate file imo. Utils is loaded with nearly every call to milo and for every user whose locale is [a minority case], you're 'forcing' them to download extra bytes for stuff they don't need." — PR #405. Frame a core-file scope objection this way when it applies — "this ships to every user on every page, most of whom don't need it" is a stronger, more concrete argument than "this doesn't feel like it belongs here."

Also watch for scope/necessity skepticism on large-blast-radius changes generally: "I stopped reviewing when I got to the utils file and all the changes in decorate.js. I believe we can find a better way to do this with a smaller blast radius... The benefits of the feature are outweighed by the code additions at this point." — PR #6239. Prefer surgical/scoped changes over system-wide ones that haven't had a system-level decision + QA pass. **Explicitly halting/stopping a review mid-way through when something is seriously wrong is a real, if rare, escalation move** ("I stopped reviewing once I got to the JS part because this still hints at a big Accessibility issue..." — PR #4809) — it's rare (in the single digits as a percentage of reviews) but high-signal; reserve equivalent language in your own output for comparably serious blockers, not routine nits.

## [Process] Skepticism of "quick fix" hacks that become tech debt

Especially config coupling or inter-project dependencies that are "hard to un-do." Question necessity of variants/code paths rather than letting them accumulate silently — prefer an explicit TODO for follow-up cleanup over quietly carrying dead code forward. "do we really need a variant for X? this should be the default for the block" — PR #6032

## [Process] Test coverage

- Unit tests requested specifically for logic that "keeps growing" or sits on a critical path — not a blanket rule for every change.
- 100% patch coverage is a stated CI gate in this repo (`CONTRIBUTING.md`) — flag new/changed JS without a matching test.
- **Nuance: missing test coverage is not automatically a blocking issue.** "we discourage requesting changes for unit test / coverage purposes. It's best to directly create a ticket so that this can be followed up on." — PR #2688. **Severity tiebreaker**: default a plain coverage gap to Suggestions or Nice-to-haves, not Blockers — escalate to a Blocker only when the untested path is security-sensitive (see Security below) or sits on a critical/always-loaded path (`libs/utils/utils.js`, `libs/martech/martech.js`, core config resolution).
- **Test isolation/pollution matters as much as coverage existing at all**: "Tests should be isolated, debugging and changing tests that already depend on shared test state is very tedious." / "This looks prone to building up test state. It would be better to add the notifications to the body in a `beforeEach` block and clearing the DOM in an `afterEach` block." — PR #2557. "This pollutes the test runner console, it should be removed." — PR #1080. "Should we also clear the body content here to ensure we're not polluting any other tests after the suite is completed?" — PR #1471
- Assertions should actually assert something and cover the non-default branch too: "This test doesn't have any assertions, so it doesn't test anything." / "If this is the default, where's the test for the non-default case?" — PR #3612
- Security-relevant logic (e.g. sanitization) should have a unit test that specifically asserts the unsafe path does NOT execute, not just that the return value looks right — the most rigorous single example in the corpus is a reviewer building an actual proof-of-concept exploit page to prove a sanitizer bypass, then asking for a test that would have caught it — PR #6225
- Even test-suite runtime cost is treated as a real design concern, not just correctness: "Waiting for 100ms sounds reasonable, but multiply that by the number of test cases we have... making unit tests slower than they need to be." — PR #2126
- **Missing coverage and failing tests are not the same severity.** The nuance above (missing coverage → Suggestion/ticket, not a Blocker) applies to *absent* tests. A PR with tests that actually fail is a different, harder line: "darn it, one test is failing. Can you fix and then I'll give an approval?" — an approval conditioned explicitly on getting CI green, not a "nice to have." — PR #1802

## [Process] Security

- Sanitization correctness gets the most rigorous single treatment in the corpus (see Test coverage above, PR #6225 — an actual working exploit PoC was built to prove a bypass). Treat as a Blocker, not a Suggestion, when found.
- `innerHTML` vs. `textContent`: "`innerHTML` can be a security risk. It's better to use `textContent`." — PR #437. "we shouldn't ever set the innerHTML with content supplied by the user, even if they're restricted." — PR #466. This applies even when the content source is "trustworthy" (internal JSON, author-provided content) — "our json sources and authors are trustworthy, but can we still set textContent properly so that there's not even a small attack vector here?" — PR #5713. A PR mixing several of these at once (inline CSS-in-JS, `innerHTML` from authored content, loading a fragment inside an LCP-critical block) was treated as severe enough to halt on: "I personally think we need to pull a hard brake with this implementation." — PR #2803
- Supply-chain / CI: pin third-party GitHub Actions to a commit SHA, not a tag/branch — "There was a supply chain attack a few months ago based on which we switched to commit SHAs" — PR #4202; "could we use SHAs? They can't get changed thus you can pin a version, avoiding any supply chain attacks that could steal credentials" — PR #5089

## [A11y] Accessibility / UX side effects

- Gate new motion/animation on `prefers-reduced-motion`.
- Ask whether an interaction resets focus progress on the page — losing focus position on interaction is treated as a real regression, not a nitpick, and can be enough to block: "When a user has their focus on a left/right button and engages with it, that button is removed, causing confusion regarding current position on the page. Is there any official green light from Accessibility that this is acceptable?" — PR #4809
- Push for consistent focus styles across similar components once flagged once ("I received this feedback for the FAQ block, so I'm assuming it's a practice we want to standardize" — PR #6238).
- Hands-on verification is expected, not just code-reading: "I'd just suggest to test it out and see what the screen reader (Cmd+F5) announces." — PR #1884. Precise ARIA-role fixes get proposed with a live check first ("I tried it out quickly and it seems to work") rather than asserted from memory, and MDN's own accessible-name precedence rules get cited directly when disputing an `aria-label` vs. `alt` choice — PR #846.
- Keyboard navigation is checked explicitly, independent of whatever the PR's stated scope is: "I am not able to TAB through the toc items, this breaks keyboard navigation" — PR #786; "one cannot tab through the languages; navigation can only be done with arrow keys. Has this been approved from an accessibility perspective?" — PR #4436
- See also `references/accessibility-deque.md` for WCAG/axe-specific technical criteria (contrast ratios, ARIA authoring-practices patterns, common automated-vs-manual testing gaps) to pair with these milo-specific review habits.

## [Process] Cross-cutting practical checks

Mobile behavior, RTL behavior, third-party integration (Lingo), and demo/QA testability are asked as direct, concrete questions rather than assumed fine: "how's this going to work on mobile?", "does this work with Lingo?", "would like to be able to test this on a demo page." — PR #6194. Also: does this need localization; is this something a non-engineer author (GWP) should still be able to configure (e.g. heading level shouldn't be hardcoded away).

A distinct, explicitly named authoring principle: **don't give content authors two different ways to accomplish the same thing.** "I think we are opening the doors for authoring confusion... No reason to make the author do that two different ways. This also makes it easy to break either option if the wrong variant is added to the wrong block in Word." — PR #1022. Related: don't introduce a new authoring-key delimiter/pattern (e.g. `_` vs. the established `-`) without a strong reason, and verify empirically that the new pattern actually works in the authoring tool rather than assuming it does — PR #3028

## [Process] Empirical verification over reading the diff alone

Disputes or confirms a PR's claims using actual evidence — screenshots, GIFs, recorded video, throttled-network test passes, or a live `.hlx.page`/`.aem.page`/draft test URL — rather than reasoning abstractly about whether something is broken or fixed. This is the habit to apply directly in Phase 3 of this skill's workflow, not just a review-comment style.

- Disputing a CLS-fix claim by testing on throttled 3G and pinpointing the real shift source, with a screen recording attached — PR #2317
- A historically distinctive sub-mode from the 2023 Global Navigation rewrite: **diffing the new implementation against the legacy system for behavioral parity**, not just checking the new code in isolation — "In the AEM implementation we're highlighting the active element with bold, but I see this does not get applied in Milo," with side-by-side screenshots and explicit repro steps ("Resize your browser to 1190px width and compare these two pages") — PR #1595 / PR #1586
- Performance objections are backed by measured numbers, not gut feel, sometimes with the business impact spelled out explicitly. A particularly forceful example quantifies revenue risk from a single wrongly-placed import in a core-path file: "...this would still make all of adobe.com's LCP element 2-10% slower, likely leading to millions in lost revenue due to higher bounce rates - and that with a single wrongly placed import statement." — PR #4496. Treat any change to `libs/utils/utils.js` or another always-loaded core file with this level of scrutiny — it isn't optional caution, it's the reviewers' actual standard for that file.
- **Building a self-hosted repro/test branch to check a claim, not just requesting one from the author.** Beyond disputing claims with existing evidence, reviewers routinely push their own throwaway test branch and link it directly in the review as proof: "I quickly tested out what I'm suggesting here - [test URL]." — PR #1916. When they're wrong, they say so plainly rather than defending the objection: "**Edit** I'm wrong with the [reference] — go with what you originally had, sorry!" This cuts both ways — verify actively, and retract cleanly when the verification turns out to contradict your own concern.
- When a PR's own description or test plan doesn't include a testable before/after URL, ask for one directly rather than trying to evaluate the change from description alone: "Can you change your PR description with before and after links so that a reviewer can test this quickly?" — PR #291

## [Process] Process/governance conventions (easy to miss without deep history — these are process facts, not code-review opinions)

- **One PR per JIRA ticket** is an explicit, named convention: "we usually aim for one PR per JIRA ticket, this is really helpful for managing code that gets merged... it will be harder to test and also harder to revert." — PR #2683. Scope creep beyond the linked ticket gets redirected to a follow-up ticket rather than absorbed into the current PR. The same concern shows up as a direct complaint about reviewability on an oversized PR: "This is a very large PR. It's honestly too big and very hard to review. Can we aim for smaller and more iterative PRs for the future?" — PR #601
- **Merge-batch rules**: an arbitrary number of PRs can be batched together as long as they only touch unique, non-overlapping files. Once a "first SOT" (source-of-truth/stage-freeze) label is applied, nothing else merges to stage — PR #2224
- **CSO (Critical Site Outage) handling**: during an active CSO, getting a PR/revert tested matters even more than usual, specifically to avoid making the situation worse — PR #2290
- **Priority-labeling discipline**: "Please add a justification on why this is a high priority. If everything is high priority, nothing is." — PR #2140
- **Breaking-change communication to the authoring community is a distinct discipline from code correctness** — a change that forces re-authoring of already-published content needs advance notice to authors, not just a passing code review: "This change will require re-authoring of any page that uses the `icon-height-32` variant. Has this been communicated?" — PR #881. A change can get blocked purely on this basis even if the code itself is correct: "Blocking for the time being. The default height change will impact consumers negatively." — PR #1696
- **Explicit pre-merge cleanup/verification asks** are a distinct pattern from ordinary suggestions — e.g. "remove the custom client ID before merging" — PR #1751 — or "Should not be merged until we confirm all kits support the weight" — PR #4655 — phrased as a condition of merge, not an optional nice-to-have.
- **LANA logging conventions**: use the project's structured tag taxonomy (e.g. `info` for network issues, `warn` for authoring misconfigurations) consistently within a PR rather than mixing formats, and don't over-wrap logging calls when consumers can rely on implicit/default logging behavior — PR #1463

## [Process] Scope/rollout discipline — "fine for the test, not settled for rollout"

A constant qualifier on approvals across reviewers — arguably present in roughly half of substantive approvals in the deep-mined sample. Something can be approved as scoped-safe for an experiment while still being explicitly flagged as needing a broader system decision, design/eng alignment, or manual QA pass before wider release. Don't give an unqualified approval to a change that's only been validated for a narrow test — say so explicitly, and name what's still owed:

- "Code looks good to me, but needs QA to validate all use-cases." — PR #5278
- "Code looks good, but needs to go through testing. The suggestions are good to have, however I don't see them as blocking." — PR #5105
- "Looks good, but we will need additional effort to handle: CTA positioning — requires design input; performance — video should pause when it's out of view; we need some research here (new JIRA ticket)." — PR #5973
- "As [colleague] mentioned, all existing Milo projects should be tested with this change. Make sure to reach out to SRE to disable monitors if needed before going live." — PR #2689

## [Meta] Review-depth transparency (a norm worth adopting directly in this skill's own output, not just describing)

Reviewers routinely state *how thoroughly* they actually reviewed, rather than letting every approval imply uniform deep coverage:

- "Haven't personally tested this, but from purely code perspective this looks fine." — PR #4636
- "Gave it a birds-eye view check and don't see any blockers, hence approving!" — PR #4663
- "Approving based on discussions outside of this PR, I have not validated the code nor functionality. We do have the right QE sign-off and approvals on the PR to stage though." — PR #4757

This is the direct precursor to the structured template's "Test plan" section below — the honesty norm came first, the template formalized it.

## [Meta] Adopted structured review format ("Ultrareview" — use this as the default output shape)

Reviewers have converged on a named, AI-assisted review template rather than freeform prose. This can now be dated fairly precisely:

- **Late April 2026** (PR #5815, submitted 2026-04-28): first disclosed AI-assisted review pass, not yet a named template — "Sent over an agent and kept the (hopefully) rightful catches - feel free to dismiss anything that's not right," alongside bold-headline diagnostic-style comments ("**Dead CSS — `.small-width` class is never applied**"). A "Non-AI:" tag was used at least once to flag a human-added comment against an otherwise AI-generated set, worth noting as an option for transparency.
- **Around July 10, 2026** (PR #6269): the format crystallizes into the fully-named template, explicitly headed `## Ultrareview — PR #6269`, with `**Size:**`, `### Blockers`, `### Suggestions`, `### Nice-to-haves`, `### Test plan` sections.
- **By late July 2026**: source-verification narration in this style — e.g. "Verified `clearSignOutCookies` (dropdown.js:40-50) by hand: for `business.adobe.com` it clears `domain=business.adobe.com` and `domain=adobe.com`, correctly bounded" (PR #6335) — is standard practice, whether or not every individual review in this window carries the full named header.

```
## PR #NNNN — <title>
**Size:** +X/-Y across N files. Base: `stage`. Oversize: yes/no.

<paragraph independently verifying claims in the PR description against the
actual source — not just trusting the diff/description at face value>

### Blockers
None. / <specific items>

### Suggestions
- <file:line> — <specific finding>

### Nice-to-haves
- <specific items>

### Test plan
<verification notes — what was actually checked, and how>
```

Checklist items baked into this template: PR size/oversize threshold, base branch is `stage`, CODEOWNERS coverage for new directories, no new deps/`console.log`/CSS-in-JS, whether the description's claims hold up against the real implementation, C2 block placement conventions, and whether the test plan/test URL is adequate.

**Not everyone converged on the identical named format.** At least one 2026 AI-disclosed review used a different structured shape (color-coded severity emoji for blockers/conflicts/should-fix/cleanup items, explicitly labeled as an agent-run review) rather than the literal "Ultrareview" header — treat the underlying discipline (disclose AI assistance if used, verify against source, separate findings by severity, describe a test plan) as the actual convention; the exact header/emoji styling is a variant, not a hard requirement.

## [Meta] Evolution over time (useful for calibrating how much weight to give an older vs. newer pattern)

- **Comments have gotten shorter and terser year over year** — one reviewer's average inline-comment length dropped from ~21 words (2023) to ~16 words (2026). **This isn't universal, though**: a reviewer who becomes the de facto owner of a subsystem (e.g. georouting/localization) tends to go the other way — comments grow longer and more architecturally elaborate over time as their domain expertise deepens and the review shifts from style nits to design questions. Calibrate by subject matter, not just by calendar year.
- **Fenced `​`suggestion`​` diff usage rose, then fell.** It became common starting around 2024 (offering a literal drop-in replacement rather than describing the fix in prose) but had largely disappeared again by 2026 for at least one heavy reviewer — short prose nits/questions became the norm again once conventions matured and needed less hand-holding.
- **Approval-to-comment ratio has shifted toward faster, lighter-touch approvals over time** for at least one reviewer (from roughly 1:1 approve:comment in 2023–2025 to ~2.7:1 by 2026) — plausibly reflecting more mature, stable C2 conventions requiring less correction than the earlier gnav/legacy-migration era.
- **Governance/process commentary (one-PR-per-ticket, Consonant review gate, CSO/cross-team coupling risk) clusters from 2024 onward**, correlating with milo's growth into a larger multi-consumer platform (MAS, C2, multiple downstream projects) rather than its earlier, more contained 2022–2023 footprint.
- **The empirical/legacy-parity-diffing verification style was concentrated in a specific historical window** (the 2023 Global Navigation rewrite) — a reminder that some patterns are tied to a specific migration event rather than being an evergreen habit, so don't over-generalize a single era's intensity to "this is always how deep verification goes."
- **The AI-assisted structured review format is a recent (2026) shift**, not a longstanding convention — see the dedicated section above.

## [Meta] Tone/style notes to carry into review comments

- State review depth/confidence honestly rather than implying uniform deep coverage — "spot-checked the CSS, read the full JS diff" beats a blanket claim of thoroughness (see "Review-depth transparency" above — this is a real, adopted norm, not just good practice in the abstract).
- Prefer terse, direct phrasing for small, obviously-correct nits; reserve longer explanatory phrasing (stating the *why*) for points that genuinely benefit from it. A "Nit:" (or "Small nit:") prefix is the idiomatic way to explicitly mark something as non-blocking polish so the rest of the review doesn't read as more adversarial than intended.
- Frame open questions Socratically ("Could we...", "Do we need...", "Would X not achieve the same result?") rather than as commands, except where something is a genuine bug or blocker — those get stated plainly and directly.
- A fenced `​`suggestion`​` code block (GitHub's suggestion syntax — three backticks followed by the word `suggestion`) is idiomatic here when offering a concrete drop-in fix, though its usage has trended down as conventions matured (see Evolution above) — don't feel obligated to always supply one.
- Approvals routinely carry an explicit caveat about what's still owed (QA validation, a follow-up story, a rollout decision) rather than being unqualified.
- Own past decisions/precedent rather than implying blame on the current PR author, when a flagged issue predates this PR.
- Warm, encouraging framing (thanks, emoji, "nice work") is common even inside a `CHANGES_REQUESTED` review — critical feedback and a friendly tone aren't mutually exclusive here. A common structure: lead with genuine praise, then list the findings ("Looks pretty good! Found a few small things...") rather than opening with criticism.
- **Retract cleanly and immediately when you're wrong**, rather than defending a concern after checking it out further: "I'm wrong with the [reference] 🤔" / "ah, I see your point. No, that looks awful. Go with what you originally had — sorry!" This is a real, recurring pattern, not just politeness — it's what active verification (see Empirical verification above) looks like when the verification disproves your own initial concern.
- First-time contributors get an explicit, warm welcome alongside the technical feedback ("congrats on your first Milo PR!") — worth doing when reviewing a new contributor's PR, not just diving straight into findings.
- Tag relevant teammates by @-mention to loop in context or socialize an architectural question rather than dictating a decision unilaterally — several of the strongest opinions in the corpus are still phrased as "what do you think, @person?" rather than a unilateral ruling. (When applying this yourself, tag by role/context rather than inventing a specific person's name if you don't actually know who's relevant.)
- Reserve "I'm stopping the review here" language for genuinely serious blockers (architectural violations, security gaps, a11y regressions that need sign-off) — it's rare in the real corpus and loses its signal value if used for routine nits.
