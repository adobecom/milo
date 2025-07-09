# Merch Modal State Handling

The `updateModalState` function manages the state of merch modals across different user interactions and browser navigation scenarios. This function handles five primary use cases to ensure proper modal behavior.

## Use Cases

### Use Case #1: Merch Card Collection Filters

When users have filters selected on merch card collections, open a modal, and then close it, the hash changes to the previous one (with filters). The modal doesn't get closed by `modal.js` because `modal.js` only closes modals when there is no hash in the URL. This function handles closing the modal in this scenario.

**Example URL with filters in hash:**
```
https://main--cc--adobecom.aem.live/products/catalog#category=photo&types=desktop
```

**Technical Details:**
- When hash includes '=' it is not a valid selector and throws an error in the console when trying to find the modal by hash
- Example: `document.querySelector('.dialog-modal#category=photo&types=desktop')`
- To avoid this error, we select the modal only by the class

### Use Case #2: Browser Back-Forward Navigation

Handles user clicks and browser back-forward navigation scenarios.

**Scenario:** When a user opens a modal, closes it, and clicks 'Back' in the browser, the page is not reloaded. The function finds the first CTA matching the hash and clicks it to restore the modal state.

### Use Case #3: Reopening Modal on Page Load

Reopens the modal on page load if the URL contains the hash. The function waits for each CTA to be ready and tries to reopen the modal by clicking the first CTA with a matching `data-modal-id` attribute.

### Use Case #4: Modal Closed by User

Updates the modal state to reflect when a modal has been closed by the user.

### Use Case #5: Hash Removed from URL

If there is no hash in the URL but the modal is still open, the function closes it to maintain consistency.

## Implementation Notes

- The function returns the current modal state, which is used in tests
- Modal state is tracked via the `modalState.isOpen` boolean
