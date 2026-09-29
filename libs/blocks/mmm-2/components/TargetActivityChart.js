import { html, useEffect, useRef, useState } from '../../../deps/htm-preact.js';
import { loadScript, getConfig } from '../../../utils/utils.js';
import { API_URLS } from '../../../features/personalization/preview.js';

const HISTORY_DAYS = 30;

function formatDateLabel(dateStr) {
  // dateStr is a plain YYYY-MM-DD calendar day (see /get-target-history) - parsed as
  // UTC midnight and formatted back in UTC so it can't drift a day either direction
  // depending on the viewer's timezone.
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/**
 * Line chart of "pages with Target on" for each of the last HISTORY_DAYS days, backed
 * by GET /get-target-history (a daily snapshot table - see mep_manager_sls). Renders
 * nothing (returns null) if the fetch fails outright; shows an empty-state message if
 * the endpoint responds but there's no snapshot history yet.
 */
function TargetActivityChart() {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [history, setHistory] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URLS.history}?days=${HISTORY_DAYS}`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setHistory(data?.result ?? []); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!history?.length || !containerRef.current) return undefined;
    let disposed = false;
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;

    loadScript(`${base}/deps/echarts.common.min.js`).then(() => {
      if (disposed || !containerRef.current || !window.echarts) return;
      const accentColor = getComputedStyle(containerRef.current).getPropertyValue('--color-accent').trim() || '#4046CA';
      const chart = window.echarts.init(containerRef.current, null, { renderer: 'svg' });
      chartRef.current = chart;
      chart.setOption({
        grid: { left: 36, right: 16, top: 20, bottom: 28 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: history.map((row) => formatDateLabel(row.date)),
        },
        yAxis: { type: 'value', minInterval: 1 },
        series: [{
          name: 'Pages with Target on',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: { color: accentColor, opacity: 0.08 },
          lineStyle: { width: 2, color: accentColor },
          itemStyle: { color: accentColor },
          data: history.map((row) => row.targetOnCount),
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
  }, [history]);

  if (failed) return null;

  return html`
    <div class="mmm2-history-chart">
      <h3 class="mmm2-history-chart-title">Pages with Target on - last ${HISTORY_DAYS} days</h3>
      ${history?.length === 0
    ? html`<p class="mmm2-history-chart-empty">No history yet - this graph fills in one day at a time.</p>`
    : html`<div class="mmm2-history-chart-canvas" ref=${containerRef}></div>`}
    </div>
  `;
}

export default TargetActivityChart;
