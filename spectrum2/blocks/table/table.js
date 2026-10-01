import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateButtons } from '../_shared/buttons.js';
import { textOf } from '../_shared/dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  checkmark: {
    title: 'Checkmark',
    d: 'M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z',
  },
  info: {
    title: null,
    d: 'M10.075,6A1.075,1.075,0,1,1,9,4.925H9A1.075,1.075,0,0,1,10.075,6Zm.09173,6H10V8.2A.20005.20005,0,0,0,9.8,8H7.83324S7.25,8.01612,7.25,8.5c0,.48365.58325.5.58325.5H8v3H7.83325s-.58325.01612-.58325.5c0,.48365.58325.5.58325.5h2.3335s.58325-.01635.58325-.5C10.75,12.01612,10.16673,12,10.16673,12ZM9,.5A8.5,8.5,0,1,0,17.5,9,8.5,8.5,0,0,0,9,.5ZM9,15.6748A6.67481,6.67481,0,1,1,15.67484,9,6.67481,6.67481,0,0,1,9,15.6748Z',
  },
};
const PLACES = ['top', 'bottom', 'right', 'left'];
const LABELS = { toggle: 'toggle row', column: 'choose table column' };
const HIGHLIGHT_LOADED = 'milo:table:highlight:loaded';
const TAB_CHANGED = 'milo:tab:changed';
const DEFERRED = 'milo:deferred';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const ADDON_TARGET = { pricing: 'table-heading-pricing', body: 'table-heading-body', content: 'table-heading-content' };
const TABLE_INDEX = new WeakMap();

export function deviceBySize(win) {
  const width = win?.innerWidth ?? 1280;
  if (width >= 1024) return 'DESKTOP';
  if (width < 768) return 'MOBILE';
  return 'TABLET';
}

function isMobileLandscape(win) {
  return !!win?.matchMedia?.('(orientation: landscape)').matches && win.innerHeight <= 768;
}

export function isStickyHeader(el, win = el.ownerDocument.defaultView) {
  const device = deviceBySize(win);
  return el.classList.contains('sticky')
    || (el.classList.contains('sticky-desktop-up') && device === 'DESKTOP')
    || (el.classList.contains('sticky-tablet-up') && device !== 'MOBILE' && !isMobileLandscape(win));
}

export function stickyTopOffset(doc) {
  const win = doc.defaultView;
  let top = doc.querySelector('header')?.offsetHeight || 0;
  const localNav = doc.querySelector('.feds-localnav');
  if (localNav && !win?.matchMedia?.('(min-width: 900px)').matches) top = localNav.offsetHeight || 40;
  const promo = doc.querySelector('.feds-promo-aside-wrapper');
  if (promo) top += promo.offsetHeight || 0;
  return top;
}

function nextTableIndex(doc) {
  const n = (TABLE_INDEX.get(doc) || 0) + 1;
  TABLE_INDEX.set(doc, n);
  return n;
}

function debounce(fn, ms = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function glyph(doc, name) {
  const icon = ICONS[name];
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', `table-icon table-icon-${name}`);
  if (icon.title) {
    svg.setAttribute('role', 'img');
    const title = doc.createElementNS(SVG_NS, 'title');
    title.textContent = icon.title;
    svg.append(title);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', icon.d);
  svg.append(path);
  return svg;
}

let tooltipCount = 0;
function tooltip(make, doc, content, place, iconSvg) {
  tooltipCount += 1;
  const id = `table-tooltip-${tooltipCount}`;
  const trigger = make(
    'button',
    { type: 'button', class: 'table-tooltip-trigger', 'aria-label': content },
    iconSvg || glyph(doc, 'info'),
  );
  const tip = make('span', { class: 'table-tooltip', id, 'aria-hidden': 'true' }, content);
  return make('span', { class: `table-tooltip-wrap table-tooltip-${place}` }, [trigger, tip]);
}

export function decorateIcons(el, make) {
  const doc = el.ownerDocument;
  el.querySelectorAll('span.milo-tooltip[data-tooltip]').forEach((icon) => {
    const place = PLACES.find((p) => icon.classList.contains(p)) || 'right';
    icon.replaceWith(tooltip(make, doc, icon.dataset.tooltip, place, icon.querySelector('svg')));
  });
  el.querySelectorAll('span.icon').forEach((icon) => {
    const initial = (icon.classList[1] || '').replace('icon-', '');
    const isTooltip = initial === 'tooltip' || initial.includes('tooltip-');
    const wrapper = icon.closest('em');
    if (isTooltip && wrapper && wrapper.textContent.includes('|')) {
      const conf = wrapper.textContent.split('|');
      const content = conf.pop()?.trim();
      if (!content) return;
      const place = conf.pop()?.trim().toLowerCase() || 'right';
      wrapper.replaceWith(tooltip(make, doc, content, PLACES.includes(place) ? place : 'right'));
      return;
    }
    const name = isTooltip ? 'info' : initial;
    if (!ICONS[name] || icon.dataset.svgInjected || icon.querySelector('svg, img')) return;
    icon.append(glyph(doc, name));
    icon.dataset.svgInjected = 'true';
  });
}

function initTooltips(el) {
  const win = el.ownerDocument.defaultView;
  el.querySelectorAll('.table-tooltip-wrap').forEach((wrap) => {
    const tip = wrap.querySelector('.table-tooltip');
    const show = () => {
      wrap.classList.remove('table-tooltip-dismissed');
      if (!tip || !(wrap.matches('.table-tooltip-top, .table-tooltip-bottom'))) return;
      tip.style.removeProperty('--_tooltip-shift');
      const r = tip.getBoundingClientRect();
      const max = (win?.innerWidth || 0) - 8;
      let shift = 0;
      if (r.width && r.left < 8) shift = 8 - r.left;
      else if (r.width && r.right > max) shift = max - r.right;
      if (shift) tip.style.setProperty('--_tooltip-shift', `${Math.round(shift)}px`);
    };
    wrap.addEventListener('mouseenter', show);
    wrap.addEventListener('focusin', show);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') wrap.classList.add('table-tooltip-dismissed'); });
    wrap.addEventListener('mouseleave', () => wrap.classList.remove('table-tooltip-dismissed'));
  });
}

function handleHeading(el, headingCols, tableIndex, make) {
  const isPriceBottom = el.classList.contains('pricing-bottom');
  const isMerch = el.classList.contains('merch');
  headingCols.forEach((col, i) => {
    col.classList.add('table-cell-heading', 'col-heading');
    if (!col.childNodes.length) return;
    const elements = col.children;
    if (!elements.length) {
      const title = make('p', { class: 'table-heading-title' }, [...col.childNodes]);
      col.append(make('div', { class: 'table-heading-content' }, title));
    } else {
      let textStart = col.querySelector('.table-highlight-text') ? 1 : 0;
      let isTrackingSet = false;
      const iconTile = elements[textStart]?.querySelector('img');
      if (iconTile) {
        textStart += 1;
        if (!isMerch) iconTile.closest('p')?.classList.add('table-heading-tile');
      }
      if (elements[textStart]) {
        elements[textStart].classList.add('table-heading-title');
        isTrackingSet = true;
      }
      elements[textStart + 1]?.classList.add('table-heading-pricing');
      elements[textStart + 2]?.classList.add('table-heading-body');

      decorateButtons(col, 'l');
      const buttons = make('div', { class: 'table-heading-buttons' });
      col.append(buttons);
      col.querySelectorAll('.s2-button').forEach((btn) => {
        const p = btn.closest('p');
        if (p && col.contains(p)) buttons.append(p);
      });
      const content = make('div', { class: 'table-heading-content' });
      const action = make('div', { class: 'table-heading-action' });
      [...col.children].forEach((e) => {
        if (e === buttons) return;
        if (e.classList.contains('table-heading-pricing') && isPriceBottom) action.append(e);
        else content.append(e);
      });
      action.append(buttons);
      col.append(content, action);
      if (!isTrackingSet) {
        const text = [...col.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
        if (text) {
          content.append(make('p', { class: 'table-heading-title' }, text.textContent));
          text.remove();
        }
      }
    }

    const title = col.querySelector('.table-heading-title');
    if (title) {
      if (!title.id) title.id = `t${tableIndex}-c${i + 1}-header`;
      const body = col.querySelector('.table-heading-body:not(.s2-action-area)');
      if (body && !body.id) body.id = `${title.id}-body`;
      const pricing = col.querySelector('.table-heading-pricing');
      if (pricing && !pricing.id) pricing.id = `${title.id}-pricing`;
      const describedBy = `${body?.id ?? ''} ${pricing?.id ?? ''}`.trim();
      if (describedBy) title.setAttribute('aria-describedby', describedBy);
      col.setAttribute('role', 'columnheader');
    }
    col.querySelectorAll(HEADINGS).forEach((h) => h.setAttribute('role', 'paragraph'));
  });
}

function handleEqualHeight(el) {
  const heading = el.querySelector('.table-row-heading');
  if (!heading) return;
  const win = el.ownerDocument.defaultView;
  const heights = [];
  const cols = [...heading.children];
  cols.forEach(({ children }) => {
    [...children].forEach((part, i) => {
      part.style.setProperty('--_min-h', 'auto');
      const style = win.getComputedStyle(part);
      const padTop = parseFloat(style.paddingTop) || 0;
      const padBottom = parseFloat(style.paddingBottom) || 0;
      const h = part.clientHeight - padTop - padBottom;
      if (!heights[i] || h > heights[i]) heights[i] = h;
    });
  });
  cols.forEach(({ children }) => {
    [...children].forEach((part, i) => {
      if (part.clientHeight > 0) part.style.setProperty('--_min-h', heights[i] > 0 ? `${heights[i]}px` : 'auto');
    });
  });
}

function handleAddOnContent(el, make) {
  const addOns = [...el.querySelectorAll('.table-row-title')].filter((t) => textOf(t).toUpperCase().includes('ADDON'));
  if (!addOns.length) return;
  el.classList.add('table-has-addon');
  const headingRow = el.querySelector('.table-row-heading');
  addOns.forEach((addOn) => {
    const addOnRow = addOn.parentElement;
    addOnRow.remove();
    const [position, order, style] = textOf(addOn).split('-')
      .filter((k) => k.toUpperCase() !== 'ADDON').map((k) => k.toLowerCase());
    if (!position || !order || !headingRow) return;
    [...headingRow.children].forEach((headCol) => {
      const colIndex = Number(headCol.dataset.colIndex);
      if (colIndex <= 1) return;
      const column = [...addOnRow.children].find((c) => Number(c.dataset.colIndex) === colIndex);
      if (!column) return;
      let content = [...column.childNodes];
      const icon = column.querySelector('.icon');
      if (style === 'label' && icon) content = [make('span', null, content.filter((n) => n !== icon)), icon];
      const tag = make('div', { class: `table-addon table-addon-${position}-${order}` }, content);
      if (style) tag.classList.add(`table-addon-${style}`);
      const target = headCol.querySelector(`.${ADDON_TARGET[position] || `table-heading-${position}`}`);
      target?.classList.add(`table-has-addon-${position}-${order}`);
      target?.insertAdjacentElement(order === 'before' ? 'beforebegin' : 'afterend', tag);
    });
  });
  setTimeout(() => handleEqualHeight(el), 0);
  el.addEventListener('mas:resolved', debounce(() => handleEqualHeight(el)));
}

function handleHighlight(el, rows, isHighlight, tableIndex, make) {
  const [first, second] = rows;
  if (!first) return;
  const cellsOf = (row) => [...(row?.children || [])];
  let headingCols;
  if (isHighlight && second) {
    first.classList.add('table-row-highlight');
    first.setAttribute('aria-hidden', 'true');
    second.classList.add('table-row-heading');
    headingCols = cellsOf(second);
    cellsOf(first).forEach((col, i) => {
      col.classList.add('table-cell-highlight', 'col-highlight');
      const label = textOf(col);
      if (label) {
        headingCols[i]?.classList.add('table-cell-no-rounded');
        headingCols[i]?.prepend(make('div', { class: 'table-highlight-text' }, label));
      } else {
        col.classList.add('table-cell-empty');
      }
    });
  } else {
    headingCols = cellsOf(first);
    first.classList.add('table-row-heading');
  }
  handleHeading(el, headingCols, tableIndex, make);
  handleAddOnContent(el, make);
  el.dispatchEvent(new el.ownerDocument.defaultView.Event(HIGHLIGHT_LOADED));
}

function handleTitleText(cell, make) {
  if (!cell || cell.querySelector('.table-cell-title')) return;
  const text = make('span', { class: 'table-cell-title' });
  while (cell.firstChild) text.append(cell.firstChild);
  const tip = text.querySelector('.table-tooltip-wrap');
  if (tip) cell.append(tip);
  const firstIcon = text.querySelector('.icon:first-child');
  let node = text;
  if (firstIcon) {
    node = make('span', { class: 'table-cell-title-row' });
    node.append(firstIcon, text);
  }
  const quote = node.querySelector('blockquote');
  if (quote) {
    const div = make('div', { class: 'table-cell-quote' });
    while (quote.firstChild) div.append(quote.firstChild);
    quote.replaceWith(div);
  }
  cell.insertBefore(node, cell.firstChild);
}

function handleSection({
  row, index, rows, cols, isMerch, isHighlight, make,
}) {
  const previousRow = rows[index - 1];
  const nextRow = rows[index + 1];
  const nextCols = [...(nextRow?.children || [])];

  if (row.querySelector('hr') && nextRow) {
    row.classList.add('table-divider');
    row.removeAttribute('role');
    nextRow.classList.add('table-section-head');
    const title = nextCols[0];
    if (isMerch && nextCols.length) {
      nextCols.forEach((c) => {
        c.classList.add('table-section-head-title');
        c.setAttribute('role', 'rowheader');
      });
    } else if (title) {
      handleTitleText(title, make);
      title.classList.add('table-section-head-title');
      title.setAttribute('role', 'rowheader');
    }
  } else if (previousRow?.querySelector('hr') && nextRow) {
    nextRow.classList.add('table-section-row');
    if (!isMerch && nextCols[0]) {
      nextCols[0].classList.add('table-row-title');
      nextCols[0].setAttribute('role', 'rowheader');
    }
  } else if (index !== 0 && (!isHighlight || index !== 1)) {
    row.classList.add('table-section-row');
    cols.forEach((col) => {
      if (col.querySelector('a') && !col.querySelector('span')) col.append(make('span', { class: 'table-cell-text' }, [...col.childNodes]));
    });
    if (isMerch && !row.classList.contains('table-divider')) {
      cols.forEach((col) => {
        col.classList.add('table-cell-merch');
        const children = [...col.children];
        const content = make('div', { class: 'table-merch-content' });
        if (children.length) {
          children.forEach((child) => { if (!child.querySelector('.icon')) content.append(child); });
          col.prepend(content);
        } else if (textOf(col)) {
          const p = make('p', { class: 'table-merch-text' }, textOf(col));
          col.textContent = '';
          content.append(p);
          col.append(content);
        }
      });
    } else if (cols[0]) {
      handleTitleText(cols[0], make);
      cols[0].classList.add('table-row-title');
      cols[0].setAttribute('role', 'rowheader');
    }
  }

  cols.forEach((col) => {
    if (col.querySelector(':scope > :is(strong, em, del, code, sub, sup)')
      && col.childNodes.length > 1 && !col.querySelector('picture')) {
      col.replaceChildren(make('p', {}, [...col.childNodes]));
    }
  });
}

function toggleSection(toggle, open) {
  const head = toggle.closest('.table-row');
  toggle.setAttribute('aria-expanded', String(open));
  head.classList.toggle('table-section-collapsed', !open);
  for (let row = head.nextElementSibling; row && !row.classList.contains('table-divider'); row = row.nextElementSibling) {
    if (row.classList.contains('table-row')) row.hidden = !open;
  }
}

function collapseSections(el, make) {
  let first = true;
  el.querySelectorAll('.table-section-head').forEach((head) => {
    const title = head.querySelector('.table-section-head-title');
    if (!title) return;
    let toggle = title.querySelector(':scope > .table-expand');
    if (!toggle) {
      toggle = make('button', { type: 'button', class: 'table-expand', 'aria-label': LABELS.toggle });
      title.prepend(toggle);
    }
    toggleSection(toggle, first);
    first = false;
  });
}

function setExpandEvents(el) {
  el.querySelectorAll('.table-expand').forEach((toggle) => {
    const title = toggle.parentElement;
    title.classList.add('table-section-head-toggles');
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSection(toggle, toggle.getAttribute('aria-expanded') !== 'true');
    });
    title.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      toggle.click();
    });
  });
}

function formatMerchTable(el) {
  const rows = [...el.querySelectorAll('.table-row')];
  const colCount = rows[0]?.querySelectorAll(':scope > .table-cell').length || 0;
  for (let i = colCount; i > 0; i -= 1) {
    const cols = [...el.querySelectorAll(`.table-cell.col-${i}`)];
    for (let j = rows.length - 1; j >= 0; j -= 1) {
      const col = cols[j];
      if (col && !textOf(col) && col.children.length === 0) {
        col.classList.add('table-cell-no-borders');
      } else {
        col?.classList.add('table-cell-border-bottom');
        break;
      }
    }
  }
}

function handleHovering(el) {
  const isMerch = el.classList.contains('merch');
  const colCount = el.querySelector('.table-row')?.childElementCount || 0;
  const heads = el.querySelectorAll('.table-section-head');
  const lastHead = heads[heads.length - 1];
  const clear = (cols) => cols.forEach((c) => c.classList.remove('table-col-hover', 'table-col-hover-no-top', 'table-col-hover-bottom'));
  for (let i = isMerch ? 1 : 2; i <= colCount; i += 1) {
    const cols = [...el.querySelectorAll(`.table-cell.col-${i}`)];
    cols.forEach((cell) => {
      cell.addEventListener('mouseover', () => {
        clear(cols);
        const headingRow = el.querySelector('.table-row-heading');
        const lastCollapsed = lastHead?.querySelector('.table-expand')?.getAttribute('aria-expanded') === 'false';
        cols.forEach((col) => {
          if (col.classList.contains('table-cell-highlight') && textOf(col)) {
            headingRow?.querySelector(`.col-${i}`)?.classList.add('table-col-hover-no-top');
          }
          if (el.classList.contains('collapse') && lastCollapsed) lastHead.querySelector(`.col-${i}`)?.classList.add('table-col-hover-bottom');
          col.classList.add('table-col-hover');
        });
      });
      cell.addEventListener('mouseout', () => clear(cols));
    });
  }
}

function stickRows(el, state) {
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const highlight = el.querySelector('.table-row-highlight');
  const heading = el.querySelector('.table-row-heading');
  if (!heading) return;
  const top = stickyTopOffset(doc);
  if (highlight) {
    highlight.style.setProperty('--_sticky-top', `${top}px`);
    highlight.classList.add('table-row-sticky-top');
  } else {
    heading.classList.add('table-row-sticky-top');
  }
  const offset = top + (highlight ? highlight.offsetHeight : 0);
  heading.style.setProperty('--_sticky-top', `${offset}px`);
  let intercept = el.querySelector('.table-intercept');
  if (!intercept) intercept = el.ownerDocument.createElement('div');
  intercept.className = 'table-intercept';
  intercept.setAttribute('aria-hidden', 'true');
  intercept.setAttribute('data-observer-intercept', '');
  heading.before(intercept);
  state.observer?.disconnect();
  if (typeof win?.IntersectionObserver !== 'function') return;
  state.observer = new win.IntersectionObserver(([entry]) => {
    heading.classList.toggle('table-row-stuck', !entry.isIntersecting);
  }, { rootMargin: `-${offset}px` });
  state.observer.observe(intercept);
}

function handleStickyHeader(el) {
  if (!el.classList.value.includes('sticky')) return;
  const win = el.ownerDocument.defaultView;
  setTimeout(() => {
    const heading = el.querySelector('.table-row-heading');
    if (!heading || !win?.innerHeight) return;
    el.classList.toggle('table-cancel-sticky', !(heading.offsetHeight / win.innerHeight < 0.45));
  });
}

function applyLayout(el, grid, titles, state, make) {
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const isMerch = el.classList.contains('merch');
  const device = deviceBySize(win);
  const rows = () => [...grid.querySelectorAll(':scope > .table-row')];
  const widest = Math.max(1, ...rows().map((r) => r.querySelectorAll(':scope > .table-cell').length));

  const setRowStyle = () => {
    if (isMerch) return;
    const data = Math.max(1, widest - 1);
    grid.style.setProperty('--_data-cols', String(device === 'MOBILE' ? Math.min(data, 2) : data));
  };

  const filterChange = (e) => {
    const values = [...el.querySelectorAll('.table-filter')].map((f) => parseInt(f.value, 10));
    el.querySelectorAll('.table-hide-mobile, .table-force-last').forEach((c) => c.classList.remove('table-hide-mobile', 'table-force-last'));
    el.querySelectorAll('.table-cell[data-cloned]').forEach((c) => c.remove());
    const keep = isMerch ? [values[0] + 1, values[1] + 1] : [1, values[0] + 1, values[1] + 1];
    el.querySelectorAll('.table-cell').forEach((c) => {
      const n = Number(c.dataset.colIndex);
      if (!keep.includes(n) || (!isMerch && c.classList.contains('table-cell-no-borders'))) c.classList.add('table-hide-mobile');
    });
    rows().forEach((row) => {
      const a = row.querySelector(`:scope > .col-${values[0] + 1}`);
      const b = row.querySelector(`:scope > .col-${values[1] + 1}`);
      if (a?.classList.contains('table-cell-heading')) {
        a.classList.remove('table-round-end');
        a.classList.add('table-round-start');
      }
      if (b?.classList.contains('table-cell-heading')) {
        b.classList.remove('table-round-start');
        b.classList.add('table-round-end');
      }
      b?.classList.add('table-force-last');
    });
    if (values[0] === values[1]) {
      rows().forEach((row) => {
        const col = row.querySelector(`:scope > .col-${values[0] + 1}`);
        if (!col) return;
        const clone = col.cloneNode(true);
        clone.setAttribute('data-cloned', 'true');
        [clone, ...clone.querySelectorAll('[id]')].forEach((n) => n.removeAttribute('id'));
        clone.querySelectorAll('[aria-describedby]').forEach((n) => n.removeAttribute('aria-describedby'));
        col.classList.remove('table-force-last');
        if (col.classList.contains('table-cell-heading')) {
          col.classList.remove('table-round-end');
          col.classList.add('table-round-start');
          clone.classList.remove('table-round-start');
          clone.classList.add('table-round-end');
        }
        row.append(clone);
      });
    }
    setRowStyle();
    if (isStickyHeader(el)) stickRows(el, state);
    if (e) handleEqualHeight(el);
  };

  const mobile = () => {
    el.dispatchEvent(new win.Event(HIGHLIGHT_LOADED));
    const headings = [...el.querySelectorAll('.table-row-heading > .table-cell')].filter((h) => textOf(h)).length;
    el.querySelectorAll('.table-hide-mobile').forEach((c) => c.classList.remove('table-hide-mobile'));
    if (isMerch && headings >= 2) {
      el.querySelectorAll('.table-cell:not(.col-1, .col-2)').forEach((c) => c.classList.add('table-hide-mobile'));
    } else if (headings >= 3) {
      el.querySelectorAll('.table-cell:not(.col-1, .col-2, .col-3), .table-cell.table-cell-no-borders').forEach((c) => c.classList.add('table-hide-mobile'));
    }
    if ((!isMerch && !el.querySelector('.col-3')) || (isMerch && !el.querySelector('.col-2'))) return;
    if (el.querySelector(':scope > .table-filters') || headings <= 2) return;
    const filters = make('div', { class: 'table-filters' });
    const select = make('select', { class: 'table-filter', 'aria-label': LABELS.column });
    titles.forEach(({ index, text, colIndex }) => {
      if (!isMerch && colIndex === 1) return;
      select.append(make('option', { value: index }, text));
    });
    const second = select.cloneNode(true);
    select.dataset.filterIndex = '0';
    second.dataset.filterIndex = '1';
    const visible = [...el.querySelectorAll('.table-row-heading > .table-cell-heading:not(.table-cell-empty)')]
      .filter((c) => isMerch || !c.classList.contains('col-1'));
    const pick = (s, cell) => {
      const option = cell ? s.querySelectorAll('option')[Number(cell.dataset.colIndex) - (isMerch ? 1 : 2)] : null;
      if (option) option.selected = true;
    };
    pick(select, visible[0]);
    pick(second, visible[1]);
    [select, second].forEach((s) => {
      const wrap = make('div', { class: 'table-filter-wrapper' }, s);
      s.addEventListener('change', filterChange);
      filters.append(wrap);
    });
    el.prepend(filters);
    filterChange();
  };

  el.querySelectorAll('.table-cell[data-cloned]').forEach((c) => c.remove());
  if (device === 'MOBILE' || (isMerch && device === 'TABLET')) {
    mobile();
  } else {
    el.querySelectorAll('.table-hide-mobile, .table-round-start, .table-round-end, .table-force-last')
      .forEach((c) => c.classList.remove('table-hide-mobile', 'table-round-start', 'table-round-end', 'table-force-last'));
    el.querySelectorAll('.table-filter').forEach((s, i) => {
      const option = s.querySelectorAll('option')[i];
      if (option) option.selected = true;
    });
  }
  el.dispatchEvent(new win.Event(HIGHLIGHT_LOADED));
  setRowStyle();
}

function decorateTable(el, ctx) {
  const { make } = ctx;
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  el.classList.add('table');
  pageShims(el, make);
  decorateIcons(el, make);

  const tableIndex = nextTableIndex(doc);
  const isMerch = el.classList.contains('merch');
  if (el.parentElement?.classList.contains('section')) el.parentElement.classList.add(`table-${isMerch ? 'merch-' : ''}section`);
  const rows = [...el.children];
  const grid = make('div', { class: 'table-grid', role: 'table' });
  grid.append(...rows);
  el.append(grid);
  const isHighlight = el.classList.contains('highlight');
  const isCollapse = el.classList.contains('collapse') && !isMerch;

  rows.forEach((row, index) => {
    row.classList.add('table-row');
    row.setAttribute('role', 'row');
    const cols = [...row.children];
    cols.forEach((col, cdx) => {
      col.dataset.colIndex = String(cdx + 1);
      col.classList.add('table-cell', 'col', `col-${cdx + 1}`);
      col.setAttribute('role', col.classList.contains('table-section-head-title') ? 'columnheader' : 'cell');
    });
    handleSection({
      row, index, rows, cols, isMerch, isHighlight, make,
    });
  });
  handleHighlight(el, rows, isHighlight, tableIndex, make);
  if (isCollapse) collapseSections(el, make);
  if (!isMerch && !el.querySelector('.table-row-heading > .col-2')) el.classList.add('table-single-column');
  handleStickyHeader(el);
  if (isMerch) formatMerchTable(el);
  initTooltips(el);

  const titles = [...el.querySelectorAll('.table-row-heading > .table-cell-heading')].map((cell, index) => ({ index, colIndex: Number(cell.dataset.colIndex), text: textOf(cell.querySelector('.table-heading-title')) })).filter((t) => t.text);

  const state = { observer: null, device: null, decorated: false };
  const layout = () => {
    applyLayout(el, grid, titles, state, make);
    const sticky = isStickyHeader(el);
    el.classList.toggle('table-sticky-on', sticky);
    if (sticky) stickRows(el, state);
  };
  const handleTable = () => {
    if (state.decorated) return;
    state.decorated = true;
    state.device = deviceBySize(win);
    layout();
    handleHovering(el);
    setExpandEvents(el);
    win?.addEventListener('resize', () => {
      if (el.classList.contains('table-has-addon')) handleEqualHeight(el);
      handleStickyHeader(el);
      if (state.device === deviceBySize(win)) return;
      state.device = deviceBySize(win);
      layout();
    });
  };

  win?.addEventListener(DEFERRED, handleTable, true);
  if (typeof win?.IntersectionObserver === 'function') {
    const observer = new win.IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        handleTable();
      }
    });
    observer.observe(el);
  } else {
    handleTable();
  }
  if (typeof win?.ResizeObserver === 'function') new win.ResizeObserver(debounce(() => handleStickyHeader(el))).observe(el);
  win?.addEventListener(TAB_CHANGED, () => handleStickyHeader(el));
}

export const MEMBERS = {
  table: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateTable,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'table' });
}
