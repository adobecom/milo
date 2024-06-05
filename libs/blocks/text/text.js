import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides } from '../../utils/decorate.js';
import { createTag, loadStyle, getConfig, loadBlock } from '../../utils/utils.js';

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

function decorateMultiViewport(el) {
  const viewports = ['mobile-up', 'tablet-up', 'desktop-up'];
  const foreground = el.querySelector('.foreground');
  if (foreground.childElementCount === 2 || foreground.childElementCount === 3) {
    [...foreground.children].forEach((child, index) => {
      child.className = viewports[index];
      if (foreground.childElementCount === 2 && index === 1) child.className = 'tablet-up desktop-up';
    });
  }
  return foreground;
}

function decorateBlockIconArea(el) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (!headings) return;
  headings.forEach((h) => {
    const hPrevElem = h.previousElementSibling;
    if (hPrevElem?.childElementCount) {
      const picCount = [...hPrevElem.children].reduce((result, item) => {
        let count = result;
        if (item.nodeName === 'PICTURE') count += 1;
        return count;
      }, 0);
      if (picCount === hPrevElem.childElementCount) hPrevElem.classList.add('icon-area');
    }
  });
}

function decorateLinkFarms(el) {
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/blocks/text/link-farms.css`);
  const [title, foregroundDiv] = [...el.querySelectorAll('.foreground')];
  const hCount = foregroundDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
  title.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading-l');
  foregroundDiv.querySelectorAll('p').forEach((p) => p.classList.add('body-s'));
  foregroundDiv.querySelectorAll('div').forEach((divElem, index) => {
    const heading = divElem.querySelector('h1, h2, h3, h4, h5, h6');
    heading?.classList.add('heading-xs');
    if (!hCount) return;
    if (!heading) {
      divElem.prepend(createTag('h3', { class: 'no-heading heading-xs' }));
      return;
    }
    const sibling = index % 2 === 0
      ? divElem.nextElementSibling
      : divElem.previousElementSibling;
    sibling?.classList.add('hspace');
    if (index > 0) divElem.classList.add('has-heading');
    if (index > 1) foregroundDiv.classList.add('gap-xl');
  });
}

export default async function init(el) {
  el.classList.add('text-block', 'con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    rows = tail;
  }
  const helperClasses = [];
  let blockType = 'text';
  const size = el.classList.contains('legal') ? 'xxsmall' : getBlockSize(el);
  ['inset', 'long-form', 'bio'].forEach((variant, index) => {
    if (el.classList.contains(variant)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (index > 0) ? 'standard' : variant;
    }
  });
  const hasLinkFarm = el.classList.contains('link-farm');
  rows.forEach((row) => {
    row.classList.add('foreground');
    if (!hasLinkFarm) decorateBlockText(row, blockTypeSizes[blockType][size]);
    decorateBlockIconArea(row);
  });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  if (hasLinkFarm) decorateLinkFarms(el);
  el.classList.add(...helperClasses);
  decorateTextOverrides(el);
  if (!hasLinkFarm) decorateMultiViewport(el);

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
}
