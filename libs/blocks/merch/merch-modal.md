# Merch Modal State Handling

The `updateModalState` function manages the state of merch modals across different user interactions and browser navigation scenarios. This function handles a number of use cases to ensure proper modal behavior. Modal state is tracked via the `modalState.isOpen` boolean.

## Use Cases

### Merch Card Collection Filters use-case:

When users have filters selected on merch card collections, open a modal, and then close it, the hash changes to the previous one (with filters), see `prevHash` in `modal.js`. In this case the modal doesn't get closed by `modal.js` because `modal.js` only closes modals when there is no hash in the URL. This function handles closing the modal in this scenario (see `closeModalWithoutEvent`).

**Example URL with filters in hash:**
```
https://main--cc--adobecom.aem.live/products/catalog#category=photo&types=desktop
```

**Technical Details:**
- When hash includes '=' it is not a valid selector and throws an error in the console when trying to find the modal by hash
- Example: `document.querySelector('.dialog-modal#category=photo&types=desktop')`
- To avoid this error, we select the modal only by the class

### checkout-link-modal use-case:
When 3-in-1 is disabled, `checkout-link-modal` modals will all have the same id - "checkout-link-modal" - while the hash will look the same as when 3-in-1 is enabled, e.g. `#mini-plans-web-cta-acrobat-pro-card`.

### locale-modal use-case:
The locale-modal (or geo modal) does not use hash, but it listens to the modal close events, so we need to omit it in order to not close it when there is no hash in the URL, but the .dialog-modal is still there in the DOM.

### Browser Back-Forward Navigation:

Handles user clicks and browser back-forward navigation scenarios.

**Scenario:** When a user opens a modal, closes it, and clicks 'Back' in the browser, the page is NOT reloaded. The function finds the first CTA matching the hash and clicks it to restore the modal state.

### Reopening Modal on Page Load

Reopens the modal on page load if the URL contains the hash. The function waits for each CTA to be ready and tries to reopen the modal by clicking the first CTA with a matching `data-modal-id` attribute.

When AUP Select is enabled (`aup-select=on`), the CTA can settle before Gnav has loaded the AUP SDK. Clicking it at that point would make MAS fall back to the legacy 3-in-1 modal, so the click is delayed until Gnav dispatches `milo:aupsdk:ready` (or up to 10 seconds, after which the legacy modal opens). The same applies when the hash is restored by back/forward navigation.

Readiness notifications are ignored until the SDK exposes `getOrchestratorContext`; an event alone cannot trigger an early legacy fallback.

Pending SDK waits belong to the current modal intent. Opening another checkout, closing a modal, or observing a different hash aborts those waits and removes their listeners and timers. Restoring the previous hash with `pushState` does not revive an aborted request; a subsequent navigation can start a fresh request.

If a still-current restore reaches the 10-second deadline without an available SDK, the legacy fallback emits an info-level Lana diagnostic with 1% sampling, at most once per page. Canceled or superseded restores do not log. The diagnostic contains no page URL, modal ID, or customer data and does not repeat Gnav's preload-failure details.

### Modal Closed by User

Updates the modal state to reflect when a modal has been closed by the user.

The geo-routing prompt can remain open behind an AUP checkout dialog. AUP participates in the shared `milo:modal:closed` lifecycle before its dialog is removed and its hash is restored. The event identifies the closing dialog and its original hash so geo-routing can remove stale deep links from its region links. `updateModalState` leaves cleanup to the AUP host while that dialog exists, rather than treating a shared close notification as a request to reopen checkout.

### Shared AUP and Milo Lifecycle

AUP uses the existing Milo modal host: `blocks/modal/modal.js` on C1 pages or `c2/blocks/modal/modal.js` when `foundation=c2`. Milo owns rendering, close controls, focus, lifecycle events, and scroll locking. Events carry `detail.id` and `detail.hash`; AUP supplies its original checkout hash so close notifications remain accurate after navigation. Existing consumers such as app prompts recognize AUP as an active modal.

A thin AUP bridge cancels replaced workflows, settles the SDK callback exactly once, and restores checkout hashes. Requests canceled or superseded while loading do not mount a modal or emit a loaded event. Milo close buttons, backdrops, Escape, workflow completion, and history navigation all use the same close path. Escape dismisses only the top modal, leaving a region prompt underneath open.

The C1/C2 hosts use their existing scroll and Lenis handling. They release the scroll lock and resume Lenis after the last modal curtain closes.

The AUP bridge preserves explicit SDK/workflow labels, `aria-labelledby` references, or the initiating CTA's label. Milo supplies its existing heading-based fallback and focus behavior.

### Modal Creation Failure

A rejected checkout open resets `modalState.isOpen`, removes its 3-in-1 message listener, and reports and rethrows the original error so later checkout attempts are not blocked. The 3-in-1 host also removes its loading timeout and modal-close listener when creation fails.

### Hash Removed from URL

If there is no hash in the URL but the modal is still open, the function closes it to maintain consistency.

## Implementation Notes

- The function returns the current modal state, which is used in tests
