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
 * media - consonant v5.1
 */

import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides } from '../../utils/decorate.js';
import { decorateBlockAnalytics } from '../../martech/attributes.js';
import { createTag } from '../../utils/utils.js';

const blockTypeSizes = {
  small: ['xs', 's', 'm'],
  medium: ['m', 's', 'm'],
  large: ['xl', 'm', 'l'],
  xlarge: ['xxl', 'm', 'l'],
};

export default function init(el) {
  decorateBlockAnalytics(el);
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  const size = getBlockSize(el);
  const container = createTag('div', { class: 'container foreground' });
  rows.forEach((row) => {
    row.classList.add('media-row');
    const header = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (header) {
      const text = header.closest('div');
      text.classList.add('text');
      decorateBlockText(text, blockTypeSizes[size]);
    }
    const image = row.querySelector(':scope > div:not([class])');
    if (image) image.classList.add('image');
    const img = image.querySelector(':scope img');
    if (header && img?.alt === '') img.alt = header.textContent;

    //lists
    if(row.querySelector("ul")) {
      el.querySelector("ul").classList.add("default-list");
    }

    //subcopy
    const actionArea = row.querySelector("p.action-area");
    if(actionArea && actionArea.nextElementSibling?.tagName === "P") {
      actionArea.nextElementSibling.className="";
      updateInnerHtml(actionArea.nextElementSibling, "strong", "");
      actionArea.nextElementSibling.classList.add('subcopy');
    }

    //subcopy with links
    if(actionArea && actionArea.nextElementSibling?.tagName === "H3") {
      let links = document.querySelectorAll("h3 ~ p.body-s a");
      links.forEach(link => {
        link.parentElement.classList.add("subcopy-link");

        link.className = "";
        link.classList.add("subcopy-link");
      })
    }

    //qr code
    if(row.parentNode.classList.contains("qr-code")) {
      const imgQRCode = row.querySelector(".text > p.body-s > picture > img");
      if(imgQRCode) {
        imgQRCode.classList.add("qr-code");
      }

      const qrCodeLinks = row.querySelectorAll("a");
      qrCodeLinks.forEach(qrCodeLink => {
        qrCodeLink.classList.add("con-button");
        qrCodeLink.parentNode.classList.add("qr-button");
      })
    }

    container.append(row);
  });
  el.append(container);
  const mediaRowReversed = el.querySelector(':scope > .foreground > .media-row > div').classList.contains('text');
  if (mediaRowReversed) el.classList.add('media-reverse-mobile');
  decorateTextOverrides(el);
}

function updateInnerHtml(el, tag, replaceValue) {
  let innerHtml = el.innerHTML;
  innerHtml = innerHtml.replace(`<${tag}>`,replaceValue).replace(`</${tag}>`, replaceValue);
  el.innerHTML = innerHtml;
}
