import { Defaults, init, reset } from '../src/index.js';
import { MasCommerceService } from '../src/mas-commerce-service.js';

import { mockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { expect, initMasCommerceService, disableMasCommerceService } from './utilities.js';
import { withWcs } from './mocks/wcs.js';

const { fetch: originalFetch } = window;

describe('commerce service', () => {
    before(async () => {
        await mockFetch(withWcs);
    });

    afterEach(() => {
      disableMasCommerceService();
      unmockIms();
    });

    beforeEach(async () => {
      await mockIms();
    });

    describe('function "init"', () => {
        it('initialises service with milo configured locale', async () => {
            const { settings } = await init(
                mockConfig({}, { prefix: 'mena_en' }),
            );
            expect(settings).to.deep.contain({
                country: 'DZ',
                language: 'en',
            });
        });

        it('returns same object for subsequent inits', async () => {
            const instance = await init(mockConfig());
            expect(await init()).to.be.equal(instance);
            expect(await init()).to.be.equal(instance);
        });

        it('ignores active instance and constructs new one if argument `force` is true', async () => {
            const instance = await init(mockConfig());
            expect(await init(mockConfig(), mockProviders())).not.to.be.equal(
                instance,
            );
        });
    });

    describe('service instance', () => {
        describe('property "defaults"', () => {
            it('returns "Defauls" object', async () => {
                const instance = await init(mockConfig());
                expect(instance.defaults).to.deep.equal(Defaults);
                expect(typeof instance.flushWcsCache).to.equal('function');
            });
        });

        describe('property "literals"', () => {
            it('returns "price literals" object', async () => {
                const priceLiterals = await originalFetch('/price-literals.json').then((r) => r.text());
                const commerce = {
                  priceLiterals: JSON.parse(priceLiterals),
                };
                const instance = await init(mockConfig(commerce));
                [
                    'alternativePriceAriaLabel',
                    'freeAriaLabel',
                    'freeLabel',
                    'perUnitAriaLabel',
                    'perUnitLabel',
                    'recurrenceAriaLabel',
                    'recurrenceLabel',
                    'strikethroughAriaLabel',
                    'taxExclusiveLabel',
                    'taxInclusiveLabel',
                ].forEach((key) => {
                    const literal = instance.literals.price[key];
                    expect(literal).to.be.string;
                    expect(literal).to.not.be.empty;
                });
            });
        });
    });

    const createMasTag = (attributes) => {
      const el = document.createElement(TAG_NAME_SERVICE);
      Object.keys(attributes).forEach((key) => {
        el.setAttribute(key, attributes[key]);
      })
      document.head.appendChild(el);
      return el;
    }

    describe(`component "${TAG_NAME_SERVICE}"`, () => {
        it('returns "Defaults" object', async () => {
            const instance = await initMasCommerceService();
            expect(instance.defaults).to.deep.equal(Defaults);
        });

        it('initialises service with milo configured locale', async () => {
          const { settings } = await initMasCommerceService({ locale: 'en_DZ' });          
          expect(settings).to.deep.contain({
              country: 'DZ',
              language: 'en',
          });
        });

        it('registers checkout action', async () => {
          const el = await initMasCommerceService();          
          el.registerCheckoutAction((offers, options, imsPromise) => { /* nop for now */ });
          expect(el.buildCheckoutAction).to.be.not.undefined;
          el.buildCheckoutAction([{}], {});
        });

        describe('property "config"', () => {
          it('generates config from attributes', async () => {
            const el = await initMasCommerceService({'env':'stage', 'locale': 'fr_CA', 'language':'es', 'country':'CA'});
            expect(el?.config).to.not.be.empty;
            expect(el.config).to.deep.equal({'locale': 'fr_CA', 'language':'es', 'country':'CA', env: { name: 'stage' }, commerce: { 'commerce.env': 'STAGE' }});
          });

          it('generates some default with no attributes', async () => {
            const el = await initMasCommerceService({});
            expect(el?.config).to.not.be.empty;
            expect(el.config).to.deep.equal({ env: { name: 'prod' }, commerce: { 'commerce.env': 'PROD' }});
          })
        });
    });
});
