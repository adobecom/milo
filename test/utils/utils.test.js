import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const utils = {};

const config = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Utils', () => {
  before(() => {
    sinon.spy(console, 'log');
  });

  after(() => {
    console.log.restore();
  });

  before(async () => {
    const module = await import('../../libs/utils/utils.js');
    module.setConfig(config);
    Object.keys(module).forEach((func) => {
      utils[func] = module[func];
    });
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
    const gaLink = document.querySelector('a[href="https://analytics.google.com"]');
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
    await utils.loadDeferred(document);
    const gaLink = document.querySelector('a[href^="https://analytics.google.com"]');
    expect(gaLink).to.exist;
  });

  it('loadDelayed() test - expect moduled', async () => {
    const mod = await utils.loadDelayed(0);
    expect(mod).to.exist;
  });

  it('loadDelayed() test - expect nothing', async () => {
    document.head.querySelector('meta[name="interlinks"]').remove();
    const mod = await utils.loadDelayed(0);
    expect(mod).to.be.null;
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

  it('getLocale default return', () => {
    expect(utils.getLocale().ietf).to.equal('en-US');
  });

  it('getLocaleFromPath for different paths', () => {
    const locales = {
      '': { ietf: 'en-US', tk: 'hah7vzn.css' },
      langstore: { ietf: 'en-US', tk: 'hah7vzn.css' },
      be_fr: { ietf: 'fr-BE', tk: 'vrk5vyv.css' },
    };

    function validateLocale(path, expectedOutput) {
      const locale = utils.getLocaleFromPath(locales, path);
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
});
