import { expect } from '@esm-bundle/chai';

const TYPEKIT_CSS = 'https://use.typekit.net/hah7vzn.css';
const TYPEKIT_ORIGINS = ['https://use.typekit.net', 'https://p.typekit.net'];
const FALLBACK_FAMILIES = ['Adobe Clean Fallback', 'Adobe Clean Fallback Roboto'];

describe('Early Adobe Clean font loading', () => {
  let utils;
  let moduleId = 0;

  const headLinks = () => [...document.head.querySelectorAll('link')];
  const kitLinks = () => headLinks().filter((link) => link.getAttribute('href') === TYPEKIT_CSS);

  before(async () => {
    await import('../../libs/utils/fonts.js');
  });

  beforeEach(async () => {
    moduleId += 1;
    // A fresh module instance gives loadArea its own memoized font promise.
    utils = await import(`../../libs/utils/utils.js?early-fonts=${moduleId}`);
    utils.setConfig({
      codeRoot: '/libs',
      locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
    });
    document.head.innerHTML = '<meta name="martech" content="off"><link rel="icon" href="data:,">';
    document.body.innerHTML = '<main><div><div class="text"><div><div><p>Description</p></div></div></div></div></main>';
  });

  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('preconnects to Typekit synchronously on a page without a foundation', async () => {
    const loading = utils.loadArea();
    TYPEKIT_ORIGINS.forEach((origin) => {
      const link = document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`);
      expect(link, origin).to.exist;
    });
    await loading;
  });

  it('requests the Typekit kit before the LCP section blocks are loaded', async () => {
    let textBlockLoadedAtKitRequest;
    const observer = new MutationObserver(() => {
      if (textBlockLoadedAtKitRequest !== undefined || !kitLinks().length) return;
      textBlockLoadedAtKitRequest = document.querySelector('.text')?.dataset.blockStatus === 'loaded';
    });
    observer.observe(document.head, { childList: true });
    await utils.loadArea();
    observer.disconnect();
    expect(textBlockLoadedAtKitRequest, 'kit requested').to.not.be.undefined;
    expect(textBlockLoadedAtKitRequest, 'text block already loaded').to.be.false;
  });

  it('loads the Typekit kit only once across the early and post-LCP calls', async () => {
    await utils.loadArea();
    expect(kitLinks().length).to.equal(1);
  });

  it('keeps loading the Typekit kit once on c2 pages', async () => {
    document.head.append(Object.assign(document.createElement('meta'), { name: 'foundation', content: 'c2' }));
    document.body.innerHTML = '<main><div><p>Description</p></div></main>';
    await utils.loadArea();
    expect(kitLinks().length).to.equal(1);
    TYPEKIT_ORIGINS.forEach((origin) => {
      expect(document.head.querySelectorAll(`link[rel="preconnect"][href="${origin}"]`).length, origin).to.equal(1);
    });
  });
});

describe('Adobe Clean fallback fonts', () => {
  let fontFaces;
  let rootRule;

  before(async () => {
    const css = await (await fetch('/libs/styles/styles.css')).text();
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    const rules = [...sheet.cssRules];
    fontFaces = rules.filter((rule) => rule instanceof CSSFontFaceRule);
    rootRule = rules.find((rule) => rule.selectorText === ':root' && rule.style.getPropertyValue('--body-font-family'));
  });

  const faces = (family) => fontFaces.filter((rule) => rule.style.getPropertyValue('font-family').replace(/['"]/g, '') === family);

  FALLBACK_FAMILIES.forEach((family) => {
    describe(family, () => {
      it('defines regular and bold faces', () => {
        const weights = faces(family).map((rule) => rule.style.getPropertyValue('font-weight')).sort();
        expect(weights).to.deep.equal(['400', '700']);
      });

      it('scales a local font to Adobe Clean metrics without downloading anything', () => {
        faces(family).forEach((rule) => {
          const { style } = rule;
          const sizeAdjust = parseFloat(style.getPropertyValue('size-adjust'));
          expect(sizeAdjust, 'size-adjust').to.be.within(80, 99);
          expect(style.getPropertyValue('ascent-override'), 'ascent-override').to.match(/%$/);
          expect(style.getPropertyValue('descent-override'), 'descent-override').to.match(/%$/);
          expect(style.getPropertyValue('line-gap-override'), 'line-gap-override').to.equal('0%');
          const src = style.getPropertyValue('src');
          expect(src).to.include('local(');
          expect(src).to.not.include('url(');
        });
      });
    });
  });

  it('keeps the font stack order: Adobe Clean, metric-matched fallbacks, Trebuchet MS, sans-serif', () => {
    const stack = rootRule.style.getPropertyValue('--body-font-family')
      .split(',')
      .map((font) => font.trim().replace(/['"]/g, ''));
    expect(stack.slice(0, 2)).to.deep.equal(['Adobe Clean', 'adobe-clean']);
    FALLBACK_FAMILIES.forEach((family) => {
      expect(stack.indexOf(family), family).to.be.greaterThan(1);
      expect(stack.indexOf(family), family).to.be.lessThan(stack.indexOf('Trebuchet MS'));
    });
    expect(stack[stack.length - 1]).to.equal('sans-serif');
  });
});
