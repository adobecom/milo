import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';

const blockTypeSizes = {
  // size: [heading, detail, body]
  normal: {
    small: ['S', 'S', 'S'],
    medium: ['M', 'M', 'M'],
    large: ['L', 'L', 'L'],
    xlarge: ['XL', 'XL', 'XL'],
  },
  inset: {
    small: ['S', 'S', 'M'],
    medium: ['M', 'M', 'L'],
    large: ['L', 'L', 'XL'],
    xlarge: ['XL', 'XL', 'XXL'],
  },
  text: {
    small: ['M', 'S', 'S'],
    medium: ['L', 'M', 'M'],
    large: ['XL', 'L', 'M'],
    xlarge: ['XXL', 'XL', 'L'],
  },
  media: {
    small: ['XS', 'M', 'S'],
    medium: ['M', 'M', 'S'],
    large: ['XL', 'L', 'M'],
    xlarge: ['XXL', 'L', 'M'],
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
  if (el.classList.contains('full-width')) helperClasses.push('center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('l-spacing-top', 'm-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-S');
  }
  const longFormBlocks = ['inset', 'long-form', 'bio'];
  longFormBlocks.forEach((b, i) => {
    if (el.classList.contains(b)) {
      helperClasses.push('max-width-8-desktop');
      if (i > 0) helperClasses.push('normal');
    }
  });
  el.classList.add(...helperClasses);
  const variants = ['normal', 'inset', 'text'];
  const size = getBlockSize(el);
  const blockV = variants.find((v) => el.classList.contains(v)) || variants[2];
  const typeConfig = blockTypeSizes[blockV][size];
  const hasDetail = (blockV !== 'normal' || blockV !== 'inset');

  console.log(blockV, size, 'typeConfig', typeConfig, '[heading, detail, body]', el);
  
  decorateBlockText(el, typeConfig, hasDetail);
  rows.forEach((row) => { row.classList.add('foreground'); });
}
