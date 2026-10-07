import { html, useEffect, useMemo, useRef, useState } from '../../../deps/htm-preact.js';
import { loadScript, getConfig } from '../../../utils/utils.js';
import { API_URLS } from '../../../features/mep/mep-next/mep-next.js';

// Comfortably covers any single calendar year (plus a little of the year before/after)
// of daily snapshots in one request.
const FETCH_DAYS = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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

// Monthly points use the most recent snapshot recorded in each month.
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

function historyForGroup(rows, key) {
  const geos = new Set(key
    ? key.split(',').map((geo) => geo.trim()).filter(Boolean).map((geo) => (geo === 'us' ? '' : geo))
    : ['ALL']);
  const counts = new Map();
  rows.forEach(({ date, geo, targetOnCount }) => {
    if (!geos.has(geo)) return;
    counts.set(date, (counts.get(date) ?? 0) + targetOnCount);
  });
  return [...counts].map(([date, targetOnCount]) => ({ date, targetOnCount }));
}

/**
 * Yearly line chart of "pages with Target on", backed by
 * GET /get-target-history (a daily snapshot table - see mep_manager_sls) which this
 * component aggregates down to month-level, unless the selected year's available
 * history spans fewer than 31 days, in which case it shows daily snapshots.
 * A year dropdown appears once more than
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
  const historyRequestRef = useRef(null);
  const [series, setSeries] = useState(null); // [{ key, label, rows }]
  const [loadedSignature, setLoadedSignature] = useState(null);
  const [renderedSeries, setRenderedSeries] = useState(null);
  const [failed, setFailed] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [breakdownMode, setBreakdownMode] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const showBreakdownToggle = !selectedGeos && geoGroups.length > 0;
  const activeBreakdown = showBreakdownToggle && breakdownMode;
  const selectedGeoLabel = geoGroups.find((group) => group.value === selectedGeos)?.label
    ?? selectedGeos;

  const seriesKeys = useMemo(() => {
    if (selectedGeos) {
      return [{ key: selectedGeos, label: selectedGeoLabel }];
    }
    if (activeBreakdown) return geoGroups.map((g) => ({ key: g.value, label: g.label }));
    return [{ key: '', label: 'All pages' }];
  }, [selectedGeos, selectedGeoLabel, activeBreakdown, geoGroups]);

  // geoGroups (and therefore seriesKeys) can get a new array identity from the parent
  // without its actual content changing (e.g. once the geo config finishes loading
  // async, even while this chart is still showing the single "All pages" series) -
  // depending on this content signature instead of the seriesKeys array reference
  // avoids needless regrouping + chart re-init/re-animate on that update.
  const seriesKeysSignature = seriesKeys.map((s) => `${s.key}|${s.label}`).join(',');

  useEffect(() => {
    if (!expanded || loadedSignature === seriesKeysSignature) return undefined;
    let cancelled = false;
    setFailed(null);
    setLoadedSignature(null);
    const useMock = new URLSearchParams(window.location.search).get('mmm2MockHistory');

    const getHistory = () => {
      const url = `${API_URLS.history}?days=${FETCH_DAYS}&breakdown=true`;
      if (historyRequestRef.current?.url !== url) {
        const promise = fetch(url).then((res) => {
          if (!res.ok) throw new Error(`Target activity history request failed: ${res.status}`);
          return res.json();
        }).then((data) => {
          if (data?.breakdown !== true || !Array.isArray(data.result)
            || data.result.some((row) => typeof row?.geo !== 'string'
              || typeof row.date !== 'string' || !Number.isFinite(row.targetOnCount))) {
            throw new Error('History API does not support bulk geo data. Deploy the updated backend.');
          }
          return data.result;
        }).catch((error) => {
          if (historyRequestRef.current?.promise === promise) historyRequestRef.current = null;
          throw error;
        });
        historyRequestRef.current = { url, promise };
      }
      return historyRequestRef.current.promise;
    };

    const source = useMock
      ? Promise.resolve(seriesKeys.map(({ key, label }) => (
        { key, label, rows: mockHistoryFor(key) }
      )))
      : getHistory().then((rows) => seriesKeys.map(({ key, label }) => (
        { key, label, rows: historyForGroup(rows, key) }
      )));
    source
      .then((resolved) => {
        if (cancelled) return;
        setSeries(resolved);
        setLoadedSignature(seriesKeysSignature);
      })
      .catch((error) => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error('Error loading Target activity history:', error);
        setFailed(error instanceof Error ? error.message : String(error));
      });
    return () => { cancelled = true; };
    // seriesKeys' content is fully captured by seriesKeysSignature (see above) - the
    // array reference itself can churn without meaningful change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesKeysSignature, expanded]);

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

  const { axisLabels, tooltipTitles, plottedSeries } = useMemo(() => {
    if (selectedYear === null || !years.includes(selectedYear)) {
      return { axisLabels: [], tooltipTitles: [], plottedSeries: [] };
    }
    const availableDates = new Set();
    const dailySeries = bucketedSeries.map((s) => {
      const byDay = new Map();
      s.rows.forEach(({ date, targetOnCount }) => {
        if (Number(date.split('-')[0]) !== selectedYear) return;
        availableDates.add(date);
        byDay.set(date, targetOnCount);
      });
      return { label: s.label, byDay };
    });
    const dates = [...availableDates].sort();
    const firstDay = Date.parse(`${dates[0]}T00:00:00Z`);
    const lastDay = Date.parse(`${dates[dates.length - 1]}T00:00:00Z`);
    const dayCount = (lastDay - firstDay) / DAY_MS + 1;
    if (dayCount < 31) {
      const days = Array.from({ length: dayCount }, (_, i) => {
        const date = new Date(firstDay + i * DAY_MS);
        return {
          key: date.toISOString().slice(0, 10),
          month: date.getUTCMonth(),
          day: date.getUTCDate(),
        };
      });
      return {
        axisLabels: days.map(({ month, day }) => `${MONTH_LABELS[month]} ${day}`),
        tooltipTitles: days.map(({ month, day }) => `${FULL_MONTH_LABELS[month]} ${day}, ${selectedYear}`),
        plottedSeries: dailySeries.map((s) => ({
          label: s.label,
          values: days.map(({ key }) => s.byDay.get(key) ?? null),
        })),
      };
    }
    const now = new Date();
    const startMonth = selectedYear === firstYear ? firstMonth : 0;
    const endMonth = selectedYear === now.getUTCFullYear() ? now.getUTCMonth() : 11;
    const monthIndices = [];
    for (let m = startMonth; m <= endMonth; m += 1) monthIndices.push(m);
    return {
      axisLabels: monthIndices.map((m) => MONTH_LABELS[m]),
      tooltipTitles: monthIndices.map((m) => `${FULL_MONTH_LABELS[m]}, ${selectedYear}`),
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
    if (!axisLabels.length || !containerRef.current) return undefined;
    let disposed = false;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;

    loadScript(`${base}/deps/echarts.common.min.js`).then(() => {
      if (disposed || !containerRef.current) return;
      if (!window.echarts) throw new Error('Chart library did not initialize');
      const style = getComputedStyle(containerRef.current);
      const accentColor = style.getPropertyValue('--color-accent').trim() || '#4046CA';
      const dark = !!containerRef.current.closest('.mmm-2.dark');
      const textColor = style.getPropertyValue('--text-color').trim() || '#f5f5f5';
      const borderColor = style.getPropertyValue('--color-gray-200').trim() || '#444';
      const surface = style.getPropertyValue('--mmm2-surface').trim() || '#202020';
      const darkColors = ['#82b4ff', '#ffab70', '#65d6b0', '#ff8b85', '#c6a0ff', '#75d0ff', '#f5d36c', '#c4c4c4'];
      const isSingleLine = plottedSeries.length === 1;
      const chart = window.echarts.init(containerRef.current, null, { renderer: 'svg' });
      chartRef.current = chart;
      chart.setOption({
        ...(dark ? { textStyle: { color: textColor } } : {}),
        grid: {
          left: 8,
          right: 16,
          top: 20,
          bottom: 28,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          order: 'valueDesc',
          textStyle: { fontSize: 11, ...(dark ? { color: textColor } : {}) },
          ...(dark ? { backgroundColor: surface, borderColor } : {}),
          padding: [6, 8],
          extraCssText: 'max-height: 320px; overflow-y: auto; line-height: 1.4;',
          formatter: (params) => {
            if (!params.length) return '';
            const label = params[0].axisValueLabel ?? params[0].axisValue;
            const title = tooltipTitles[axisLabels.indexOf(label)] ?? label;
            const rows = params
              .slice()
              .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
              .map((p) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                <span>${p.marker}${p.seriesName}</span>
                <strong>${p.value == null ? 'No data' : p.value.toLocaleString()}</strong>
              </div>`)
              .join('');
            return `<div style="font-weight:600;margin-bottom:4px;">${title}</div>${rows}`;
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: axisLabels,
          ...(dark ? {
            axisLabel: { color: textColor },
            axisLine: { lineStyle: { color: borderColor } },
            axisTick: { lineStyle: { color: borderColor } },
          } : {}),
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            formatter: (value) => formatCount(value),
            ...(dark ? { color: textColor } : {}),
          },
          ...(dark ? { splitLine: { lineStyle: { color: borderColor } } } : {}),
        },
        series: plottedSeries.map((s, i) => {
          const paletteColor = dark ? darkColors[i % darkColors.length] : seriesColor(i);
          const color = isSingleLine ? accentColor : paletteColor;
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
      setRenderedSeries(series);
    }).catch((error) => {
      if (disposed) return;
      // eslint-disable-next-line no-console
      console.error('Error rendering Target activity history:', error);
      setFailed(error instanceof Error ? error.message : String(error));
    });

    const handleResize = () => chartRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [axisLabels, tooltipTitles, plottedSeries, series]);

  // The chart's container is never unmounted while collapsed (just hidden via CSS), so
  // echarts keeps its instance - but it was laid out at zero size while hidden, so it
  // needs an explicit resize once it becomes visible again to fill the space correctly.
  useEffect(() => {
    if (!expanded) return;
    requestAnimationFrame(() => chartRef.current?.resize());
  }, [expanded]);

  const isEmpty = series?.every((s) => s.rows.length === 0);
  const loading = expanded && !failed && (loadedSignature !== seriesKeysSignature
    || (!isEmpty && renderedSeries !== series));
  const currentYear = new Date().getUTCFullYear();
  const titleSuffix = selectedYear && selectedYear !== currentYear ? ` - ${selectedYear}` : '';
  let chartBody;
  if (failed) {
    chartBody = html`<p class="mmm2-history-chart-empty" role="alert">Unable to load history. ${failed} Change the view or geo filter to try again.</p>`;
  } else if (isEmpty && !loading) {
    chartBody = html`<p class="mmm2-history-chart-empty">No history yet - this graph fills in one day at a time.</p>`;
  } else {
    chartBody = html`<div class="mmm2-history-chart-canvas ${loading ? 'is-loading' : ''}" ref=${containerRef}></div>`;
  }

  return html`
    <div class="mmm2-history-chart">
      <div class="mmm2-history-chart-summary">
        <button
          type="button"
          class="mmm2-history-chart-summary-toggle"
          aria-expanded=${expanded}
          onClick=${() => setExpanded((prev) => !prev)}>
          <span class="mmm2-history-chart-summary-chevron"></span>
          <span class="mmm2-history-chart-summary-title">Target Activity Historical Data${titleSuffix}</span>
        </button>
        ${expanded ? html`
          <div class="mmm2-history-chart-controls">
            ${selectedGeos ? html`
              <span class="mmm2-history-chart-geo-label"><strong>Geo:</strong> ${selectedGeoLabel}</span>
            ` : null}
            ${showBreakdownToggle ? html`
              <div class="mmm2-form-field">
                <label for="mmm2-history-chart-breakdown">View:</label>
                <select
                  id="mmm2-history-chart-breakdown"
                  value=${breakdownMode ? 'geo' : 'all'}
                  onChange=${(e) => {
    const nextBreakdown = e.target.value === 'geo';
    if (nextBreakdown === breakdownMode) return;
    setLoadedSignature(null);
    setFailed(null);
    setBreakdownMode(nextBreakdown);
  }}>
                  <option value="all">All pages</option>
                  <option value="geo">By geo</option>
                </select>
              </div>
            ` : null}
            ${years.length > 1 ? html`
              <div class="mmm2-form-field">
                <label for="mmm2-history-chart-year">Year:</label>
                <select
                  id="mmm2-history-chart-year"
                  value=${selectedYear ?? ''}
                  onChange=${(e) => setSelectedYear(Number(e.target.value))}>
                  ${years.slice().reverse().map((year) => html`<option value=${year}>${year}</option>`)}
                </select>
              </div>
            ` : null}
          </div>
        ` : null}
      </div>
      <div class="mmm2-history-chart-body" aria-busy=${loading} style=${expanded ? '' : 'display: none;'}>
        ${chartBody}
        ${loading ? html`<div class="mmm2-history-chart-loading" role="status"><span>Loading history...</span></div>` : null}
      </div>
    </div>
  `;
}

export default TargetActivityChart;
