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

import { getMetadata, decorateArea, loadBlock, loadLazy, loadStyle } from '../utils/utils.js';

const LCP_BLOCKS = ['hero', 'home', 'marquee', 'media', 'section-metadata', 'z-pattern'];

function decorateNavs(el = document) {
  const selectors = [];
  if (getMetadata('nav') !== 'off') {
    selectors.push('header');
  }
  if (getMetadata('footer') !== 'off') {
    selectors.push('footer');
  }
  const navs = el.querySelectorAll(selectors.toString());
  return [...navs].map((nav) => {
    nav.className = nav.nodeName.toLowerCase();
    return nav;
  });
}

export async function loadLCP(blocks) {
  const lcpBlock = blocks.find((block) => LCP_BLOCKS.includes(block.classList[0]));
  if (lcpBlock) {
    const lcpIdx = blocks.indexOf(lcpBlock);
    blocks.splice(lcpIdx, 1);
    await loadBlock(lcpBlock, true);
  }
}

export async function fetchLib(type, url = '') {
  const namespace = `${type}Library`;
  window.milo = window.milo || {};
  if (!type || window.milo[namespace]) return;
  const endpoint = (url !== '') ? `${url}/docs/${type}-library.json` : `${window.location.origin}/docs/${type}-library.json`;
  const resp = await fetch(endpoint);
  if (resp.ok) {
    try {
      const json = await resp.json();
      window.milo[namespace] = {};
      json.data.forEach((item) => {
        const itemValues = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(item)) {
          if (key !== 'key') {
            itemValues[key] = value;
          }
        }
        window.milo[namespace][item.key] = itemValues;
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Could not make ${type} library`);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`Could not get ${type} library`);
  }
}

/**
 * Load everything that impacts performance later.
 */
export function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  const blocks = decorateArea();
  const navs = decorateNavs();
  await fetchLib('icon');
  await loadLCP(blocks);
  loadStyle('/fonts/fonts.css');
  await loadLazy([...navs, ...blocks]);
  const { default: loadModals } = await import('../blocks/modals/modals.js');
  loadModals();
  loadDelayed();
}
loadPage();
