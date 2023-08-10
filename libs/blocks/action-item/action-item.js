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
 * Action Item - v1.0
 */

import { decorateButtons } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

function getLayout(elems) {
  const link = elems.length > 1 ? elems[elems.length - 1] : null;
  return { foreground: elems[0], link };
}

function handleFloatIcon(picture, icon) {
  if (!picture || !icon) return;
  icon.classList.add('floated-icon');
  picture.appendChild(icon);
}

function handleFloatBtn(picture, content) {
  if (!picture || !content) return;
  decorateButtons(content);
  const btn = content.querySelector('.con-button');
  if (!btn) return;
  picture.classList.add('dark');
  picture.appendChild(btn);
}

function decorateLink(link) {
  const anchor = link.querySelector('a');
  let attrs = { href: anchor.href };
  if (attrs.href.includes('#_blank') || anchor.target === '_blank') {
    attrs.href = anchor.href.replace('#_blank', '');
    attrs = { ...attrs, target: '_blank' };
  }
  return attrs;
}

function getContent(el, variants, link) {
  const pictures = el.querySelectorAll('picture');
  const text = el.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  const mainPic = pictures[0];
  const picture = mainPic?.parentElement;
  picture?.classList.add('main-image');
  const wrapLink = link && !variants.contains('float-button');
  const tag = wrapLink ? 'a' : 'div';
  let attrs = wrapLink ? decorateLink(link) : {};
  if (variants.contains('float-icon')) handleFloatIcon(picture, pictures[1]);
  if (variants.contains('float-button')) handleFloatBtn(picture, link);
  if (variants.contains('static-links')) attrs = { ...attrs, class: 'static' };
  const content = createTag(tag, { ...attrs }, text ?? picture);
  return content;
}

export default function init(el) {
  const elems = el.querySelectorAll(':scope > div');
  if (!elems.length) return;
  const { foreground, link } = getLayout(elems);
  const content = getContent(foreground, el.classList, link);
  el.replaceChildren(content);
}
