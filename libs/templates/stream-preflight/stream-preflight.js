export default async function init() {
  document.querySelector('iframe').classList.add('preflight-iframe');
  document.querySelector('iframe').src = 'https://main--da-bacom--adobecom.aem.page/ai/agentic-ai';
}

(async () => {
  await init();
})();
