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
  const acom = '7a5eb705-95ed-4cc4-a11d-0cc5760e93db';
  const ids = {
    'hlx.page': '3a6a37fe-9e07-4aa9-8640-8f358a623271-test',
    'hlx.live': '926b16ce-cc88-4c6a-af45-21749f3167f3-test',
    'aem.page': '01930689-3b6a-7d5f-9797-8df2c3901a05-test',
    'aem.live': '01930691-c4e5-75ba-aa0e-721e1213c139-test',
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

export const loadGoogleLogin = async (getMetadata, loadIms, loadScript, getConfig) => {
  const googleLogin = getMetadata('google-login')?.toLowerCase();
  if (window.adobeIMS?.isSignedInUser() || !['mobile', 'desktop', 'on'].includes(googleLogin)) return;
  const desktopViewport = window.matchMedia('(min-width: 900px)').matches;
  if (googleLogin === 'mobile' && desktopViewport) return;
  if (googleLogin === 'desktop' && !desktopViewport) return;

  const { default: initGoogleLogin } = await import('../features/google-login.js');
  initGoogleLogin(loadIms, getMetadata, loadScript, getConfig);
};

function containsHiddenContent(el) {
  // Grab all child nodes (including el itself if you want)
  const allNodes = el.querySelectorAll('*');

  for (const node of allNodes) {
    const style = window.getComputedStyle(node);

    if (
      style.display === 'none'
        || style.visibility === 'hidden'
        || style.opacity === '0'
        || node.hasAttribute('hidden')
    ) {
      return true;
    }
  }

  return false;
}

export const showHiddenContent = (block) => {
  const forciblyUnhidden = new WeakSet();

  const elements = block.querySelectorAll('*');

  elements.forEach((el) => {
    const style = window.getComputedStyle(el);

    const isHidden = style.display === 'none'
        || style.visibility === 'hidden'
        || style.opacity === '0'
        || el.hasAttribute('hidden');

    if (!isHidden) {
      return; // not hidden, do nothing
    }

    let hasUnhiddenAncestor = false;
    let parent = el.parentElement;
    while (parent) {
      if (forciblyUnhidden.has(parent)) {
        hasUnhiddenAncestor = true;
        break;
      }
      parent = parent.parentElement;
    }

    if (!hasUnhiddenAncestor) {
      el.style.border = '2px dashed red';
    }

    if (style.display === 'none') {
      el.style.setProperty('display', 'block', 'important');
    }

    if (style.visibility === 'hidden') {
      el.style.setProperty('visibility', 'visible', 'important');
    }

    if (style.opacity === '0') {
      el.style.setProperty('opacity', '1', 'important');
    }

    if (el.hasAttribute('hidden')) {
      el.removeAttribute('hidden');
    }

    // Mark this element as "forcibly unhidden"
    forciblyUnhidden.add(el);
  });
};

export function copyComponentsWithHiddenContent() {
  const sections = document.querySelectorAll('main .section');

  sections.forEach((section) => {
    const components = section.querySelectorAll(':scope > div:not(.metadata, .section-metadata, .card-metadata)');

    components.forEach((component) => {
      if (containsHiddenContent(component)) {
        const clone = component.cloneNode(true);

        clone.style.border = '2px dashed red';
        clone.setAttribute('data-hidden-copy', 'true'); // for debugging

        // Insert the clone *immediately after* the original component
        component.parentNode.insertBefore(clone, component.nextSibling);
        showHiddenContent(clone);
      }
    });
  });
}

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
    const urlParams = new URLSearchParams(window.location.search);
    const showHiddenContentParam = urlParams.get('showHiddenContent');
    if (showHiddenContentParam === 'on') copyComponentsWithHiddenContent()();
  }, DELAY);
});

export default loadDelayed;
