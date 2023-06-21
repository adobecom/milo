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

// Production Domain
const prodDomains = ['milo.adobe.com'];

const config = {
  geoRouting: 'on',
  fallbackRouting: 'on',
  links: 'on',
  imsClientId: 'milo',
  imsScope: 'AdobeID,openid,gnav',
  codeRoot: '/libs',
  prodDomains,
  jarvis: {
    id: 'milo',
    version: '1.0',
    onDemand: false,
  },
  privacyId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db', // valid for *.adobe.com
};

(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.setAttribute('loading', 'eager');
}());

(async function loadPage() {
  const [
    adobecomConfig,
    { loadArea, setConfig, loadLana },
  ] = await Promise.all([
    fetch('../libs/configs/adobecom.json').then((r) => r.json()),
    import('../utils/utils.js'),
  ]);
  setConfig({ ...adobecomConfig, ...config });
  loadLana({ clientId: 'milo' });
  await loadArea();
}());
