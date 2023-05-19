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
  const { default: initPrivacy } = await import('../features/privacy.js');
  initPrivacy(getConfig(), loadScript);
};
/**
 * Executes everything that happens a lot later, without impacting the user experience.
 */
const loadDelayed = ([
  getConfigFunc,
  getMetadataFunc,
  loadScriptFunc,
  loadStyleFunc,
], delay = 3000) => {
  const getConfig = getConfigFunc;
  const getMetadata = getMetadataFunc;
  const loadScript = loadScriptFunc;
  const loadStyle = loadStyleFunc;

  return new Promise((resolve) => {
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
    }, delay);
  });
};

export default loadDelayed;
