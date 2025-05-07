/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export const loadJarvisChat = async (getConfig, getMetadata, loadScript, loadStyle) => {
  const config = getConfig();
  const jarvis = getMetadata('jarvis-chat')?.toLowerCase();
  if (!jarvis || !['mobile', 'desktop', 'on'].includes(jarvis)
    || !config.jarvis?.id || !config.jarvis?.version) return;

  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (jarvis === 'mobile' && desktopViewport) return;
  if (jarvis === 'desktop' && !desktopViewport) return;

  const { initJarvisChat } = await import('../features/jarvis-chat.js');
  initJarvisChat(config, loadScript, loadStyle, getMetadata);
};

export const loadPrivacy = async (getConfig, loadScript) => {
  const { privacyId, env } = getConfig();
  const acom = '7a5eb705-95ed-4cc4-a11d-0cc5760e93db';
  const ids = {
    'hlx.page': 'f5b9e81a-54b5-40cb-afc3-84ca26e7dbaf-test',
    'hlx.live': '01958a9e-818e-7213-8d4a-8b3b7a4ec33e-test',
    'aem.page': '01954847-62a4-7afc-bdc7-f110c4e35b5d-test',
    'aem.live': '01954848-3f9e-7267-ac5d-d4076841aeb1-test',
  };

  const otDomainId = ids?.[Object.keys(ids)
    .find((domainId) => window.location.host.includes(domainId))]
      ?? privacyId ?? acom;
  window.fedsConfig = {
    privacy: { otDomainId },
    documentLanguage: true,
  };

  // Load the privacy script
  let privacyEnv = '';
  if (env?.name !== 'prod') {
    privacyEnv = new URLSearchParams(window.location.search).get('privacyEnv') || '';
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

export const loadGoogleLogin = async (getMetadata, loadIms, loadScript, getConfig) => {
  const googleLogin = getMetadata('google-login')?.toLowerCase();
  if (window.adobeIMS?.isSignedInUser() || !['mobile', 'desktop', 'on'].includes(googleLogin)) return;
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (googleLogin === 'mobile' && desktopViewport) return;
  if (googleLogin === 'desktop' && !desktopViewport) return;

  const { default: initGoogleLogin } = await import('../features/google-login.js');
  initGoogleLogin(loadIms, getMetadata, loadScript, getConfig);
};

export const loadAriaAutomation = async () => {
  const { default: addAriaLabels } = await import('../utils/automated-aria.js');
  addAriaLabels();
};

/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
const loadDelayed = ([
  getConfig,
  getMetadata,
  loadScript,
  loadStyle,
  loadIms,
], DELAY = 3000) => new Promise((resolve) => {
  setTimeout(() => {
    if (!window.adobePrivacy) loadPrivacy(getConfig, loadScript);
    loadAriaAutomation();
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    loadGoogleLogin(getMetadata, loadIms, loadScript, getConfig);
    if (getMetadata('interlinks') === 'on') {
      const { locale } = getConfig();
      const path = `${locale.contentRoot}/keywords.json`;
      const language = locale.ietf?.split('-')[0];
      import('../features/interlinks.js').then((mod) => { mod.default(path, language); resolve(mod); });
    } else {
      resolve(null);
    }
    import('../utils/samplerum.js').then(({ sampleRUM }) => sampleRUM());
  }, DELAY);
});

export default loadDelayed;
