# MAS Utilities

## masFetch

**File:** `mas-fetch.js`

A specialized fetch wrapper that provides automatic retry functionality for network errors.
Currently this utility is used for making HTTP requests to Freyja and WCS endpoints.

### Features & Implementation

-   Automatically retries failed requests due to network errors (not server errors)
-   Implements a simple retry mechanism with a linearly increasing delay (baseDelay * (attempt + 1)).
-   Only retries on network errors (like connection timeouts or DNS failures), not on HTTP status code errors (4xx, 5xx)
-   Preserves request headers across retry attempts

### Function Signature

```javascript
async function masFetch(resource, options = {}, retries = 2, baseDelay = 100) {
    // ...
}
```
