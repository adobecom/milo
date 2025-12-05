import { Landscape, WCS_PROD_URL, WCS_STAGE_URL, PARAM_ENV, PARAM_LANDSCAPE, FF_DEFAULTS } from '../src/constants.js';
import { Defaults } from '../src/defaults.js';
import { Env } from '../src/constants.js';
import {
  getLocaleSettings,
  getPreviewSurface,
  getSettings,
} from '../src/settings.js';

import { expect } from './utilities.js';

const mockService = {
  featureFlags: { [FF_DEFAULTS]: true },
};

describe('getSettings', () => {
    let href;

    after(() => {
        document.head.querySelectorAll('meta').forEach((meta) => meta.remove());
        window.history.replaceState({}, '', href);
    });

    afterEach(() => {
        window.sessionStorage.clear();
        window.history.replaceState({}, '', href);
    });

    before(() => {
        ({ href } = window.location);
    });

    it('returns default settings, if called without arguments', () => {
        expect(getSettings(undefined, mockService)).to.deep.equal({
            ...Defaults,
            locale: `${Defaults.language}_${Defaults.country}`,
            masIOUrl: 'https://www.adobe.com/mas/io',
            quantity: [Defaults.quantity],
        });
    });

    it('overrides with search parameters', () => {
        const checkoutClientId = 'adobe_com';
        const checkoutWorkflowStep = 'segmentation';
        const promotionCode = 'nicopromo';

        const url = new URL(window.location.href);
        url.searchParams.set('checkoutClientId', checkoutClientId);
        url.searchParams.set('checkoutWorkflowStep', checkoutWorkflowStep);
        url.searchParams.set('promotionCode', promotionCode);
        url.searchParams.set('displayOldPrice', 'false');
        url.searchParams.set('displayPerUnit', 'false');
        url.searchParams.set('displayRecurrence', 'false');
        url.searchParams.set('displayTax', 'true');
        url.searchParams.set('displayPlanType', 'true');
        url.searchParams.set('entitlement', 'true');
        url.searchParams.set('modal', 'true');
        url.searchParams.set('commerce.landscape', 'DRAFT');
        url.searchParams.set('commerce.env', 'STAGE');
        url.searchParams.set('quantity', '2');
        url.searchParams.set('wcsApiKey', 'testapikey');
        url.searchParams.set('mas-io-url', 'https://mycustomurl');
        window.history.replaceState({}, '', url.toString());

        const config = { commerce: { allowOverride: '' } };
        expect(getSettings(config, mockService)).to.deep.equal({
            ...Defaults,
            checkoutClientId,
            checkoutWorkflowStep,
            promotionCode,
            displayOldPrice: false,
            displayPerUnit: false,
            displayRecurrence: false,
            displayTax: true,
            displayPlanType: true,
            entitlement: true,
            modal: true,
            landscape: 'DRAFT',
            quantity: [2],
            wcsApiKey: 'testapikey',
            locale: 'en_US',
            masIOUrl: 'https://mycustomurl',
            env: 'STAGE',
            wcsURL: WCS_STAGE_URL,
        });
    });

    it('uses document metadata and storage', () => {
        const wcsApiKey = 'wcs-api-key';
        const meta = document.createElement('meta');
        meta.content = wcsApiKey;
        meta.name = 'wcs-api-key';
        document.head.append(meta);
        window.sessionStorage.setItem(PARAM_ENV, 'stage');

        const commerce = {
            forceTaxExclusive: true,
            promotionCode: 'promo1',
            allowOverride: 'true',
            'commerce.landscape': 'DRAFT',
        };
        expect(
            getSettings({
                commerce,
                locale: 'nb_NO',
            }, mockService),
        ).to.deep.equal({
            ...Defaults,
            forceTaxExclusive: true,
            promotionCode: 'promo1',
            country: 'NO',
            env: Env.STAGE,
            language: 'nb',
            locale: 'nb_NO',
            masIOUrl: 'https://www.stage.adobe.com/mas/io', // because env === Env.STAGE
            quantity: [Defaults.quantity],
            wcsApiKey,
            wcsURL: WCS_STAGE_URL,
            landscape: Landscape.DRAFT,
        });
        window.sessionStorage.removeItem(PARAM_ENV);
    });

    it('host env "local" -> WCS prod origin + prod akamai', () => {
      const config = { commerce: {}, env: { name: 'local' }, };
        const settings = getSettings(config, mockService);
        expect(settings.wcsURL).to.equal(WCS_PROD_URL);
        expect(settings.env).to.equal(Env.PRODUCTION);
    });

    it('host env "stage" -> WCS prod origin + prod akamai', () => {
      const config = { commerce: {}, env: { name: 'stage' }, };
        const settings = getSettings(config, mockService);
        expect(settings.wcsURL).to.equal(WCS_PROD_URL);
        expect(settings.env).to.equal(Env.PRODUCTION);
    });

    it('host env "prod" -> WCS prod origin + prod akamai', () => {
      const config = { commerce: {}, env: { name: 'prod' }, };
        const settings = getSettings(config, mockService);
        expect(settings.wcsURL).to.equal(WCS_PROD_URL);
        expect(settings.env).to.equal(Env.PRODUCTION);
    });

    it('host env "stage" - override landscape and WCS origin (_stage)', () => {
        window.sessionStorage.setItem(PARAM_ENV, 'stage');
        window.sessionStorage.setItem(PARAM_LANDSCAPE, 'DRAFT');
        const config = { commerce: { allowOverride: 'true' } };
        const settings = getSettings(config, mockService);
        expect(settings.wcsURL).to.equal(WCS_STAGE_URL);
        expect(settings.landscape).to.equal(Landscape.DRAFT);
        expect(settings.env).to.equal(Env.STAGE);
    });

    it('if host env is "prod" - cant override landscape or WCS origin', () => {
        window.sessionStorage.setItem(PARAM_ENV, 'stage');
        window.sessionStorage.setItem(PARAM_LANDSCAPE, 'DRAFT');
        const config = { commerce: {} };
        const settings = getSettings(config, mockService);
        expect(settings.wcsURL).to.equal(WCS_PROD_URL);
        expect(settings.landscape).to.equal(Landscape.PUBLISHED);
        expect(settings.env).to.equal(Env.PRODUCTION);
    });
  
    it('sets correctly preview configuration from configuration', () => {
      const config = { commerce: {}, preview: '' };
      window.sessionStorage.setItem('wcsApiKey', 'wcms-commerce-ims-ro-user-milo');
      const settings = getSettings(config, mockService);
      expect(settings.preview).to.equal(true);
    });
  
    it('sets correctly preview configuration from parameter mas.preview', () => {
      const config = { commerce: {} };
      window.sessionStorage.setItem('wcsApiKey', 'wcms-commerce-ims-ro-user-milo');
      window.sessionStorage.setItem('mas.preview', 'on');
      const settings = getSettings(config, mockService);
      expect(settings.preview).to.equal(true);
    });
  
    it('unset correctly preview configuration from parameter mas.preview', () => {
      const config = { commerce: {}, preview: '' };
      window.sessionStorage.setItem('wcsApiKey', 'wcms-commerce-ims-ro-user-milo');
      window.sessionStorage.setItem('mas.preview', 'off');
      const settings = getSettings(config, mockService);
      expect(settings.preview).to.be.undefined;
    });
});

describe('getLocaleSettings', () => {
  it('returns default settings when called without arguments', () => {
      const result = getLocaleSettings();
      expect(result).to.deep.equal({
          locale: `${Defaults.language}_${Defaults.country}`,
          language: Defaults.language,
          country: Defaults.country,
      });
  });

  it('returns default settings when called with empty object', () => {
      const result = getLocaleSettings({});
      expect(result).to.deep.equal({
          locale: `${Defaults.language}_${Defaults.country}`,
          language: Defaults.language,
          country: Defaults.country,
      });
  });

  it('extracts language and country from supported locale', () => {
      const result = getLocaleSettings({ locale: 'fr_FR' });
      expect(result).to.deep.equal({
          locale: 'fr_FR',
          language: 'fr',
          country: 'FR',
      });
  });

  it('extracts language and country from another supported locale', () => {
      const result = getLocaleSettings({ locale: 'ja_JP' });
      expect(result).to.deep.equal({
          locale: 'ja_JP',
          language: 'ja',
          country: 'JP',
      });
  });

  it('uses provided language and country parameters', () => {
      const result = getLocaleSettings({ language: 'de', country: 'DE' });
      expect(result).to.deep.equal({
          locale: 'de_DE',
          language: 'de',
          country: 'DE',
      });
  });

  it('uses locale parameter as-is when provided with explicit country', () => {
      const result = getLocaleSettings({ locale: 'en_US', country: 'GB' });
      expect(result).to.deep.equal({
          locale: 'en_US',
          language: 'en',
          country: 'GB',
      });
  });

  it('uses locale parameter as-is when provided with explicit language', () => {
      const result = getLocaleSettings({ locale: 'en_US', language: 'fr' });
      expect(result).to.deep.equal({
          locale: 'en_US',
          language: 'fr',
          country: 'US',
      });
  });

  it('uses locale parameter as-is when provided with both explicit language and country', () => {
      const result = getLocaleSettings({
          locale: 'en_US',
          language: 'de',
          country: 'AT',
      });
      expect(result).to.deep.equal({
          locale: 'en_US',
          language: 'de',
          country: 'AT',
      });
  });

  it('uses default country when only language is provided', () => {
      const result = getLocaleSettings({ language: 'en' });
      expect(result).to.deep.equal({
          locale: 'en_US',
          language: 'en',
          country: Defaults.country,
      });
  });

  it('falls back to default locale when only unsupported country is provided', () => {
      const result = getLocaleSettings({ country: 'FR' });
      expect(result).to.deep.equal({
          locale: 'en_FR',
          language: Defaults.language,
          country: 'FR',
      });
  });

  it('constructs supported locale when only supported country is provided', () => {
      const result = getLocaleSettings({ country: 'GB' });
      expect(result).to.deep.equal({
          locale: 'en_GB',
          language: Defaults.language,
          country: 'GB',
      });
  });
});

describe('getPreviewSurface', () => {
  it('returns "acom" for wcms-commerce-ims-ro pattern match', () => {
      const result = getPreviewSurface('wcms-commerce-ims-ro-user-milo');
      expect(result).to.equal('acom');
  });

  it('returns "acom" for another wcms-commerce-ims-ro pattern match', () => {
      const result = getPreviewSurface('wcms-commerce-ims-ro-api-key-123');
      expect(result).to.equal('acom');
  });

  it('returns "ccd" for CreativeCloud pattern match', () => {
      const result = getPreviewSurface('CreativeCloud_Enterprise');
      expect(result).to.equal('ccd');
  });

  it('returns "ccd" for another CreativeCloud pattern match', () => {
      const result = getPreviewSurface('CreativeCloud_Personal');
      expect(result).to.equal('ccd');
  });

  it('returns "adobe-home" for CCHome pattern match', () => {
      const result = getPreviewSurface('CCHome_default');
      expect(result).to.equal('adobe-home');
  });

  it('returns "adobe-home" for another CCHome pattern match', () => {
      const result = getPreviewSurface('CCHome_v2');
      expect(result).to.equal('adobe-home');
  });

  it('returns wcsApiKey when no pattern matches and no previewParam', () => {
      const apiKey = 'custom-api-key-123';
      const result = getPreviewSurface(apiKey);
      expect(result).to.equal(apiKey);
  });

  it('returns wcsApiKey when no pattern matches and previewParam is undefined', () => {
      const apiKey = 'another-custom-key';
      const result = getPreviewSurface(apiKey, undefined);
      expect(result).to.equal(apiKey);
  });

  it('returns wcsApiKey when no pattern matches and previewParam is null', () => {
      const apiKey = 'test-api-key';
      const result = getPreviewSurface(apiKey, null);
      expect(result).to.equal(apiKey);
  });

  it('returns previewParam when no pattern matches and previewParam is provided', () => {
      const apiKey = 'unmatched-key';
      const previewParam = 'custom-surface';
      const result = getPreviewSurface(apiKey, previewParam);
      expect(result).to.equal(previewParam);
  });

  it('returns empty string when no pattern matches and previewParam is empty string', () => {
      const apiKey = 'test-key';
      const result = getPreviewSurface(apiKey, '');
      expect(result).to.equal('');
  });

  it('returns previewParam when no pattern matches and previewParam is 0', () => {
      const apiKey = 'test-key';
      const result = getPreviewSurface(apiKey, 0);
      expect(result).to.equal(0);
  });

  it('returns previewParam when no pattern matches and previewParam is false', () => {
      const apiKey = 'test-key';
      const result = getPreviewSurface(apiKey, false);
      expect(result).to.equal(false);
  });

  it('prioritizes pattern match over previewParam', () => {
      const result = getPreviewSurface(
          'wcms-commerce-ims-ro-test',
          'should-be-ignored',
      );
      expect(result).to.equal('acom');
  });

  it('handles pattern match with special characters', () => {
      const result = getPreviewSurface('CreativeCloud_!@#$%');
      expect(result).to.equal('ccd');
  });
});
