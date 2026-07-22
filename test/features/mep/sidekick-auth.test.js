import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../libs/utils/utils.js');
const {
  isSidekickAuthed,
  createSidekickAuthWatcher,
} = await import('../../../libs/features/mep/sidekick-auth.js');

function tick() {
  return new Promise((r) => { setTimeout(r, 0); });
}

function mountSidekick({ withPluginBar = true, withEnvSwitcher = false } = {}) {
  const sidekick = document.createElement('aem-sidekick');
  sidekick.attachShadow({ mode: 'open' });
  if (withPluginBar) {
    const pluginBar = document.createElement('plugin-action-bar');
    pluginBar.attachShadow({ mode: 'open' });
    sidekick.shadowRoot.appendChild(pluginBar);
    if (withEnvSwitcher) {
      pluginBar.shadowRoot.appendChild(document.createElement('env-switcher'));
    }
  }
  document.body.appendChild(sidekick);
  return sidekick;
}

function addPluginBarTo(sidekick, { withEnvSwitcher = false } = {}) {
  const pluginBar = document.createElement('plugin-action-bar');
  pluginBar.attachShadow({ mode: 'open' });
  sidekick.shadowRoot.appendChild(pluginBar);
  if (withEnvSwitcher) {
    pluginBar.shadowRoot.appendChild(document.createElement('env-switcher'));
  }
  return pluginBar;
}

describe('sidekick-auth', () => {
  let clock;
  let onSidekickAuth;

  beforeEach(() => {
    onSidekickAuth = createSidekickAuthWatcher();
  });

  afterEach(() => {
    document.querySelectorAll('aem-sidekick').forEach((el) => el.remove());
    if (clock) {
      clock.restore();
      clock = null;
    }
    sinon.restore();
  });

  describe('isSidekickAuthed', () => {
    it('returns false with no aem-sidekick in DOM', () => {
      expect(isSidekickAuthed()).to.equal(false);
    });

    it('returns false when env-switcher is missing', () => {
      mountSidekick({ withPluginBar: true, withEnvSwitcher: false });
      expect(isSidekickAuthed()).to.equal(false);
    });

    it('returns true when env-switcher is present in nested shadow', () => {
      mountSidekick({ withPluginBar: true, withEnvSwitcher: true });
      expect(isSidekickAuthed()).to.equal(true);
    });
  });

  describe('onSidekickAuth — non-prod short-circuit', () => {
    it('fires cb(true) synchronously on stage and does not touch shared state', () => {
      setConfig({ env: { name: 'stage' } });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(true)).to.equal(true);
    });

    it('fires cb(true) synchronously when env is undefined', () => {
      setConfig({});
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(true)).to.equal(true);
    });

    it('respects custom envs opt', () => {
      setConfig({ env: { name: 'stage' } });
      const cb = sinon.spy();
      onSidekickAuth(cb, { envs: ['prod', 'stage'] });
      // env is in opts.envs → still treated as gated, sync check, no sidekick → cb(false)
      expect(cb.calledOnceWithExactly(false)).to.equal(true);
    });
  });

  describe('onSidekickAuth — prod, sync paths', () => {
    beforeEach(() => {
      setConfig({ env: { name: 'prod' } });
    });

    it('fires cb(false) once when no sidekick is present', () => {
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(false)).to.equal(true);
    });

    it('fires cb(true) once when sidekick is already authed', () => {
      mountSidekick({ withPluginBar: true, withEnvSwitcher: true });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(true)).to.equal(true);
    });

    it('subscriber added after auth resolves short-circuits to cb(true) sync', async () => {
      const sidekick = mountSidekick({ withPluginBar: true, withEnvSwitcher: false });
      const cb1 = sinon.spy();
      onSidekickAuth(cb1);
      expect(cb1.calledWithExactly(false)).to.equal(true);

      const pluginBar = sidekick.shadowRoot.querySelector('plugin-action-bar');
      pluginBar.shadowRoot.appendChild(document.createElement('env-switcher'));
      await tick();
      expect(cb1.callCount).to.equal(2);
      expect(cb1.secondCall.args[0]).to.equal(true);

      const cb2 = sinon.spy();
      onSidekickAuth(cb2);
      expect(cb2.calledOnceWithExactly(true)).to.equal(true);
    });
  });

  describe('onSidekickAuth — prod, async transitions', () => {
    beforeEach(() => {
      setConfig({ env: { name: 'prod' } });
    });

    it('re-fires cb(true) when sidekick mounts and authes after subscribe', async () => {
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(false)).to.equal(true);

      mountSidekick({ withPluginBar: true, withEnvSwitcher: true });
      await tick();
      await tick();

      expect(cb.callCount).to.equal(2);
      expect(cb.secondCall.args[0]).to.equal(true);
    });

    it('re-fires cb(true) when plugin-action-bar gets env-switcher after subscribe', async () => {
      const sidekick = mountSidekick({ withPluginBar: false });
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(false)).to.equal(true);

      const pluginBar = addPluginBarTo(sidekick, { withEnvSwitcher: false });
      await tick();
      pluginBar.shadowRoot.appendChild(document.createElement('env-switcher'));
      await tick();

      expect(cb.callCount).to.equal(2);
      expect(cb.secondCall.args[0]).to.equal(true);
    });

    it('two subscribers share one observer chain and both fire on resolution', async () => {
      const cb1 = sinon.spy();
      const cb2 = sinon.spy();
      onSidekickAuth(cb1);
      onSidekickAuth(cb2);

      mountSidekick({ withPluginBar: true, withEnvSwitcher: true });
      await tick();
      await tick();

      expect(cb1.callCount).to.equal(2);
      expect(cb2.callCount).to.equal(2);
      expect(cb1.secondCall.args[0]).to.equal(true);
      expect(cb2.secondCall.args[0]).to.equal(true);
    });

    it('one throwing subscriber does not prevent others from being notified', async () => {
      const cb1 = sinon.stub().throws(new Error('boom'));
      const cb2 = sinon.spy();
      onSidekickAuth(cb1);
      onSidekickAuth(cb2);

      mountSidekick({ withPluginBar: true, withEnvSwitcher: true });
      await tick();
      await tick();

      expect(cb1.callCount).to.equal(2);
      expect(cb2.callCount).to.equal(2);
      expect(cb2.secondCall.args[0]).to.equal(true);
    });
  });

  describe('onSidekickAuth — safety timeout', () => {
    beforeEach(() => {
      setConfig({ env: { name: 'prod' } });
      clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout'],
        shouldAdvanceTime: true,
      });
    });

    it('does not re-invoke subscribers when timeout fires', () => {
      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(false)).to.equal(true);

      clock.tick(5 * 60 * 1000 + 1);
      expect(cb.callCount).to.equal(1);
    });

    it('subscribers added after timeout fall through to sync check, no re-attach', () => {
      onSidekickAuth(sinon.spy());
      clock.tick(5 * 60 * 1000 + 1);

      const cb = sinon.spy();
      onSidekickAuth(cb);
      expect(cb.calledOnceWithExactly(false)).to.equal(true);
    });
  });
});
