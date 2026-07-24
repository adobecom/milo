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
  getMetadata,
} from '../utils/utils.js';
import locales from '../utils/locales.js';

// Production Domain
const prodDomains = ['milo.adobe.com', 'business.adobe.com', 'www.adobe.com', 'news.adobe.com'];

const stageDomainsMap = {
  'www.stage.adobe.com': {
    'www.adobe.com': 'origin',
    'helpx.adobe.com': 'helpx.stage.adobe.com',
  },
  '--bacom--adobecom.aem.live': {
    'business.adobe.com': 'origin',
    'news.adobe.com': 'main--news--adobecom.aem.live',
  },
  '--blog--adobecom.aem.page': {
    'blog.adobe.com': 'origin',
    'business.adobe.com': 'main--bacom--adobecom.aem.page',
  },
  '.business-graybox.adobe.com': { 'business.adobe.com': 'origin' },
  '^https://.*--milo--.*.(hlx|aem).page': {
    '^https://www.adobe.com/acrobat': 'https://main--dc--adobecom.aem.page',
    '^https://business.adobe.com(?!/blog)': 'https://business.stage.adobe.com',
    '^https://business.adobe.com/blog': 'https://main--bacom-blog--adobecom.aem.page',
    '^https://www.adobe.com': 'origin',
  },
};

const config = {
  geoRouting: 'on',
  fallbackRouting: 'on',
  links: 'on',
  imsClientId: 'milo',
  uniqueSiteId: 'milo',
  codeRoot: '/libs',
  locales,
  prodDomains,
  stageDomainsMap,
  jarvis: {
    id: 'milo',
    version: '1.0',
    onDemand: false,
  },
  privacyId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db', // valid for *.adobe.com
  breadcrumbs: 'on',
  brandConciergeAA: 'app-reco',
  // taxonomyRoot: '/your-path-here',
};

const miloLibs = '/libs';

const eagerLoad = (img) => {
  img?.setAttribute('loading', 'eager');
  img?.setAttribute('fetchpriority', 'high');
};

/* Keep in sync with the inline early-hint script in head.html. */
export default function loadLCPImage(doc = document) {
  const firstDiv = doc.querySelector('body > main > div:nth-child(1) > div');
  const isMarquee = firstDiv?.classList.contains('marquee') || firstDiv?.classList.contains('hero-marquee');
  if (!isMarquee) {
    eagerLoad(doc.querySelector('img'));
    return;
  }
  const rows = firstDiv.querySelectorAll(':scope > div');
  const bgRow = rows.length > 1 ? rows[0] : null;
  if (bgRow) {
    // Background cells are authored [all], [mobile, tablet+desktop] or [mobile, tablet, desktop].
    const cells = [...bgRow.children];
    let idx = 0;
    if (cells.length === 2 && window.matchMedia('(min-width: 600px)').matches) idx = 1;
    if (cells.length >= 3) {
      if (window.matchMedia('(min-width: 1200px)').matches) idx = 2;
      else if (window.matchMedia('(min-width: 600px)').matches) idx = 1;
    }
    eagerLoad(cells[idx]?.querySelector('img'));
  }
  const contentImgs = bgRow ? ':scope > div:not(:first-child) img' : 'img';
  firstDiv.querySelectorAll(contentImgs).forEach(eagerLoad);
}

loadLCPImage();

function loadStyles() {
  const paths = [];
  const stylesPrefix = getMetadata('foundation') === 'c2' ? '/c2' : '';
  paths.push(`${miloLibs}${stylesPrefix}/styles/styles.css`);
  const skin = getMetadata('skin');
  if (skin) paths.push(`${miloLibs}/styles/skins/${skin}.css`);

  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}

(async function loadPage() {
  loadStyles();
  if (getMetadata('template') === '404') window.SAMPLE_PAGEVIEWS_AT_RATE = 'high';
  performance.mark('loadpage');
  setConfig(config);
  loadLana({ clientId: 'milo' });
  await loadArea();
}());
