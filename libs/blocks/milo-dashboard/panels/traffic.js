import { createTag } from '../../../utils/utils.js';

/**
 * Traffic panel — adapter-agnostic. The panel renders whatever a traffic
 * adapter returns; it does not know or care where the data comes from.
 *
 * Adapter contract:
 *   adapter.getTraffic(scope)
 *     -> Promise<null | { buckets: string[], series: [{ name, data: number[] }] }>
 *   - `null` (or no series) => the panel shows a "coming soon" empty state.
 *   - `{ buckets, series }` => the panel renders a line trend chart.
 *
 * Future adapters (deferred pending access):
 *   - RUM adapter: fetch Helix rum-bundles from
 *       https://rum.hlx.page/.../<domain>/<year>/<month>/<day>?domainkey=<KEY>
 *     (requires a per-domain RUM domain key), aggregate pageviews into
 *     { buckets, series }.
 *   - Adobe Analytics adapter: via the Adobe Analytics MCP / report-suite API,
 *     returning the same { buckets, series } shape (requires report-suite auth).
 *
 * Both are deferred until access (RUM domain key / Analytics report-suite auth)
 * is provisioned. The null adapter below ships now as the default.
 */

const COMING_SOON = 'Coming soon — RUM / Adobe Analytics integration pending.';

/** Stub adapter — always resolves null so the panel shows the empty state. */
export const nullTrafficAdapter = {
  async getTraffic() {
    return null;
  },
};

function renderEmpty(panel) {
  panel.append(
    createTag('div', { class: 'traffic-empty' }, [
      createTag('h3', null, 'Traffic'),
      createTag('p', { class: 'traffic-muted' }, COMING_SOON),
    ]),
  );
}

function buildOption(data) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: data.series.map((s) => s.name) },
    xAxis: { type: 'category', data: data.buckets },
    yAxis: { type: 'value' },
    series: data.series.map((s) => ({ name: s.name, type: 'line', data: s.data })),
  };
}

export default async function renderTraffic(container, adapter, charts, scope = {}) {
  container.replaceChildren();
  const panel = createTag('div', { class: 'traffic-panel' });
  container.append(panel);

  let data;
  try {
    data = await adapter.getTraffic(scope);
  } catch (e) {
    renderEmpty(panel);
    return;
  }

  if (!data || !data.series || !data.series.length) {
    renderEmpty(panel);
    return;
  }

  const chartEl = createTag('div', { class: 'traffic-trend' });
  panel.append(chartEl);
  charts.makeChart(chartEl, buildOption(data));
}
