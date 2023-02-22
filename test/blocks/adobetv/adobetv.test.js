import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/adobetv/adobetv.js');

describe('adobetv autoblock', () => {
  it('creates video block', () => {
    const wrapper = document.body.querySelector('.images-tv');
    const a = wrapper.querySelector(':scope > a');
    init(a);

    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(wrapper.querySelector('video')).to.be.exist;
    expect(wrapper.querySelector('video').getAttribute('autoplay')).to.not.exist;
  });

  it('creates video block with autoplay search', () => {
    const wrapper = document.body.querySelector('.images-tv-autoplay-search');
    const a = wrapper.querySelector(':scope > a');
    init(a);

    expect(wrapper.querySelector('video').getAttribute('autoplay')).to.be.exist;
  });

  it('creates video block with autoplay hash', () => {
    const wrapper = document.body.querySelector('.images-tv-autoplay-hash');
    const a = wrapper.querySelector(':scope > a');
    init(a);

    expect(wrapper.querySelector('video').getAttribute('autoplay')).to.be.exist;
  });

  it('creates iframe video block', () => {
    const wrapper = document.body.querySelector('.adobe-tv');
    const a = wrapper.querySelector(':scope > a');

    init(a);

    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(wrapper.querySelector('iframe')).to.be.exist;
  });
});
