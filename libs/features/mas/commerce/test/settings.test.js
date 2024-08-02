import { Env, WcsEnv, Landscape } from '../src/external.js';
import { Defaults } from '../src/defaults.js';
import { getSettings } from '../src/settings.js';

import { expect } from './utilities.js';
import { PARAM_ENV, PARAM_LANDSCAPE } from '../src/constants.js';

describe('getSettings', () => {
    let href;

    after(() => {
        document.head.querySelectorAll('meta').forEach((meta) => meta.remove());
        window.history.replaceState({}, '', href);
        window.sessionStorage.clear();
    });

    before(() => {
        ({ href } = window.location);
    });

    it('returns default settings, if called without arguments', () => {
        expect(getSettings()).to.deep.equal({
            ...Defaults,
            locale: `${Defaults.language}_${Defaults.country}`,
            priceLiteralsURL: undefined,
            priceLiteralsPromise: undefined,
            quantity: [Defaults.quantity],
        });
    });

    it('uses location search, document metadata and storage', () => {
        const checkoutClientId = 'checkout-client-id';
        const url = `${window.location.href}&checkoutClientId=${checkoutClientId}`;
        window.history.replaceState({}, '', url);
        const wcsApiKey = 'wcs-api-key';
        const meta = document.createElement('meta');
        meta.content = wcsApiKey;
        meta.name = 'wcs-api-key';
        document.head.append(meta);
        window.sessionStorage.setItem(PARAM_ENV, 'stage');

        const commerce = {
            forceTaxExclusive: true,
            promotionCode: 'promo1',
            'commerce.landscape': 'DRAFT',
        };
        expect(
            getSettings({
                commerce,
                env: { name: 'stage' },
                locale: { prefix: '/no' },
            }),
        ).to.deep.equal({
            ...Defaults,
            forceTaxExclusive: true,
            promotionCode: 'promo1',
            checkoutClientId,
            country: 'NO',
            env: Env.STAGE,
            language: 'nb',
            locale: 'nb_NO',
            priceLiteralsURL: undefined,
            priceLiteralsPromise: undefined,
            quantity: [Defaults.quantity],
            wcsApiKey,
            wcsEnv: WcsEnv.STAGE,
            landscape: Landscape.DRAFT,
        });
        window.sessionStorage.removeItem(PARAM_ENV);
    });

    it('if host env is "dev" - override commerce landscape', () => {
        window.sessionStorage.setItem(PARAM_LANDSCAPE, 'DRAFT');

        const config = {
            commerce: {},
            env: { name: 'local' },
        };
        expect(getSettings(config)).to.deep.equal({
            ...Defaults,
            checkoutClientId: 'checkout-client-id',
            wcsApiKey: 'wcs-api-key',
            env: Env.PRODUCTION,
            locale: 'en_US',
            priceLiteralsURL: undefined,
            priceLiteralsPromise: undefined,
            quantity: [Defaults.quantity],
            wcsEnv: WcsEnv.PRODUCTION,
            landscape: Landscape.DRAFT,
        });
    });

    it('if host env is "prod" - doesnt override commerce env and landscape', () => {
        window.sessionStorage.setItem(PARAM_ENV, 'stage');
        window.sessionStorage.setItem(PARAM_LANDSCAPE, 'DRAFT');

        const config = {
            commerce: {},
            env: { name: 'prod' },
        };
        expect(getSettings(config)).to.deep.equal({
            ...Defaults,
            checkoutClientId: 'checkout-client-id',
            wcsApiKey: 'wcs-api-key',
            env: Env.PRODUCTION,
            locale: 'en_US',
            priceLiteralsURL: undefined,
            priceLiteralsPromise: undefined,
            quantity: [Defaults.quantity],
            wcsEnv: WcsEnv.PRODUCTION,
            landscape: Landscape.PUBLISHED,
        });
    });

    [
        { prefix: '/ar', expectedLocale: 'es_AR' },
        { prefix: '/africa', expectedLocale: 'en_MU' },
        { prefix: '', expectedLocale: 'en_US' },
        { prefix: '/ae_ar', expectedLocale: 'ar_AE' },
    ].forEach(({ prefix, expectedLocale }) => {
        it(`returns correct locale for "${prefix}"`, () => {
            const wcsLocale = getSettings({
                locale: { prefix },
            }).locale;
            expect(wcsLocale).to.be.equal(expectedLocale);
        });
    });
});
