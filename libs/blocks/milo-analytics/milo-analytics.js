// eslint-disable-next-line import/no-unresolved
import { Chart } from 'https://esm.sh/chart.js/auto';
import getRumData from './rum-data-formatter.js';

const COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
];
const MAX_DROPDOWN = 200;
const BAR_H = 28;
const MIN_H = 200;

const fmt = (n) => (n ?? 0).toLocaleString('en-US');
const locLabel = (l) => (l === '' ? 'en-US (default)' : l);
const palette = (n) => Array.from({ length: n }, (_, i) => COLORS[i % COLORS.length]);
const barHeight = (count) => `${Math.max(MIN_H, count * BAR_H + 60)}px`;

function toPath(url) {
  try { return new URL(url).pathname; } catch { return url; }
}

function desc(obj) {
  return Object.entries(obj).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
}

/** Format chart title: "Name (3 of 10)" or "Name (10 blocks)" */
function chartTitle(name, shown, total, unit) {
  if (shown < total) return `${name} (${fmt(shown)} of ${fmt(total)})`;
  return `${name} (${fmt(total)} ${unit}${total !== 1 ? 's' : ''})`;
}

/** Map an array into MultiSelect-compatible { value, display } options */
function toOpts(arr, displayFn) {
  return arr.map((v) => ({ value: v, display: displayFn ? displayFn(v) : v }));
}

/** Minimal DOM builder */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2), v);
      } else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else el.setAttribute(k, v);
    }
  }
  for (const c of kids.flat()) {
    if (c != null) el.append(c);
  }
  return el;
}
class MultiSelect {
  constructor(label, opts, onChange) {
    this.label = label;
    this.opts = opts;
    this.sel = new Set();
    this.onChange = onChange;
    this.isOpen = false;
    this.el = this.build();
  }

  build() {
    this.inp = h('input', { type: 'text', class: 'ms-input', placeholder: this.label });
    this.bdg = h('span', { class: 'ms-badge', style: { display: 'none' } });
    this.row = h(
      'div',
      { class: 'ms-input-row' },
      this.inp,
      this.bdg,
      h('span', { class: 'ms-arrow' }, '▾'),
    );
    this.dd = h('div', { class: 'ms-dropdown', style: { display: 'none' } });
    this.wrap = h('div', { class: 'ms-wrapper' }, this.row, this.dd);

    this.inp.addEventListener('focus', () => this.open());
    this.inp.addEventListener('input', () => this.renderItems());
    this.row.addEventListener('click', (e) => {
      if (e.target !== this.inp) {
        if (this.isOpen) this.close();
        else this.inp.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!this.wrap.contains(e.target)) this.close();
    });
    return this.wrap;
  }

  renderItems() {
    const q = this.inp.value.toLowerCase();
    const list = this.opts.filter((o) => o.display.toLowerCase().includes(q));
    this.dd.innerHTML = '';

    if (!list.length) {
      this.dd.append(h('div', { class: 'ms-empty' }, 'No matches'));
      return;
    }

    const sorted = [...list].sort(
      (a, b) => (this.sel.has(a.value) ? 0 : 1) - (this.sel.has(b.value) ? 0 : 1),
    );

    for (const o of sorted.slice(0, MAX_DROPDOWN)) {
      const cb = h('input', { type: 'checkbox' });
      cb.checked = this.sel.has(o.value);
      cb.addEventListener('change', () => {
        if (cb.checked) this.sel.add(o.value);
        else this.sel.delete(o.value);
        this.updateBadge();
        this.onChange();
      });
      this.dd.append(h('label', { class: 'ms-item' }, cb, h('span', {}, o.display)));
    }

    if (list.length > MAX_DROPDOWN) {
      this.dd.append(
        h('div', { class: 'ms-more' }, `+ ${list.length - MAX_DROPDOWN} more — type to search`),
      );
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.dd.style.display = 'block';
    this.renderItems();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.dd.style.display = 'none';
    this.inp.value = '';
  }

  updateBadge() {
    this.bdg.style.display = this.sel.size ? 'inline-block' : 'none';
    this.bdg.textContent = this.sel.size;
  }

  selected() { return [...this.sel]; }

  clear() {
    this.sel.clear();
    this.updateBadge();
    this.inp.value = '';
  }

  toggle(v) {
    if (this.sel.has(v)) this.sel.delete(v);
    else this.sel.add(v);
    this.updateBadge();
    if (this.isOpen) this.renderItems();
    this.onChange();
  }

  setOptions(newOpts) {
    this.opts = newOpts;
    const valid = new Set(newOpts.map((o) => o.value));
    for (const v of this.sel) {
      if (!valid.has(v)) this.sel.delete(v);
    }
    this.updateBadge();
    if (this.isOpen) this.renderItems();
  }
}

function extractOpts(data) {
  const blocks = new Set();
  const projects = new Set();
  const locales = new Set();
  const pages = new Set();

  for (const [block, projData] of Object.entries(data)) {
    blocks.add(block);
    for (const [proj, locData] of Object.entries(projData)) {
      if (proj !== 'totalViews') {
        projects.add(proj);
        for (const [loc, pgData] of Object.entries(locData)) {
          locales.add(loc);
          for (const pg of Object.keys(pgData)) pages.add(pg);
        }
      }
    }
  }

  const s = (a, b) => a.localeCompare(b);
  return {
    blocks: [...blocks].sort(s),
    projects: [...projects].sort(s),
    locales: [...locales].sort((a, b) => {
      if (a === '') return -1;
      if (b === '') return 1;
      return s(a, b);
    }),
    pages: [...pages].sort(s),
  };
}

/** Traverse filtered data: block → project → locale → page → views */
function walk(data, sB, sP, sL, sPg, fn) {
  const bks = sB.length ? sB : Object.keys(data);
  for (const block of bks) {
    if (data[block]) {
      for (const [proj, locData] of Object.entries(data[block])) {
        if (proj !== 'totalViews' && (!sP.length || sP.includes(proj))) {
          for (const [loc, pgData] of Object.entries(locData)) {
            if (!sL.length || sL.includes(loc)) {
              for (const [pg, v] of Object.entries(pgData)) {
                if (!sPg.length || sPg.includes(pg)) fn(block, proj, loc, pg, v);
              }
            }
          }
        }
      }
    }
  }
}

/** Factory: create a totals-by-key function powered by walk() */
function makeSummer(pick) {
  return (data, sB, sP, sL, sPg) => {
    const r = {};
    walk(data, sB, sP, sL, sPg, (b, p, l, pg, v) => {
      const k = pick(b, p, l, pg);
      r[k] = (r[k] || 0) + v;
    });
    return r;
  };
}

const sumByBlock = makeSummer((b) => b);
const projTotals = makeSummer((_b, p) => p);
const locTotals = makeSummer((_b, _p, l) => l);
const pgTotals = makeSummer((_b, _p, _l, pg) => pg);

function blockTotals(data, sB, sP, sL, sPg) {
  /* Fast path: no project/locale/page filter → use pre-computed totals */
  if (!sP.length && !sL.length && !sPg.length) {
    const bks = sB.length ? sB : Object.keys(data);
    const r = {};
    bks.forEach((b) => {
      if (data[b]) r[b] = data[b].totalViews?.views?.allLocales || 0;
    });
    return r;
  }
  return sumByBlock(data, sB, sP, sL, sPg);
}

/** Collect page URLs matching the current block/project/locale filters */
function getFilteredPages(data, sB, sP, sL) {
  const pages = new Set();
  walk(data, sB, sP, sL, [], (_b, _p, _l, pg) => pages.add(pg));
  return [...pages].sort((a, b) => a.localeCompare(b));
}

/** Create a titled chart container with canvas; returns { title, cv, wrap, box } */
function chartBox(fixedHeight) {
  const title = h('h3', { class: 'ma-chart-title' });
  const cv = h('canvas');
  const style = fixedHeight ? { height: fixedHeight } : {};
  const wrap = h('div', { class: 'ma-canvas-wrap', style });
  wrap.append(cv);
  return { title, cv, wrap, box: h('div', { class: 'ma-chart-box' }, title, wrap) };
}

function makeChart(canvas, horiz) {
  const valAxis = { ticks: { callback: (v) => fmt(v) }, grid: { color: '#f0f0f0' } };
  const catAxis = { ticks: { font: { size: 12 } }, grid: { display: false } };

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{ label: 'Views', data: [], backgroundColor: [], borderRadius: 3 }],
    },
    options: {
      indexAxis: horiz ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${fmt(horiz ? c.parsed.x : c.parsed.y)} views` } },
      },
      scales: {
        x: horiz ? { ...valAxis } : { ...catAxis },
        y: horiz ? { ...catAxis } : { ...valAxis },
      },
    },
  });
}

function feed(chart, labels, values) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = palette(labels.length);
  chart.update();
}

function showLoader() {
  if (!document.getElementById('ma-spin-style')) {
    const s = document.createElement('style');
    s.id = 'ma-spin-style';
    s.textContent = '@keyframes ma-spin { to { transform: rotate(360deg); } }';
    document.head.append(s);
  }

  const overlay = h('div', {
    style: {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: '#fff',
      zIndex: '9999',
      color: '#666',
      fontSize: '15px',
    },
  }, h('div', {
    style: {
      width: '36px',
      height: '36px',
      border: '3px solid #e0e0e0',
      borderTopColor: '#4e79a7',
      borderRadius: '50%',
      animation: 'ma-spin 0.7s linear infinite',
    },
  }), h('p', { style: { margin: '0' } }, 'Loading RUM data…'));

  document.body.append(overlay);
  return overlay;
}

export default async function init(el) {
  el.innerHTML = '';
  const loader = showLoader();
  const data = await getRumData();
  loader.remove();
  el.innerHTML = '';

  const opts = extractOpts(data);

  let fBlock;
  let fProj;
  let fLoc;
  let fPage;
  let mainChart;
  let detailEl;
  let dProjChart;
  let dLocChart;
  let dPgChart;
  let dProjTitle;
  let dLocTitle;
  let dPgTitle;
  let dPgWrap;
  let chartArea;

  function ensureDetail() {
    if (detailEl) return;

    const proj = chartBox('300px');
    const loc = chartBox('300px');
    const pg = chartBox();

    dProjTitle = proj.title;
    dLocTitle = loc.title;
    dPgTitle = pg.title;
    dPgWrap = pg.wrap;

    detailEl = h(
      'div',
      { class: 'ma-detail-grid' },
      proj.box,
      loc.box,
      pg.box,
    );
    chartArea.append(detailEl);

    dProjChart = makeChart(proj.cv, false);
    dLocChart = makeChart(loc.cv, false);
    dPgChart = makeChart(pg.cv, true);
  }

  function destroyDetail() {
    if (!detailEl) return;
    [dProjChart, dLocChart, dPgChart].forEach((c) => c.destroy());
    detailEl.remove();
    detailEl = null;
    dProjChart = null;
    dLocChart = null;
    dPgChart = null;
  }

  const main = chartBox();

  function updateDashboard() {
    const sB = fBlock.selected();
    const sP = fProj.selected();
    const sL = fLoc.selected();
    const sPg = fPage.selected();

    /* Block Distribution */
    const bt = desc(blockTotals(data, sB, sP, sL, sPg));
    main.title.textContent = chartTitle('Block Distribution', bt.length, bt.length, 'block');
    main.wrap.style.height = barHeight(bt.length);
    feed(mainChart, bt.map(([n]) => n), bt.map(([, v]) => v));

    if (!sB.length) { destroyDetail(); return; }
    ensureDetail();

    /* Project Distribution */
    const pt = desc(projTotals(data, sB, sP, sL, sPg));
    dProjTitle.textContent = chartTitle('Project Distribution', pt.length, pt.length, 'project');
    feed(dProjChart, pt.map(([n]) => n), pt.map(([, v]) => v));

    /* Top Locale Distribution */
    const lt = desc(locTotals(data, sB, sP, sL, sPg));
    const topLoc = lt.slice(0, 20);
    dLocTitle.textContent = chartTitle('Top Locale Distribution', topLoc.length, lt.length, 'locale');
    feed(dLocChart, topLoc.map(([n]) => locLabel(n)), topLoc.map(([, v]) => v));

    /* Top Pages */
    const pgt = desc(pgTotals(data, sB, sP, sL, sPg));
    const topPg = pgt.slice(0, 30);
    dPgTitle.textContent = chartTitle('Top Pages', topPg.length, pgt.length, 'page');
    dPgWrap.style.height = barHeight(topPg.length);
    feed(dPgChart, topPg.map(([u]) => toPath(u)), topPg.map(([, v]) => v));
  }

  const breadcrumbsEl = h('div', { class: 'ma-breadcrumbs', style: { display: 'none' } });

  function renderBreadcrumbs() {
    breadcrumbsEl.innerHTML = '';
    const groups = [
      { label: 'Blocks', ms: fBlock, show: (v) => v },
      { label: 'Projects', ms: fProj, show: (v) => v },
      { label: 'Locales', ms: fLoc, show: locLabel },
      { label: 'Pages', ms: fPage, show: toPath },
    ];

    let hasAny = false;
    for (const { label, ms, show } of groups) {
      const sel = ms.selected();
      if (sel.length) {
        if (hasAny) breadcrumbsEl.append(h('span', { class: 'ma-bc-sep' }, '›'));
        hasAny = true;
        breadcrumbsEl.append(h('span', { class: 'ma-bc-label' }, `${label}:`));
        for (const v of sel) {
          breadcrumbsEl.append(h(
            'span',
            { class: 'ma-bc-chip' },
            show(v),
            h('button', { class: 'ma-bc-remove', onclick: () => ms.toggle(v) }, '×'),
          ));
        }
      }
    }
    breadcrumbsEl.style.display = hasAny ? 'flex' : 'none';
  }

  function refresh() {
    const fp = getFilteredPages(data, fBlock.selected(), fProj.selected(), fLoc.selected());
    fPage.setOptions(toOpts(fp, toPath));
    renderBreadcrumbs();
    updateDashboard();
  }

  fBlock = new MultiSelect('Blocks', toOpts(opts.blocks), refresh);
  fProj = new MultiSelect('Projects', toOpts(opts.projects), refresh);
  fLoc = new MultiSelect('Locales', toOpts(opts.locales, locLabel), refresh);
  fPage = new MultiSelect('Pages', toOpts(opts.pages, toPath), refresh);

  const resetBtn = h('button', {
    class: 'ma-reset-btn',
    onclick: () => {
      fBlock.clear();
      fProj.clear();
      fLoc.clear();
      fPage.clear();
      refresh();
    },
  }, 'Reset filters');

  const filterBar = h(
    'div',
    { class: 'ma-filter-bar' },
    fBlock.el,
    fProj.el,
    fLoc.el,
    fPage.el,
    resetBtn,
  );

  chartArea = h('div', { class: 'ma-chart-area' }, main.box);
  el.append(filterBar, breadcrumbsEl, chartArea);

  mainChart = makeChart(main.cv, true);
  mainChart.options.onClick = (_e, els) => {
    if (els.length) fBlock.toggle(mainChart.data.labels[els[0].index]);
  };

  refresh();
}
