# Brand Concierge block

This block provides the Brand Concierge experience (prompt cards, chat modal, and optional Sign in). The host page may also load a **Brand Concierge script** (e.g. the “Ask BETA” panel) from a CDN. That script runs in the same window but does not have direct access to the block. To allow the script to open SUSI Light and to receive the auth token after sign-in, the host exposes a **bridge** and a **ready event**.

---

## Local development (web-agent)

The chat UI is served from the CDN (see script URL in the block). To test changes from the **brand-concierge-web-agent** repo inside this (milo) repo with hot reload:

1. In **brand-concierge-web-agent**, start the Vite dev server (default port **8081**):
   ```bash
   npm run dev
   ```
2. In **milo**, serve your page as usual (e.g. Franklin or local server).
3. Open the page with a flag so the block loads the web-agent from localhost instead of the CDN:
   - **URL param:** `?bc-local=1` or `?brand-concierge-local=1`  
     Example: `http://localhost:3000/your-page?bc-local=1`
   - **Metadata:** set `brand-concierge-local` to `true`, `1`, or `yes` in the sheet or document.

When the flag is set, the block loads the script from `http://localhost:8081/@src/index.ts` (Vite’s dev entry) as an ES module and then calls `window.adobe.concierge.bootstrap()` as usual. The port must match `server.port` in brand-concierge-web-agent’s `vite.config.ts` (8081).

**`window.adobe` and Alloy:** The web-agent does *not* create `window.adobe`; it only adds `window.adobe.concierge.bootstrap` after it initializes. The host page (milo) must load the Adobe Experience Platform Web SDK (Alloy) so that `window.adobe` exists. The “new” bootstrap path (and thus local dev) only runs when Alloy reports version `2.31.0` (`useNewBootstrapAPI`). If `window.adobe` is undefined in the console, ensure the page has loaded Alloy and that it has run before the Brand Concierge modal opens.

---

## Host–script handshake (ready event + bridge)

The **host** (this block, when it initializes with the default layout) registers a global bridge and dispatches a custom event so the **script** can:

1. **Sense that the host is ready** and get a reference to the bridge.
2. **Open SUSI Light** when the user clicks “Sign in” in the script UI.
3. **Receive the auth token** after successful sign-in by registering a callback.

The script must not assume load order: either the block or the script may load first. The contract supports both cases.

---

### 1. Global bridge: `window.__brandConciergeBridge`

After the block has set up the SUSI trigger (default layout), the host sets:

```js
window.__brandConciergeBridge = {
  openSusiLight: () => void,
  setTokenReceiver: (callback: (payload: TokenPayload) => void) => void
}
```

- **`openSusiLight()`**  
  Call with no arguments to open the SUSI Light sign-in flow (modal with popup). The host handles loading SUSI, opening the modal, and closing it on redirect or token. Safe to call from a “Sign in” button in the script.

- **`setTokenReceiver(callback)`**  
  Register a function that the host will call when the user completes sign-in and the host receives the SUSI `on-token` event. Pass `null` or a non-function to clear. Only one receiver is stored; each call replaces the previous one.

The host tells the script which window property holds the bridge by passing **`bridgeName`** in the bootstrap config (e.g. `bridgeName: '__brandConciergeBridge'`). The script uses that name to look up the bridge instead of hardcoding it.

**TokenPayload** (argument to the callback):

| Property | Type | Description |
|----------|------|-------------|
| `token` | `unknown` | Token / auth data from SUSI (e.g. `e.detail`). |
| `detail` | `object \| undefined` | Full `e.detail` from the SUSI `on-token` event. |

---

### 2. Ready event: `brandConcierge:hostReady`

When the bridge is ready, the host dispatches a **CustomEvent** on `window`:

- **Event name:** `brandConcierge:hostReady`
- **Target:** `window`
- **`detail`:** `{ bridge }` — the same object as `window.__brandConciergeBridge`

So the script can either:

- **Use the global:** `window.__brandConciergeBridge?.openSusiLight()` (and `setTokenReceiver`) when needed, or  
- **Listen for the event:** subscribe to `brandConcierge:hostReady` and store `event.detail.bridge` for later use.

Listening for `brandConcierge:hostReady` is recommended so the script works even when it loads **before** the block: once the block runs, the event fires and the script receives the bridge. If the script loads **after** the block, the bridge is already on `window`, so the script can check for it on load and, if present, use it without waiting for the event.

---

### 3. How the script should sense the host is ready

**Option A — Prefer event (handles “script loads first”):**

```js
function useHostBridge(bridge) {
  if (!bridge) return;
  // e.g. wire "Sign in" button in your UI
  mySignInButton.addEventListener('click', () => bridge.openSusiLight());
  bridge.setTokenReceiver((payload) => {
    console.log('Token received', payload);
    // Update UI, persist session, etc.
  });
}

window.addEventListener('brandConcierge:hostReady', (e) => {
  useHostBridge(e.detail?.bridge);
}, { once: true });

// If script loads after the block, the bridge may already be set
if (window.__brandConciergeBridge) {
  useHostBridge(window.__brandConciergeBridge);
}
```

**Option B — Poll for bridge (script loads first):**

```js
function waitForBridge() {
  return new Promise((resolve) => {
    if (window.__brandConciergeBridge) {
      resolve(window.__brandConciergeBridge);
      return;
    }
    window.addEventListener('brandConcierge:hostReady', (e) => {
      resolve(e.detail?.bridge);
    }, { once: true });
  });
}

waitForBridge().then((bridge) => {
  if (bridge) {
    mySignInButton.addEventListener('click', () => bridge.openSusiLight());
    bridge.setTokenReceiver((payload) => { /* handle token */ });
  }
});
```

**Option C — Script loads after block:**  
On init, read `window.__brandConciergeBridge`. If it exists, use it; no need to listen for the event.

---

### 4. Summary for the script

| Concern | What to do |
|--------|------------|
| Know when host is ready | Listen for `brandConcierge:hostReady` and/or check `window.__brandConciergeBridge` on load. |
| Get the API | Use `event.detail.bridge` (from the event) or `window.__brandConciergeBridge`. |
| Open SUSI Light | Call `bridge.openSusiLight()` (e.g. from your “Sign in” button). |
| Receive token after sign-in | Call `bridge.setTokenReceiver((payload) => { ... })` once when ready; host will call it after successful auth. |

All event names use the `brandConcierge:*` namespace. The host does not redirect the page on successful sign-in; it closes the modal and invokes the registered token receiver (if any).
