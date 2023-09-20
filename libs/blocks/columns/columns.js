import { decorateLinkAnalytics } from '../../martech/attributes.js';

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    row.className = `row row-${rdx + 1}`;
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      const headings = col.querySelectorAll('h1, h2, h3, h4, h5, h6');
      decorateLinkAnalytics(col, headings);
      col.className = `col col-${cdx + 1}`;
    });
  });
  if (el.classList.contains('table')) {
    el.classList.add('columns-table');
    el.classList.remove('table');
  }
}
