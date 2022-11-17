
import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

export default function init(el) {
  el.classList.add('text-block', 'con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    const [head, ...tail] = rows;
    decorateBlockBg(el, head);
    el.classList.add('has-bg');
    rows = tail;
  }
  const size = getBlockSize(el);
  decorateBlockText(el, size);
  rows.forEach((row) => {
    row.classList.add('foreground');
  });
  let helperClasses = [];
  if (el.classList.contains('full-width')) {
    helperClasses.push('center');
  }
  if (el.classList.contains('intro')) {
    helperClasses.push('xxl-spacing-top', 'xl-spacing-bottom');
  }else if (el.classList.contains('full-width')) {
    helperClasses.push('xxl-spacing');
  }else if (el.classList.contains('vertical')) {
    // helperClasses.push('m-spacing');
  }
  el.classList.add(...helperClasses);
}
