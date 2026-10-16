# MAX 2026 login prompt

`max26-login-prompt` is an experiment-only C2 block. The default content is the
live-event variant; add `post` for the post-event variant.
The shared C2 Tour and Modal blocks are not modified.

## Authoring

Set page metadata `foundation: c2`. Author `max26-login-prompt (dark)` with:

1. A background row containing desktop artwork in the first cell and mobile
   artwork in the second cell.
2. A single-cell content row containing the MAX logo, heading, body paragraphs,
   a primary sign-in link, and a final Continue as guest link.

Content is supplied by
`https://main--upp--adobecom.aem.live/homepage/fragments/mep/max2026/login-modal`.
The primary CTA preserves its authored URL. Continue as guest becomes a button
that closes the enclosing shared C2 dialog, without navigating.

### Post-event authoring

Author `max26-login-prompt (dark, post)` with the same two-row structure and
artwork/logo, but end the content row with **one primary link and no guest link**.
Content remains authored, not hardcoded by the block. The Post Event Figma copy is:

| Element | Content |
| --- | --- |
| Heading | Relive the best moments of MAX. |
| Body | Watch sessions, keynotes, MAX Sneaks, and more — all on demand. Sign up to stay up to date with the latest from MAX. |
| Primary CTA | Sign up |

Use a separate post-event fragment rather than replacing the live fragment.
The primary CTA still uses its authored URL; the charter has not yet confirmed
the post-event IMS destination or parameters. The URL in the post-event test
fixture is a placeholder, not a launch destination.

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

Use the fragment link with a modal hash on a separate parent page to open it
through the shared C2 Modal block, for example:
`/homepage/fragments/mep/max2026/login-modal#max26-login-prompt`.
Opening the fragment URL itself renders the content for authoring/visual preview;
it does not automatically create a dialog.

## Launch requirements still pending

The [EVNT027 MAX charter](https://wiki.corp.adobe.com/spaces/adobedotcom/pages/4015271457/EVNT027+-+MAX+2026+Login+Prompt+Modal)
supersedes the earlier Summit requirements.
The latest page-specific requirements specify two minutes on the homepage and
session guide, and a scroll boundary on individual session pages. The general
inactivity-based proposal is not implemented: it has no confirmed duration.
CTA destinations remain authored; AA tracking identifiers are still pending.
Do not use the old three-second delay or Summit sign-in parameters.

## Automatic triggering

Add an `insertScript` action pointing to
`/libs/mep/evnt027/insertScript.js` **only in the treatment manifest**, alongside
the block mapping above. The control must not load this script. Configure parent
page metadata (directly or with the manifest's `updateMetadata` action):

| Metadata | Value |
| --- | --- |
| `max26-login-prompt` | The live or post-event fragment URL, without a modal hash |
| `max26-login-prompt-scroll-target` | CSS selector matching the full marquee/player container that must be scrolled past |

The fragment URL is required. The scroll selector is required for individual
session pages, and must also be configured on the homepage when a livestream
player is present. Use a stable authored ID or class on the actual page; a
missing or hidden target prevents opening rather than guessing a scroll position.
The boundary is passed only when its bottom is at or above the viewport top.
All matches must be passed. On homepages and individual session pages,
visible-layout native videos and embedded iframes in `main` also gate opening
until fully passed, conservatively treating every iframe as a potential player.
Include custom players without a video/iframe in the authored scroll selector.

| Page | Trigger |
| --- | --- |
| `/max.html`, `/max-new.html` | Two minutes since navigation, plus passing any configured player boundary |
| `/max/2026/sessions.html` | Two minutes since navigation |
| `/max/2026/sessions/<session>.html` | Scroll past the configured marquee/player boundary; no timer |

Use individual session targeting only in the live-event manifest; the charter
does not currently include those pages in the post-event scope. Broadcast and
other paths are not targeted. Timing is not restarted when this script loads
late. Hidden tabs and other open dialogs defer opening; eligibility is rechecked
after fragment loading. The script waits for IMS readiness and checks signed-in
status again before opening.

X, Escape, backdrop, and Continue as guest persist dismissal in
`localStorage` under `evnt027-login-prompt-dismissed`, shared by live/post
variants and all scoped pages on the same origin. It has no expiry; clearing
browser storage resets it. Storage/IMS/fragment failures are reported and
do not open a broken prompt. Repeated script initialization is guarded.
The post-event fragment is authored separately, not created by the script.

X, Escape, backdrop, focus handling, and baseline modal analytics use the shared
C2 Modal implementation.
