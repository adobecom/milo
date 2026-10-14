import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig } from '../../../../libs/utils/utils.js';

const {
  default: init,
  NEAR_DUP_MAX_DISTANCE,
  computeDHash,
  getHammingDistance,
  getMediaName,
  getHashUrl,
  getImageHash,
  isHeroSelector,
  getHeroCandidates,
  findHiddenHeroImages,
  whenLcpAreaSettled,
  compareImages,
  findNearDuplicates,
  createLimiter,
} = await import('../../../../libs/features/mep/mep-next/mep-lcp-check.js');

const MOCKS = '/test/features/mep/mep-next/mocks/lcp';
const abs = (path) => `${window.location.origin}${path}`;
const IMG_A = abs(`${MOCKS}/media_aaa111.png`);
const IMG_A_NEAR = abs(`${MOCKS}/media_aaa222.png`);
const IMG_B = abs(`${MOCKS}/media_bbb333.png`);

const loadImg = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const makeExperiment = (rows, manifestPath = '/test/manifest.json') => ({
  manifestPath,
  variants: rows,
});

describe('mep-lcp-check', () => {
  before(() => {
    setConfig({
      locale: { ietf: 'en-US', prefix: '' },
      locales: { '': { ietf: 'en-US' } },
      mep: { preview: true },
    });
  });

  describe('dHash', () => {
    let hashA;
    let hashNear;
    let hashB;

    before(async () => {
      [hashA, hashNear, hashB] = (await Promise.all([IMG_A, IMG_A_NEAR, IMG_B].map(loadImg)))
        .map(computeDHash);
    });

    it('produces a 64-bit hash', () => {
      expect(hashA).to.have.length(64);
      expect(hashA.every((bit) => bit === 0 || bit === 1)).to.be.true;
    });

    it('scores identical images as distance 0', () => {
      expect(getHammingDistance(hashA, [...hashA])).to.equal(0);
    });

    it('scores near-duplicate images within the threshold', () => {
      expect(getHammingDistance(hashA, hashNear)).to.be.at.most(NEAR_DUP_MAX_DISTANCE);
    });

    it('scores different images above the threshold', () => {
      expect(getHammingDistance(hashA, hashB)).to.be.above(NEAR_DUP_MAX_DISTANCE);
    });
  });

  describe('helpers', () => {
    it('extracts media file names', () => {
      expect(getMediaName('/a/media_1AbC.png?width=750')).to.equal('media_1abc.png');
      expect(getMediaName('/a/photo.png')).to.be.null;
    });

    it('rewrites AEM image hosts to the page origin and sets small hash params', () => {
      const url = new URL(getHashUrl('https://main--cc--adobecom.aem.live/products/media_1.png?width=2000#x'));
      expect(url.origin).to.equal(window.location.origin);
      expect(url.pathname).to.equal('/products/media_1.png');
      expect(url.searchParams.get('width')).to.equal('64');
      expect(url.hash).to.equal('');
    });

    it('caps concurrency', async () => {
      const run = createLimiter(2);
      let active = 0;
      let peak = 0;
      const task = () => run(async () => {
        active += 1;
        peak = Math.max(peak, active);
        await new Promise((r) => { setTimeout(r, 5); });
        active -= 1;
      });
      await Promise.all([task(), task(), task(), task(), task()]);
      expect(peak).to.equal(2);
    });
  });

  describe('isHeroSelector', () => {
    it('accepts hero selectors', () => {
      ['section1', 'main > section1', 'section1 marquee', 'any-marquee', 'any-marquee action-area',
        'any-marquee-section', 'marquee', 'marquee1 h1', '.marquee', 'main > div:first-child',
        'any-marquee #_include-fragments', 'body > main > div:nth-child(1)', 'main > div',
        'main>div:first-of-type .marquee', 'cco-marquee']
        .forEach((sel) => expect(isHeroSelector(sel), sel).to.be.true);
    });

    it('rejects non-hero selectors', () => {
      ['section2', 'section3 marquee', 'marquee2', 'any-marquee2', 'aside', 'text', '', undefined,
        'body > main > div:nth-child(2)', 'main > div:nth-child(3) .marquee', 'div']
        .forEach((sel) => expect(isHeroSelector(sel), sel).to.be.false);
    });

    it('accepts fragment selectors only when the fragment is in the LCP section', () => {
      const pageFragments = [abs('/fragments/hero#_dnt')];
      expect(isHeroSelector('/fragments/hero', pageFragments)).to.be.true;
      expect(isHeroSelector('https://main--cc--adobecom.aem.page/fragments/hero', pageFragments)).to.be.true;
      expect(isHeroSelector('/fragments/other', pageFragments)).to.be.false;
    });
  });

  describe('getHeroCandidates', () => {
    it('collects hero fragment rows from every variant', () => {
      const exp = makeExperiment({
        phone: {
          commands: [
            { action: 'replace', selector: 'any-marquee', content: `${MOCKS}/hero-near` },
            { action: 'replace', selector: 'section3', content: `${MOCKS}/hero-diff` },
            { action: 'remove', selector: 'marquee', content: 'true' },
            { action: 'replace', selector: 'marquee h1', content: '<h1>Hello</h1>' },
          ],
          fragments: [{ action: 'replace', selector: '/fragments/hero', val: `${MOCKS}/hero-same#_dnt` }],
        },
        desktop: {
          commands: [{ action: 'insertafter', selector: 'section1', content: `${MOCKS}/hero-diff` }],
          fragments: [],
          replacepage: [{ val: `${MOCKS}/replace-page` }],
        },
      });
      const candidates = getHeroCandidates(exp, [abs('/fragments/hero')]);
      expect(candidates.map((c) => [c.variant, c.action, c.fragmentUrl])).to.deep.equal([
        ['phone', 'replace', abs(`${MOCKS}/hero-near`)],
        ['phone', 'replace', abs(`${MOCKS}/hero-same`)],
        ['desktop', 'insertafter', abs(`${MOCKS}/hero-diff`)],
        ['desktop', 'replacepage', abs(`${MOCKS}/replace-page`)],
      ]);
      expect(candidates.every((c) => c.manifestPath === '/test/manifest.json')).to.be.true;
    });

    it('returns nothing for default experiments', () => {
      expect(getHeroCandidates({ manifestPath: '/x.json' })).to.deep.equal([]);
    });
  });

  describe('compareImages', () => {
    it('skips images that share a media file name with the page', async () => {
      expect(await compareImages(`${IMG_A}?width=2000`, [IMG_A])).to.be.null;
    });

    it('returns the closest page image when within the threshold', async () => {
      const result = await compareImages(IMG_A_NEAR, [IMG_B, IMG_A]);
      expect(result.pageImage).to.equal(IMG_A);
      expect(result.distance).to.be.at.most(NEAR_DUP_MAX_DISTANCE);
    });

    it('returns no match for different images', async () => {
      const result = await compareImages(IMG_B, [IMG_A]);
      expect(result.distance).to.be.undefined;
      expect(result.unable).to.deep.equal([]);
    });

    it('reports images that cannot be loaded or read', async () => {
      const missing = abs(`${MOCKS}/media_dead00.png`);
      expect((await getImageHash(missing)).error).to.include('media_dead00.png');
      const result = await compareImages(missing, [IMG_A]);
      expect(result.unable[0]).to.include('media_dead00.png');
      const pageMissing = await compareImages(IMG_B, [abs(`${MOCKS}/media_dead11.png`)]);
      expect(pageMissing.unable[0]).to.include('media_dead11.png');
    });
  });

  describe('findNearDuplicates', () => {
    const experiments = [makeExperiment({
      phone: {
        commands: [{ action: 'replace', selector: 'any-marquee', content: `${MOCKS}/hero-near` }],
        fragments: [],
      },
      tablet: {
        commands: [{ action: 'replace', selector: 'marquee', content: `${MOCKS}/hero-same` }],
        fragments: [],
      },
      desktop: {
        commands: [{ action: 'replace', selector: 'section1', content: `${MOCKS}/hero-diff` }],
        fragments: [],
      },
      'replace-page': { commands: [], fragments: [], replacepage: [{ val: `${MOCKS}/replace-page` }] },
    })];

    it('flags near-duplicates from page images and nested page fragments', async () => {
      const snapshot = { images: [], fragments: [abs(`${MOCKS}/fragments/page-hero`)] };
      const { findings, unable } = await findNearDuplicates(experiments, snapshot);
      expect(unable).to.deep.equal([]);
      expect(findings.map((f) => f.variant).sort()).to.deep.equal(['phone', 'replace-page']);
      const phone = findings.find((f) => f.variant === 'phone');
      expect(phone).to.include({
        manifestPath: '/test/manifest.json',
        action: 'replace',
        selector: 'any-marquee',
        fragmentUrl: abs(`${MOCKS}/hero-near`),
        pageImage: IMG_A,
      });
      expect(getMediaName(phone.fragmentImage)).to.equal('media_aaa222.png');
    });

    it('returns nothing when the page has no LCP images', async () => {
      const result = await findNearDuplicates(experiments, { images: [], fragments: [] });
      expect(result.findings).to.deep.equal([]);
    });
  });

  describe('findHiddenHeroImages', () => {
    let main;
    let original;

    before(async () => {
      await loadImg(IMG_A);
      main = document.createElement('main');
      const inserted = document.createElement('div');
      inserted.innerHTML = `<div class="marquee" data-manifest-id="intl1207.json"><img alt="" src="${IMG_B}"></div>`;
      original = document.createElement('div');
      original.innerHTML = `<div class="fragment" data-path="/fragments/marquee" style="display:none"><img alt="" src="${IMG_A}"></div>
        <div class="marquee"><div style="display:none"><img alt="" src="${IMG_A_NEAR}"></div></div>
        <div class="hidden-lazy" style="display:none"><img alt="" loading="lazy" src="${MOCKS}/media_ccc444.png"></div>`;
      const below = document.createElement('div');
      below.innerHTML = `<div style="display:none"><img alt="" src="${IMG_A}?below"></div>`;
      main.append(inserted, original, below);
      document.body.append(main);
    });

    after(() => main.remove());

    it('flags requested images in hidden hero blocks', () => {
      const findings = findHiddenHeroImages(['media_aaa111.png'], original);
      expect(findings).to.have.length(1);
      expect(findings[0]).to.include({ type: 'hidden-image', source: 'page', block: '/fragments/marquee' });
      expect(getMediaName(findings[0].image)).to.equal('media_aaa111.png');
      expect(findings[0].manifests).to.deep.equal(['intl1207.json']);
    });

    it('reports each image once', () => {
      expect(findHiddenHeroImages(['media_aaa111.png'], original)).to.deep.equal([]);
    });

    it('only scans the first section when the original section is gone', () => {
      expect(findHiddenHeroImages([], document.createElement('div'))).to.deep.equal([]);
    });
  });

  describe('whenLcpAreaSettled', () => {
    let main;

    afterEach(() => main.remove());

    it('waits for pending sections and gives up after the timeout', async () => {
      main = document.createElement('main');
      main.innerHTML = '<div class="section"><div class="fragment"><div class="section" data-status="decorated"></div></div></div>';
      document.body.append(main);
      const [section] = main.children;
      expect(await whenLcpAreaSettled(section, 30, 10)).to.be.false;
      const settled = whenLcpAreaSettled(section, 1000, 10);
      delete main.querySelector('[data-status]').dataset.status;
      expect(await settled).to.be.true;
    });
  });

  describe('findHiddenHeroImages without MEP changes', () => {
    let main;

    afterEach(() => main.remove());

    const render = (html) => {
      main = document.createElement('main');
      const section = document.createElement('div');
      section.innerHTML = html;
      main.append(section);
      document.body.append(main);
      return section;
    };

    it('ignores hidden images when no manifest touched the LCP area', async () => {
      await loadImg(IMG_A);
      const section = render(`<div class="marquee" style="display:none"><img alt="" src="${IMG_A}#nomanifest"></div>`);
      expect(findHiddenHeroImages(['media_aaa111.png'], section)).to.deep.equal([]);
    });

    it('ignores hidden copies of media that is also visible', async () => {
      await loadImg(IMG_A);
      const section = render(`<div class="marquee" data-manifest-id="a.json">
        <div style="display:none"><img alt="" src="${IMG_A}#mobile"></div>
        <div><img alt="" src="${IMG_A}#desktop"></div></div>
        <div class="other" style="display:none"><img alt="" src="${IMG_A}#copy"></div>`);
      expect(findHiddenHeroImages(['media_aaa111.png'], section)).to.deep.equal([]);
    });
  });

  describe('init', () => {
    afterEach(() => sinon.restore());

    it('does nothing without preview or a snapshot', async () => {
      getConfig().mep = { preview: false };
      expect(await init()).to.deep.equal([]);
      getConfig().mep = { preview: true };
      expect(await init()).to.deep.equal([]);
    });

    it('logs findings once per manifest', async () => {
      const section = document.createElement('div');
      section.innerHTML = `<picture><source srcset="${MOCKS}/media_aaa111.png?width=750 750w"><img alt="" src="${IMG_A}"></picture>`;
      const warn = sinon.stub(console, 'warn');
      sinon.stub(console, 'groupCollapsed');
      sinon.stub(console, 'groupEnd');
      getConfig().mep = {
        preview: true,
        lcpSection: { original: section, clone: section.cloneNode(true) },
        lcpExperiments: [null, { manifestPath: '/test/default.json' }, {
          manifestPath: '/test/init-manifest.json',
          variants: {
            phone: {
              commands: [{ action: 'replace', selector: 'any-marquee', content: `${MOCKS}/hero-near` }],
              fragments: [],
            },
          },
        }],
      };
      const findings = await init();
      expect(findings).to.have.length(1);
      expect(warn.calledOnce).to.be.true;
      expect(warn.firstCall.args[0]).to.include('/test/init-manifest.json');
      expect(warn.firstCall.args[0]).to.include('media_aaa111.png');
      expect(getConfig().mep.lcpSnapshot.images.map(getMediaName))
        .to.deep.equal(['media_aaa111.png', 'media_aaa111.png']);
      expect(await init()).to.equal(getConfig().mep.lcpFindings);
      expect(warn.calledOnce).to.be.true;
    });
  });
});
