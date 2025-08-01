import { expect } from '@esm-bundle/chai';
import preflightApi from '../../../../libs/blocks/preflight/checks/preflightApi.js';

const {
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem,
  checkLinks,
  connectionError,
  runChecks,
} = preflightApi.seo;

describe('Sanity Checks', () => {
  it('preflightApi.seo.checkH1s exists', () => {
    expect(checkH1s).to.exist;
  });

  it('preflightApi.seo.checkTitle exists', () => {
    expect(checkTitle).to.exist;
  });

  it('preflightApi.seo.checkCanon exists', () => {
    expect(checkCanon).to.exist;
  });

  it('preflightApi.seo.checkDescription exists', () => {
    expect(checkDescription).to.exist;
  });

  it('preflightApi.seo.checkBody exists', () => {
    expect(checkBody).to.exist;
  });

  it('preflightApi.seo.checkLorem exists', () => {
    expect(checkLorem).to.exist;
  });

  it('preflightApi.seo.checkLinks exists', () => {
    expect(checkLinks).to.exist;
  });

  it('preflightApi.seo.connectionError exists', () => {
    expect(connectionError).to.exist;
  });

  it('preflightApi.seo.runChecks exists', () => {
    expect(runChecks).to.exist;
  });
});
