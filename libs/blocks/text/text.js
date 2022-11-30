import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';

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
  if (el.classList.contains('intro')) helperClasses.push('xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) {
    const elAction = el.querySelector('.action-area');
    if (elAction) elAction.classList.add('body-S');
  }
  const longFormBlocks = ['long-form', 'inset', 'bio'];
  longFormBlocks.forEach((c) => {
    if (el.classList.contains(c)) helperClasses.push('normal', 'max-width-8-desktop');
  });
  el.classList.add(...helperClasses);
  const size = getBlockSize(el);
  decorateBlockText(el, size);
  rows.forEach((row) => { row.classList.add('foreground'); });
}
