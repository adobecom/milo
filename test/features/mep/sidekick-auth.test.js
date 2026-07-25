import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const {
  isSidekickAuthed,
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
    it('bypasses the gate in non-prod envs', () => {
      setConfig({ env: { name: 'stage' } });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWith(true)).to.be.true;
    });

    it('calls back true in prod when the Sidekick is authed', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick();
      stubStatus({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(0);
      expect(cb.calledWith(true)).to.be.true;
    });

    it('calls back false in prod when not authed', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick();
      stubStatus({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(0);
      expect(cb.calledWith(false)).to.be.true;
    });

    it('re-checks and flips to true when the Sidekick logs in after load', async () => {
      setConfig({ env: { name: 'prod' } });
      const sk = mountSidekick();
      const fetchStub = stubStatus({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(0);
      expect(cb.calledWith(false)).to.be.true;

      // user logs into the Sidekick — /status now returns a profile
      fetchStub.restore();
      stubStatus({ authed: true });
      sk.dispatchEvent(new CustomEvent('logged-in'));
      await wait(0);
      expect(cb.calledWith(true)).to.be.true;
    });

    it('does not emit the same verdict twice', async () => {
      setConfig({ env: { name: 'prod' } });
      const sk = mountSidekick();
      stubStatus({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(0);
      sk.dispatchEvent(new CustomEvent('status-fetched'));
      await wait(0);
      expect(cb.callCount).to.equal(1);
    });
  });
});
