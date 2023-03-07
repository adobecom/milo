import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/adobetv/adobetv.js');

describe('adobetv autoblock', () => {
  it('creates iframe video block', () => {
    const wrapper = document.body.querySelector('.adobe-tv');
    const a = wrapper.querySelector(':scope > a');

    init(a);

    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(wrapper.querySelector('iframe')).to.be.exist;
  });
});
