import { decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag, loadStyle, getConfig, loadBlock } from '../../../utils/utils.js';

function addStyle(filename) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/${filename}.css`);
}

function formatHeader(row) {
  row.classList.add('news-headline');
  const headlineText = row.textContent.trim();
  const icon = row.querySelector('picture');
  const headlineEl = createTag('div', { class: 'headline-text' }, `<p>${headlineText}</p>`);
  const headline = createTag('div', { class: 'headline' }, headlineEl);
  if (icon) {
    const iconEl = createTag('div', { class: 'icon' }, icon);
    headline.prepend(iconEl);
  }
  row.appendChild(headline);
  row.firstElementChild.remove();
}

export default async function init(el) {
  const blockLevelClassAdditions = ['news', 'con-block', 'container'];
  el.classList.add(...blockLevelClassAdditions);
  const hasUpClass = [...el.classList].find((cls) => cls.endsWith('-up'));
  if (!hasUpClass) el.classList.add('three-up');

  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    const [head, ...tail] = rows;
    formatHeader(head);
    rows = tail || rows;
    rows.forEach((row) => {
      row.classList.add('news-item');
      const pTags = row.querySelectorAll('p');
      pTags.forEach((p, indx) => {
        if (indx === 0) p.classList.add('news-item-headline');
        else if (p.querySelector('a')) {
          if (p.querySelector('a').innerText.trim() === p.innerText.trim()) {
            p.classList.add('news-item-link');
            p.querySelector('a').classList.add('standalone-link');
            if (el.classList.contains('quiet')) p.querySelector('a').classList.add('quiet');
          }
        } else p.classList.add('news-item-body');
      });
    });
  }
  const helperClasses = [];
  // if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  // if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  // if (el.classList.contains('vertical')) {
  //   const elAction = el.querySelector('.action-area');
  //   if (elAction) elAction.classList.add('body-s');
  // }
  el.classList.add(...helperClasses);
  decorateTextOverrides(el); // remove if not needed for text class names

  // const mnemonicList = el.querySelector('.mnemonic-list');
  // const foreground = mnemonicList?.closest('.foreground');
  // if (foreground) {
  //   mnemonicList.querySelectorAll('p').forEach((product) => product.removeAttribute('class'));
  //   await loadBlock(mnemonicList);
  // }
  if (el.matches('[class*="rounded-corners"]')) addStyle('rounded-corners');
  if (el.matches('[class*="-lockup"]')) addStyle('iconography');

  if (el.classList.contains('link-spacer')) {
    el.querySelectorAll('[class^="body-"]').forEach((bodyElem) => {
      if ([...bodyElem.childNodes].every((n) => (n.nodeType === 1 && n.tagName === 'A' && !n.className)
        || (n.nodeType === 3 && n.textContent.trim() === ''))) {
        bodyElem.classList.add('link-list');
      }
    });
  }
}
