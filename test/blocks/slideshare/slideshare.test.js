import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/slideshare/slideshare.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('slideshare', () => {
  it('renders embed for slideshare link', async () => {
    const slideshare = document.querySelector('a');

    init(slideshare);

    const iframe = await waitForElement('iframe');

    expect(iframe).to.be.exist;
  });
});
