import { tagFor, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';

const HEADING = /^H[1-6]$/;
const HEADING_OR_STRONG = /^(H[1-6]|STRONG)$/;
const TEXT_NODE = 3;

const meaningfulChildren = (col) => [...col.childNodes]
  .filter((node) => node.nodeType !== TEXT_NODE || node.textContent.trim() !== '');

const directCells = (row) => [...row.children].filter((c) => c.tagName === 'DIV');

function isRowHeader(cols, col, cdx, rows) {
  const withStrongOrHeading = cols.filter((rowCol) => meaningfulChildren(rowCol)
    .some((child) => HEADING_OR_STRONG.test(child.tagName || '')));
  const corresponding = directCells(rows[0])[cdx];
  const columnHeaderAbove = corresponding?.getAttribute('role') === 'columnheader';
  return withStrongOrHeading.length === 1 && withStrongOrHeading[0] === col && !columnHeaderAbove;
}

const isImageLink = (child) => !!child.classList
  && (child.classList.contains('image-link') || child.classList.contains('s2-image-link'));
function isColumnHeader(rdx, startsWithHeading, children) {
  return (!rdx && children.length === 1 && !children.some(isImageLink)) || startsWithHeading;
}

function setRoles(pairs) {
  pairs.forEach(({ el, role }) => {
    if (el.getAttribute('role')) return;
    el.setAttribute('role', role);
  });
}

function cellIfRowHasText(cols, col) {
  if (cols.some((other) => textOf(other))) col.setAttribute('role', 'cell');
}

function applyAccessibilityAttributes({
  col, rdx, cols, cdx, rows, row, el,
}) {
  if (!rdx && !cdx && !textOf(col)) {
    col.classList.add('empty-table-heading');
    cellIfRowHasText(cols, col);
    return;
  }
  if (!textOf(col)) cellIfRowHasText(cols, col);

  const children = meaningfulChildren(col);
  const startsWithHeading = HEADING.test(children[0]?.tagName || '');
  if (startsWithHeading) children[0].setAttribute('role', 'paragraph');

  if (rdx > 0 && !cdx && isRowHeader(cols, col, cdx, rows)) {
    col.classList.add('row-title');
    setRoles([{ el: col, role: 'rowheader' }, { el: row, role: 'row' }]);
    return;
  }
  if (isColumnHeader(rdx, startsWithHeading, children)) {
    setRoles([{ el: col, role: 'columnheader' }, { el: row, role: 'row' }]);
    return;
  }
  if (!textOf(col)) return;
  setRoles([{ el, role: 'table' }, { el: col, role: 'cell' }, { el: row, role: 'row' }]);
}

function decorateColumns(el, ctx) {
  el.classList.add('columns');
  pageShims(el, ctx.make);
  decorateVideoLinks(el, { make: ctx.make });

  const rows = directCells(el);
  const isTable = el.classList.contains('table');
  if (isTable) el.classList.replace('table', 'columns-table');

  rows.forEach((row, rdx) => {
    row.classList.add('row', `row-${rdx + 1}`);
    const cols = directCells(row);
    cols.forEach((col, cdx) => {
      col.classList.add('col', `col-${cdx + 1}`);
      if (!isTable) return;
      applyAccessibilityAttributes({
        col, rdx, cols, cdx, rows, row, el,
      });
    });
  });
}

export const MEMBERS = {
  columns: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateColumns,
  },
};

export default function decorate(el) {
  const [name] = el.classList;
  if (name !== 'columns' && el.classList.contains('columns')) {
    el.dataset.spectrum2Member = 'columns';
    el.dataset.spectrum2Origin = MEMBERS.columns.origin;
    el.classList.add('spectrum2');
    const { origin, overrides, compat, viewportPrePass } = MEMBERS.columns;
    return decorateColumns(el, {
      member: 'columns', origin, overrides, compat, viewportPrePass, make: tagFor(el),
    });
  }
  return dispatch(el, MEMBERS, { block: 'columns' });
}
