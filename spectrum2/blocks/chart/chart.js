import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { textOf } from '../_shared/dom.js';
import {
  PALETTE, chartTypeOf, authoredColourOf, authoredSizeFor, getResponsiveSize, getLabelDegree,
  fetchData, chartData, processDataset, processMarkData, propertyValueCI, hasPropertyCI,
  getColors, getOverrideColors, seriesModel, pieModel, donutTitle, formatValue, listChartData,
} from '../_shared/s1-chart-data.js';
import { renderCartesian, renderPie, dataTable } from '../_shared/s1-chart-svg.js';

const CARTESIAN = ['bar', 'column', 'line', 'area'];
const PIE = ['donut', 'pie'];
const HEIGHTS = {
  cartesian: { small: 250, medium: 255, large: 300 },
  area: { small: 300, medium: 270, large: 460 },
  pie: { small: 300, medium: 400, large: 460 },
};
const KIND = {
  bar: 'Bar chart', column: 'Column chart', line: 'Line chart', area: 'Area chart', donut: 'Donut chart', pie: 'Pie chart',
};

let uid = 0;
function nextId(doc, stem) {
  let id;
  do {
    uid += 1;
    id = `${stem}-${uid}`;
  } while (doc.getElementById(id));
  return id;
}

function viewportWidth(win) {
  const w = win?.innerWidth;
  return Number.isFinite(w) && w > 0 ? w : 1280;
}

function hostWidth(node) {
  const w = node.getBoundingClientRect?.().width || node.clientWidth || 0;
  return w > 0 ? w : 600;
}

function captionFor(el, type) {
  const title = textOf(el.querySelector(':scope > .chart-title'));
  return title ? `${KIND[type] || 'Chart'} data: ${title}` : `${KIND[type] || 'Chart'} data`;
}

function legendButton(make, { name, colour, pressed, onToggle }) {
  const button = make('button', { type: 'button', class: 'chart-legend-item', 'aria-pressed': pressed ? 'true' : 'false' });
  button.append(make('span', { class: `chart-swatch chart-c-${colour}`, 'aria-hidden': 'true' }), make('span', { class: 'chart-legend-text' }, name));
  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', next ? 'true' : 'false');
    onToggle(next);
  });
  return make('li', {}, button);
}

function legendLabel(make, { name, colour }) {
  const item = make('span', { class: 'chart-legend-item chart-legend-static' });
  item.append(make('span', { class: `chart-swatch chart-c-${colour}`, 'aria-hidden': 'true' }), make('span', { class: 'chart-legend-text' }, name));
  return make('li', {}, item);
}

function srTable(make, table) {
  const wrap = make('div', { class: 'chart-data' });
  wrap.append(table);
  return wrap;
}

function drawCartesian(el, cell, ctx, { type, processed, series, colours, pointColours }) {
  const { make, doc, win } = ctx;
  const model = seriesModel(processed);
  const unit = processed.units.yAxes[0];
  const marks = type === 'line' ? processMarkData(series, processed.units) : {};
  const state = model.series.map((s, i) => ({
    ...s,
    colour: colours[i % colours.length] || PALETTE[0],
    hidden: false,
  }));
  const figure = make('div', { class: 'chart-figure' });
  const plot = make('div', { class: 'chart-plot-area' });
  figure.append(plot);
  const title = textOf(el.querySelector(':scope > .chart-title'));

  let lastWidth = 0;
  const draw = () => {
    const vw = viewportWidth(win);
    const size = getResponsiveSize(el.dataset.chartAuthoredSize, vw);
    el.dataset.responsiveSize = size;
    const width = hostWidth(plot);
    lastWidth = width;
    const heights = type === 'area' ? HEIGHTS.area : HEIGHTS.cartesian;
    plot.replaceChildren();
    renderCartesian(doc, plot, {
      type,
      categories: model.categories,
      series: state,
      pointColours,
      unit,
      labelDeg: getLabelDegree(el.classList, vw >= 1280),
      size,
      width,
      height: heights[size],
      title,
      marks,
    });
  };

  if (state.length > 1) {
    const legend = make('ul', { class: 'chart-legend', 'aria-label': 'Series' });
    state.forEach((s) => legend.append(legendButton(make, {
      name: s.name,
      colour: s.colour,
      pressed: true,
      onToggle: (shown) => { s.hidden = !shown; draw(); },
    })));
    figure.append(legend);
  } else if (state.length === 1 && state[0].name) {
    const legend = make('ul', { class: 'chart-legend', 'aria-label': 'Series' });
    legend.append(legendLabel(make, { name: state[0].name, colour: state[0].colour }));
    figure.append(legend);
  }
  const headers = (processed.dataset.source[0] || []).map(String);
  const rows = model.categories
    .map((cat, i) => [cat, ...model.series.map((s) => formatValue(s.raw[i], unit))]);
  figure.append(srTable(make, dataTable(make, { caption: captionFor(el, type), headers, rows })));
  cell.replaceChildren(figure);
  draw();
  const RO = win?.ResizeObserver;
  if (RO) {
    new RO(() => {
      if (Math.abs(hostWidth(plot) - lastWidth) > 1) draw();
    }).observe(plot);
  }
}

function drawPie(el, cell, ctx, { type, processed, series, colours, pointColours }) {
  const { make, doc, win } = ctx;
  const { items, nameHeader, valueHeader } = pieModel(processed);
  const unit = processed.units.yAxes[0];
  const state = items.map((it, i) => ({
    ...it,
    colour: (pointColours ? pointColours[i] : colours[i % colours.length]) || PALETTE[0],
    hidden: false,
  }));
  const centerTitle = type === 'donut' ? donutTitle(series) : '';
  const figure = make('div', { class: 'chart-figure' });
  const plot = make('div', { class: 'chart-plot-area' });
  figure.append(plot);
  const title = textOf(el.querySelector(':scope > .chart-title'));

  let lastWidth = 0;
  const draw = () => {
    const vw = viewportWidth(win);
    const size = getResponsiveSize(el.dataset.chartAuthoredSize, vw);
    el.dataset.responsiveSize = size;
    const width = hostWidth(plot);
    lastWidth = width;
    plot.replaceChildren();
    const { svg, center } = renderPie(doc, plot, {
      type, items: state, unit, size, width, height: HEIGHTS.pie[size], title, centerTitle,
    });
    if (center) {
      const label = center.textContent;
      svg.addEventListener('pointerover', (e) => {
        const slice = e.target.closest?.('.chart-slice');
        if (!slice) return;
        const it = state.filter((s) => !s.hidden && s.value > 0)[[...svg.querySelectorAll('.chart-slice')].indexOf(slice)];
        if (it) center.textContent = `${unit.prefix}${it.value.toLocaleString()}${unit.suffix}`;
      });
      svg.addEventListener('pointerout', () => { center.textContent = label; });
    }
  };

  if (state.length > 1) {
    const legend = make('ul', { class: 'chart-legend', 'aria-label': 'Slices' });
    state.forEach((s) => legend.append(legendButton(make, {
      name: s.name,
      colour: s.colour,
      pressed: true,
      onToggle: (shown) => { s.hidden = !shown; draw(); },
    })));
    figure.append(legend);
  }
  const rows = items.map((it) => [it.name, formatValue(it.raw, unit)]);
  figure.append(srTable(make, dataTable(make, {
    caption: captionFor(el, type),
    headers: [nameHeader, valueHeader],
    rows,
  })));
  cell.replaceChildren(figure);
  draw();
  const RO = win?.ResizeObserver;
  if (RO) {
    new RO(() => {
      if (Math.abs(hostWidth(plot) - lastWidth) > 1) draw();
    }).observe(plot);
  }
}

function drawOversizedNumber(cell, ctx, json, colour) {
  const { make } = ctx;
  const data = json?.data?.[0];
  const number = data?.number;
  if (number === undefined || number === null || number === '') return;
  const disc = make('div', { class: `chart-disc chart-c-${colour}` });
  disc.append(make('p', { class: 'chart-number' }, String(number)));
  if (data.subtitle) disc.append(make('p', { class: 'chart-number-label' }, String(data.subtitle)));
  cell.replaceChildren(disc);
}

function listMarkup(make, chart, colour) {
  if (!chart) return null;
  const hasIcon = typeof chart.list?.[0]?.image === 'string';
  const article = make('article', { class: 'chart-list' });
  const band = make('div', { class: `chart-list-title chart-c-${colour}` });
  const level = String(chart.headingLevel || '').toLowerCase();
  if (/^h[1-6]$/.test(level)) band.append(make(level, {}, String(chart.title ?? '')));
  else band.append(String(chart.title ?? ''));
  const list = make(String(chart.type || '').toLowerCase() === 'numbered' ? 'ol' : 'ul', hasIcon ? { class: 'chart-list-icons' } : {});
  (chart.list || []).forEach(({ name = '', extra, image, alt = '' }) => {
    const row = make('div', { class: 'chart-list-row' });
    const nameEl = make('div', { class: 'chart-list-name' });
    if (image) nameEl.append(make('img', { src: image, alt, loading: 'lazy' }));
    nameEl.append(String(name));
    row.append(nameEl);
    if (extra) row.append(make('span', { class: 'chart-list-extra' }, String(extra)));
    list.append(make('li', {}, row));
  });
  article.append(band, list);
  return article;
}

function drawList(cell, ctx, json, colour) {
  const { make, doc, win } = ctx;
  const data = listChartData(json);
  if (!data.length) return;
  if (data.length === 1) {
    cell.replaceChildren(listMarkup(make, data[0], colour));
    return;
  }
  const itemsId = nextId(doc, 'chart-carousel-items');
  const carousel = make('section', { class: 'chart-carousel', 'aria-roledescription': 'carousel' });
  const previous = make('button', { type: 'button', class: 'chart-carousel-button chart-carousel-previous', 'aria-controls': itemsId, 'aria-label': 'Previous Chart' });
  const next = make('button', { type: 'button', class: 'chart-carousel-button chart-carousel-next', 'aria-controls': itemsId, 'aria-label': 'Next Chart' });
  const controls = make('div', { class: 'chart-carousel-controls' }, [previous, next]);
  const items = make('div', { class: 'chart-carousel-items', id: itemsId });
  data.forEach((list, idx) => {
    const slide = make('div', {
      class: `chart-carousel-item${idx === 0 ? ' is-active' : ''}`,
      role: 'group',
      'aria-roledescription': 'slide',
      'aria-label': `${idx + 1} of ${data.length}`,
    });
    slide.append(listMarkup(make, list, colour));
    items.append(slide);
  });
  const live = make('div', { class: 'chart-carousel-live', 'aria-live': 'polite' });
  carousel.append(controls, items, live);
  cell.replaceChildren(carousel);

  let index = 0;
  let clear = null;
  const show = (i) => {
    index = i;
    [...items.children].forEach((slide, n) => slide.classList.toggle('is-active', n === i));
    live.textContent = textOf(items.children[i]?.querySelector('.chart-list-title'));
    if (clear) win?.clearTimeout?.(clear);
    clear = win?.setTimeout?.(() => { live.textContent = ''; }, 5000) ?? null;
  };
  previous.addEventListener('click', () => show(index < 1 ? data.length - 1 : index - 1));
  next.addEventListener('click', () => show(index >= data.length - 1 ? 0 : index + 1));
}

async function decorateChart(el, ctx) {
  const { make } = ctx;
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  el.classList.add('chart');
  pageShims(el, make);

  const rows = [...el.querySelectorAll(':scope > div')];
  const container = rows[2];
  const cell = container?.querySelector(':scope > div');
  rows[0]?.classList.add('chart-title');
  rows[1]?.classList.add('chart-subtitle');
  container?.classList.add('chart-plot');
  rows[3]?.classList.add('chart-footnote');
  cell?.classList.add('chart-canvas');

  const section = el.parentElement?.matches('.section') ? el.parentElement : null;
  const upNumber = section ? section.querySelectorAll(':scope > div:not(.section-metadata)').length : undefined;
  if (section) section.classList.add(`up-${upNumber}`, 'chart-section');
  const authoredSize = authoredSizeFor(upNumber);
  el.classList.add(authoredSize);
  el.dataset.chartAuthoredSize = authoredSize;
  el.dataset.responsiveSize = getResponsiveSize(authoredSize, viewportWidth(win));

  const type = chartTypeOf(el.className);
  const link = cell?.querySelector('a[href$="json"]');
  link?.remove();
  if (!type || !cell || !link) return;
  el.dataset.chartType = type;

  const authored = authoredColourOf(el.classList);
  const colour = authored || PALETTE[0];
  const fetchImpl = win && typeof win.fetch === 'function' ? win.fetch.bind(win) : null;
  const json = await fetchData(link.href, fetchImpl, doc.URL);
  const full = { ...ctx, doc, win };

  if (type === 'list') { drawList(cell, full, json, authored || 'blue'); return; }
  if (type === 'oversized-number') { drawOversizedNumber(cell, full, json, colour); return; }

  const { data, series } = chartData(json);
  if (!Array.isArray(data) || !data.length) { el.dataset.chartStatus = 'no-data'; return; }
  const processed = processDataset(data);
  const hasOverride = hasPropertyCI(processed.headers, 'color');
  const colours = getColors(authored);
  const pointColours = hasOverride ? getOverrideColors(authored, data) : null;
  const subheading = propertyValueCI(processed.headers, 'subheading');
  if (subheading) container.before(make('p', { class: 'chart-subheading' }, String(subheading)));

  const opts = { type, processed, series, colours, pointColours };
  if (CARTESIAN.includes(type)) drawCartesian(el, cell, full, opts);
  else if (PIE.includes(type)) drawPie(el, cell, full, opts);
}

export const MEMBERS = {
  chart: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateChart,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'chart' });
}
