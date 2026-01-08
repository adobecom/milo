function notifyParent(redirRef) {
  if (!redirRef) return;
  if (window.opener) {
    window.opener.postMessage(
      {
        source: 'stream-preflight',
        status: 'success',
        data: 'Sidekick login successful!!',
      },
      redirRef
    );
  }
  setTimeout( () => {
    window.close()
  }, 1000);
}

export default async function init() {
  const redirRef = new URLSearchParams(window.location.search).get("redirectRef");
  if (!redirRef) return;
  notifyParent(redirRef);
}

(async () => {
  await init();
})();
