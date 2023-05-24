/*
 * Copyright 2022 Adobe. All rights reserved.
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
  const jarvis = getMetadata('jarvis-chat');
  if (!config.jarvis?.id || !config.jarvis?.version) return;
  if (jarvis === 'on') {
    const { initJarvisChat } = await import('../features/jarvis-chat.js');
    initJarvisChat(config, loadScript, loadStyle);
  }
};

export const loadPrivacy = async (getConfig, loadScript) => {
  const acom = '7a5eb705-95ed-4cc4-a11d-0cc5760e93db';
  const ids = {
    'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271-test',
    'hlx.live': '926b16ce-cc88-4c6a-af45-21749f3167f3-test',
  };

  const otDomainId = ids?.[Object.keys(ids)
    .find((domainId) => window.location.host.includes(domainId))]
      ?? (getConfig()?.privacyId || acom);
  window.fedsConfig = {
    privacy: { otDomainId },
    documentLanguage: true,
  };
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');

  // Privacy triggers can exist anywhere on the page and can be added at any time
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href*="#openPrivacy"]')) {
      event.preventDefault();
      window.adobePrivacy?.showPreferenceCenter();
    }
  });
};
/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
const loadDelayed = ([
  getConfig,
  getMetadata,
  loadScript,
  loadStyle,
], DELAY = 3000) => new Promise((resolve) => {
  setTimeout(() => {
    loadPrivacy(getConfig, loadScript);
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    if (getMetadata('interlinks') === 'on') {
      const path = `${getConfig().locale.contentRoot}/keywords.json`;
      import('../features/interlinks.js').then((mod) => { mod.default(path); resolve(mod); });
    } else {
      resolve(null);
    }
    import('../utils/samplerum.js').then(({ sampleRUM }) => sampleRUM('cwv'));
  }, DELAY);
});

export default loadDelayed;
