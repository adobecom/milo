import { expect } from '@esm-bundle/chai';
import { setConfig, updateConfig, getConfig } from '../../../libs/utils/utils.js';
import { resolveGeoRegion } from '../../../libs/templates/404/geo-locale-utils.js';

const baseLocale = { prefix: '', regions: { uk: { prefix: '/uk', base: 'en' } } };

function setLangFirst(active) {
  document.querySelectorAll('meta[name="langfirst"]').forEach((m) => m.remove());
  if (!active) return;
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'langfirst');
  meta.setAttribute('content', 'true');
  document.head.appendChild(meta);
}

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}

describe('resolveGeoRegion', () => {
  before(() => setConfig({}));

  afterEach(() => {
    clearCookies();
    setLangFirst(false);
    window.sessionStorage.removeItem('akamai');
  });

  it('returns null when lingo is not active', async () => {
    setLangFirst(false);
    updateConfig({ ...getConfig(), locale: baseLocale });

    const region = await resolveGeoRegion();

    expect(region).to.equal(null);
  });

  it('returns null when the locale has no lingo regions', async () => {
    setLangFirst(true);
    updateConfig({ ...getConfig(), locale: { prefix: '' } });

    const region = await resolveGeoRegion();

    expect(region).to.equal(null);
  });

  it('honors a stored international cookie that matches a region over geo-ip', async () => {
    setLangFirst(true);
    updateConfig({ ...getConfig(), locale: baseLocale });
    document.cookie = 'international=uk;path=/';

    const region = await resolveGeoRegion();

    expect(region).to.deep.equal({ prefix: '/uk', base: 'en' });
  });

  it('returns null when the stored international cookie is "us"', async () => {
    setLangFirst(true);
    updateConfig({ ...getConfig(), locale: baseLocale });
    document.cookie = 'international=us;path=/';

    const region = await resolveGeoRegion();

    expect(region).to.equal(null);
  });

  it('falls through to geo-ip lookup when the stored cookie does not match a region', async () => {
    setLangFirst(true);
    updateConfig({ ...getConfig(), locale: baseLocale });
    document.cookie = 'international=zz;path=/';
    // Avoid a real network call to the geo-ip service during the fallback lookup.
    window.sessionStorage.setItem('akamai', 'zz');

    const region = await resolveGeoRegion();

    expect(region).to.equal(null);
  });

  it('matches a region by direct country key via geo-ip', async () => {
    setLangFirst(true);
    const deLocale = { prefix: '', regions: { de: { prefix: '/de', base: 'de' } } };
    updateConfig({ ...getConfig(), locale: deLocale });
    window.sessionStorage.setItem('akamai', 'de');

    const region = await resolveGeoRegion();

    expect(region).to.deep.equal({ prefix: '/de', base: 'de' });
  });

  it('matches a region via mepLingoCountryToRegion when the country key does not match directly', async () => {
    setLangFirst(true);
    updateConfig({
      ...getConfig(),
      locale: baseLocale,
      mepLingoCountryToRegion: { uk: ['gb'] },
    });
    window.sessionStorage.setItem('akamai', 'gb');

    const region = await resolveGeoRegion();

    expect(region).to.deep.equal({ prefix: '/uk', base: 'en' });
  });

  it('returns null when no region matches the resolved country', async () => {
    setLangFirst(true);
    updateConfig({
      ...getConfig(),
      locale: baseLocale,
      mepLingoCountryToRegion: { uk: ['gb'] },
    });
    window.sessionStorage.setItem('akamai', 'fr');

    const region = await resolveGeoRegion();

    expect(region).to.equal(null);
  });
});
