const sendToCaaS = async (_, sk, options) => {
  const SCRIPT_ID = 'send-caas-listener';
  const dispatchEvent = () => document.dispatchEvent(
    new CustomEvent('send-to-caas', {
      detail: {
        host: sk.config.host,
        project: sk.config.project,
        branch: sk.config.ref,
        repo: sk.config.repo,
        owner: sk.config.owner,
      },
    }),
  );

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.src = 'https://milo.adobe.com/tools/send-to-caas/send-to-caas.js';
    script.id = SCRIPT_ID;
    script.type = 'module';
    script.onload = () => dispatchEvent();
    document.head.appendChild(script);
  } else {
    dispatchEvent();
  }
};

export default sendToCaaS;
