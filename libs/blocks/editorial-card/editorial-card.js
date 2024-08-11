import { createTag, loadStyle, getConfig } from '../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateBlockHrs, decorateTextOverrides, applyHoverPlay } from '../../utils/decorate.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

async function loadIconography() {
  await new Promise((resolve) => { loadStyle(`${base}/styles/iconography.css`, resolve); });
}

async function decorateLockupFromContent(el) {
  const rows = el.querySelectorAll(':scope > div > p');
  const firstRowImg = rows[0]?.querySelector('img');
  if (!firstRowImg) return;
  await loadIconography();
  rows[0].classList.add('lockup-area');
  rows[0].childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.nodeValue !== ' ') {
      const newSpan = createTag('span', { class: 'lockup-label' }, node.nodeValue);
      node.parentElement.replaceChild(newSpan, node);
    }
  });
}

const extendDeviceContent = (el) => {
  const detail = el.querySelector('[class^="detail-"]');
  const prevElem = detail?.previousElementSibling;
  if (!prevElem || ![...prevElem.classList].some((c) => c.startsWith('body-'))) return;
  prevElem.classList.remove('body-m');
  prevElem.classList.add('body-xxs', 'device');
};

const decorateMedia = (el, media) => {
  if (!media) return;
  media.classList.add('media-area');
  const mediaVideo = media.querySelector('video');
  if (mediaVideo) {
    applyHoverPlay(mediaVideo);
  }
  if (media.children.length > 1) decorateBlockBg(el, media);
};

const decorateForeground = async (el, rows) => {
  rows.forEach(async (row, i) => {
    if (i === 0) {
      row.classList.add('foreground');
      await decorateLockupFromContent(row);
    } else if (i === (rows.length - 1)) {
      row.classList.add('card-footer');
      if (!row.textContent.trim()) row.classList.add('empty');
    } else {
      row.classList.add('extra-row');
    }
    decorateBlockText(row, ['m', 'm', 'm']); // heading, body, detail
    decorateBlockHrs(row);
  });
};

const decorateBgRow = (el, background) => {
  if (background.textContent.trim() === '') {
    el.classList.add('no-bg');
    background.remove();
    return;
  }
  decorateBlockBg(el, background);
};

function handleClickableCard(el) {
  const links = el.querySelectorAll('a');
  if (el.classList.contains('click') && links) {
    el.addEventListener('click', (e) => {
      /* c8 ignore next 2 */
      if (e.target.tagName === 'A') return;
      (() => (links[0].target === '_blank' ? window.open(links[0].href) : window.location.assign(links[0].href)))();
    });
  }
}

const init = async (el) => {
  el.classList.add('con-block');
  if (el.className.includes('open')) {
    el.classList.add('no-border', 'l-rounded-corners-image', 'static-links-copy');
  }
  if (el.className.includes('rounded-corners')) {
    loadStyle(`${base}/styles/rounded-corners.css`);
  }
  if (![...el.classList].some((c) => c.endsWith('-lockup'))) el.classList.add('m-lockup');
  let rows = el.querySelectorAll(':scope > div');
  const [head, middle, ...tail] = rows;
  if (rows.length === 4) el.classList.add('equal-height');
  if (rows.length >= 1) {
    const count = rows.length >= 3 ? 'three-plus' : rows.length;
    switch (count) {
      case 'three-plus':
        // 3+ rows (0:bg, 1:media, 2:copy, ...3:static, last:card-footer)
        decorateBgRow(el, head);
        rows = tail;
        await decorateForeground(el, rows);
        decorateMedia(el, middle);
        break;
      case 2:
        // 2 rows (0:media, 1:copy)
        rows = middle;
        await decorateForeground(el, [rows]);
        decorateMedia(el, head);
        el.classList.add('no-bg');
        break;
      case 1:
        // 1 row  (0:copy)
        rows = head;
        await decorateForeground(el, [rows]);
        el.classList.add('no-bg', 'no-media');
        break;
      default:
    }
  }
  extendDeviceContent(el);
  decorateTextOverrides(el);
  handleClickableCard(el);
};

export default init;
