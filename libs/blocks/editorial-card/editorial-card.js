import { createTag, loadStyle, getConfig } from '../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateBlockHrs, decorateTextOverrides, applyHoverPlay } from '../../utils/decorate.js';

function decorateLockupFromContent(el) {
  const rows = el.querySelectorAll(':scope > div > p');
  const firstRowImg = rows[0]?.querySelector('img');
  if (firstRowImg) {
    rows[0].classList.add('lockup-area');
    rows[0].childNodes.forEach((node) => {
      // console.log(node.nodeType === 3, node.nodeValue !== ' ');
      if (node.nodeType === 3 && node.nodeValue !== ' ') {
        const newSpan = createTag('span', { class: 'lockup-label' }, node.nodeValue);
        node.parentElement.replaceChild(newSpan, node);
      }
    });
  }
}

const decorateForeground = (rows, media = 0) => {
  if (media) {
    media.classList.add('media-area');
    const mediaVideo = media.querySelector('video');
    if (mediaVideo) applyHoverPlay(mediaVideo);
  }
  rows.forEach((row) => {
    row.classList.add('foreground');
    decorateLockupFromContent(row);
    decorateBlockText(row, ['xxl', 'xs', 'xl']);
    decorateBlockHrs(row);
  });
};

const init = (el) => {
  el.classList.add('con-block');
  if (el.className.includes('rounded-corners')) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    loadStyle(`${base}/styles/rounded-corners.css`);
  }
  let rows = el.querySelectorAll(':scope > div');
  const [head, middle, ...tail] = rows;
  if (rows.length > 1) {
    switch (rows.length) {
      case 3:
        // 3 rows (0:bg, 1:media, 2:copy)
        if (rows[0].textContent.trim() !== '') el.classList.add('has-bg-row');
        decorateBlockBg(el, head);
        rows = tail;
        decorateForeground(rows, middle);
        break;
      case 2:
        // 2 rows (0:media, 1:copy)
        rows = middle;
        decorateForeground([rows], head);
        el.classList.add('no-bg');
        break;
      case 1:
        // 1 row  (0:copy)
        rows = head.querySelectorAll(':scope > div');
        decorateForeground([rows]);
        el.classList.add('no-bg');
        break;
      default:
    }
  }
  decorateTextOverrides(el);
};

export default init;
