import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import icons from '../../../c2/assets/icons.js';

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
      const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' });
      arrow.innerHTML = icons.arrowRightWhite;
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
    row.insertBefore(rowIndexEl, row.firstElementChild);
  });

  el.replaceChildren(...[headerRow, ...multiColumns, footerRow].filter(Boolean));
}