import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/tiktok/tiktok.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('tiktok', () => {
  it('renders embed video for tiktok link', async () => {
    const tiktok = document.querySelector('a');

    init(tiktok);

    const iframe = await waitForElement('iframe');
    const blockquote = document.querySelector('.tiktok-embed');
    const script = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');

    expect(blockquote).to.not.be.null;
    expect(script).to.not.be.null;
    expect(iframe).to.be.exist;
  });
});
