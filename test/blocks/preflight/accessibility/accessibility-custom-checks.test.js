import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import customAccessibilityChecks from '../../../../libs/blocks/preflight/accessibility/accessibility-custom-checks.js';

describe('preflight accessibility custom checks orchestrator', () => {
  let lanaBackup;
  let container;

  beforeEach(() => {
    lanaBackup = window.lana;
    window.lana = { log: sinon.spy() };
    container = document.createElement('div');
    container.id = 'cc-fixture';
    document.body.append(container);
  });

  afterEach(() => {
    window.lana = lanaBackup;
    container.remove();
  });

  it('aggregates violations from the enabled checks', async () => {
    container.innerHTML = '<img>'; // missing alt
    const res = await customAccessibilityChecks({
      checks: ['altText'],
      include: ['#cc-fixture'],
      exclude: [],
    });
    expect(res.some((v) => v.id === 'image-alt')).to.be.true;
  });

  it('returns [] when no elements match the include selectors', async () => {
    const res = await customAccessibilityChecks({
      checks: ['altText'],
      include: ['#no-such-node'],
      exclude: [],
    });
    expect(res).to.deep.equal([]);
  });

  it('logs and returns [] when the config is malformed', async () => {
    const res = await customAccessibilityChecks({ include: 'body' }); // string, not array
    expect(res).to.deep.equal([]);
    expect(window.lana.log.calledOnce).to.be.true;
    expect(window.lana.log.firstCall.args[1]).to.include({ tags: 'preflight', severity: 'error' });
  });
});
