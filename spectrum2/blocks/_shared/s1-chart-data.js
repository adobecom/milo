export const PALETTE = Object.freeze([
  'seafoam', 'indigo', 'orange', 'magenta', 'lavender', 'lime',
  'blue', 'purple', 'yellow', 'copper', 'green', 'chartreuse',
]);

export const CHART_TYPES = Object.freeze(['bar', 'column', 'line', 'area', 'list', 'donut', 'pie', 'oversized-number']);

export const SMALL = 'small';
export const MEDIUM = 'medium';
export const LARGE = 'large';

const DATE_UNIT = 'date';
const LEGACY_UNIT_HEADER = 'unit';
const X_AXIS_UNIT_HEADER = 'x axis unit';
const Y_AXIS_UNIT_HEADER = 'y axis unit';
const SECONDARY_Y_AXIS_UNIT_HEADER = 'secondary y axis unit';
const OPTIONAL_HEADERS = [LEGACY_UNIT_HEADER, 'group', 'color', 'subheading', X_AXIS_UNIT_HEADER,
  Y_AXIS_UNIT_HEADER, SECONDARY_Y_AXIS_UNIT_HEADER];

export const parseValue = (value) => parseFloat(value) || value;

export function numeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function hasPropertyCI(data, name) {
  return !!data && Object.keys(data).some((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyNameCI(data, name) {
  if (!data) return undefined;
  return Object.keys(data).find((column) => column.toLowerCase() === name.toLowerCase());
}

export function propertyValueCI(data, name) {
  if (!data) return undefined;
  return data[propertyNameCI(data, name)];
}

export function formatExcelDate(date) {
  let newDate;
  let timeZone = 'GMT';
  if (!Number.isNaN(+date)) {
    newDate = +date > 99999
      ? new Date(+date * 1000)
      : new Date(Math.round((+date - (1 + 25567 + 1)) * 86400 * 1000));
  } else {
    newDate = new Date(date);
    timeZone = undefined;
  }
  return newDate.toLocaleString([], { dateStyle: 'short', timeZone });
}

export function chartTypeOf(className) {
  const text = String(className || '');
  return CHART_TYPES.find((type) => text.indexOf(type) !== -1) || null;
}

export function authoredColourOf(classList) {
  return [...classList].find((style) => PALETTE.includes(style)) || null;
}

export function processUnits(headers) {
  const units = { xAxis: { date: false }, yAxes: [{ prefix: '', suffix: '' }] };
  const legacyUnit = propertyValueCI(headers || {}, LEGACY_UNIT_HEADER);
  if (legacyUnit) {
    const legacyUnits = String(legacyUnit).split('-');
    if (legacyUnits[0] === DATE_UNIT) {
      units.xAxis.date = true;
      legacyUnits.shift();
    }
    if (legacyUnits[0]) [units.yAxes[0].suffix] = legacyUnits;
    if (legacyUnits[1]) units.yAxes.push({ prefix: '', suffix: legacyUnits[1] });
  } else {
    const xAxisUnit = propertyValueCI(headers || {}, X_AXIS_UNIT_HEADER);
    const yAxisUnit = propertyValueCI(headers || {}, Y_AXIS_UNIT_HEADER);
    const secondaryYAxisUnit = propertyValueCI(headers || {}, SECONDARY_Y_AXIS_UNIT_HEADER);
    if (xAxisUnit === DATE_UNIT) units.xAxis.date = true;
    if (yAxisUnit) {
      const yUnits = String(yAxisUnit).split(',');
      if (yUnits[1]) {
        units.yAxes[0].prefix = yUnits[0].trim();
        units.yAxes[0].suffix = yUnits[1].trim();
      } else {
        units.yAxes[0].suffix = yUnits[0].trim();
      }
    }
    if (secondaryYAxisUnit) {
      const yUnits = String(secondaryYAxisUnit).split(',');
      if (yUnits[1]) units.yAxes.push({ prefix: yUnits[0], suffix: yUnits[1] });
      else units.yAxes.push({ prefix: '', suffix: yUnits[0] });
    }
  }
  return units;
}

export function processDataset(data) {
  const rows = Array.isArray(data) ? data : [];
  const headers = rows[0] || {};
  const units = processUnits(headers);
  const cleanHeaders = Object.keys(headers)
    .filter((header) => !OPTIONAL_HEADERS.includes(header.toLowerCase()));
  const source = [cleanHeaders];
  rows.forEach((element) => {
    source.push(cleanHeaders.map((column, index) => (
      units.xAxis.date && !index ? formatExcelDate(element[column]) : parseValue(element[column])
    )));
  });
  return { dataset: { source }, headers, units };
}

export function processMarkData(series, units) {
  return (Array.isArray(series) ? series : []).reduce((options, mark) => {
    if (!mark || !mark.Type) return options;
    options[mark.Type] ??= { data: [] };
    const markData = options[mark.Type].data;
    const split = String(mark.Value ?? '').split('-');
    const read = (v) => (units.xAxis.date && mark.Axis === 'xAxis' ? formatExcelDate(v) : parseValue(v));
    const markObject = {
      ...(mark.Name ? { name: mark.Name } : {}),
      ...(mark.Axis ? { [mark.Axis]: read(split[0]) } : {}),
    };
    if (mark.Type === 'markArea') {
      markData[0] ??= [];
      markData[0].push(markObject);
      if (split.length > 1) markData[0].push(mark.Axis ? { [mark.Axis]: read(split[1]) } : {});
    } else {
      markData.push(markObject);
    }
    return options;
  }, {});
}

export function chartData(json) {
  const data = {};
  if (json && json[':type'] === 'multi-sheet') {
    const names = Array.isArray(json[':names']) ? json[':names'] : [];
    const dataSheet = names.includes('data') ? 'data' : names[0];
    const seriesSheet = names.filter((name) => name !== 'data' && name !== dataSheet)[0]
      ?? names.filter((name) => name !== 'data')[0];
    data.data = json[dataSheet]?.data;
    data.series = seriesSheet === dataSheet ? [] : (json[seriesSheet]?.data ?? []);
  } else {
    data.data = json?.data;
    data.series = [];
  }
  return data;
}

export async function fetchData(href, fetchImpl, pageUrl) {
  if (!href || typeof fetchImpl !== 'function') return {};
  let cache = 'default';
  try {
    if (new URL(pageUrl).searchParams.get('cache') === 'off') cache = 'reload';
  } catch (e) {
    cache = 'default';
  }
  try {
    const resp = await fetchImpl(String(href).toLowerCase(), { cache });
    if (!resp || !resp.ok) return {};
    return await resp.json();
  } catch (e) {
    return {};
  }
}

export function getColors(authoredColor) {
  const list = [...PALETTE];
  if (!authoredColor || !PALETTE.includes(authoredColor)) return list;
  const index = list.indexOf(authoredColor);
  return list.concat(list.splice(0, index));
}

export function getOverrideColors(authoredColor, data) {
  return (Array.isArray(data) ? data : []).map((row) => {
    const override = propertyValueCI(row, 'color');
    const name = override || authoredColor;
    return PALETTE.includes(name) ? name : PALETTE[0];
  });
}

export function getResponsiveSize(authoredSize, width) {
  if (width < 768 || authoredSize === SMALL) return SMALL;
  if (width < 1280 || authoredSize === MEDIUM) return MEDIUM;
  return LARGE;
}

export function getLabelDegree(classList, isDesktop) {
  const styles = [...classList];
  const diagonal = isDesktop ? styles.includes('desktop-diagonal-labels') : styles.includes('mobile-diagonal-labels');
  return diagonal ? 60 : 0;
}

export function authoredSizeFor(upNumber) {
  if (upNumber === 1) return LARGE;
  if (upNumber === 2) return MEDIUM;
  return SMALL;
}

export function seriesModel(processed) {
  const source = processed?.dataset?.source || [[]];
  const dimensions = (source[0] || []).slice();
  const names = dimensions.slice(1).map(String);
  const rows = source.slice(1);
  return {
    categories: rows.map((row) => (row[0] === undefined || row[0] === null ? '' : String(row[0]))),
    series: names.map((name, i) => ({
      name,
      raw: rows.map((row) => row[i + 1]),
      values: rows.map((row) => numeric(row[i + 1])),
    })),
  };
}

export function pieModel(processed) {
  const source = processed?.dataset?.source || [[]];
  const rows = source.slice(1);
  const width = (source[0] || []).length;
  const isNum = (i) => rows.length && rows.every((r) => numeric(r[i]) !== null);
  let valueIndex = -1;
  let nameIndex = -1;
  for (let i = 0; i < width; i += 1) {
    if (valueIndex < 0 && isNum(i)) valueIndex = i;
    else if (nameIndex < 0 && !isNum(i)) nameIndex = i;
  }
  if (valueIndex < 0) valueIndex = 0;
  const items = rows.map((row, i) => ({
    name: nameIndex < 0 ? String(i + 1) : String(row[nameIndex] ?? ''),
    raw: row[valueIndex],
    value: numeric(row[valueIndex]) ?? 0,
  }));
  const header = source[0] || [];
  return { items, nameHeader: nameIndex < 0 ? '' : String(header[nameIndex] ?? ''), valueHeader: String(header[valueIndex] ?? '') };
}

export function donutLabel(value, unit = { prefix: '', suffix: '' }) {
  const n = typeof value === 'number' ? value : numeric(value);
  return `${unit.prefix}${n === null ? '' : n.toLocaleString()}${unit.suffix}`;
}

export function donutTitle(series) {
  const first = Array.isArray(series) ? series[0] : null;
  return first ? (propertyValueCI(first, 'title') ?? '') : '';
}

export function formatValue(raw, unit = { prefix: '', suffix: '' }) {
  if (raw === undefined || raw === null || raw === '') return '';
  return `${unit.prefix}${raw}${unit.suffix}`;
}

export function listToLowerCase(list) {
  const items = Array.isArray(list) ? list : [];
  return items.map((item) => Object.keys(item || {}).reduce((prev, key) => {
    prev[key.toLowerCase()] = item[key];
    return prev;
  }, {}));
}

export function listChartData(json) {
  const data = [];
  if (!json || json[':type'] !== 'multi-sheet') return data;
  const tableKey = propertyNameCI(json, 'table');
  if (tableKey) {
    let firstHeadingLevel = null;
    (json[tableKey].data || []).forEach((column, index) => {
      const sheet = propertyValueCI(column, 'sheet');
      if (index === 0) firstHeadingLevel = propertyValueCI(column, 'heading level');
      data.push({
        title: propertyValueCI(column, 'title'),
        list: listToLowerCase(json[sheet]?.data ?? []),
        type: propertyValueCI(column, 'type'),
        headingLevel: propertyValueCI(column, 'heading level') || firstHeadingLevel,
      });
    });
  } else {
    (json[':names'] || []).forEach((sheet) => {
      data.push({ title: sheet, list: listToLowerCase(json[sheet]?.data) });
    });
  }
  return data;
}

export function roundNumber(x, precision = 10) {
  const p = Math.min(Math.max(0, precision), 20);
  return +(+x).toFixed(p);
}

export function getPrecision(val) {
  const v = +val;
  if (Number.isNaN(v)) return 0;
  if (v > 1e-14) {
    for (let e = 1, n = 0; n < 15; n += 1, e *= 10) if (Math.round(v * e) / e === v) return n;
  }
  const str = v.toString().toLowerCase();
  const eIndex = str.indexOf('e');
  const exp = eIndex > 0 ? +str.slice(eIndex + 1) : 0;
  const significant = eIndex > 0 ? eIndex : str.length;
  const dot = str.indexOf('.');
  const decimals = dot < 0 ? 0 : significant - 1 - dot;
  return Math.max(0, decimals - exp);
}

export function quantityExponent(val) {
  if (val === 0) return 0;
  let exp = Math.floor(Math.log(val) / Math.LN10);
  if (val / 10 ** exp >= 10) exp += 1;
  return exp;
}

export function nice(val, round) {
  const exponent = quantityExponent(val);
  const exp10 = 10 ** exponent;
  const f = val / exp10;
  const steps = round ? [[1.5, 1], [2.5, 2], [4, 3], [7, 5]] : [[1, 1], [2, 2], [3, 3], [5, 5]];
  const nf = (steps.find(([limit]) => f < limit) || [0, 10])[1];
  const out = nf * exp10;
  return exponent >= -20 ? +out.toFixed(exponent < 0 ? -exponent : 0) : out;
}

export function valueAxis(values, options = {}) {
  const { splitNumber = 5, max: fixedMax = null, crossZero = true } = options;
  const nums = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  let min = nums.length ? Math.min(...nums) : Infinity;
  let max = nums.length ? Math.max(...nums) : -Infinity;
  if (crossZero && nums.length) {
    if (min > 0 && max > 0) min = 0;
    if (min < 0 && max < 0) max = 0;
  }
  const fixMax = typeof fixedMax === 'number' && Number.isFinite(fixedMax);
  if (fixMax) max = fixedMax;
  const extent = [min, max];
  if (extent[0] === extent[1]) {
    if (extent[0] !== 0) {
      const expand = Math.abs(extent[0]);
      if (!fixMax) extent[1] += expand / 2;
      extent[0] -= expand / 2;
    } else {
      extent[1] = 1;
    }
  }
  if (!Number.isFinite(extent[1] - extent[0])) {
    extent[0] = 0;
    extent[1] = 1;
  }
  const interval = nice((extent[1] - extent[0]) / splitNumber, true);
  const precision = getPrecision(interval) + 2;
  const niceTick = [
    roundNumber(Math.ceil(extent[0] / interval) * interval, precision),
    roundNumber(Math.floor(extent[1] / interval) * interval, precision),
  ];
  niceTick[0] = Math.max(Math.min(niceTick[0], extent[1]), extent[0]);
  niceTick[1] = Math.max(Math.min(niceTick[1], extent[1]), extent[0]);
  // eslint-disable-next-line prefer-destructuring
  if (niceTick[0] > niceTick[1]) niceTick[0] = niceTick[1];
  extent[0] = roundNumber(Math.floor(extent[0] / interval) * interval);
  if (!fixMax) extent[1] = roundNumber(Math.ceil(extent[1] / interval) * interval);
  const ticks = [];
  if (extent[0] < niceTick[0]) ticks.push(extent[0]);
  for (let tick = niceTick[0]; tick <= niceTick[1];) {
    ticks.push(tick);
    tick = roundNumber(tick + interval, precision);
    if (tick === ticks[ticks.length - 1] || ticks.length > 10000) break;
  }
  const last = ticks.length ? ticks[ticks.length - 1] : niceTick[1];
  if (extent[1] > last) ticks.push(extent[1]);
  return { min: extent[0], max: extent[1], ticks, interval };
}

export function barAxisMax(values) {
  const nums = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (!nums.length) return null;
  const max = Math.max(...nums);
  return Math.ceil((max + max * 1) / 10) * 10;
}
