import { valueAxis, barAxisMax, formatValue, donutLabel } from './s1-chart-data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const BAND_GAP = 1 / 3;
const LABEL_DISTANCE = 8;
const TICK_LENGTH = 8;
const FALLBACK_CHAR = 0.56;

const r1 = (n) => Math.round(n * 10) / 10;

export function svgNode(doc, tag, attrs = {}, text = null) {
  const node = doc.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (val === null || val === undefined || val === false) return;
    node.setAttribute(key, String(val));
  });
  if (text !== null && text !== undefined) node.textContent = String(text);
  return node;
}

function titled(doc, node, text) {
  if (text) node.append(svgNode(doc, 'title', {}, text));
  return node;
}

export function textMeasurer(doc, svg, className) {
  const probe = svgNode(doc, 'text', { class: className, x: -9999, y: -9999, 'aria-hidden': 'true' });
  svg.append(probe);
  let fontSize = 14;
  const view = doc.defaultView;
  try {
    const px = parseFloat(view?.getComputedStyle?.(probe)?.fontSize);
    if (Number.isFinite(px) && px > 0) fontSize = px;
  } catch (e) {
    fontSize = 14;
  }
  const cache = new Map();
  const measure = (text) => {
    const key = String(text);
    if (cache.has(key)) return cache.get(key);
    let width = 0;
    probe.textContent = key;
    try {
      if (typeof probe.getComputedTextLength === 'function') width = probe.getComputedTextLength();
    } catch (e) {
      width = 0;
    }
    if (!width) width = key.length * fontSize * FALLBACK_CHAR;
    cache.set(key, width);
    return width;
  };
  const done = () => probe.remove();
  return { measure, fontSize, done };
}

export function categoryInterval(labels, measure, fontSize, unitSpan, rotateDeg) {
  if (!labels.length || !(unitSpan > 0)) return 0;
  const rad = (rotateDeg * Math.PI) / 180;
  const unitW = Math.abs(unitSpan * Math.cos(rad));
  const unitH = Math.abs(unitSpan * Math.sin(rad));
  let maxW = 0;
  let maxH = 0;
  labels.forEach((label) => {
    maxW = Math.max(maxW, measure(label) * 1.3, 7);
    maxH = Math.max(maxH, fontSize * 1.3, 7);
  });
  let dw = maxW / unitW;
  let dh = maxH / unitH;
  if (Number.isNaN(dw)) dw = Infinity;
  if (Number.isNaN(dh)) dh = Infinity;
  return Math.max(0, Math.floor(Math.min(dw, dh)));
}

function axisLabel(unit) {
  return (tick) => `${unit.prefix}${tick}${unit.suffix}`;
}

function describeCartesian(spec, visible, axis) {
  const kind = { column: 'Column chart', bar: 'Bar chart', line: 'Line chart', area: 'Stacked area chart' }[spec.type];
  const names = visible.map((s) => s.name).filter(Boolean);
  const cats = spec.categories.filter((c) => c !== '');
  const parts = [`${kind}${spec.title ? `: ${spec.title}` : ''}.`];
  if (names.length) parts.push(`${names.length} series: ${names.join(', ')}.`);
  if (cats.length > 1) parts.push(`${cats.length} categories from ${cats[0]} to ${cats[cats.length - 1]}.`);
  else if (cats.length === 1) parts.push(`Category ${cats[0]}.`);
  const unit = spec.unit || { prefix: '', suffix: '' };
  if (axis) parts.push(`Axis from ${axisLabel(unit)(axis.min)} to ${axisLabel(unit)(axis.max)}.`);
  parts.push('The data table follows the chart.');
  return parts.join(' ');
}

function bandLayout(start, length, count, seriesCount, categoryGap) {
  const band = count ? length / count : length;
  const inner = band * (1 - categoryGap);
  const n = Math.max(1, seriesCount);
  const bar = inner / (n + (n - 1) * BAND_GAP);
  return { band, inner, bar, offset: (band - inner) / 2 };
}

export function renderCartesian(doc, host, spec) {
  const W = Math.max(120, Math.round(spec.width || 600));
  const H = Math.max(120, Math.round(spec.height || 350));
  const svg = svgNode(doc, 'svg', {
    class: `chart-svg chart-svg-${spec.type}`,
    viewBox: `0 0 ${W} ${H}`,
    width: W,
    height: H,
    role: 'img',
    focusable: 'false',
  });
  host.append(svg);
  const { measure, fontSize, done } = textMeasurer(doc, svg, 'chart-tick-label');
  const isBar = spec.type === 'bar';
  const isColumn = spec.type === 'column';
  const isArea = spec.type === 'area';
  const unit = spec.unit || { prefix: '', suffix: '' };
  const fmt = axisLabel(unit);
  const visible = spec.series.filter((s) => !s.hidden);
  const { categories } = spec;
  const count = categories.length;

  let extentValues = visible.flatMap((s) => s.values);
  if (isArea) {
    extentValues = categories
      .map((_, i) => visible.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  }
  const axis = valueAxis(extentValues, { max: isBar ? barAxisMax(extentValues) : null });
  const span = axis.max - axis.min || 1;

  const pad = Math.ceil(fontSize / 2) + 2;
  const tickLabels = axis.ticks.map(fmt);
  const gutter = isBar ? 0 : Math.ceil(Math.max(0, ...tickLabels.map(measure)) + LABEL_DISTANCE);
  const right = 20;
  const plotLeft = gutter;
  const plotRight = W - right;
  const plotW = Math.max(20, plotRight - plotLeft);
  const rotate = isBar ? 0 : (spec.labelDeg || 0);
  const rad = (rotate * Math.PI) / 180;
  const catSpan = isColumn ? plotW / Math.max(1, count) : plotW / Math.max(1, count - 1);
  const labelInterval = isBar
    ? 0
    : categoryInterval(categories, measure, fontSize, catSpan, rotate);
  const shown = categories.map((_, i) => i % (labelInterval + 1) === 0);
  const maxShownW = Math.max(0, ...categories.filter((_, i) => shown[i]).map(measure));
  const xLabelH = isBar ? 0 : Math.ceil(rotate
    ? maxShownW * Math.sin(rad) + fontSize * Math.cos(rad)
    : fontSize * 1.25)
    + TICK_LENGTH + 4;
  const plotTop = pad;
  const plotBottom = H - (isBar ? pad : xLabelH);
  const plotH = Math.max(20, plotBottom - plotTop);

  const yOf = (v) => plotTop + plotH * (1 - (v - axis.min) / span);
  const xOfValue = (v) => plotLeft + plotW * ((v - axis.min) / span);
  const xOfCat = (i) => (isColumn
    ? plotLeft + catSpan * (i + 0.5)
    : plotLeft + (count > 1 ? catSpan * i : plotW / 2));

  const grid = svgNode(doc, 'g', { class: 'chart-grid', 'aria-hidden': 'true' });
  const axisY = svgNode(doc, 'g', { class: 'chart-axis chart-axis-value', 'aria-hidden': 'true' });
  axis.ticks.forEach((tick, i) => {
    if (isBar) {
      const x = r1(xOfValue(tick));
      grid.append(svgNode(doc, 'line', { class: 'chart-gridline', x1: x, x2: x, y1: plotTop, y2: plotBottom }));
    } else {
      const y = r1(yOf(tick));
      grid.append(svgNode(doc, 'line', { class: 'chart-gridline', x1: plotLeft, x2: plotRight, y1: y, y2: y }));
      axisY.append(svgNode(doc, 'text', { class: 'chart-tick-label', x: plotLeft - LABEL_DISTANCE, y, 'text-anchor': 'end', 'dominant-baseline': 'middle' }, tickLabels[i]));
    }
  });
  svg.append(grid, axisY);

  const axisX = svgNode(doc, 'g', { class: 'chart-axis chart-axis-category', 'aria-hidden': 'true' });
  if (!isBar) {
    categories.forEach((label, i) => {
      if (!shown[i]) return;
      const x = r1(xOfCat(i));
      axisX.append(svgNode(doc, 'line', { class: 'chart-tick', x1: x, x2: x, y1: plotBottom, y2: plotBottom + TICK_LENGTH }));
      const y = plotBottom + TICK_LENGTH + 4;
      axisX.append(svgNode(doc, 'text', rotate ? {
        class: 'chart-tick-label',
        x,
        y: y + fontSize * 0.35,
        'text-anchor': 'end',
        'dominant-baseline': 'middle',
        transform: `rotate(${-rotate} ${x} ${r1(y)})`,
      } : { class: 'chart-tick-label', x, y, 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }, label));
    });
  }
  svg.append(axisX);

  const marks = svgNode(doc, 'g', { class: 'chart-marks' });
  const tip = (i, s) => `${categories[i] ? `${categories[i]}, ` : ''}${s.name}: ${formatValue(s.raw[i], unit)}`;
  if (isColumn || isBar) {
    const along = isBar ? plotH : plotW;
    const layout = bandLayout(0, along, count, visible.length, isBar ? 0 : BAND_GAP);
    visible.forEach((s, si) => {
      s.values.forEach((v, i) => {
        if (v === null) return;
        const colour = spec.pointColours ? spec.pointColours[i] : s.colour;
        if (isBar) {
          const y = plotTop + layout.band * i + layout.offset + si * layout.bar * (1 + BAND_GAP);
          const x0 = xOfValue(Math.max(axis.min, 0));
          const x1 = xOfValue(v);
          marks.append(svgNode(doc, 'rect', {
            class: `chart-track chart-c-${colour}`, x: r1(plotLeft), y: r1(y), width: r1(plotW), height: r1(layout.bar), 'aria-hidden': 'true',
          }));
          marks.append(titled(doc, svgNode(doc, 'rect', { class: `chart-bar chart-c-${colour}`, x: r1(Math.min(x0, x1)), y: r1(y), width: r1(Math.abs(x1 - x0)), height: r1(layout.bar) }), tip(i, s)));
          marks.append(svgNode(doc, 'text', { class: 'chart-value-label', x: r1(Math.max(x0, x1) + LABEL_DISTANCE), y: r1(y + layout.bar / 2), 'dominant-baseline': 'middle' }, formatValue(s.raw[i], unit)));
        } else {
          const x = plotLeft + layout.band * i + layout.offset + si * layout.bar * (1 + BAND_GAP);
          const y0 = yOf(Math.min(Math.max(0, axis.min), axis.max));
          const y1 = yOf(v);
          marks.append(titled(doc, svgNode(doc, 'rect', { class: `chart-bar chart-c-${colour}`, x: r1(x), y: r1(Math.min(y0, y1)), width: r1(layout.bar), height: r1(Math.abs(y1 - y0)) }), tip(i, s)));
        }
      });
    });
    if (!isBar) {
      const y = r1(yOf(Math.min(Math.max(0, axis.min), axis.max)));
      marks.append(svgNode(doc, 'line', {
        class: 'chart-baseline', x1: plotLeft, x2: plotRight, y1: y, y2: y, 'aria-hidden': 'true',
      }));
    }
  } else {
    const stack = categories.map(() => 0);
    visible.forEach((s) => {
      const pts = [];
      const base = [];
      s.values.forEach((v, i) => {
        if (v === null && !isArea) { pts.push(null); return; }
        const lower = stack[i];
        const upper = isArea ? lower + (v ?? 0) : v;
        if (isArea) stack[i] = upper;
        pts.push([r1(xOfCat(i)), r1(yOf(upper))]);
        base.push([r1(xOfCat(i)), r1(yOf(lower))]);
      });
      let d = '';
      let pen = false;
      pts.forEach((p) => {
        if (!p) { pen = false; return; }
        d += `${pen ? 'L' : 'M'}${p[0]} ${p[1]}`;
        pen = true;
      });
      if (isArea && pts.length) {
        const back = base.slice().reverse().map((p) => `L${p[0]} ${p[1]}`).join('');
        marks.append(svgNode(doc, 'path', { class: `chart-area chart-c-${s.colour}`, d: `${d}${back}Z`, 'aria-hidden': 'true' }));
      }
      marks.append(svgNode(doc, 'path', { class: `chart-line chart-c-${s.colour}`, d, 'aria-hidden': 'true' }));
    });
    const hitW = count > 1 ? catSpan : plotW;
    categories.forEach((label, i) => {
      const lines = visible.map((s) => `${s.name}: ${formatValue(s.raw[i], unit)}`);
      marks.append(titled(doc, svgNode(doc, 'rect', {
        class: 'chart-hit',
        x: r1(Math.max(plotLeft, xOfCat(i) - hitW / 2)),
        y: plotTop,
        width: r1(Math.min(hitW, plotW)),
        height: r1(plotH),
      }), [label, ...lines].filter(Boolean).join('\n')));
    });
    const y = r1(yOf(Math.min(Math.max(0, axis.min), axis.max)));
    marks.append(svgNode(doc, 'line', {
      class: 'chart-baseline', x1: plotLeft, x2: plotRight, y1: y, y2: y, 'aria-hidden': 'true',
    }));
  }
  svg.append(marks);

  const markSpec = spec.marks || {};
  const markLayer = svgNode(doc, 'g', { class: 'chart-mark-layer' });
  const catIndex = (v) => categories.indexOf(String(v));
  (markSpec.markLine?.data || []).forEach((m) => {
    if (m.yAxis !== undefined && !isBar) {
      const y = r1(yOf(Number(m.yAxis)));
      markLayer.append(titled(doc, svgNode(doc, 'line', { class: 'chart-mark-line', x1: plotLeft, x2: plotRight, y1: y, y2: y }), m.name || fmt(m.yAxis)));
    } else if (m.xAxis !== undefined && catIndex(m.xAxis) >= 0) {
      const x = r1(xOfCat(catIndex(m.xAxis)));
      markLayer.append(titled(doc, svgNode(doc, 'line', { class: 'chart-mark-line', x1: x, x2: x, y1: plotTop, y2: plotBottom }), m.name || String(m.xAxis)));
    }
  });
  (markSpec.markArea?.data || []).forEach(([from, to]) => {
    if (!from || !to) return;
    const a = catIndex(from.xAxis);
    const b = catIndex(to.xAxis);
    if (a < 0 || b < 0) return;
    const x0 = xOfCat(Math.min(a, b));
    const x1 = xOfCat(Math.max(a, b));
    markLayer.append(titled(doc, svgNode(doc, 'rect', { class: 'chart-mark-area', x: r1(x0), y: plotTop, width: r1(Math.max(1, x1 - x0)), height: r1(plotH) }), from.name || ''));
  });
  if (markLayer.childNodes.length) svg.insertBefore(markLayer, marks);

  done();
  svg.setAttribute('aria-label', describeCartesian(spec, visible, isBar ? null : axis));
  return { svg, axis, labelInterval, shown };
}

function arcPath(cx, cy, ri, ro, a0, a1) {
  const full = a1 - a0 >= Math.PI * 2 - 1e-6;
  const end = full ? a1 - 1e-4 : a1;
  const large = end - a0 > Math.PI ? 1 : 0;
  const p = (r, a) => [r1(cx + r * Math.sin(a)), r1(cy - r * Math.cos(a))];
  const [x0, y0] = p(ro, a0);
  const [x1, y1] = p(ro, end);
  if (ri <= 0) return `M${r1(cx)} ${r1(cy)}L${x0} ${y0}A${r1(ro)} ${r1(ro)} 0 ${large} 1 ${x1} ${y1}Z`;
  const [x2, y2] = p(ri, end);
  const [x3, y3] = p(ri, a0);
  return `M${x0} ${y0}A${r1(ro)} ${r1(ro)} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r1(ri)} ${r1(ri)} 0 ${large} 0 ${x3} ${y3}Z`;
}

export function renderPie(doc, host, spec) {
  const W = Math.max(120, Math.round(spec.width || 600));
  const H = Math.max(120, Math.round(spec.height || 350));
  const isDonut = spec.type === 'donut';
  const small = spec.size === 'small';
  const svg = svgNode(doc, 'svg', {
    class: `chart-svg chart-svg-${spec.type}`, viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', focusable: 'false',
  });
  host.append(svg);
  const unit = spec.unit || { prefix: '', suffix: '' };
  const cx = W / 2;
  const cy = H * 0.46;
  const base = Math.min(W, H) / 2;
  // eslint-disable-next-line no-nested-ternary
  const ro = base * (isDonut ? 0.9 : (small ? 0.9 : 0.8));
  const ri = isDonut ? base * 0.7 : 0;
  const visible = spec.items.filter((it) => !it.hidden && it.value > 0);
  const total = visible.reduce((sum, it) => sum + it.value, 0);
  const marks = svgNode(doc, 'g', { class: 'chart-marks' });
  const labels = svgNode(doc, 'g', { class: 'chart-pie-labels', 'aria-hidden': 'true' });
  let angle = 0;
  visible.forEach((it) => {
    const share = total ? it.value / total : 0;
    const a1 = angle + share * Math.PI * 2;
    const pct = Math.round(share * 10000) / 100;
    const tip = `${it.name}: ${formatValue(it.raw, unit)}${unit.suffix !== '%' ? ` (${pct}%)` : ''}`;
    const slice = titled(doc, svgNode(doc, 'path', { class: `chart-slice chart-c-${it.colour}`, d: arcPath(cx, cy, ri, ro, angle, a1), 'data-value': it.value }), tip);
    marks.append(slice);
    if (!isDonut && !small && share > 0) {
      const mid = (angle + a1) / 2;
      const lx = cx + (ro + 20) * Math.sin(mid);
      const ly = cy - (ro + 20) * Math.cos(mid);
      labels.append(svgNode(doc, 'polyline', {
        class: 'chart-pie-leader',
        points: `${r1(cx + ro * Math.sin(mid))},${r1(cy - ro * Math.cos(mid))} ${r1(lx)},${r1(ly)}`,
      }));
      labels.append(svgNode(doc, 'text', {
        class: 'chart-tick-label',
        x: r1(lx + (Math.sin(mid) >= 0 ? 4 : -4)),
        y: r1(ly),
        'text-anchor': Math.sin(mid) >= 0 ? 'start' : 'end',
        'dominant-baseline': 'middle',
      }, it.name));
    }
    angle = a1;
  });
  svg.append(marks, labels);
  if (isDonut) {
    const center = svgNode(doc, 'text', { class: 'chart-donut-center', x: r1(cx), y: r1(cy), 'text-anchor': 'middle' });
    center.append(svgNode(doc, 'tspan', { class: 'chart-donut-value', x: r1(cx), dy: '0' }, donutLabel(spec.centerValue ?? total, unit)));
    if (spec.centerTitle) center.append(svgNode(doc, 'tspan', { class: 'chart-donut-title', x: r1(cx), dy: '1.6em' }, spec.centerTitle));
    svg.append(center);
  }
  const kind = isDonut ? 'Donut chart' : 'Pie chart';
  const parts = [`${kind}${spec.title ? `: ${spec.title}` : ''}.`];
  parts.push(`${visible.length} slices: ${visible.map((it) => `${it.name} ${formatValue(it.raw, unit)}`).join(', ')}.`);
  if (isDonut) parts.push(`Total ${donutLabel(total, unit)}.`);
  parts.push('The data table follows the chart.');
  svg.setAttribute('aria-label', parts.join(' '));
  return { svg, total, center: isDonut ? svg.querySelector('.chart-donut-value') : null };
}

export function dataTable(make, { caption, headers, rows }) {
  const table = make('table', { class: 'chart-table' });
  if (caption) table.append(make('caption', {}, caption));
  const thead = make('thead');
  const tr = make('tr');
  headers.forEach((h) => tr.append(make('th', { scope: 'col' }, String(h))));
  thead.append(tr);
  const tbody = make('tbody');
  rows.forEach((cells) => {
    const row = make('tr');
    cells.forEach((cell, i) => row.append(make(i ? 'td' : 'th', i ? {} : { scope: 'row' }, String(cell))));
    tbody.append(row);
  });
  table.append(thead, tbody);
  return table;
}
