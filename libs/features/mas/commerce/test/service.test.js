import { delay } from '../src/external.js';
import { TAG_NAME_SERVICE, Defaults, init, reset } from '../src/index.js';
import { HTMLWcmsCommerceElement } from '../src//service.js';

import { mockConfig } from './mocks/config.js';
import { mockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { expect } from './utilities.js';
import { mockProviders } from './mocks/providers.js';
import { withWcs } from './mocks/wcs.js';
import { withLiterals } from './mocks/literals.js';

describe('commerce service', () => {
    before(async () => {
        await mockFetch(withWcs, withLiterals);
    });

    afterEach(() => {
        reset();
        unmockIms();
    });

    beforeEach(async () => {
        await mockIms();
    });

    describe('function "init"', () => {
        it('initialises service with configured locale', async () => {
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
                const instance = await init(mockConfig());
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

    describe(`component "${TAG_NAME_SERVICE}"`, () => {
        it('appears inthe document head when the service activates', async () => {
            let element = document.head.querySelector(TAG_NAME_SERVICE);
            expect(element).to.be.null;
            await init(mockConfig());
            element = document.head.querySelector(TAG_NAME_SERVICE);
            expect(element).to.be.instanceof(HTMLWcmsCommerceElement);
        });

        describe('property "isWcmsCommerce"', () => {
            it('returns true', async () => {
                await init(mockConfig());
                const element = document.head.querySelector(TAG_NAME_SERVICE);
                // @ts-ignore
                expect(element.isWcmsCommerce).to.be.true;
            });
        });
    });
});
