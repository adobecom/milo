import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import runAccessibilityTest from '../../../../libs/blocks/preflight/accessibility/accessibility-runner.js';

describe('preflight accessibility runner', () => {
  let lanaBackup;

  beforeEach(() => {
    lanaBackup = window.lana;
    window.lana = { log: sinon.spy() };
    // Custom checks fire video-captions fetches against CUSTOM_CHECKS_CONFIG; keep them offline.
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ json: () => Promise.resolve({}) }));
    window.axe = window.axe || {};
    sinon.stub(window.axe, 'run').resolves({ violations: [{ id: 'axe-marker', impact: 'serious' }] });
  });

  afterEach(() => {
    sinon.restore();
    window.lana = lanaBackup;
  });

  it('merges axe violations with custom violations and reports pass=false', async () => {
    const res = await runAccessibilityTest(document);
    expect(res.violations.some((v) => v.id === 'axe-marker')).to.be.true;
    expect(res.pass).to.be.false;
  });

  it('runs axe against the passed area when it is not the document', async () => {
    window.axe.run.resolves({ violations: [] });
    const area = document.createElement('div');
    const res = await runAccessibilityTest(area);
    // area !== document, so axe is run against the passed area context directly.
    expect(window.axe.run.firstCall.args[0]).to.equal(area);
    expect(res.violations).to.be.an('array');
    expect(res.pass).to.equal(res.violations.length === 0);
  });

  it('passes include/exclude context when area is the document', async () => {
    window.axe.run.resolves({ violations: [] });
    await runAccessibilityTest(document);
    const ctx = window.axe.run.firstCall.args[0];
    expect(ctx).to.have.keys(['include', 'exclude']);
  });

  it('returns an error object when axe throws', async () => {
    window.axe.run.rejects(new Error('axe boom'));
    const res = await runAccessibilityTest(document);
    expect(res.error).to.contain('axe boom');
    expect(window.lana.log.called).to.be.true;
  });
});
