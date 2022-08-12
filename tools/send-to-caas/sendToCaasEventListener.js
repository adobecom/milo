document.addEventListener('send-to-caas', async (e) => {
  const { default: sendToCaaS } = await import('./send-to-caas.js');
  const { host, project, branch, repo, owner } = e.detail;
  sendToCaaS({ host, project, branch, repo, owner });
});
