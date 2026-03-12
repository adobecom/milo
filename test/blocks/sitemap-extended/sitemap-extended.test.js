import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const mockIndexResponses = {
  'https://stage--da-bacom--adobecom.aem.live/br/query-index.json?offset=0&limit=500': {
    total: 1,
    offset: 0,
    limit: 500,
    data: [
      {
        path: '/br/customer-success-stories/alpina-case-study.html',
        title: 'Alpina Case Study',
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
        title: 'English Example',
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
};

describe('Sitemap Extended', () => {
  let init;

  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    ({ default: init } = await import('../../../libs/blocks/sitemap-extended/sitemap-extended.js'));

    sinon.stub(window, 'fetch').callsFake(async (url) => ({
      ok: true,
      status: 200,
      json: async () => mockIndexResponses[url],
    }));

    await init(document.querySelector('.sitemap-extended'));
  });

  after(() => {
    sinon.restore();
  });

  it('renders country accordion items from configured rows', () => {
    const block = document.querySelector('.sitemap-extended-container');
    const items = block.querySelectorAll('.sitemap-extended-item');

    expect(block).to.exist;
    expect(items).to.have.length(3);
    expect([...items].map((item) => item.querySelector('summary').textContent.trim())).to.deep.equal([
      'Brazil',
      'Canada',
      'Switzerland',
    ]);
  });

  it('renders language groups inferred from each query-index locale', () => {
    const canada = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Canada');
    const labels = [...canada.querySelectorAll('.language-group h4')].map((heading) => heading.textContent.trim());

    expect(labels).to.deep.equal(['English', 'French']);
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca/resources/example.html"]')).to.exist;
    expect(canada.querySelector('.language-group a[href="https://stage--da-bacom--adobecom.aem.live/ca_fr/resources/exemple.html"]')).to.exist;
  });

  it('falls back to a title derived from the path when the query-index title is missing', () => {
    const switzerland = [...document.querySelectorAll('.sitemap-extended-item')]
      .find((item) => item.querySelector('summary').textContent.trim() === 'Switzerland');
    const frenchLink = switzerland.querySelector('a[href="https://stage--da-bacom--adobecom.aem.live/ch_fr/resources/bonjour-le-monde.html"]');
    const germanLink = switzerland.querySelector('a[href="https://business.adobe.com/ch_de/resources/hallo-welt.html"]');

    expect(frenchLink.textContent.trim()).to.equal('Bonjour Le Monde');
    expect(germanLink.textContent.trim()).to.equal('Hallo Welt');
  });
});
