document.addEventListener('publish-caas', async (e) => {
  console.log('publish-caas');
  const { default: publishToCaaS } = await import('./publish-caas.js');
  publishToCaaS(e.detail.host);
});
