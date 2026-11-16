import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import {
  getAcomAssistantGnavFabState,
  decorateNavWithAssistant,
  decorateAcomAssistantGnav,
} from '../../../libs/features/acom-assistant-gnav.js';

describe('getAcomAssistantGnavFabState', () => {
  let meta;

  beforeEach(() => {
    meta = document.createElement('meta');
    meta.name = 'gnav-brand-concierge-state';
  });

  afterEach(() => meta.remove());

  const setState = (content) => {
    meta.content = content;
    document.head.append(meta);
  };

  it('is undefined without metadata', () => {
    expect(getAcomAssistantGnavFabState()).to.be.undefined;
  });

  it('returns normalized collapsed and hidden values', () => {
    setState(' Collapsed ');
    expect(getAcomAssistantGnavFabState()).to.equal('collapsed');
    setState('HIDDEN');
    expect(getAcomAssistantGnavFabState()).to.equal('hidden');
  });

  it('is undefined for normal, empty or unknown values', () => {
    for (const value of ['normal', '', 'minimized']) {
      setState(value);
      expect(getAcomAssistantGnavFabState()).to.be.undefined;
    }
  });
});

/* eslint-disable no-underscore-dangle */
describe('acom-assistant GNav BC-GNav-shown analytics', () => {
  const metas = [];
  let matchMediaStub;

  let trackStub;
  const getCustom = () => window.alloy_all?.data?._adobe_corpnew?.event?.custom ?? [];
  const gnavShownCalls = () => (trackStub?.getCalls() ?? []).filter(
    (call) => call.args[1]?.data?.web?.webInteraction?.name === 'BC-GNav-shown',
  );
  const countProp = (name) => (name === 'BC-GNav-shown'
    ? gnavShownCalls().length
    : getCustom().filter((e) => e.propertyName === name).length);
  const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });
  const addMeta = (name, content) => {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.append(meta);
    metas.push(meta);
    return meta;
  };
  const buildNav = (withWrapper = true) => {
    const nav = document.createElement('nav');
    if (withWrapper) nav.innerHTML = '<div class="feds-bc-wrapper"></div>';
    return nav;
  };
  const clientMarkup = '<div class="acomAssistantGnavRoot"><div class="acomAssistantGnavInput" role="button"></div></div>';
  const renderClientUi = (nav) => nav.querySelector('#acomAssistant-gnav-mount')
    .insertAdjacentHTML('beforeend', clientMarkup);
  const setDesktop = (matches) => {
    matchMediaStub?.restore();
    matchMediaStub = stub(window, 'matchMedia').returns({ matches });
  };

  beforeEach(() => {
    addMeta('acom-assistant', 'on');
    delete window.alloy_all;
    trackStub = stub();
    window._satellite = { track: trackStub };
    setDesktop(true);
  });

  afterEach(() => {
    metas.splice(0).forEach((meta) => meta.remove());
    matchMediaStub?.restore();
    matchMediaStub = null;
    delete window.alloy_all;
    delete window._satellite;
  });

  it('sends a BC-GNav-shown event once the client renders into the mount', async () => {
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);

    renderClientUi(nav);
    await flush();
    expect(trackStub.calledOnce).to.be.true;
    const [type, payload] = trackStub.firstCall.args;
    expect(type).to.equal('event');
    expect(payload.data.web.webInteraction.name).to.equal('BC-GNav-shown');
    expect(payload.data._adobe_corpnew.event.custom).to.deep.equal([
      { propertyName: 'BC-GNav-shown', propertyValue: 'true', propertyType: 'string' },
    ]);
  });

  it('does not add BC-GNav-shown to the page-load data', async () => {
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(getCustom().some((e) => e.propertyName === 'BC-GNav-shown')).to.be.false;
  });

  it('waits for analytics to load before sending the event', async () => {
    delete window._satellite;
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(trackStub.called).to.be.false;

    window._satellite = { track: trackStub };
    window.dispatchEvent(new Event('alloy_sendEvent'));
    window.dispatchEvent(new Event('alloy_sendEvent'));
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('tracks the C2 path that calls decorateAcomAssistantGnav directly', async () => {
    const nav = buildNav();
    decorateAcomAssistantGnav(nav);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);

    renderClientUi(nav);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('waits for the entry point, not just the client root', async () => {
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    const mount = nav.querySelector('#acomAssistant-gnav-mount');
    const root = document.createElement('div');
    root.className = 'acomAssistantGnavRoot';
    mount.append(root);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);

    root.insertAdjacentHTML('beforeend', '<div class="acomAssistantGnavInput" role="button"></div>');
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('counts the entry point in its collapsed state (acomAssistantGnavHidden class)', async () => {
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    nav.querySelector('#acomAssistant-gnav-mount').innerHTML = '<div class="acomAssistantGnavRoot"><div class="acomAssistantGnavInput" role="button"></div><div class="acomAssistantGnavPrompts acomAssistantGnavHidden"></div></div>';
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('sends the event immediately if the mount is already rendered', () => {
    const nav = buildNav();
    const mount = document.createElement('div');
    mount.id = 'acomAssistant-gnav-mount';
    mount.innerHTML = clientMarkup;
    nav.querySelector('.feds-bc-wrapper').append(mount);
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('does not send duplicate events on repeated calls or renders', async () => {
    const nav = buildNav();
    const block = document.createElement('div');
    decorateNavWithAssistant(null, nav, block);
    decorateNavWithAssistant(null, nav, block);
    renderClientUi(nav);
    await flush();
    renderClientUi(nav);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('leaves BC-Inline-shown in the page-load data untouched', async () => {
    window.alloy_all = { data: { _adobe_corpnew: { event: { custom: [{ propertyName: 'BC-Inline-shown', propertyValue: 'true', propertyType: 'string' }] } } } };
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(countProp('BC-Inline-shown')).to.equal(1);
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('does not send the event when the GNav state is hidden', async () => {
    addMeta('gnav-brand-concierge-state', 'hidden');
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not send the event without a feds-bc-wrapper', async () => {
    decorateNavWithAssistant(null, buildNav(false), document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not send the event on mobile when no-gnav-mobile is authored', async () => {
    setDesktop(false);
    const block = document.createElement('div');
    block.className = 'no-gnav-mobile';
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, block);
    await flush();
    expect(nav.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not send the event when acom-assistant is off', async () => {
    metas.splice(0).forEach((meta) => meta.remove());
    decorateNavWithAssistant(null, buildNav(), document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });
});
