import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/vimeo/vimeo.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('vimeo', () => {
  it('renders embed video for vimeo link', async () => {
    const vimeo = document.querySelector('a');

    init(vimeo);

    const iframe = await waitForElement('iframe');
    const wrapper = document.querySelector('.embed-vimeo');

    expect(wrapper).to.not.be.null;
    expect(iframe).to.be.exist;
  });
});
