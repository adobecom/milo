# MAX 2026 login prompt

EVNT027 overrides the existing C2 `modal` block through Target. MAX behavior,
content decoration, and styling live entirely under `libs/mep/evnt027/`.
There is no new C2 block registration and no shared fragment, personalization,
modal, or utility code change.
Live and post-event content use separate fragments with the same authored
`max26-login-prompt` content marker; no `post` variant is needed.

## Authoring

Set page metadata `foundation: c2`. Author `max26-login-prompt (dark)` with:

1. A background row containing desktop artwork in the first cell and mobile
   artwork in the second cell.
2. A single-cell content row containing the MAX logo, heading, body paragraphs,
   a primary sign-in link, and an optional final Continue as guest link.

Content is supplied by
`https://main--upp--adobecom.aem.live/homepage/fragments/mep/max2026/login-modal`.
The primary CTA preserves its authored URL. Continue as guest becomes a button
that closes the enclosing shared C2 dialog, without navigating.
Author the guest link with `#guest` as its destination, after the primary link.
Separate paragraphs are recommended, but shared paragraphs are also supported,
with or without DA line breaks (`<br>`) between the links. The block recognizes
the `#guest` destination, uses the preceding link as the primary action, and
separates the actions from the copy. Inline copy formatting and the guest link's
accessibility and analytics attributes are preserved.

### Post-event authoring

Author `max26-login-prompt (dark)` with the same two-row structure and
artwork/logo, but end the content row with **one primary link and no guest link**.
The single-CTA layout is selected automatically when no guest link is authored.
Content remains authored, not hardcoded by the block. The Post Event Figma copy is:

| Element | Content |
| --- | --- |
| Heading | Relive the best moments of MAX. |
| Body | Watch sessions, keynotes, MAX Sneaks, and more — all on demand. Sign up to stay up to date with the latest from MAX. |
| Primary CTA | Sign up |

Use a separate post-event fragment rather than replacing the live fragment.
The primary CTA still uses its authored URL; configure its destination in the
fragment, not in the block.

The approved post-event layout follows Figma's single-CTA design despite the
charter's generic guest-click tracking entry. X, backdrop, and Escape still
close the shared dialog. The post-event shell is 807×574px on desktop and
327×464px at a 375px viewport; the live variant's spacing is unchanged.

### Experiment mapping and modal integration

The personalization manifest must produce this existing-block override in `config.mep`:

```json
{
  "blocks": {
    "modal": "https://max-login-modal-hash--milo--adobecom.aem.live/libs/mep/evnt027/modal"
  }
}
```

Use Target `insertAfter` with a fragment URL whose hash starts with
`#max26-login-prompt`. The existing C2 link decorator routes it to the modal
override. The override consumes that trigger link and starts the MAX controller;
clicking a link or changing the page hash cannot bypass its guards.
Other modal hashes delegate to the original C2 modal initializer unchanged.
The mapping applies to all modal blocks on eligible treatment pages, so unrelated
modals also pass through this delegation.

The authored `max26-login-prompt` markup is decorated directly by the override,
not loaded as a registered block. No fragment-content reauthoring is needed.
Opening the content fragment directly is no longer a decorated MAX-block preview;
preview the variant through its treatment page instead.

## Launch requirements still pending

The [EVNT027 MAX charter](https://wiki.corp.adobe.com/spaces/adobedotcom/pages/4015271457/EVNT027+-+MAX+2026+Login+Prompt+Modal)
supersedes the earlier Summit requirements.
The latest page-specific requirements specify two minutes on the homepage and
session guide, and reaching an authored target on individual session pages. The general
inactivity-based proposal is not implemented: it has no confirmed duration.
CTA destinations remain authored; AA tracking identifiers are still pending.
The default remains 120 seconds; explicit hash settings can override timing
for a particular page. Do not reuse Summit-specific sign-in parameters.

## Automatic triggering

Use a fragment link with colon-separated hash settings. For example:

```text
https://main--upp--adobecom.aem.page/homepage/fragments/mep/max2026/login-modal#max26-login-prompt:delay=3:showAfter=side-by-side:operator=and
```

Keep `foundation: c2` and the treatment's `modal` override mapping above.
Once the conditions are met, the MAX controller strips the hash and requests
`/homepage/fragments/mep/max2026/login-modal.plain.html` off-document.
It decorates the authored content and opens the shared C2 dialog. The shared
fragment loader and C2 desktop-only delayed-modal scheduling are not used for MAX.
The same trigger rules apply on mobile and desktop.

| Hash setting | Meaning |
| --- | --- |
| `delay` | Non-negative number of seconds since navigation, not since script initialization |
| `showAfter` | Class name, for example `session-details`; defaults to the first matching element |
| `showAfterTag` | HTML tag name, for example `main`; use instead of `showAfter` to select by tag rather than class |
| `showAfterNth` | Positive, 1-based occurrence of the selected class or tag in document order; defaults to `1` |
| `showAfterMode` | `enter` (default) qualifies when the target's top enters the viewport; `passed` waits until its entire bottom has scrolled to or above the viewport top |
| `operator` | `and` (default) waits for both configured conditions; `or` waits for either |

Only configured conditions participate in AND/OR. With no delay or target,
the existing default is a 120-second delay. With only a target, there is no
implicit delay, even with `operator=or`. Explicit `delay=0` is an immediately
satisfied delay condition. Parameters do not change the primary CTA's authored URL.
Hash settings are never sent with the content request. Use `:` between settings
and URL-encode special characters in values. Literal dots must be encoded as
`%2E`, including a class's optional leading dot (`showAfter=%2Esession-details`)
or a fractional delay (`delay=0%2E5`), because the existing link classifier treats
literal dots in the final URL segment as a file extension.
Prefer class names without the optional leading dot.
All six settings remain supported; unknown hash setting names report an error.
The controller retains query-parameter parsing for direct callers, with hash
settings taking precedence, but the Target link flow must put settings in the
hash to avoid the unchanged shared URL handling.
Invalid delays, operators, class names, tag names, occurrences, or modes report an error and
do not install the trigger. `showAfter` and `showAfterTag` are mutually exclusive.
`showAfterNth` requires a URL class or tag target; it does not
apply to legacy selector metadata. `showAfterMode` requires a class, tag, or legacy
selector target. Without these new parameters, existing scroll-target selection
and entry thresholds are unchanged.

The fragment URL is required. For scroll triggering, target the safe section
after the marquee/player, not the marquee/player itself. Use a stable authored
class on the actual page; a missing or hidden target does not satisfy the
scroll condition. With `operator=or`, the delay can still trigger the prompt.
By default, the first matching target is reached when its top enters the viewport
from below. Use `showAfterNth` to select a later occurrence and
`showAfterMode=passed` to wait until the whole selected element is above the
viewport, rather than just visible. Hidden elements still count toward the
occurrence number but cannot qualify; a missing occurrence waits until it exists.
A target already past its configured threshold also qualifies, including restored
scroll positions and fast scrolling. The video-player guard below applies
independently of the configured scroll target.

| Desired behavior | Configuration |
| --- | --- |
| Two-minute delay | Fragment URL with `#max26-login-prompt` |
| Explicit two-minute delay | Fragment URL with `#max26-login-prompt:delay=120` |
| Target section in view, no delay | Fragment URL with `#max26-login-prompt:showAfter=session-details` |
| Ninth session-guide row fully passed, no delay | Fragment URL with `#max26-login-prompt:showAfter=sg-time-row:showAfterNth=9:showAfterMode=passed` |
| Entire main content fully passed, no delay | Fragment URL with `#max26-login-prompt:showAfterTag=main:showAfterMode=passed` |
| Three-second delay AND ninth row fully passed | Fragment URL with `#max26-login-prompt:delay=3:showAfter=sg-time-row:showAfterNth=9:showAfterMode=passed:operator=and` |
| Three-second delay AND target reached | Fragment URL with `#max26-login-prompt:delay=3:showAfter=session-details:operator=and` |
| Three-second delay OR target reached | Fragment URL with `#max26-login-prompt:delay=3:showAfter=session-details:operator=or` |

For the session guide, count `.sg-time-row` elements across the page in document
order. For example, `showAfterNth=9` selects the ninth row, not the ninth child
of its parent. The condition is checked against the current matching elements,
so rows inserted or replaced by the guide are picked up automatically. With
`operator=or`, the delay can still open the modal before the selected row is passed;
use `and` when passing that row must be required.

To target the page's `<main>` element without counting columns, use
`#max26-login-prompt:showAfterTag=main:showAfterMode=passed`. This waits until its bottom edge is
at or above the viewport top, not merely visible near the footer. If the content
after `<main>` is too short to allow that much scrolling, the condition cannot
be reached and the modal stays closed. Tag targets take precedence over legacy
scroll-target metadata, just like class targets.

### Video-player guard

The trigger checks rendered `<video>` elements and Adobe TV player iframes before
opening the dialog, including after asynchronous fragment loading. Adobe TV
embeds are recognized by URLs under `https://video.tv.adobe.com/v/` or
`https://stage-video.tv.adobe.com/v/`. This covers the MAX homepage's embedded
keynote player; its inner `<video>` is not accessible from the parent page.
The guard uses the outer iframe's geometry without accessing its contents.

Once a player intersects the viewport, the prompt is deferred until that player's
bottom has scrolled to or above the viewport top. This applies to paused players
too: playback state does not allow the prompt to cover a player.

The guard cannot be bypassed by an expired delay or `operator=or`. Scrolling
back above a previously seen player does not count as passing it. If several
players have been in view, all must be passed. Removing or hiding a player releases
its guard; newly inserted players and changed iframe sources are picked up
automatically.

The existing delay is not restarted. Players that have never entered the viewport,
including offscreen carousel media, do not block the prompt. Players already
above the viewport do not block it either. The same conservative rule applies
to rendered background `<video>` elements; there is no player-specific markup yet.

Unrelated iframes do not block the prompt. Other iframe providers and players
inside shadow roots require additional integration if they are introduced.

### Parent-page setup

For `/homepage/fragments/mep/max2026/test`, keep the normal page content and:

1. Set `foundation: c2` and the treatment's `personalization` metadata.
2. Map `modal` to the experiment override using the Target `useBlockCode` action.
3. Insert the fragment URL with `#max26-login-prompt:delay=3:showAfter=side-by-side:operator=and`.
   Use `side-by-side` on the intended scroll-trigger element. For a delay-only
   smoke test, use `#max26-login-prompt:delay=3` and omit `showAfter`.
4. Ensure the selected treatment's page filters include the parent test page.

The override starts the MAX trigger and uses the C2 `getModal()` API.
That API loads `/c2/blocks/modal/modal.css`, adds the fixed dialog,
curtain, close button, focus handling, and scroll lock. The block CSS only customizes
the MAX appearance. `?milolibs=local` does not enable the treatment override mapping
on its own.

### Target setup

Use these treatment actions:

| Action | Selector | Value |
| --- | --- | --- |
| `useBlockCode` | Empty | `/libs/mep/evnt027/modal` |
| `insertAfter` | `section1` (or the existing insertion selector) | Full fragment URL with `#max26-login-prompt:delay=5` or other hash settings |

Select the experiment branch through `milolibs=max-login-modal-hash` for branch QA.
Replace the old `max26-login-prompt` block mapping with the `modal` mapping.
Move trigger settings from `?name=value&...` to `#max26-login-prompt:name=value:...`.
Remove any previous `insertScript` action and automatic-prompt metadata so the
old integration does not run alongside the override. No fragment markup changes
are needed. Query-configured `insertAfter` links are no longer supported.

Optional parent metadata retained by the MAX controller:

| Metadata | Value |
| --- | --- |
| `max26-login-prompt-scroll-target` | Optional legacy CSS selector; hash `showAfter` or `showAfterTag` takes precedence |
| `max26-login-prompt-delay` | Optional legacy delay in seconds; hash `delay` takes precedence |

The unchanged personalization code may still preload the fragment's page URL
when inserting into the LCP section, because it appends its suffix after the
hash. That preload is not used as modal content; the override independently
fetches the correct `.plain.html` pathname when eligible.

Adobe Target must apply the appropriate configuration to each page and event
phase. Treatment eligibility owns signed-in exclusions and page targeting;
the block does not load IMS, check login status, or restrict page paths.
Timing is not restarted when the block or trigger loads late. Hidden tabs and
other open dialogs defer opening; trigger conditions and dismissal are rechecked
after fragment loading.

X, Escape, backdrop, and Continue as guest persist dismissal in
`localStorage` under `evnt027-login-prompt-dismissed`, shared by live/post
variants and all scoped pages on the same origin. It has no expiry; clearing
browser storage resets it. Storage/fragment failures are reported and
do not open a broken prompt. Repeated script initialization is guarded.
The post-event fragment is authored separately, not created by the script.

X, Escape, backdrop, focus handling, and baseline modal analytics use the shared
C2 Modal implementation.
