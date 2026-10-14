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
supersedes the earlier Summit requirements. MAX has no livestream player.
The scroll threshold and inactivity duration, live registration destination,
post-event IMS destination, and AA tracking identifiers are not yet finalized.
Do not use the old three-second delay or Summit sign-in parameters.

This block only decorates authored modal content. Automatic triggering,
signed-out targeting, and permanent dismissal suppression across
`/max.html`, `/max/2026/sessions.html`, and `/max/2026/broadcast.html` belong to the
experiment's trigger integration and are not implemented here.
X, Escape, backdrop, focus handling, and baseline modal analytics use the shared
C2 Modal implementation.
