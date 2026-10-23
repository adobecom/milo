import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { guardPlayerOnC2 } from '../../../libs/utils/utils.js';

describe('guardPlayerOnC2', () => {
  let player;
  let meta;

  beforeEach(() => {
    player = document.createElement('div');
    document.body.append(player);
    window.lenis = { isScrolling: 'smooth', animatedScroll: 100, scrollTo: sinon.spy() };
  });

  afterEach(() => {
    player.remove();
    meta?.remove();
    delete window.lenis;
  });

  const settle = () => new Promise((resolve) => { setTimeout(resolve, 50); });

  it('does nothing outside C2 pages', async () => {
    guardPlayerOnC2(player);
    await settle();
    player.dispatchEvent(new PointerEvent('pointerdown'));
    expect(window.lenis.scrollTo.called).to.be.false;
  });

  it('guards the player on C2 pages', async () => {
    meta = document.createElement('meta');
    meta.name = 'foundation';
    meta.content = 'c2';
    document.head.append(meta);
    guardPlayerOnC2(player);
    await settle();
    player.dispatchEvent(new PointerEvent('pointerdown'));
    expect(window.lenis.scrollTo.calledOnceWith(100, { immediate: true })).to.be.true;
  });
});
