/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay } from '../../helpers/waitfor.js';
import init, {
  productPricingFilterGroups,
  toggleFilterHash,
  toggleParams,
  syncPills,
  countApplied,
  barGroups,
  emptyResultsMarkup,
  filterBarLabels,
  resetParams,
  pageStep,
  scrollEdges,
  scrollOffset,
  categoryOffTags,
  isCategoryOff,
  isStacked,
  searchWidth,
  fixProductPricingVariant,
  scopeToSearch,
  leaveSearch,
  seedParams,
  searchTransition,
  eduOnly,
  groupSelections,
  unavailablePills,
  defaultParams,
  derivedSelections,
  selectCategory,
  mountProductPricingFilter,
} from '../../../libs/blocks/merch-card-collection-autoblock/merch-card-collection-autoblock.js';
import { setConfig } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: '/libs' };
setConfig(conf);

const satellite = { track: sinon.spy() };
const originalFetch = window.fetch;
describe('merch-card-collection autoblock', () => {
  describe('init method', () => {
    // Create mock mas-commerce-service element
    const mockService = document.createElement('mas-commerce-service');
    document.head.appendChild(mockService);
    before(async () => {
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        let mockPath = '/test/blocks/merch-card-collection-autoblock/mocks/fragment.json';
        if (url.includes('with-checkbox-groups')) {
          mockPath = '/test/blocks/merch-card-collection-autoblock/mocks/fragment-with-checkbox-groups.json';
        }
        const result = await originalFetch(mockPath).then(async (res) => {
          if (url.includes('id=1234')) {
            const responseBody = JSON.stringify(await res.json()).replaceAll('049231fd-0c45-4ef5-8792-7fa2dcd5005a', '4567');
            return new Response(responseBody, { status: 200 });
          }
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    beforeEach(() => {
      window._satellite = satellite;
      window._satellite.track.called = false;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('creates collection', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.className).to.include('plans');
    });

    it('replaces only the link paragraph when there are other paragraphs in content', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const intro = document.createElement('p');
      intro.textContent = 'Intro paragraph';
      const linkParagraph = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      linkParagraph.append(a);
      const outro = document.createElement('p');
      outro.textContent = 'Outro paragraph';
      content.append(intro, linkParagraph, outro);
      document.body.append(content);

      await init(a);

      const children = [...content.children];
      expect(children[0]).to.equal(intro);
      expect(children[1].classList.contains('collection-container')).to.be.true;
      expect(children[2]).to.equal(outro);
    });

    it('creates sidenav by default', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
      const sidenavList = sidenav.querySelector('merch-sidenav-list>sp-sidenav');
      expect(sidenavList.querySelectorAll('sp-sidenav-item').length).to.equal(4);
      expect(sidenavList.querySelector('sp-sidenav-item[label=All]')).to.exist;
      expect(sidenavList.querySelector('sp-sidenav-item[label=Cloud]')).to.exist;
      expect(sidenavList.querySelector('sp-sidenav-item[label=Photo]')).to.exist;
    });

    it('test analytics', async () => {
      const root = document.createElement('div');
      root.setAttribute('daa-lh', 'topdaalh');
      const content = document.createElement('div');
      root.append(content);
      content.setAttribute('daa-lh', 'test-analytics');
      content.classList.add('content');
      content.classList.add('tabs');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(root);
      await init(a);
      document.querySelector('.collection-container')?.setAttribute('daa-lh', 'all--cat');
      window._satellite.track.called = false;
      const sidenav = document.querySelector('merch-sidenav');
      const lastFilter = sidenav.querySelector('sp-sidenav-item:last-of-type');
      sidenav.filters.selectElement(lastFilter);
      await delay(100);
      expect(window._satellite.track.called).to.be.true;
      expect(window._satellite.track.args[0][1].data.web.webInteraction.name).to.equal('cat-changed|topdaalh|test-analytics|cloud--cat');
    });

    it('creates does not create sidenav if specified in the query params', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368&sidenav=false');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.not.exist;
    });

    it('overrides collection if mep replace tells to do', async () => {
      setConfig({
        ...conf,
        mep: {
          preview: true,
          inBlock: {
            mas: {
              fragments: {
                'e58f8f75-b882-409a-9ff8-8826b36a8368': {
                  '': {
                    action: 'replace',
                    manifestId: 'promo1.json',
                    content: '1234',
                  },
                },
              },
            },
          },
        },
      });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.getAttribute('overrides')).to.include('e58f8f75-b882-409a-9ff8-8826b36a8368:1234');
      const card = collection.querySelector('merch-card[id="4567"]');
      expect(card).to.exist;
    });
    it('forwards mep maps to collection', async () => {
      setConfig({
        ...conf,
        mep: {
          preview: true,
          inBlock: {
            mas: {
              fragments: {
                'should-be-replaced': {
                  '': {
                    action: 'replace',
                    manifestId: 'promo1.json',
                    content: 'promo-1',
                  },
                },
                'should-also-be-replaced': {
                  '': {
                    action: 'replace',
                    manifestId: 'promo2.json',
                    content: 'promo-2',
                  },
                },
              },
            },
          },
        },
      });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      const collection = document.querySelector('merch-card-collection');
      expect(collection).to.exist;
      expect(collection.getAttribute('overrides')).to.equal('should-be-replaced:promo-1,should-also-be-replaced:promo-2');
    });

    it('sets filter parameter for illustrator single_app', async () => {
      const originalUrl = window.location.href;
      const url = new URL(originalUrl);
      url.searchParams.append('single_app', 'illustrator');
      url.searchParams.append('existing_param', 'value');
      window.history.pushState({}, '', `${url.toString()}`);
      const originalPushState = window.history.pushState;
      const pushStateSpy = sinon.spy();
      window.history.pushState = pushStateSpy;

      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);

      expect(pushStateSpy.called).to.be.true;
      const callArgs = pushStateSpy.firstCall.args;
      expect(callArgs[2]).to.include('filter=illustration');
      expect(callArgs[2]).to.include('single_app=illustrator');
      expect(callArgs[2]).to.include('existing_param=value');

      window.history.pushState = originalPushState;
      window.history.pushState({}, '', `${originalUrl}`);
    });

    it('does not set filter parameter when filter already exists', async () => {
      const originalUrl = window.location.href;
      const url = new URL(originalUrl);
      url.searchParams.append('single_app', 'illustrator');
      url.searchParams.append('filter', 'photography');
      window.history.pushState({}, '', `${url.toString()}`);
      const originalPushState = window.history.pushState;
      const pushStateSpy = sinon.spy();
      window.history.pushState = pushStateSpy;

      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);

      const params = new URLSearchParams(window.location.search);
      expect(params.get('filter')).to.equal('photography');
      expect(params.get('single_app')).to.equal('illustrator');

      window.history.pushState = originalPushState;
      window.history.pushState({}, '', `${originalUrl}`);
    });

    it('creates checkbox groups when fragment includes checkboxGroups data', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=with-checkbox-groups');
      a.textContent = 'merch-card-collection: SANDBOX / Catalog Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      await delay(100);
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
      const checkboxGroups = sidenav.querySelectorAll('merch-sidenav-checkbox-group');
      expect(checkboxGroups.length).to.equal(1);
      const checkboxGroup = checkboxGroups[0];
      expect(checkboxGroup.getAttribute('sidenavCheckboxTitle')).to.equal('Types');
      expect(checkboxGroup.getAttribute('label')).to.equal('types');
      expect(checkboxGroup.getAttribute('deeplink')).to.equal('types');
      const checkboxes = checkboxGroup.querySelectorAll('sp-checkbox');
      expect(checkboxes.length).to.equal(3);
      expect(checkboxes[0].getAttribute('name')).to.equal('desktop');
      expect(checkboxes[0].textContent).to.equal('Desktop');
      expect(checkboxes[1].getAttribute('name')).to.equal('mobile');
      expect(checkboxes[1].textContent).to.equal('Mobile');
      expect(checkboxes[2].getAttribute('name')).to.equal('web');
      expect(checkboxes[2].textContent).to.equal('Web');
    });

    it('does not create checkbox groups when fragment has no checkboxGroups data', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368');
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      await delay(100);
      const sidenav = document.querySelector('merch-sidenav');
      expect(sidenav).to.exist;
      const checkboxGroups = sidenav.querySelectorAll('merch-sidenav-checkbox-group');
      expect(checkboxGroups.length).to.equal(0);
    });

    it('places checkbox groups after filter list in sidenav', async () => {
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=with-checkbox-groups');
      a.textContent = 'merch-card-collection: SANDBOX / Catalog Plans';
      content.append(a);
      document.body.append(content);
      await init(a);
      await delay(100);
      const sidenav = document.querySelector('merch-sidenav');
      const sidenavList = sidenav.querySelector('merch-sidenav-list');
      const checkboxGroup = sidenav.querySelector('merch-sidenav-checkbox-group');
      expect(sidenavList).to.exist;
      expect(checkboxGroup).to.exist;
      // Check that checkbox group comes after sidenav list
      const sidenavChildren = Array.from(sidenav.children);
      const listIndex = sidenavChildren.indexOf(sidenavList);
      const checkboxIndex = sidenavChildren.indexOf(checkboxGroup);
      expect(checkboxIndex).to.be.greaterThan(listIndex);
    });
  });

  describe('MEP Highlight M@S Content markers', () => {
    beforeEach(() => { document.body.innerHTML = ''; });
    afterEach(() => { document.body.innerHTML = ''; });

    it('createCollection stamps data-mas-block=collection on the container and captures original href in mepMasStudioUrls when mep.preview is on', async () => {
      setConfig({ ...conf, mep: { preview: true } });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368';
      const wrap = document.createElement('div');
      wrap.classList.add('content');
      wrap.id = 'mep-collection-test-wrap';
      const a = document.createElement('a');
      a.setAttribute('href', studioHref);
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const container = wrap.querySelector('.collection-container');
      expect(container, 'collection container should be created inside the test wrap').to.exist;
      expect(container.dataset.masBlock).to.equal('collection');
      expect(mepMasStudioUrls.get(container)).to.equal(studioHref);
    });

    it('createCollection does NOT stamp or capture href when mep.preview is off', async () => {
      // The MEP block is gated atomically — both stamps absent means the
      // dynamic import + attachAemLoadListener were skipped too. (We can't
      // spy aem:load directly: M@S's <merch-card> attaches its own internal
      // listener via handleAemFragmentEvents.)
      setConfig({ ...conf, mep: { preview: false } });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card-collection&path=acom&query=e58f8f75-b882-409a-9ff8-8826b36a8368';
      const wrap = document.createElement('div');
      wrap.classList.add('content');
      wrap.id = 'mep-collection-test-wrap-off';
      const a = document.createElement('a');
      a.setAttribute('href', studioHref);
      a.textContent = 'merch-card-collection: SANDBOX / Individual Plans';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const container = wrap.querySelector('.collection-container');
      expect(container, 'collection container should be created inside the test wrap').to.exist;
      expect(container.dataset.masBlock).to.equal(undefined);
      expect(mepMasStudioUrls.get(container)).to.equal(undefined);
    });
  });

  describe('productPricingFilterGroups', () => {
    it('maps hierarchy to a Category group and tagFilters to an optional types group', () => {
      const groups = productPricingFilterGroups({
        placeholders: { filtersCategory: 'Category' },
        hierarchy: [{ label: 'Photo', queryLabel: 'photo' }, { label: 'Video' }],
        sidenavSettings: {
          tagFilters: [
            { title: 'Type', deeplink: 'types', checkboxes: [{ name: 'desktop', label: 'Desktop' }] },
            { title: 'Empty', deeplink: 'types', checkboxes: [] },
          ],
        },
      });
      expect(groups).to.have.length(2);
      expect(groups[0]).to.deep.equal({
        title: 'Category',
        deeplink: 'filter',
        optional: false,
        category: true,
        options: [{ value: 'photo', label: 'Photo' }, { value: 'video', label: 'Video' }],
      });
      expect(groups[1]).to.deep.equal({
        title: 'Type',
        deeplink: 'types',
        optional: true,
        options: [{ value: 'desktop', label: 'Desktop' }],
      });
    });

    it('returns no groups for empty data', () => {
      expect(productPricingFilterGroups({})).to.have.length(0);
    });

    describe('default-<group> metadata', () => {
      const data = {
        hierarchy: [{ label: 'All', queryLabel: 'all' }, { label: 'Featured', queryLabel: 'featured' }],
        sidenavSettings: {
          tagFilters: [
            { deeplink: 'pricing', checkboxes: [{ name: 'individuals', label: 'I' }, { name: 'business', label: 'B' }] },
            { deeplink: 'types', checkboxes: [{ name: 'web', label: 'Web' }] },
          ],
        },
      };
      const meta = (obj) => Object.fromEntries(
        Object.entries(obj).map(([key, text]) => [key, { text }]),
      );
      const defaults = (obj) => defaultParams(productPricingFilterGroups(data, meta(obj)));

      it('opens on the first category, and on no pricing, without metadata', () => {
        expect(defaults({})).to.deep.equal([['filter', 'all']]);
      });

      it('opens on the option a default-<group> row names', () => {
        expect(defaults({ 'default-filter': 'featured', 'default-pricing': 'business' }))
          .to.deep.equal([['filter', 'featured'], ['pricing', 'business']]);
      });

      it('falls back to the first category for an unknown name', () => {
        expect(defaults({ 'default-filter': 'nope', 'default-pricing': 'nope' }))
          .to.deep.equal([['filter', 'all']]);
      });

      it('lets an optional group open on a named option, and empty otherwise', () => {
        expect(defaults({ 'default-types': 'web' })).to.deep.include(['types', 'web']);
        expect(defaults({}).map(([key]) => key)).to.not.include('types');
      });
    });
  });

  describe('category-off-for', () => {
    const tags = categoryOffTags({ 'category-off-for': { text: 'pricing:business, pricing:students-and-teachers' } });

    it('lists the group:tag pairs', () => {
      expect(tags).to.deep.equal(['pricing:business', 'pricing:students-and-teachers']);
      expect(categoryOffTags({})).to.deep.equal([]);
    });

    it('is on only while a listed tag is the selection of its group', () => {
      expect(isCategoryOff(new URLSearchParams('filter=featured&pricing=business'), tags)).to.be.true;
      expect(isCategoryOff(new URLSearchParams('filter=featured&pricing=individuals'), tags)).to.be.false;
      expect(isCategoryOff(new URLSearchParams('filter=featured&types=business'), tags)).to.be.false;
      expect(isCategoryOff(new URLSearchParams('filter=featured'), [])).to.be.false;
    });

    it('leaves the category out of the applied count while off', () => {
      const groups = [{ deeplink: 'filter', category: true }, { deeplink: 'pricing' }];
      const params = new URLSearchParams('filter=featured&pricing=business');
      const labels = (off) => filterBarLabels(params, groups, { allFilters: 'F', filtersApplied: 'A' }, undefined, off);
      expect(labels(false).trigger).to.equal('F (2)');
      expect(labels(true).trigger).to.equal('F (1)');
    });
  });

  describe('filter hash wiring', () => {
    afterEach(() => { window.location.hash = ''; });

    it('sets a single-select filter and replaces it', () => {
      toggleFilterHash('filter', 'photo', false);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('filter')).to.equal('photo');
      toggleFilterHash('filter', 'video', false);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('filter')).to.equal('video');
    });

    it('drops the page from every filter change, not from load-time params', () => {
      const groups = [{ deeplink: 'filter', category: true, options: [{ value: 'a' }] },
        { deeplink: 'pricing', optional: false, options: [{ value: 'x' }] }];
      const params = new URLSearchParams('filter=all&page=2&pricing=x');
      const page = (p) => p.has('page');
      expect(page(toggleParams(params, 'pricing', 'y', false))).to.be.false;
      expect(page(selectCategory(params, groups, 'a'))).to.be.false;
      expect(page(resetParams(params, groups))).to.be.false;
      expect(page(searchTransition(params, 'ps', undefined, groups).params)).to.be.false;
      expect(page(searchTransition(new URLSearchParams('search=ps&page=2'), '', undefined, groups).params)).to.be.false;
      expect(page(searchTransition(params, '', undefined, groups).params ?? params)).to.be.true;
    });

    it('drops the page when a pill changes, so results start at the first page', () => {
      window.location.hash = 'filter=all&page=2&pricing=individual';
      toggleFilterHash('pricing', 'team', false);
      const params = new URLSearchParams(window.location.hash.slice(1));
      expect(params.get('pricing')).to.equal('team');
      expect(params.has('page')).to.be.false;
    });

    it('treats a non-types single-select group as a radio group', () => {
      toggleFilterHash('pricing', 'individual', false);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('pricing')).to.equal('individual');
      toggleFilterHash('pricing', 'team', false);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('pricing')).to.equal('team');
      toggleFilterHash('pricing', 'team', false);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('pricing')).to.equal('team');
    });

    it('keeps types to one value and clears it when the active one is picked again', () => {
      const types = () => new URLSearchParams(window.location.hash.slice(1)).get('types');
      toggleFilterHash('types', 'desktop', true);
      toggleFilterHash('types', 'mobile', true);
      expect(types()).to.equal('mobile');
      toggleFilterHash('types', 'mobile', true);
      expect(types()).to.equal(null);
    });

    it('reflects hash state onto pill inputs', () => {
      const root = document.createElement('div');
      root.innerHTML = `
        <label class="product-pricing-pill"><input type="radio" name="a-filter" value="photo" data-deeplink="filter" data-optional="false"></label>
        <label class="product-pricing-pill"><input type="radio" name="a-filter" value="video" data-deeplink="filter" data-optional="false"></label>
        <label class="product-pricing-pill"><input type="checkbox" name="a-types" value="desktop" data-deeplink="types" data-optional="true"></label>
        <label class="product-pricing-pill"><input type="checkbox" name="a-types" value="mobile" data-deeplink="types" data-optional="true"></label>`;
      syncPills(new URLSearchParams('filter=photo&types=desktop'), root);
      const checked = [...root.querySelectorAll('.product-pricing-pill input')].map((i) => i.checked);
      expect(checked).to.deep.equal([true, false, true, false]);
    });

    it('counts every selected pill, including the default category', () => {
      const groups = [
        { deeplink: 'filter', optional: false },
        { deeplink: 'types', optional: true },
        { deeplink: 'pricing', optional: false },
      ];
      const count = (hash) => countApplied(new URLSearchParams(hash), groups);
      expect(count('')).to.equal(0);
      // 'all' means unfiltered.
      expect(count('filter=all')).to.equal(0);
      expect(count('filter=featured')).to.equal(1);
      expect(count('filter=featured&pricing=individuals')).to.equal(2);
      expect(count('filter=photo&types=desktop&pricing=business')).to.equal(3);
    });

    it('counts a tag group the block has never heard of', () => {
      const params = new URLSearchParams('audience=teams');
      expect(countApplied(params, [{ deeplink: 'audience', optional: false }])).to.equal(1);
    });

    it('shows category and required tag groups in the bar, not optional ones', () => {
      const category = { deeplink: 'filter', optional: false, category: true };
      const types = { deeplink: 'types', optional: true };
      const pricing = { deeplink: 'pricing', optional: false };
      expect(barGroups([category, types, pricing])).to.deep.equal([category, pricing]);
      expect(barGroups([])).to.deep.equal([]);
    });

    it('fills the authored empty-results placeholders', () => {
      const placeholders = {
        noResultsText: '<p>0 results based on your <strong><span data-placeholder="filter"></span></strong></p>',
        noSearchResultsText: '<p>Your search for <span data-placeholder="searchTerm"></span> did not yield any results</p>',
      };
      expect(emptyResultsMarkup(placeholders, { filter: 'Featured' }))
        .to.equal('<p>0 results based on your <strong><span data-placeholder="filter">Featured</span></strong></p>');
      expect(emptyResultsMarkup(placeholders, { searchTerm: 'acrobat' }))
        .to.equal('<p>Your search for <span data-placeholder="searchTerm">acrobat</span> did not yield any results</p>');
      expect(emptyResultsMarkup({}, {})).to.equal('');
    });

    it('derives every displayed label from the filter set and result count', () => {
      const groups = [{
        deeplink: 'filter',
        optional: false,
        category: true,
        options: [{ value: 'featured', label: 'Featured' }],
      }];
      const placeholders = {
        allFilters: 'All Filters',
        filtersApplied: 'Applied',
        filtersResults: 'Results',
        noResultsText: '<p>none for <span data-placeholder="filter"></span></p>',
      };
      const labels = (resultCount) => filterBarLabels(
        new URLSearchParams('filter=featured'),
        groups,
        placeholders,
        resultCount,
      );
      // No render yet: the results label stays blank rather than reading "undefined".
      expect(labels(undefined)).to.deep.equal({
        applied: '1 Applied',
        trigger: 'All Filters (1)',
        results: '',
        announce: '',
        empty: '',
      });
      const some = labels(7);
      expect(some.results).to.equal('7 Results');
      expect(some.empty).to.equal('');
      // Zero fills the authored markup with the active category label.
      expect(labels(0).empty)
        .to.equal('<p>none for <span data-placeholder="filter">Featured</span></p>');
    });

    it('defaults the category to its first option, and the other groups to none', () => {
      const groups = [
        { deeplink: 'filter', category: true, optional: false, options: [{ value: 'featured' }, { value: 'photo' }] },
        { deeplink: 'pricing', optional: false, options: [{ value: 'individuals' }, { value: 'business' }] },
        { deeplink: 'types', optional: true, options: [{ value: 'desktop' }] },
      ];
      expect(defaultParams(groups)).to.deep.equal([['filter', 'featured']]);
      // An authored group with no options contributes nothing.
      expect(defaultParams([{ deeplink: 'filter', category: true, optional: false, options: [] }])).to.deep.equal([]);
      expect(defaultParams([])).to.deep.equal([]);
    });

    it('resets every authored group, restores the defaults, and clears search', () => {
      const groups = [
        { deeplink: 'filter', category: true, optional: false, options: [{ value: 'featured' }] },
        { deeplink: 'pricing', optional: false, options: [{ value: 'individuals' }] },
        { deeplink: 'types', optional: true, options: [{ value: 'desktop' }] },
      ];
      const active = new URLSearchParams('filter=photo&pricing=business&types=desktop&search=acrobat&keep=me');
      const params = resetParams(active, groups);
      // The category comes back at its default. Pricing and Types clear.
      expect(params.get('filter')).to.equal('featured');
      expect(params.get('pricing')).to.equal(null);
      expect(params.get('types')).to.equal(null);
      // Reset clears the search too.
      expect(params.has('search')).to.be.false;
      // Params the block does not own are left alone.
      expect(params.get('keep')).to.equal('me');
      // The given filter set is not mutated.
      expect(active.get('types')).to.equal('desktop');
    });
  });

  describe('filterBarLabels announce', () => {
    const labels = (resultCount) => filterBarLabels(
      new URLSearchParams(),
      [],
      { allFilters: 'F', filtersApplied: 'A', filtersResults: 'Results' },
      resultCount,
    ).announce;

    it('is the count text when there are results', () => expect(labels(3)).to.equal('3 Results'));
    it('is empty before the first render and for zero results', () => {
      expect(labels(undefined)).to.equal('');
      expect(labels(0)).to.equal('');
    });
  });

  describe('pageStep', () => {
    it('scrolls the row minus both fades, at least half the row', () => {
      expect(pageStep(375, 80)).to.equal(215);
      expect(pageStep(200, 80)).to.equal(100);
    });
  });

  describe('scrollEdges', () => {
    const edges = (scrollLeft, scrollWidth, clientWidth) => scrollEdges(
      { scrollLeft, scrollWidth, clientWidth },
    );
    it('shows only the edges with content past them', () => {
      expect(edges(0, 800, 300)).to.deep.equal({ prev: false, next: true });
      expect(edges(200, 800, 300)).to.deep.equal({ prev: true, next: true });
      expect(edges(500, 800, 300)).to.deep.equal({ prev: true, next: false });
    });

    it('measures from the start edge in RTL, where scrollLeft is negative', () => {
      expect(edges(0, 800, 300)).to.deep.equal({ prev: false, next: true });
      expect(edges(-200, 800, 300)).to.deep.equal({ prev: true, next: true });
      expect(edges(-500, 800, 300)).to.deep.equal({ prev: true, next: false });
    });

    it('shows neither edge when the row fits, even after a scroll left it offset', () => {
      expect(edges(0, 799, 799)).to.deep.equal({ prev: false, next: false });
      // Subpixel widths can leave a 1px gap.
      expect(edges(0, 800.5, 799.6)).to.deep.equal({ prev: false, next: false });
    });
  });

  describe('isStacked', () => {
    // 3 pills: 100 + 8 + 100 + 8 + 100 = 316, plus 8 + 261 for the search.
    const pillWidths = [100, 100, 100];
    const stacked = (viewport, barWidth) => isStacked({ viewport, barWidth, pillWidths });
    it('stacks below desktop whatever the width', () => {
      expect(stacked(1279, 5000)).to.be.true;
    });

    it('stacks on desktop only when pills and search no longer fit one line', () => {
      expect(stacked(1280, 585)).to.be.false;
      expect(stacked(1280, 584)).to.be.true;
    });

    it('sizes the search as one card: 3 columns, 4 from 1440, 261px to 474px', () => {
      expect(searchWidth(1280, 1066)).to.equal(350);
      expect(searchWidth(1440, 1200)).to.equal(294);
      expect(searchWidth(1920, 2560)).to.equal(474);
      expect(searchWidth(1280, 585)).to.equal(261);
    });
  });

  describe('fixProductPricingVariant', () => {
    const collectionOf = (variant, ...cardVariants) => {
      const collection = document.createElement('div');
      collection.variant = variant;
      collection.className = `merch-card-collection ${variant} four-merch-cards`;
      cardVariants.forEach((v) => {
        const card = document.createElement('merch-card');
        card.variant = v;
        collection.append(card);
      });
      return collection;
    };

    it('restores product-pricing when a pro card came first', () => {
      const collection = collectionOf('plans', 'pro', 'product-pricing', 'product-pricing');
      fixProductPricingVariant(collection);
      expect(collection.variant).to.equal('product-pricing');
      expect(collection.className).to.equal('merch-card-collection product-pricing');
    });

    it('leaves other collections alone', () => {
      const plans = collectionOf('plans', 'pro', 'plans');
      fixProductPricingVariant(plans);
      expect(plans.variant).to.equal('plans');
      expect(plans.classList.contains('four-merch-cards')).to.be.true;
    });
  });

  describe('search scope', () => {
    const groups = [
      { deeplink: 'filter', category: true, optional: false, options: [{ value: 'featured' }, { value: 'all' }] },
      { deeplink: 'pricing', optional: false, options: [{ value: 'individuals' }] },
      { deeplink: 'types', optional: true, options: [{ value: 'web' }] },
    ];
    const hash = (query) => new URLSearchParams(query);

    it('searches All with no segment or type, keeping the search', () => {
      const scoped = scopeToSearch(hash('filter=featured&pricing=individuals&types=web&search=x'), groups);
      expect(scoped.toString()).to.equal('search=x&filter=all');
    });

    it('restores the selections from before the search when it is cleared', () => {
      const before = groupSelections(hash('filter=featured&pricing=individuals'), groups);
      expect(before).to.deep.equal([['filter', 'featured'], ['pricing', 'individuals']]);
      const left = leaveSearch(hash('filter=all&search=x'), groups, before);
      expect(left.toString()).to.equal('filter=featured&pricing=individuals');
    });

    it('seeds the defaults, or All for a deep-linked search', () => {
      expect(seedParams(hash(''), groups)).to.deep.equal([['filter', 'featured']]);
      expect(seedParams(hash('pricing=individuals'), groups)).to.deep.equal([['filter', 'featured']]);
      expect(seedParams(hash('search=x'), groups)).to.deep.equal([['filter', 'all']]);
      expect(seedParams(hash('filter=all&search=x'), groups)).to.deep.equal([]);
    });

    describe('searchTransition', () => {
      const run = (query, term, saved) => searchTransition(hash(query), term, saved, groups);
      const str = (r) => r.params?.toString();

      it('scopes on the first keystroke and remembers the selections', () => {
        const next = run('filter=featured&pricing=individuals', 'ac');
        expect(str(next)).to.equal('filter=all&search=ac');
        expect(next.saved).to.deep.equal([['filter', 'featured'], ['pricing', 'individuals']]);
      });

      it('only changes the term afterwards, keeping picked pills and the saved selections', () => {
        const saved = [['filter', 'featured']];
        const next = run('filter=all&pricing=individuals&search=ac', 'acr', saved);
        expect(str(next)).to.equal('filter=all&pricing=individuals&search=acr');
        expect(next.saved).to.equal(saved);
      });

      it('restores the saved selections when cleared', () => {
        const next = run('filter=all&search=ac', '', [['filter', 'featured']]);
        expect(str(next)).to.equal('filter=featured');
        expect(next.saved).to.equal(undefined);
      });

      it('does nothing when cleared without a search', () => {
        expect(run('filter=featured', '').params).to.equal(undefined);
      });
    });

    it('falls back to the defaults when the search was deep-linked', () => {
      const left = leaveSearch(hash('filter=all&search=x'), groups);
      expect(left.toString()).to.equal('filter=featured');
    });
  });

  describe('eduOnly', () => {
    const card = (edu, visible) => ({ edu, visible });
    it('is true only when every visible card is the EDU card', () => {
      expect(eduOnly([card(true, true), card(false, false)])).to.be.true;
      expect(eduOnly([card(true, true), card(false, true)])).to.be.false;
      expect(eduOnly([card(true, false)])).to.be.false;
      expect(eduOnly([])).to.be.false;
    });
  });

  describe('unavailablePills', () => {
    const groups = [
      { deeplink: 'filter', category: true, options: [{ value: 'all' }, { value: 'marketing' }] },
      { deeplink: 'pricing', options: [{ value: 'individuals' }, { value: 'teams' }] },
    ];
    const cards = [
      { filters: { all: {}, marketing: {} }, tags: ['pricing:individuals'] },
      { filters: { all: {} }, tags: ['pricing:teams'] },
    ];
    const unavailable = (query, list = cards) => [
      ...unavailablePills(list, groups, new URLSearchParams(query)),
    ];

    it('greys out a pill no card matches under the other selections', () => {
      expect(unavailable('filter=marketing&pricing=individuals')).to.deep.equal(['pricing:teams']);
      expect(unavailable('filter=all&pricing=individuals')).to.deep.equal([]);
    });

    it('never greys out a category', () => {
      expect(unavailable('filter=all&pricing=teams')).to.deep.equal([]);
    });

    it('greys nothing out before any card has loaded', () => {
      expect(unavailable('filter=all', [])).to.deep.equal([]);
    });
  });

  describe('category-driven pricing', () => {
    const groups = [
      { deeplink: 'filter', category: true, optional: false, options: [{ value: 'all' }, { value: 'data' }] },
      { deeplink: 'pricing', optional: false, options: [{ value: 'individuals' }, { value: 'business' }] },
      { deeplink: 'types', optional: true, options: [{ value: 'web' }] },
    ];
    const cards = [
      { filters: { all: {} }, tags: ['pricing:business'] },
      { filters: { all: {} }, tags: ['pricing:individuals'] },
      { filters: { data: {} }, tags: [''] },
    ];
    const derive = (query, list = cards) => derivedSelections(
      list,
      groups,
      new URLSearchParams(query),
    );

    it('selects the first pricing option, in authored order, that the category has', () => {
      expect(derive('filter=all')).to.deep.equal([['pricing', 'individuals']]);
    });

    it('selects nothing when no card of the category has a pricing tag', () => {
      expect(derive('filter=data')).to.deep.equal([]);
    });

    it('keeps a pricing already in the URL, and skips a search or no category', () => {
      expect(derive('filter=all&pricing=business')).to.deep.equal([]);
      expect(derive('filter=all&search=x')).to.deep.equal([]);
      expect(derive('')).to.deep.equal([]);
    });

    it('resets pricing on a category click and keeps the other params', () => {
      const next = selectCategory(new URLSearchParams('filter=all&pricing=business&types=web'), groups, 'data');
      expect(next.toString()).to.equal('filter=data&types=web');
    });
  });

  describe('scrollOffset', () => {
    it('pages toward the end for next, and flips the sign in RTL', () => {
      expect(scrollOffset('next', 100, false)).to.equal(100);
      expect(scrollOffset('prev', 100, false)).to.equal(-100);
      expect(scrollOffset('next', 100, true)).to.equal(-100);
      expect(scrollOffset('prev', 100, true)).to.equal(100);
    });
  });

  describe('mountProductPricingFilter', () => {
    const data = {
      placeholders: {
        allFilters: 'All Filters',
        filtersCategory: 'Category',
        filtersApplied: 'Applied',
        filtersResults: 'Results',
        filtersReset: 'Reset',
        searchText: 'Search',
        noResultsText: '<p>none</p>',
      },
      hierarchy: [{ label: 'Featured', queryLabel: 'featured' }, { label: 'Photo' }],
      sidenavSettings: {
        tagFilters: [
          { title: 'Pricing', deeplink: 'pricing', checkboxes: [{ name: 'individuals', label: 'Individuals' }] },
          { title: 'Types', deeplink: 'types', checkboxes: [{ name: 'desktop', label: 'Desktop' }] },
        ],
      },
    };

    const createCard = (filters, tags) => {
      const card = document.createElement('merch-card');
      card.filters = filters;
      card.setAttribute('filter-tags', tags);
      return card;
    };

    const mount = () => {
      const collection = document.createElement('div');
      collection.data = data;
      const container = document.createElement('div');
      document.body.append(container);
      mountProductPricingFilter(collection, container);
      return { collection, container };
    };

    afterEach(() => {
      window.location.hash = '';
      document.body.innerHTML = '';
    });

    it('seeds the defaults and renders both surfaces', () => {
      const { container } = mount();
      // Nothing deep-linked, so Category takes its first option.
      const params = new URLSearchParams(window.location.hash.slice(1));
      expect(params.get('filter')).to.equal('featured');
      // Pricing follows the category's cards, and none have loaded. Types seeds nothing.
      expect(params.get('pricing')).to.equal(null);
      expect(params.get('types')).to.equal(null);
      expect(container.querySelector('.product-pricing-filter-bar')).to.exist;
      expect(container.querySelector('.product-pricing-drawer')).to.exist;
      // Both seeded pills count toward the applied total.
      expect(container.querySelector('.product-pricing-trigger-label').textContent).to.equal('All Filters (1)');
      // Optional groups are drawer-only.
      const barGroupLabels = [...container.querySelectorAll('.product-pricing-filter-bar .product-pricing-filter-group')]
        .map((g) => g.getAttribute('aria-label'));
      expect(barGroupLabels).to.deep.equal(['Category', 'Pricing']);
      // Inside the scroller, so it scrolls with the pills.
      expect(container.querySelector('.product-pricing-filter-pills > .product-pricing-filter-trigger')).to.exist;
    });

    it('keeps a deep-linked value and seeds the category if missing', () => {
      window.location.hash = 'filter=photo';
      const { container } = mount();
      const params = new URLSearchParams(window.location.hash.slice(1));
      expect(params.get('filter')).to.equal('photo');
      expect(params.get('pricing')).to.equal(null);
      const checked = [...container.querySelectorAll('.product-pricing-filter-bar .product-pricing-pill input:checked')]
        .map((i) => i.value).sort();
      expect(checked).to.deep.equal(['photo']);
    });

    it('pages the collection 12 cards at a time', () => {
      const { collection } = mount();
      expect(collection.limit).to.equal(12);
    });

    it('collapses and expands a drawer section from its toggle', () => {
      const { container } = mount();
      const toggle = container.querySelector('.product-pricing-group-toggle');
      expect(toggle.getAttribute('aria-expanded')).to.equal('true');
      toggle.click();
      expect(toggle.getAttribute('aria-expanded')).to.equal('false');
      toggle.click();
      expect(toggle.getAttribute('aria-expanded')).to.equal('true');
    });

    it('flags the edge buttons from the row overflow', async () => {
      const { container } = mount();
      const pills = container.querySelector('.product-pricing-filter-pills');
      const [prev, next] = ['prev', 'next'].map((d) => container.querySelector(`.product-pricing-filter-scroll-${d}`));
      pills.style.cssText = 'display:flex;overflow-x:auto;width:100px;scroll-behavior:auto';
      await delay(50);
      expect([prev.hasAttribute('data-active'), next.hasAttribute('data-active')]).to.deep.equal([false, true]);
      pills.scrollLeft = 40;
      await delay(50);
      expect(prev.hasAttribute('data-active')).to.be.true;
      // Widening until it fits clears both, which the CSS timeline could not.
      pills.style.width = '2000px';
      await delay(50);
      expect([prev.hasAttribute('data-active'), next.hasAttribute('data-active')]).to.deep.equal([false, false]);
    });

    it('pages the pill row from the edge buttons', () => {
      const { container } = mount();
      const pills = container.querySelector('.product-pricing-filter-pills');
      const scrollBy = sinon.stub(pills, 'scrollBy');
      container.querySelector('.product-pricing-filter-scroll-next').click();
      container.querySelector('.product-pricing-filter-scroll-prev').click();
      const [next, prev] = scrollBy.args.map(([opts]) => opts.left);
      expect(next).to.equal(-prev);
      expect(scrollBy.calledTwice).to.be.true;
    });

    it('stacks the bar on desktop only when the pills and search overflow one line', async () => {
      const { container } = mount();
      const bar = container.querySelector('.product-pricing-filter-bar');
      const innerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
      Object.defineProperty(window, 'innerWidth', { value: 1600, configurable: true });
      try {
        container.style.width = '2000px';
        bar.style.width = '2000px';
        await delay(50);
        expect(bar.hasAttribute('data-stacked')).to.be.false;
        bar.style.width = '300px';
        await delay(50);
        expect(bar.hasAttribute('data-stacked')).to.be.true;
      } finally {
        Object.defineProperty(window, 'innerWidth', innerWidth);
      }
    });

    it('greys out pricing with no products, keeps the selected one and every category live', async () => {
      const { collection, container } = mount();
      const card = createCard({ featured: {} }, 'types:desktop');
      collection.append(card);
      window.location.hash = 'filter=featured&pricing=individuals';
      collection.dispatchEvent(new CustomEvent('merch-card-collection:literals-changed', { detail: { resultCount: 1 } }));
      await delay(50);
      const disabled = [...container.querySelectorAll('.product-pricing-filter-bar .product-pricing-pill input:disabled')]
        .map((i) => i.value);
      expect(disabled).to.deep.equal([]);
    });

    it('selects the first pricing the category has, and resets it on a category click', () => {
      const { collection, container } = mount();
      collection.append(
        createCard({ featured: {} }, 'pricing:individuals'),
        createCard({ photo: {} }, ''),
      );
      collection.dispatchEvent(new CustomEvent('merch-card-collection:literals-changed', { detail: { resultCount: 1 } }));
      const params = () => new URLSearchParams(window.location.hash.slice(1));
      expect(params().get('pricing')).to.equal('individuals');
      container.querySelector('.product-pricing-filter-bar input[value="photo"]').click();
      expect([params().get('filter'), params().get('pricing')]).to.deep.equal(['photo', null]);
    });

    it('searches All, then returns to the prior filters when the search is cleared', async () => {
      const { container } = mount();
      const search = container.querySelector('.product-pricing-filter-search-input');
      const type = (value) => {
        search.focus();
        search.value = value;
        search.dispatchEvent(new Event('input', { bubbles: true }));
        return delay(400);
      };
      const params = () => new URLSearchParams(window.location.hash.slice(1));
      window.location.hash = 'filter=photo&pricing=individuals&types=desktop';
      await delay(50);
      await type('acro');
      expect([params().get('filter'), params().get('pricing'), params().get('types')])
        .to.deep.equal(['all', null, null]);
      // A pill picked mid-search survives the next keystroke.
      window.location.hash = `${params().toString()}&pricing=individuals`;
      await delay(50);
      await type('acrob');
      expect(params().get('pricing')).to.equal('individuals');
      await type('');
      expect(params().has('search')).to.be.false;
      expect([params().get('filter'), params().get('pricing'), params().get('types')])
        .to.deep.equal(['photo', 'individuals', 'desktop']);
    });

    it('flags the collection when the EDU card is the only one showing', () => {
      const { collection } = mount();
      const edu = createCard({ featured: {} }, 'pricing:students-and-teachers');
      edu.setAttribute('size', 'edu');
      const other = createCard({ featured: {} }, 'pricing:individuals');
      collection.append(edu, other);
      const emit = () => collection.dispatchEvent(new CustomEvent('merch-card-collection:literals-changed', { detail: { resultCount: 1 } }));
      other.style.display = 'none';
      emit();
      expect(collection.hasAttribute('data-edu-only')).to.be.true;
      other.style.removeProperty('display');
      emit();
      expect(collection.hasAttribute('data-edu-only')).to.be.false;
    });

    describe('section-metadata', () => {
      const withMeta = (rows) => {
        const section = document.createElement('div');
        section.className = 'section';
        const meta = document.createElement('div');
        meta.className = 'section-metadata';
        rows.forEach(([key, value]) => {
          const row = document.createElement('div');
          row.innerHTML = `<div>${key}</div><div>${value}</div>`;
          meta.append(row);
        });
        const container = document.createElement('div');
        section.append(container, meta);
        document.body.append(section);
        const collection = document.createElement('div');
        collection.data = {
          ...data,
          hierarchy: [{ label: 'All', queryLabel: 'all' }, { label: 'Featured', queryLabel: 'featured' }],
          sidenavSettings: {
            tagFilters: [
              { title: 'Pricing', deeplink: 'pricing', checkboxes: [{ name: 'individuals', label: 'I' }, { name: 'business', label: 'B' }] },
            ],
          },
        };
        mountProductPricingFilter(collection, container);
        return container;
      };
      const params = () => new URLSearchParams(window.location.hash.slice(1));

      it('opens on the defaults the section names', () => {
        withMeta([['default-filter', 'featured'], ['default-pricing', 'business']]);
        expect([params().get('filter'), params().get('pricing')]).to.deep.equal(['featured', 'business']);
      });

      it('turns Category off while a category-off-for tag is selected', async () => {
        const container = withMeta([['default-filter', 'featured'], ['category-off-for', 'pricing:business']]);
        const categoryInputs = () => [...container.querySelectorAll('.product-pricing-filter-bar input[data-deeplink="filter"]')];
        const label = () => container.querySelector('.product-pricing-trigger-label').textContent;
        expect(categoryInputs().some((input) => input.disabled)).to.be.false;
        window.location.hash = 'filter=featured&pricing=individuals';
        await delay(50);
        expect(label()).to.equal('All Filters (2)');
        window.location.hash = 'filter=featured&pricing=business';
        await delay(50);
        expect(categoryInputs().every((input) => input.disabled)).to.be.true;
        expect(label()).to.equal('All Filters (1)');
      });
    });

    it('mounts once per collection', () => {
      const { collection, container } = mount();
      mountProductPricingFilter(collection, container);
      expect(container.querySelectorAll('.product-pricing-filter-bar')).to.have.length(1);
    });

    it('writes the hash when a pill changes', () => {
      const { container } = mount();
      const pill = [...container.querySelectorAll('.product-pricing-drawer .product-pricing-pill input')]
        .find((i) => i.value === 'desktop');
      pill.checked = true;
      pill.dispatchEvent(new Event('change', { bubbles: true }));
      expect(new URLSearchParams(window.location.hash.slice(1)).get('types')).to.equal('desktop');
    });

    it('opens and closes the drawer, tracking aria-expanded', async () => {
      const { container } = mount();
      const drawer = container.querySelector('.product-pricing-drawer');
      const trigger = container.querySelector('.product-pricing-filter-trigger');
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      trigger.click();
      expect(drawer.open).to.be.true;
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');
      container.querySelector('.product-pricing-drawer-close').click();
      expect(drawer.open).to.be.false;
      // <dialog> fires 'close' asynchronously, which is what clears the flag.
      await delay(50);
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
    });

    it('closes the drawer on a backdrop click but not a content click', () => {
      const { container } = mount();
      const drawer = container.querySelector('.product-pricing-drawer');
      container.querySelector('.product-pricing-filter-trigger').click();
      drawer.querySelector('.product-pricing-drawer-inner').dispatchEvent(new Event('click', { bubbles: true }));
      expect(drawer.open).to.be.true;
      drawer.dispatchEvent(new Event('click', { bubbles: true }));
      expect(drawer.open).to.be.false;
    });

    it('restores the default filters on Reset and clears the search', () => {
      const { container } = mount();
      window.location.hash = 'filter=photo&pricing=business&types=desktop&search=acrobat';
      container.querySelector('.product-pricing-drawer-reset').click();
      const params = new URLSearchParams(window.location.hash.slice(1));
      expect(params.get('filter')).to.equal('featured');
      expect(params.get('pricing')).to.equal(null);
      expect(params.get('types')).to.equal(null);
      expect(params.has('search')).to.be.false;
    });

    it('updates counts and the empty state from the collection result count', () => {
      const { collection, container } = mount();
      const emptyEl = container.querySelector('.product-pricing-results');
      expect(emptyEl.innerHTML).to.equal('');
      const emit = (resultCount) => collection.dispatchEvent(new CustomEvent(
        'merch-card-collection:literals-changed',
        { detail: { resultCount } },
      ));
      emit(5);
      expect(container.querySelector('.product-pricing-drawer-results').textContent).to.equal('5 Results');
      expect(emptyEl.innerHTML).to.equal('');
      emit(0);
      expect(emptyEl.innerHTML).to.equal('<p>none</p>');
    });

    describe('accessibility', () => {
      it('names the search and marks it as a search landmark', () => {
        const { container } = mount();
        const input = container.querySelector('.product-pricing-filter-search-input');
        expect(input.getAttribute('aria-label')).to.equal('Search');
        expect(input.closest('[role="search"]')).to.exist;
      });

      it('announces the count, once per change, and leaves zero to the empty state', () => {
        const { collection, container } = mount();
        const status = container.querySelector('.sr-only[role="status"]');
        const emit = (resultCount) => collection.dispatchEvent(new CustomEvent(
          'merch-card-collection:literals-changed',
          { detail: { resultCount } },
        ));
        expect(status.textContent).to.equal('');
        emit(5);
        expect(status.textContent).to.equal('5 Results');
        emit(0);
        expect(status.textContent).to.equal('');
      });

      it('points each group toggle at its pill list', () => {
        const { container } = mount();
        const toggles = [...container.querySelectorAll('.product-pricing-group-toggle')];
        expect(toggles).to.have.length(3);
        toggles.forEach((toggle) => {
          const target = container.querySelector(`#${toggle.getAttribute('aria-controls')}`);
          expect(target.classList.contains('product-pricing-group-pills')).to.be.true;
        });
      });
    });

    it('mirrors the hash onto both surfaces on hashchange', async () => {
      const { container } = mount();
      window.location.hash = 'filter=photo&pricing=individuals';
      await delay(50);
      const checkedPerSurface = ['.product-pricing-filter-bar', '.product-pricing-drawer'].map((sel) => [
        ...container.querySelectorAll(`${sel} .product-pricing-pill input:checked`),
      ].map((i) => i.value).sort());
      expect(checkedPerSurface[0]).to.deep.equal(['individuals', 'photo']);
      expect(checkedPerSurface[1]).to.deep.equal(['individuals', 'photo']);
      expect(container.querySelector('.product-pricing-trigger-label').textContent).to.equal('All Filters (2)');
    });

    it('debounces search input into the hash', async () => {
      const { container } = mount();
      const search = container.querySelector('.product-pricing-filter-search-input');
      // Focused, as a typing user is: sync() only overwrites an unfocused field.
      search.focus();
      search.value = ' acrobat ';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      // debounce() defaults to 300ms; wait past it, not exactly on it.
      await delay(400);
      expect(new URLSearchParams(window.location.hash.slice(1)).get('search')).to.equal('acrobat');
      // Emptying the field drops the param rather than writing search=''.
      search.value = '';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await delay(400);
      expect(window.location.hash).to.not.include('search');
    });
  });
});
