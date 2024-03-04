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
  initJarvisChat(config, loadScript, loadStyle);
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

export const loadGoogleLogin = async (getMetadata, loadIms, loadScript) => {
  const googleLogin = getMetadata('google-login')?.toLowerCase();
  if (window.adobeIMS?.isSignedInUser() || !['mobile', 'desktop', 'on'].includes(googleLogin)) return;
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (googleLogin === 'mobile' && desktopViewport) return;
  if (googleLogin === 'desktop' && !desktopViewport) return;

  const { default: initGoogleLogin } = await import('../features/google-login.js');
  initGoogleLogin(loadIms, getMetadata, loadScript);
};

// TODO: adapt logic to only start execution after App Switcher loads;
// we then need to position the prompt relative to it
export const loadAppPrompt = async (getConfig, getMetadata, loadStyle) => {
  const state = getMetadata('app-prompt')?.toLowerCase();
  const entName = getMetadata('app-prompt-entitlement')?.toLowerCase();
  const promptPath = getMetadata('app-prompt-path')?.toLowerCase();
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (state === 'off'
    || !window.adobeIMS?.isSignedInUser()
    || !desktopViewport
    || !entName?.length
    || !promptPath?.length) return;

  const id = promptPath.split('/').pop();
  const isDismissed = JSON.parse(document.cookie
    .split(';')
    .find((item) => item.trim().startsWith('dismissedAppPrompts='))
    ?.split('=')[1] || '[]')
    .includes(id);

  if (isDismissed) return;

  // TODO: factor in multiple entitlements, one for app, one for web app usage?
  // const entitlements = await getConfig().entitlements();
  const entitlements = ['photoshop']; // TODO: replace this line with the one above

  if (!entitlements?.length || !entitlements.includes(entName)) return;

  const { base, env } = getConfig();
  const profileApi = `https://${env.adobeIO}/profile`;
  const [
    webappPrompt,
  ] = await Promise.all([
    import('../features/webapp-prompt/webapp-prompt.js'),
    loadStyle(`${base}/features/webapp-prompt/webapp-prompt.css`),
  ]);

  webappPrompt.default({ promptPath, id, profileApi, entName });
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
    loadPrivacy(getConfig, loadScript);
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    loadGoogleLogin(getMetadata, loadIms, loadScript);
    loadAppPrompt(getConfig, getMetadata, loadStyle);
    if (getMetadata('interlinks') === 'on') {
      const { locale } = getConfig();
      const path = `${locale.contentRoot}/keywords.json`;
      const language = locale.ietf?.split('-')[0];
      import('../features/interlinks.js').then((mod) => { mod.default(path, language); resolve(mod); });
    } else {
      resolve(null);
    }
    import('../utils/samplerum.js').then(({ sampleRUM }) => sampleRUM('cwv'));
  }, DELAY);
});

export default loadDelayed;
