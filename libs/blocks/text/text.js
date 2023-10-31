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
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

function findClassWithSufix(el, sufix) {
  const matchingClass = [...el.classList].find((c) => c.endsWith(sufix));
  return matchingClass;
}

function extendButtonsClass(el) {
  const btnClass = findClassWithSufix(el, '-button');
  const buttons = el.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    if (btnClass) button.classList.add(btnClass);
  });
}

function addNode(sourceEl, parent) {
  const node = sourceEl.cloneNode(true);
  parent.appendChild(node);
}

function checkViewport(foreground) {
  const { children, childElementCount: childCount } = foreground;
  if (childCount < 2) addNode(children[childCount - 1], foreground);
  if (childCount < 3) addNode(children[childCount - 1], foreground);
}

function decorateMultiViewport(el) {
  const viewports = ['mobile-up', 'tablet-up', 'desktop-up'];
  const foreground = el.querySelector('.foreground');
  if (foreground.childElementCount !== 3) checkViewport(foreground);
  [...foreground.children].forEach((child, index) => {
    child.className = viewports[index];
  });
  return foreground;
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
  const size = getBlockSize(el);
  const longFormVariants = ['inset', 'long-form', 'bio'];
  longFormVariants.forEach((variant, index) => {
    if (el.classList.contains(variant)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (index > 0) ? 'standard' : variant;
    }
  });
  const config = blockTypeSizes[blockType][size];
  decorateBlockText(el, config);

  rows.forEach((row) => { row.classList.add('foreground'); });
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
  extendButtonsClass(el);
  decorateTextOverrides(el);
  decorateMultiViewport(el);
}
