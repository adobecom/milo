import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import icons from '../../../c2/assets/icons.js';

const SWIPE_CLOSE_THRESHOLD = 100;

function addCloseAnimation(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const originalRemove = modal.remove.bind(modal);
  modal.remove = () => {
    if (modal.style.transform) {
      originalRemove();
      return;
    }
    modal.style.animation = 'tour-slide-out 0.3s ease forwards';
    modal.addEventListener('animationend', originalRemove, { once: true });
  };
}

function addGrabHandle(el) {
  if (!window.matchMedia('(pointer: coarse)').matches) return;
  const modal = el.closest('.dialog-modal');
  if (!modal) return;

  const grabHandle = createTag('span', {
    class: 'tour-grab-handle',
    'aria-hidden': 'true',
  });

  const triggerClose = () => modal.querySelector('.dialog-close')?.click();

  let isSnapping = false;
  const snapBack = () => {
    if (isSnapping) return;
    isSnapping = true;
    modal.style.transition = 'transform 0.3s ease';
    modal.style.transform = '';
    modal.addEventListener('transitionend', () => {
      modal.style.transition = '';
      isSnapping = false;
    }, { once: true });
  };

  grabHandle.addEventListener('click', triggerClose);

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  grabHandle.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    currentY = startY;
    isDragging = true;
    modal.style.transition = 'none';
  }, { passive: true });

  grabHandle.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const delta = Math.max(0, currentY - startY);
    modal.style.transform = `translateY(${delta}px)`;
  }, { passive: true });

  grabHandle.addEventListener('touchcancel', () => {
    if (!isDragging) return;
    isDragging = false;
    snapBack();
  }, { passive: true });

  grabHandle.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const delta = currentY - startY;
    if (delta >= SWIPE_CLOSE_THRESHOLD) {
      modal.style.transition = 'transform 0.3s ease';
      modal.style.transform = 'translateY(100%)';
      modal.addEventListener('transitionend', triggerClose, { once: true });
    } else {
      snapBack();
    }
  }, { passive: true });

  el.prepend(grabHandle);
}

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  const singleColumns = [];
  const multiColumns = [];
  rows.forEach((row) => {
    if (row.children.length === 1) singleColumns.push(row);
    else multiColumns.push(row);
  });

  const [headerRow, footerRow] = singleColumns;

  if (headerRow) {
    headerRow.classList.add('tour-header');
    const headerInner = headerRow.querySelector(':scope > div');
    if (headerInner) headerRow.replaceChildren(...headerInner.children);
  }

  if (footerRow) {
    footerRow.classList.add('tour-footer');
    const contentDiv = footerRow.querySelector(':scope > div');
    if (contentDiv) {
      const [imgPara, linkPara] = contentDiv.querySelectorAll('p');
      const img = imgPara?.querySelector('img');
      const relativeSrc = img?.getAttribute('src');
      if (relativeSrc?.startsWith('/')) {
        img.src = getFederatedUrl(relativeSrc);
      }
      const linkEl = linkPara?.querySelector('a');
      const sourceText = (linkEl ? linkEl.textContent : linkPara?.textContent ?? '').trim();
      const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
      const ctaHref = linkEl?.getAttribute('href') || '#';
      const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons?.arrowRightWhite);
      const cta = createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel }, [img, ctaText, arrow]);
      footerRow.replaceChildren(cta);
    }
  }

  multiColumns.forEach((row, index) => {
    const rowIndex = index + 1;
    row.classList.add('tour-row', `row-${rowIndex}`);
    row.firstElementChild.classList.add('tour-row-body', 'body-sm');
    row.lastElementChild.classList.add('tour-row-image');
    const rowIndexEl = createTag('div', { class: 'tour-row-index' });
    rowIndexEl.textContent = `( ${rowIndex}/${multiColumns.length} )`;
    row.prepend(rowIndexEl);
  });

  el.replaceChildren(...[headerRow, ...multiColumns, footerRow].filter(Boolean));
  addGrabHandle(el);
  addCloseAnimation(el);
}
