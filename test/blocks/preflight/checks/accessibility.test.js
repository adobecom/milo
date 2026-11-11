import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import runChecks from '../../../../libs/blocks/preflight/checks/accessibility.js';

describe('preflight checks accessibility', () => {
  let lanaBackup;
  let container;

  beforeEach(() => {
    lanaBackup = window.lana;
    window.lana = { log: sinon.spy() };
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ json: () => Promise.resolve({}) }));
    window.axe = window.axe || {};
    sinon.stub(window.axe, 'run').resolves({ violations: [{ id: 'axe-marker', impact: 'serious' }] });
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    sinon.restore();
    window.lana = lanaBackup;
    container.remove();
  });

  it('returns a single check via the default runChecks export', () => {
    const checks = runChecks({ area: container });
    expect(checks).to.have.lengthOf(1);
    expect(checks[0]).to.be.a('promise');
  });

  it('summarizes image alt text and reports FAIL when violations exist', async () => {
    container.innerHTML = '<img alt="A described image"><img alt=""><img>';
    const [check] = runChecks({ area: container });
    const res = await check;
    expect(res.checkId).to.equal('accessibility');
    expect(res.severity).to.equal('critical');
    expect(res.status).to.equal('fail');
    expect(res.description).to.contain('accessibility violations detected');
    expect(res.details.panelAltSummary).to.deep.equal({
      totalImages: 3,
      withAltText: 1,
      decorativeImages: 1,
      missingAlt: 1,
    });
    expect(res.details.issuesCount).to.be.greaterThan(0);
  });

  it('reports a zeroed alt summary when the area has no images', async () => {
    const [check] = runChecks({ area: container });
    const res = await check;
    expect(res.details.panelAltSummary).to.deep.equal({
      totalImages: 0,
      withAltText: 0,
      decorativeImages: 0,
      missingAlt: 0,
    });
  });

  it('returns LIMBO with the error message when the test run errors', async () => {
    window.axe.run.rejects(new Error('axe exploded'));
    const [check] = runChecks({ area: container });
    const res = await check;
    expect(res.status).to.equal('limbo');
    expect(res.description).to.contain('axe exploded');
    expect(res.details.issuesCount).to.be.null;
  });

  it('scopes to header/main/footer images when run against the document', async () => {
    const [check] = runChecks({ area: document });
    const res = await check;
    expect(res.details.panelAltSummary).to.have.all.keys('totalImages', 'withAltText', 'decorativeImages', 'missingAlt');
  });
});
