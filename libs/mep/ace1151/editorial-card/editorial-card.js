import { createTag, loadStyle, getConfig } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateBlockHrs, decorateTextOverrides, applyHoverPlay } from '../../../utils/decorate.js';

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
  if (!prevElem) return;
  const elBodyClass = [...prevElem.classList].find((c) => c.startsWith('body-'));
  prevElem.classList.remove(elBodyClass);
  prevElem.classList.add('device');
};

const decorateMedia = (el, media) => {
  if (!media) return;
  media.classList.add('media-area');
  const mediaVideo = media.querySelector('video');
  if (mediaVideo) {
    applyHoverPlay(mediaVideo);
  }
  if (media.children.length > 1) decorateBlockBg(el, media, { className: 'vp-media' });
};

const decorateForeground = async (el, rows) => {
  let isForegroundEmpty = true;

  rows.forEach((row, i) => {
    if (!row.textContent.trim()) {
      row.remove();
      return;
    }

    isForegroundEmpty = false;
    if (i === 0) {
      row.classList.add('foreground');
      decorateLockupFromContent(row);
    } else if (i === (rows.length - 1)) {
      row.classList.add('card-footer');
      if (!row.textContent.trim()) row.classList.add('empty');
    } else {
      row.classList.add('extra-row');
    }
    decorateBlockText(row, ['m', 'm', 'm']); // heading, body, detail
    decorateBlockHrs(row);
  });

  if (isForegroundEmpty) el.classList.add('no-foreground');
};

const decorateBgRow = (el, background, remove = false) => {
  const rows = background.querySelectorAll(':scope > div');
  const bgRowsEmpty = [...rows].every((row) => row.innerHTML.trim() === '');
  if (bgRowsEmpty || remove) {
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

function handleOpenClasses(el, hasOpenClass) {
  const baseOpenClasses = ['l-rounded-corners-image', 'static-links-copy'];
  if (hasOpenClass) el.classList.add(...baseOpenClasses, 'no-border');

  if (!el.closest('.carousel.ups-desktop')) return;

  const isCarouselDesktop = window.matchMedia('(min-width: 900px)');
  const toggleOpenClasses = () => {
    if (isCarouselDesktop.matches) el.classList.add(...baseOpenClasses, 'no-bg');
    else el.classList.remove(...baseOpenClasses, 'no-bg');
  };

  toggleOpenClasses();
  isCarouselDesktop.addEventListener('change', toggleOpenClasses);
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

const decorateHoverText = (el) => {
  const metadata = getMetadata(el.parentElement?.querySelector('.section-metadata'));
  if (!metadata) return;
  const index = Array.from(el.parentElement.children).indexOf(el);
  const key = `overlay-${index + 1}`;
  const [header, body] = (metadata[key].text.split('\n') || []).map((s) => s.trim());

  const overlay = createTag('div', { class: 's2a-card-overlay' });
  if (header) overlay.appendChild(createTag('h1', {}, header));
  if (body) overlay.appendChild(createTag('p', {}, body));

  const button = createTag('button', { class: 's2a-card-overlay-btn' }, '<div><span class="overlay-btn-icon open">+</span><span class="overlay-btn-icon close">-</span></div>');

  button.addEventListener('click', () => {
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('mouseenter', () => overlay.classList.add('active'));
  overlay.addEventListener('mouseleave', () => overlay.classList.remove('active'));

  overlay.appendChild(button);
  el.appendChild(overlay);
};

const decorateAccordion = (el) => {
  const title = el.querySelector('.foreground :is(h1, h2, h3, h4, h5, h6)');
  if (!title) return;
  const closeButtonSvg = `<svg width="9" height="3" viewBox="0 0 9 3" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.16406 0.631836H7.79297C8.00044 0.631836 8.32617 0.862684 8.32617 1.35449C8.3261 1.84619 8.00042 2.07715 7.79297 2.07715H1.16406C0.956614 2.07715 0.63093 1.84619 0.630859 1.35449C0.630859 0.862684 0.956592 0.631836 1.16406 0.631836Z" fill="#292929" stroke="black" stroke-width="1.26269"/>
</svg>`;
  const openButtonSvg = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.79316 3.85624H5.64265V1.35428C5.64265 0.606847 5.12104 0 4.4786 0C3.83616 0 3.31455 0.606847 3.31455 1.35428V3.85624H1.16405C0.521604 3.85624 0 4.46308 0 5.21052C0 5.95795 0.521604 6.5648 1.16405 6.5648H3.31455V9.06675C3.31455 9.81419 3.83616 10.421 4.4786 10.421C5.12104 10.421 5.64265 9.81419 5.64265 9.06675V6.5648H7.79316C8.4356 6.5648 8.9572 5.95795 8.9572 5.21052C8.9572 4.46308 8.4356 3.85624 7.79316 3.85624Z" fill="black"/>
</svg>`;
  const titleContent = title.textContent.toLowerCase().replace(/\s+/g, '-');
  const cardHeader = el.querySelector('.foreground > div > [class*="heading-"]');
  const accordionItemBody = el.querySelector('.foreground > div > p[class*="body-"]');
  accordionItemBody.classList.add('editorial-accordion-item');
  const button = createTag('button', { class: 's2a-card-accordion-btn' }, `<div><span daa-ll="${titleContent}-open"class="accordion-btn-icon open">${openButtonSvg}</span><span daa-ll="${titleContent}-close" class="accordion-btn-icon close">${closeButtonSvg}</span></div>`);
  cardHeader.insertAdjacentElement('afterend', button);

  button.addEventListener('click', () => {
    accordionItemBody.classList.toggle('active');
    button.classList.toggle('active');
  });
};

function parseRowMetaData(rows) {
  const metaDataKeys = ['video-icon'];
  const metaData = [];

  const rowArray = Array.from(rows);
  rowArray.forEach((row) => {
    const cols = row.querySelectorAll('div');
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim();
      const child = cols[1].querySelector('a, img');
      const value = child?.href || child?.src || '';
      if (metaDataKeys.includes(key)) {
        metaData.push({ key, value });
        row.remove();
      }
    }
  });

  const filteredRows = rowArray.filter((row) => row.isConnected);
  return { rows: filteredRows, metaData };
}

const addVideoIcons = (el, metaData) => {
  if (!metaData || !Array.isArray(metaData)) return;
  metaData.forEach((item) => {
    if (item.key === 'video-icon' || item.value !== '') {
      const container = createTag('div', { class: 'video-icon-container' });
      const img = createTag('img', { src: item.value, class: 'video-icon' });
      container.append(img);
      el.insertAdjacentElement('afterEnd', container);
    }
  });
};

const init = async (el) => {
  el.classList.add('con-block');
  const hasOpenClass = el.className.includes('open');
  if (hasOpenClass) el.classList.add('no-border', 'l-rounded-corners-image', 'static-links-copy'); // ace1081 change

  handleOpenClasses(el, hasOpenClass);

  if (el.className.includes('rounded-corners')) loadStyle(`${base}/styles/rounded-corners.css`);
  if (![...el.classList].some((c) => c.endsWith('-lockup'))) el.classList.add('m-lockup');
  let rows = el.querySelectorAll(':scope > div');
  let metaData = [];
  ({ rows, metaData } = parseRowMetaData(rows));
  const [head, middle, ...tail] = rows;
  if (rows.length === 4) el.classList.add('equal-height');
  if (rows.length >= 1) {
    const count = rows.length >= 4 ? 'four-plus' : rows.length;
    switch (count) {
      case 'four-plus':
        // 4+ rows (0:bg, 1:media, 2:copy, ...3:static, last:card-footer)
        // 4+ rows.open (0:bg[removed], 1:media, 2:copy, ...3:static, last:card-footer)
        decorateBgRow(el, head, hasOpenClass);
        rows = tail;
        decorateMedia(el, middle);
        await decorateForeground(el, rows);
        break;
      case 3:
        // 3 rows (0:bg, 1:media, last:copy)
        // 3 rows.open (0:media, 1:copy, last:card-footer)
        if (hasOpenClass) {
          el.classList.add('no-bg');
          rows = [middle, tail[0]];
          decorateMedia(el, head);
        } else {
          rows = tail;
          decorateBgRow(el, head);
          decorateMedia(el, middle);
        }
        await decorateForeground(el, rows);
        break;
      case 2:
        // 2 rows (0:media, 1:copy)
        rows = [middle];
        decorateMedia(el, head);
        el.classList.add('no-bg');
        await decorateForeground(el, rows);
        break;
      case 1:
        // 1 row  (0:copy)
        rows = [head];
        el.classList.add('no-bg', 'no-media');
        await decorateForeground(el, rows);
        break;
      default:
    }
  }
  addVideoIcons(middle, metaData); // ace1081 change
  extendDeviceContent(el);
  decorateTextOverrides(el);
  handleClickableCard(el);
  if (el.classList.contains('s2a-overlay')) decorateHoverText(el);
  if (el.classList.contains('s2a-editorial-accordion')) decorateAccordion(el);
};

export default init;
