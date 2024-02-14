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

import {
  loadArea,
  loadLana,
  setConfig,
} from '../utils/utils.js';

// Production Domain
const prodDomains = ['milo.adobe.com'];

const locales = {
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  ae_ar: { ietf: 'ar-AE', tk: 'lpk1hwn.css', dir: 'rtl' },
  ae_en: { ietf: 'en', tk: 'hah7vzn.css' },
  africa: { ietf: 'en', tk: 'hah7vzn.css' },
  ar: { ietf: 'ar', tk: 'lpk1hwn.css', dir: 'rtl' },
  ar_es: { ietf: 'es-AR', tk: 'hah7vzn.css' },
  at: { ietf: 'de-AT', tk: 'hah7vzn.css' },
  au: { ietf: 'en-AU', tk: 'hah7vzn.css' },
  be_en: { ietf: 'en-BE', tk: 'hah7vzn.css' },
  be_fr: { ietf: 'fr-BE', tk: 'hah7vzn.css' },
  be_nl: { ietf: 'nl-BE', tk: 'qxw8hzm.css' },
  bg: { ietf: 'bg-BG', tk: 'qxw8hzm.css' },
  br: { ietf: 'pt-BR', tk: 'hah7vzn.css' },
  ca_fr: { ietf: 'fr-CA', tk: 'hah7vzn.css' },
  ca: { ietf: 'en-CA', tk: 'hah7vzn.css' },
  ch_de: { ietf: 'de-CH', tk: 'hah7vzn.css' },
  ch_fr: { ietf: 'fr-CH', tk: 'hah7vzn.css' },
  ch_it: { ietf: 'it-CH', tk: 'hah7vzn.css' },
  cl: { ietf: 'es-CL', tk: 'hah7vzn.css' },
  cn: { ietf: 'zh-CN', tk: 'qxw8hzm' },
  co: { ietf: 'es-CO', tk: 'hah7vzn.css' },
  cr: { ietf: 'es-419', tk: 'hah7vzn.css' },
  cy_en: { ietf: 'en-CY', tk: 'hah7vzn.css' },
  cz: { ietf: 'cs-CZ', tk: 'qxw8hzm.css' },
  de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
  dk: { ietf: 'da-DK', tk: 'qxw8hzm.css' },
  ec: { ietf: 'es-419', tk: 'hah7vzn.css' },
  ee: { ietf: 'et-EE', tk: 'qxw8hzm.css' },
  eg_ar: { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' },
  eg_en: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  el: { ietf: 'el', tk: 'qxw8hzm.css' },
  es: { ietf: 'es-ES', tk: 'hah7vzn.css' },
  fi: { ietf: 'fi-FI', tk: 'qxw8hzm.css' },
  fr: { ietf: 'fr-FR', tk: 'hah7vzn.css' },
  gr_el: { ietf: 'el', tk: 'qxw8hzm.css' },
  gr_en: { ietf: 'en-GR', tk: 'hah7vzn.css' },
  gt: { ietf: 'es-419', tk: 'hah7vzn.css' },
  hk_en: { ietf: 'en-HK', tk: 'hah7vzn.css' },
  hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd' },
  hu: { ietf: 'hu-HU', tk: 'qxw8hzm.css' },
  id_en: { ietf: 'en', tk: 'hah7vzn.css' },
  id_id: { ietf: 'id', tk: 'qxw8hzm.css' },
  ie: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  il_en: { ietf: 'en-IL', tk: 'hah7vzn.css' },
  il_he: { ietf: 'he', tk: 'qxw8hzm.css', dir: 'rtl' },
  in_hi: { ietf: 'hi', tk: 'qxw8hzm.css' },
  in: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  it: { ietf: 'it-IT', tk: 'hah7vzn.css' },
  jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
  kw_ar: { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' },
  kw_en: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  la: { ietf: 'es-LA', tk: 'hah7vzn.css' },
  langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
  lt: { ietf: 'lt-LT', tk: 'qxw8hzm.css' },
  lu_de: { ietf: 'de-LU', tk: 'hah7vzn.css' },
  lu_en: { ietf: 'en-LU', tk: 'hah7vzn.css' },
  lu_fr: { ietf: 'fr-LU', tk: 'hah7vzn.css' },
  lv: { ietf: 'lv-LV', tk: 'qxw8hzm.css' },
  mena_ar: { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' },
  mena_en: { ietf: 'en', tk: 'hah7vzn.css' },
  mt: { ietf: 'en-MT', tk: 'hah7vzn.css' },
  mx: { ietf: 'es-MX', tk: 'hah7vzn.css' },
  my_en: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  my_ms: { ietf: 'ms', tk: 'qxw8hzm.css' },
  ng: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  nl: { ietf: 'nl-NL', tk: 'qxw8hzm.css' },
  no: { ietf: 'no-NO', tk: 'qxw8hzm.css' },
  nz: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  pe: { ietf: 'es-PE', tk: 'hah7vzn.css' },
  ph_en: { ietf: 'en', tk: 'hah7vzn.css' },
  ph_fil: { ietf: 'fil-PH', tk: 'qxw8hzm.css' },
  pl: { ietf: 'pl-PL', tk: 'qxw8hzm.css' },
  pr: { ietf: 'es-419', tk: 'hah7vzn.css' },
  pt: { ietf: 'pt-PT', tk: 'hah7vzn.css' },
  qa_ar: { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' },
  qa_en: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  ro: { ietf: 'ro-RO', tk: 'qxw8hzm.css' },
  ru: { ietf: 'ru-RU', tk: 'qxw8hzm.css' },
  sa_ar: { ietf: 'ar', tk: 'qxw8hzm.css', dir: 'rtl' },
  sa_en: { ietf: 'en', tk: 'hah7vzn.css' },
  se: { ietf: 'sv-SE', tk: 'qxw8hzm.css' },
  sg: { ietf: 'en-SG', tk: 'hah7vzn.css' },
  si: { ietf: 'sl-SI', tk: 'qxw8hzm.css' },
  sk: { ietf: 'sk-SK', tk: 'qxw8hzm.css' },
  th_en: { ietf: 'en', tk: 'hah7vzn.css' },
  th_th: { ietf: 'th', tk: 'qxw8hzm.css' },
  tr: { ietf: 'tr-TR', tk: 'qxw8hzm.css' },
  tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
  ua: { ietf: 'uk-UA', tk: 'qxw8hzm.css' },
  uk: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  vn_en: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  vn_vi: { ietf: 'vi', tk: 'qxw8hzm.css' },
  za: { ietf: 'en-GB', tk: 'hah7vzn.css' },
  cis_en: { ietf: 'en', tk: 'rks2kng.css' },
  cis_ru: { ietf: 'ru', tk: 'qxw8hzm.css' },
  sea: { ietf: 'en', tk: 'hah7vzn.css' },
};

const config = {
  geoRouting: 'on',
  fallbackRouting: 'on',
  links: 'on',
  imsClientId: 'milo',
  imsScope: 'AdobeID,openid,gnav',
  codeRoot: '/libs',
  locales,
  prodDomains,
  jarvis: {
    id: 'milo',
    version: '1.0',
    onDemand: false,
  },
  privacyId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db', // valid for *.adobe.com
  breadcrumbs: 'on',
  // taxonomyRoot: '/your-path-here',
};

const eagerLoad = (img) => {
  img?.setAttribute('loading', 'eager');
  img?.setAttribute('fetchpriority', 'high');
};

(async function loadLCPImage() {
  const firstDiv = document.querySelector('body > main > div:nth-child(1) > div');
  if (firstDiv?.classList.contains('marquee')) {
    firstDiv.querySelectorAll('img').forEach(eagerLoad);
  } else {
    eagerLoad(document.querySelector('img'));
  }
}());

(async function loadPage() {
  performance.mark('loadpage');
  setConfig(config);
  loadLana({ clientId: 'milo' });
  await loadArea();
}());
