
function notifyParent(redirRef, ackCode, targetUrl) {
  if (!redirRef) return;
  const payload = {
    source: 'stream-login',
    status: 'success',
    data: 'Sidekick login successful!!',
    code: ackCode,
    url: targetUrl || null,
  };
  // Inform the parent if we still have a handle to it. This works when the IMS
  // sign-in did NOT sever window.opener (e.g. the user was already signed in).
  if (window.opener) {
    // Popup case: opened via window.open() from the stream app.
    window.opener.postMessage(payload, redirRef);
  } else if (window.parent && window.parent !== window) {
    // Iframe case: loaded inside the stream-client preview iframe.
    window.parent.postMessage(payload, redirRef);
  }
  setTimeout(() => {
    window.close();
  }, 1000);
}

export default async function init() {
  const params = new URLSearchParams(window.location.search);
  const redirRef = params.get('redirectRef');
  const ackCode = params.get('ackCode');
  const targetUrl = params.get('url');
  if (!redirRef || !ackCode) return;
  notifyParent(redirRef, ackCode, targetUrl);
}

(async () => {
  await init();
})();
