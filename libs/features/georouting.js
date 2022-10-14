export default async function loadGeoRouting(config) {
  const resp = await fetch(`${config.locale.contentRoot}/georouting.json`);
  if (!resp.ok) return;
  const json = await resp.json();
  const localeText = json.data.filter((locale) => locale.prefix === config.locale.prefix);
  console.log(localeText[0]);
}
