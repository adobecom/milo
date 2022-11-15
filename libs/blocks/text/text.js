
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
  if (el.classList.contains('full-width') || el.classList.contains('vertical')) el.classList.add('xxl-spacing');
  if (el.classList.contains('intro')) el.classList.add('xxl-spacing-top', 'xl-spacing-bottom');
}
