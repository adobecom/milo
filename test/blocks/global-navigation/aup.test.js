import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { sendKeys, setViewport } from '@web/test-runner-commands';
import { createFullGlobalNavigation, loadStyles, viewports } from './test-utilities.js';
import { waitForRemoval } from '../../helpers/waitfor.js';
import { getConfig, setConfig, loadScript } from '../../../libs/utils/utils.js';
import {
  AUP_SDK_READY_EVENT, fetchCheckoutLinkConfigs, getAupModalHashCleanup,
  getModalAction, modalState,
} from '../../../libs/blocks/merch/merch.js';
import { getModal as getMiloModal, closeModal } from '../../../libs/blocks/modal/modal.js';
import { getModal as getC2Modal, closeModal as closeC2Modal } from '../../../libs/c2/blocks/modal/modal.js';

describe('AUP', () => {
  let gnav;
  let originalUrl;
  let previousSdk;
  let previousFactory;
  let previousIms;
  let previousLenis;
  let previousConfigs;
  let instance;
  let preload;
  let meta;
  let foundation;
  let workflows;
  let listeners;
  let configurations;
  const scripts = [];
  const dialog = () => document.getElementById('aup-workflow-dialog');
  const listen = (type, handler, options) => {
    window.addEventListener(type, handler, options);
    listeners.push([type, handler]);
  };
  const setSelect = (value) => {
    meta = document.createElement('meta');
    meta.name = 'aup-select';
    meta.content = value;
    document.head.append(meta);
  };
  const createElement = (tag = 'div') => {
    const element = document.createElement(tag);
    if (tag === 'iframe') element.srcdoc = '<html lang="en"><body><p>Workflow</p></body></html>';
    else element.innerHTML = '<button>Continue</button>';
    workflows.push(element);
    return element;
  };
  const initializeHost = async () => {
    preload.restore();
    await gnav.constructor.preloadAupSdk();
    return window.AUPSDK.preloadSDK.firstCall.args[1];
  };
  const createAction = async (hash = 'buy-test') => {
    const element = document.createElement('a');
    element.setAttribute('is', 'checkout-link');
    element.setAttribute('aria-label', 'Buy test subscription');
    configurations.push({
      PRODUCT_FAMILY: hash,
      LOCALE: '',
      BUY_NOW_HASH: hash,
      BUY_NOW_PATH: '/test/aup-select',
    });
    fetchCheckoutLinkConfigs.promise = Promise.resolve({ data: configurations });
    const action = await getModalAction([{
      offerType: 'BASE',
      productArrangement: { productFamily: hash },
    }], { modal: true }, element);
    return { element, action };
  };

  before(async () => {
    previousSdk = window.aupsdk;
    previousFactory = window.AUPSDK;
    previousIms = window.adobeIMS;
    for (const url of [
      'https://auth.services.adobe.com/imslib/imslib.min.js',
      'https://stage.adobeccstatic.com/unav/1.6/UniversalNav.js',
      'https://shared-components.stage.adobe.com/aup-sdk/1.0.756/main.js',
      'https://shared-components.adobe.com/aup-sdk/1.0.756/main.js',
    ]) {
      const script = document.createElement('script');
      script.type = 'javascript/blocked';
      script.src = url;
      script.dataset.loaded = 'true';
      document.head.append(script);
      scripts.push(script);
    }
    gnav = await createFullGlobalNavigation({ signedIn: false });
  });

  beforeEach(async () => {
    originalUrl = window.location.href;
    previousLenis = window.lenis;
    previousConfigs = fetchCheckoutLinkConfigs.promise;
    workflows = [];
    listeners = [];
    configurations = [];
    modalState.isOpen = false;
    gnav.useUniversalNav = false;
    gnav.aupsdkInstancePromise = null;
    setConfig({ codeRoot: '/libs', imsClientId: 'milo', locales: { '': { ietf: 'en-US' } } });
    await setViewport(viewports.desktop);
    window.adobeIMS = { isSignedInUser: sinon.stub().returns(false) };
    instance = { updateConfig: sinon.stub().resolves() };
    window.aupsdk = undefined;
    window.AUPSDK = { preloadSDK: sinon.stub().resolves(instance) };
    preload = sinon.stub(gnav.constructor, 'preloadAupSdk').resolves(instance);
    sinon.stub(gnav, 'decorateUniversalNav').resolves();
    sinon.stub(gnav, 'decorateProfile').resolves();
    sinon.stub(gnav, 'setUpProductCTA').resolves();
  });

  afterEach(async () => {
    listeners.forEach(([type, handler]) => window.removeEventListener(type, handler));
    workflows.forEach((element) => element.dispatchEvent(new Event('close')));
    if (dialog()) await waitForRemoval('#aup-workflow-dialog');
    for (const modal of document.querySelectorAll('.dialog-modal')) await closeModal(modal);
    getAupModalHashCleanup()?.();
    modalState.isOpen = false;
    meta?.remove();
    foundation?.remove();
    foundation = undefined;
    meta = undefined;
    window.history.replaceState(null, '', originalUrl);
    fetchCheckoutLinkConfigs.promise = previousConfigs;
    window.lenis = previousLenis;
    sinon.restore();
  });

  after(() => {
    scripts.forEach((script) => script.remove());
    window.aupsdk = previousSdk;
    window.AUPSDK = previousFactory;
    window.adobeIMS = previousIms;
  });

  describe('SDK initialization', () => {
    [
      ['stage', null, 'stage', 'stage'],
      ['stage', 'PrOd', 'prod', 'stage'],
      ['stage', 'invalid', 'stage', 'stage'],
      ['local', 'PROD', 'prod', 'stage'],
      ['prod', null, 'prod', 'prod'],
      ['prod', 'stage', 'prod', 'prod'],
    ].forEach(([miloEnv, override, environment, cdnEnvironment]) => {
      it(`configures ${miloEnv} with commerce.env=${override}`, async () => {
        sinon.stub(getConfig().env, 'name').value(miloEnv);
        const url = new URL(originalUrl);
        if (override) url.searchParams.set('commerce.env', override);
        else url.searchParams.delete('commerce.env');
        window.history.replaceState(null, '', url);
        const options = await initializeHost();

        expect({
          environment: options.environment,
          cdnEnvironment: options.cdnEnvironment,
        }).to.deep.equal({ environment, cdnEnvironment });
      });
    });

    [
      { name: 'signed-in Universal Nav', signedIn: true, unav: true, expected: true },
      { name: 'signed-in legacy nav', signedIn: true, unav: false, expected: false },
      { name: 'signed-out legacy nav', signedIn: false, unav: false, expected: false },
      { name: 'signed-out Universal Nav', signedIn: false, unav: true, expected: false },
      { name: 'metadata on', unav: false, content: 'on', expected: true },
      { name: 'query on overrides metadata off', unav: true, content: 'off', query: 'on', expected: true },
      { name: 'query off overrides metadata on', unav: false, content: 'on', query: 'off', expected: false },
      { name: 'empty query overrides metadata on', unav: true, content: 'on', query: '', expected: false },
      { name: 'metadata off', unav: true, content: 'off', expected: false },
    ].forEach(({
      name, signedIn = false, unav, content, query, expected,
    }) => {
      it(`eager preload: ${name}`, async () => {
        gnav.useUniversalNav = unav;
        window.adobeIMS.isSignedInUser.returns(signedIn);
        if (content) setSelect(content);
        const url = new URL(originalUrl);
        if (query !== undefined) url.searchParams.set('aup-select', query);
        else url.searchParams.delete('aup-select');
        window.history.replaceState(null, '', url);

        await gnav.imsReady();
        await gnav.aupsdkInstancePromise;

        expect(preload.callCount).to.equal(expected ? 1 : 0);
      });
    });

    it('publishes readiness only after SDK configuration completes', async () => {
      setSelect('on');
      let resolveConfig;
      instance.updateConfig.returns(new Promise((resolve) => { resolveConfig = resolve; }));
      const ready = sinon.spy();
      listen(AUP_SDK_READY_EVENT, ready);
      const initialized = initializeHost();
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(ready.called).to.be.false;

      resolveConfig();
      await initialized;

      expect(ready.calledOnce).to.be.true;
      expect(window.aupsdk === instance).to.be.true;
      expect(instance.updateConfig.firstCall.args[0]).to.deep.equal({ miniAppContext: { features: ['useToasts', 'tmp_aupsdk_ucv3_in_iframe'] } });
    });

    it('requests an IMS profile only while signed in and preserves profile errors', async () => {
      const { getProfile } = await initializeHost();
      const profile = { userId: 'test-user' };
      window.adobeIMS.getProfile = sinon.stub().resolves(profile);
      expect(await getProfile()).to.be.undefined;
      expect(window.adobeIMS.getProfile.called).to.be.false;
      window.adobeIMS.isSignedInUser.returns(true);
      expect(await getProfile()).to.equal(profile);
      const error = new Error('Profile unavailable');
      window.adobeIMS.getProfile.throws(error);
      expect(await getProfile().catch((caught) => caught)).to.equal(error);
      window.adobeIMS = undefined;
      expect(await getProfile()).to.be.undefined;
    });
  });

  describe('dialog lifecycle', () => {
    let host;
    beforeEach(async () => { host = await initializeHost(); });

    it('publishes a recognized, named dialog and one close notification before removal', async () => {
      const events = [];
      listen('milo:modal:loaded', ({ detail }) => events.push({ type: 'loaded', detail, mounted: dialog()?.isConnected }));
      listen('milo:modal:closed', ({ detail }) => events.push({ type: 'closed', detail, present: !!dialog() }));
      const element = createElement();
      const callback = sinon.spy();
      await host.showDialog(element, { title: 'Manage subscription' }, callback);
      expect(document.querySelector('.dialog-modal') === dialog()).to.be.true;
      expect(dialog().tagName).to.equal('DIV');
      expect(dialog().getAttribute('aria-label')).to.equal('Manage subscription');
      expect(events).to.have.lengthOf(1);
      expect(events[0]).to.include({ type: 'loaded', mounted: true });
      expect(events[0].detail.id).to.equal('aup-workflow-dialog');
      element.dispatchEvent(new Event('close'));
      element.dispatchEvent(new Event('close'));
      await waitForRemoval('#aup-workflow-dialog');
      expect(events.map(({ type }) => type)).to.deep.equal(['loaded', 'closed']);
      expect(events[1].present).to.be.true;
      expect(callback.calledOnceWithExactly({ type: 'close' })).to.be.true;
      expect(dialog() === null).to.be.true;
    });

    [
      { name: 'explicit SDK title', options: { title: 'Account settings' }, expected: 'Account settings' },
      { name: 'workflow aria-label', label: 'Manage account', expected: 'Manage account' },
      { name: 'iframe title', tag: 'iframe', title: 'Subscription checkout', expected: 'Subscription checkout' },
    ].forEach(({
      name, tag, options = {}, label, title, expected,
    }) => {
      it(`accessible name: ${name}`, async () => {
        const element = createElement(tag);
        if (label) element.setAttribute('aria-label', label);
        if (title) element.setAttribute('title', title);
        await host.showDialog(element, options, sinon.spy());
        expect(dialog().getAttribute('aria-label')).to.equal(expected);
      });
    });

    it('preserves workflow label references instead of copying their text', async () => {
      const element = createElement();
      element.setAttribute('aria-labelledby', 'workflow-title');
      element.innerHTML = '<h2 id="workflow-title">Your account</h2>';

      await host.showDialog(element, {}, sinon.spy());

      expect(dialog().getAttribute('aria-labelledby')).to.equal('workflow-title');
      expect(dialog().getAttribute('aria-label')).to.be.null;
    });

    it('uses the actual checkout trigger rather than the first matching CTA', async () => {
      const { element: cta, action } = await createAction();
      const decoy = document.createElement('a');
      decoy.dataset.modalId = cta.dataset.modalId;
      decoy.setAttribute('aria-label', 'A different CTA');
      document.body.append(decoy, cta);
      try {
        action.aupHandler({ type: 'open', element: cta });
        const workflow = createElement('iframe');
        workflow.title = 'Workflow iframe';
        await host.showDialog(workflow, {}, sinon.spy());

        expect(dialog().getAttribute('aria-label')).to.equal(cta.getAttribute('aria-label'));
      } finally {
        decoy.remove();
        cta.remove();
      }
    });

    it('uses Milo heading-based naming without adding a separate AUP fallback', async () => {
      const element = createElement();
      element.innerHTML = '<h2>Undeclared workflow heading</h2>';

      await host.showDialog(element, {}, sinon.spy());

      expect(dialog().getAttribute('aria-label')).to.equal('Undeclared workflow heading');
      expect(dialog().getAttribute('aria-labelledby')).to.be.null;
    });

    it('defers app prompts until the Milo modal closes', async () => {
      const { AppPrompt } = await import('../../../libs/features/webapp-prompt/webapp-prompt.js');
      await host.showDialog(createElement(), { title: 'Workflow' }, sinon.spy());
      const prompt = new AppPrompt({ promptPath: '/prompt.html' });
      expect(prompt.initializationQueued).to.be.true;
    });

    ['div', 'iframe'].forEach((tag) => {
      ['escape', 'backdrop', 'workflow-cancel', 'workflow-success'].forEach((method) => {
        it(`${tag} closes once via ${method}`, async () => {
          const element = createElement(tag);
          const cancel = sinon.spy();
          const closed = sinon.spy();
          const callback = sinon.spy();
          element.addEventListener('cancel', cancel);
          element.addEventListener('close', closed);
          const outcome = new Promise((resolve) => {
            element.addEventListener('cancel', () => resolve('cancel'), { once: true });
            element.addEventListener('success', () => resolve('success'), { once: true });
          });
          await host.showDialog(element, { title: 'Workflow' }, callback);
          if (method === 'escape') await sendKeys({ press: 'Escape' });
          else if (method === 'backdrop') document.querySelector('#aup-workflow-dialog + .modal-curtain').click();
          else {
            element.dispatchEvent(new Event(method.replace('workflow-', '')));
            element.dispatchEvent(new Event('close'));
          }
          expect(await outcome).to.equal(method === 'workflow-success' ? 'success' : 'cancel');
          await waitForRemoval('#aup-workflow-dialog');
          expect(cancel.callCount).to.equal(method === 'workflow-success' ? 0 : 1);
          expect(closed.calledOnce).to.be.true;
          expect(callback.calledOnceWithExactly({ type: 'close' })).to.be.true;
          expect(dialog() === null).to.be.true;
          expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
        });
      });
    });

    it('settles replacement and ignores stale events from the removed workflow', async () => {
      const first = createElement();
      const firstCallback = sinon.spy();
      const canceled = sinon.spy();
      first.addEventListener('cancel', canceled);
      await host.showDialog(first, { title: 'Old workflow' }, firstCallback);
      const second = createElement();
      const secondCallback = sinon.spy();
      await host.showDialog(second, { title: 'Current workflow' }, secondCallback);
      const active = dialog();
      expect(canceled.calledOnce).to.be.true;
      expect(firstCallback.calledOnceWithExactly({ type: 'close' })).to.be.true;
      first.dispatchEvent(new Event('close'));
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(firstCallback.calledOnce).to.be.true;
      expect(secondCallback.called).to.be.false;
      expect(dialog() === active).to.be.true;
      expect(active.contains(second)).to.be.true;
    });

    it('does not give an unrelated replacement the previous checkout hash', async () => {
      const { element: cta, action } = await createAction();
      action.aupHandler({ type: 'open', element: cta });
      const firstCallback = sinon.spy();
      await host.showDialog(createElement(), { title: 'Checkout' }, firstCallback);
      const second = createElement();
      const secondCallback = sinon.spy();
      await host.showDialog(second, { title: 'Account settings' }, secondCallback);
      expect(firstCallback.calledOnce).to.be.true;
      expect(secondCallback.called).to.be.false;
      expect(dialog().contains(second)).to.be.true;
      expect(window.location.href).to.equal(originalUrl);
    });

    it('cancels a request superseded during iframe dependency loading', async () => {
      const firstCallback = sinon.spy();
      const first = host.showDialog(createElement('iframe'), { title: 'Old' }, firstCallback);
      const secondElement = createElement();
      const secondCallback = sinon.spy();
      const second = host.showDialog(secondElement, { title: 'Current' }, secondCallback);
      await Promise.all([first, second]);
      expect(firstCallback.calledOnce).to.be.true;
      expect(secondCallback.called).to.be.false;
      expect(dialog().contains(secondElement)).to.be.true;
    });

    it('does not double-close when a workflow handles its own cancellation', async () => {
      const element = createElement();
      element.addEventListener('cancel', () => element.dispatchEvent(new Event('close')));
      const closed = sinon.spy();
      const callback = sinon.spy();
      element.addEventListener('close', closed);
      await host.showDialog(element, { title: 'Workflow' }, callback);
      dialog().querySelector('.dialog-close').click();
      await waitForRemoval('#aup-workflow-dialog');
      expect(closed.calledOnce).to.be.true;
      expect(callback.calledOnce).to.be.true;
    });

    [
      { name: 'C1 close API', close: closeModal },
      { name: 'C2 close API', close: closeC2Modal },
    ].forEach(({ name, close }) => {
      it(`settles and cleans up through ${name}`, async () => {
        const callback = sinon.spy();
        await host.showDialog(createElement(), { title: 'Workflow' }, callback);
        await close(dialog());
        expect(callback.calledOnceWithExactly({ type: 'close' })).to.be.true;
        expect(dialog() === null).to.be.true;
        expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
      });
    });

    it('cleans global navigation and iframe loading listeners on close', async () => {
      const add = sinon.spy(window, 'addEventListener');
      const remove = sinon.spy(window, 'removeEventListener');
      const element = createElement('iframe');
      const addElement = sinon.spy(element, 'addEventListener');
      const removeElement = sinon.spy(element, 'removeEventListener');
      await host.showDialog(element, { title: 'Workflow' }, sinon.spy());
      element.dispatchEvent(new Event('close'));
      await waitForRemoval('#aup-workflow-dialog');
      for (const event of ['popstate', 'hashchange']) {
        const handler = add.withArgs(event).firstCall.args[1];
        expect(remove.calledWith(event, handler)).to.be.true;
      }
      const handler = addElement.withArgs('app_loaded').firstCall.args[1];
      expect(removeElement.calledWith('app_loaded', handler)).to.be.true;
    });

    it('cancels a pending iframe without publishing a false lifecycle event', async () => {
      const loaded = sinon.spy();
      const closed = sinon.spy();
      listen('milo:modal:loaded', loaded);
      listen('milo:modal:closed', closed);
      const callback = sinon.spy();
      const element = createElement('iframe');
      const pending = host.showDialog(element, { title: 'Workflow' }, callback);
      element.dispatchEvent(new Event('close'));
      await pending;

      expect(callback.calledOnce).to.be.true;
      expect(loaded.called).to.be.false;
      expect(closed.called).to.be.false;
      expect(dialog() === null).to.be.true;
      expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
    });

    it('retains the original error when iframe dependencies cannot load', async () => {
      setConfig({ codeRoot: '/missing-aup-dialog-dependencies', imsClientId: 'milo', locales: { '': { ietf: 'en-US' } } });
      window.aupsdk = undefined;
      await gnav.constructor.preloadAupSdk();
      const failingHost = window.AUPSDK.preloadSDK.lastCall.args[1];
      const callback = sinon.spy();
      const error = await failingHost.showDialog(createElement('iframe'), {}, callback).catch((caught) => caught);
      expect(error).to.be.instanceOf(Error);
      expect(callback.called).to.be.false;
      expect(dialog() === null).to.be.true;
      expect(window.location.href).to.equal(originalUrl);
    });
  });

  describe('Milo modal interoperability', () => {
    [
      { name: 'C1', get: getMiloModal, close: closeModal, root: () => document.body },
      { name: 'C2', get: getC2Modal, close: closeC2Modal, root: () => document.documentElement },
    ].forEach(({ name, get, close, root }) => {
      ['aup-first', 'region-first'].forEach((order) => {
        it(`${name} retains scroll ownership when closing ${order}`, async () => {
          foundation = document.createElement('meta');
          foundation.name = 'foundation';
          foundation.content = name === 'C2' ? 'c2' : 'milo';
          document.head.append(foundation);
          const { showDialog } = await initializeHost();
          window.lenis = { stop: sinon.spy(), start: sinon.spy() };
          const region = await get(null, { id: 'locale-modal-v2', content: createElement(), title: 'Choose region' });
          const element = createElement();
          await showDialog(element, { title: 'Checkout' }, sinon.spy());
          expect(dialog().tagName).to.equal('DIV');
          expect(dialog().getAttribute('role')).to.equal('dialog');
          expect(root().classList.contains('disable-scroll')).to.be.true;
          if (order === 'aup-first') {
            element.dispatchEvent(new Event('close'));
            await waitForRemoval('#aup-workflow-dialog');
            expect(root().classList.contains('disable-scroll')).to.be.true;
            expect(region.isConnected).to.be.true;
            expect(window.lenis.start.called).to.be.false;
            await close(region);
          } else {
            await close(region);
            expect(dialog().isConnected).to.be.true;
            expect(root().classList.contains('disable-scroll')).to.be.true;
            expect(window.lenis.start.called).to.be.false;
            element.dispatchEvent(new Event('close'));
            await waitForRemoval('#aup-workflow-dialog');
          }
          expect(document.body.classList.contains('disable-scroll')).to.be.false;
          expect(document.documentElement.classList.contains('disable-scroll')).to.be.false;
          expect(window.lenis.start.calledOnce).to.be.true;
        });
      });

      it(`${name} keeps its region prompt when Escape dismisses the top AUP dialog`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const region = await get(null, { id: 'locale-modal-v2', content: createElement(), title: 'Choose region' });
        const callback = sinon.spy();
        await showDialog(createElement(), { title: 'Checkout' }, callback);
        await sendKeys({ press: 'Escape' });
        await waitForRemoval('#aup-workflow-dialog');
        expect(callback.calledOnce).to.be.true;
        expect(dialog() === null).to.be.true;
        expect(region.isConnected).to.be.true;
      });

      it(`${name} cleans up synchronous closure from a loaded listener`, async () => {
        listen('milo:modal:loaded', ({ detail }) => {
          if (detail.id === 'immediately-closed') document.getElementById(detail.id).querySelector('.dialog-close').click();
        });
        await get(null, { id: 'immediately-closed', content: createElement(), title: 'Workflow' });
        expect(document.getElementById('immediately-closed') === null).to.be.true;
        expect(document.querySelector('.modal-curtain') === null).to.be.true;
        expect(root().classList.contains('disable-scroll')).to.be.false;
      });

      it(`${name} aborts pending modal creation before mounting`, async () => {
        const controller = new AbortController();
        const loaded = sinon.spy();
        listen('milo:modal:loaded', loaded);
        const pending = get(null, {
          id: 'canceled-before-mount',
          content: createElement(),
          signal: controller.signal,
        });
        controller.abort();

        expect(await pending).to.be.null;
        expect(document.getElementById('canceled-before-mount') === null).to.be.true;
        expect(loaded.called).to.be.false;
        expect(root().classList.contains('disable-scroll')).to.be.false;
      });

      [
        { event: 'workflow close', dismiss: (element) => element.dispatchEvent(new Event('close')) },
        {
          event: 'navigation',
          dismiss: () => {
            window.history.replaceState(null, '', originalUrl);
            window.dispatchEvent(new PopStateEvent('popstate'));
          },
        },
      ].forEach(({ event, dismiss }) => {
        it(`${name} cleans up when ${event} occurs during mounting`, async () => {
          foundation = document.createElement('meta');
          foundation.name = 'foundation';
          foundation.content = name === 'C2' ? 'c2' : 'milo';
          document.head.append(foundation);
          const { showDialog } = await initializeHost();
          const { element: cta, action } = await createAction();
          action.aupHandler({ type: 'open', element: cta });
          const element = createElement();
          const callback = sinon.spy();
          const closed = sinon.spy();
          listen('milo:modal:closed', closed);
          listen('milo:modal:loaded', () => dismiss(element), { once: true });

          try {
            await showDialog(element, { title: 'Checkout' }, callback);

            expect(dialog() === null).to.be.true;
            expect(callback.calledOnceWithExactly({ type: 'close' })).to.be.true;
            expect(closed.calledOnce).to.be.true;
            expect(document.querySelector('.modal-curtain') === null).to.be.true;
            expect(root().classList.contains('disable-scroll')).to.be.false;
            expect(window.location.href).to.equal(originalUrl);
          } finally {
            if (dialog()) await close(dialog());
          }
        });
      });

      it(`${name} restores focus to the checkout trigger on close`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const { element: cta, action } = await createAction();
        cta.href = '#buy-test';
        document.body.append(cta);
        cta.focus();
        action.aupHandler({ type: 'open', element: cta });

        try {
          await showDialog(createElement(), { title: 'Checkout' }, sinon.spy());
          expect(dialog().contains(document.activeElement)).to.be.true;

          await close(dialog());

          expect(document.activeElement === cta).to.be.true;
        } finally {
          if (dialog()) await close(dialog());
          cta.remove();
        }
      });

      it(`${name} preserves the SDK title over workflow headings`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const element = createElement();
        element.innerHTML = '<h2>Workflow heading</h2>';

        await showDialog(element, { title: 'Manage subscription' }, sinon.spy());

        expect(dialog().getAttribute('aria-label')).to.equal('Manage subscription');
      });

      it(`${name} handles SDK content readiness during mounting`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const iframe = createElement('iframe');
        listen('milo:modal:loaded', ({ detail }) => {
          if (detail.id === 'aup-workflow-dialog') iframe.dispatchEvent(new Event('app_loaded'));
        });

        await showDialog(iframe, { title: 'Workflow' }, sinon.spy());

        expect(dialog().classList.contains('hide-close-button')).to.be.true;
        expect(dialog().querySelector('sp-progress-circle')).to.be.null;
      });

      it(`${name} settles repeated close requests once`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const callback = sinon.spy();
        const closed = sinon.spy();
        listen('milo:modal:closed', closed);
        await showDialog(createElement(), { title: 'Workflow' }, callback);
        const modal = dialog();

        await Promise.all([close(modal), close(modal)]);

        expect(callback.calledOnce).to.be.true;
        expect(closed.calledOnce).to.be.true;
        expect(dialog() === null).to.be.true;
      });

      it(`${name} removes its modal even when the SDK close callback throws`, async () => {
        foundation = document.createElement('meta');
        foundation.name = 'foundation';
        foundation.content = name === 'C2' ? 'c2' : 'milo';
        document.head.append(foundation);
        const { showDialog } = await initializeHost();
        const error = new Error('SDK callback failed');
        await showDialog(createElement(), { title: 'Workflow' }, () => { throw error; });

        const rejection = await close(dialog()).catch((caught) => caught);

        expect(rejection).to.equal(error);
        expect(dialog() === null).to.be.true;
        expect(document.querySelector('.modal-curtain') === null).to.be.true;
        expect(root().classList.contains('disable-scroll')).to.be.false;
      });
    });
  });

  describe('hash navigation', () => {
    ['', '#category=photo', '#other-section'].forEach((previousHash) => {
      it(`cancels and restores ${previousHash || 'the unfiltered URL'}`, async () => {
        const { showDialog } = await initializeHost();
        const { element: cta, action } = await createAction();
        const url = new URL(originalUrl);
        url.hash = previousHash;
        window.history.replaceState(null, '', url);
        action.aupHandler({ type: 'open', element: cta });
        const callback = sinon.spy();
        const element = createElement();
        const cancel = sinon.spy();
        element.addEventListener('cancel', cancel);
        await showDialog(element, {}, callback);
        const navigated = new Promise((resolve) => { listen('hashchange', resolve, { once: true }); });
        if (previousHash === '#other-section') window.location.hash = previousHash;
        else window.history.back();
        await navigated;
        await waitForRemoval('#aup-workflow-dialog');
        expect(window.location.href).to.equal(url.href);
        expect(dialog() === null).to.be.true;
        expect(cancel.calledOnce).to.be.true;
        expect(callback.calledOnce).to.be.true;
        window.dispatchEvent(new PopStateEvent('popstate'));
        expect(callback.calledOnce).to.be.true;
      });
    });

    it('reopens exactly once through repeated Back/Forward transitions', async () => {
      const { showDialog } = await initializeHost();
      const { element: cta, action } = await createAction();
      document.body.append(cta);
      let shown;
      cta.addEventListener('click', (event) => {
        event.preventDefault();
        action.aupHandler({ type: 'open', element: cta });
        shown = showDialog(createElement(), {}, sinon.spy());
      });
      const clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      try {
        const url = new URL(originalUrl);
        url.hash = '';
        window.history.replaceState(null, '', url);
        cta.click();
        await shown;
        for (const direction of ['back', 'forward', 'back', 'forward']) {
          const navigated = new Promise((resolve) => { listen('hashchange', resolve, { once: true }); });
          window.history[direction]();
          await navigated;
          if (direction === 'back') {
            await waitForRemoval('#aup-workflow-dialog');
            expect(window.location.href).to.equal(url.href);
            expect(dialog() === null).to.be.true;
          } else {
            await shown;
            expect(window.location.hash).to.equal('#buy-test');
            expect(document.querySelectorAll('.dialog-modal.aup-modal').length).to.equal(1);
            await clock.tickAsync(1000);
          }
        }
      } finally {
        clock.restore();
        cta.remove();
      }
    });
  });

  it('keeps the loader and close button until the SDK reports its content is ready', async () => {
    await loadStyles('/libs/blocks/modal/modal.css');
    const { showDialog } = await initializeHost();
    const iframe = createElement('iframe');
    await showDialog(iframe, { title: 'Workflow' }, sinon.spy());
    const active = dialog();
    const close = active.querySelector('.dialog-close');
    expect(!!active.querySelector('sp-progress-circle')).to.be.true;
    expect(getComputedStyle(iframe).visibility).to.equal('hidden');
    expect(getComputedStyle(close).display).not.to.equal('none');

    iframe.dispatchEvent(new Event('load'));

    expect(!!active.querySelector('sp-progress-circle')).to.be.true;
    expect(getComputedStyle(iframe).visibility).to.equal('hidden');
    expect(getComputedStyle(close).display).not.to.equal('none');

    iframe.dispatchEvent(new Event('app_loaded'));

    expect(active.querySelector('sp-progress-circle') === null).to.be.true;
    expect(getComputedStyle(iframe).visibility).to.equal('visible');
    expect(getComputedStyle(close).display).to.equal('none');
  });

  [
    { name: 'desktop', viewport: viewports.desktop },
    { name: 'mobile', viewport: { width: 390, height: 844 } },
  ].forEach(({ name, viewport }) => {
    it(`fits the ${name} viewport and exposes a valid accessible dialog name`, async () => {
      const { showDialog } = await initializeHost();
      await setViewport(viewport);
      await showDialog(createElement(), { title: 'Manage subscription' }, sinon.spy());
      const bounds = dialog().getBoundingClientRect();
      expect(bounds.width).to.be.at.most(viewport.width);
      expect(bounds.height).to.be.at.most(viewport.height);
      expect(bounds.x).to.be.at.least(0);
      expect(bounds.y).to.be.at.least(0);
      await loadScript('/libs/deps/axe.min.js');
      const results = await window.axe.run(dialog(), {
        runOnly: {
          type: 'rule',
          values: ['aria-dialog-name', 'aria-allowed-attr', 'aria-valid-attr-value'],
        },
      });
      expect(results.violations.map(({ id }) => id)).to.deep.equal([]);
    });
  });
});
