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

function getSizeString(str) {
  return str.split('-').shift().toUpperCase();
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
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-S');
  }
  let blockType = 'text';
  const size = getBlockSize(el);
  const textLongFormVariants = ['inset', 'long-form', 'bio'];
  textLongFormVariants.forEach((b, i) => {
    if (el.classList.contains(b)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (i > 0) ? 'standard' : b;
    }
  });
  const config = blockTypeSizes[blockType][size];
  const headingClass = [...el.classList].filter((c) => c.includes('-heading'));
  if (headingClass.length > 0) config[0] = getSizeString(headingClass[0]);
  const bodyClass = [...el.classList].filter((c) => c.includes('-body'));
  if (bodyClass.length > 0) config[1] = getSizeString(bodyClass[0]);
  const detailClass = [...el.classList].filter((c) => c.includes('-detail'));
  if (detailClass.length > 0) config[2] = getSizeString(detailClass[0]);

  el.classList.add(...helperClasses);
  decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });
}
