import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../libs/scripts/accessibility.js');

function fireTab(target) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
}

function fireFocusin(target) {
  target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

describe('scrollTabFocusedElIntoView', () => {
  let clock;

  before(async () => {
    document.body.innerHTML = await readFile({ path: '../blocks/card/mocks/two-up-cards.html' });
    init();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it('scrolls play button into view when it is outside the viewport', async () => {
    const playBtn = document.querySelector('.modal-img-link .consonant-play-btn');
    expect(playBtn).to.exist;

    // Stub getBoundingClientRect to place the element below the viewport
    sinon.stub(playBtn, 'getBoundingClientRect').returns({
      top: window.innerHeight + 100,
      bottom: window.innerHeight + 200,
      left: 100,
      right: 200,
      width: 100,
      height: 100,
    });

    const scrollIntoViewStub = sinon.stub(playBtn, 'scrollIntoView');

    fireTab(document.body);
    fireFocusin(playBtn);
    await clock.tickAsync(0);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    expect(scrollIntoViewStub.firstCall.args[0]).to.deep.include({ block: 'center' });
  });

  it('does not scroll a fully in-view non-play focusable element that is not occluded', async () => {
    const link = document.querySelector('a[href="https://business.adobe.com/"]');
    expect(link).to.exist;

    // Stub getBoundingClientRect to place the element fully within the viewport
    sinon.stub(link, 'getBoundingClientRect').returns({
      top: 100,
      bottom: 200,
      left: 100,
      right: 300,
      width: 200,
      height: 100,
    });

    const scrollIntoViewStub = sinon.stub(link, 'scrollIntoView');

    // Make elementFromPoint return the element itself so shouldntScroll returns true
    sinon.stub(document, 'elementFromPoint').returns(link);

    fireTab(document.body);
    fireFocusin(link);
    await clock.tickAsync(0);

    expect(scrollIntoViewStub.called).to.be.false;
  });

  it('scrolls a generic element that is off-viewport into view', async () => {
    const link = document.querySelector('a[href="https://business.adobe.com/"]');
    expect(link).to.exist;

    sinon.stub(link, 'getBoundingClientRect').returns({
      top: -200,
      bottom: -100,
      left: 100,
      right: 300,
      width: 200,
      height: 100,
    });

    const scrollIntoViewStub = sinon.stub(link, 'scrollIntoView');

    fireTab(document.body);
    fireFocusin(link);
    await clock.tickAsync(0);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    expect(scrollIntoViewStub.firstCall.args[0]).to.deep.include({ block: 'center' });
  });
});
