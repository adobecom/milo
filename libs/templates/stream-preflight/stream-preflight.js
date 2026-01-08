function initializeIframe() {
  const iframeEl = document.querySelector('iframe');
  iframeEl.classList.add('preflight-iframe');
  iframeEl.setAttribute('id', 'preflight-iframe');
  const preflightUrl = decodeURIComponent(new URL(window.location.href).searchParams.get('url'));
  document.querySelector('iframe').src = preflightUrl;
}

function getMiloBranch(url) {
  const iframeEl = document.querySelector('iframe');
  const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow.document;
  const url = decodeURIComponent(new URL(window.location.href).searchParams.get('url'));
  const urlConfig = new URL(url);
  const miloLib = new URL(urlConfig.searchParams.get('milolibs'));
  if (miloLib && miloLib.includes('--')) return `https:\\${miloLib}.aem.live`;
  if (miloLib) return `https:\\${miloLib}--milo--adobecom.aem.live`;
  return `https://${urlConfig.host.split('--')[0]}--milo--adobecom.aem.live`;
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
    const script = iframeDoc.createElement('script');
    const { host } = window.location;
    const miloHost = getMiloBranchURL(url);
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
