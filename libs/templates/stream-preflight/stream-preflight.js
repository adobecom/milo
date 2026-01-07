function initializeIframe() {
  const iframe = document.querySelector('iframe');
  iframe.classList.add('preflight-iframe');
  iframe.setAttribute('id', 'preflight-iframe')
  const preflightUrl = new URL(window.location.href).searchParams.get('url');
  document.querySelector('iframe').src = preflightUrl;
}

async function triggerPreflight() {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const script = iframeDoc.createElement('script');
    script.textContent = `
      console.log('⚠️ mathuria: Injected JS running inside iframe');
    `;
    iframeDoc.head.appendChild(script);
}

export default async function init() {
  const preflightUrl = initializeIframe();
  setTimeout(() => {
    await triggerPreflight();
  }, 6000);
}

(async () => {
  await init();
})();
