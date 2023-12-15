import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor, waitForElement } from '../helpers/waitfor.js';
import { mockFetch } from '../helpers/generalHelpers.js';

const utils = {};

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};
const ogFetch = window.fetch;

describe('Utils', () => {
  let head;
  let body;
  before(async () => {
    head = await readFile({ path: './mocks/head.html' });
    body = await readFile({ path: './mocks/body.html' });
    const module = await import('../../libs/utils/utils.js');
    module.setConfig(config);
    Object.keys(module).forEach((func) => {
      utils[func] = module[func];
    });
    window.hlx = { rum: { isSelected: false } };
  });

  after(() => {
    delete window.hlx;
  });

  describe('with body', () => {
    beforeEach(async () => {
      window.fetch = mockFetch({ payload: { data: '' } });
      document.head.innerHTML = head;
      document.body.innerHTML = body;
      await utils.loadArea();
      sinon.spy(console, 'log');
    });

    afterEach(() => {
      window.fetch = ogFetch;
      // eslint-disable-next-line no-console
      console.log.restore();
    });

    describe('Template', () => {
      it('loads a template script and style', async () => {
        const meta = document.createElement('meta');
        meta.name = 'template';
        meta.content = 'Template Sidebar';
        document.head.append(meta);
        await utils.loadTemplate();
        const hasTemplateSidebar = document.querySelector('body.template-sidebar');
        expect(hasTemplateSidebar).to.exist;
      });
    });

    describe('PDF Viewer', () => {
      it('pdf link with different text content opens in new window', () => {
        const link = document.querySelector('a[href$="pdf"]');
        utils.decorateAutoBlock(link);
        expect(link.target).to.equal('_blank');
      });
    });

    describe('Configure Auto Block', () => {
      it('Disable auto block when #_dnb in url', async () => {
        await waitForElement('.disable-autoblock');
        const disableAutoBlockLink = document.querySelector('.disable-autoblock');
        utils.decorateLinks(disableAutoBlockLink);
        expect(disableAutoBlockLink.href).to.equal('https://www.instagram.com/');
      });

      it('Auto block works as expected when #_dnb is not added to url', async () => {
        const a = await waitForElement('[href="https://twitter.com/Adobe"]');
        utils.decorateAutoBlock(a);
        const autoBlockLink = document.querySelector('[href="https://twitter.com/Adobe"]');
        expect(autoBlockLink.className).to.equal('twitter link-block');
      });

      it('Does not error on invalid url', () => {
        const autoBlock = utils.decorateAutoBlock('http://HostName:Port/lc/system/console/configMgr');
        expect(autoBlock).to.equal(false);
      });
    });

    describe('Fragments', () => {
      it('fully unwraps a fragment', () => {
        const fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[0]);
        expect(fragments[0].parentElement.nodeName).to.equal('DIV');
      });

      it('Does not unwrap when sibling content present', () => {
        const fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[1]);
        expect(fragments[1].parentElement.nodeName).to.equal('P');
        expect(fragments[1].parentElement.textContent).to.contain('My sibling');
      });

      it('Does not unwrap when not in paragraph tag', () => {
        const fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[1]);
        expect(fragments[1].parentElement.nodeName).to.equal('P');
        expect(fragments[1].parentElement.textContent).to.contain('My sibling');
      });
    });

    it('Loads a script', async () => {
      const script = await utils.loadScript('/test/utils/mocks/script.js', 'module');
      expect(script).to.exist;
      expect(script.type).to.equal('module');
      await utils.loadScript('/test/utils/mocks/script.js', 'module');
      expect(script).to.exist;
    });

    it('Loads a script twice', async () => {
      const scriptOne = await utils.loadScript('/test/utils/mocks/script.js', 'module');
      expect(scriptOne).to.exist;
      const scriptTwo = await utils.loadScript('/test/utils/mocks/script.js', 'module');
      expect(scriptTwo).to.exist;
    });

    it('Rejects a bad script', async () => {
      try {
        await utils.loadScript('/test/utils/mocks/error.js');
      } catch (err) {
        expect(err.message).to.equal('error loading script: http://localhost:2000/test/utils/mocks/error.js');
      }
    });

    it('Does not setup nofollow links', async () => {
      window.fetch = mockFetch({ payload: { data: [] } });
      await utils.loadDeferred(document, [], { links: 'on' }, () => {});
      const gaLink = document.querySelector('a[href="https://analytics.google.com/"]');
      expect(gaLink.getAttribute('rel')).to.be.null;
    });

    it('Sets up nofollow links', async () => {
      const metaOn = document.createElement('meta');
      metaOn.name = 'nofollow-links';
      metaOn.content = 'on';

      const metaPath = document.createElement('meta');
      metaPath.name = 'nofollow-path';
      metaPath.content = '/test/utils/mocks/nofollow.json';

      document.head.append(metaOn, metaPath);
      await utils.loadDeferred(document, [], { contentRoot: '' }, () => {});
      const gaLink = document.querySelector('a[href^="https://analytics.google.com"]');
      expect(gaLink).to.exist;
    });

    it('Converts UTF-8 to Base 64', () => {
      const b64 = utils.utf8ToB64('hello world');
      expect(b64).to.equal('aGVsbG8gd29ybGQ=');
    });

    it('Converts Base 64 to UTF-8', () => {
      const b64 = utils.b64ToUtf8('aGVsbG8gd29ybGQ=');
      expect(b64).to.equal('hello world');
    });

    it('Successfully dies parsing a bad config', () => {
      utils.parseEncodedConfig('error');
      // eslint-disable-next-line no-console
      expect(console.log.args[0][0].name).to.equal('InvalidCharacterError');
    });

    it('Decorates no nav', async () => {
      const headerMeta = utils.createTag('meta', { name: 'header', content: 'off' });
      const footerMeta = utils.createTag('meta', { name: 'footer', content: 'off' });
      document.head.append(headerMeta, footerMeta);
      await utils.loadArea();
      expect(document.querySelector('header')).to.not.exist;
      expect(document.querySelector('footer')).to.not.exist;
    });

    it('Decorates placeholder', () => {
      const paragraphs = [...document.querySelectorAll('p')];
      const lastPara = paragraphs.pop();
      expect(lastPara.textContent).to.equal('nothing to see here');
    });

    it('Decorates meta helix url', () => {
      const meta = document.head.querySelector('[name="hlx-url"]');
      expect(meta.content).to.equal('http://localhost:2000/otis');
    });

    it('Adds an event listener for modal:open', async () => {
      const meta = document.createElement('meta');
      meta.name = '-milo';
      meta.content = 'http://localhost:2000/test/blocks/modals/mocks/milo';
      document.head.append(meta);
      const event = new CustomEvent('modal:open', { detail: { hash: '#milo' } });
      window.dispatchEvent(event);
      await waitForElement('#milo');
      expect(document.getElementById('milo')).to.exist;
    });

    it('getLocale default return', () => {
      expect(utils.getLocale().ietf).to.equal('en-US');
    });

    it('getLocale for different paths', () => {
      const locales = {
        '': { ietf: 'en-US', tk: 'hah7vzn.css' },
        langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
        be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
      };

      function validateLocale(path, expectedOutput) {
        const locale = utils.getLocale(locales, path);
        expect(locale.prefix).to.equal(expectedOutput.prefix);
        expect(locale.ietf).to.equal(expectedOutput.ietf);
        expect(locale.tk).to.equal(expectedOutput.tk);
      }

      validateLocale('/', { prefix: '', ietf: 'en-US', tk: 'hah7vzn.css' });
      validateLocale('/page', { prefix: '', ietf: 'en-US', tk: 'hah7vzn.css' });
      validateLocale('/be_fr', { prefix: '/be_fr', ietf: 'fr-BE', tk: 'vrk5vyv.css' });
      validateLocale('/be_fr/page', { prefix: '/be_fr', ietf: 'fr-BE', tk: 'vrk5vyv.css' });
      validateLocale('/langstore/lv', { prefix: '/langstore/lv', ietf: 'en-US', tk: 'hah7vzn.css' });
      validateLocale('/langstore/lv/page', { prefix: '/langstore/lv', ietf: 'en-US', tk: 'hah7vzn.css' });
    });

    it('Open link in new tab', () => {
      const newTabLink = document.querySelector('.new-tab');
      newTabLink.target = '_blank';
      expect(newTabLink.target).to.contain('_blank');
      newTabLink.href = newTabLink.href.replace('#_blank', '');
      expect(newTabLink.href).to.equal('https://www.adobe.com/test');
    });

    it('Sets up milo.deferredPromise', async () => {
      const { resolveDeferred } = utils.getConfig();
      expect(window.milo.deferredPromise).to.exist;
      utils.loadDeferred(document, [], {}, resolveDeferred);
      const result = await window.milo.deferredPromise;
      expect(result).to.be.true;
    });

    describe('SVGs', () => {
      it('Not a valid URL', () => {
        document.body.innerHTML = '<div class="bad-url">https://www.adobe.com/test</div>';
        const a = document.querySelector('.bad-url');
        try {
          // eslint-disable-next-line no-new
          new URL(a.textContent);
        } catch (err) {
          expect(err.message).to.equal("Failed to construct 'URL': Invalid URL");
        }
      });
    });

    describe('rtlSupport', () => {
      before(async () => {
        config.locales = {
          '': { ietf: 'en-US', tk: 'hah7vzn.css' },
          africa: { ietf: 'en', tk: 'pps7abe.css' },
          il_he: { ietf: 'he', tk: 'nwq1mna.css', dir: 'rtl' },
          langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
          mena_ar: { ietf: 'ar', tk: 'dis2dpj.css', dir: 'rtl' },
          ua: { tk: 'aaz7dvd.css' },
        };
      });

      function setConfigWithPath(path) {
        document.documentElement.removeAttribute('dir');
        config.pathname = path;
        utils.setConfig(config);
      }

      it('LTR Languages have dir as ltr', () => {
        setConfigWithPath('/africa/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('ltr');
      });

      it('LTR Languages have dir as ltr for langstore path', () => {
        setConfigWithPath('/langstore/en/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('ltr');
      });

      it('RTL Languages have dir as rtl', () => {
        setConfigWithPath('/il_he/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('rtl');
        setConfigWithPath('/mena_ar/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('rtl');
      });

      it('RTL Languages have dir as rtl for langstore path', () => {
        setConfigWithPath('/langstore/he/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('rtl');
        setConfigWithPath('/langstore/ar/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('rtl');
      });

      it('Gracefully dies when locale ietf is missing and dir is not set.', () => {
        setConfigWithPath('/ua/solutions');
        expect(document.documentElement.getAttribute('dir')).to.equal('ltr');
      });
    });

    describe('localizeLink', () => {
      before(() => {
        config.locales = {
          '': { ietf: 'en-US', tk: 'hah7vzn.css' },
          fi: { ietf: 'fi-FI', tk: 'aaz7dvd.css' },
          be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
          langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
        };
        config.prodDomains = ['milo.adobe.com', 'www.adobe.com'];
        config.pathname = '/be_fr/page';
        utils.setConfig(config);
      });

      function setConfigPath(path) {
        config.pathname = path;
        utils.setConfig(config);
      }

      it('Same domain link is relative and localized', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions');
      });

      it('Same domain fragment link is relative and localized', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/fragments/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/fragments/gnav/solutions');
      });

      it('Same domain langstore link is relative and localized', () => {
        setConfigPath('/langstore/fr/page');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/langstore/fr/gnav/solutions');
        setConfigPath('/be_fr/page');
      });

      it('Same domain extensions /, .html, .json are handled', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.html', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions.html');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.json', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions.json');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions/', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions/');
      });

      it('Same domain link that is already localized is returned as relative', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/be_fr/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/fi/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/fi/gnav/solutions');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/fi', 'main--milo--adobecom.hlx.page')).to.equal('/fi');
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/langstore/fr/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/langstore/fr/gnav/solutions');
      });

      it('Same domain PDF link is returned as relative and not localized', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.pdf', 'main--milo--adobecom.hlx.page')).to.equal('/gnav/solutions.pdf');
      });

      it('Same domain link with #_dnt is returned as relative, #_dnt is removed and not localized', () => {
        expect(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions#_dnt', 'main--milo--adobecom.hlx.page'))
          .to
          .equal('/gnav/solutions');
      });

      it('Live domain html link  is absolute and localized', () => {
        expect(utils.localizeLink('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html', 'main--milo--adobecom.hlx.page'))
          .to
          .equal('https://milo.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
        expect(utils.localizeLink('https://www.adobe.com/solutions/customer-experience-personalization-at-scale.html', 'main--milo--adobecom.hlx.page'))
          .to
          .equal('https://www.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
      });

      it('Live domain html link which is not in prod domains is absolute and localized', () => {
        expect(utils.localizeLink('https://test.adobe.com/solutions/customer-experience-personalization-at-scale.html', window.location.hostname, true))
          .to
          .equal('https://test.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
        expect(utils.localizeLink('https://test.adobe.com/solutions/customer-experience-personalization-at-scale.html', window.location.hostname, true))
          .to
          .equal('https://test.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
      });

      it('Live domain html link with #_dnt is left absolute, not localized and #_dnt is removed', () => {
        expect(utils.localizeLink('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html#_dnt', 'main--milo--adobecom.hlx.page'))
          .to
          .equal('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html');
      });

      it('Invalid href fails gracefully', () => {
        expect(utils.localizeLink('not-a-url', 'main--milo--adobecom.hlx.page'))
          .to
          .equal('not-a-url');
      });
    });

    it('creates an IntersectionObserver', (done) => {
      const block = document.createElement('div');
      block.id = 'myblock';
      block.innerHTML = '<div>hello</div>';
      document.body.appendChild(block);
      const io = utils.createIntersectionObserver({
        el: block,
        options: { rootMargin: '10000px' },
        callback: (target) => {
          expect(target).to.equal(block);
          done();
        },
      });
      expect(io instanceof IntersectionObserver).to.be.true;
    });

    it('should remove any blocks with the hide-block class from the DOM', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/body.html' });
      const hiddenQuoteBlock = document.querySelector('.quote.hide-block');
      expect(hiddenQuoteBlock).to.exist;
      const block = await utils.loadBlock(hiddenQuoteBlock);
      expect(block).to.be.null;
      expect(document.querySelector('.quote.hide-block')).to.be.null;
    });
  });

  describe('title-append', async () => {
    beforeEach(async () => {
      document.head.innerHTML = await readFile({ path: './mocks/head-title-append.html' });
    });
    it('should append to title using string from metadata', async () => {
      const expected = 'Document Title NOODLE';
      await utils.loadArea();
      await waitFor(() => document.title === expected);
      expect(document.title).to.equal(expected);
    });
  });

  describe('seotech', async () => {
    beforeEach(async () => {
      window.lana = { log: (msg) => console.error(msg) };
      document.head.innerHTML = await readFile({ path: './mocks/head-seotech-video.html' });
    });
    afterEach(() => {
      window.lana.release?.();
    });
    it('should import feature when metadata is defined and error if invalid', async () => {
      const expectedError = 'SEOTECH: Failed to construct \'URL\': Invalid URL';
      await utils.loadArea();
      const lanaStub = sinon.stub(window.lana, 'log');
      await waitFor(() => lanaStub.calledOnceWith(expectedError));
      expect(lanaStub.calledOnceWith(expectedError)).to.be.true;
    });
  });

  describe('scrollToHashedElement', () => {
    before(() => {
      const div = document.createElement('div');
      div.className = 'global-navigation';
      document.body.appendChild(div);
      window.location.hash = '#not-block';
      window.scrollBy = () => {};
    });

    it('should scroll to the hashed element', () => {
      let scrollToCalled = false;
      window.scrollTo = () => {
        scrollToCalled = true;
      };

      utils.scrollToHashedElement('#not-block');
      expect(scrollToCalled).to.be.true;
      expect(document.getElementById('not-block')).to.exist;
    });

    it('should not scroll if no hash is present', () => {
      window.location.hash = '';
      let scrollToCalled = false;
      window.scrollBy = () => {
        scrollToCalled = true;
      };
      utils.scrollToHashedElement('');
      expect(scrollToCalled).to.be.false;
    });

    it('should scroll to the hashed element with special character', () => {
      let scrollToCalled = false;
      window.scrollTo = () => {
        scrollToCalled = true;
      };

      utils.scrollToHashedElement('#tools-f%C3%BCr-das-verhalten');
      expect(scrollToCalled).to.be.true;
      expect(document.getElementById('tools-für-das-verhalten')).to.exist;
    });
  });

  describe('useDotHtml', async () => {
    beforeEach(async () => {
      window.lana = { log: (msg) => console.error(msg) };
      document.body.innerHTML = await readFile({ path: './mocks/useDotHtml.html' });
    });
    afterEach(() => {
      window.lana.release?.();
    });
    it('should add .html to relative links when enabled', async () => {
      utils.setConfig({ useDotHtml: true, htmlExclude: [/exclude\/.*/gm] });
      expect(utils.getConfig().useDotHtml).to.be.true;
      await utils.decorateLinks(document.getElementById('linklist'));
      expect(document.getElementById('excluded')?.getAttribute('href'))
        .to.equal('/exclude/this/page');
      const htmlLinks = document.querySelectorAll('.has-html');
      htmlLinks.forEach((link) => {
        expect(link.href).to.contain('.html');
      });
    });

    it('should not add .html to relative links when disabled', async () => {
      utils.setConfig({ useDotHtml: false, htmlExclude: [/exclude\/.*/gm] });
      expect(utils.getConfig().useDotHtml).to.be.false;
      await utils.decorateLinks(document.getElementById('linklist'));
      expect(document.getElementById('excluded')?.getAttribute('href'))
        .to.equal('/exclude/this/page');
      const htmlLinks = document.querySelectorAll('.has-html');
      htmlLinks.forEach((link) => {
        expect(link.href).to.not.contain('.html');
      });
    });
  });

  describe('footer promo', () => {
    const favicon = '<link rel="icon" href="data:,">';
    const typeTaxonomy = '<meta name="footer-promo-type" content="taxonomy">';
    const ccxVideo = '<meta name="footer-promo-tag" content="ccx-video-links">';
    const analytics = '<meta property="article:tag" content="Analytics">';
    const commerce = '<meta property="article:tag" content="Commerce">';
    const summit = '<meta property="article:tag" content="Summit">';
    const promoConfig = { locale: { contentRoot: '/test/utils/mocks' } };
    let oldHead;
    let promoBody;
    let taxonomyData;

    before(async () => {
      oldHead = document.head.innerHTML;
      promoBody = await readFile({ path: './mocks/body-footer-promo.html' });
      taxonomyData = await readFile({ path: './mocks/taxonomy.json' });
    });

    beforeEach(() => {
      document.body.innerHTML = promoBody;
      window.fetch = mockFetch({ payload: JSON.parse(taxonomyData) });
    });

    afterEach(() => {
      window.fetch = ogFetch;
    });

    after(() => {
      document.head.innerHTML = oldHead;
    });

    it('loads from metadata', async () => {
      document.head.innerHTML = favicon + ccxVideo;
      await utils.decorateFooterPromo(promoConfig);
      const a = document.querySelector('main > div:last-of-type a');
      expect(a.href).includes('/fragments/footer-promos/ccx-video-links');
    });

    it('loads from taxonomy in order on sheet', async () => {
      document.head.innerHTML = ccxVideo + typeTaxonomy + analytics + commerce + summit;
      await utils.decorateFooterPromo(promoConfig);
      const a = document.querySelector('main > div:last-of-type a');
      expect(a.href).includes('/fragments/footer-promos/commerce');
    });

    it('loads backup from tag when taxonomy has no promo', async () => {
      document.head.innerHTML = ccxVideo + typeTaxonomy + summit;
      await utils.decorateFooterPromo(promoConfig);
      const a = document.querySelector('main > div:last-of-type a');
      expect(a.href).includes('/fragments/footer-promos/ccx-video-links');
    });
  });

  describe('personalization', async () => {
    const MANIFEST_JSON = {
      info: { total: 2, offset: 0, limit: 2, data: [{ key: 'manifest-type', value: 'Personalization' }, { key: 'manifest-override-name', value: '' }, { key: 'name', value: '1' }] }, placeholders: { total: 0, offset: 0, limit: 0, data: [] }, experiences: { total: 1, offset: 0, limit: 1, data: [{ action: 'insertContentAfter', selector: '.marquee', 'page filter (optional)': '/products/special-offers', chrome: 'https://main--milo--adobecom.hlx.page/drafts/mariia/fragments/personalizationtext' }] }, ':version': 3, ':names': ['info', 'placeholders', 'experiences'], ':type': 'multi-sheet',
    };
    function htmlResponse() {
      return new Promise((resolve) => {
        resolve({
          ok: true,
          json: () => MANIFEST_JSON,
        });
      });
    }

    it('should process personalization manifest and save in config', async () => {
      window.fetch = sinon.stub().returns(htmlResponse());
      document.head.innerHTML = await readFile({ path: './mocks/head-personalization.html' });
      await utils.loadArea();
      const resultConfig = utils.getConfig();
      const resultExperiment = resultConfig.experiments[0];
      expect(resultConfig.mep.preview).to.be.true;
      expect(resultConfig.experiments.length).to.equal(3);
      expect(resultExperiment.manifest).to.equal('/products/special-offers-manifest.json');
    });
  });
});
