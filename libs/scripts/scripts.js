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

const conf = {
  imsClientId: 'milo',
  projectRoot: `${window.location.origin}/libs`,
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  },
};

(async function loadPage() {
  // The first image should not be lazy.
  const img = document.querySelector('main img');
  img?.setAttribute('loading', 'eager');

  const {
    decorateArea,
    decorateNavs,
    loadLCP,
    loadArea,
    loadDelayed,
    loadTemplate,
    setConfig,
  } = await import('../utils/utils.js');

  const config = setConfig(conf);
  const blocks = decorateArea();
  const navs = decorateNavs();
  await loadLCP({ blocks });
  const { default: setFonts } = await import('../utils/fonts.js');
  setFonts(config.locale);
  loadTemplate();
  await loadArea({ blocks: [...navs, ...blocks] });
  const { default: loadModals } = await import('../blocks/modals/modals.js');
  loadModals();
  loadDelayed();
}());
