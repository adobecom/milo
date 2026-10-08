import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';

const config = {
  codeRoot: '/libs',
  contentRoot: '/test/templates/404/mocks',
  locale: {
    contentRoot: '/test/templates/404/mocks',
    prefix: '',
    ietf: 'en-US',
    tk: 'hah7vzn.css',
  },
};
setConfig(config);

const { default: init } = await import('../../../libs/templates/404/404.js');

describe('Feds 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-feds.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Appends a libs 404 fragment link', () => {
    expect(document.querySelector('a').href.includes('/libs/')).to.be.true;
  });
});

describe('Feds 404 - geo (Lingo) resolution', () => {
  afterEach(() => {
    sessionStorage.removeItem('akamai');
    const miloConfig = getConfig();
    delete miloConfig.locale.regions;
  });

  it('Uses the resolved geo region prefix when lingo is active and a region matches', async () => {
    const miloConfig = getConfig();
    miloConfig.locale.regions = { th_en: { prefix: '/th_en', region: 'th' } };
    sessionStorage.setItem('akamai', 'th');

    document.head.innerHTML = await readFile({ path: './mocks/head-feds-geo.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();

    expect(document.querySelector('a').href.includes('/th_en/fragments/404')).to.be.true;
  });

  it('Falls back to the path-derived locale when no geo region matches', async () => {
    const miloConfig = getConfig();
    miloConfig.locale.regions = { th_en: { prefix: '/th_en', region: 'th' } };
    sessionStorage.setItem('akamai', 'fr');

    document.head.innerHTML = await readFile({ path: './mocks/head-feds-geo.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();

    expect(document.querySelector('a').href.includes('/libs/')).to.be.true;
    expect(document.querySelector('a').href.includes('/th_en/')).to.be.false;
  });
});

describe('Local 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-local.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Appends a local 404 fragment link', () => {
    expect(document.querySelector('a').href.includes(config.contentRoot)).to.be.true;
  });
});

describe('Legacy 404', () => {
  before(async () => {
    document.head.innerHTML = await readFile({ path: './mocks/head-legacy.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Adds legacy 404 from locale contentRoot', () => {
    expect([...document.body.classList].includes('legacy-404')).to.be.true;
  });
});

describe('Legacy 404 Fallback', () => {
  before(async () => {
    const miloConfig = getConfig();
    miloConfig.locale.contentRoot = '';
    document.head.innerHTML = await readFile({ path: './mocks/head-legacy.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  it('Fallback to contentRoot legacy 404', () => {
    expect([...document.body.classList].includes('legacy-404')).to.be.true;
  });
});

describe('Versioned 404 - fragment exists', () => {
  let fetchStub;

  before(async () => {
    const { fetch: originalFetch } = window;
    fetchStub = sinon.stub(window, 'fetch').callsFake((resource, options) => {
      if (resource.toString().includes('/fragments/v2/404.plain.html')) {
        return Promise.resolve(new Response('<div>versioned fragment</div>', { status: 200 }));
      }
      return originalFetch(resource, options);
    });
    document.head.innerHTML = await readFile({ path: './mocks/head-versioned.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  after(() => fetchStub.restore());

  it('Loads the geo-specific versioned fragment content', () => {
    expect(document.querySelector('main').textContent.includes('versioned fragment')).to.be.true;
  });
});

describe('Versioned 404 - invalid metadata value does not attempt fetch', () => {
  let fetchStub;

  before(async () => {
    const { fetch: originalFetch } = window;
    fetchStub = sinon.stub(window, 'fetch').callsFake((resource, options) => originalFetch(resource, options));
    document.head.innerHTML = await readFile({ path: './mocks/head-versioned-invalid.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  after(() => fetchStub.restore());

  it('Treats a non-version value (e.g. "false") as disabled and falls back to style', () => {
    const versionedFetchCalls = fetchStub.getCalls()
      .filter((call) => call.args[0]?.toString().includes('/fragments/false/404'));
    expect(versionedFetchCalls.length).to.equal(0);
    const { href } = document.querySelector('a');
    expect(href.includes('/libs/')).to.be.true;
  });
});

describe('Versioned 404 - fragment missing falls back to style', () => {
  let fetchStub;

  before(async () => {
    const { fetch: originalFetch } = window;
    fetchStub = sinon.stub(window, 'fetch').callsFake((resource, options) => {
      if (resource.toString().includes('/fragments/v2/404.plain.html')) {
        return Promise.resolve(new Response('', { status: 404 }));
      }
      return originalFetch(resource, options);
    });
    document.head.innerHTML = await readFile({ path: './mocks/head-versioned.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await init();
  });

  after(() => fetchStub.restore());

  it('Falls back to the feds 404 fragment link', () => {
    const { href } = document.querySelector('a');
    expect(href.includes('/fragments/v2/404')).to.be.false;
    expect(href.includes('/libs/')).to.be.true;
  });
});
