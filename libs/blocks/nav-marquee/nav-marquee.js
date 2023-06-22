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

/*
 * Navigation Marquee
 */
import { createTag, getConfig } from '../../utils/utils.js';
import { decorateBlockText, getBlockSize, decorateBlockBg } from '../../utils/decorate.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  default: {
    xsmall: ['xs', 'xs', 'xs'],
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

let fetchedIcon;
let fetched = false;

async function getSVGfromFile(path, name) {
  /* c8 ignore next */
  if (!path) return null;
  const resp = await fetch(path);
  /* c8 ignore next */
  if (!resp.ok) return null;
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const svg = parsedText.querySelectorAll('svg')[0];
  svg.removeAttribute('id');
  svg.classList.add('ui-icon', `${name}`);
  return svg;
}
const fetchIcon = (name) => new Promise((resolve) => {
  /* c8 ignore next */
  if (!fetched) {
    const config = getConfig();
    const path = `${config.miloLibs || config.codeRoot}/img/ui/${name}.svg`;
    fetchedIcon = getSVGfromFile(path, name);
    fetched = true;
  }
  resolve(fetchedIcon);
});

async function decorateAnchors(anchors) {
  const iconList = {};
  const name = 'arrow-down';
  if (!iconList[name]) {
    const iconArrowDown = await fetchIcon(name);
    if (!iconArrowDown) return;
    iconList[name] = iconArrowDown;
  }
  const anchorIcon = createTag('span', { class: 'anchor-icon' }, iconList[name]);
  [...anchors].forEach((el) => {
    el.append(anchorIcon.cloneNode(true));
  });
}

export default function init(el) {
  el.classList.add('con-block');
  const size = getBlockSize(el);
  const [background, copy, ...list] = Array.from(el.querySelectorAll(':scope > div'));
  background.classList.add('background');
  copy.classList.add('copy');
  decorateBlockBg(el, background);
  decorateBlockText(copy, blockTypeSizes.default[size]);
  const links = createTag('div', { class: 'links' }, list);
  const foreground = createTag('div', { class: 'foreground' }, copy);
  decorateBlockText(links, blockTypeSizes.default.xsmall);
  foreground.append(links);
  el.append(foreground);

  [...list].forEach((i) => {
    const aTag = i.querySelector('a');
    let linkType = null;
    switch (aTag?.textContent.toLowerCase().charAt(0)) {
      case '_':
        linkType = '_';
        break;
      case '#':
        linkType = '#';
        break;
      default:
        linkType = null;
    }

    if (aTag && linkType) {
      i.classList.add('anchor-link');
      i.setAttribute('tabindex', '0');
      if (linkType === '_') {
        i.setAttribute('onclick', `window.open('${aTag.href}')`);
      }
      if (linkType === '#') {
        i.setAttribute('onclick', `window.location='${window.location}${aTag.textContent}'`);
        aTag.parentElement.remove();
      }
      // TODO: keydown event listner on aTag:focus
      // i.setAttribute('onclick', 'linkAnchor();');
    }
  });

  const emptyLinkRows = links.querySelectorAll(':scope > div:not([class])');
  if (emptyLinkRows[0]) emptyLinkRows[0].classList.add('link-header');
  if (emptyLinkRows[1]) emptyLinkRows[1].classList.add('link-footer', 'body-s');
  decorateBlockText(emptyLinkRows[0], blockTypeSizes.default.xsmall);

  const anchors = el.querySelectorAll('.anchor-link');
  if (anchors) {
    const linkGroup = createTag('div', { class: 'link-group' });
    anchors[0].insertAdjacentElement('beforebegin', linkGroup);
    [...anchors].forEach((a) => {
      linkGroup.append(a);
    });
    decorateAnchors(anchors);
  }
}
