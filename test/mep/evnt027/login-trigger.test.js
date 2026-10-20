import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createTag, setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/mep/evnt027/login-trigger.js';

const DISMISSED_KEY = 'evnt027-login-prompt-dismissed';
const FRAGMENT_PATH = '/fragments/max-login-trigger-test';
const FRAGMENT_HTML = '<div><div><div class="max26-login-prompt" data-block-status="loaded"><h2>MAX login</h2></div></div></div>';

describe('MAX login prompt trigger', () => {
  let clock;
  let stop;
  let target;
  let targetTop;
  let fetchStub;
  let fragmentResponse;
  let visibility;

  const metadata = (name, content) => {
    document.head.querySelector(`meta[name="${name}"]`)?.remove();
    document.head.append(createTag('meta', { name, content }));
  };
  const configure = (query = '') => metadata('max26-login-prompt', `${FRAGMENT_PATH}${query}`);
  const flush = async () => {
    await clock.tickAsync(0);
    await new Promise((resolve) => { requestAnimationFrame(resolve); });
    await clock.tickAsync(0);
  };
  const reachTarget = async () => {
    targetTop = window.innerHeight - 1;
    window.dispatchEvent(new Event('scroll'));
    await flush();
  };
  const modal = () => document.getElementById('max26-login-prompt');

  before(() => {
    setConfig({ codeRoot: '/libs' });
  });

  beforeEach(() => {
    localStorage.removeItem(DISMISSED_KEY);
    document.body.replaceChildren(createTag('main'));
    target = createTag('section', { id: 'session-details' }, 'Session details');
    document.querySelector('main').append(target);
    targetTop = window.innerHeight + 1;
    sinon.stub(target, 'getBoundingClientRect').callsFake(() => ({ top: targetTop }));
    visibility = 'visible';
    sinon.stub(document, 'visibilityState').get(() => visibility);
    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    const originalFetch = window.fetch.bind(window);
    fragmentResponse = () => Promise.resolve(new Response(FRAGMENT_HTML));
    fetchStub = sinon.stub(window, 'fetch').callsFake((resource, options) => (
      String(resource).includes(FRAGMENT_PATH)
        ? fragmentResponse() : originalFetch(resource, options)
    ));
    configure();
  });

  afterEach(() => {
    stop?.();
    stop = null;
    sinon.restore();
    document.querySelectorAll('meta[name^="max26-login-prompt"]').forEach((meta) => meta.remove());
    document.body.replaceChildren();
    document.documentElement.classList.remove('disable-scroll');
    localStorage.removeItem(DISMISSED_KEY);
  });

  it('preserves the default two-minute delay', async () => {
    stop = init();
    await clock.tickAsync(119999);
    expect(modal()).to.be.null;
    await clock.tickAsync(1);
    await flush();
    expect(modal()).to.exist;
  });

  it('uses the authored delay and strips trigger parameters from the fragment request', async () => {
    configure('?delay=3&operator=or');
    stop = init();
    await clock.tickAsync(2999);
    expect(modal()).to.be.null;
    await clock.tickAsync(1);
    await flush();
    expect(modal()).to.exist;
    const request = fetchStub.getCalls()
      .find(({ args }) => String(args[0]).includes(FRAGMENT_PATH));
    expect(request.args[0]).to.equal(`${window.location.origin}${FRAGMENT_PATH}.plain.html`);
  });

  it('measures the delay from navigation when initialized late', async () => {
    await clock.tickAsync(5000);
    configure('?delay=3');
    stop = init();
    await flush();
    expect(modal()).to.exist;
  });

  ['and', null].forEach((operator) => {
    ['delay', 'target'].forEach((first) => {
      it(`waits for both conditions with ${operator ?? 'default AND'} when ${first} is first`, async () => {
        configure(`?delay=3&showAfter=session-details${operator ? `&operator=${operator}` : ''}`);
        stop = init();
        if (first === 'delay') await clock.tickAsync(3000);
        else await reachTarget();
        await flush();
        expect(modal()).to.be.null;
        if (first === 'delay') await reachTarget();
        else await clock.tickAsync(3000);
        await flush();
        expect(modal()).to.exist;
      });
    });
  });

  ['delay', 'target'].forEach((first) => {
    it(`opens on the ${first} condition alone with OR`, async () => {
      configure('?delay=3&showAfter=session-details&operator=or');
      stop = init();
      if (first === 'delay') await clock.tickAsync(3000);
      else await reachTarget();
      await flush();
      expect(modal()).to.exist;
      if (first === 'target') expect(performance.now()).to.equal(0);
    });
  });

  it('checks an already-reached target immediately without waiting for the OR delay', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    targetTop = -20;
    stop = init();
    await flush();
    expect(modal()).to.exist;
    expect(performance.now()).to.equal(0);
  });

  ['and', 'or'].forEach((operator) => {
    it(`does not invent an immediate delay for a target-only ${operator} trigger`, async () => {
      configure(`?showAfter=session-details&operator=${operator}`);
      stop = init();
      await flush();
      expect(modal()).to.be.null;
      await reachTarget();
      expect(modal()).to.exist;
    });
  });

  it('treats an explicitly authored zero delay as satisfied in OR', async () => {
    configure('?delay=0&showAfter=session-details&operator=or');
    stop = init();
    await flush();
    expect(modal()).to.exist;
  });

  it('looks up literal element IDs rather than treating them as selectors', async () => {
    target.id = 'session:details.2026';
    configure('?showAfter=session%3Adetails.2026');
    stop = init();
    await reachTarget();
    expect(modal()).to.exist;
  });

  it('does not open for a hidden target', async () => {
    configure('?showAfter=session-details');
    target.hidden = true;
    targetTop = 0;
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    target.hidden = false;
    await reachTarget();
    expect(modal()).to.exist;
  });

  it('waits until the target top crosses the viewport edge', async () => {
    configure('?showAfter=session-details');
    targetTop = window.innerHeight;
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    await reachTarget();
    expect(modal()).to.exist;
  });

  ['and', 'or'].forEach((operator) => {
    it(`handles a missing target with ${operator.toUpperCase()}`, async () => {
      configure(`?delay=3&showAfter=missing&operator=${operator}`);
      stop = init();
      await clock.tickAsync(3000);
      await flush();
      expect(!!modal()).to.equal(operator === 'or');
    });
  });

  it('checks targets inserted after initialization', async () => {
    configure('?showAfter=session-details');
    target.remove();
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    targetTop = 0;
    document.querySelector('main').append(target);
    await flush();
    expect(modal()).to.exist;
  });

  it('preserves legacy delay and selector metadata', async () => {
    metadata('max26-login-prompt-delay', '3');
    metadata('max26-login-prompt-scroll-target', '#session-details');
    stop = init();
    await reachTarget();
    expect(modal()).to.be.null;
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('gives URL parameters precedence over legacy metadata', async () => {
    metadata('max26-login-prompt-delay', '120');
    metadata('max26-login-prompt-scroll-target', '#missing');
    configure('?delay=3&showAfter=session-details');
    stop = init();
    await reachTarget();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('defers either OR condition while another dialog is open', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    const other = createTag('div', { class: 'dialog-modal' });
    document.body.append(other);
    stop = init();
    await reachTarget();
    await clock.tickAsync(3000);
    expect(modal()).to.be.null;
    other.remove();
    window.dispatchEvent(new Event('milo:modal:closed'));
    await flush();
    expect(modal()).to.exist;
  });

  it('defers an OR trigger while the document is hidden', async () => {
    configure('?delay=0&showAfter=session-details&operator=or');
    visibility = 'hidden';
    stop = init();
    await flush();
    expect(modal()).to.be.null;
    visibility = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    await flush();
    expect(modal()).to.exist;
  });

  it('rechecks conditions after the fragment loads', async () => {
    configure('?delay=3&showAfter=session-details&operator=or');
    let resolveResponse;
    fragmentResponse = () => new Promise((resolve) => { resolveResponse = resolve; });
    targetTop = 0;
    stop = init();
    await flush();
    expect(resolveResponse).to.be.a('function');
    targetTop = window.innerHeight + 1;
    resolveResponse(new Response(FRAGMENT_HTML));
    await flush();
    expect(modal()).to.be.null;
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.exist;
  });

  it('suppresses dismissed visitors and persists a subsequent close', async () => {
    configure('?delay=0');
    localStorage.setItem(DISMISSED_KEY, 'true');
    expect(init()).to.be.null;
    localStorage.removeItem(DISMISSED_KEY);
    stop = init();
    await flush();
    expect(modal()).to.exist;
    modal().querySelector('.dialog-close').click();
    expect(localStorage.getItem(DISMISSED_KEY)).to.equal('true');
    expect(init()).to.be.null;
  });

  it('guards repeated initialization and cancels a stopped trigger', async () => {
    configure('?delay=3');
    stop = init();
    expect(init()).to.equal(stop);
    stop();
    await clock.tickAsync(3000);
    await flush();
    expect(modal()).to.be.null;
  });

  [
    'delay=-1', 'delay=', 'delay=NaN', 'delay=Infinity',
    'operator=xor', 'operator=', 'showAfter=', 'showAfter=%23session-details',
    'showAfter=session%20details',
  ].forEach((query) => {
    it(`rejects invalid authoring: ${query}`, () => {
      configure(`?${query}`);
      expect(() => init()).to.throw(Error);
    });
  });
});
