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

import { isAcomAssistantEnabled } from '../utils/utils.js';

export const loadJarvisChat = async (getConfig, getMetadata, loadScript, loadStyle) => {
  const config = getConfig();
  const jarvis = getMetadata('jarvis-chat')?.toLowerCase();
  if (!jarvis || !['mobile', 'desktop', 'on'].includes(jarvis)
    || !config.jarvis?.id || !config.jarvis?.version) return;

  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (jarvis === 'mobile' && desktopViewport) return;
  if (jarvis === 'desktop' && !desktopViewport) return;

  const hasBrandConcierge = getMetadata('gnav-brand-concierge')?.toLowerCase() === 'on'
    || !!document.querySelector('.brand-concierge');
  if (isAcomAssistantEnabled() && hasBrandConcierge) {
    const { default: initChatLinks } = await import('../features/acom-assistant-gnav-link.js');
    await initChatLinks(config, loadScript, loadStyle, getMetadata);
    return;
  }

  const { initJarvisChat } = await import('../features/jarvis-chat.js');
  initJarvisChat(config, loadScript, loadStyle, getMetadata);
};

export const loadBlockNotifications = async (getConfig, loadStyle) => {
  const { env, miloLibs, codeRoot } = getConfig();

  if (env.name === 'local' || window.location.host.includes('.page')) {
    const base = miloLibs || codeRoot;
    loadStyle(`${base}/styles/block-notifications.css`);

    const { default: blockNotifications } = await import('../utils/block-notifications.js');
    blockNotifications(base);
  }
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

export const addRUMCampaignTrackingParameters = ({ sampleRUM }) => {
  const usp = new URLSearchParams(window.location.search);
  [
    { key: 'sdid', utmKey: 'utm_campaign' },
    { key: 'mv', utmKey: 'utm_source' },
    { key: 'mv2', utmKey: 'utm_medium' },
  ].forEach(({ key, utmKey }) => {
    const val = usp.get(key);
    if (!val || (key === 'sdid' && val.length > 8)) return;
    sampleRUM('utm', { source: utmKey, target: val });
  });
};

export const loadPreflightResults = async () => {
  const { hostname } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPreview = hostname.endsWith('.aem.page');
  const isLive = hostname.endsWith('.aem.live');
  if (!isLocal && !isPreview && !isLive) return;

  const run = async () => {
    if (isLocal || isPreview) {
      const { default: autoHighlightUnpublished } = await import('../blocks/preflight/checks/diff/autoHighlight.js');
      await autoHighlightUnpublished();
    }
    if (!isLocal) {
      const { default: showPreflightNotification } = await import('../utils/preflight-notification.js');
      await showPreflightNotification();
    }
  };

  const sk = document.querySelector('aem-sidekick, helix-sidekick');
  if (sk || isLocal) {
    await run();
  } else {
    document.addEventListener('sidekick-ready', run, { once: true });
  }
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
    loadAriaAutomation();
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    loadGoogleLogin(getMetadata, loadIms, loadScript, getConfig);
    loadBlockNotifications(getConfig, loadStyle);
    if (getMetadata('interlinks') === 'on') {
      const { locale } = getConfig();
      const path = `${locale.contentRoot}/keywords.json`;
      const language = locale.ietf?.split('-')[0];
      import('../features/interlinks.js').then((mod) => { mod.default(path, language); resolve(mod); });
    } else {
      resolve(null);
    }
    loadPreflightResults();
    import('../utils/samplerum.js').then(({ sampleRUM }) => {
      sampleRUM();
      addRUMCampaignTrackingParameters({ sampleRUM });
    });
  }, DELAY);
});

export default loadDelayed;
