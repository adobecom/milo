function initializeIframe() {
  const iframeEl = document.querySelector('iframe');
  iframeEl.classList.add('preflight-iframe');
  iframeEl.setAttribute('id', 'preflight-iframe')
  const preflightUrl = decodeURIComponent(new URL(window.location.href).searchParams.get('url'));
  document.querySelector('iframe').src = preflightUrl;
  return {
    url: preflightUrl,
    iframeDoc: iframeEl.contentDocument || iframeEl.contentWindow.document,
  };
}

function getMiloBranch(url) {
  const urlConfig = new URL(url);
  const miloLib = new URL(urlConfig.searchParams.get('milolibs'))
  return miloLib ? miloLib : urlConfig.host.split('--')[0]
}

function preflightScript(branch) {
  return `
      console.log('Started preflight execution');
      (async () => {
        const { getConfig, createTag, loadBlock } = await import('https://${BRANCH}--milo--adobecom.aem.live/libs/utils/utils.js');
        const preflight = createTag('div', {class: 'preflight'});
        const content = await loadBlock(preflight);
        const { getModal } = await import('https://${BRANCH}--milo--adobecom.aem.live/libs/blocks/modal/modal.js');
        getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
      })();
    `;
}

async function triggerPreflight() {
    const { url, iframeDoc } = document.querySelector('iframe');
    const script = iframeDoc.createElement('script');
    const { host } = window.location;
    const branch = getMiloBranch(url);
    script.textContent = preflightScript(branch);
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
