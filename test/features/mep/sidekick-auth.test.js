import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const {
  isSidekickAuthed,
  isUngatedHost,
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
const signOut = (user) => user.classList.add('not-authorized');

describe('sidekick-auth (shadow-DOM login-button probe)', () => {
  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('aem-sidekick, helix-sidekick').forEach((el) => el.remove());
    setConfig({ env: { name: 'stage' } });
  });

  describe('isUngatedHost (gate defaults to on for anything not a preview/dev host)', () => {
    it('ungates genuine preview/dev/stage/internal surfaces', () => {
      [
        'main--milo--adobecom.aem.page',
        'mep-next-v1--milo--adobecom.hlx.page',
        'branch--repo--owner.aem.reviews',
        'localhost',
        '127.0.0.1',
        'www.stage.adobe.com',
        'business.stage.adobe.com',
        'www.corp.adobe.com',
        'graybox.adobe.com',
        'business-graybox.adobe.com', // hyphenated graybox host
      ].forEach((host) => expect(isUngatedHost(host), host).to.be.true);
    });

    it('gates the public live edge and prod/unknown hosts by default', () => {
      [
        'main--milo--adobecom.aem.live', // public live edge — must be gated
        'mep-next-v1--milo--adobecom.hlx.live',
        'www.adobe.com',
        'business.adobe.com',
        'evil-aem.page.attacker.com', // not a real *.aem.page host
        'evilstage.adobe.com', // no boundary before "stage"
        'stage.adobe.com.attacker.com', // suffix trick
        'notgraybox.adobe.com', // no boundary before "graybox"
        'graybox.adobe.com.attacker.com', // suffix trick
        'example.com',
      ].forEach((host) => expect(isUngatedHost(host), host).to.be.false);
    });
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
    const RESOLVE_WINDOW = 1400;

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
      onSidekickAuth(cb); // no sidekick → resolves unauthed, i.e. gated
      await wait(RESOLVE_WINDOW);
      expect(cb.calledWith(false)).to.be.true;
      expect(cb.calledWith(true)).to.be.false;
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

    it('emits false only after the bounded window when signed out', async () => {
      setConfig({ env: { name: 'prod' } });
      mountSidekick({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      expect(cb.called).to.be.false; // window still open
      await wait(RESOLVE_WINDOW);
      expect(cb.calledWith(false)).to.be.true;
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

    it('flips to true when the author signs in after an unauthed load', async () => {
      setConfig({ env: { name: 'prod' } });
      const { user } = mountSidekick({ authed: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(RESOLVE_WINDOW); // commits to false first
      expect(cb.calledWith(false)).to.be.true;
      signIn(user);
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
    });

    it('flips back to false when the author signs out mid-session', async () => {
      setConfig({ env: { name: 'prod' } });
      const { user } = mountSidekick({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
      signOut(user);
      await wait(50);
      expect(cb.calledWith(false)).to.be.true;
    });

    it('resolves unauthed promptly with no sidekick, then flips true when it mounts', async () => {
      setConfig({ env: { name: 'prod' } });
      const cb = sinon.spy();
      onSidekickAuth(cb); // no sidekick yet
      await wait(50);
      expect(cb.calledWith(false)).to.be.true; // no sidekick → unauthed promptly
      mountSidekick({ authed: true });
      await wait(50);
      expect(cb.calledWith(true)).to.be.true; // opening the sidekick flips it
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

    it('flips to false on a logged-out event mid-session', async () => {
      setConfig({ env: { name: 'prod' } });
      const { sk } = mountSidekick({ authed: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      await wait(50);
      expect(cb.calledWith(true)).to.be.true;
      sk.dispatchEvent(new CustomEvent('logged-out'));
      await wait(50);
      expect(cb.calledWith(false)).to.be.true;
    });
  });
});
