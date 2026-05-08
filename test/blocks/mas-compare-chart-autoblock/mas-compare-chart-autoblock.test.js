import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

if (!customElements.get('mas-compare-chart')) {
  customElements.define('mas-compare-chart', class extends HTMLElement {
    checkReady() {
      this.readyChecked = true;
      return Promise.resolve(true);
    }
  });
}

const { default: init } = await import('../../../libs/blocks/mas-compare-chart-autoblock/mas-compare-chart-autoblock.js');

const BASE_CONFIG = {
  codeRoot: '/libs',
  env: { name: 'stage' },
};

function createLink(href) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = 'mas-compare-chart: ACOM / Compare Chart';
  return a;
}

describe('mas-compare-chart-autoblock', () => {
  beforeEach(() => {
    setConfig(BASE_CONFIG);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('creates mas-compare-chart wrapping aem-fragment with correct attributes', async () => {
    const p = document.createElement('p');
    const a = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&path=acom&fragment=compare-chart-1');
    p.append(a);
    document.body.append(p);

    await init(a);

    expect(document.head.querySelector('mas-commerce-service')).to.exist;

    const compareChart = document.querySelector('mas-compare-chart');
    expect(compareChart).to.exist;
    expect(compareChart.hasAttribute('consonant')).to.be.true;
    expect(compareChart.readyChecked).to.be.true;
    expect(compareChart.parentElement).to.equal(document.body);
    expect(document.querySelector('p')).to.not.exist;

    const aemFragment = compareChart.querySelector('aem-fragment');
    expect(aemFragment).to.exist;
    expect(aemFragment.getAttribute('fragment')).to.equal('compare-chart-1');
  });

  it('supports query parameter as fragment id', async () => {
    const a = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&path=acom&query=compare-chart-query-1');
    document.body.append(a);

    await init(a);

    const aemFragment = document.querySelector('mas-compare-chart aem-fragment');
    expect(aemFragment).to.exist;
    expect(aemFragment.getAttribute('fragment')).to.equal('compare-chart-query-1');
  });

  it('returns early when fragment is missing', async () => {
    const a = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&path=acom');
    document.body.append(a);

    await init(a);

    expect(document.querySelector('mas-compare-chart')).to.not.exist;
    expect(document.querySelector('a')).to.equal(a);
  });

  it('preserves sibling content when replacing an inline link', async () => {
    const p = document.createElement('p');
    p.append(
      document.createTextNode('Before '),
      createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&fragment=compare-chart-inline-1'),
      document.createTextNode(' after'),
    );
    const a = p.querySelector('a');
    document.body.append(p);

    await init(a);

    const compareChart = document.querySelector('mas-compare-chart');
    expect(compareChart).to.exist;
    expect(compareChart.parentElement).to.equal(p);
    expect(p.textContent).to.contain('Before');
    expect(p.textContent).to.contain('after');
  });

  it('applies MEP fragment replacement overrides', async () => {
    setConfig({
      ...BASE_CONFIG,
      mep: {
        preview: true,
        inBlock: {
          mas: {
            fragments: {
              'compare-chart-original': {
                action: 'replace',
                manifestId: 'promo1.json',
                content: 'compare-chart-promo',
              },
            },
          },
        },
      },
    });
    const a = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&fragment=compare-chart-original');
    document.body.append(a);

    await init(a);

    const aemFragment = document.querySelector('mas-compare-chart aem-fragment');
    expect(aemFragment.getAttribute('fragment')).to.equal('compare-chart-promo');
  });

  it('uses cached loading for repeated fragments', async () => {
    const a1 = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&fragment=compare-chart-cache');
    const a2 = createLink('https://mas.adobe.com/studio.html#content-type=mas-compare-chart&fragment=compare-chart-cache');
    document.body.append(a1, a2);

    await init(a1);
    await init(a2);

    const fragments = document.querySelectorAll('mas-compare-chart aem-fragment');
    expect(fragments.length).to.equal(2);
    expect(fragments[0].getAttribute('loading')).to.not.exist;
    expect(fragments[1].getAttribute('loading')).to.equal('cache');
  });
});
