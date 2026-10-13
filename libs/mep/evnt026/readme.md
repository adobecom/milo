# MAX 2026 login prompt

`max26-login-prompt` is an experiment-only C2 block. The default content is the
live-event variant; `post` is reserved for the later post-event implementation.
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

Map the block in the personalization manifest:

```json
{
  "blocks": {
    "max26-login-prompt": "https://max-login-prompt-c2--milo--adobecom.aem.live/libs/mep/evnt026/max26-login-prompt"
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
