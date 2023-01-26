import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/instagram/instagram.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('instagram', () => {
  it('renders embed post for instagram link', async () => {
    const instagram = document.querySelector('a');

    init(instagram);

    const iframe = await waitForElement('iframe');
    const blockquote = document.querySelector('.instagram-media');
    const wrapper = document.querySelector('.embed-instagram');

    expect(blockquote).to.not.be.null;
    expect(wrapper).to.not.be.null;
    expect(iframe).to.be.exist;
  });
});
