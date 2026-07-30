import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const {
  isSidekickAuthed,
  isUngatedHost,
  onSidekickAuth,
} = await import('../../../libs/features/mep/sidekick-auth.js');

const wait = (ms = 0) => new Promise((r) => { setTimeout(r, ms); });

// Test host (localhost) isn't an aem host, so the project comes from the
// Sidekick element's public config — mirrors the adobe.com path.
function mountSidekick({ owner = 'adobecom', repo = 'milo', ref = 'main' } = {}) {
  const sk = document.createElement('aem-sidekick');
  sk.config = { owner, repo, ref };
  document.body.appendChild(sk);
  return sk;
}

function stubStatus({ authed }) {
  return sinon.stub(window, 'fetch').callsFake(async (url) => {
    if (String(url).includes('/status/')) {
      if (authed) return { ok: true, json: async () => ({ profile: { email: 'author@adobe.com' } }) };
      return { ok: false, status: 401, json: async () => ({}) };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  });
}

describe('sidekick-auth (/status)', () => {
  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('aem-sidekick, helix-sidekick').forEach((el) => el.remove());
    setConfig({ env: { name: 'stage' } });
  });

  describe('isUngatedHost (gate defaults to on for anything not a preview/dev host)', () => {
    it('ungates genuine preview/dev surfaces', () => {
      [
        'main--milo--adobecom.aem.page',
        'mep-next-v1--milo--adobecom.hlx.page',
        'branch--repo--owner.aem.reviews',
        'localhost',
        '127.0.0.1',
      ].forEach((host) => expect(isUngatedHost(host), host).to.be.true);
    });

    it('gates the public live edge and prod/unknown hosts by default', () => {
      [
        'main--milo--adobecom.aem.live', // public live edge — must be gated
        'mep-next-v1--milo--adobecom.hlx.live',
        'www.adobe.com',
        'business.adobe.com',
        'evil-aem.page.attacker.com', // not a real *.aem.page host
        'example.com',
      ].forEach((host) => expect(isUngatedHost(host), host).to.be.false);
    });
  });

  describe('isSidekickAuthed', () => {
    it('returns false when there is no project (no sidekick, non-aem host)', async () => {
      stubStatus({ authed: true });
      expect(await isSidekickAuthed()).to.equal(false);
    });

    it('returns true when /status returns a profile', async () => {
      mountSidekick();
      stubStatus({ authed: true });
      expect(await isSidekickAuthed()).to.equal(true);
    });

    it('returns false when /status is 401', async () => {
      mountSidekick();
      stubStatus({ authed: false });
      expect(await isSidekickAuthed()).to.equal(false);
    });

    it('returns false when the fetch throws (CORS/network)', async () => {
      mountSidekick();
      sinon.stub(window, 'fetch').rejects(new Error('CORS'));
      expect(await isSidekickAuthed()).to.equal(false);
    });
  });

  describe('onSidekickAuth', () => {
    // > sum of RETRY_DELAYS_MS (300 + 900) — long enough for the retry to exhaust.
    const RETRY_WINDOW = 1500;

    it('bypasses the gate off prod hosts / non-prod env', () => {
      setConfig({ env: { name: 'stage' } });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWith(true)).to.be.true;
    });

    it('gates on a prod host even when env is overridden to stage (no bypass)', async () => {
      // host-keyed: ?env=stage on a real prod host must NOT disable the gate
      setConfig({ env: { name: 'stage' }, prodDomains: [window.location.hostname] });
      const cb = sinon.spy();
      onSidekickAuth(cb); // no Sidekick mounted → resolves unauthed, i.e. gated
      await wait(50);
      expect(cb.calledWith(false)).to.be.true;
      expect(cb.calledWith(true)).to.be.false;
    });

    it('calls back true on the first attempt when the Sidekick is authed', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick();
      stubStatus({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
      // authed on attempt 1 → no false ever emitted
      expect(cb.calledWith(false)).to.be.false;
    });

    it('emits false only after the bounded retry is exhausted', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick();
      stubStatus({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      // retry window still open — no verdict yet
      await wait(50);
      expect(cb.calledWith(false)).to.be.false;
      // after the window elapses, resolves false
      await wait(RETRY_WINDOW);
      expect(cb.calledWith(false)).to.be.true;
    });

    it('retries and resolves true when a later attempt authes (no false flash)', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick();
      let calls = 0;
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        if (!String(url).includes('/status/')) return { ok: false, status: 404, json: async () => ({}) };
        calls += 1;
        if (calls >= 2) return { ok: true, json: async () => ({ profile: { email: 'author@adobe.com' } }) };
        return { ok: false, status: 401, json: async () => ({}) };
      });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(RETRY_WINDOW);
      expect(cb.calledWith(true)).to.be.true;
      expect(cb.calledWith(false)).to.be.false;
    });

    it('flips to true when the Sidekick logs in after an unauthed load', async () => {
      setConfig({ env: { name: 'prod' } });
      const sk = mountSidekick();
      const fetchStub = stubStatus({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);

      // user logs into the Sidekick — /status now returns a profile
      fetchStub.restore();
      stubStatus({ authed: true });
      sk.dispatchEvent(new CustomEvent('logged-in'));
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
    });

    it('does not emit the same verdict twice', async () => {
      setConfig({ env: { name: 'prod' } });
      const sk = mountSidekick();
      stubStatus({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      sk.dispatchEvent(new CustomEvent('status-fetched'));
      await wait(50);
      expect(cb.callCount).to.equal(1);
    });
  });
});
