export default async function init() {
  document.querySelector('iframe').classList.add('preflight-iframe');
  const url = new URL(window.location.href);
  const preflightUrl = url.searchParams.get('preflightUrl');
  if (preflightUrl) document.querySelector('iframe').src = preflightUrl;
}

(async () => {
  await init();
})();
