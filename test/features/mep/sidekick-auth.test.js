import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const {
  isSidekickAuthed,
  onSidekickAuth,
} = await import('../../../libs/features/mep/sidekick-auth.js');

const wait = (ms = 0) => new Promise((r) => { setTimeout(r, ms); });

// The real <aem-sidekick> exposes no config/status to page JS. The page-world
// signal is its nested open shadow DOM: login-button#user is ALWAYS rendered
// inside plugin-action-bar's shadow and carries the `not-authorized` class when
// signed out, dropping it when an authenticated status is fetched.
function mountSidekick({ authed = false, withUser = true } = {}) {
  const sk = document.createElement('aem-sidekick');
  const skShadow = sk.attachShadow({ mode: 'open' });
  const bar = document.createElement('plugin-action-bar');
  skShadow.appendChild(bar);
  const barShadow = bar.attachShadow({ mode: 'open' });
  let user;
  if (withUser) {
    user = document.createElement('login-button');
    user.id = 'user';
    if (!authed) user.classList.add('not-authorized');
    barShadow.appendChild(user);
  }
  document.body.appendChild(sk);
  return { sk, barShadow, user };
}

const signIn = (user) => user.classList.remove('not-authorized');
// const signOut = (user) => user.classList.add('not-authorized');

describe('sidekick-auth (shadow-DOM login-button probe)', () => {
  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('aem-sidekick, helix-sidekick').forEach((el) => el.remove());
    setConfig({ env: { name: 'stage' } });
  });

  describe('isSidekickAuthed', () => {
    it('returns false when there is no sidekick', () => {
      expect(isSidekickAuthed()).to.equal(false);
    });

    it('returns false when the user button carries not-authorized (signed out)', () => {
      mountSidekick({ authed: false });
      expect(isSidekickAuthed()).to.equal(false);
    });

    it('returns true when the user button lacks not-authorized (signed in)', () => {
      mountSidekick({ authed: true });
      expect(isSidekickAuthed()).to.equal(true);
    });

    it('returns false when the user button is not present yet', () => {
      mountSidekick({ withUser: false });
      expect(isSidekickAuthed()).to.equal(false);
    });
  });

  describe('onSidekickAuth — DOM signal', () => {
    // > RESOLVE_DELAY_MS (1200) — long enough for the unauthed default to commit.

    it('bypasses the gate off prod hosts / non-prod env', () => {
      setConfig({ env: { name: 'stage' } });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWith(true)).to.be.true;
    });

    it('calls back true immediately when already signed in', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
      expect(cb.calledWith(false)).to.be.false; // no sign-in flash
    });

    it('flips to true (no false flash) when not-authorized clears before the window', async () => {
      setConfig({ env: { name: 'prod' } });
      const { user } = mountSidekick({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      signIn(user); // status resolves signed-in
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
      expect(cb.calledWith(false)).to.be.false;
    });

    it('does not emit the same verdict twice', async () => {
      setConfig({ env: { name: 'prod' } });
      const { barShadow } = mountSidekick({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      // an unrelated mutation must not re-emit true
      barShadow.appendChild(document.createElement('span'));
      await wait(50);
      expect(cb.callCount).to.equal(1);
    });
  });

  describe('onSidekickAuth — event backup', () => {
    it('resolves true on a logged-in event even before the DOM clears', async () => {
      setConfig({ env: { name: 'prod' } });
      const { sk } = mountSidekick({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      sk.dispatchEvent(new CustomEvent('logged-in'));
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
    });

    it('resolves true on a status-fetched event carrying a profile', async () => {
      setConfig({ env: { name: 'prod' } });
      const { sk } = mountSidekick({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      sk.dispatchEvent(new CustomEvent('status-fetched', { detail: { profile: { email: 'a@adobe.com' } } }));
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
    });
  });
});
