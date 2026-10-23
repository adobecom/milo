import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import guardPlayerScroll from '../../../libs/c2/utils/player-scroll-guard.js';

function pointerMove(el) {
  el.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', movementX: 2, movementY: 1 }));
}

describe('C2 player scroll guard', () => {
  let player;
  let cleanup;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    player = document.createElement('div');
    document.body.append(player);
    window.lenis = { isScrolling: 'smooth', animatedScroll: 420, scrollTo: sinon.spy() };
    cleanup = guardPlayerScroll(player);
  });

  afterEach(() => {
    cleanup();
    player.remove();
    delete window.lenis;
    clock.restore();
  });

  it('ends a smooth glide when the pointer is pressed on the player', () => {
    player.dispatchEvent(new PointerEvent('pointerdown'));
    expect(window.lenis.scrollTo.calledOnceWith(420, { immediate: true })).to.be.true;
  });

  it('waits for wheel input to stop before ending the glide on hover', () => {
    window.dispatchEvent(new WheelEvent('wheel'));
    pointerMove(player);
    expect(window.lenis.scrollTo.called).to.be.false;
    clock.tick(200);
    expect(window.lenis.scrollTo.calledOnce).to.be.true;
  });

  it('leaves programmatic or idle scrolling alone', () => {
    window.lenis.isScrolling = false;
    player.dispatchEvent(new PointerEvent('pointerdown'));
    pointerMove(player);
    clock.tick(200);
    expect(window.lenis.scrollTo.called).to.be.false;
  });

  it('ignores touch and stops after cleanup', () => {
    player.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', movementX: 2 }));
    clock.tick(200);
    expect(window.lenis.scrollTo.called).to.be.false;
    cleanup();
    player.dispatchEvent(new PointerEvent('pointerdown'));
    expect(window.lenis.scrollTo.called).to.be.false;
  });

  it('reports presses that a smooth scroll kept from reaching the player', () => {
    const onInertPress = sinon.spy();
    const other = document.createElement('div');
    document.body.append(other);
    const stop = guardPlayerScroll(other, { onInertPress });

    other.dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    expect(onInertPress.called).to.be.false;

    document.documentElement.classList.add('lenis-smooth');
    other.dispatchEvent(new PointerEvent('pointerdown', { button: 2 }));
    expect(onInertPress.called).to.be.false;
    other.dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
    expect(onInertPress.calledOnce).to.be.true;

    document.documentElement.classList.remove('lenis-smooth');
    stop();
    other.remove();
  });
});
