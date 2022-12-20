import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  standard: {
    small: ['S', 'S', 'S'],
    medium: ['M', 'M', 'M'],
    large: ['L', 'L', 'L'],
    xlarge: ['XL', 'XL', 'XL'],
  },
  inset: {
    small: ['S', 'M'],
    medium: ['M', 'L'],
    large: ['L', 'XL'],
    xlarge: ['XL', 'XXL'],
  },
  text: {
    small: ['M', 'S', 'S'],
    medium: ['L', 'M', 'M'],
    large: ['XL', 'M', 'L'],
    xlarge: ['XXL', 'L', 'XL'],
  },
};

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
  const overrides = ['-heading', '-body', '-detail'];
  overrides.forEach((override, index) => {
    const hasClass = [...el.classList].filter((listItem) => listItem.includes(override));
    if (hasClass.length) config[index] = hasClass[0].split('-').shift().toUpperCase();
  });
  decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-S');
  }
  el.classList.add(...helperClasses);
}
