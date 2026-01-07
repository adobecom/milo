function initializeIframe() {
  const iframe = document.querySelector('iframe');
  iframe.classList.add('preflight-iframe');
  iframe.setAttribute('id', 'preflight-iframe')
  const preflightUrl = new URL(window.location.href).searchParams.get('url');
  document.querySelector('iframe').src = preflightUrl;
  return iframe.contentDocument || iframe.contentWindow.document;
}

async function triggerPreflight(iframe) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const script = iframeDoc.createElement('script');
    script.textContent = `
      console.log('⚠️ mathuria: Injected JS running inside iframe');
      const { host } = window.location;
      const BRANCH = host.split('--')[0];
      const SLD = host.includes('.aem.live') ? 'aem.live' || 'aem.page';
      const { getConfig, createTag, loadBlock } = await import(\`https://${BRANCH}--milo--adobecom.${SLD}/libs/utils/utils.js\`);
      const preflight = createTag('div', {class: 'preflight'});
      const content = await loadBlock(preflight);
      const { getModal } = await import(\`https://${BRANCH}--milo--adobecom..${SLD}/libs/blocks/modal/modal.js\`);
      getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
    `;
    iframeDoc.head.appendChild(script);
}

export default async function init() {
  const iframe = initializeIframe();
  setTimeout(() => {
    await triggerPreflight(iframe);
  }, 20000);
}

(async () => {
  await init();
})();
