import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/blocks/merch-twp/merch-twp.js');

describe('Merch TWP', () => {
  before(() => {
    setConfig({ base: window.location.origin, codeRoot: '/libs' });
  });

  it('should initialize merch-twp', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/twp.html' });

    const twp = await init(document.querySelector('.merch-twp'));
    const layout = twp?.querySelector('merch-subscription-layout');
    const cards = layout.querySelectorAll('merch-card');
    expect(layout).to.exist;
    expect(layout.querySelector('merch-subscription-panel')).to.exist;
    expect(cards.length).to.be.equal(4);
  });
});
