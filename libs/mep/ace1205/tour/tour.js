import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import icons from '../../../c2/assets/icons.js';

const SWIPE_CLOSE_THRESHOLD = 100;

function addCloseAnimation(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const modal = el.closest('.dialog-modal');
  if (!modal) return;
  const originalRemove = modal.remove.bind(modal);
  modal.remove = () => {
    if (modal.classList.contains('is-dismissing')) { originalRemove(); return; }
    modal.classList.add('is-closing');
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isSnapping = false;
  const snapBack = () => {
    if (isSnapping) return;
    isSnapping = true;
    modal.classList.remove('is-dragging');
    modal.classList.add('is-snapping');
    modal.style.removeProperty('--tour-drag-y');
    if (reducedMotion) {
      modal.classList.remove('is-snapping');
      isSnapping = false;
    } else {
      modal.addEventListener('transitionend', () => {
        modal.classList.remove('is-snapping');
        isSnapping = false;
      }, { once: true });
    }
  };

  grabHandle.addEventListener('click', triggerClose);

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  grabHandle.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    currentY = startY;
    isDragging = true;
    modal.classList.add('is-dragging');
  }, { passive: true });

  grabHandle.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const delta = Math.max(0, currentY - startY);
    modal.style.setProperty('--tour-drag-y', `${delta}px`);
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
    if (delta < SWIPE_CLOSE_THRESHOLD) { snapBack(); return; }
    modal.classList.remove('is-dragging');
    modal.style.removeProperty('--tour-drag-y');
    modal.classList.add('is-dismissing');
    if (reducedMotion) { triggerClose(); return; }
    modal.addEventListener('transitionend', triggerClose, { once: true });
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
    if (headerInner) {
      headerRow.replaceChildren(...headerInner.children);
      headerRow.querySelector('p')?.classList.add('eyebrow');
      headerRow.querySelector('h3')?.classList.add('heading-6');
      headerRow.querySelector('h3')?.setAttribute('tabindex', '0');
    }
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
    const rowIndexEl = createTag('div', { class: 'label tour-row-index' }, `( ${rowIndex}/${multiColumns.length} )`);

    const wrapper = createTag('div', { class: 'tour-row-content' });
    wrapper.append(rowIndexEl, ...row.children);
    row.append(wrapper);

    const tourRowImage = wrapper.querySelector('.tour-row-image');
    const imageParagraphs = [...(tourRowImage?.querySelectorAll('p:has(img)') ?? [])];
    if (imageParagraphs.length > 1) {
      const imageCenter = createTag('div', { class: 'tour-row-image-center' });
      imageParagraphs.slice(1).forEach((p) => imageCenter.append(p));
      row.append(imageCenter);
    }
  });

  el.replaceChildren(...[headerRow, ...multiColumns, footerRow].filter(Boolean));
  addGrabHandle(el);
  addCloseAnimation(el);
}
