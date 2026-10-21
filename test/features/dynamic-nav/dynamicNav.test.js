import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import dynamicNav, {
  readState,
  groupsMatch,
  cookiesAvailable,
  getCookieEnvironment,
  cookieAttributes,
  resetCookieAvailability,
} from '../../../libs/features/dynamic-navigation/dynamic-navigation.js';

const COOKIE = 'dynamicNav';
const EXTERNAL_SOURCE = 'https://main--bacom--adobecom.aem.live/some/nav';
const CONSENT = 'OptanonConsent=groups=C0001%3A1%2CC0003%3A1';

const clearCookie = () => { document.cookie = `${COOKIE}=; Max-Age=0; Path=/`; };
const seedCookie = (value) => {
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/`;
};
const addGroupMeta = (group) => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'dynamic-nav-group');
  meta.setAttribute('content', group);
  document.head.appendChild(meta);
};

describe('Dynamic nav (cookie based)', () => {
  beforeEach(() => {
    setConfig({ dynamicNavKey: 'bacom' });
    resetCookieAvailability();
    clearCookie();
    document.cookie = `${CONSENT}; Path=/`;
  });

  afterEach(() => {
    clearCookie();
    document.cookie = 'OptanonConsent=; Max-Age=0; Path=/';
  });

  describe('entry pages', () => {
    it('stores the authored source as an absolute URL and returns the authored url', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      const url = dynamicNav('gnav/aem-sites');
      expect(url).to.equal('gnav/aem-sites');
      const stored = readState();
      expect(stored.source).to.equal(new URL('gnav/aem-sites', window.location.origin).href);
    });

    it('ignores the legacy key argument', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      dynamicNav('gnav/aem-sites', 'legacy-key');
      expect(readState().source).to.contain('/gnav/aem-sites');
    });

    it('persists an absolute source untouched', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      dynamicNav(EXTERNAL_SOURCE);
      expect(readState().source).to.equal(EXTERNAL_SOURCE);
    });

    it('stores the group on entry and clears a stale group on a group-less entry', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      addGroupMeta('demo');
      dynamicNav(EXTERNAL_SOURCE);
      expect(readState().group).to.equal('demo');

      // A subsequent group-less entry must clear the stale group.
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      dynamicNav(EXTERNAL_SOURCE);
      expect(readState().group).to.equal(null);
    });
  });

  describe('off / absent pages', () => {
    it('returns the authored url and does not store anything', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/off.html' });
      const url = dynamicNav('gnav/aem-sites');
      expect(url).to.equal('gnav/aem-sites');
      expect(readState().source).to.equal(null);
    });
  });

  describe('on pages', () => {
    it('returns the stored source when a cookie exists and groups match (ungrouped)', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      const url = dynamicNav('gnav/aem-sites');
      expect(url).to.equal(EXTERNAL_SOURCE);
    });

    it('resolves a source stored on another origin verbatim (cross-origin)', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      // Current origin is localhost, stored source is an aem.live origin.
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });

    it('returns the authored url when no cookie is stored', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      const url = dynamicNav('gnav/aem-sites');
      expect(url).to.equal('gnav/aem-sites');
    });

    it('returns the stored source when both page and stored group match', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      addGroupMeta('Demo');
      seedCookie({ s: EXTERNAL_SOURCE, g: 'demo' });
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });

    it('returns the authored url when the page group does not match the stored group', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      addGroupMeta('guides');
      seedCookie({ s: EXTERNAL_SOURCE, g: 'demo' });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });

    it('does not let a grouped page follow an ungrouped stored nav', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      addGroupMeta('demo');
      seedCookie({ s: EXTERNAL_SOURCE });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });

    it('does not let an ungrouped page follow a grouped stored nav', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE, g: 'demo' });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });
  });

  describe('disable values', () => {
    it('returns the authored url when disable metadata matches', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on-ignore-match.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });

    it('returns the stored source when disable metadata does not match', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on-ignore-does-not-match.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });
  });

  describe('malformed / untrusted cookie data', () => {
    it('ignores a non-JSON cookie value', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      document.cookie = `${COOKIE}=not-valid-json; Path=/`;
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
      expect(readState().malformed).to.equal(true);
    });

    it('ignores a non-http(s) stored source', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      // eslint-disable-next-line no-script-url
      seedCookie({ s: 'javascript:alert(1)' });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
      expect(readState().source).to.equal(null);
    });
  });

  describe('reset pages', () => {
    it('clears stored state and returns the authored url', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/reset.html' });
      seedCookie({ s: EXTERNAL_SOURCE, g: 'demo' });
      const url = dynamicNav('gnav/aem-sites');
      expect(url).to.equal('gnav/aem-sites');
      expect(readState().source).to.equal(null);
    });
  });

  describe('functional cookie consent', () => {
    [
      '',
      'groups=C0001%3A1%2CC0003%3A0',
      'groups=C0001%3A1',
      'groups=C0003%3A10',
      'groups=%E0%A4%A',
    ].forEach((consent) => {
      it(`ignores stored navigation without valid functional consent: "${consent}"`, async () => {
        document.head.innerHTML = await readFile({ path: './mocks/on.html' });
        seedCookie({ s: EXTERNAL_SOURCE });
        document.cookie = consent
          ? `OptanonConsent=${consent}; Path=/`
          : 'OptanonConsent=; Max-Age=0; Path=/';
        expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
        expect(readState().consent).to.be.false;
        expect(readState().source).to.be.null;
      });
    });

    it('rechecks consent after it is revoked and granted without resetting availability', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
      document.cookie = 'OptanonConsent=groups=C0003%3A0; Path=/';
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
      document.cookie = `${CONSENT}; Path=/`;
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });

    it('handles the full OneTrust cookie format', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      document.cookie = 'OptanonConsent=isGpcEnabled=0&groups=C0001%3A1%2CC0003%3A1&AwaitingReconsent=false; Path=/';
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });

    it('handles an entirely URL-encoded consent cookie', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      seedCookie({ s: EXTERNAL_SOURCE });
      document.cookie = `OptanonConsent=${encodeURIComponent('groups=C0001:1,C0003:1')}; Path=/`;
      expect(dynamicNav('gnav/aem-sites')).to.equal(EXTERNAL_SOURCE);
    });
  });

  describe('cookie scope by environment', () => {
    it('shares the cookie across adobe.com subdomains on prod', () => {
      expect(getCookieEnvironment('www.adobe.com', 'https:')).to.deep.equal({ name: 'prod', shareDomain: 'adobe.com', secure: true });
      const attrs = cookieAttributes('business.adobe.com', 'https:');
      expect(attrs).to.include('Domain=adobe.com');
      expect(attrs).to.include('Secure');
      expect(attrs).to.include('SameSite=Lax');
      expect(attrs).to.include('Path=/');
    });

    it('scopes the cookie to stage.adobe.com so stage and prod stay isolated', () => {
      expect(getCookieEnvironment('www.stage.adobe.com', 'https:')).to.deep.equal({ name: 'stage', shareDomain: 'stage.adobe.com', secure: true });
      expect(getCookieEnvironment('stage.adobe.com', 'https:').name).to.equal('stage');
      const attrs = cookieAttributes('business.stage.adobe.com', 'https:');
      expect(attrs).to.include('Domain=stage.adobe.com');
      expect(attrs).to.include('Secure');
    });

    it('does not misclassify prod hosts that merely contain "stage"', () => {
      expect(getCookieEnvironment('backstage.adobe.com', 'https:').name).to.equal('prod');
    });

    it('keeps aem.live EDS hosts host-only (no Domain) with Secure', () => {
      expect(getCookieEnvironment('main--bacom--adobecom.aem.live', 'https:')).to.deep.equal({ name: 'preview', shareDomain: null, secure: true });
      const attrs = cookieAttributes('main--bacom--adobecom.aem.live', 'https:');
      expect(attrs.some((a) => a.startsWith('Domain='))).to.be.false;
      expect(attrs).to.include('Secure');
    });

    it('keeps aem.page EDS hosts host-only (no Domain) with Secure', () => {
      expect(getCookieEnvironment('main--homepage--adobecom.aem.page', 'https:').name).to.equal('preview');
      const attrs = cookieAttributes('main--homepage--adobecom.aem.page', 'https:');
      expect(attrs.some((a) => a.startsWith('Domain='))).to.be.false;
      expect(attrs).to.include('Secure');
    });

    it('treats legacy hlx.page/hlx.live hosts as host-only EDS previews', () => {
      expect(getCookieEnvironment('main--bacom--adobecom.hlx.live', 'https:').name).to.equal('preview');
      expect(getCookieEnvironment('main--bacom--adobecom.hlx.page', 'https:').name).to.equal('preview');
    });

    it('keeps local HTTP origins host-only without Secure', () => {
      expect(getCookieEnvironment('localhost:2000', 'http:')).to.deep.equal({ name: 'local', shareDomain: null, secure: false });
      const attrs = cookieAttributes('localhost:2000', 'http:');
      expect(attrs.some((a) => a.startsWith('Domain='))).to.be.false;
      expect(attrs).to.not.include('Secure');
    });
  });

  describe('groupsMatch helper', () => {
    it('treats missing groups as ungrouped matches', () => {
      expect(groupsMatch('', '')).to.be.true;
      expect(groupsMatch(null, null)).to.be.true;
      expect(groupsMatch('Demo', 'demo')).to.be.true;
      expect(groupsMatch('demo', '')).to.be.false;
      expect(groupsMatch('', 'demo')).to.be.false;
    });
  });

  describe('cookies unavailable', () => {
    let descriptor;
    let lanaLogs;
    let originalLana;
    beforeEach(() => {
      descriptor = Object.getOwnPropertyDescriptor(window.navigator, 'cookieEnabled')
        || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window.navigator), 'cookieEnabled');
      Object.defineProperty(window.navigator, 'cookieEnabled', { configurable: true, get: () => false });
      lanaLogs = [];
      originalLana = window.lana;
      window.lana = { log: (message, opts) => lanaLogs.push({ message, opts }) };
    });
    afterEach(() => {
      // eslint-disable-next-line compat/compat
      delete window.navigator.cookieEnabled;
      if (descriptor && descriptor.configurable && descriptor.get) {
        Object.defineProperty(window.navigator, 'cookieEnabled', descriptor);
      }
      window.lana = originalLana;
    });

    it('reports cookies as unavailable', () => {
      expect(cookiesAvailable()).to.be.false;
      expect(readState().available).to.be.false;
    });

    it('logs an info-level lana entry when cookies are unavailable', () => {
      cookiesAvailable();
      expect(lanaLogs.length).to.equal(1);
      expect(lanaLogs[0].opts.severity).to.equal('info');
      expect(lanaLogs[0].opts.tags).to.equal('dynamic-nav');
    });

    it('returns the authored navigation on an on page without a sessionStorage fallback', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/on.html' });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });

    it('does not throw on an entry page', async () => {
      document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
    });
  });
});

describe('Dynamic nav cookie writes', () => {
  let writes;
  let getterValue;
  let consentValue;
  let reads;

  beforeEach(() => {
    setConfig({ dynamicNavKey: 'bacom' });
    resetCookieAvailability();
    writes = [];
    getterValue = '';
    consentValue = CONSENT;
    reads = 0;
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => {
        reads += 1;
        return [consentValue, getterValue].filter(Boolean).join('; ');
      },
      set: (v) => { writes.push(v); },
    });
  });

  afterEach(() => {
    delete document.cookie;
  });

  it('writes a 30-minute cookie on entry pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/entry.html' });
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(1);
    expect(writes[0]).to.contain(`${COOKIE}=`);
    expect(writes[0]).to.contain('Max-Age=1800');
    expect(writes[0]).to.contain('Path=/');
    expect(writes[0]).to.contain('SameSite=Lax');
  });

  it('does not write on off pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/off.html' });
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(0);
  });

  it('does not write on disabled pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on-ignore-match.html' });
    getterValue = `${COOKIE}=${encodeURIComponent(JSON.stringify({ s: EXTERNAL_SOURCE }))}`;
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(0);
  });

  it('refreshes the cookie when an on page uses the stored nav', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    getterValue = `${COOKIE}=${encodeURIComponent(JSON.stringify({ s: EXTERNAL_SOURCE }))}`;
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(1);
    expect(writes[0]).to.contain('Max-Age=1800');
  });

  it('does not refresh when an on page group does not match', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/on.html' });
    addGroupMeta('guides');
    getterValue = `${COOKIE}=${encodeURIComponent(JSON.stringify({ s: EXTERNAL_SOURCE, g: 'demo' }))}`;
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(0);
  });

  it('expires the cookie on reset pages', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/reset.html' });
    dynamicNav('gnav/aem-sites');
    expect(writes.length).to.equal(1);
    expect(writes[0]).to.contain('Max-Age=0');
  });

  it('does not read stored navigation when functional consent is denied', () => {
    consentValue = 'OptanonConsent=groups=C0003%3A0';
    getterValue = `${COOKIE}=${encodeURIComponent(JSON.stringify({ s: EXTERNAL_SOURCE }))}`;
    expect(readState().source).to.be.null;
    expect(reads).to.equal(1);
    expect(writes).to.have.length(0);
  });

  ['entry', 'on', 'reset'].forEach((setting) => {
    it(`does not write, refresh, or clear on ${setting} pages without consent`, async () => {
      document.head.innerHTML = await readFile({ path: `./mocks/${setting}.html` });
      getterValue = `${COOKIE}=${encodeURIComponent(JSON.stringify({ s: EXTERNAL_SOURCE }))}`;
      consentValue = '';
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
      expect(writes).to.have.length(0);
      consentValue = 'OptanonConsent=groups=C0003%3A0';
      expect(dynamicNav('gnav/aem-sites')).to.equal('gnav/aem-sites');
      expect(writes).to.have.length(0);
    });
  });
});
