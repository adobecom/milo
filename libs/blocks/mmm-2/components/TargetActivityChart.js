import { html, useEffect, useMemo, useRef, useState } from '../../../deps/htm-preact.js';
import { loadScript, getConfig } from '../../../utils/utils.js';
import { API_URLS } from '../../../features/personalization/preview.js';

// Comfortably covers any single calendar year (plus a little of the year before/after)
// of daily snapshots in one request - the chart only ever displays month-level data.
const FETCH_DAYS = 400;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Purely a local dev/design aid: append ?mmm2MockHistory=1 to the page URL to preview
// the chart (year switching, month-start truncation, K-suffixed axis) without waiting
// on real multi-year data to accumulate. Never fetched/used unless explicitly opted in.
// Spans Jun 2025 (mock "start of history") through the current month.
const MOCK_HISTORY = [
  ['2025-06-30', 6350], ['2025-07-31', 6280], ['2025-08-31', 6510],
  ['2025-09-30', 6690], ['2025-10-31', 6875], ['2025-11-30', 7020], ['2025-12-31', 7340],
  ['2026-01-31', 7410], ['2026-02-28', 7530], ['2026-03-31', 7690], ['2026-04-30', 7855],
  ['2026-05-31', 7960], ['2026-06-30', 8080], ['2026-07-31', 8175], ['2026-08-31', 8260],
  ['2026-09-30', 8397],
].map(([date, targetOnCount]) => ({ date, targetOnCount }));

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
 */
function TargetActivityChart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const useMock = new URLSearchParams(window.location.search).get('mmm2MockHistory');
    const source = useMock
      ? Promise.resolve({ result: MOCK_HISTORY })
      : fetch(`${API_URLS.history}?days=${FETCH_DAYS}`).then((res) => res.json());

    source
      .then((data) => { if (!cancelled) setRows(data?.result ?? []); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  const byYear = useMemo(() => bucketByMonth(rows ?? []), [rows]);
  const years = useMemo(() => [...byYear.keys()].sort((a, b) => a - b), [byYear]);
  const firstYear = years[0];
  const firstMonth = firstYear !== undefined ? Math.min(...byYear.get(firstYear).keys()) : 0;

  useEffect(() => {
    if (!years.length) return;
    if (selectedYear === null || !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years, selectedYear]);

  const { months, values } = useMemo(() => {
    if (selectedYear === null || !byYear.has(selectedYear)) return { months: [], values: [] };
    const now = new Date();
    const startMonth = selectedYear === firstYear ? firstMonth : 0;
    const endMonth = selectedYear === now.getUTCFullYear() ? now.getUTCMonth() : 11;
    const yearData = byYear.get(selectedYear);
    const monthIndices = [];
    for (let m = startMonth; m <= endMonth; m += 1) monthIndices.push(m);
    return {
      months: monthIndices.map((m) => MONTH_LABELS[m]),
      values: monthIndices.map((m) => (yearData.has(m) ? yearData.get(m) : null)),
    };
  }, [byYear, selectedYear, firstYear, firstMonth]);

  useEffect(() => {
    if (!months.length || !containerRef.current) return undefined;
    let disposed = false;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;

    loadScript(`${base}/deps/echarts.common.min.js`).then(() => {
      if (disposed || !containerRef.current || !window.echarts) return;
      const accentColor = getComputedStyle(containerRef.current).getPropertyValue('--color-accent').trim() || '#4046CA';
      const chart = window.echarts.init(containerRef.current, null, { renderer: 'svg' });
      chartRef.current = chart;
      chart.setOption({
        grid: { left: 8, right: 16, top: 20, bottom: 28, containLabel: true },
        tooltip: { trigger: 'axis' },
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
        series: [{
          name: 'Pages with Target on',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          connectNulls: true,
          areaStyle: { color: accentColor, opacity: 0.08 },
          lineStyle: { width: 2, color: accentColor },
          itemStyle: { color: accentColor },
          data: values,
        }],
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
  }, [months, values]);

  if (failed) return null;

  return html`
    <div class="mmm2-history-chart">
      <div class="mmm2-history-chart-header">
        <h3 class="mmm2-history-chart-title">Pages with Target on${selectedYear ? ` - ${selectedYear}` : ''}</h3>
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
      ${rows?.length === 0
    ? html`<p class="mmm2-history-chart-empty">No history yet - this graph fills in one day at a time.</p>`
    : html`<div class="mmm2-history-chart-canvas" ref=${containerRef}></div>`}
    </div>
  `;
}

export default TargetActivityChart;
