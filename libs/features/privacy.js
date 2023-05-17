const loadPrivacy = (config, loadScript) => {
  const ids = {
    'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271-test',
    'hlx.live': '926b16ce-cc88-4c6a-af45-21749f3167f3',
  };

  const otDomainId = ids?.[Object.keys(ids)
    .find((domainId) => window.location.host.includes(domainId))] ?? config.privacyId;
  window.fedsConfig = {
    privacy: { otDomainId },
    documentLanguage: true,
  };
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');

  // TODO: remove once gnav block is decommissioned
  const privacyTrigger = document.querySelector('footer a[href*="#openPrivacy"]');
  privacyTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    window.adobePrivacy?.showPreferenceCenter();
  });
};

export default loadPrivacy;
