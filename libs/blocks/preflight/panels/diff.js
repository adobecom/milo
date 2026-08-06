import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { getPreflightResults } from '../checks/preflightApi.js';

const loading = signal(true);
const details = signal(null);

function hasChanges(d) {
  if (!d || d.skipped || d.error) return false;
  const total = (d.content?.added?.length || 0)
    + (d.content?.modified?.length || 0)
    + (d.content?.removed?.length || 0)
    + (d.metadata?.added?.length || 0)
    + (d.metadata?.modified?.length || 0)
    + (d.metadata?.removed?.length || 0)
    + (d.unpublishedFragments?.length || 0);
  return total > 0;
}

async function getResults() {
  try {
    const results = await getPreflightResults({ url: window.location.href });
    details.value = results?.runChecks?.diff?.[0]?.details || null;
  } catch (e) {
    window.lana?.log?.(`[preflight][diff-panel] ${e.message}`, { tags: 'preflight', errorType: 'i' });
    details.value = null;
  }
  loading.value = false;
}

export default function DiffPanel() {
  useEffect(() => { getResults(); }, []);

  if (loading.value) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-loading">Loading content diff...</p>
      </div>`;
  }

  if (!hasChanges(details.value)) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-empty">No unpublished changes</p>
      </div>`;
  }

  return html`
    <div class="preflight-diff">
      <div class="preflight-diff-panes"></div>
    </div>`;
}
