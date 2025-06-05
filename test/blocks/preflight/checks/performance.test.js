import { expect } from '@esm-bundle/chai';
import preflightApi from '../../../../libs/blocks/preflight/checks/preflightApi.js';

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
});
