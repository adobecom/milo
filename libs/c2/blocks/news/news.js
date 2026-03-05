import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides } from '../../../utils/decorate.js';
import { createTag, loadStyle, getConfig, loadBlock } from '../../../utils/utils.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  standard: {
    small: ['s', 's', 's'],
    medium: ['m', 'm', 'm'],
    large: ['l', 'l', 'l'],
    xlarge: ['xl', 'xl', 'xl'],
  },
  inset: {
    small: ['s', 'm'],
    medium: ['m', 'l'],
    large: ['l', 'xl'],
    xlarge: ['xl', 'xxl'],
  },
  text: {
    xxsmall: ['xxs', 'xxs'],
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

// function decorateMultiViewport(foreground) {
//   const viewports = ['mobile-up', 'tablet-up', 'desktop-up'];
//   if (foreground.childElementCount === 2 || foreground.childElementCount === 3) {
//     [...foreground.children].forEach((child, index) => {
//       child.className = viewports[index];
//       if (foreground.childElementCount === 2 && index === 1) child.className = 'tablet-up desktop-up';
//     });
//   }
//   return foreground;
// }

// function decorateBlockIconArea(content, el) {
//   const first = content.children[0];
//   if (first?.querySelector('img')) {
//     const areaClass = el.className.match(/-(lockup|icon)/);
//     first.classList.add(areaClass ? `${areaClass[1]}-area` : 'image');
//   }
//   const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
//   if (!headings) return;
//   headings.forEach((h) => {
//     const hPrevElem = h.previousElementSibling;
//     if (hPrevElem?.childElementCount) {
//       const picCount = [...hPrevElem.children].reduce((result, item) => {
//         let count = result;
//         if (item.nodeName === 'PICTURE') count += 1;
//         return count;
//       }, 0);
//       if (picCount === hPrevElem.childElementCount) hPrevElem.classList.add('icon-area');
//     }
//   });
// }

// function decorateLinkFarms(el) {
//   const { miloLibs, codeRoot } = getConfig();
//   loadStyle(`${miloLibs || codeRoot}/blocks/text/link-farms.css`);
//   const [title, foregroundDiv] = [...el.querySelectorAll('.foreground')];
//   const hCount = foregroundDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
//   title.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading-l');
//   foregroundDiv.querySelectorAll('p').forEach((p) => p.classList.add('body-s'));
//   foregroundDiv.querySelectorAll('div').forEach((divElem, index) => {
//     divElem.setAttribute('role', 'list');
//     [...divElem.children].forEach((child) => child.setAttribute('role', 'listitem'));
//     const heading = divElem.querySelector('h1, h2, h3, h4, h5, h6');
//     heading?.classList.add('heading-xs');
//     if (!hCount) return;
//     if (!heading) {
//       divElem.prepend(createTag('h3', { class: 'no-heading heading-xs' }));
//       return;
//     }
//     const sibling = index % 2 === 0
//       ? divElem.nextElementSibling
//       : divElem.previousElementSibling;
//     sibling?.classList.add('hspace');
//     if (index > 0) divElem.classList.add('has-heading');
//     if (index > 1) foregroundDiv.classList.add('gap-xl');
//   });
// }

function addStyle(filename) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/${filename}.css`);
}

function decorateBlockHeader(row) {
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

function addChevronIcon(pTag) {
  const chevronIcon = createTag('span', { class: 'chevron-icon' }, ' >');
  pTag.append(chevronIcon);
}

export default async function init(el) {
  // el.classList.add('text-block', 'con-block');
  el.classList.add('news', 'con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    const [head, ...tail] = rows;
    decorateBlockHeader(head);
    rows = tail || rows;
    const newsWrapper = createTag('div', { class: 'news-wrapper section' });
    const evenItems = rows.length % 2 === 0;
    newsWrapper.classList.add(evenItems ? 'four-up' : 'three-up');
    rows.forEach((row) => {
      row.classList.add('news-item');
      const pTags = row.querySelectorAll('p');
      pTags.forEach((p) => {
        if (p.parentElement.querySelector('p:first-child') === p) p.classList.add('news-item-headline');
        else if (p.querySelector('a')) {
          if (p.querySelector('a').innerText.trim() === p.innerText.trim()) {
            p.classList.add('news-item-link');
            addChevronIcon(p);
          }
        } else p.classList.add('news-item-body');
      });
      newsWrapper.appendChild(row);
    });
    el.appendChild(newsWrapper);
  }
  const helperClasses = [];
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  el.classList.add(...helperClasses);
  decorateTextOverrides(el);

  const lastActionArea = el.querySelector('.action-area:last-of-type');
  if (lastActionArea) {
    const div = createTag('div', { class: 'cta-container' });
    lastActionArea.insertAdjacentElement('afterend', div);
    div.append(lastActionArea);
  }

  const mnemonicList = el.querySelector('.mnemonic-list');
  const foreground = mnemonicList?.closest('.foreground');
  if (foreground) {
    mnemonicList.querySelectorAll('p').forEach((product) => product.removeAttribute('class'));
    await loadBlock(mnemonicList);
  }
  if (el.matches('[class*="rounded-corners"]')) addStyle('rounded-corners');
  if (el.matches('[class*="-lockup"]')) addStyle('iconography');
  // Override Detail with Title L style if class exists - Temporary solution until Spectrum 2
  if (el.classList.contains('l-title')) {
    el.querySelectorAll('[class*="detail-"]')?.forEach((detail) => detail.classList.add('title-l'));
  }
  if (el.classList.contains('link-spacer')) {
    el.querySelectorAll('[class^="body-"]').forEach((bodyElem) => {
      if ([...bodyElem.childNodes].every((n) => (n.nodeType === 1 && n.tagName === 'A' && !n.className)
        || (n.nodeType === 3 && n.textContent.trim() === ''))) {
        bodyElem.classList.add('link-list');
      }
    });
  }
}
