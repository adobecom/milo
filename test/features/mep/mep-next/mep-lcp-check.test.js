import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig } from '../../../../libs/utils/utils.js';

const {
  default: init,
  NEAR_DUP_MAX_DISTANCE,
  NEAR_DUP_REVIEW_DISTANCE,
  computeDHash,
  getHammingDistance,
  getMediaName,
  getHashUrl,
  getHashUrls,
  getImageHash,
  isHeroSelector,
  getHeroCandidates,
  getViewportImages,
  getHeroLayout,
  getPageHero,
  getVariantViewports,
  getVariantsToCheck,
  logFindings,
  compareImages,
  findNearDuplicates,
  createLimiter,
  getFragmentUrl,
  getFragmentImages,
  getLcpSnapshot,
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
      expect(getHammingDistance(hashA, hashB)).to.be.above(NEAR_DUP_REVIEW_DISTANCE);
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

    it('falls back to the original host for images from another repo', () => {
      const src = 'https://main--federal--adobecom.aem.page/federal/media_1.png';
      const [rehosted, original] = getHashUrls(src);
      expect(new URL(rehosted).origin).to.equal(window.location.origin);
      expect(new URL(original).origin).to.equal('https://main--federal--adobecom.aem.page');
      expect(getHashUrls(`${window.location.origin}/media_1.png`)).to.have.length(1);
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

    it('skips page fetches when no variant touches the hero', async () => {
      const fetchSpy = sinon.spy(window, 'fetch');
      const offHero = [makeExperiment({ phone: { commands: [{ action: 'replace', selector: 'section3', content: `${MOCKS}/hero-near` }], fragments: [] } })];
      const result = await findNearDuplicates(offHero, { images: [], fragments: [abs(`${MOCKS}/fragments/page-hero`)] });
      sinon.restore();
      expect(result.findings).to.deep.equal([]);
      expect(fetchSpy.called).to.be.false;
    });
  });

  describe('getViewportImages', () => {
    const parse = (html) => new DOMParser().parseFromString(html, 'text/html').body.firstElementChild;
    const names = (byViewport) => Object.fromEntries(Object.entries(byViewport)
      .map(([vp, imgs]) => [vp, imgs.map(({ name, role }) => `${name} ${role}`)]));

    it('maps three background cells to one viewport each and posters to visible viewports', () => {
      const block = parse(`<div class="marquee media-hidden-mobile">
        <div><div><img alt="" src="./media_a1.png"></div><div><img alt="" src="./media_b2.png"></div><div>#000</div></div>
        <div><div><h1>Hi</h1></div><div><img alt="" src="./media_c3.png"><a href="/v.mp4">v</a></div></div>
      </div>`);
      expect(names(getViewportImages(block, window.location.href))).to.deep.equal({
        phone: ['media_a1.png background cell 1 of 3'],
        tablet: ['media_b2.png background cell 2 of 3', 'media_c3.png foreground video poster'],
        desktop: ['media_c3.png foreground video poster'],
      });
    });

    it('maps two cells to phone and tablet+desktop, and one cell to all viewports', () => {
      const two = parse(`<div class="marquee"><div><div><img alt="" src="./media_a1.png"></div>
        <div><img alt="" src="./media_b2.png"></div></div><div><div>text</div></div></div>`);
      expect(getHeroLayout(two)).to.equal('phone: background cell 1 of 2; tablet: background cell 2 of 2; desktop: background cell 2 of 2');
      const one = parse(`<div class="marquee"><div><div><img alt="" src="./media_a1.png"></div></div>
        <div><div><img alt="" src="./media_b2.png"></div></div></div>`);
      expect(getHeroLayout(one)).to.equal('phone: background cell 1 of 1, foreground image; tablet: background cell 1 of 1, foreground image; desktop: background cell 1 of 1, foreground image');
    });
  });

  describe('getVariantsToCheck', () => {
    const variants = (...names) => Object.fromEntries(names.map((n) => [n, { commands: [n] }]));
    const summarize = (list) => list.map((exp) => [exp.manifestPath, Object.keys(exp.variants)]);

    it('skips target- variants on page copies and keeps them on Target/AJO copies', () => {
      const result = getVariantsToCheck([
        null,
        { manifestPath: '/v/default.json' },
        { manifestPath: '/v/a.json', source: ['pzn'], variants: variants('phone', 'target-x', 'Target-Y') },
        { manifestPath: '/v/a.json', source: ['target'], variants: variants('phone', 'target-x') },
        { manifestPath: '/v/b.json', source: ['ajo'], variants: variants('target-z') },
      ]);
      expect(summarize(result)).to.deep.equal([
        ['/v/a.json', ['phone', 'target-x']],
        ['/v/b.json', ['target-z']],
      ]);
      expect(result[0].source).to.deep.equal(['pzn']);
    });

    it('keeps a target- variant forced by a ?mep= override', () => {
      const result = getVariantsToCheck(
        [{ manifestPath: '/v/c.json', source: ['mep param'], variants: variants('target-x', 'target-y') }],
        { '/v/c.json': 'target-y' },
      );
      expect(summarize(result)).to.deep.equal([['/v/c.json', ['target-y']]]);
    });

    it('checks Target variants that arrive in a later pass', () => {
      const page = { manifestPath: '/v/d.json', source: ['pzn'], variants: variants('phone', 'target-x') };
      expect(summarize(getVariantsToCheck([page]))).to.deep.equal([['/v/d.json', ['phone']]]);
      const target = { ...page, source: ['target'] };
      expect(summarize(getVariantsToCheck([target]))).to.deep.equal([['/v/d.json', ['target-x']]]);
      expect(getVariantsToCheck([target])).to.deep.equal([]);
    });
  });

  describe('getVariantViewports', () => {
    it('maps MEP device audiences to viewports', () => {
      expect(getVariantViewports('phone')).to.deep.equal(['phone']);
      expect(getVariantViewports('mobile-device')).to.deep.equal(['phone', 'tablet']);
      expect(getVariantViewports('phone, desktop')).to.deep.equal(['phone', 'desktop']);
      expect(getVariantViewports('not desktop & loggedin')).to.deep.equal(['phone', 'tablet']);
      expect(getVariantViewports('mobile-device & not phone')).to.deep.equal(['tablet']);
      expect(getVariantViewports('phone, cc-photo')).to.deep.equal(['phone', 'tablet', 'desktop']);
      expect(getVariantViewports('target-phone')).to.deep.equal(['phone', 'tablet', 'desktop']);
      expect(getVariantViewports('Target-phone')).to.deep.equal(['phone', 'tablet', 'desktop']);
      expect(getVariantViewports()).to.deep.equal(['phone', 'tablet', 'desktop']);
    });
  });

  describe('findNearDuplicates by viewport', () => {
    const pageSnapshot = { images: [], fragments: [abs(`${MOCKS}/hero-cells-page`)] };
    const run = (fragment, variant = 'phone', snapshot = pageSnapshot) => findNearDuplicates([makeExperiment({
      [variant]: {
        commands: [{ action: 'replace', selector: 'marquee', content: `${MOCKS}/${fragment}` }],
        fragments: [],
      },
    })], snapshot);

    it('finds the page hero in a page fragment', async () => {
      const hero = await getPageHero(pageSnapshot);
      expect(hero.block.classList.contains('marquee')).to.be.true;
      expect(hero.baseUrl).to.equal(abs(`${MOCKS}/hero-cells-page.plain.html`));
      expect(await getPageHero({ images: [], fragments: [] })).to.be.null;
    });

    it('reports the viewport and the matching cells', async () => {
      const { findings } = await run('hero-cells-near');
      expect(findings).to.have.length(1);
      expect(findings[0]).to.include({
        match: 'near-duplicate',
        fragmentRole: 'background cell 1 of 2',
        layout: null,
      });
      expect(findings[0].pageRoles).to.deep.equal(['background cell 1 of 2']);
      expect(findings[0].viewports).to.deep.equal(['phone']);
      expect(getMediaName(findings[0].pageImage)).to.equal('media_aaa111.png');
    });

    it('only checks viewports the variant can run on', async () => {
      expect((await run('hero-cells-near', 'desktop')).findings).to.deep.equal([]);
      expect((await run('hero-cells-near', 'not desktop & loggedin')).findings).to.have.length(1);
    });

    it('merges one page file reused in several cells into one finding', async () => {
      const snapshot = { images: [], fragments: [abs(`${MOCKS}/hero-cells-page-reuse`)] };
      const { findings } = await run('hero-cells-swapped', 'all', snapshot);
      expect(findings).to.have.length(1);
      expect(findings[0].viewports).to.deep.equal(['tablet', 'desktop']);
      expect(findings[0].pageRoles).to.deep.equal(['background cell 2 of 3', 'foreground image']);
      expect(findings[0].fragmentRole).to.equal('background cell 2 of 2');
    });

    it('ignores look-alikes that never show at the same viewport', async () => {
      expect((await run('hero-cells-swapped')).findings).to.deep.equal([]);
    });

    it('flags hero layouts that differ from the page', async () => {
      const { findings } = await run('hero-cells-single');
      expect(findings).to.have.length(1);
      expect(findings[0].viewports).to.deep.equal(['phone']);
      expect(findings[0].fragmentRole).to.equal('background cell 1 of 1');
      expect(findings[0].layout.fragment).to.include('phone: background cell 1 of 1');
    });

    it('logs the viewport, cells and fix', async () => {
      const log = sinon.stub(console, 'log');
      sinon.stub(console, 'groupCollapsed');
      sinon.stub(console, 'groupEnd');
      logFindings(await run('hero-cells-single'));
      logFindings({ findings: [{ ...(await run('hero-cells-near')).findings[0], match: 'possible', distance: 10 }], unable: [] });
      sinon.restore();
      const [layoutMsg] = log.firstCall.args;
      expect(layoutMsg).to.include('1. phone: fragment background cell 1 of 1 media_aaa222.png is a near-duplicate');
      expect(layoutMsg).to.include('fix: copy the image from the page hero background cell 1 of 2 into the fragment hero background cell 1 of 1 so both use media_aaa111.png');
      expect(layoutMsg).to.include('note: hero layouts differ');
      expect(layoutMsg).to.match(/near-duplicate \(distance \d+, <= 8\)\*/);
      expect(log.secondCall.args[0]).to.include('* distance: how many of the 64 bits differ');
      expect(log.thirdCall.args[0]).to.include('possible near-duplicate (distance 10, 9-12: check visually)*');
      expect(log.lastCall.args[0]).to.include('* distance:');
    });

    it('logs one entry per fragment with a numbered fix per image', () => {
      const log = sinon.stub(console, 'log');
      sinon.stub(console, 'groupCollapsed');
      sinon.stub(console, 'groupEnd');
      const base = {
        type: 'near-duplicate',
        manifestPath: '/m.json',
        variant: 'v',
        action: 'replace',
        selector: 'any-marquee',
        fragmentUrl: 'https://x/frag',
        match: 'near-duplicate',
        distance: 1,
        layout: { page: 'page layout', fragment: 'fragment layout' },
      };
      logFindings({
        findings: [
          {
            ...base, viewports: ['phone'], fragmentRole: 'background cell 1 of 3', pageRoles: ['background cell 1 of 3'], fragmentImage: '/media_f1.png', pageImage: '/media_p1.jpg',
          },
          {
            ...base, viewports: ['tablet', 'desktop'], fragmentRole: 'foreground image', pageRoles: ['background cell 2 of 3', 'foreground image'], fragmentImage: '/media_f2.png', pageImage: '/media_p2.jpg',
          },
          {
            ...base, fragmentUrl: 'https://x/other', viewports: ['phone'], fragmentRole: 'background cell 1 of 3', pageRoles: ['background cell 1 of 3'], fragmentImage: '/media_f1.png', pageImage: '/media_p1.jpg',
          },
        ],
        unable: [],
      });
      sinon.restore();
      expect(log.callCount).to.equal(3);
      const [msg] = log.firstCall.args;
      expect(msg.match(/\n {2}fragment: /g)).to.have.length(1);
      expect(msg).to.include('1. phone: fragment background cell 1 of 3 media_f1.png');
      expect(msg).to.include('2. tablet, desktop: fragment foreground image media_f2.png');
      expect(msg.match(/note: hero layouts differ/g)).to.have.length(1);
      expect(log.secondCall.args[0]).to.not.include('note: hero layouts differ');
      expect(log.lastCall.args[0]).to.include('* distance:');
    });

    it('merges one fragment used by several commands in a variant', () => {
      const log = sinon.stub(console, 'log');
      const title = sinon.stub(console, 'groupCollapsed');
      sinon.stub(console, 'groupEnd');
      const finding = {
        type: 'near-duplicate',
        manifestPath: '/m.json',
        variant: 'v',
        action: 'replace',
        selector: 'any-marquee action-area',
        fragmentUrl: 'https://x/frag',
        match: 'near-duplicate',
        distance: 1,
        viewports: ['tablet'],
        fragmentRole: 'background cell 2 of 3',
        pageRoles: ['background cell 2 of 3'],
        fragmentImage: '/media_f1.png',
        pageImage: '/media_p1.jpg',
      };
      logFindings({
        findings: [finding, { ...finding, selector: 'any-marquee-section' }],
        unable: [],
      });
      sinon.restore();
      expect(title.firstCall.args[0]).to.include('(1)');
      expect(log.callCount).to.equal(2);
      const [msg] = log.firstCall.args;
      expect(msg).to.include('variant "v" | replace "any-marquee action-area", replace "any-marquee-section"');
      expect(msg.match(/tablet: fragment background cell 2 of 3/g)).to.have.length(1);
    });
  });

  describe('fragment safety', () => {
    afterEach(() => sinon.restore());

    const html = (body) => new Response(body, { headers: { 'content-type': 'text/html' } });

    it('rejects fragment URLs from untrusted hosts', () => {
      expect(getFragmentUrl('https://evil.example.com/fragments/hero')).to.be.null;
      expect(getFragmentUrl('https://adobe.com.evil.example/fragments/hero')).to.be.null;
      expect(getFragmentUrl(`${MOCKS}/hero-near.plain.html?x=1#y`)).to.equal(abs(`${MOCKS}/hero-near`));
    });

    it('ignores fragment responses that are not HTML', async () => {
      sinon.stub(window, 'fetch').resolves(new Response('<img src="./media_ccc111.png">', { headers: { 'content-type': 'application/json' } }));
      expect(await getFragmentImages(abs('/test/lcp-safety/not-html'))).to.deep.equal([]);
    });

    it('stops following nested fragments at MAX_FRAGMENT_DEPTH', async () => {
      const level = (n) => abs(`/test/lcp-safety/fragments/level${n}`);
      const fetchStub = sinon.stub(window, 'fetch').callsFake(async (url) => {
        const n = Number(url.match(/level(\d)/)[1]);
        return html(`<div><img src="./media_dd${n}.png"><a href="${level(n + 1)}">next</a></div>`);
      });
      const images = await getFragmentImages(level(0));
      expect(images.map(getMediaName)).to.deep.equal(['media_dd0.png', 'media_dd1.png']);
      expect(fetchStub.callCount).to.equal(2);
    });

    it('skips unparseable URLs in the LCP snapshot instead of throwing', () => {
      const clone = document.createElement('div');
      clone.innerHTML = `
        <img src="https://[::1/media_bad111.png">
        <img src="${MOCKS}/media_aaa111.png">
        <a href="https://[::1/fragments/bad">bad</a>
        <a href="${MOCKS}/fragments/page-hero">ok</a>`;
      const snapshot = getLcpSnapshot({ clone });
      expect(snapshot.images).to.deep.equal([IMG_A]);
      expect(snapshot.fragments).to.deep.equal([abs(`${MOCKS}/fragments/page-hero`)]);
    });
  });

  describe('init', () => {
    afterEach(() => sinon.restore());

    it('does nothing without ?meplcp or a snapshot', async () => {
      getConfig().mep = { preview: true, lcpCheck: false };
      expect(await init()).to.deep.equal([]);
      getConfig().mep = { preview: true, lcpCheck: true };
      expect(await init()).to.deep.equal([]);
    });

    it('logs findings once per manifest', async () => {
      const section = document.createElement('div');
      section.innerHTML = `<picture><source srcset="${MOCKS}/media_aaa111.png?width=750 750w"><img alt="" src="${IMG_A}"></picture>`;
      const log = sinon.stub(console, 'log');
      sinon.stub(console, 'groupCollapsed');
      sinon.stub(console, 'groupEnd');
      getConfig().mep = {
        preview: true,
        lcpCheck: true,
        lcpSection: { clone: section.cloneNode(true) },
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
      expect(log.calledTwice).to.be.true;
      expect(log.firstCall.args[0]).to.include('/test/init-manifest.json');
      expect(log.firstCall.args[0]).to.include('media_aaa111.png');
      expect(getConfig().mep.lcpSnapshot.images.map(getMediaName))
        .to.deep.equal(['media_aaa111.png', 'media_aaa111.png']);
      expect(await init()).to.equal(getConfig().mep.lcpFindings);
      expect(log.calledTwice).to.be.true;
    });

    it('says when there is nothing to report', async () => {
      const log = sinon.stub(console, 'log');
      logFindings({ findings: [], unable: [] }, 3);
      logFindings({ findings: [], unable: [] }, 1);
      getConfig().mep = { preview: true, lcpCheck: true, lcpSection: { clone: document.createElement('div') }, lcpExperiments: [] };
      expect(await init()).to.deep.equal([]);
      expect(await init()).to.deep.equal([]);
      sinon.restore();
      expect(log.args.map(([msg]) => msg)).to.deep.equal([
        '✅MEP LCP near-dupe image checks: no issues found (3 variants checked)',
        '✅MEP LCP near-dupe image checks: no issues found (1 variant checked)',
        '✅MEP LCP near-dupe image checks: no personalization variants to check',
      ]);
    });
  });
});
