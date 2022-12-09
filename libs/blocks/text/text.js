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
  if (el.classList.contains('intro')) helperClasses.push('xxl-spacing-top', 'xl-spacing-bottom');
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
 
  const veto = [];
  if (el.classList.contains('override')) {
    const headingClass = [...el.classList].filter((i) => i.includes('-heading'));
    if (headingClass) veto.push(getSizeString(headingClass[0]));
    const bodyClass = [...el.classList].filter((i) => i.includes('-body'));
    if (bodyClass) veto.push(getSizeString(bodyClass[0]));
    const detailClass = [...el.classList].filter((i) => i.includes('-detail'));
    if (detailClass) veto.push(getSizeString(detailClass[0]));
  }
  el.classList.add(...helperClasses);
  const size = getBlockSize(el);
  const config = (veto.length) ? veto : blockTypeSizes[blockType][size];
  // console.log(blockType, size, 'typeConfig', typeConfig, '[heading, detail, body]', el);
  decorateBlockText(el, config);
  rows.forEach((row) => { row.classList.add('foreground'); });
}
