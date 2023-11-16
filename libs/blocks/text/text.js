import { decorateBlockBg, decorateBlockText, getBlockSize, decorateTextOverrides } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

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

export default function init(el) {
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
  rows.forEach((row) => {
    row.classList.add('foreground');
    decorateBlockText(row, blockTypeSizes[blockType][size]);
    decorateBlockIconArea(row);
  });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-s');
  }
  if (el.classList.contains('link-farm')) {
    const foregroundDiv = el.querySelectorAll('.foreground')[1];
    const count = foregroundDiv.querySelectorAll('h3').length;
    foregroundDiv.querySelectorAll('div').forEach((divElem) => {
      if (!divElem.querySelector('h3') && count) {
        const headingElem = createTag('h3', { class: 'no-heading' });
        divElem.insertBefore(headingElem, divElem.firstChild);
      }
    });
  }
  el.classList.add(...helperClasses);
  decorateTextOverrides(el);
  decorateMultiViewport(el);
}
