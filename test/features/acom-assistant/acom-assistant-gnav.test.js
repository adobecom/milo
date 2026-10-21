import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { getAcomAssistantGnavFabState, decorateNavWithAssistant } from '../../../libs/features/acom-assistant-gnav.js';

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
describe('decorateNavWithAssistant BC-GNav-shown analytics', () => {
  const metas = [];
  let matchMediaStub;

  const getCustom = () => window.alloy_all?.data?._adobe_corpnew?.event?.custom ?? [];
  const countProp = (name) => getCustom().filter((e) => e.propertyName === name).length;
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
    setDesktop(true);
  });

  afterEach(() => {
    metas.splice(0).forEach((meta) => meta.remove());
    matchMediaStub?.restore();
    matchMediaStub = null;
    delete window.alloy_all;
  });

  it('waits for the client to render into the mount before setting BC-GNav-shown', async () => {
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);

    renderClientUi(nav);
    await flush();
    expect(getCustom()).to.deep.include({ propertyName: 'BC-GNav-shown', propertyValue: 'true', propertyType: 'string' });
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

  it('sets the property immediately if the mount is already rendered', () => {
    const nav = buildNav();
    const mount = document.createElement('div');
    mount.id = 'acomAssistant-gnav-mount';
    mount.innerHTML = clientMarkup;
    nav.querySelector('.feds-bc-wrapper').append(mount);
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('does not duplicate the property on repeated calls or renders', async () => {
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

  it('keeps BC-Inline-shown alongside BC-GNav-shown', async () => {
    window.alloy_all = { data: { _adobe_corpnew: { event: { custom: [{ propertyName: 'BC-Inline-shown', propertyValue: 'true', propertyType: 'string' }] } } } };
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(countProp('BC-Inline-shown')).to.equal(1);
    expect(countProp('BC-GNav-shown')).to.equal(1);
  });

  it('does not set the property when the GNav state is hidden', async () => {
    addMeta('gnav-brand-concierge-state', 'hidden');
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, document.createElement('div'));
    renderClientUi(nav);
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not set the property without a feds-bc-wrapper', async () => {
    decorateNavWithAssistant(null, buildNav(false), document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not set the property on mobile when no-gnav-mobile is authored', async () => {
    setDesktop(false);
    const block = document.createElement('div');
    block.className = 'no-gnav-mobile';
    const nav = buildNav();
    decorateNavWithAssistant(null, nav, block);
    await flush();
    expect(nav.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });

  it('does not set the property when acom-assistant is off', async () => {
    metas.splice(0).forEach((meta) => meta.remove());
    decorateNavWithAssistant(null, buildNav(), document.createElement('div'));
    await flush();
    expect(countProp('BC-GNav-shown')).to.equal(0);
  });
});
