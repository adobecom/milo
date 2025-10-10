import { createTag, loadStyle, getConfig } from '../../../utils/utils.js';
import { getMetadata } from '../../../blocks/section-metadata/section-metadata.js';
import { decorateDefaultLinkAnalytics } from '../../../martech/attributes.js';
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

/* #mweb Hide show more button functionality */
function getShowMoreButtonContent() {
  return 'See more features <span class="show-more-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><path d="M12 24.24C5.38258 24.24 0 18.8574 0 12.24C0 5.62257 5.38258 0.23999 12 0.23999C18.6174 0.23999 24 5.62257 24 12.24C24 18.8574 18.6174 24.24 12 24.24ZM12 2.29713C6.51696 2.29713 2.05714 6.75695 2.05714 12.24C2.05714 17.723 6.51696 22.1828 12 22.1828C17.483 22.1828 21.9429 17.723 21.9429 12.24C21.9429 6.75695 17.483 2.29713 12 2.29713Z" fill="#292929"/><path d="M16.5504 11.1884H13.0504V7.68843C13.0504 7.10874 12.5801 6.63843 12.0004 6.63843C11.4207 6.63843 10.9504 7.10874 10.9504 7.68843V11.1884H7.45039C6.87071 11.1884 6.40039 11.6587 6.40039 12.2384C6.40039 12.8181 6.87071 13.2884 7.45039 13.2884H10.9504V16.7884C10.9504 17.3681 11.4207 17.8384 12.0004 17.8384C12.5801 17.8384 13.0504 17.3681 13.0504 16.7884V13.2884H16.5504C17.1301 13.2884 17.6004 12.8181 17.6004 12.2384C17.6004 11.6587 17.1301 11.1884 16.5504 11.1884Z" fill="#292929"/></svg></span>';
}

function handleShowMoreButton(section) {
  const showMoreBtn = section.querySelector('.show-more-button button');
  if (!showMoreBtn) return;

  showMoreBtn.innerHTML = getShowMoreButtonContent();
  showMoreBtn.setAttribute('aria-label', 'See more');

  showMoreBtn.addEventListener('click', () => {
    section.classList.add('show-all');
    section.querySelector('.show-more-button').remove(); // Remove the entire show-more-button div
  });
}

const init = async (el) => {
  el.classList.add('con-block');
  const hasOpenClass = el.className.includes('open');
  if (hasOpenClass) el.classList.add('no-border', 'l-rounded-corners-image', 'static-links-copy');
  if (el.className.includes('rounded-corners')) loadStyle(`${base}/styles/rounded-corners.css`);
  if (![...el.classList].some((c) => c.endsWith('-lockup'))) el.classList.add('m-lockup');
  let rows = el.querySelectorAll(':scope > div');
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
  extendDeviceContent(el);
  decorateTextOverrides(el);
  handleClickableCard(el);

  // ##mweb Add show more button for mobile view if needed
  const section = el.closest('.section');
  if (section) {
    const elem = section.querySelector('.section-metadata');
    const metadata = getMetadata(elem);
    const hideShowButton = metadata['hide-show-button']?.text === 'on';
    const cards = section.querySelectorAll('.editorial-card');
    const existingShowMoreButton = section.querySelector('.show-more-button');
    if (hideShowButton && cards.length > 3 && !existingShowMoreButton) {
      const showMoreButton = createTag('div', { class: 'show-more-button' });
      const button = createTag('button', {}, '');
      showMoreButton.append(button);
      section.append(showMoreButton);
      handleShowMoreButton(section);
      decorateDefaultLinkAnalytics(showMoreButton);
    }
  }
};

export default init;
