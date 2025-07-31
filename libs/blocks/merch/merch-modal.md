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

### Modal Closed by User

Updates the modal state to reflect when a modal has been closed by the user.

### Hash Removed from URL

If there is no hash in the URL but the modal is still open, the function closes it to maintain consistency.

## Implementation Notes

- The function returns the current modal state, which is used in tests
