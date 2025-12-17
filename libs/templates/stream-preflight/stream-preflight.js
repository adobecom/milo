export default async function init() {
  const iframe = document.querySelector('iframe').classList.add('preflight-iframe');
  const url = new URL(window.location.href);
  const preflightUrl = url.searchParams.get('preflightUrl');
  if (preflightUrl) document.querySelector('iframe').src = preflightUrl;
  setTimeout(() => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const script = iframeDoc.createElement('script');
    script.textContent = `
    console.log('⚠️ mathuria: Injected JS running inside iframe');
    `;
  }, 1000);
}

(async () => {
  await init();
})();
