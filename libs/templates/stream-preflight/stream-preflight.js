function initializeIframe() {
  const iframeEl = document.querySelector('iframe');
  iframeEl.classList.add('preflight-iframe');
  iframeEl.setAttribute('id', 'preflight-iframe');
  const rawUrlParam = new URL(window.location.href).searchParams.get('url');
  if (!rawUrlParam) {
    return;
  }
  let targetUrl;
  try {
    const decodedUrl = decodeURIComponent(rawUrlParam);
    targetUrl = new URL(decodedUrl, window.location.origin);
  } catch (e) {
    // Invalid URL, do not update iframe src
    return;
  }
  const isSameHost = targetUrl.host === window.location.host;
  const isHttpProtocol = targetUrl.protocol === 'http:' || targetUrl.protocol === 'https:';
  if (isSameHost && isHttpProtocol) {
    iframeEl.src = targetUrl.toString();
  }
}

function getMiloBranchURL() {
  try {
    const currentUrl = new URL(window.location.href);
    const urlParam = currentUrl.searchParams.get('url');
    if (!urlParam) return window.location.origin;
    const url = decodeURIComponent(urlParam);
    const urlConfig = new URL(url, window.location.href);
    const miloLib = urlConfig.searchParams.get('milolibs');
    if (miloLib && miloLib.includes('--')) return `https:\\${miloLib}.aem.live`;
    if (miloLib) return `https:\\${miloLib}--milo--adobecom.aem.live`;
    return `https://${urlConfig.host.split('--')[0]}--milo--adobecom.aem.live`;
  } catch (e) {
    // Fallback to current origin if the URL parameter is invalid.
    return window.location.origin;
  }
}

function preflightScript(miloHost) {
  return `
      console.log('Started preflight execution');
      (async () => {
        const { getConfig, createTag, loadBlock } = await import('${miloHost}/libs/utils/utils.js');
        const preflight = createTag('div', {class: 'preflight'});
        const content = await loadBlock(preflight);
        const { getModal } = await import('${miloHost}/libs/blocks/modal/modal.js');
        getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
      })();
    `;
}

async function triggerPreflight() {
  const iframeEl = document.querySelector('iframe');
  const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow.document;
  const script = iframeDoc.createElement('script');
  const miloHost = getMiloBranchURL();
  script.textContent = preflightScript(miloHost);
  iframeDoc.head.appendChild(script);
}

export default async function init() {
  initializeIframe();
  setTimeout(async () => {
    await triggerPreflight();
  }, 5000);
}

(async () => {
  await init();
})();
