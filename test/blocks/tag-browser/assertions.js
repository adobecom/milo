// eslint-disable-next-line import/no-extraneous-dependencies -- Provided by Web Test Runner.
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { sendMouse } from '@web/test-runner-commands';
import init from '../../../libs/blocks/tag-browser/tag-browser.js';
import { normalizeTags } from '../../../libs/blocks/tag-browser/tag-utils.js';
import { actions } from './mocks/sdk.js';
import { delay } from '../../helpers/waitfor.js';

const chimera = {
  namespaces: {
    caas: {
      name: 'caas',
      title: 'CaaS',
      tags: {
        products: {
          tagID: 'caas:products',
          title: 'Products',
          tags: {
            analytics: {
              tagID: 'caas:products/analytics',
              title: 'Analytics',
              tags: {},
            },
          },
        },
      },
    },
  },
};
const sheet = {
  data: [
    {
      id: 'wrapper:analytics',
      group: 'primaryProductName',
      label: 'Adobe Analytics',
      value: 'Analytics',
      active: true,
    },
    {
      id: 'wrapper:retired',
      group: 'primaryProductName',
      label: 'Retired',
      value: 'Retired',
      active: false,
    },
  ],
};

runTests(() => {
  describe('Tag browser', () => {
    let block;
    let browser;
    let fetchStub;
    let sendText;
    let parentStub;

    const root = () => browser.shadowRoot;
    const titles = () => [...root().querySelectorAll('.tag-title')].map((el) => el.textContent.trim());
    const settle = async () => {
      await browser.updateComplete;
      await browser.updateComplete;
    };
    const clickTitle = async (label) => {
      [...root().querySelectorAll('.tag-title')]
        .find((el) => el.textContent.trim() === label).click();
      await settle();
      await delay(110);
    };
    const searchFor = async (query) => {
      const input = root().querySelector('input');
      input.value = query;
      input.dispatchEvent(new Event('input'));
      await settle();
    };
    const add = (label) => root().querySelector(`[aria-label="Insert tag ${label}"]`);
    const setup = async (rows = [
      ['CaaS', 'https://www.adobe.com/chimera-api/tags?include=caas:products/,caas:products/analytics/&v=1'],
      ['Tags', '/Taxonomy.json'],
      ['', ''],
    ]) => {
      rows.forEach(([label, url]) => {
        const row = document.createElement('div');
        const name = document.createElement('div');
        name.textContent = label;
        const cell = document.createElement('div');
        const link = document.createElement('a');
        link.setAttribute('href', url);
        cell.append(link);
        row.append(name, cell);
        block.append(row);
      });
      await init(block);
      browser = block.querySelector('milo-tag-browser');
      if (browser) {
        await settle();
        await delay(110);
      }
    };

    beforeEach(() => {
      parentStub = sinon.stub(window, 'parent').value({});
      block = document.createElement('div');
      block.className = 'tag-browser';
      document.body.append(block);
      fetchStub = sinon.stub(window, 'fetch').callsFake(async (url) => new Response(
        JSON.stringify(url.includes('chimera-api') ? chimera : sheet),
      ));
      sendText = sinon.stub(actions, 'sendText');
    });

    afterEach(() => {
      block.remove();
      sinon.restore();
    });

    it('loads group/value-only sheets and merges matching values within each group', async () => {
      const value = 'Shared Value';
      fetchStub.onFirstCall().resolves(new Response(JSON.stringify({
        data: [
          { group: 'primaryProductName', value },
          { group: 'serp-content-type', value },
          { group: 'primaryProductName', value: ' ' },
          { group: 'primaryProductName' },
          { group: 'primaryProductName', value: 'Inactive', active: false },
        ],
      })));
      fetchStub.onSecondCall().resolves(new Response(JSON.stringify({
        data: [
          { group: 'primaryProductName', value },
          { group: 'primaryProductName', value: 'Other Value' },
        ],
      })));
      await setup([['Tags', '/part-one.json'], ['Tags', '/part-two.json']]);
      expect(titles()).to.deep.equal(['primaryProductName', 'serp-content-type']);
      expect(browser.rootTags.map((tag) => tag.children.map((child) => child.value)))
        .to.deep.equal([[value, 'Other Value'], [value]]);
      await clickTitle('primaryProductName');
      expect(titles()).to.deep.equal(['primaryProductName', 'serp-content-type', value, 'Other Value']);
      add(value).click();
      expect(sendText.lastCall.args).to.deep.equal([value]);
      await clickTitle('serp-content-type');
      expect(titles()).to.deep.equal(['primaryProductName', 'serp-content-type', value]);
    });

    it('uses authored URLs without adding source-name wrapper columns', async () => {
      await setup();
      expect(titles()).to.deep.equal(['CaaS Tags', 'primaryProductName']);
      expect(fetchStub.callCount).to.equal(2);
      expect(fetchStub.firstCall.args[0]).to.equal('https://www.adobe.com/chimera-api/tags?include=caas:products/,caas:products/analytics/&v=1');
      expect(fetchStub.secondCall.args[0]).to.equal(`${window.location.origin}/Taxonomy.json`);
      expect(root().querySelector('.tag-back')).to.be.null;
      expect(root().querySelector('.tag-help, .tag-status, .tag-path')).to.be.null;
    });

    it('preserves the legacy columns, separate navigation icons and back control', async () => {
      await setup();
      root().querySelector('[aria-label="Navigate to CaaS Tags"]').click();
      await settle();
      expect(titles()).to.deep.equal(['CaaS Tags', 'primaryProductName', 'Products', 'Analytics']);
      expect(root().querySelectorAll('.tag-group-column').length).to.equal(2);
      expect(root().querySelectorAll('.tag-group-column')[1].querySelector('.tag-navigate')).to.be.null;
      expect(root().querySelector('.tag-insert use').getAttribute('href')).to.equal('#spectrum-AddCircle');
      root().querySelector('.tag-back').click();
      await settle();
      expect(titles()).to.deep.equal(['CaaS Tags', 'primaryProductName']);
      expect(root().querySelector('.tag-back')).to.be.null;
    });

    it('filters only displayed columns by title, just like the old tool', async () => {
      await setup();
      await searchFor('Analytics');
      expect(titles()).to.deep.equal([]);
      expect(root().querySelectorAll('.tag-group-column').length).to.equal(1);
      await searchFor('');
      await clickTitle('CaaS Tags');
      await searchFor('ANALYTICS');
      expect(titles()).to.deep.equal(['Analytics']);
      expect(root().querySelectorAll('.tag-group-column').length).to.equal(2);
      await searchFor('caas:products/analytics');
      expect(titles()).to.deep.equal([]);
      await searchFor('');
      expect(titles()).to.deep.equal(['CaaS Tags', 'primaryProductName', 'Products', 'Analytics']);
    });

    it('inserts parent and leaf values with the legacy comma and blur behavior', async () => {
      await setup();
      await clickTitle('CaaS Tags');
      add('Products').focus();
      add('Products').click();
      const { x, y, width, height } = add('Analytics').getBoundingClientRect();
      await sendMouse({
        type: 'click',
        position: [Math.round(x + width / 2), Math.round(y + height / 2)],
      });
      expect(sendText.args).to.deep.equal([['caas:products'], [', caas:products/analytics']]);
      const outside = document.createElement('button');
      document.body.append(outside);
      outside.focus();
      add('Analytics').click();
      expect(sendText.lastCall.args).to.deep.equal(['caas:products/analytics']);
      outside.remove();
    });

    it('keeps DA group tags selectable and inserts sheet values, not wrapper IDs', async () => {
      await setup();
      await clickTitle('primaryProductName');
      add('primaryProductName').click();
      add('Adobe Analytics').click();
      expect(sendText.args).to.deep.equal([['primaryProductName'], [', Analytics']]);
      expect(titles()).not.to.include('Retired');
    });

    it('does not replace DA insertion with a standalone clipboard mode', async () => {
      parentStub.value(window);
      await setup();
      await clickTitle('primaryProductName');
      expect(add('Adobe Analytics').disabled).to.be.true;
      expect(root().querySelector('[aria-label^="Copy"]')).to.be.null;
    });

    it('omits ancestor containers not selected by the authored filter', async () => {
      await setup([['CaaS', 'https://www.adobe.com/chimera-api/tags?include=caas:products/analytics/&v=1']]);
      await clickTitle('CaaS Tags');
      expect(titles()).to.deep.equal(['CaaS Tags', 'Analytics']);
      add('Analytics').click();
      expect(sendText.lastCall.args).to.deep.equal(['caas:products/analytics']);
    });

    it('matches exact, subtree and wildcard filters with exclusions taking precedence', () => {
      const source = JSON.parse(JSON.stringify(chimera));
      source.namespaces.caas.tags.products.tags.analytics.tags.reports = {
        tagID: 'caas:products/analytics/reports',
        title: 'Reports',
        tags: {},
      };
      source.namespaces.caas.tags.products.tags.target = {
        tagID: 'caas:products/target',
        title: 'Target',
        tags: {},
      };
      const products = 'caas:products';
      const analytics = `${products}/analytics`;
      const reports = `${analytics}/reports`;
      const target = `${products}/target`;
      const cases = [
        [{}, [products, analytics, reports, target]],
        [{ include: `${products}/` }, [products]],
        [{ include: products, exclude: analytics }, [products, target]],
        [{ include: `${products}/*/`, exclude: `${products}/an?lytics/` }, [target]],
        [{ include: `${products}/**/` }, [analytics, reports, target]],
        [{ include: `${products}/**`, exclude: `${reports}/` }, [analytics, target]],
        [{ include: `${analytics}/`, exclude: `${analytics}/` }, []],
        [{ include: `${products}/analyt.cs/` }, []],
      ];
      cases.forEach(([filter, expected]) => {
        const tags = normalizeTags(source, new URLSearchParams(filter));
        expect(tags.flatMap((tag) => tag.children).map((tag) => tag.value), JSON.stringify(filter))
          .to.deep.equal(expected);
      });
    });

    it('flattens selected CaaS descendants and deduplicates split filters by ID', async () => {
      const second = JSON.parse(JSON.stringify(chimera));
      second.namespaces.caas.tags.products.tags.analytics.tags.reports = {
        tagID: 'caas:products/analytics/reports',
        title: 'Reports',
        tags: {},
      };
      second.namespaces.caas.tags.products.tags.target = {
        tagID: 'caas:products/target',
        title: 'Target',
        tags: {},
      };
      fetchStub.onFirstCall().resolves(new Response(JSON.stringify(chimera)));
      fetchStub.onSecondCall().resolves(new Response(JSON.stringify(second)));
      await setup([
        ['CaaS', '/part-one.json?include=caas:products/,caas:products/analytics/'],
        ['CaaS', '/part-two.json?include=caas:products/analytics/,caas:products/analytics/**,caas:products/target/'],
      ]);
      expect(titles()).to.deep.equal(['CaaS Tags']);
      await clickTitle('CaaS Tags');
      expect(titles()).to.deep.equal(['CaaS Tags', 'Products', 'Analytics', 'Reports', 'Target']);
      const tags = browser.rootTags[0].children;
      expect(tags.every((tag) => tag.children.length === 0)).to.be.true;
      expect(tags.map((tag) => tag.value)).to.deep.equal([
        'caas:products',
        'caas:products/analytics',
        'caas:products/analytics/reports',
        'caas:products/target',
      ]);
      add('Reports').click();
      expect(sendText.lastCall.args).to.deep.equal(['caas:products/analytics/reports']);
    });

    it('renders sheet tags when the Chimera source returns an HTTP error', async () => {
      fetchStub.onFirstCall().resolves(new Response('', { status: 503 }));
      await setup();
      expect(titles()).to.deep.equal(['primaryProductName']);
      expect(block.querySelector('p, button')).to.be.null;
      await clickTitle('primaryProductName');
      add('Adobe Analytics').click();
      expect(sendText.lastCall.args).to.deep.equal(['Analytics']);
      expect(fetchStub.callCount).to.equal(2);
    });

    it('renders Chimera tags when the sheet request rejects', async () => {
      fetchStub.onSecondCall().rejects(new Error('Network error'));
      await setup();
      expect(titles()).to.deep.equal(['CaaS Tags']);
      expect(block.querySelector('p, button')).to.be.null;
      await clickTitle('CaaS Tags');
      add('Analytics').click();
      expect(sendText.lastCall.args).to.deep.equal(['caas:products/analytics']);
      expect(fetchStub.callCount).to.equal(2);
    });

    it('ignores missing and unsafe URLs while rendering valid sources', async () => {
      await setup([['Missing', ''], ['Unsafe', 'data:application/json,{}'], ['Tags', '/Taxonomy.json']]);
      expect(titles()).to.deep.equal(['primaryProductName']);
      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.firstCall.args[0]).to.equal(`${window.location.origin}/Taxonomy.json`);
    });

    it('shows the existing load error and Reload control when every source fails', async () => {
      fetchStub.resolves(new Response('', { status: 503 }));
      await setup();
      expect(browser).to.be.null;
      expect(block.querySelector('p').textContent).to.equal('Could not load tags.');
      expect(block.querySelector('button').textContent).to.equal('Reload');
      expect(fetchStub.callCount).to.equal(2);
    });

    it('never fetches a default taxonomy for missing or invalid sources', async () => {
      await setup([['', '']]);
      expect(fetchStub.called).to.be.false;
      expect(browser).to.be.null;
      block.replaceChildren();
      await setup([['Unsafe', 'data:application/json,{}']]);
      expect(fetchStub.called).to.be.false;
      expect(browser).to.be.null;
    });

    it('renders source data as text and preserves its insertion value', async () => {
      const value = '<img src=x onerror=alert(1)>';
      fetchStub.resolves(new Response(JSON.stringify({ data: [{ id: 'safe', label: value, value }] })));
      await setup([['Tags', '/tags.json']]);
      expect(titles()).to.deep.equal([value]);
      expect(root().querySelector('img, script')).to.be.null;
      root().querySelector('.tag-insert').click();
      expect(sendText.lastCall.args).to.deep.equal([value]);
    });

    it('adapts explicit sheet parents and legacy title values without altering their values', () => {
      const tags = normalizeTags({
        data: [
          { id: 'parent', title: 'Parent' },
          {
            id: 'child',
            parent: 'parent',
            label: 'Child label',
            value: 'canonical-child',
          },
          { id: 'hidden', label: 'Hidden', active: 'false' },
          { id: 'hidden-child', parent: 'hidden', label: 'Hidden child' },
        ],
      });
      expect(tags.length).to.equal(1);
      expect(tags[0].value).to.equal('Parent');
      expect(tags[0].children[0].value).to.equal('canonical-child');
      expect(() => normalizeTags({ wrong: [] })).to.throw('Unsupported tag data');
      expect(() => normalizeTags({
        data: [
          { id: 'a', parent: 'b', label: 'A' },
          { id: 'b', parent: 'a', label: 'B' },
        ],
      })).to.throw('cycle');
    });
  });
});
