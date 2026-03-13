import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const mockIndexResponses = {
  'https://stage--da-bacom--adobecom.aem.live/br/query-index.json?offset=0&limit=500': {
    total: 2,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/br/customer-success-stories/alpina-case-study.html',
        title: 'Alpina Case Study',
      },
      {
        path: '/br/customer-success-stories/hidden-case-study.html',
        title: 'Hidden Case Study',
        robots: ' NoIndex,  NoFollow ',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/ca/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/ca/resources/example.html',
        title: 'English Example | Adobe',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/ca-secondary/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/ca/resources/second-example.html',
        title: 'Second English Example',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/ca_fr/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/ca_fr/resources/exemple.html',
        title: 'Exemple Francais',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/ch_fr/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [{ path: '/ch_fr/resources/bonjour-le-monde.html' }],
  },
  'https://stage--da-bacom--adobecom.aem.live/ch_de/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        url: 'https://business.adobe.com/ch_de/resources/hallo-welt.html',
        title: 'Hallo Welt',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/dk/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/dk/resources/eksempel.html',
        title: 'Dansk Eksempel',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/th_en/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/th_en/resources/example.html',
        title: 'Thailand Example',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/la/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/la/resources/example.html',
        title: 'Latin America Example',
      },
    ],
  },
  'https://stage--da-bacom--adobecom.aem.live/mena_en/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/mena_en/resources/example.html',
        title: 'MENA Example',
        robots: 'NOINDEX, NOFOLLOW',
      },
    ],
  },
};

describe('Sitemap Extended', () => {
  let init;
  let originalSearch;

  async function renderBlock(options = {}) {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const block = document.querySelector('.sitemap-extended');

    if (options.blockClass) {
      block.classList.add(options.blockClass);
    }

    if (options.search) {
      window.history.replaceState({}, '', `${window.location.pathname}${options.search}`);
    }

    await init(block);
    return document.querySelector('.sitemap-extended-container');
  }

  before(async () => {
    ({ default: init } = await import('../../../libs/blocks/sitemap-extended/sitemap-extended.js'));
    originalSearch = window.location.search;

    sinon.stub(window, 'fetch').callsFake(async (url) => ({
      ok: true,
      status: 200,
      json: async () => mockIndexResponses[url],
    }));
  });

  beforeEach(async () => {
    await renderBlock();
  });

  after(() => {
    sinon.restore();
  });

  afterEach(() => {
    window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}`);
  });

  it('renders country accordion items from configured rows', () => {
    const block = document.querySelector('.sitemap-extended-container');
    const items = block.querySelectorAll('.sitemap-extended-item');

    expect(block).to.exist;
    expect(items).to.have.length(6);
    expect([...items].map((item) => item.querySelector('summary').textContent.trim())).to.deep.equal([
      'Brazil',
      'Canada',
      'Switzerland',
      'Denmark',
      'Thailand',
      'Latin America',
    ]);
  });

  it('renders authored language groups when present', () => {
    const canada = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Canada');
    const labels = [...canada.querySelectorAll('.language-group h4')].map((heading) => heading.textContent.trim());
    const englishGroup = [...canada.querySelectorAll('.language-group')]
      .find((group) => group.querySelector('h4')?.textContent.trim() === 'English');

    expect(labels).to.deep.equal(['English', 'French']);
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca/resources/example.html"]')).to.exist;
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca/resources/second-example.html"]')).to.exist;
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca_fr/resources/exemple.html"]')).to.exist;
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca/resources/example.html"]').textContent.trim()).to.equal('English Example');
    expect(englishGroup.querySelectorAll('li')).to.have.length(2);
  });

  it('falls back to a title derived from the path when the query-index title is missing', () => {
    const switzerland = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Switzerland');
    const frenchLink = switzerland.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/ch_fr/resources/bonjour-le-monde.html"]');
    const germanLink = switzerland.querySelector('a[href="https://business.adobe.com/ch_de/resources/hallo-welt.html"]');

    expect(frenchLink.textContent.trim()).to.equal('Bonjour Le Monde');
    expect(germanLink.textContent.trim()).to.equal('Hallo Welt');
  });

  it('does not render inferred language headings when none are authored', () => {
    const denmark = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Denmark');
    const thailand = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Thailand');

    expect(denmark.querySelector('.language-group h4')).not.to.exist;
    expect(thailand.querySelector('.language-group h4')).not.to.exist;
  });

  it('extracts query-index urls from rendered text instead of stripped href values', () => {
    const brazil = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Brazil');

    expect(brazil.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/br/customer-success-stories/alpina-case-study.html"]')).to.exist;
  });

  it('filters noindex, nofollow entries and removes empty countries by default', () => {
    const brazil = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Brazil');

    expect(brazil.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/br/customer-success-stories/hidden-case-study.html"]')).not.to.exist;
    expect(
      [...document.querySelectorAll('.sitemap-extended-item')]
        .find((item) => item.querySelector('summary').textContent.trim() === 'Middle East & North Africa'),
    ).not.to.exist;
  });

  it('extracts query-index urls from list markup as well as inline text', () => {
    const thailand = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Thailand');

    expect(thailand.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/th_en/resources/example.html"]')).to.exist;
  });
  it('uses authored labels for non-country geo groups', () => {
    const latinAmerica = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Latin America');

    expect(latinAmerica.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/la/resources/example.html"]')).to.exist;
  });

  it('includes noindex entries when the block has include-noindex', async () => {
    const block = await renderBlock({ blockClass: 'include-noindex' });
    const brazil = [...block.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Brazil');
    const mena = [...block.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Middle East & North Africa');

    expect(brazil.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/br/customer-success-stories/hidden-case-study.html"]')).to.exist;
    expect(mena.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/mena_en/resources/example.html"]')).to.exist;
  });

  it('includes noindex entries when sitemap-extended-include-noindex=true is set', async () => {
    const block = await renderBlock({ search: '?sitemap-extended-include-noindex=true' });
    const mena = [...block.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Middle East & North Africa');

    expect(mena.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/mena_en/resources/example.html"]')).to.exist;
  });
});
