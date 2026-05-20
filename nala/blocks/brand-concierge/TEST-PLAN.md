# Brand Concierge (BC) — Test Plan

## Overview

Brand Concierge is an AI-powered chat experience on Adobe.com. Testing is split into:

- **Automated tests** — deterministic page rendering, block variants, floating button behavior, aria/config checks. Lives in `brand-concierge.test.js`.
- **Manual tests** — AI-driven chat flows where the response is non-deterministic (product recommendations, advisor handoff, meeting booking, etc.). Executed before each release.

---

## Environments

| Env | URL |
|-----|-----|
| Live / Prod | `https://main--milo--adobecom.aem.live` |
| Stage | `https://stage--milo--adobecom.aem.live` |
| PR branch | `https://<branch>--milo--adobecom.aem.live` |

Test content pages live under `/drafts/nala/blocks/brand-concierge/`.

---

## Automated Test Coverage

Run: `PR_BRANCH_LIVE_URL=<env> npx playwright test nala/blocks/brand-concierge/brand-concierge.test.js --project=milo-live-chromium --grep='@regression'`

| Tcid | Test | Focus |
|------|------|-------|
| 0 | `@brand-concierge default` | Default inline variant renders |
| 1 | `@brand-concierge hero` | Hero variant renders |
| 2 | `@brand-concierge 404` | 404 variant renders |
| 3 | `@brand-concierge floating button` | Inline + floating button, stays visible on scroll |
| 4 | `@brand-concierge floating button delay` | `floating-delay-*` class + scroll threshold |
| 5 | `@brand-concierge hero floating button` | Hero + floating button initially hidden, appears after scrolling past hero |
| 6 | `@brand-concierge floating button only` | Floating-only variant, no inline block content |
| 7 | `@brand-concierge floating anchor hide` | `floating-anchor-hide` class behavior |
| 8 | `@brand-concierge modal open close` | Floating button → chat modal opens → Escape closes → floating button reattaches |
| 9 | `@brand-concierge web client preload` | BC agent `main.js` script is injected during block init |
| 10 | `@brand-concierge webclient baseStage param` | `?webclient=baseStage` loads the base-stage script URL |
| 11 | `@brand-concierge hero floating aria-hidden` | Hero floating button starts with `aria-hidden="true"` |
| 12 | `@brand-concierge consent hide block` | Without C0002 consent, block gets `hide-block` class |

---

## Manual Test Plan

Run the below on a pre-release build. Open browser DevTools if a check references network or DOM state.

### TC-M1: Product Recommendation Flow

**URL:** `/drafts/nala/blocks/brand-concierge/brand-concierge`

1. Open the default BC page.
2. Type: `I want to touch up and enhance my photos`, press Enter.
3. Modal should open with an assistant reply.

**Expected:**
- Reply mentions a photo-related Adobe product (Photoshop / Lightroom).
- `Sources` section is expandable.
- Thumbs up / thumbs down feedback icons are visible.
- Product card (if rendered) is clickable and links to the correct product page.

---

### TC-M2: Firefly Gallery Widget

**URL:** `/drafts/nala/blocks/brand-concierge/brand-concierge`

1. Ask: `Show me Firefly community creations`.
2. Wait for the assistant response.

**Expected:**
- A Firefly gallery widget renders inside the chat.
- Gallery thumbnails are clickable.
- Clicking `More in Firefly gallery` navigates to `firefly.adobe.com`.
- On stage env, gallery widget should point to `firefly-stage.corp.adobe.com`.

---

### TC-M3: Advisor Connection (Sales Handoff)

**URL:** `/drafts/nala/blocks/brand-concierge/brand-concierge` (or `business.adobe.com` equivalent)

1. Ask: `I want to talk to sales about Firefly Services`.
2. Reply to the follow-up question (e.g. `I want to know more about pricing`).

**Expected:**
- System prompts: "We'd be happy to connect you to an advisor. First, can you give us a better idea of what you'd like to discuss?"
- Then: "Connecting you to an advisor who can help."
- Chat transitions to advisor mode:
  - Banner: "You are now connected to <name>…"
  - Input placeholder changes to `Type a response`
  - `End connection` button appears.
- Clicking `End connection` returns to AI mode.

---

### TC-M4: Meeting Booking & Calendar

1. Trigger the book-a-meeting intent (advisor flow can lead into it).
2. Meeting form renders.

**Expected:**
- Form title is empty (behavior-driven) and subtitle reads:
  `To connect you with the right person for a demo, I'll need a few details…`
- Text/email/phone/number fields lay out 2 per row.
- Dropdowns and checkboxes lay out 1 per row.
- Submit button label: `Schedule a meeting` (left-aligned).
- After submitting contact info, calendar widget appears.
- Calendar subtitle: `Thanks for providing your contact information! Please select a meeting date and time.`
- Confirm button: `Schedule a meeting`.

---

### TC-M5: Sign-in / SUSI Light

**Pre-requisite:** Logged out.

1. Trigger a CTA that requires auth (varies by intent — e.g. saving a project).
2. SUSI modal opens.

**Expected:**
- Modal title: `Sign in or create an account`.
- Options visible: Continue with Google / Facebook / Apple / Email.
- On stage env, the SUSI script loads from `auth-light.identity-stage.adobe.com`.
- Successful login:
  - SUSI modal closes.
  - Chat remains open with message history intact.
  - `window.adobeIMS.isSignedInUser()` returns true (check in DevTools).
- Cancelling:
  - Modal closes without side effects.

---

### TC-M6: Navigation Persistence (Floating Entry Point)

1. Open a page with BC floating button (e.g. `bc-floating-button`).
2. Open the chat, send a message.
3. Click a link to a different Adobe page (Products / Solutions / etc.).
4. Observe the new page.

**Expected:**
- Floating entry point appears on the new page.
- Clicking it reopens the chat with prior history preserved (if backed by persistence).
- `aria-hidden` is not present while visible.

---

### TC-M7: Comparison Tables

1. Ask: `Compare Photoshop vs Lightroom`.

**Expected:**
- Comparison table renders inside the chat with feature rows for both products.
- Table is scrollable on mobile.
- No layout breakage on small widths.

---

### TC-M8: Citations / Sources

1. Ask any factual product question.
2. Expand the `Sources` section below the reply.

**Expected:**
- Citation numbers (`[1]`, `[2]`…) appear inline and inside Sources.
- Clicking a citation link opens the correct Adobe.com page in a new tab.
- No broken links.

---

### TC-M9: Mobile Keyboard White Area (MWPW regression)

**Pre-requisite:** Mobile device or browser devtools mobile emulation.

1. Open BC on mobile, open chat modal.
2. Tap the input — keyboard slides up.
3. Type something, then dismiss keyboard (tap outside or close button).

**Expected:**
- No white empty area below chat content when keyboard is dismissed.
- Modal resizes correctly; input stays anchored to the bottom.
- Rotating the device recalculates height correctly.

---

### TC-M10: Chat Input Max-Width 800px

**Pre-requisite:** Desktop ≥ 1440px wide.

1. Open any BC variant and open the chat modal.
2. Measure the chat input section width (DevTools → inspect `.input-container`).

**Expected:**
- Effective max-width is ≤ 800px even on very wide viewports.
- Input stays centered within the modal.

---

### TC-M11: Modal Height on Orientation Change

**Pre-requisite:** Mobile or tablet.

1. Open the chat modal in portrait.
2. Rotate to landscape.
3. Rotate back to portrait.

**Expected:**
- Modal height adjusts to viewport after rotation (no overflow, no clipping).
- Input + submit button remain visible.

---

### TC-M12: Error / Loading States (mock network slow)

1. In DevTools → Network, set throttling to `Slow 3G`.
2. Submit a chat question.

**Expected:**
- Loading dots indicator appears.
- If request times out or fails, error message is friendly:
  `I'm sorry, I'm having trouble connecting…` or `I'm sorry, something went wrong…`.
- After failure, user can retry without reloading the page.

---

### TC-M13: Feedback Submission

1. Send any question, wait for a reply.
2. Click thumbs up OR thumbs down.
3. Feedback dialog appears.

**Expected:**
- Positive dialog: `Your feedback is appreciated` + `What went well? Select all that apply.`
- Negative dialog: same title + `What went wrong?`
- Options include `Other`, free-form notes field is optional.
- After submit: toast `Thank you for the feedback.` appears.
- Cancel closes the dialog without submitting.

---

### TC-M14: Web Client Switching (stage QA only)

URL patterns (append to any BC page):

| Param | Expected source |
|-------|-----------------|
| `?webclient=prod` | `adobe-brand-concierge-acom…` on `experience.adobe.net` |
| `?webclient=stage` | `adobe-brand-concierge-acom…` on `experience-stage.adobe.net` |
| `?webclient=baseProd` | `experience-platform-brand-concierge…` on `experience.adobe.net` |
| `?webclient=baseStage` | `experience-platform-brand-concierge…` on `experience-stage.adobe.net` |

**Expected:**
- DevTools → Network → the corresponding `main.js` is requested.
- Console logs `prod` / `stage` / `baseProd` / `baseStage` with the URL.

---

## Release Checklist

Before tagging a BC release, confirm:

- [ ] Automated suite passes: 13/13 `@regression`
- [ ] Manual TC-M1 through TC-M14 pass on stage
- [ ] Accessibility: no new axe violations (check console on each test page)
- [ ] Mobile smoke: TC-M9, TC-M11 on real device (iOS Safari + Android Chrome)
- [ ] Sign-in: TC-M5 verified with a real IMS account on stage
- [ ] Advisor flow: TC-M3 verified with QA advisor account

---

## Known Issues

- **MWPW-190449** — color-contrast axe violation on `.bc-floating-input` for the `bc-floating-anchor-hide` variant. Automated a11y skip in place for tcid 7.
- **`tab-index` attribute typo** in `brand-concierge.js` floating-button hide state (should be `tabindex`). Minor a11y gap; tracked separately.
