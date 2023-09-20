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
  ae_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  ae_en: { ietf: 'en', tk: 'pps7abe.css' },
  africa: { ietf: 'en', tk: 'pps7abe.css' },
  ar: { ietf: 'es-AR', tk: 'oln4yqj.css' },
  at: { ietf: 'de-AT', tk: 'vin7zsi.css' },
  au: { ietf: 'en-AU', tk: 'pps7abe.css' },
  be_en: { ietf: 'en-BE', tk: 'pps7abe.css' },
  be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
  be_nl: { ietf: 'nl-BE', tk: 'cya6bri.css' },
  bg: { ietf: 'bg-BG', tk: 'aaz7dvd.css' },
  br: { ietf: 'pt-BR', tk: 'inq1xob.css' },
  ca_fr: { ietf: 'fr-CA', tk: 'vrk5vyv.css' },
  ca: { ietf: 'en-CA', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', tk: 'vin7zsi.css' },
  ch_fr: { ietf: 'fr-CH', tk: 'vrk5vyv.css' },
  ch_it: { ietf: 'it-CH', tk: 'bbf5pok.css' },
  cl: { ietf: 'es-CL', tk: 'oln4yqj.css' },
  cn: { ietf: 'zh-CN', tk: 'puu3xkp' },
  co: { ietf: 'es-CO', tk: 'oln4yqj.css' },
  cr: { ietf: 'es-419', tk: 'oln4yqj.css' },
  cy_en: { ietf: 'en-CY', tk: 'pps7abe.css' },
  cz: { ietf: 'cs-CZ', tk: 'aaz7dvd.css' },
  de: { ietf: 'de-DE', tk: 'vin7zsi.css' },
  dk: { ietf: 'da-DK', tk: 'aaz7dvd.css' },
  ec: { ietf: 'es-419', tk: 'oln4yqj.css' },
  ee: { ietf: 'et-EE', tk: 'aaz7dvd.css' },
  eg_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  eg_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  el: { ietf: 'el', tk: 'aaz7dvd.css' },
  es: { ietf: 'es-ES', tk: 'oln4yqj.css' },
  fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
  fr: { ietf: 'fr-FR', tk: 'vrk5vyv.css' },
  gr_el: { ietf: 'el', tk: 'fnx0rsr.css' },
  gr_en: { ietf: 'en-GR', tk: 'pps7abe.css' },
  gt: { ietf: 'es-419', tk: 'oln4yqj.css' },
  hk_en: { ietf: 'en-HK', tk: 'pps7abe.css' },
  hk_zh: { ietf: 'zh-HK', tk: 'jay0ecd' },
  hu: { ietf: 'hu-HU', tk: 'aaz7dvd.css' },
  id_en: { ietf: 'en', tk: 'pps7abe.css' },
  id_id: { ietf: 'id', tk: 'czc0mun.css' },
  ie: { ietf: 'en-GB', tk: 'pps7abe.css' },
  il_en: { ietf: 'en-IL', tk: 'pps7abe.css' },
  il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl' },
  in_hi: { ietf: 'hi', tk: 'aaa8deh.css' },
  in: { ietf: 'en-GB', tk: 'pps7abe.css' },
  it: { ietf: 'it-IT', tk: 'bbf5pok.css' },
  jp: { ietf: 'ja-JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', tk: 'qjs5sfm' },
  kw_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  kw_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  la: { ietf: 'es-LA', tk: 'oln4yqj.css' },
  langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
  lt: { ietf: 'lt-LT', tk: 'aaz7dvd.css' },
  lu_de: { ietf: 'de-LU', tk: 'vin7zsi.css' },
  lu_en: { ietf: 'en-LU', tk: 'pps7abe.css' },
  lu_fr: { ietf: 'fr-LU', tk: 'vrk5vyv.css' },
  lv: { ietf: 'lv-LV', tk: 'aaz7dvd.css' },
  mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl' },
  mena_en: { ietf: 'en', tk: 'pps7abe.css' },
  mt: { ietf: 'en-MT', tk: 'pps7abe.css' },
  mx: { ietf: 'es-MX', tk: 'oln4yqj.css' },
  my_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  my_ms: { ietf: 'ms', tk: 'sxj4tvo.css' },
  ng: { ietf: 'en-GB', tk: 'pps7abe.css' },
  nl: { ietf: 'nl-NL', tk: 'cya6bri.css' },
  no: { ietf: 'no-NO', tk: 'aaz7dvd.css' },
  nz: { ietf: 'en-GB', tk: 'pps7abe.css' },
  pe: { ietf: 'es-PE', tk: 'oln4yqj.css' },
  ph_en: { ietf: 'en', tk: 'pps7abe.css' },
  ph_fil: { ietf: 'fil-PH', tk: 'ict8rmp.css' },
  pl: { ietf: 'pl-PL', tk: 'aaz7dvd.css' },
  pr: { ietf: 'es-419', tk: 'oln4yqj.css' },
  pt: { ietf: 'pt-PT', tk: 'inq1xob.css' },
  qa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  qa_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  ro: { ietf: 'ro-RO', tk: 'aaz7dvd.css' },
  ru: { ietf: 'ru-RU', tk: 'aaz7dvd.css' },
  sa_ar: { ietf: 'ar', tk: 'nwq1mna.css', dir: 'rtl' },
  sa_en: { ietf: 'en', tk: 'pps7abe.css' },
  se: { ietf: 'sv-SE', tk: 'fpk1pcd.css' },
  sg: { ietf: 'en-SG', tk: 'pps7abe.css' },
  si: { ietf: 'sl-SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'sk-SK', tk: 'aaz7dvd.css' },
  th_en: { ietf: 'en', tk: 'pps7abe.css' },
  th_th: { ietf: 'th', tk: 'aaz7dvd.css' },
  tr: { ietf: 'tr-TR', tk: 'aaz7dvd.css' },
  tw: { ietf: 'zh-TW', tk: 'jay0ecd' },
  ua: { ietf: 'uk-UA', tk: 'aaz7dvd.css' },
  uk: { ietf: 'en-GB', tk: 'pps7abe.css' },
  vn_en: { ietf: 'en-GB', tk: 'pps7abe.css' },
  vn_vi: { ietf: 'vi', tk: 'jii8bki.css' },
  za: { ietf: 'en-GB', tk: 'pps7abe.css' },
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
