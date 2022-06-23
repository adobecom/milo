document.addEventListener('publish-caas', async (e) => {
  const { default: publishToCaaS } = await import('./publish-caas.js');
  const { host, project, branch, repo, owner } = e.detail;
  publishToCaaS({ host, project, branch, repo, owner });
});
