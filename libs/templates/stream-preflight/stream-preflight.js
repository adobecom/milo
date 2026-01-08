function initializeIframe() {
  const iframe = document.querySelector('iframe');
  iframe.classList.add('preflight-iframe');
  iframe.setAttribute('id', 'preflight-iframe')
  const preflightUrl = decodeURIComponent(new URL(window.location.href).searchParams.get('url'));
  document.querySelector('iframe').src = preflightUrl;
  return iframe.contentDocument || iframe.contentWindow.document;
}

async function triggerPreflight() {
    const iframe = document.querySelector('iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const script = iframeDoc.createElement('script');
    const { host } = window.location;
    const BRANCH = host.split('--')[0];
    script.textContent = `
      console.log('Started preflight execution');
      (async () => {
        const { getConfig, createTag, loadBlock } = await import('https://${BRANCH}--milo--adobecom.aem.live/libs/utils/utils.js');
        const preflight = createTag('div', {class: 'preflight'});
        const content = await loadBlock(preflight);
        const { getModal } = await import('https://${BRANCH}--milo--adobecom.aem.live/libs/blocks/modal/modal.js');
        getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
      })();
    `;
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
