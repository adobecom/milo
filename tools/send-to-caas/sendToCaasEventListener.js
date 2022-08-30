document.addEventListener('send-to-caas', async (e) => {
  const { default: sendToCaaS } = await import('https://milo.adobe.com/tools/send-to-caas/send-to-caas.js');
  const { host, project, branch, repo, owner } = e.detail;
  sendToCaaS({ host, project, branch, repo, owner });
});
