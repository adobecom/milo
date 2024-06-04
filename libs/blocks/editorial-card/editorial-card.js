import { decorateBlockBg, decorateBlockText, decorateBlockHrs } from '../../utils/decorate.js';

function decorateLockupFromContent(el) {
  const rows = el.querySelectorAll(':scope > div > p');
  const firstRowImg = rows[0]?.querySelector('img');
  if (firstRowImg) rows[0].classList.add('lockup-area');
}

const init = (el) => {
  el.classList.add('con-block');
  let rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    const [head, middle, ...tail] = rows;
    decorateBlockBg(el, head);
    middle?.classList.add('media-area');
    rows = tail;
    rows.forEach((row) => {
      row.classList.add('foreground');
      decorateBlockText(row, ['xxl', 'xs', 'xl']);
    });
  }
  decorateBlockHrs(rows[0]);
  decorateLockupFromContent(rows[0]);
};

export default init;
