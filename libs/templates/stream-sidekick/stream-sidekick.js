function notifyParent(redirRef, ackCode) {
  if (!redirRef) return;
  if (window.opener) {
    window.opener.postMessage(
      {
        source: 'stream-preflight',
        status: 'success',
        data: 'Sidekick login successful!!',
        code: ackCode,
      },
      redirRef,
    );
  }
  setTimeout(() => {
    window.close();
  }, 1000);
}

export default async function init() {
  const redirRef = new URLSearchParams(window.location.search).get('redirectRef');
  const ackCode = new URLSearchParams(window.location.search).get('ackCode');
  if (!redirRef || !ackCode) return;
  notifyParent(redirRef, ackCode);
}

(async () => {
  await init();
})();
