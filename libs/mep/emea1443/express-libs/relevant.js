// eslint-disable-next-line import/prefer-default-export
export async function fetchRelevantRows(path) {
  const { getConfig } = await import('./utils.js');
  if (!window.relevantRows) {
    try {
      const { prefix } = getConfig().locale;
      const resp = await fetch(`${prefix}/express/relevant-rows.json`);
      window.relevantRows = resp.ok ? (await resp.json()).data : [];
    } catch {
      const resp = await fetch('/express/relevant-rows.json');
      window.relevantRows = resp.ok ? (await resp.json()).data : [];
    }
  }

  if (window.relevantRows.length) {
    const relevantRow = window.relevantRows.find((p) => path === p.path);
    const { env } = getConfig();

    if (env && env.name === 'stage') {
      return relevantRow || null;
    }

    return relevantRow && relevantRow.live !== 'N' ? relevantRow : null;
  }

  return null;
}
