# scripts.js dev notes

## loadLana

`loadLana` sets `window.lana.log` to load lana.js when first called on the page.  Once lana.js loads, it overrides `window.lana.log` to be the default lana log function.

`loadLana` also sets 2 event listeners (error & unhandledrejection).  These are removed when lana.js is loaded since lana.js also sets the same event listeners.
