import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { showToast, hideToast } from '../../../../libs/c2/features/toast/toast.js';

const nextFrame = () => new Promise((r) => {
  requestAnimationFrame(() => requestAnimationFrame(r));
});
const region = () => document.querySelector('.c2-toast-region');

describe('C2 toast', () => {
  afterEach(() => {
    hideToast();
    document.querySelectorAll('.c2-toast').forEach((el) => el.remove());
  });

  it('renders a message as text inside a labelled region', async () => {
    const id = showToast({ message: '<b>Saved</b>', variant: 'positive' });
    expect(id).to.be.a('number');
    const toast = region().querySelector(`[data-toast-id="${id}"]`);
    expect(region().getAttribute('role')).to.equal('region');
    expect(toast.classList.contains('c2-toast-positive')).to.be.true;
    expect(toast.querySelector('.c2-toast-message').textContent).to.equal('<b>Saved</b>');
    expect(toast.querySelector('b')).to.be.null;
    await nextFrame();
    expect(toast.classList.contains('is-visible')).to.be.true;
    expect(toast.querySelector('.c2-toast-body').hasAttribute('aria-hidden')).to.be.false;
  });

  it('uses role="alert" only for negative toasts', () => {
    const neg = showToast({ message: 'Error', variant: 'negative' });
    const pos = showToast({ message: 'Done', variant: 'positive' });
    expect(region().querySelector(`[data-toast-id="${neg}"] .c2-toast-body`).getAttribute('role')).to.equal('alert');
    expect(region().querySelector(`[data-toast-id="${pos}"] .c2-toast-body`).getAttribute('role')).to.equal('status');
  });

  it('falls back to neutral for unknown variants and ignores empty messages', () => {
    expect(showToast({ message: '' })).to.be.null;
    const id = showToast({ message: 'Hi', variant: 'bogus' });
    expect(region().querySelector(`[data-toast-id="${id}"]`).classList.contains('c2-toast-neutral')).to.be.true;
  });

  it('shows one toast per key', () => {
    const first = showToast({ message: 'Copied', key: 'copy' });
    const second = showToast({ message: 'Copied', key: 'copy' });
    expect(second).to.equal(first);
    expect(region().querySelectorAll('.c2-toast').length).to.equal(1);
  });

  it('auto-dismisses after at least 5 seconds and pauses on hover', () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    try {
      const id = showToast({ message: 'Short', duration: 1000 });
      clock.tick(4000);
      expect(region().querySelector(`[data-toast-id="${id}"]`)).to.exist;
      region().dispatchEvent(new Event('mouseenter'));
      clock.tick(10000);
      expect(region().querySelector(`[data-toast-id="${id}"]`)).to.exist;
      region().dispatchEvent(new Event('mouseleave'));
      clock.tick(1000 + 400);
      expect(region().querySelector(`[data-toast-id="${id}"]`)).to.be.null;
    } finally {
      clock.restore();
    }
  });

  it('keeps actionable toasts open and only allows http(s) links', () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    try {
      // eslint-disable-next-line no-script-url
      const unsafe = showToast({ message: 'Bad', ctaLabel: 'Go', ctaHref: 'javascript:alert(1)' });
      expect(region().querySelector(`[data-toast-id="${unsafe}"] .c2-toast-cta`)).to.be.null;
      const id = showToast({ message: 'Undo?', ctaLabel: 'Undo', ctaHref: '/undo' });
      clock.tick(60000);
      const cta = region().querySelector(`[data-toast-id="${id}"] .c2-toast-cta`);
      expect(cta.tagName).to.equal('A');
      expect(cta.getAttribute('href')).to.equal('/undo');
    } finally {
      clock.restore();
    }
  });

  it('calls the action handler and dismisses from the close button', () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    try {
      const ctaAction = sinon.spy();
      const id = showToast({ message: 'Retry?', ctaLabel: 'Retry', ctaAction });
      const toast = region().querySelector(`[data-toast-id="${id}"]`);
      toast.querySelector('button.c2-toast-cta').click();
      expect(ctaAction.calledOnce).to.be.true;
      toast.querySelector('.c2-toast-close').click();
      clock.tick(400);
      expect(toast.isConnected).to.be.false;
    } finally {
      clock.restore();
    }
  });
});
