import { createTag } from '../../../utils/utils.js';
import renderHealthTrend from './health-trend.js';
import renderWorstPages from './worst-pages.js';

function renderPanel(mount, fn) {
  try {
    fn();
  } catch (e) {
    mount.replaceChildren(createTag('div', { class: 'panel-error' }, "Couldn't load panel"));
  }
}

export default async function renderProjectDrilldown(
  container,
  { site, client, charts, daContext, onBack },
) {
  container.replaceChildren();

  const back = createTag('button', { type: 'button', class: 'drilldown-back' }, '← All projects');
  back.addEventListener('click', () => onBack());
  const header = createTag('div', { class: 'drilldown-header' }, [
    back,
    createTag('h3', { class: 'drilldown-title' }, site),
  ]);

  const healthMount = createTag('div', { class: 'panel drilldown-health' });
  const worstMount = createTag('div', { class: 'panel drilldown-worst' });
  container.append(header, healthMount, worstMount);

  let trends;
  let logs;
  try {
    [trends, logs] = await Promise.all([
      client.get('/trends/preflight', { since: '30d', interval: 'week', project: site }),
      client.get('/preflight-logs', { projectKey: site, maxScore: 70, sortBy: 'perf_score', sortOrder: 'asc', limit: 20 }),
    ]);
  } catch (e) {
    container.replaceChildren(
      createTag(
        'div',
        { class: 'dashboard-error' },
        "Couldn't load project data — check sign-in / access.",
      ),
    );
    return;
  }

  renderPanel(healthMount, () => renderHealthTrend(healthMount, trends, charts));
  renderPanel(worstMount, () => renderWorstPages(worstMount, logs.data || [], { daContext }));
}
