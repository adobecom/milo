(() => {
  const moduleUrl = new URL('./login-trigger.js', document.currentScript.src);
  const ready = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((resolve) => {
      window.addEventListener('load', resolve, { once: true });
    });
  ready.then(() => import(moduleUrl.href)).then(({ default: init }) => init()).catch((error) => {
    window.lana?.log(`EVNT027: ${error.message}`, { tags: 'evnt027', severity: 'error' });
    console.error('EVNT027 login prompt:', error);
  });
})();
