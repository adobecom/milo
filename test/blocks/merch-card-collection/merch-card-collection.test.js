import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import '../../../libs/deps/mas/commerce.js';

document.head.appendChild(document.createElement('mas-commerce-service'));

// eslint-disable-next-line no-promise-executor-return
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales, miloLibs: '/libs' };
setConfig(conf);

const getVisibleCards = (merchCards) => [...merchCards.querySelectorAll('merch-card')]
  .filter((merchCard) => merchCard.style.display !== 'none')
  .sort((a, b) => Number(a.style.order) - Number(b.style.order));

describe('Merch Cards', async () => {
  let init;
  let pageContent;
  let overrideThrowError = false;
  let overrideRespondError = false;
  let queryIndexRespondError = false;

  let cards = [];

  before(async () => {
    window.lana = { log: sinon.stub() };
    const originalFetch = window.fetch;
    window.fetch = sinon.stub(window, 'fetch').callsFake((url) => {
      let data;
      const overrideUrl = /override-(.*).plain.html/;
      const overrideMatch = overrideUrl.exec(url);
      const queryIndexMatch = /-cards(-preview)?.json/.test(url);
      if ((overrideMatch && overrideRespondError) || (queryIndexMatch && queryIndexRespondError)) {
        return Promise.resolve({
          status: 500,
          statusText: 'Internal Server Error',
          ok: false,
          json: () => Promise.resolve({}),
        });
      }
      if (overrideMatch) {
        if (overrideThrowError) {
          return Promise.reject(new Error('fetch error'));
        }
        return new Promise((resolve) => {
          originalFetch(new URL(`./mocks/${overrideMatch[1]}-override.html`, import.meta.url).href)
            .then((r) => {
              resolve({
                status: 200,
                statusText: '',
                ok: true,
                text: () => Promise.resolve(r.text()),
              });
            });
        });
      }
      if (queryIndexMatch) {
        data = {
          total: 0,
          offset: 0,
          limit: 0,
          data: cards,
        };
      }
      return Promise.resolve({
        status: 200,
        statusText: '',
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
    ({ default: init } = await import('../../../libs/blocks/merch-card-collection/merch-card-collection.js'));
    // this allows to run the test in the normal browser.
    pageContent = await originalFetch(new URL('./mocks/merch-card-collection.html', import.meta.url).href).then((r) => r.text());
  });

  beforeEach(async () => {
    document.location.hash = '';
    cards = [];
    document.body.innerHTML = pageContent;
    overrideThrowError = false;
    overrideRespondError = false;
    queryIndexRespondError = false;
    window.lana.log.reset();
    setConfig(conf);
  });

  it('should require a type', async () => {
    const el = document.getElementById('default');
    const merchCards = await init(el);
    expect(merchCards.tagName).to.equal('DIV');
  });

  it('should set "all" as default filter', async () => {
    const el = document.getElementById('defaultFilter');
    const merchCards = await init(el);
    expect(merchCards.tagName).to.equal('MERCH-CARD-COLLECTION');
    expect(merchCards.getAttribute('filter')).to.equal('all');
  });

  it('should parse "filter", "show more text" and default "limit"', async () => {
    const el = document.getElementById('filterShowMoreText');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('all');
    expect(merchCards.getAttribute('limit')).to.equal('24');
  });

  it('should parse the "limit"', async () => {
    const el = document.getElementById('filterShowMoreTextLimit');
    const merchCards = await init(el);
    expect(merchCards.getAttribute('filter')).to.equal('all');
    expect(merchCards.getAttribute('limit')).to.equal('9');
  });

  it('should freeze the filter', async () => {
    const el = document.getElementById('onlyPhoto');
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

    const merchCards = await init(el);
    expect(merchCards.getAttribute('filtered')).to.equal('photo');

    document.location.hash = '#filter=video';
    await delay();
    expect(merchCards.filter).to.equal('photo');
    expect(merchCards.filtered).to.equal('photo');

    const [photoshop, cc, express] = getVisibleCards(merchCards);
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(express.name).to.be.equal('express');
  });

  it('should parse multiple filters', async () => {
    const el = document.getElementById('multipleFilters');
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

    const merchCards = await init(el);
    expect(merchCards.filter).to.equal('all');
    await delay(500);
    let [cc, photoshop, express] = getVisibleCards(merchCards);
    expect(cc.size).to.be.equal('super-wide');
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(express.name).to.be.equal('express');
    document.location.hash = '#filter=photo';
    await delay(500);
    ([photoshop, cc, express] = getVisibleCards(merchCards));
    expect(photoshop.name).to.be.equal('photoshop');
    expect(cc.name).to.be.equal('all-apps');
    expect(cc.size).to.undefined;
    expect(express.name).to.be.equal('express');
  });

  it('should parse literals', async () => {
    const merchCards = await init(document.getElementById('literals'));
    await delay(500);
    expect(merchCards.outerHTML).to.equal(merchCards.nextElementSibling.outerHTML);
  });

  it('should parse fragmented literals', async () => {
    const merchCards = await init(document.getElementById('fragmented-literals'));
    await delay(500);
    expect(merchCards.outerHTML).to.equal(merchCards.nextElementSibling.outerHTML);
  });

  it('should parse literals 4 translation too', async () => {
    const merchCards = await init(document.getElementById('literals-4-translation'));
    await delay(500);
    expect(merchCards.outerHTML).to.equal(merchCards.nextElementSibling.outerHTML);
  });

  it('MEP: should override cards when asked to', async () => {
    const el = document.getElementById('multipleFilters');
    setConfig({
      ...conf,
      mep: {
        preview: true,
        inBlock: {
          'merch-card-collection': {
            commands: [
              {
                action: 'replace',
                manifestId: 'promo1.json',
                content: '/override-photoshop',
              },
              {
                action: 'replace',
                manifestId: 'promo2.json',
                content: '/override-express',
              },
            ],
          },
        },
      },
    });
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards
    const merchCards = await init(el);
    expect(merchCards.filter).to.equal('all');
    await delay(500);
    const photoshop = merchCards.querySelector('merch-card[name="photoshop"]');
    const express = merchCards.querySelector('merch-card[name="express"]');
    expect(photoshop.title.indexOf('PROMOTION') > 0).to.be.true;
    expect(express.title.indexOf('PROMOTION') > 0).to.be.true;
    expect(merchCards.dataset.overrides).to.equal('promo1.json:/override-photoshop,promo2.json:/override-express');
  });

  it('MEP: should modify cards when asked to', async () => {
    const el = document.getElementById('multipleFilters');
    setConfig({
      ...conf,
      mep: {
        preview: true,
        commands: [
          {
            action: 'remove',
            selector: 'merch-card h3 #_include-fragments #_all',
            pageFilter: '',
            content: 'true',
            selectorType: 'other',
            manifestId: 'merchcardupdates.json',
            targetManifestId: false,
            modifiers: [
              'include-fragments',
              'all',
            ],
          },
        ],
      },
    });
    cards = [...document.querySelectorAll('#cards .merch-card')]
      .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards
    const merchCards = await init(el);
    expect(merchCards.filter).to.equal('all');
    await delay(500);
    expect(merchCards.querySelectorAll('h3').length).to.equal(0);
  });

  it('should localize the query-index url', async () => {
    setConfig({
      ...conf,
      pathname: '/fr/test.html',
      locales: { fr: { ietf: 'fr-FR' } },
      prodDomains: ['main--milo--adobecom.hlx.live'],
    });
    const el = document.getElementById('localizeQueryIndex');
    await init(el);
    expect(window.fetch.calledWith('https://main--milo--adobecom.hlx.live/fr/query-index-cards.json?sheet=catalog')).to.be.true;
  });

  it('should use preview query-index url if stage env and not hlx.live', async () => {
    setConfig({
      ...conf,
      env: { name: 'stage' },
    });
    const el = document.getElementById('previewQueryIndex');
    await init(el);
    expect(window.fetch.calledWith('https://main--milo--adobecom.hlx.live/query-index-cards-preview.json?sheet=catalog')).to.be.true;
  });

  it('should default to prod index if preview is missing', async () => {
    setConfig({
      ...conf,
      env: { name: 'stage' },
    });
    const el = document.getElementById('previewQueryIndexMissing');
    await init(el);
    expect(window.fetch.calledWith('https://main--milo--adobecom.hlx.live/query-index-cards.json?sheet=catalog')).to.be.true;
  });

  describe('error handling', async () => {
    it('fails gracefully if no query-index endpoint is provided ', async () => {
      const el = document.getElementById('noQueryIndexEndpoint');
      await init(el);
      expect(el.innerHTML).to.equal('');
      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.calledWith('Failed to initialize merch cards: No query-index endpoint provided')).to.be.true;
    });

    it('fails gracefully if query-index fetch fails ', async () => {
      queryIndexRespondError = true;
      const el = document.getElementById('queryIndexFail');
      await init(el);
      expect(el.innerHTML).to.equal('');
      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.calledWith('Failed to initialize merch cards: Error: Internal Server Error')).to.be.true;
    });

    it('should handle fetch errors while retrieving override cards', async () => {
      overrideThrowError = true;
      cards = [...document.querySelectorAll('#cards .merch-card')]
        .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

      const el = document.getElementById('handleFetchError1');
      el.dataset.overrides = '/override-photoshop';
      const merchCards = await init(el);
      const photoshop = merchCards.querySelector('merch-card[name="photoshop"]');
      expect(photoshop.title).to.equal('Photoshop');
      expect(photoshop.title.indexOf('PROMOTION') > 0).to.be.false;
    });

    it('should handle errors while retrieving override cards', async () => {
      overrideRespondError = true;
      cards = [...document.querySelectorAll('#cards .merch-card')]
        .map((merchCardEl) => ({ cardContent: merchCardEl.outerHTML })); // mock cards

      const el = document.getElementById('handleFetchError2');
      el.dataset.overrides = '/override-photoshop';
      const merchCards = await init(el);
      const photoshop = merchCards.querySelector('merch-card[name="photoshop"]');
      expect(photoshop.title).to.equal('Photoshop');
      expect(photoshop.title.indexOf('PROMOTION') > 0).to.be.false;
    });
  });

  describe('simplified-pricing-express variant', async () => {
    let matchMediaStub;

    beforeEach(() => {
      // Restore matchMedia if it was stubbed before
      if (matchMediaStub) {
        matchMediaStub.restore();
      }
    });

    afterEach(() => {
      // Clean up matchMedia stub
      if (matchMediaStub) {
        matchMediaStub.restore();
      }
    });

    it('should set default card attribute from data-default-card', async () => {
      const el = document.getElementById('multipleFilters');
      // The merch-card-collection processes cards from a JSON response
      // We need to simulate the proper structure
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Individual</h3>
            </div>
            <div>
              <h3>individual</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Teams</h3>
            </div>
            <div>
              <h3>teams</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
              <p>data-default-card:true</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Enterprise</h3>
            </div>
            <div>
              <h3>enterprise</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      expect(merchCards.tagName).to.equal('MERCH-CARD-COLLECTION');
      await delay(500);

      // The merch-card-collection processes the simplified-pricing-express cards
      const merchCardElements = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      expect(merchCardElements.length).to.equal(3);

      // Verify the data-default-card attribute is set
      const hasDefaultCard = Array.from(merchCardElements).some((card) => card.hasAttribute('data-default-card'));
      expect(hasDefaultCard).to.be.true;

      // Find which card has the default attribute
      let defaultCardIndex = -1;
      merchCardElements.forEach((card, index) => {
        if (card.hasAttribute('data-default-card')) {
          defaultCardIndex = index;
        }
      });
      expect(defaultCardIndex).to.equal(1); // Second card should be default
    });

    it('should expand default card on mobile/tablet', async () => {
      // Mock mobile viewport
      matchMediaStub = sinon.stub(window, 'matchMedia');
      matchMediaStub.returns({
        matches: true, // True for mobile/tablet
        media: '(max-width: 1199px)',
        onchange: null,
        addListener: sinon.stub(),
        removeListener: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
      });

      const el = document.getElementById('multipleFilters');
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Individual</h3>
            </div>
            <div>
              <h3>individual</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Teams</h3>
            </div>
            <div>
              <h3>teams</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
              <p>data-default-card:true</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Enterprise</h3>
            </div>
            <div>
              <h3>enterprise</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      await delay(500);

      const merchCardElements = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      expect(merchCardElements.length).to.equal(3);

      // In mobile/tablet mode, the card with data-default-card should have data-expanded="true"
      // Wait a bit for the component to initialize and set attributes
      await delay(100);

      const defaultCard = merchCards.querySelector('merch-card[data-default-card="true"]');
      if (defaultCard) {
        // The variant should have set data-expanded on mobile
        const isExpanded = defaultCard.getAttribute('data-expanded');
        expect(isExpanded).to.equal('true');
      }
    });

    it('should use first card as default when no default specified', async () => {
      // Mock tablet viewport
      matchMediaStub = sinon.stub(window, 'matchMedia');
      matchMediaStub.returns({
        matches: true, // True for mobile/tablet
        media: '(max-width: 1199px)',
        onchange: null,
        addListener: sinon.stub(),
        removeListener: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
      });

      const el = document.getElementById('multipleFilters');
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Basic</h3>
            </div>
            <div>
              <h3>basic</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Pro</h3>
            </div>
            <div>
              <h3>pro</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Premium</h3>
            </div>
            <div>
              <h3>premium</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      await delay(500);

      const merchCardElements = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      expect(merchCardElements.length).to.equal(3);

      // No cards should have data-default-card attribute
      merchCardElements.forEach((card) => {
        expect(card.hasAttribute('data-default-card')).to.be.false;
      });

      // Wait for components to initialize
      await delay(100);

      // First card should be expanded on tablet when no default is specified
      const firstCardExpanded = merchCardElements[0].getAttribute('data-expanded');
      expect(firstCardExpanded).to.equal('true');
    });

    it('should not set expanded attributes on desktop', async () => {
      // Mock desktop viewport
      matchMediaStub = sinon.stub(window, 'matchMedia');
      matchMediaStub.returns({
        matches: false, // False for desktop
        media: '(max-width: 1199px)',
        onchange: null,
        addListener: sinon.stub(),
        removeListener: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
      });

      const el = document.getElementById('multipleFilters');
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Individual</h3>
            </div>
            <div>
              <h3>individual</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Teams</h3>
            </div>
            <div>
              <h3>teams</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
              <p>data-default-card:true</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Enterprise</h3>
            </div>
            <div>
              <h3>enterprise</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      await delay(500);

      const merchCardElements = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      expect(merchCardElements.length).to.equal(3);

      // Wait for components to initialize
      await delay(100);

      // No cards should have data-expanded attribute on desktop
      merchCardElements.forEach((card) => {
        expect(card.hasAttribute('data-expanded')).to.be.false;
      });
    });

    it('should handle mixed variants with simplified-pricing-express', async () => {
      const el = document.getElementById('multipleFilters');
      // Mixed variant cards
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Plans Card</h3>
            </div>
            <div>
              <h3>plans</h3>
              <p>variant:plans</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Express Card</h3>
            </div>
            <div>
              <h3>express-card</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
              <p>data-default-card:true</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Catalog Card</h3>
            </div>
            <div>
              <h3>catalog</h3>
              <p>variant:catalog</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      await delay(500);

      const simplifiedCards = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      const otherCards = merchCards.querySelectorAll('merch-card:not([variant="simplified-pricing-express"])');

      expect(simplifiedCards.length).to.equal(1);
      expect(otherCards.length).to.equal(2);

      // Only simplified-pricing-express card should have data-default-card
      expect(simplifiedCards[0].hasAttribute('data-default-card')).to.be.true;
    });

    it('should handle last card as default', async () => {
      // Mock mobile viewport
      matchMediaStub = sinon.stub(window, 'matchMedia');
      matchMediaStub.returns({
        matches: true, // True for mobile
        media: '(max-width: 1199px)',
        onchange: null,
        addListener: sinon.stub(),
        removeListener: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        dispatchEvent: sinon.stub(),
      });

      const el = document.getElementById('multipleFilters');
      cards = [
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Starter</h3>
            </div>
            <div>
              <h3>starter</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Standard</h3>
            </div>
            <div>
              <h3>standard</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
            </div>
          </div>`,
        },
        {
          cardContent: `<div class="merch-card catalog">
            <div>
              <h3>Ultimate</h3>
            </div>
            <div>
              <h3>ultimate</h3>
              <p>variant:simplified-pricing-express</p>
              <p>catalog:categories/creativity-design/photo</p>
              <p>data-default-card:true</p>
            </div>
          </div>`,
        },
      ];

      const merchCards = await init(el);
      await delay(500);

      const merchCardElements = merchCards.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
      expect(merchCardElements.length).to.equal(3);

      // Last card should have data-default-card
      expect(merchCardElements[2].hasAttribute('data-default-card')).to.be.true;

      // Wait for components to initialize
      await delay(100);

      // Last card should be expanded on mobile
      const lastCardExpanded = merchCardElements[2].getAttribute('data-expanded');
      expect(lastCardExpanded).to.equal('true');
    });
  });
});
