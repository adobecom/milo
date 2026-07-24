import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const { onMepAuth, signInToMep } = await import('../../../libs/features/mep/mep-auth.js');

const ORIGIN = window.location.origin;
const wait = (ms = 0) => new Promise((r) => { setTimeout(r, ms); });

function setEnv(name) {
  setConfig({ env: { name, ims: name === 'prod' ? 'prod' : 'stg1' } });
}

function postAuth(authed, origin = ORIGIN) {
  window.dispatchEvent(new MessageEvent('message', {
    origin,
    data: { type: 'mep-auth', authed },
  }));
}

// Keep the silent iframe from actually navigating/loading imslib — we simulate
// the route's postMessage by hand for determinism.
function stubInertIframe() {
  const realCreate = document.createElement.bind(document);
  sinon.stub(document, 'createElement').callsFake((tag) => {
    const el = realCreate(tag);
    if (tag === 'iframe') Object.defineProperty(el, 'src', { configurable: true, set() {}, get() { return ''; } });
    return el;
  });
}

let imsBackup;
function setPageIms(ims) {
  imsBackup = window.adobeIMS;
  window.adobeIMS = ims;
}

describe('mep-auth', () => {
  afterEach(() => {
    sinon.restore();
    window.adobeIMS = imsBackup;
    imsBackup = undefined;
    try { window.sessionStorage.removeItem('mepAuthEmployee'); } catch (e) { /* noop */ }
    document.querySelectorAll('iframe').forEach((el) => el.remove());
  });

  describe('onMepAuth', () => {
    it('bypasses the gate in non-prod envs (callback true immediately)', () => {
      setEnv('stage');
      const cb = sinon.spy();
      onMepAuth(cb);
      expect(cb.calledOnceWith(true)).to.be.true;
    });

    it('honors a cached employee verdict without any check', () => {
      setEnv('prod');
      window.sessionStorage.setItem('mepAuthEmployee', 'true');
      const cb = sinon.spy();
      onMepAuth(cb);
      expect(cb.calledOnceWith(true)).to.be.true;
    });

    it('Tier 1: reuses an already-signed-in employee page session (no iframe)', async () => {
      setEnv('prod');
      setPageIms({ isSignedInUser: () => true, getProfile: async () => ({ email: 'dev@adobe.com' }) });
      const createSpy = sinon.spy(document, 'createElement');
      const result = await new Promise((res) => { onMepAuth(res); });
      expect(result).to.be.true;
      expect(createSpy.getCalls().some((c) => c.args[0] === 'iframe')).to.be.false;
    });

    it('Tier 1: signed-in non-employee resolves false (no iframe)', async () => {
      setEnv('prod');
      setPageIms({ isSignedInUser: () => true, getProfile: async () => ({ email: 'shopper@example.com' }) });
      const result = await new Promise((res) => { onMepAuth(res); });
      expect(result).to.be.false;
    });

    it('Tier 2: no page session → silent iframe, resolves from the route message', async () => {
      setEnv('prod');
      setPageIms(undefined);
      stubInertIframe();
      const result = new Promise((res) => { onMepAuth(res); });
      await wait(0);
      postAuth(true);
      expect(await result).to.be.true;
    });

    it('ignores auth messages from an untrusted origin', async () => {
      setEnv('prod');
      setPageIms(undefined);
      stubInertIframe();
      const result = new Promise((res) => { onMepAuth(res); });
      await wait(0);
      postAuth(true, 'https://evil.example.com');
      postAuth(false);
      expect(await result).to.be.false;
    });
  });

  describe('signInToMep', () => {
    it('returns false when the popup is blocked', async () => {
      setEnv('prod');
      sinon.stub(window, 'open').returns(null);
      expect(await signInToMep()).to.be.false;
    });

    it('returns true and notifies subscribers when the popup reports an employee', async () => {
      setEnv('prod');
      setPageIms(undefined);
      stubInertIframe();
      sinon.stub(window, 'open').returns({});

      const subscriber = sinon.spy();
      onMepAuth(subscriber); // registers a pending subscriber (Tier 2 iframe, never answered)
      await wait(0);

      const signedIn = signInToMep();
      await wait(0);
      postAuth(true);

      expect(await signedIn).to.be.true;
      expect(subscriber.calledWith(true)).to.be.true;
    });
  });
});
