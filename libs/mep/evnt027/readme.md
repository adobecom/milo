# MAX 2026 login prompt

EVNT027 overrides the existing C2 `modal` block through Target. All experiment
code stays under `libs/mep/evnt027/`; no shared modal, fragment, personalization,
or utility changes or new C2 block registration are needed.
Only hashes starting with `#max26-login-prompt` use MAX behavior.
Other modal links delegate to the original C2 implementation.

## Target setup

Set parent-page metadata `foundation: c2` and configure these treatment actions:

| Action | Selector | Value |
| --- | --- | --- |
| `useBlockCode` | Empty | `/libs/mep/evnt027/modal` |
| `insertAfter` | `section1` or the existing insertion selector | Full fragment URL with `#max26-login-prompt` and optional hash settings |

Author the library-relative `useBlockCode` path above. MEP resolves it against
the selected library base; do not hardcode a feature-branch URL for production.
For branch QA, use `?milolibs=max-login-modal-hash` on the parent page.

Replace the old `max26-login-prompt` block mapping with this `modal` override.
Move trigger settings from query parameters into the hash. Remove any previous
`insertScript` action and `max26-login-prompt` automatic-prompt metadata.
The authored fragment markup does not need to change.
Target owns page selection, live/post-event fragment selection, and signed-in
exclusions; this override does not check IMS or page paths.

The unchanged personalization code may preload the fragment's page URL when
inserting into the LCP section because its suffix follows the hash.
The override does not use that preload as content: when eligible, it strips the
hash and independently fetches the correct `/fragment.plain.html` pathname.

## Authoring

Use separate live and post-event fragments containing `max26-login-prompt (dark)`:

1. A background row with desktop artwork in the first cell and mobile artwork
   in the second cell.
2. A single-cell row containing a logo picture in its own paragraph, a heading,
   body copy, a primary sign-in/sign-up link, and an optional guest link.

The primary CTA is the last content link, or the link immediately before the
explicit guest link. Author Continue as guest with destination `#guest`.
Only that explicit hash creates a guest close button; body-copy links remain
links. Separate action paragraphs and DA's merged paragraphs, with or without
`<br>` separators, are supported. Guest accessibility and analytics attributes
are preserved; primary links retain the shared link handling, including IMS
sign-in actions.

The post-event fragment ends with one primary link and no guest link.
Content and CTA destinations stay authored. The override decorates this markup
directly rather than loading it as a registered block; preview it through the
treatment page, not as a standalone decorated MAX block.

## Hash settings

Use `:` between settings:

```text
/path/to/fragments/login-live#max26-login-prompt:delay=5:showAfterTag=main:showAfterMode=passed:operator=and
```

| Setting | Meaning |
| --- | --- |
| `delay` | Non-negative seconds since navigation, not since initialization |
| `showAfter` | One literal class name, such as `session-details`; selects its first occurrence by default |
| `showAfterTag` | One HTML tag, such as `main`; mutually exclusive with `showAfter` |
| `showAfterNth` | Positive, 1-based class/tag occurrence in document order; default `1` |
| `showAfterMode` | `enter` (default): target top is above the viewport bottom; `passed`: target bottom is at or above the viewport top |
| `operator` | `and` (default) requires every configured condition; `or` requires either |

For `enter`, the actual comparison is `target.top < viewport.height`; targets
already above the viewport also qualify. For `passed`, it is `target.bottom <= 0`.
Only configured conditions participate. With no delay or target, delay defaults
to 120 seconds. A target alone has no implicit delay, even with `operator=or`.
Explicit `delay=0` is immediately satisfied.

| Behavior | Hash |
| --- | --- |
| Default two-minute delay | `#max26-login-prompt` |
| Explicit delay | `#max26-login-prompt:delay=120` |
| First matching class enters | `#max26-login-prompt:showAfter=session-details` |
| Ninth row fully passed | `#max26-login-prompt:showAfter=sg-time-row:showAfterNth=9:showAfterMode=passed` |
| Entire main fully passed | `#max26-login-prompt:showAfterTag=main:showAfterMode=passed` |
| Delay AND target | `#max26-login-prompt:delay=5:showAfter=session-details:operator=and` |
| Delay OR target | `#max26-login-prompt:delay=5:showAfter=session-details:operator=or` |

Occurrences are counted across the document, including hidden matches. A missing
or hidden selected target cannot qualify; checks pick up later DOM updates.
Restored scroll positions and already-passed targets qualify.
Passing all of `<main>` requires enough content below it to scroll its bottom
to the viewport top. If that is impossible, the prompt stays closed unless an
independent `or` condition qualifies.

URL-encode special characters in hash values. Literal dots must be `%2E`, including
an optional leading class dot (`showAfter=%2Esession-details`) or fractional delay
(`delay=0%2E5`): the shared link classifier treats literal dots in the final URL
segment as a file extension. Prefer class names without the leading dot.
Unknown hash names and invalid values report an error and do not start a trigger.
`showAfterNth` requires a hash class/tag target; `showAfterMode` requires a target.

Legacy parent metadata remains supported: `max26-login-prompt-scroll-target`
accepts a CSS selector, and `max26-login-prompt-delay` accepts seconds.
Hash class/tag and delay settings take precedence. `showAfterNth` does not apply
to the legacy selector. Direct controller calls also retain query parsing, with
hash values taking precedence; Target-inserted links must use the hash format.

## Guards and lifecycle

The same rules apply on mobile and desktop; C2's desktop-only delay scheduler
is not used. Scroll, resize, relevant DOM changes, and other trigger events are
coalesced into a frame-scheduled check. Video encounters are tracked before the
delay expires, so frame batching does not bypass the video guard or change OR
semantics.

Rendered native videos, including background videos, and Adobe TV iframes under
`https://video.tv.adobe.com/v/` or `https://stage-video.tv.adobe.com/v/` are guarded.
Once a player enters the viewport, it must be scrolled fully above the viewport
before opening, even if paused or the user scrolls back above it. Every encountered
player must be passed; removing or hiding a player releases its guard.
Players never encountered, including offscreen carousel media, do not block.
Unrelated iframes and players inside shadow roots are not covered.

Hidden tabs and other open dialogs defer opening. Eligibility is checked again
after asynchronous content loading. Delays are not restarted when deferred.
Leaving the page stops the trigger. Pending triggers do not restart when
Back/Forward restores the page from BFCache; a reload initializes them again.

X, Escape, backdrop, and guest closing use the shared C2 dialog and persist
`evnt027-login-prompt-dismissed` in localStorage. Dismissal has no expiry and is
shared by live/post variants and all pages on the same origin. Clear only that
key for repeated dismissal-sensitive QA. If dismissal storage cannot be read,
the trigger stays disabled and reports the error to Lana; content and later
storage failures are also reported.

Inactivity triggering and final AA tracking identifiers remain pending.
