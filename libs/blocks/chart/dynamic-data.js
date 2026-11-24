import { createTag } from '../../utils/utils.js';

let chartId = 0;

export function getDynamicConfig(el) {
  const config = {};
  const keys = {
    'data-points': 'dataPoints',
    'x-axis-label': 'xAxisLabel',
    'y-axis-label': 'yAxisLabel',
    'secondary-y-axis-label': 'secondaryYAxisLabel',
  };
  Array.from(el.children).forEach((row) => {
    if (row.children.length !== 2) return;
    const key = keys[row.children[0].textContent.trim().toLowerCase()];
    if (!key) return;
    const value = row.children[1].textContent.trim();
    if (key !== 'dataPoints') config[key] = value;
    else if (Number.isSafeInteger(Number(value)) && Number(value) > 0) {
      config[key] = Number(value);
    }
    row.remove();
  });
  return config;
}

const textTag = (tag, text, attributes) => {
  const el = createTag(tag, attributes);
  el.textContent = text;
  return el;
};

const formatValue = (value, { prefix = '', suffix = '' }) => `${prefix}${value}${suffix}`;

export function getDynamicOptions(dataset, units, config = {}) {
  const [, bar, line] = dataset.source[0];
  const yAxes = [units.yAxes[0], units.yAxes[1] || units.yAxes[0]];
  const rotation = config.labelDeg || 0;
  const labelHeight = config.xAxisLabel && rotation
    ? dataset.source.slice(1).reduce((max, [label]) => Math.max(max, window.echarts.format.getTextRect(String(label), '16px sans-serif').width), 0) * Math.sin((rotation * Math.PI) / 180) : 0;
  return {
    animation: false,
    legend: { show: false, data: [bar, line] },
    grid: {
      top: 45,
      bottom: 45,
      left: 12,
      right: 28,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLabel: { rotate: rotation },
      name: config.xAxisLabel || '',
      nameLocation: 'middle',
      nameGap: 32 + labelHeight,
    },
    yAxis: yAxes.map((unit, index) => ({
      type: 'value',
      position: index ? 'right' : 'left',
      name: (index ? config.secondaryYAxisLabel : config.yAxisLabel) || (index ? line : bar),
      nameLocation: 'end',
      nameGap: 15,
      nameTextStyle: { align: index ? 'right' : 'left' },
      splitLine: { show: index === 0 },
      axisLabel: { formatter: (value) => formatValue(value, unit) },
    })),
    series: [
      {
        name: bar,
        type: 'bar',
        yAxisIndex: 0,
        encode: { x: 0, y: 1 },
        itemStyle: { borderRadius: 3, borderColor: '#2c2c2c', borderWidth: 1 },
      },
      {
        name: line,
        type: 'line',
        yAxisIndex: 1,
        encode: { x: 0, y: 2 },
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3 },
      },
    ],
    tooltip: {
      trigger: 'axis',
      triggerOn: 'mousemove|click',
      confine: true,
      enterable: true,
      formatter: (params) => {
        const content = textTag('div', params[0].name);
        params.forEach(({ seriesName, seriesIndex, value, encode }) => {
          content.append(textTag(
            'div',
            `${seriesName}: ${formatValue(value[encode.y[0]], yAxes[seriesIndex])}`,
          ));
        });
        return content;
      },
    },
  };
}

export function decorateDynamicChart(chart, wrapper, { dataset, units }, onResize) {
  const [headers, ...rows] = dataset.source;
  const title = wrapper.closest('.chart').querySelector('.title').textContent.trim();
  const controls = createTag('div', { class: 'chart-controls' });
  const legend = createTag('div', { class: 'chart-legend', role: 'group', 'aria-label': 'Chart legend' });
  const colors = chart.getOption().color;
  headers.slice(1).forEach((name, index) => {
    const button = textTag('button', name, { type: 'button', 'aria-pressed': 'true' });
    const swatch = createTag('span', {
      class: `chart-legend-swatch ${index ? 'line' : 'bar'}`,
      'aria-hidden': 'true',
    });
    swatch.style.setProperty('--series-color', colors[index % colors.length]);
    button.prepend(swatch);
    button.addEventListener('click', () => chart.dispatchAction({ type: 'legendToggleSelect', name }));
    legend.append(button);
  });
  const syncLegend = ({ selected }) => {
    Array.from(legend.children).forEach((button, index) => {
      button.setAttribute('aria-pressed', String(selected[headers[index + 1]] !== false));
    });
  };
  chart.on('legendselectchanged', syncLegend);

  chartId += 1;
  const instructions = textTag(
    'p',
    'Use Left and Right Arrow keys to explore data points, Home and End to jump, and Escape to dismiss the tooltip.',
    { id: `chart-instructions-${chartId}`, class: 'chart-instructions' },
  );
  const status = createTag('p', { class: 'chart-sr-only', role: 'status', 'aria-atomic': 'true' });
  const details = createTag('details', { class: 'chart-data' });
  details.append(textTag('summary', 'View chart data'));
  const table = createTag('table');
  table.append(textTag('caption', title || 'Chart data'));
  const thead = createTag('thead');
  const headerRow = createTag('tr');
  headers.forEach((name) => headerRow.append(textTag('th', name, { scope: 'col' })));
  thead.append(headerRow);
  const tbody = createTag('tbody');
  rows.forEach((row) => {
    const tr = createTag('tr');
    row.forEach((value, index) => {
      tr.append(index
        ? textTag('td', formatValue(value, units.yAxes[index - 1]))
        : textTag('th', value, { scope: 'row' }));
    });
    tbody.append(tr);
  });
  table.append(thead, tbody);
  details.append(table);
  controls.append(legend, instructions, status, details);
  wrapper.after(controls);
  const previousDescription = wrapper.getAttribute('aria-describedby');
  wrapper.setAttribute('aria-describedby', instructions.id);

  let point = 0;
  const showPoint = () => {
    const row = rows[point];
    const selected = chart.getOption().legend[0].selected || {};
    const seriesIndex = headers.slice(1).findIndex((name) => selected[name] !== false);
    if (seriesIndex < 0) return;
    chart.dispatchAction({ type: 'showTip', seriesIndex, dataIndex: point });
    status.textContent = `${headers[0]}: ${row[0]}. ${headers.slice(1).map((name, index) => (
      `${name}: ${formatValue(row[index + 1], units.yAxes[index])}`
    )).join('. ')}`;
  };
  const hidePoint = () => {
    chart.dispatchAction({ type: 'hideTip' });
    status.textContent = '';
  };
  const onKeydown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Escape') {
      hidePoint();
      return;
    }
    if (event.key === 'ArrowLeft') point = Math.max(0, point - 1);
    if (event.key === 'ArrowRight') point = Math.min(rows.length - 1, point + 1);
    if (event.key === 'Home') point = 0;
    if (event.key === 'End') point = rows.length - 1;
    showPoint();
  };
  const onFocus = () => {
    if (wrapper.matches(':focus-visible')) showPoint();
  };
  wrapper.addEventListener('focus', onFocus);
  wrapper.addEventListener('blur', hidePoint);
  wrapper.addEventListener('keydown', onKeydown);

  let resizeFrame;
  const resize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      onResize?.();
      chart.resize();
    });
  };
  const observer = window.ResizeObserver ? new ResizeObserver(resize) : null;
  observer?.observe(wrapper);
  window.addEventListener('resize', resize);

  return () => {
    observer?.disconnect();
    cancelAnimationFrame(resizeFrame);
    window.removeEventListener('resize', resize);
    wrapper.removeEventListener('focus', onFocus);
    wrapper.removeEventListener('blur', hidePoint);
    wrapper.removeEventListener('keydown', onKeydown);
    chart.off('legendselectchanged', syncLegend);
    if (previousDescription) wrapper.setAttribute('aria-describedby', previousDescription);
    else wrapper.removeAttribute('aria-describedby');
    controls.remove();
  };
}
