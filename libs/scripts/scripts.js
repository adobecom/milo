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
  '': { ietf: 'en-US', lang: 'en', reg: 'US', tk: 'hah7vzn.css' },
  ae_ar: { ietf: 'ar', lang: 'ar', reg: 'AE', tk: 'nwq1mna.css', dir: 'rtl' },
  ae_en: { ietf: 'en', lang: 'en', reg: 'AE', tk: 'pps7abe.css' },
  africa: { ietf: 'en', lang: 'en', reg: '002', tk: 'pps7abe.css' },
  ar: { ietf: 'es-AR', lang: 'es', reg: 'AR', tk: 'oln4yqj.css' },
  at: { ietf: 'de-AT', lang: 'de', reg: 'AT', tk: 'vin7zsi.css' },
  au: { ietf: 'en-AU', lang: 'en', reg: 'AU', tk: 'pps7abe.css' },
  be_en: { ietf: 'en-BE', lang: 'en', reg: 'BE', tk: 'pps7abe.css' },
  be_fr: { ietf: 'fr-BE', lang: 'fr', reg: 'BE', tk: 'vrk5vyv.css' },
  be_nl: { ietf: 'nl-BE', lang: 'nl', reg: 'BE', tk: 'cya6bri.css' },
  bg: { ietf: 'bg-BG', lang: 'bg', reg: 'BG', tk: 'aaz7dvd.css' },
  br: { ietf: 'pt-BR', lang: 'pt', reg: 'BR', tk: 'inq1xob.css' },
  ca_fr: { ietf: 'fr-CA', lang: 'fr', reg: 'CA', tk: 'vrk5vyv.css' },
  ca: { ietf: 'en-CA', lang: 'en', reg: 'CA', tk: 'pps7abe.css' },
  ch_de: { ietf: 'de-CH', lang: 'de', reg: 'CH', tk: 'vin7zsi.css' },
  ch_fr: { ietf: 'fr-CH', lang: 'fr', reg: 'CH', tk: 'vrk5vyv.css' },
  ch_it: { ietf: 'it-CH', lang: 'it', reg: 'CH', tk: 'bbf5pok.css' },
  cl: { ietf: 'es-CL', lang: 'es', reg: 'CL', tk: 'oln4yqj.css' },
  cn: { ietf: 'zh-CN', lang: 'zh', reg: 'CN', tk: 'puu3xkp' },
  co: { ietf: 'es-CO', lang: 'es', reg: 'CO', tk: 'oln4yqj.css' },
  cr: { ietf: 'es-419', lang: 'es', reg: 'CR', tk: 'oln4yqj.css' },
  cy_en: { ietf: 'en-CY', lang: 'en', reg: 'CY', tk: 'pps7abe.css' },
  cz: { ietf: 'cs-CZ', lang: 'cs', reg: 'CZ', tk: 'aaz7dvd.css' },
  de: { ietf: 'de-DE', lang: 'de', reg: 'DE', tk: 'vin7zsi.css' },
  dk: { ietf: 'da-DK', lang: 'da', reg: 'DK', tk: 'aaz7dvd.css' },
  ec: { ietf: 'es-419', lang: 'es', reg: 'EC', tk: 'oln4yqj.css' },
  ee: { ietf: 'et-EE', lang: 'et', reg: 'EE', tk: 'aaz7dvd.css' },
  eg_ar: { ietf: 'ar', lang: 'ar', reg: 'EG', tk: 'nwq1mna.css', dir: 'rtl' },
  eg_en: { ietf: 'en-GB', lang: 'en', reg: 'EG', tk: 'pps7abe.css' },
  el: { ietf: 'el', lang: 'el', reg: 'GR', tk: 'aaz7dvd.css' },
  es: { ietf: 'es-ES', lang: 'es', reg: 'ES', tk: 'oln4yqj.css' },
  fi: { ietf: 'fi-FI', lang: 'fi', reg: 'FI', tk: 'aaz7dvd.css' },
  fr: { ietf: 'fr-FR', lang: 'fr', reg: 'FR', tk: 'vrk5vyv.css' },
  gr_el: { ietf: 'el', lang: 'el', reg: 'GR', tk: 'fnx0rsr.css' },
  gr_en: { ietf: 'en-GR', lang: 'en', reg: 'GR', tk: 'pps7abe.css' },
  gt: { ietf: 'es-419', lang: 'es', reg: 'GT', tk: 'oln4yqj.css' },
  hk_en: { ietf: 'en-HK', lang: 'en', reg: 'HK', tk: 'pps7abe.css' },
  hk_zh: { ietf: 'zh-HK', lang: 'zh', reg: 'HK', tk: 'jay0ecd' },
  hu: { ietf: 'hu-HU', lang: 'hu', reg: 'HU', tk: 'aaz7dvd.css' },
  id_en: { ietf: 'en', lang: 'en', reg: 'ID', tk: 'pps7abe.css' },
  id_id: { ietf: 'id', lang: 'id', reg: 'ID', tk: 'czc0mun.css' },
  ie: { ietf: 'en-GB', lang: 'en', reg: 'IE', tk: 'pps7abe.css' },
  il_en: { ietf: 'en-IL', lang: 'en', reg: 'IL', tk: 'pps7abe.css' },
  il_he: { ietf: 'he', lang: 'he', reg: 'IL', tk: 'nwq1mna.css', dir: 'rtl' },
  in_hi: { ietf: 'hi', lang: 'hi', reg: 'IN', tk: 'aaa8deh.css' },
  in: { ietf: 'en-GB', lang: 'en', reg: 'IN', tk: 'pps7abe.css' },
  it: { ietf: 'it-IT', lang: 'it', reg: 'IT', tk: 'bbf5pok.css' },
  jp: { ietf: 'ja-JP', lang: 'ja', reg: 'JP', tk: 'dvg6awq' },
  kr: { ietf: 'ko-KR', lang: 'ko', reg: 'KR', tk: 'qjs5sfm' },
  kw_ar: { ietf: 'ar', lang: 'ar', reg: 'KW', tk: 'nwq1mna.css', dir: 'rtl' },
  kw_en: { ietf: 'en-GB', lang: 'en', reg: 'KW', tk: 'pps7abe.css' },
  la: { ietf: 'es-LA', lang: 'es', reg: '419', tk: 'oln4yqj.css' },
  langstore: { ietf: 'en-US', lang: 'en', reg: 'US', tk: 'hah7vzn.css' },
  lt: { ietf: 'lt-LT', lang: 'lt', reg: 'LT', tk: 'aaz7dvd.css' },
  lu_de: { ietf: 'de-LU', lang: 'de', reg: 'LU', tk: 'vin7zsi.css' },
  lu_en: { ietf: 'en-LU', lang: 'en', reg: 'LU', tk: 'pps7abe.css' },
  lu_fr: { ietf: 'fr-LU', lang: 'fr', reg: 'LU', tk: 'vrk5vyv.css' },
  lv: { ietf: 'lv-LV', lang: 'lv', reg: 'LV', tk: 'aaz7dvd.css' },
  mena_ar: { ietf: 'ar', lang: 'ar', reg: '', tk: 'dis2dpj.css', dir: 'rtl' },
  mena_en: { ietf: 'en', lang: 'en', reg: '', tk: 'pps7abe.css' },
  mt: { ietf: 'en-MT', lang: 'en', reg: 'MT', tk: 'pps7abe.css' },
  mx: { ietf: 'es-MX', lang: 'es', reg: 'MX', tk: 'oln4yqj.css' },
  my_en: { ietf: 'en-GB', lang: 'en', reg: 'MY', tk: 'pps7abe.css' },
  my_ms: { ietf: 'ms', lang: 'ms', reg: 'MY', tk: 'sxj4tvo.css' },
  ng: { ietf: 'en-GB', lang: 'en', reg: 'NG', tk: 'pps7abe.css' },
  nl: { ietf: 'nl-NL', lang: 'nl', reg: 'NL', tk: 'cya6bri.css' },
  no: { ietf: 'no-NO', lang: 'no', reg: 'NO', tk: 'aaz7dvd.css' },
  nz: { ietf: 'en-GB', lang: 'en', reg: 'NZ', tk: 'pps7abe.css' },
  pe: { ietf: 'es-PE', lang: 'es', reg: 'PE', tk: 'oln4yqj.css' },
  ph_en: { ietf: 'en', lang: 'en', reg: 'PH', tk: 'pps7abe.css' },
  ph_fil: { ietf: 'fil-PH', lang: 'fil', reg: 'PH', tk: 'ict8rmp.css' },
  pl: { ietf: 'pl-PL', lang: 'pl', reg: 'PL', tk: 'aaz7dvd.css' },
  pr: { ietf: 'es-419', lang: 'es', reg: 'PR', tk: 'oln4yqj.css' },
  pt: { ietf: 'pt-PT', lang: 'pt', reg: 'PT', tk: 'inq1xob.css' },
  qa_ar: { ietf: 'ar', lang: 'ar', reg: 'QA', tk: 'nwq1mna.css', dir: 'rtl' },
  qa_en: { ietf: 'en-GB', lang: 'en', reg: 'QA', tk: 'pps7abe.css' },
  ro: { ietf: 'ro-RO', lang: 'ro', reg: 'RO', tk: 'aaz7dvd.css' },
  ru: { ietf: 'ru-RU', lang: 'ru', reg: 'RU', tk: 'aaz7dvd.css' },
  sa_ar: { ietf: 'ar', lang: 'ar', reg: 'SA', tk: 'nwq1mna.css', dir: 'rtl' },
  sa_en: { ietf: 'en', lang: 'en', reg: 'SA', tk: 'pps7abe.css' },
  se: { ietf: 'sv-SE', lang: 'sv', reg: 'SE', tk: 'fpk1pcd.css' },
  sg: { ietf: 'en-SG', lang: 'en', reg: 'SG', tk: 'pps7abe.css' },
  si: { ietf: 'sl-SI', lang: 'sl', reg: 'SI', tk: 'aaz7dvd.css' },
  sk: { ietf: 'sk-SK', lang: 'sk', reg: 'SK', tk: 'aaz7dvd.css' },
  th_en: { ietf: 'en', lang: 'en', reg: 'TH', tk: 'pps7abe.css' },
  th_th: { ietf: 'th', lang: 'th', reg: 'TH', tk: 'aaz7dvd.css' },
  tr: { ietf: 'tr-TR', lang: 'tr', reg: 'TR', tk: 'aaz7dvd.css' },
  tw: { ietf: 'zh-TW', lang: 'zh', reg: 'TW', tk: 'jay0ecd' },
  ua: { ietf: 'uk-UA', lang: 'uk', reg: 'UA', tk: 'aaz7dvd.css' },
  uk: { ietf: 'en-GB', lang: 'en', reg: 'GB', tk: 'pps7abe.css' },
  vn_en: { ietf: 'en-GB', lang: 'en', reg: 'VN', tk: 'pps7abe.css' },
  vn_vi: { ietf: 'vi', lang: 'vi', reg: 'VN', tk: 'jii8bki.css' },
  za: { ietf: 'en-GB', lang: 'en', reg: 'ZA', tk: 'pps7abe.css' },
};

const config = {
  geoRouting: 'on',
  fallbackRouting: 'on',
  links: 'on',
  addTitleRegionSuffix: 'on',
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
};

const eagerLoad = (img) => {
  img?.setAttribute('loading', 'eager');
  img?.setAttribute('fetchpriority', 'high');
};

export default config;

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
