chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
});

// content.js (injected into github.com) can't reliably fetch the relay
// itself — a content script's fetch is subject to the host page's CSP, which
// will likely block a cross-origin request to 127.0.0.1. The background
// service worker is not a page and isn't bound by github.com's CSP, so it
// performs the /api/simplify call on the content script's behalf.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'SIMPLIFY') return false;
  fetch('http://127.0.0.1:4756/api/simplify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: message.body }),
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (!ok) return sendResponse({ error: data.error || 'simplify failed' });
      sendResponse({ simplified: data.simplified });
    })
    .catch((err) => sendResponse({ error: err.message }));
  return true; // keep the message channel open for the async sendResponse above
});
