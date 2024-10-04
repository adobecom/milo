import { readFile } from '@web/test-runner-commands';
import { delay } from '../src/external.js';
import { Defaults, init, reset } from '../src/index.js';
import { MasCommerceService } from '../src/mas-commerce-service.js';

import { mockConfig } from './mocks/config.js';
import { mockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { expect } from './utilities.js';
import { mockProviders } from './mocks/providers.js';
import { withWcs } from './mocks/wcs.js';
import { TAG_NAME_SERVICE } from '../src/constants.js';

describe('commerce service', () => {
    before(async () => {
        await mockFetch(withWcs);
    });

    afterEach(() => {
        reset();
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

        it('if called witout args, returns a promise resolving when new instance is created', async () => {
            let resolved = null;
            init().then((instance) => {
                resolved = instance;
            });
            await delay();
            expect(resolved).to.be.null;
            const instance = await init(mockConfig());
            await delay();
            expect(resolved).to.be.equal(instance);
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
            });
        });

        describe('property "literals"', () => {
            it('returns "price literals" object', async () => {
                const priceLiterals = await (readFile({ path: '../price-literals.json' }));
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
        it('appears inthe document head when the service activates', async () => {
            let element = document.head.querySelector(TAG_NAME_SERVICE);
            expect(element).to.be.null;
            await init(mockConfig());
            element = document.head.querySelector(TAG_NAME_SERVICE);
            expect(element).to.be.instanceof(MasCommerceService);
        });

        it('registers checkout action', async () => {
          const el = createMasTag({});
          el.registerCheckoutAction((offers, options, imsPromise) => { /* nop for now */ });
          await el.activate();
          expect(el.buildCheckoutAction).to.be.not.undefined;
        });

        describe('property "config"', () => {
          it('generates config from attributes', async () => {
            const el = createMasTag({'env':'stage', 'locale': 'fr_CA', 'language':'es', 'country':'CA'});
            expect(el?.config).to.not.be.empty;
            expect(el.config).to.deep.equal({'locale': 'fr_CA', 'language':'es', 'country':'CA', env: { name: 'stage' }, commerce: { 'commerce.env': 'STAGE' }});
          });

          it('generates some default with no attributes', async () => {
            const el = createMasTag({});
            expect(el?.config).to.not.be.empty;
            expect(el.config).to.deep.equal({ env: { name: 'prod' }, commerce: { 'commerce.env': 'PROD' }});
          })
        });

        describe('property "isEnabled"', () => {
            it('returns true', async () => {
                await init(mockConfig());
                const element = document.head.querySelector(TAG_NAME_SERVICE);
                // @ts-ignore
                expect(element.isEnabled).to.be.true;
            });
        });
    });
});
