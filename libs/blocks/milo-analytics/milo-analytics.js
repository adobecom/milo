// eslint-disable-next-line import/no-unresolved
import { Chart } from 'https://esm.sh/chart.js/auto';
import getRumData from './rum-data-formatter.js';

/* ── Constants ─────────────────────────────────────────────────────── */

const COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
  '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
];
const MAX_DROPDOWN = 200;
const BAR_H = 28;
const MIN_H = 200;

/* ── Helpers ───────────────────────────────────────────────────────── */

const fmt = (n) => (n ?? 0).toLocaleString('en-US');
const locLabel = (l) => (l === '' ? 'en-US (default)' : l);

function toPath(url) {
  try { return new URL(url).pathname; } catch { return url; }
}

function palette(n) {
  return Array.from({ length: n }, (_, i) => COLORS[i % COLORS.length]);
}

function desc(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
}

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
    if (c != null) el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

/* ── MultiSelect Component ─────────────────────────────────────────── */

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
    this.inp = h('input', {
      type: 'text',
      class: 'ms-input',
      placeholder: this.label,
    });
    this.bdg = h('span', { class: 'ms-badge', style: { display: 'none' } });
    const arrow = h('span', { class: 'ms-arrow' }, '▾');

    this.row = h('div', { class: 'ms-input-row' }, this.inp, this.bdg, arrow);
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

    /* Selected items float to top */
    const sorted = [...list].sort(
      (a, b) => (this.sel.has(a.value) ? 0 : 1) - (this.sel.has(b.value) ? 0 : 1),
    );
    const show = sorted.slice(0, MAX_DROPDOWN);

    for (const o of show) {
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

/* ── Data extraction ───────────────────────────────────────────────── */

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

/* ── Filtered page options ─────────────────────────────────────────── */

function getFilteredPages(data, sB, sP, sL) {
  const pages = new Set();
  const bks = sB.length ? sB : Object.keys(data);
  for (const block of bks) {
    if (data[block]) {
      for (const [proj, locData] of Object.entries(data[block])) {
        if (proj !== 'totalViews' && (!sP.length || sP.includes(proj))) {
          for (const [loc, pgData] of Object.entries(locData)) {
            if (!sL.length || sL.includes(loc)) {
              for (const pg of Object.keys(pgData)) pages.add(pg);
            }
          }
        }
      }
    }
  }
  return [...pages].sort((a, b) => a.localeCompare(b));
}

/* ── Filtered data computation ─────────────────────────────────────── */

function walk(data, sB, sP, sL, sPg, fn) {
  const bks = sB.length ? sB : Object.keys(data);
  for (const block of bks) {
    if (data[block]) {
      for (const [proj, locData] of Object.entries(data[block])) {
        if (proj !== 'totalViews' && (!sP.length || sP.includes(proj))) {
          for (const [loc, pgData] of Object.entries(locData)) {
            if (!sL.length || sL.includes(loc)) {
              for (const [pg, v] of Object.entries(pgData)) {
                if (!sPg.length || sPg.includes(pg)) {
                  fn(block, proj, loc, pg, v);
                }
              }
            }
          }
        }
      }
    }
  }
}

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
  const r = {};
  walk(data, sB, sP, sL, sPg, (b, _p, _l, _pg, v) => { r[b] = (r[b] || 0) + v; });
  return r;
}

function projTotals(data, sB, sP, sL, sPg) {
  const r = {};
  walk(data, sB, sP, sL, sPg, (_b, p, _l, _pg, v) => { r[p] = (r[p] || 0) + v; });
  return r;
}

function locTotals(data, sB, sP, sL, sPg) {
  const r = {};
  walk(data, sB, sP, sL, sPg, (_b, _p, l, _pg, v) => { r[l] = (r[l] || 0) + v; });
  return r;
}

function pgTotals(data, sB, sP, sL, sPg) {
  const r = {};
  walk(data, sB, sP, sL, sPg, (_b, _p, _l, pg, v) => { r[pg] = (r[pg] || 0) + v; });
  return r;
}

/* ── Chart helpers ─────────────────────────────────────────────────── */

function makeChart(canvas, horiz) {
  const valAxis = {
    ticks: { callback: (v) => fmt(v) },
    grid: { color: '#f0f0f0' },
  };
  const catAxis = {
    ticks: { font: { size: 12 } },
    grid: { display: false },
  };

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Views',
        data: [],
        backgroundColor: [],
        borderRadius: 3,
      }],
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

function calcBarHeight(count) {
  return `${Math.max(MIN_H, count * BAR_H + 60)}px`;
}

/* ── Main init ─────────────────────────────────────────────────────── */

export default async function init(el) {
  el.innerHTML = '';

  /* Loading state */
  const loading = h(
    'div',
    { class: 'ma-loading' },
    h('div', { class: 'ma-spinner' }),
    h('p', {}, 'Loading RUM data…'),
  );
  el.append(loading);

  const data = await getRumData();
  el.innerHTML = '';

  const opts = extractOpts(data);

  /* ── Detail charts (created lazily) ───────────────────────────────── */

  let detailEl = null;
  let dProjChart = null;
  let dLocChart = null;
  let dPgChart = null;
  let dProjTitle;
  let dLocTitle;
  let dPgTitle;
  let dPgWrap;
  let chartArea;

  function ensureDetail() {
    if (detailEl) return;

    /* Project */
    dProjTitle = h('h3', { class: 'ma-chart-title' });
    const projCv = h('canvas');
    const projWrap = h('div', { class: 'ma-canvas-wrap', style: { height: '300px' } });
    projWrap.append(projCv);

    /* Locale */
    dLocTitle = h('h3', { class: 'ma-chart-title' });
    const locCv = h('canvas');
    const locWrap = h('div', { class: 'ma-canvas-wrap', style: { height: '300px' } });
    locWrap.append(locCv);

    /* Top Pages */
    dPgTitle = h('h3', { class: 'ma-chart-title' });
    const pgCv = h('canvas');
    dPgWrap = h('div', { class: 'ma-canvas-wrap' });
    dPgWrap.append(pgCv);

    detailEl = h(
      'div',
      { class: 'ma-detail-grid' },
      h('div', { class: 'ma-chart-box' }, dProjTitle, projWrap),
      h('div', { class: 'ma-chart-box' }, dLocTitle, locWrap),
      h('div', { class: 'ma-chart-box' }, dPgTitle, dPgWrap),
    );

    chartArea.append(detailEl);

    dProjChart = makeChart(projCv, false);
    dLocChart = makeChart(locCv, false);
    dPgChart = makeChart(pgCv, true);
  }

  function destroyDetail() {
    if (!detailEl) return;
    dProjChart.destroy();
    dLocChart.destroy();
    dPgChart.destroy();
    detailEl.remove();
    detailEl = null;
    dProjChart = null;
    dLocChart = null;
    dPgChart = null;
  }

  /* ── Main chart + layout refs (set up after DOM is built) ─────────── */

  const mainTitle = h('h3', { class: 'ma-chart-title' });
  const mainWrap = h('div', { class: 'ma-canvas-wrap' });
  const mainCv = h('canvas');
  mainWrap.append(mainCv);
  const mainBox = h('div', { class: 'ma-chart-box' }, mainTitle, mainWrap);

  /* ── Dashboard update (defined before filters so they can ref it) ── */

  let fBlock;
  let fProj;
  let fLoc;
  let fPage;
  let mainChart;

  function updateDashboard() {
    const sB = fBlock.selected();
    const sP = fProj.selected();
    const sL = fLoc.selected();
    const sPg = fPage.selected();

    /* Main: Block Distribution */
    const bt = desc(blockTotals(data, sB, sP, sL, sPg));
    const blockCount = bt.length;
    const plural = blockCount !== 1 ? 's' : '';

    mainTitle.textContent = `Block Distribution (${fmt(blockCount)} block${plural})`;
    mainWrap.style.height = calcBarHeight(blockCount);
    feed(mainChart, bt.map(([n]) => n), bt.map(([, v]) => v));

    /* Detail charts – only when blocks are selected */
    if (sB.length) {
      ensureDetail();

      /* Project Distribution */
      const pt = desc(projTotals(data, sB, sP, sL, sPg));
      const projPlural = pt.length !== 1 ? 's' : '';
      dProjTitle.textContent = `Project Distribution (${fmt(pt.length)} project${projPlural})`;
      feed(dProjChart, pt.map(([n]) => n), pt.map(([, v]) => v));

      /* Locale Distribution (top 20) */
      const lt = desc(locTotals(data, sB, sP, sL, sPg));
      const totalLoc = lt.length;
      const topLoc = lt.slice(0, 20);

      if (topLoc.length < totalLoc) {
        dLocTitle.textContent = `Top Locale Distribution (${fmt(topLoc.length)} of ${fmt(totalLoc)})`;
      } else {
        const locPlural = totalLoc !== 1 ? 's' : '';
        dLocTitle.textContent = `Top Locale Distribution (${fmt(totalLoc)} locale${locPlural})`;
      }
      feed(dLocChart, topLoc.map(([n]) => locLabel(n)), topLoc.map(([, v]) => v));

      /* Top Pages */
      const pgt = desc(pgTotals(data, sB, sP, sL, sPg));
      const totalPg = pgt.length;
      const top = pgt.slice(0, 30);

      if (top.length < totalPg) {
        dPgTitle.textContent = `Top Pages (${fmt(top.length)} of ${fmt(totalPg)})`;
      } else {
        const pgPlural = totalPg !== 1 ? 's' : '';
        dPgTitle.textContent = `Top Pages (${fmt(totalPg)} page${pgPlural})`;
      }

      dPgWrap.style.height = calcBarHeight(top.length);
      feed(dPgChart, top.map(([u]) => toPath(u)), top.map(([, v]) => v));
    } else {
      destroyDetail();
    }
  }

  /* ── Breadcrumbs ──────────────────────────────────────────────────── */

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
        if (hasAny) {
          breadcrumbsEl.append(h('span', { class: 'ma-bc-sep' }, '›'));
        }
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

  /* ── Filters ──────────────────────────────────────────────────────── */

  function refresh() {
    /* Update page options based on block/project/locale selections */
    const filteredPgs = getFilteredPages(
      data,
      fBlock.selected(),
      fProj.selected(),
      fLoc.selected(),
    );
    fPage.setOptions(filteredPgs.map((p) => ({ value: p, display: toPath(p) })));
    renderBreadcrumbs();
    updateDashboard();
  }

  fBlock = new MultiSelect(
    'Blocks',
    opts.blocks.map((b) => ({ value: b, display: b })),
    refresh,
  );
  fProj = new MultiSelect(
    'Projects',
    opts.projects.map((p) => ({ value: p, display: p })),
    refresh,
  );
  fLoc = new MultiSelect(
    'Locales',
    opts.locales.map((l) => ({ value: l, display: locLabel(l) })),
    refresh,
  );
  fPage = new MultiSelect(
    'Pages',
    opts.pages.map((p) => ({ value: p, display: toPath(p) })),
    refresh,
  );

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

  /* ── Chart layout ─────────────────────────────────────────────────── */

  chartArea = h('div', { class: 'ma-chart-area' }, mainBox);
  el.append(filterBar, breadcrumbsEl, chartArea);

  /* ── Main chart ───────────────────────────────────────────────────── */

  mainChart = makeChart(mainCv, true);
  mainChart.options.onClick = (_e, els) => {
    if (els.length) {
      fBlock.toggle(mainChart.data.labels[els[0].index]);
    }
  };

  /* Initial render */
  refresh();
}
