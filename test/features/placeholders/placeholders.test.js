import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig, customFetch } from '../../../libs/utils/utils.js';
import { replaceText, replaceKey, replaceKeyArray, decoratePlaceholderArea, getPlaceholderRoot } from '../../../libs/features/placeholders.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

describe('Placeholders', () => {
  let paramsGetStub;

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  it('Fails on JSON', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('recommended for you');
  });

  it('Works with cache control', async () => {
    const text = await replaceText('Look at me, I am {{testing-cache}}', config);
    expect(text).to.equal('Look at me, I am testing cache');
  });

  it('Replaces text & links', async () => {
    config.locale.contentRoot = '/test/features/placeholders';
    let text = 'Hello world {{recommended-for-you}} and {{no-results}}. Call tel: %7B%7Bphone-number%7D%7D';
    text = await replaceText(text, config);
    expect(text).to.equal('Hello world Recommended for you and No results found. Call tel: 800 12345 6789');
  });

  it('Replaces key', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('Recommended for you');
  });

  it('Replaces a key array', async () => {
    const labelArray = await replaceKeyArray(['recommended-for-you', 'no-results'], config);
    expect(labelArray).to.eql(['Recommended for you', 'No results found']);
  });

  it('Gracefully falls back', async () => {
    const text = await replaceKey('this-wont-work', config);
    expect(text).to.equal('this wont work');
  });

  it('Does show an empty value', async () => {
    const text = await replaceKey('empty-value', config);
    expect(text).to.equal('');
  });

  it('Replaces attributes with placeholders', async () => {
    const placeholderPath = 'https://main--cc--adobecom.hlx.page/cc-shared/placeholders.json';
    const placeholderRequest = customFetch({ resource: placeholderPath, withCacheRules: true })
      .catch(() => ({}));

    const tag = document.createElement('a');
    tag.setAttribute('href', '/modal/%7B%7Bphone-number%7D%7D');
    tag.setAttribute('data-attr', '/modal/%7B%7Bphone-number%7D%7D');

    await decoratePlaceholderArea({ placeholderPath, placeholderRequest, nodes: [tag] });

    expect(tag.getAttribute('href')).to.equal('/modal/800 12345 6789');
    expect(tag.getAttribute('data-attr')).to.equal('/modal/800 12345 6789');
  });

  it('Replaces geo-specific placeholders when disable-geo-placeholders meta content is "off" or meta tag not defined', async () => {
    config.locale.contentRoot = '/test/features/placeholders/bg';
    let text = '{{add-to-cart}}. {{adobe-apps}}';
    text = await replaceText(text, config);
    expect(text).to.equal('Добавяне в количката. Приложения на Adobe');
  });

  it('Replaces default placeholders when disable-geo-placeholders meta content is "on"', async () => {
    const meta = document.createElement('meta');
    meta.name = 'disable-geo-placeholders';
    meta.content = 'on';
    document.head.appendChild(meta);

    config.locale.contentRoot = '/test/features/placeholders/bg';
    config.locale.prefix = '/bg';
    let text = '{{add-to-cart}}. {{adobe-apps}}';
    text = await replaceText(text, config);
    document.head.removeChild(meta);
    expect(text).to.equal('Add to cart. Adobe Apps');
  });

  describe('getPlaceholderRoot', () => {
    afterEach(() => {
      // Remove any meta tags added during tests
      const existingMeta = document.querySelector('meta[name="placeholders-override"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    });

    it('Returns config.locale.contentRoot when no placeholders-override metadata or config.placeholderPath', () => {
      const testConfig = { locale: { contentRoot: '/test/content/root' } };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('/test/content/root');
    });

    it('Uses config.placeholderPath.contentRoot when provided', () => {
      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'prod' },
        placeholderPath: { contentRoot: '/custom/placeholders' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/bg/custom/placeholders');
    });

    it('Uses config.placeholderPath.repo in non-production environment', () => {
      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
        placeholderPath: {
          contentRoot: '/custom/placeholders',
          repo: 'custom-repo',
        },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--custom-repo--adobecom.aem.page/bg/custom/placeholders');
    });

    it('Prioritizes placeholders-override metadata over config.placeholderPath (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'custom-repo,/metadata-content-root';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'prod' },
        placeholderPath: { contentRoot: '/config-content-root' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/bg/metadata-content-root');
    });

    it('Uses placeholders-override metadata when config.placeholderPath is not provided (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'custom-repo,/metadata-content-root';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'prod' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/bg/metadata-content-root');
    });

    it('Returns default Adobe origin with placeholders-override (string format) in production', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'custom-repo,/cc-shared';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'prod' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/bg/cc-shared');
    });

    it('Uses placeholders-override metadata in non-production environment (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'cc,/cc-shared';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--cc--adobecom.aem.page/bg/cc-shared');
    });

    it('Prioritizes placeholders-override metadata over config.placeholderPath (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'metadata-repo,/cc-shared';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
        placeholderPath: {
          contentRoot: '/custom/placeholders',
          repo: 'config-repo',
        },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--metadata-repo--adobecom.aem.page/bg/cc-shared');
    });

    it('Handles config without locale prefix (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'custom-repo,/cc-shared';
      document.head.appendChild(meta);

      const testConfig = {
        locale: {},
        env: { name: 'prod' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/cc-shared');
    });

    it('Handles config without locale object (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = 'custom-repo,/cc-shared';
      document.head.appendChild(meta);

      const testConfig = { env: { name: 'prod' } };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/cc-shared');
    });

    it('Handles placeholders-override with object format in production', () => {
      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'prod' },
        placeholderPath: {
          repo: 'custom-repo',
          contentRoot: '/cc-shared',
        },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://www.adobe.com/bg/cc-shared');
    });

    it('Handles placeholders-override with object format in non-production', () => {
      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
        placeholderPath: {
          repo: 'custom-repo',
          contentRoot: '/cc-shared',
        },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--custom-repo--adobecom.aem.page/bg/cc-shared');
    });

    it('Trims whitespace from repo and contentRoot values (string format)', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = '  custom-repo  ,  /cc-shared  ';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--custom-repo--adobecom.aem.page/bg/cc-shared');
    });

    it('Trims whitespace from repo and contentRoot values (object format)', () => {
      const testConfig = {
        locale: { prefix: '/bg' },
        env: { name: 'stage' },
        placeholderPath: {
          repo: '  custom-repo  ',
          contentRoot: '  /cc-shared  ',
        },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('https://main--custom-repo--adobecom.aem.page/bg/cc-shared');
    });

    it('Handles empty string placeholders-override', () => {
      const meta = document.createElement('meta');
      meta.name = 'placeholders-override';
      meta.content = '';
      document.head.appendChild(meta);

      const testConfig = {
        locale: { contentRoot: '/test/content/root' },
        env: { name: 'prod' },
      };
      const result = getPlaceholderRoot(testConfig);
      expect(result).to.equal('/test/content/root');
    });
  });
});
