# MAX 2026 login prompt

`max26-login-prompt` is an experiment-only C2 block. Live and post-event content
use separate fragments with the same block; no `post` variant is needed.
The shared C2 Tour and Modal blocks are not modified.

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
Separate paragraphs are recommended, but DA line breaks (`<br>`) between copy
and CTA lines in a shared paragraph are also supported. The block separates
those lines before identifying the actions, preserving inline copy formatting
and the guest link's accessibility and analytics attributes.

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

The personalization manifest must produce this block mapping in `config.mep`:

```json
{
  "blocks": {
    "max26-login-prompt": "https://max-login-prompt-c2--milo--adobecom.aem.live/libs/mep/evnt027/max26-login-prompt"
  }
}
```

For automatic opening, author the fragment link on the parent page as described
below. A fragment link with a modal hash also supports the shared C2 Modal's
click-to-open behavior, for example:
`/homepage/fragments/mep/max2026/login-modal#max26-login-prompt`.
Opening the fragment URL itself renders the content for authoring/visual preview;
it does not automatically create a dialog.

## Launch requirements still pending

The [EVNT027 MAX charter](https://wiki.corp.adobe.com/spaces/adobedotcom/pages/4015271457/EVNT027+-+MAX+2026+Login+Prompt+Modal)
supersedes the earlier Summit requirements.
The latest page-specific requirements specify two minutes on the homepage and
session guide, and reaching an authored target on individual session pages. The general
inactivity-based proposal is not implemented: it has no confirmed duration.
CTA destinations remain authored; AA tracking identifiers are still pending.
The default remains 120 seconds; explicit URL parameters can override timing
for a particular page. Do not reuse Summit-specific sign-in parameters.

## Automatic triggering

Author a plain fragment link on the parent page, with trigger parameters on
that URL. For the test page, the existing authoring is supported directly:

```text
https://main--upp--adobecom.aem.page/homepage/fragments/mep/max2026/login-modal?delay=3&showAfter=side-by-side&operator=and
```

Keep `foundation: c2` and the treatment's `personalization` metadata, including
the block mapping above. No `max26-login-prompt` metadata row or separate
`insertScript` action is needed for this authored-link flow.

When the block is initialized inside the loaded page fragment, it hides that
fragment and starts the trigger using the authored URL. Once the conditions are
met, it moves the already-loaded content into the shared C2 dialog; it does not
fetch or render a second copy. Dismissed visitors never see the hidden inline
content. Direct content-fragment previews remain inline, and detached content
or content already inside a dialog does not start another trigger.

| URL parameter | Meaning |
| --- | --- |
| `delay` | Non-negative number of seconds since navigation, not since script initialization |
| `showAfter` | Class name, for example `session-details` (`.session-details` is also accepted); defaults to the first matching element |
| `showAfterTag` | HTML tag name, for example `main`; use instead of `showAfter` to select by tag rather than class |
| `showAfterNth` | Positive, 1-based occurrence of the selected class or tag in document order; defaults to `1` |
| `showAfterMode` | `enter` (default) qualifies when the target's top enters the viewport; `passed` waits until its entire bottom has scrolled to or above the viewport top |
| `operator` | `and` (default) waits for both configured conditions; `or` waits for either |

Only configured conditions participate in AND/OR. With no delay or target,
the existing default is a 120-second delay. With only a target, there is no
implicit delay, even with `operator=or`. Explicit `delay=0` is an immediately
satisfied delay condition. Parameters do not change the primary CTA's authored URL.
The shared fragment loader appends `.plain.html` before the query string.
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
| Two-minute delay | Fragment URL only; no scroll target |
| Explicit two-minute delay | Fragment URL with `?delay=120` |
| Target section in view, no delay | Fragment URL with `?showAfter=session-details` |
| Ninth session-guide row fully passed, no delay | Fragment URL with `?showAfter=sg-time-row&showAfterNth=9&showAfterMode=passed` |
| Entire main content fully passed, no delay | Fragment URL with `?showAfterTag=main&showAfterMode=passed` |
| Three-second delay AND ninth row fully passed | Fragment URL with `?delay=3&showAfter=sg-time-row&showAfterNth=9&showAfterMode=passed&operator=and` |
| Three-second delay AND target reached | Fragment URL with `?delay=3&showAfter=session-details&operator=and` |
| Three-second delay OR target reached | Fragment URL with `?delay=3&showAfter=session-details&operator=or` |

For the session guide, count `.sg-time-row` elements across the page in document
order. For example, `showAfterNth=9` selects the ninth row, not the ninth child
of its parent. The condition is checked against the current matching elements,
so rows inserted or replaced by the guide are picked up automatically. With
`operator=or`, the delay can still open the modal before the selected row is passed;
use `and` when passing that row must be required.

To target the page's `<main>` element without counting columns, use
`?showAfterTag=main&showAfterMode=passed`. This waits until its bottom edge is
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
2. Author the `/login-modal?delay=3&showAfter=side-by-side&operator=and` fragment
   link, without a modal hash. Keep the block in the separate `/login-modal` fragment.
3. Use `side-by-side` as the class on the intended scroll-trigger element.
   For a delay-only smoke test, use `?delay=3` and omit `showAfter`.
4. Ensure the selected treatment includes the block mapping and its page filters
   include the parent test page. No additional script action is required.

The block starts the shared trigger and uses the C2 `getModal()` API.
That API loads `/c2/blocks/modal/modal.css`, adds the fixed dialog,
curtain, close button, focus handling, and scroll lock. The block CSS only customizes
the MAX appearance. `?milolibs=local` does not enable the treatment block mapping
on its own.

### Optional metadata-driven integration

The previous metadata-driven flow remains supported for pages that do not author
a fragment link. Only for this alternative, add an `insertScript` treatment action
with the absolute URL
`https://max-login-prompt-c2--milo--adobecom.aem.live/libs/mep/evnt027/insertScript.js`
and configure:

| Metadata | Value |
| --- | --- |
| `max26-login-prompt` | Fragment URL with optional trigger query parameters |
| `max26-login-prompt-scroll-target` | Optional CSS selector; URL `showAfter` takes precedence |
| `max26-login-prompt-delay` | Optional delay in seconds; URL `delay` takes precedence |

The metadata can be authored on the page or supplied by the treatment's
`updateMetadata` action. This alternative loads content off-document before
opening the same dialog. Trigger parameters are removed before this fetch.

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
