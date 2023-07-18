export function getRegionDisplayName(locale) {
  if (!locale) return null;
  if (locale.rdn) return locale.rdn; // workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=1465052
  const tag = (locale.lang && locale.reg && `${locale.lang}-${locale.reg}`) || locale.lang || locale.ietf;
  if (!Intl || !Intl.DisplayNames) return null;
  try {
    const intlLocale = new Intl.Locale(tag);
    // eslint-disable-next-line
    const displayRegion = new Intl.DisplayNames([intlLocale.language], { type: 'region', fallback: 'none' });
    return displayRegion.of(intlLocale.region) || null;
  } catch {
    return null;
  }
}

export function decorateTitle(config) {
  if (config.addTitleRegionSuffix === 'on') {
    const rdn = getRegionDisplayName(config?.locale);
    if (!rdn || rdn === 'United States') return;
    if (document.title.endsWith(`(${rdn})`)) return;
    document.title = `${document.title} (${rdn})`;
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', document.title);
    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleEl) twitterTitleEl.setAttribute('content', document.title);
  }
}
