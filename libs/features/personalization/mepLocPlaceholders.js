async function customFetch({ resource, withCacheRules }) {
  const options = {};
  if (withCacheRules) {
    const params = new URLSearchParams(window.location.search);
    options.cache = params.get('cache') === 'off' ? 'reload' : 'default';
  }
  return fetch(resource, options);
}

export default async function getMepLocPlaceHolders(manifestPath, localizeLink) {
  const localizedPath = localizeLink(manifestPath);

  const resp = await customFetch({ resource: `${localizedPath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  if (!resp?.ok) {
    window.lana?.log(`Could not get mep placeholders: ${localizedPath}.plain.html`);
    return null;
  }
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('.mep-placeholders > div')).slice(1);
  const mepPlaceHolders = rows.map((row) => {
    const key = row.children[0]?.textContent?.trim();
    const value = row.children[1].innerHTML;
    if (key && value) {
      return { key, value };
    }
    return null;
  }).filter(Boolean);
  return mepPlaceHolders;
}
