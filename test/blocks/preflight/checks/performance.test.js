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
    main.remove();
    expect((await getLcpEntry(window.location.href)).element === big).to.equal(true);
    expect((await getLcpEntry(window.location.pathname)).element === big).to.equal(true);
  });

  it('setLikelyLcp reports no LCP without media in the first section', async () => {
    setLikelyLcp(document.createElement('div'));
    expect(await getLcpEntry(window.location.href)).to.equal(undefined);
  });
});
