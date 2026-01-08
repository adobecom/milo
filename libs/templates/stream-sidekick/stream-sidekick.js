export default async function init() {
  if (window.opener) {
  window.opener.postMessage(
      {
        status: "success",
        data: "Sidekick login successful"
      },
      window.location.origin,
    );
  }
  setTimeout( () => {
    window.close()
  }, 1000);
}

(async () => {
  await init();
})();
