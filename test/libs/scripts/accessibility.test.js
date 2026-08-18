import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { default: init } = await import('../../../libs/scripts/accessibility.js');
init();

function makeRect(top, bottom, left = 0, width = 100) {
  return {
    top, bottom, left, right: left + width, width, height: bottom - top,
  };
}

describe('scrollTabFocusedElIntoView', () => {
  let scrollIntoViewStub;

  beforeEach(() => {
    scrollIntoViewStub = sinon.stub();
    sinon.stub(window, 'scrollTo');
  });

  afterEach(() => {
    sinon.restore();
    document.body.innerHTML = '';
  });

  function fireTab(target) {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
  }

  it('scrolls into view when element is above viewport (rect.top < 0)', () => {
    const el = document.createElement('a');
    el.href = '#';
    document.body.appendChild(el);
    el.scrollIntoView = scrollIntoViewStub;
    sinon.stub(el, 'getBoundingClientRect').returns(makeRect(-50, 20));
    sinon.stub(window, 'innerHeight').value(768);

    fireTab(el);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    expect(scrollIntoViewStub.firstCall.args[0]).to.deep.equal({ behavior: 'instant', block: 'center' });
  });

  it('scrolls into view when element is below viewport (rect.bottom > viewportHeight)', () => {
    const el = document.createElement('a');
    el.href = '#';
    document.body.appendChild(el);
    el.scrollIntoView = scrollIntoViewStub;
    sinon.stub(el, 'getBoundingClientRect').returns(makeRect(700, 850));
    sinon.stub(window, 'innerHeight').value(768);

    fireTab(el);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    expect(scrollIntoViewStub.firstCall.args[0]).to.deep.equal({ behavior: 'instant', block: 'center' });
  });

  it('skips scroll when notification-curtain is present in parent section', () => {
    const section = document.createElement('div');
    const curtain = document.createElement('div');
    curtain.className = 'notification-curtain';
    const notification = document.createElement('div');
    notification.className = 'notification';
    const el = document.createElement('a');
    el.href = '#';
    el.scrollIntoView = scrollIntoViewStub;
    notification.appendChild(el);
    section.appendChild(notification);
    section.appendChild(curtain);
    document.body.appendChild(section);

    sinon.stub(el, 'getBoundingClientRect').returns(makeRect(800, 900));
    sinon.stub(window, 'innerHeight').value(768);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(scrollIntoViewStub.called).to.be.false;
  });

  it('scrolls consonant-play-btn into view even when modal-img-link covers sample points', () => {
    const section = document.createElement('div');
    const modalLink = document.createElement('span');
    modalLink.className = 'modal-img-link';
    const playBtn = document.createElement('a');
    playBtn.href = '#';
    playBtn.className = 'consonant-play-btn';
    playBtn.scrollIntoView = scrollIntoViewStub;
    modalLink.appendChild(playBtn);
    section.appendChild(modalLink);
    document.body.appendChild(section);

    const btnRect = makeRect(200, 272, 450, 72);
    sinon.stub(playBtn, 'getBoundingClientRect').returns(btnRect);
    sinon.stub(window, 'innerHeight').value(768);

    // elementFromPoint returns the parent modal-img-link, which contains the play button —
    // the old code would incorrectly skip scrolling in this case.
    sinon.stub(document, 'elementFromPoint').returns(modalLink);

    fireTab(playBtn);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
    expect(scrollIntoViewStub.firstCall.args[0]).to.deep.equal({ behavior: 'instant', block: 'center' });
  });

  it('scrolls in-viewport element that is obscured by an unrelated overlay', () => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const el = document.createElement('a');
    el.href = '#';
    el.scrollIntoView = scrollIntoViewStub;
    document.body.appendChild(overlay);
    document.body.appendChild(el);

    sinon.stub(el, 'getBoundingClientRect').returns(makeRect(300, 380));
    sinon.stub(window, 'innerHeight').value(768);
    sinon.stub(document, 'elementFromPoint').returns(overlay);

    fireTab(el);

    expect(scrollIntoViewStub.calledOnce).to.be.true;
  });
});
