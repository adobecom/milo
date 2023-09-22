import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/video/video.js');
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('video uploaded using franklin bot', () => {
  it('decorates video', async () => {
    const block = document.querySelector('.video.normal');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.querySelector('a')).to.be.null;
    expect(block.firstElementChild.tagName).to.eql('VIDEO');
  });

  it('decorates video with autoplay', async () => {
    const block = document.querySelector('.video.autoplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.firstElementChild.hasAttribute('autoplay')).to.be.true;
  });

  it('decorates video with autoplay and no loop', async () => {
    const block = document.querySelector('.video.no-loop');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.firstElementChild.hasAttribute('loop')).to.be.false;
  });

  it('decorates video with autoplay, no loop and hover play', async () => {
    const block = document.querySelector('.video.no-loop.hoverplay');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.firstElementChild.hasAttribute('loop')).to.be.false;
    expect(block.firstElementChild.hasAttribute('data-hoverplay')).to.be.true;
  });

  it('no hoverplay attribute added when with autoplay on loop', async () => {
    const block = document.querySelector('.video.autoplay.playonhover');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.firstElementChild.hasAttribute('loop')).to.be.true;
    expect(block.firstElementChild.hasAttribute('data-hoverplay')).to.be.false;
  });

  it('no hoverplay attribute added when only hoverplay is added to url', async () => {
    const block = document.querySelector('.video.hoveronly');
    const a = block.querySelector('a');
    const { href } = a;
    a.textContent = href;
    block.append(a);

    init(a);

    expect(block.firstElementChild.hasAttribute('data-hoverplay')).to.be.false;
  });
});
