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

function checkAvailability(arr, val) {
  return arr.some((arrVal) => val === arrVal);
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
  if (el.classList.contains('intro')) helperClasses.push('l-spacing-top', 'm-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-S');
  }
  let blockType = 'text';
  const textLongFormVariants = ['inset', 'long-form', 'bio'];
  textLongFormVariants.forEach((b, i) => {
    if (el.classList.contains(b)) {
      helperClasses.push('max-width-8-desktop');
      blockType = (i > 0) ? 'standard' : b;
    }
  });
  if (el.classList.contains('override')) {
    const config = [];
    const headingClass = [...el.classList].filter((i) => i.includes('heading-'));
    if (headingClass) config.push(headingClass);
    const bodyClass = [...el.classList].filter((i) => i.includes('body-'));
    if (bodyClass) config.push(bodyClass);
    const detailClass = [...el.classList].filter((i) => i.includes('detail-'));
    if (detailClass) config.push(detailClass);
    console.log('config', config);
  }
  el.classList.add(...helperClasses);
  const size = getBlockSize(el);
  const typeConfig = blockTypeSizes[blockType][size];
  // console.log(blockType, size, 'typeConfig', typeConfig, '[heading, detail, body]', el);
  decorateBlockText(el, typeConfig);
  rows.forEach((row) => { row.classList.add('foreground'); });
}
