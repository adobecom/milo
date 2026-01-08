function notifyParent() {
  if (!parentRedir) return;
  if (window.opener) {
    window.opener.postMessage(
      {
        source: 'stream-preflight',
        status: 'success',
        data: 'Sidekick login successful!!',
      },
      decodeURIComponent(parentRedir)
    );
  }
  setTimeout( () => {
    window.close()
  }, 1000);
}

export default async function init() {
  const parentRedir = new URL(window.location.href).searchParams('redirectRef');
  notifyParent(parentRedir);
}

(async () => {
  await init();
})();
