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

const LCP_BLOCKS = ['hero', 'home', 'marquee', 'section-metadata'];

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

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

/**
 * Loads everything that happens a lot later, without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  const blocks = decorateArea();
  const navs = decorateNavs();
  await loadLCP(blocks);
  loadStyle('/fonts/fonts.css');
  await loadLazy([...navs, ...blocks]);
  const { default: getModals } = await import('../blocks/modals/modals.js');
  getModals();
  loadDelayed();
}
loadPage();
