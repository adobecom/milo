const loadPrivacy = async (getConfig, loadScript) => {
  const { privacyId, env, holdPrivacyBanner, locale } = getConfig();
  const acom = '7a5eb705-95ed-4cc4-a11d-0cc5760e93db';
  const ids = {
    'hlx.page': 'f5b9e81a-54b5-40cb-afc3-84ca26e7dbaf-test',
    'hlx.live': '01958a9e-818e-7213-8d4a-8b3b7a4ec33e-test',
    'aem.page': '01954847-62a4-7afc-bdc7-f110c4e35b5d-test',
    'aem.live': '01954848-3f9e-7267-ac5d-d4076841aeb1-test',
    'aem.reviews': '019928fc-0bcd-7c53-9cde-ea06b4fc7294-test',
  };

  const otDomainId = ids?.[Object.keys(ids)
    .find((domainId) => window.location.host.includes(domainId))]
      ?? privacyId ?? acom;
  window.fedsConfig = {
    privacy: { otDomainId, locale: locale?.prefix ?? '' },
    documentLanguage: true,
  };
  if (holdPrivacyBanner === true) {
    window.fedsConfig.privacy.holdBanner = 'hold-banner';
  }
  // Load the privacy script
  let privacyEnv = '';
  if (env?.name !== 'prod') {
    const param = new URLSearchParams(window.location.search).get('privacyEnv') || '';
    if (['dev01', 'dev02', 'qa01', 'stage'].includes(param)) {
      privacyEnv = param;
    }
  }
  loadScript(`https://www.${privacyEnv && `${privacyEnv}.`}adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js`);

  // Privacy triggers can exist anywhere on the page and can be added at any time
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href*="#openPrivacy"]')) {
      event.preventDefault();
      window.adobePrivacy?.showPreferenceCenter({
        modalLaunchMethod: 'Footer link',
        triggerElement: event.target,
      });
    }
  });
};

export default loadPrivacy;