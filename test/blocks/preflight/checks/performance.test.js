import { expect } from '@esm-bundle/chai';
import preflightApi from '../../../../libs/blocks/preflight/checks/preflightApi.js';
import { setLikelyLcp } from '../../../../libs/blocks/preflight/checks/performance.js';

const {
  getLcpEntry,
  checkSingleBlock,
  checkForPersonalization,
  checkLcpEl,
  checkImageSize,
  checkVideoPoster,
  checkFragments,
  checkPlaceholders,
  checkIcons,
  runChecks,
} = preflightApi.performance;

describe('Sanity Checks', () => {
  it('preflightApi.performance.getLcpEntry exists', () => {
    expect(getLcpEntry).to.exist;
  });

  it('preflightApi.performance.checkSingleBlock exists', () => {
    expect(checkSingleBlock).to.exist;
  });

  it('preflightApi.performance.checkForPersonalization exists', () => {
    expect(checkForPersonalization).to.exist;
  });

  it('preflightApi.performance.checkLcpEl exists', () => {
    expect(checkLcpEl).to.exist;
  });

  it('preflightApi.performance.checkImageSize exists', () => {
    expect(checkImageSize).to.exist;
  });

  it('preflightApi.performance.checkVideoPoster exists', () => {
    expect(checkVideoPoster).to.exist;
  });

  it('preflightApi.performance.checkFragments exists', () => {
    expect(checkFragments).to.exist;
  });

  it('preflightApi.performance.checkPlaceholders exists', () => {
    expect(checkPlaceholders).to.exist;
  });

  it('preflightApi.performance.checkIcons exists', () => {
    expect(checkIcons).to.exist;
  });

  it('preflightApi.performance.runChecks exists', () => {
    expect(runChecks).to.exist;
  });

  it('fails the LCP-section checks when the page has no LCP element', async () => {
    const noLcp = () => Promise.resolve(null);
    const results = await Promise.all([checkFragments, checkPlaceholders, checkIcons]
      .map((check) => check('no-lcp-page', document, noLcp)));
    expect(results.map(({ status }) => status)).to.deep.equal(['fail', 'fail', 'fail']);
  });

  it('setLikelyLcp uses the largest loaded image in the first section', async () => {
    const main = document.createElement('main');
    main.innerHTML = '<div class="section"></div><div class="section"></div>';
    document.body.append(main);
    const addImg = (section, w, h) => new Promise((resolve) => {
      const img = document.createElement('img');
      img.width = w;
      img.height = h;
      img.onload = () => resolve(img);
      img.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"/>`)}`;
      section.append(img);
    });
    const [first, second] = main.querySelectorAll('.section');
    await addImg(first, 10, 10);
    const big = await addImg(first, 200, 100);
    await addImg(second, 900, 900);
    setLikelyLcp();
    const href = await getLcpEntry(window.location.href);
    const pathname = await getLcpEntry(window.location.pathname);
    main.remove();
    expect(href.element).to.equal(big);
    expect(pathname.element).to.equal(big);
  });

  it('setLikelyLcp follows the first-section image after a re-render', async () => {
    const main = document.createElement('main');
    const draft = `<div class="section"><img width="200" height="100" src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/>')}"></div>`;
    main.innerHTML = draft;
    document.body.append(main);
    await main.querySelector('img').decode();
    setLikelyLcp();
    main.innerHTML = draft;
    const rerendered = main.querySelector('img');
    await rerendered.decode();

    const lcp = await getLcpEntry(window.location.href);

    main.remove();
    expect(lcp?.element === rerendered).to.equal(true);
  });

  it('setLikelyLcp reports no LCP without media in the first section', async () => {
    setLikelyLcp(document.createElement('div'));
    const staleLcp = () => Promise.resolve({ url: 'previous-draft.jpg' });
    expect(await getLcpEntry('no-media-draft', document, staleLcp)).to.equal(null);
  });

  it('labels the LCP result as estimated in draft mode', async () => {
    const area = document.createElement('div');
    area.innerHTML = '<main><div class="section"><video src="hero.mp4"></video></div></main>';
    Object.defineProperty(area.querySelector('video'), 'currentSrc', { value: 'hero.mp4' });
    setLikelyLcp(area);
    const found = await checkLcpEl('draft', area);
    setLikelyLcp(document.createElement('div'));
    const missing = await checkLcpEl('draft', area);
    expect(found.description).to.equal('Valid LCP in the first section detected. (Estimated in draft mode.)');
    expect(missing.description).to.equal('No LCP element found. (Estimated in draft mode.)');
  });

  it('does not fail the LCP-section checks when the draft estimate finds nothing', async () => {
    setLikelyLcp(document.createElement('div'));
    const results = await Promise.all([checkFragments, checkPlaceholders, checkIcons]
      .map((check) => check('draft', document)));
    expect(results.map(({ status }) => status)).to.deep.equal(['empty', 'empty', 'empty']);
  });
});
