import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getFontKit, setConfig } from '../../libs/utils/utils.js';
import loadFonts from '../../libs/utils/fonts.js';

const cssConfig = {
  codeRoot: '/libs',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
};

describe('Fonts', () => {
  let originalUrl;
  let append;
  let meta;

  beforeEach(() => {
    originalUrl = window.location.href;
    const url = new URL(originalUrl);
    url.searchParams.delete('font-kit');
    window.history.replaceState(null, '', url);
    meta = document.createElement('meta');
    meta.name = 'font-kit';
    document.head.append(meta);
    append = sinon.stub(document.head, 'appendChild').callsFake((link) => {
      queueMicrotask(() => link.dispatchEvent(new Event('load')));
      return link;
    });
  });

  afterEach(() => {
    sinon.restore();
    meta.remove();
    window.history.replaceState(null, '', originalUrl);
  });

  function setKit(kit) {
    const url = new URL(window.location.href);
    url.searchParams.set('font-kit', kit);
    window.history.replaceState(null, '', url);
  }

  it('loads the locale kit by default', async () => {
    const { locale } = setConfig(cssConfig);
    expect(await loadFonts(locale)).to.equal('load');
    expect(append.firstCall.args[0].href).to.equal('https://use.typekit.net/hah7vzn.css');
  });

  ['abc1234', 'abc1234.css'].forEach((kit) => {
    it(`loads an opt-in CSS kit from ${kit}`, async () => {
      setKit(kit);
      await loadFonts(cssConfig.locales['']);
      expect(append.firstCall.args[0].href).to.equal('https://use.typekit.net/abc1234.css');
    });
  });

  it('reads metadata and lets the query override or disable it', () => {
    meta.content = 'abc1234';
    expect(getFontKit()).to.equal('abc1234.css');
    setKit('def5678.css');
    expect(getFontKit()).to.equal('def5678.css');
    setKit('default');
    expect(getFontKit()).to.be.undefined;
  });

  it('rejects URLs, scripts, and invalid kit IDs', () => {
    [
      'https://example.com/abc1234.css', '../abc1234.css', 'abc1234.js',
      'abc1234.css?extra=1', 'abc1234"><script>', '', 'a', 'abcdefgh',
    ].forEach((kit) => {
      setKit(kit);
      expect(getFontKit()).to.be.undefined;
    });
  });

  it('loads a metadata-selected kit', async () => {
    meta.content = 'abc1234';
    await loadFonts(cssConfig.locales['']);
    expect(append.firstCall.args[0].href).to.equal('https://use.typekit.net/abc1234.css');
  });

  it('preserves the mobile Safari kit selection by default', async () => {
    sinon.stub(navigator, 'userAgent').value('Version/18.0 Mobile Safari/605.1.15');
    sinon.stub(window.screen, 'width').value(390);
    await loadFonts(cssConfig.locales['']);
    expect(append.firstCall.args[0].href).to.equal('https://use.typekit.net/vti0xwb.css');
  });

  it('uses the explicitly selected kit on mobile Safari', async () => {
    sinon.stub(navigator, 'userAgent').value('Version/18.0 Mobile Safari/605.1.15');
    sinon.stub(window.screen, 'width').value(390);
    setKit('abc1234');
    await loadFonts(cssConfig.locales['']);
    expect(append.firstCall.args[0].href).to.equal('https://use.typekit.net/abc1234.css');
  });

  it('reports failures using the selected kit ID', async () => {
    setKit('abc1234');
    append.callsFake((link) => {
      queueMicrotask(() => link.dispatchEvent(new Event('error')));
      return link;
    });
    let error;
    try {
      await loadFonts(cssConfig.locales['']);
    } catch (e) {
      error = e;
    }
    expect(error?.message).to.equal('Failed to load Typekit stylesheet: abc1234.css');
  });

  it('does not insert a duplicate stylesheet', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://use.typekit.net/hah7vzn.css';
    sinon.stub(document.head, 'querySelector').returns(link);
    expect(await loadFonts(cssConfig.locales[''])).to.equal('noop');
    expect(append.called).to.be.false;
  });

  it('preserves CJK dynamic subsetting despite the CSS kit override', async () => {
    setKit('abc1234');
    const clock = sinon.useFakeTimers();
    const parent = document.getElementsByTagName('script')[0].parentNode;
    const insert = sinon.stub(parent, 'insertBefore').callsFake((script) => script);
    const response = await loadFonts({ tk: 'cjk-kit' });
    expect(response.classList.contains('wf-loading')).to.be.true;
    expect(insert.firstCall.args[0].src).to.equal('https://use.typekit.net/cjk-kit.js');
    clock.tick(3000);
    response.classList.remove('wf-inactive');
  });
});
