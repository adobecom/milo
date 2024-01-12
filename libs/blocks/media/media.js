/* media - consonant v6 */

import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides, applyHoverPlay } from '../../utils/decorate.js';
import { createTag, loadStyle, getConfig } from '../../utils/utils.js';

const blockTypeSizes = {
  small: ['xs', 's', 'm'],
  medium: ['m', 's', 'm'],
  large: ['xl', 'm', 'l'],
  xlarge: ['xxl', 'm', 'l'],
};

function decorateAvatar(el) {
  // is the first row a picture only
  const childElements = el.children[0]?.children;
  if (childElements.length !== 1) return;
  [...childElements].forEach((e, i) => {
    if (e.localName !== null && e.localName === 'picture') childElements[i].classList.add('avatar');
  });
}

export default function init(el) {
  if (el.className.includes('rounded-corners')) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    loadStyle(`${base}/styles/rounded-corners.css`);
  }
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  const blockType = el.classList.contains('merch') ? 'merch' : null;
  const size = getBlockSize(el);
  const container = createTag('div', { class: 'container foreground' });
  rows.forEach((row) => {
    row.classList.add('media-row');
    const header = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (header) {
      const text = header.closest('div');
      text.classList.add('text');
      decorateAvatar(text);
      decorateBlockText(text, blockTypeSizes[size], blockType);
    }
    const image = row.querySelector(':scope > div:not([class])');
    if (image) image.classList.add('image');
    const img = image?.querySelector(':scope img');
    if (header && img?.alt === '') img.alt = header.textContent;
    const imageVideo = image?.querySelector('video');
    if (imageVideo) applyHoverPlay(imageVideo);

    // subcopy
    const actionArea = row.querySelector('p.action-area');
    if (actionArea?.nextElementSibling?.tagName === 'P') {
      actionArea.nextElementSibling.className = 'subcopy';
    }

    // subcopy with links
    if (actionArea?.nextElementSibling?.tagName === 'H3') {
      actionArea.nextElementSibling.classList.remove('heading-m', 'body-xl');
      actionArea.nextElementSibling.classList.add('heading-xs');
      const links = row.querySelectorAll('h3.heading-xs ~ p.body-s a, h3.heading-xs ~ p.icon-area a');
      links.forEach((link) => {
        link.parentElement.className = 'subcopy-link';
        link.className = 'body-xxs';
      });
    }

    // qr code
    if (row.closest('.qr-code')) {
      const imgQRCode = row.querySelector('.text img');
      if (imgQRCode) {
        imgQRCode.classList.add('qr-code-img');
      }
      const qrCodeLinks = row.querySelectorAll('a');
      const googleBtn = qrCodeLinks[0];
      const appleBtn = qrCodeLinks[1];
      googleBtn.textContent = '';
      googleBtn.classList.add('google-play');
      googleBtn.parentNode.classList.add('qr-button-container');
      appleBtn.textContent = '';
      appleBtn.classList.add('app-store');
      appleBtn.parentNode.classList.add('qr-button-container');
    }
    container.append(row);
  });
  el.append(container);
  const mediaRowReversed = el.querySelector(':scope > .foreground > .media-row > div').classList.contains('text');
  if (mediaRowReversed) el.classList.add('media-reverse-mobile');
  decorateTextOverrides(el);
}
