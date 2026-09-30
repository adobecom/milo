import { html, useEffect, useMemo, useRef, useState } from '../../../deps/htm-preact.js';
import { loadScript, getConfig } from '../../../utils/utils.js';
import { API_URLS } from '../../../features/personalization/preview.js';

// Comfortably covers any single calendar year (plus a little of the year before/after)
// of daily snapshots in one request - the chart only ever displays month-level data.
const FETCH_DAYS = 400;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Distinct per-line colors for the geo-group breakdown view (cycled if there are more
// groups than colors). The single-line "All pages"/one-geo view always uses the theme's
// --color-accent instead (handled separately below).
const BREAKDOWN_PALETTE = ['#4046CA', '#E8702A', '#1DA57A', '#B3312C', '#8558D3', '#2D9CDB', '#D6A72C', '#6A6F77'];

// Geo breakdowns can have many more lines than the curated palette above (e.g. a config
// with both broad regions and individual countries). Beyond the palette, generate extra
// colors spaced around the hue wheel so no two lines ever collide - a repeated color on
// two crossing lines is visually indistinguishable from an actual overlap.
function seriesColor(i) {
  if (i < BREAKDOWN_PALETTE.length) return BREAKDOWN_PALETTE[i];
  const hue = ((i - BREAKDOWN_PALETTE.length) * 137.508) % 360; // golden-angle hue spacing
  return `hsl(${hue.toFixed(0)}, 65%, 45%)`;
}

// Purely a local dev/design aid: append ?mmm2MockHistory=1 to the page URL to preview
// the chart (year switching, month-start truncation, K-suffixed axis, geo breakdown)
// without waiting on real multi-year/multi-geo data to accumulate. Never fetched/used
// unless explicitly opted in. Spans Jun 2025 (mock "start of history") - present.
const MOCK_HISTORY_ALL = [
  ['2025-06-30', 6350], ['2025-07-31', 6280], ['2025-08-31', 6510],
  ['2025-09-30', 6690], ['2025-10-31', 6875], ['2025-11-30', 7020], ['2025-12-31', 7340],
  ['2026-01-31', 7410], ['2026-02-28', 7530], ['2026-03-31', 7690], ['2026-04-30', 7855],
  ['2026-05-31', 7960], ['2026-06-30', 8080], ['2026-07-31', 8175], ['2026-08-31', 8260],
  ['2026-09-30', 8397],
].map(([date, targetOnCount]) => ({ date, targetOnCount }));

// Deterministic (same key always produces the same "shape") pseudo-random 0..1 value,
// used to scale/shape the mock breakdown lines so different geo groups look plausibly
// distinct from each other and from the site-wide total, without any real per-geo data.
function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  return () => {
    h = (h * 48271) % 2147483647;
    return h / 2147483647;
  };
}

function mockHistoryFor(key) {
  if (!key) return MOCK_HISTORY_ALL;
  const rand = seededRandom(key);
  const scale = 0.06 + rand() * 0.3; // this mock geo/group is some fraction of the site-wide total
  const drift = 0.85 + rand() * 0.3; // slight extra trend so lines don't all grow in lockstep
  return MOCK_HISTORY_ALL.map((row, i) => {
    const trend = 1 + (drift - 1) * (i / MOCK_HISTORY_ALL.length);
    const targetOnCount = Math.max(1, Math.round(row.targetOnCount * scale * trend));
    return { date: row.date, targetOnCount };
  });
}

function formatCount(value) {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return `${value}`;
}

// Buckets raw daily snapshot rows into { year: { month: lastCountSeenThatMonth } } -
// the chart shows one point per month (the most recent snapshot recorded in it),
// not every individual day.
function bucketByMonth(rows) {
  const byYear = new Map();
  rows.forEach((row) => {
    const [y, m] = row.date.split('-').map(Number);
    if (!byYear.has(y)) byYear.set(y, new Map());
    // rows arrive oldest-first, so later rows overwrite earlier ones in the same month
    byYear.get(y).set(m - 1, row.targetOnCount);
  });
  return byYear;
}

/**
 * Yearly line chart of "pages with Target on", one point per month, backed by
 * GET /get-target-history (a daily snapshot table - see mep_manager_sls) which this
 * component aggregates down to month-level. A year dropdown appears once more than
 * one year of history exists. The x-axis starts at January for any complete year, or
 * at the first month snapshots were ever recorded for the very first (partial) year;
 * it ends at the current month for the current year, or December for past years.
 *
 * Respects the Inactivity Report's own geo filter (`selectedGeos`, same encoding as
 * the report's `geos` param): when a specific geo/group is selected, the chart shows
 * just that one line. When "Show all" is selected (`selectedGeos` empty) and geo groups
 * are available (`geoGroups`, from the same authored config the geo filter dropdown
 * uses), a toggle lets the viewer switch between a single site-wide line and a
 * per-geo-group breakdown (one distinctly-colored line per group, with a legend and a
 * tooltip that names each group).
 */
function TargetActivityChart({ selectedGeos = '', geoGroups = [] } = {}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [series, setSeries] = useState(null); // [{ key, label, rows }]
  const [failed, setFailed] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [breakdownMode, setBreakdownMode] = useState(false);

  const showBreakdownToggle = !selectedGeos && geoGroups.length > 0;
  const activeBreakdown = showBreakdownToggle && breakdownMode;

  const seriesKeys = useMemo(() => {
    if (selectedGeos) {
      const match = geoGroups.find((g) => g.value === selectedGeos);
      return [{ key: selectedGeos, label: match?.label ?? 'Selected geos' }];
    }
    if (activeBreakdown) return geoGroups.map((g) => ({ key: g.value, label: g.label }));
    return [{ key: '', label: 'All pages' }];
  }, [selectedGeos, activeBreakdown, geoGroups]);

  useEffect(() => {
    let cancelled = false;
    const useMock = new URLSearchParams(window.location.search).get('mmm2MockHistory');

    const fetchOne = ({ key, label }) => {
      const source = useMock
        ? Promise.resolve({ result: mockHistoryFor(key) })
        : fetch(`${API_URLS.history}?days=${FETCH_DAYS}${key ? `&geos=${encodeURIComponent(key)}` : ''}`).then((res) => res.json());
      return source.then((data) => ({ key, label, rows: data?.result ?? [] }));
    };

    Promise.all(seriesKeys.map(fetchOne))
      .then((resolved) => { if (!cancelled) setSeries(resolved); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [seriesKeys]);

  const bucketedSeries = useMemo(
    () => (series ?? []).map((s) => ({ ...s, byMonth: bucketByMonth(s.rows) })),
    [series],
  );
  const years = useMemo(() => {
    const all = new Set();
    bucketedSeries.forEach((s) => s.byMonth.forEach((_, y) => all.add(y)));
    return [...all].sort((a, b) => a - b);
  }, [bucketedSeries]);
  const firstYear = years[0];
  const firstMonth = useMemo(() => {
    if (firstYear === undefined) return 0;
    let min;
    bucketedSeries.forEach((s) => {
      const monthMap = s.byMonth.get(firstYear);
      if (!monthMap) return;
      const seriesMin = Math.min(...monthMap.keys());
      min = min === undefined ? seriesMin : Math.min(min, seriesMin);
    });
    return min ?? 0;
  }, [bucketedSeries, firstYear]);

  useEffect(() => {
    if (!years.length) return;
    if (selectedYear === null || !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years, selectedYear]);

  const { months, plottedSeries } = useMemo(() => {
    if (selectedYear === null || !years.includes(selectedYear)) {
      return { months: [], plottedSeries: [] };
    }
    const now = new Date();
    const startMonth = selectedYear === firstYear ? firstMonth : 0;
    const endMonth = selectedYear === now.getUTCFullYear() ? now.getUTCMonth() : 11;
    const monthIndices = [];
    for (let m = startMonth; m <= endMonth; m += 1) monthIndices.push(m);
    return {
      months: monthIndices.map((m) => MONTH_LABELS[m]),
      plottedSeries: bucketedSeries.map((s) => {
        const yearData = s.byMonth.get(selectedYear);
        return {
          label: s.label,
          values: monthIndices.map((m) => (yearData?.has(m) ? yearData.get(m) : null)),
        };
      }),
    };
  }, [bucketedSeries, selectedYear, firstYear, firstMonth, years]);

  useEffect(() => {
    if (!months.length || !containerRef.current) return undefined;
    let disposed = false;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;

    loadScript(`${base}/deps/echarts.common.min.js`).then(() => {
      if (disposed || !containerRef.current || !window.echarts) return;
      const style = getComputedStyle(containerRef.current);
      const accentColor = style.getPropertyValue('--color-accent').trim() || '#4046CA';
      const isSingleLine = plottedSeries.length === 1;
      const chart = window.echarts.init(containerRef.current, null, { renderer: 'svg' });
      chartRef.current = chart;
      chart.setOption({
        grid: {
          left: 8,
          right: 16,
          top: isSingleLine ? 20 : 36,
          bottom: isSingleLine ? 28 : 48,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          order: 'valueDesc',
          textStyle: { fontSize: 11 },
          padding: [6, 8],
          extraCssText: 'max-height: 320px; overflow-y: auto; line-height: 1.4;',
        },
        legend: isSingleLine ? undefined : { bottom: 0, type: 'scroll' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: months,
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: { formatter: (value) => formatCount(value) },
        },
        series: plottedSeries.map((s, i) => {
          const color = isSingleLine
            ? accentColor
            : seriesColor(i);
          return {
            name: s.label,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            connectNulls: true,
            areaStyle: isSingleLine ? { color, opacity: 0.08 } : undefined,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data: s.values,
          };
        }),
      });
    }).catch(() => { if (!disposed) setFailed(true); });

    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [months, plottedSeries]);

  if (failed) return null;

  const isEmpty = series?.every((s) => s.rows.length === 0);
  const titleSuffix = selectedYear ? ` - ${selectedYear}` : '';

  return html`
    <div class="mmm2-history-chart">
      <div class="mmm2-history-chart-header">
        <h3 class="mmm2-history-chart-title">Pages with Target on${titleSuffix}</h3>
        <div class="mmm2-history-chart-controls">
          ${showBreakdownToggle ? html`
            <select
              class="mmm2-history-chart-breakdown"
              aria-label="View"
              value=${breakdownMode ? 'geo' : 'all'}
              onChange=${(e) => setBreakdownMode(e.target.value === 'geo')}>
              <option value="all">All pages</option>
              <option value="geo">By geo group</option>
            </select>
          ` : null}
          ${years.length > 1 ? html`
            <select
              class="mmm2-history-chart-year"
              aria-label="Select year"
              value=${selectedYear ?? ''}
              onChange=${(e) => setSelectedYear(Number(e.target.value))}>
              ${years.slice().reverse().map((year) => html`<option value=${year}>${year}</option>`)}
            </select>
          ` : null}
        </div>
      </div>
      ${isEmpty
    ? html`<p class="mmm2-history-chart-empty">No history yet - this graph fills in one day at a time.</p>`
    : html`<div class="mmm2-history-chart-canvas" ref=${containerRef}></div>`}
    </div>
  `;
}

export default TargetActivityChart;
