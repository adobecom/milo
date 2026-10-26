/* eslint-disable no-underscore-dangle */
import { readFile, sendKeys, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import { getConfig, setConfig } from '../../../libs/utils/utils.js';
import init, { filterLang, isIetfMatchForPrefix } from '../../../libs/blocks/market-selector/market-selector.js';
import { setupFooterKeyboardNav } from '../../../libs/c2/blocks/global-footer/footer-keyboard-navigation.js';

const mockMarketsJson = {
  data: [
    { marketCode: 'us', en: 'United States' },
    { marketCode: 'gb', en: 'United Kingdom' },
    { marketCode: 'de', en: 'Germany' },
  ],
};

function setupFetchStub() {
  return sinon.stub(window, 'fetch').callsFake((url, options) => {
    const href = typeof url === 'string' ? url : url?.url || '';
    if (options?.method === 'HEAD') {
      return Promise.resolve({ ok: true, status: 200 });
    }
    if (href.includes('/federal/assets/markets.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMarketsJson),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
}

describe('Market selector block', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: {
        '': { ietf: 'en-US' },
        de: { ietf: 'de-DE' },
      },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb,de',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de,at',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    const block = document.querySelector('.market-selector');
    await init(block);
    await new Promise((r) => { setTimeout(r, 0); });
  });

  it('renders language and market dropdowns inside the wrapper', () => {
    const wrapper = document.querySelector('.market-selector-wrapper');
    expect(wrapper).to.exist;
    const dropdowns = document.querySelectorAll('.market-selector-dropdown');
    expect(dropdowns.length).to.equal(2);
    expect(document.querySelector('.market-selector-button span')).to.exist;
  });

  it('retains the C1 selector when the page has a C2 footer override', async () => {
    const metadata = document.createElement('meta');
    metadata.name = 'footer-foundation';
    metadata.content = 'c2';
    document.head.append(metadata);
    try {
      const block = document.querySelector('.market-selector');
      await init(block);
      expect(block.querySelector('.market-selector-dropdown')).to.exist;
    } finally {
      metadata.remove();
    }
  });

  it('offers listener cleanup for the C2 footer lifecycle', async () => {
    const block = document.querySelector('.market-selector');
    const onCleanup = sinon.spy();
    await init(block, { onCleanup, focusOnPointerOpen: false, routeWheelToList: true });
    expect(onCleanup.calledOnce).to.equal(true);
    block.querySelector('.market-selector-button').click();
    const popover = block.querySelector('.market-selector-popover');
    const wheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
    popover.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).to.equal(true);
    const remove = sinon.spy(document, 'removeEventListener');
    onCleanup.firstCall.args[0]();
    expect(remove.withArgs('click').callCount).to.equal(2);
    expect(remove.withArgs('keydown', sinon.match.func, true).callCount).to.equal(2);
    const afterCleanup = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
    popover.dispatchEvent(afterCleanup);
    expect(afterCleanup.defaultPrevented).to.equal(false);
  });

  it('leaves C1 wheel scrolling to the browser', () => {
    const block = document.querySelector('.market-selector');
    block.querySelector('.market-selector-button').click();
    const wheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
    block.querySelector('.market-selector-popover').dispatchEvent(wheel);
    expect(wheel.defaultPrevented).to.equal(false);
  });

  it('styles the existing controls only in a C2 footer', async () => {
    const block = document.querySelector('.market-selector');
    getConfig().marketsConfig.languages.data.push(...Array.from({ length: 12 }, (_, index) => ({
      prefix: `test-${index}`,
      nativeName: `Language ${index}`,
      supportedRegions: 'us',
      defaultMarket: 'us',
    })));
    const onCleanup = sinon.spy();
    await init(block, { onCleanup, focusOnPointerOpen: false, routeWheelToList: true });
    const footer = document.createElement('footer');
    footer.className = 'global-footer';
    footer.style.setProperty('--s2a-spacing-xs', '8px');
    footer.style.setProperty('--s2a-color-transparent-white-64', 'rgb(255 255 255 / 64%)');
    footer.style.setProperty('--s2a-color-gray-25', '#fff');
    footer.style.setProperty('--s2a-color-content-knockout', '#fff');
    block.replaceWith(footer);
    footer.append(block);
    const c1Footer = footer.cloneNode(true);
    const c1Popover = c1Footer.querySelector('.market-selector-popover');
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/market-selector/market-selector.css' });
    const foundation = document.createElement('meta');
    foundation.name = 'foundation';
    foundation.content = 'c1';
    const footerFoundation = document.createElement('meta');
    footerFoundation.name = 'footer-foundation';
    footerFoundation.content = 'c2';
    const popover = block.querySelector('.market-selector-popover');
    const list = popover.querySelector('.market-selector-list');
    const [languageButton, marketButton] = block.querySelectorAll('.market-selector-button');
    const globe = languageButton.querySelector('.market-selector-globe');
    languageButton.style.transition = 'none';
    marketButton.style.transition = 'none';
    try {
      document.head.append(style, foundation);
      document.body.append(c1Footer);
      expect(getComputedStyle(popover).position).to.equal('static');
      expect(getComputedStyle(popover).overflowY).to.equal('visible');
      expect(getComputedStyle(languageButton).color).to.equal('rgb(80, 80, 80)');
      expect(getComputedStyle(languageButton).opacity).to.equal('1');
      foundation.content = 'c2';
      expect(getComputedStyle(popover).position).to.equal('static');
      expect(getComputedStyle(c1Popover).position).to.equal('static');
      block.classList.add('market-selector-c2');
      expect(getComputedStyle(popover).position).not.to.equal('static');
      expect(getComputedStyle(c1Popover).position).to.equal('static');
      foundation.content = 'c1';
      document.head.append(footerFoundation);
      expect(getComputedStyle(popover).position).not.to.equal('static');
      expect(getComputedStyle(c1Popover).position).to.equal('static');
      expect(block.querySelectorAll('.market-selector-dropdown')).to.have.length(2);
      expect(getComputedStyle(popover).display).to.equal('none');
      expect(getComputedStyle(languageButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(languageButton).opacity).to.equal('0.6');
      expect(getComputedStyle(marketButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(marketButton).opacity).to.equal('0.6');
      expect(getComputedStyle(globe).display).to.equal('none');
      block.querySelectorAll('.market-selector-popover').forEach((dropdownPopover) => {
        expect(getComputedStyle(dropdownPopover).overflowY).to.equal('hidden');
        expect(getComputedStyle(dropdownPopover).overscrollBehaviorY).to.equal('contain');
        expect(getComputedStyle(dropdownPopover.querySelector('.market-selector-list')).overflowY).to.equal('auto');
      });
      expect(getComputedStyle(list).maxHeight).to.equal('292px');
      expect(getComputedStyle(list).scrollbarWidth).to.equal('thin');
      expect(getComputedStyle(list).touchAction).to.equal('pan-y');
      expect(getComputedStyle(list).paddingInlineEnd).to.equal('8px');
      footer.dir = 'rtl';
      expect(getComputedStyle(list).paddingLeft).to.equal('8px');
      footer.dir = 'ltr';
      languageButton.click();
      expect(getComputedStyle(popover).display).to.equal('block');
      expect(getComputedStyle(languageButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(languageButton).opacity).to.equal('1');
      expect(getComputedStyle(marketButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(marketButton).opacity).to.equal('0.6');
      expect(getComputedStyle(globe).display).to.equal('none');
      expect(list.querySelectorAll('.market-selector-link').length).to.equal(14);
      expect(list.scrollHeight).to.be.greaterThan(list.clientHeight);
      const option = list.querySelector('.market-selector-link');
      expect(list.getBoundingClientRect().right - option.getBoundingClientRect().right)
        .to.be.at.least(8);
      const footerWheel = sinon.spy();
      footer.addEventListener('wheel', footerWheel);
      list.scrollTop = list.scrollHeight;
      expect(list.scrollTop).to.be.greaterThan(0);
      list.scrollTop = 0;
      const searchWheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
      popover.querySelector('.market-selector-search').dispatchEvent(searchWheel);
      expect(searchWheel.defaultPrevented).to.equal(true);
      expect(list.scrollTop).to.be.greaterThan(0);
      expect(footerWheel.called).to.equal(false);
      const scrolled = list.scrollTop;
      const listWheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
      list.querySelector('.market-selector-link').dispatchEvent(listWheel);
      expect(listWheel.defaultPrevented).to.equal(false);
      expect(list.scrollTop).to.equal(scrolled);
      expect(footerWheel.called).to.equal(false);
      popover.querySelector('.market-selector-search').dispatchEvent(new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 100000,
      }));
      expect(list.scrollTop).to.be.closeTo(list.scrollHeight - list.clientHeight, 1);
      popover.querySelector('.market-selector-search').dispatchEvent(new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: -100000,
      }));
      expect(list.scrollTop).to.equal(0);
      const lineWheel = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        deltaY: 3,
        deltaMode: WheelEvent.DOM_DELTA_LINE,
      });
      popover.querySelector('.market-selector-search').dispatchEvent(lineWheel);
      expect(list.scrollTop).to.equal(48);
      const zoomWheel = new WheelEvent('wheel', {
        bubbles: true,
        cancelable: true,
        ctrlKey: true,
        deltaY: 80,
      });
      list.dispatchEvent(zoomWheel);
      expect(zoomWheel.defaultPrevented).to.equal(false);
      expect(list.scrollTop).to.equal(48);
      expect(footerWheel.calledOnce).to.equal(true);

      const outsideWheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
      block.querySelector('.market-selector-button').dispatchEvent(outsideWheel);
      expect(outsideWheel.defaultPrevented).to.equal(false);
      expect(footerWheel.calledTwice).to.equal(true);

      marketButton.click();
      expect(getComputedStyle(languageButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(languageButton).opacity).to.equal('0.6');
      expect(getComputedStyle(marketButton).color).to.equal('rgb(255, 255, 255)');
      expect(getComputedStyle(marketButton).opacity).to.equal('1');
      expect(getComputedStyle(globe).display).to.equal('none');
      const marketPopover = block.querySelectorAll('.market-selector-popover')[1];
      const marketWheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 80 });
      marketPopover.querySelector('.market-selector-search').dispatchEvent(marketWheel);
      expect(marketWheel.defaultPrevented).to.equal(true);
      expect(footerWheel.calledTwice).to.equal(true);
    } finally {
      onCleanup.firstCall.args[0]();
      style.remove();
      foundation.remove();
      footerFoundation.remove();
      c1Footer.remove();
    }
  });

  it('orders C2 market selector footer options on a C1 page', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const pageFoundation = document.createElement('meta');
    pageFoundation.name = 'foundation';
    pageFoundation.content = 'c1';
    let footer;
    let styleUrl;
    try {
      document.head.append(pageFoundation);
      await setViewport({ width: 1440, height: 900 });
      setConfig({ ...getConfig(), codeRoot: '/libs' });
      const { default: initFooter } = await import('../../../libs/c2/blocks/global-footer/global-footer.js');
      const footerElement = document.createElement('footer');
      footerElement.className = 'global-footer';
      const observer = sinon.stub(window, 'IntersectionObserver').returns({
        observe() {},
        disconnect() {},
      });
      const timeout = sinon.stub(window, 'setTimeout').returns(0);
      try {
        footer = initFooter(footerElement);
      } finally {
        observer.restore();
        timeout.restore();
      }

      const selector = document.createElement('div');
      selector.className = 'market-selector';
      selector.innerHTML = '<p>Search Language</p><p>Search Market</p><p>No language results</p><p>No market results</p>';
      footer.body = document.createElement('div');
      footer.body.append(selector);
      styleUrl = `${getConfig().base}/blocks/market-selector/market-selector.css`;
      expect(await footer.decorateRegionPicker()).to.equal(selector);
      expect(selector.classList.contains('market-selector-c2')).to.equal(true);
      const options = document.createElement('div');
      options.className = 'feds-footer-options';
      const legal = document.createElement('div');
      legal.className = 'feds-footer-miscLinks-legal';
      const social = document.createElement('ul');
      social.className = 'feds-social';
      options.append(selector, legal, social);
      footer.elements.footer = document.createElement('div');
      footer.elements.footer.append(options);
      footerElement.append(footer.elements.footer);
      document.body.append(footerElement);
      expect(getComputedStyle(selector.querySelector('.market-selector-popover')).position).to.equal('absolute');
      footer.initFooterOptionsOrderSync();
      expect(footer.footerOrderMediaQuery.media).to.equal('(max-width: 1439px)');
      expect([...options.children]).to.deep.equal([selector, legal, social]);
      await setViewport({ width: 1426, height: 900 });
      await new Promise(requestAnimationFrame);
      expect(footer.isFooterMobileLayout()).to.equal(false);
      expect([...options.children]).to.deep.equal([selector, social, legal]);
      await setViewport({ width: 1440, height: 900 });
      await new Promise(requestAnimationFrame);
      expect([...options.children]).to.deep.equal([selector, legal, social]);
      footerElement.classList.add('mobile');
      footer.syncFooterOptionsOrder();
      expect([...options.children]).to.deep.equal([selector, social, legal]);
      footerElement.classList.remove('mobile');
      footer.syncFooterOptionsOrder();
      expect([...options.children]).to.deep.equal([selector, legal, social]);
      selector.classList.remove('market-selector-c2');
      await setViewport({ width: 1426, height: 900 });
      footer.syncFooterOptionsOrder();
      expect([...options.children]).to.deep.equal([selector, legal, social]);
    } finally {
      footer?.destroy();
      if (styleUrl) document.head.querySelector(`link[href="${styleUrl}"]`)?.remove();
      pageFoundation.remove();
      await setViewport(originalViewport);
    }
  });

  it('stacks C2 mobile selectors, social links, and legal links without affecting other footers', async () => {
    const block = document.querySelector('.market-selector');
    const footer = document.createElement('footer');
    footer.className = 'global-footer mobile';
    block.classList.add('market-selector-c2');
    footer.style.setProperty('--s2a-spacing-2xs', '4px');
    footer.style.setProperty('--s2a-spacing-xs', '8px');
    footer.style.setProperty('--s2a-spacing-md', '16px');
    footer.style.setProperty('--s2a-spacing-lg', '24px');
    footer.style.setProperty('--s2a-blur-24', '24px');
    footer.style.setProperty('--s2a-typography-font-size-caption', '12px');
    footer.style.setProperty('--s2a-typography-line-height-caption', '16px');
    footer.style.setProperty('--s2a-typography-font-size-body-md', '16px');
    footer.style.setProperty('--s2a-typography-line-height-body-md', '20px');
    const options = document.createElement('div');
    options.className = 'feds-footer-options';
    const social = document.createElement('ul');
    social.className = 'feds-social';
    social.style.width = '120px';
    social.style.height = '20px';
    const legal = document.createElement('div');
    legal.className = 'feds-footer-miscLinks-legal';
    legal.style.height = '60px';
    block.replaceWith(footer);
    footer.append(options);
    options.append(block, social, legal);
    const style = document.createElement('style');
    style.textContent = `${await readFile({ path: '../../../libs/c2/blocks/global-footer/global-footer.css' })}
      ${await readFile({ path: '../../../libs/blocks/market-selector/market-selector.css' })}`;
    const foundation = document.createElement('meta');
    foundation.name = 'footer-foundation';
    foundation.content = 'c2';
    const initialViewport = { width: window.innerWidth, height: window.innerHeight };
    const expectSocialOnSelectorRow = () => {
      const regionBounds = block.getBoundingClientRect();
      const socialBounds = social.getBoundingClientRect();
      expect(socialBounds.left).to.be.at.least(regionBounds.right - 1);
      expect(socialBounds.right).to.be.at.most(options.getBoundingClientRect().right + 1);
      expect(legal.scrollWidth).to.be.at.most(legal.clientWidth + 1);
      expect(socialBounds.top).to.be.lessThan(regionBounds.bottom + 1);
      expect(socialBounds.bottom).to.be.greaterThan(regionBounds.top - 1);
    };
    try {
      document.head.append(style, foundation);
      [272, 327, 364, 720].forEach((width) => {
        footer.style.width = `${width}px`;
        expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region" "social" "legal"');
        const wrapperStyle = getComputedStyle(block.querySelector('.market-selector-wrapper'));
        expect(wrapperStyle.flexWrap).to.equal('nowrap');
        expect(wrapperStyle.gap).to.equal('24px');
        const [language, market] = block.querySelectorAll('.market-selector-button');
        expect(getComputedStyle(language.querySelector('.market-selector-globe')).display).to.equal('none');
        expect(getComputedStyle(language).gap).to.equal('5px');
        expect(getComputedStyle(market).gap).to.equal('5px');
        expect(getComputedStyle(language).fontSize).to.equal('12px');
        expect(getComputedStyle(language).lineHeight).to.equal('16px');
        expect(getComputedStyle(market).fontSize).to.equal('12px');
        const caret = getComputedStyle(language, '::after');
        expect(caret.width).to.equal('6px');
        expect(caret.height).to.equal('16px');
        expect(caret.borderStyle).to.equal('none');
        expect(caret.clipPath).to.not.equal('none');
        expect(language.getBoundingClientRect().width)
          .to.be.closeTo(language.querySelector('span').getBoundingClientRect().width + 11, 1);
        expect(getComputedStyle(block.querySelector('.market-selector-popover .market-selector-link')).fontSize)
          .to.equal('16px');
        const regionBounds = block.getBoundingClientRect();
        expect(language.getBoundingClientRect().left).to.be.at.least(regionBounds.left - 1);
        expect(language.getBoundingClientRect().right).to.be.at.most(regionBounds.right + 1);
        expect(market.getBoundingClientRect().right).to.be.at.most(regionBounds.right + 1);
        expect(social.getBoundingClientRect().top).to.be.greaterThan(regionBounds.bottom);
        expect(legal.getBoundingClientRect().top)
          .to.be.greaterThan(Math.max(regionBounds.bottom, social.getBoundingClientRect().bottom));
      });
      footer.classList.remove('mobile');
      await setViewport({ width: 412, height: 968 });
      footer.style.width = '364px';
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region" "social" "legal"');
      const wrapper = block.querySelector('.market-selector-wrapper');
      expect(getComputedStyle(wrapper).flexWrap).to.equal('nowrap');
      expect(getComputedStyle(wrapper).gap).to.equal('24px');
      expect(getComputedStyle(wrapper).paddingTop).to.equal('0px');
      expect(getComputedStyle(wrapper).paddingBottom).to.equal('0px');
      expect(getComputedStyle(wrapper).marginBottom).to.equal('0px');
      expect(getComputedStyle(block.querySelector('.market-selector-globe')).display).to.equal('none');
      expect(getComputedStyle(block.querySelector('.market-selector-button')).gap).to.equal('5px');
      expect(block.querySelectorAll('.market-selector-button')[1].getBoundingClientRect().right)
        .to.be.at.most(block.getBoundingClientRect().right + 1);
      expect(social.getBoundingClientRect().top)
        .to.be.greaterThan(block.getBoundingClientRect().bottom);
      await setViewport({ width: 600, height: 900 });
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region" "social" "legal"');
      expect(getComputedStyle(wrapper).gap).to.equal('24px');
      expect(getComputedStyle(block.querySelector('.market-selector-popover')).position).to.equal('fixed');
      expect(getComputedStyle(wrapper).paddingBottom).to.equal('0px');
      expect(getComputedStyle(wrapper).marginBottom).to.equal('0px');
      block.classList.remove('market-selector-c2');
      expect(getComputedStyle(wrapper).paddingTop).to.equal('7px');
      expect(getComputedStyle(wrapper).gap).to.equal('16px');
      expect(getComputedStyle(wrapper).marginBottom).to.equal('4px');
      expect(getComputedStyle(block.querySelector('.market-selector-button')).gap).to.equal('8px');
      expect(getComputedStyle(block.querySelector('.market-selector-button'), '::after').clipPath)
        .to.equal('none');
      block.classList.add('market-selector-c2');
      await setViewport({ width: 601, height: 900 });
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region" "social" "legal"');
      expect(getComputedStyle(block.querySelector('.market-selector-wrapper')).flexWrap).to.equal('nowrap');
      expect(getComputedStyle(wrapper).gap).to.equal('24px');
      expect(getComputedStyle(block.querySelector('.market-selector-popover')).position).to.equal('absolute');
      expect(getComputedStyle(block.querySelector('.market-selector-button')).fontSize).to.equal('12px');
      expect(getComputedStyle(block.querySelector('.market-selector-button')).gap).to.equal('5px');
      await setViewport({ width: 767, height: 1024 });
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region" "social" "legal"');
      expect(social.getBoundingClientRect().top)
        .to.be.greaterThan(block.getBoundingClientRect().bottom);
      await setViewport({ width: 768, height: 1024 });
      footer.style.width = '720px';
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region social" "legal legal"');
      expectSocialOnSelectorRow();
      legal.style.height = 'auto';
      legal.textContent = [
        '© 2026 Adobe Inc. Adobe. All rights reserved.',
        'Privacy Terms of Use Cookie preferences',
        'Do not sell or share my personal information Site Map Adobe',
      ].join(' ');
      await setViewport({ width: 1024, height: 768 });
      expect(getComputedStyle(options).display).to.equal('flex');
      expect(getComputedStyle(options).flexWrap).to.equal('wrap');
      expectSocialOnSelectorRow();
      expect(legal.getBoundingClientRect().top)
        .to.be.greaterThan(social.getBoundingClientRect().bottom);
      await setViewport({ width: 1032, height: 768 });
      expect(getComputedStyle(options).display).to.equal('flex');
      expectSocialOnSelectorRow();
      await setViewport({ width: 1426, height: 900 });
      footer.style.width = '1200px';
      expect(getComputedStyle(options).flexWrap).to.equal('wrap');
      expectSocialOnSelectorRow();
      expect(legal.getBoundingClientRect().top)
        .to.be.greaterThan(social.getBoundingClientRect().bottom);
      await setViewport({ width: 1439, height: 900 });
      expectSocialOnSelectorRow();
      legal.textContent = '';
      legal.style.height = '60px';
      await setViewport({ width: 1440, height: 900 });
      expect(getComputedStyle(options).gridTemplateAreas).to.equal('"region legal social"');
      expectSocialOnSelectorRow();
      expect(getComputedStyle(block.querySelector('.market-selector-button')).fontSize).to.equal('12px');
      expect(getComputedStyle(block.querySelector('.market-selector-button')).gap).to.equal('5px');
      expect(getComputedStyle(block.querySelector('.market-selector-popover')).fontSize).to.equal('16px');
      expect(getComputedStyle(block.querySelector('.market-selector-popover')).lineHeight).to.equal('20px');
      await setViewport(initialViewport);
      footer.classList.add('mobile');
      const plainOptions = document.createElement('div');
      plainOptions.className = 'feds-footer-options';
      footer.append(plainOptions);
      expect(getComputedStyle(plainOptions).gridTemplateAreas)
        .to.equal('"region social" "legal legal"');
      plainOptions.remove();
      block.querySelector('.market-selector-button').click();
      const popover = block.querySelector('.market-selector-popover');
      expect(getComputedStyle(popover).position).to.equal('fixed');
      expect(getComputedStyle(popover.querySelector('.market-selector-list')).overflowY).to.equal('auto');
      block.querySelectorAll('.market-selector-button')[1].click();
      const marketPopover = block.querySelectorAll('.market-selector-popover')[1];
      expect(getComputedStyle(marketPopover).position).to.equal('fixed');
    } finally {
      await setViewport(initialViewport);
      style.remove();
      foundation.remove();
    }
  });

  it('avoids pointer focus on C2 options but preserves keyboard focus and C1 behavior', async () => {
    const block = document.querySelector('.market-selector');
    const c1Button = block.querySelector('.market-selector-button');
    c1Button.focus();
    c1Button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    await new Promise(requestAnimationFrame);
    expect(document.activeElement.classList.contains('market-selector-link')).to.equal(true);

    const onCleanup = sinon.spy();
    await init(block, { onCleanup, focusOnPointerOpen: false });
    try {
      const c2Button = block.querySelector('.market-selector-button');
      c2Button.focus();
      c2Button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
      await new Promise(requestAnimationFrame);
      expect(document.activeElement).to.equal(c2Button);
      c2Button.click();
      c2Button.click();
      await new Promise(requestAnimationFrame);
      expect(document.activeElement.classList.contains('market-selector-link')).to.equal(true);
    } finally {
      onCleanup.firstCall.args[0]();
    }
  });

  it('opens the market popover and lists supported regions', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    const marketBtn = buttons[1];
    marketBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = marketBtn.parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    const links = popover.querySelectorAll('.market-selector-link');
    expect(links.length).to.be.greaterThan(0);
  });

  it('sets listbox semantics on the market list', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelector('.market-selector-list');
    expect(list.getAttribute('role')).to.equal('listbox');
    const opts = list.querySelectorAll('.market-selector-link[role="option"]');
    expect(opts.length).to.be.greaterThan(0);
  });

  it('marks the current market option as selected', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const selected = document.querySelector('.market-selector-item.selected .market-selector-link');
    expect(selected).to.exist;
    expect(selected.getAttribute('aria-selected')).to.equal('true');
  });

  it('filters market options when searching', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await clock.runAllAsync();
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    searchInput.value = 'germ';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await clock.tickAsync(250);
    const links = document.querySelectorAll('.market-selector-dropdown')[1].querySelectorAll('.market-selector-link');
    const germany = Array.from(links).filter((a) => a.textContent.includes('Germany'));
    expect(germany.length).to.equal(1);
    clock.restore();
  });

  it('closes the market popover on Escape', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(popover.style.display).to.equal('none');
    expect(buttons[1].getAttribute('aria-expanded')).to.equal('false');
  });

  it('tabs through both C2 footer selector buttons and closes a pointer-opened dropdown on Escape', async () => {
    const originalViewport = { width: window.innerWidth, height: window.innerHeight };
    const block = document.querySelector('.market-selector');
    const footer = document.createElement('footer');
    footer.className = 'global-footer';
    const precedingLink = document.createElement('a');
    precedingLink.className = 'feds-navLink';
    precedingLink.href = '#previous';
    precedingLink.textContent = 'Previous';
    const followingLink = document.createElement('a');
    followingLink.className = 'feds-social-link';
    followingLink.href = '#next';
    followingLink.textContent = 'Next';
    block.replaceWith(footer);
    footer.append(precedingLink, block, followingLink);
    const style = document.createElement('style');
    style.textContent = await readFile({ path: '../../../libs/blocks/market-selector/market-selector.css' });
    const foundation = document.createElement('meta');
    foundation.name = 'footer-foundation';
    foundation.content = 'c2';
    const onCleanup = sinon.spy();
    try {
      document.head.append(style, foundation);
      await setViewport({ width: 1440, height: 900 });
      await init(block, { onCleanup, focusOnPointerOpen: false });
      block.classList.add('market-selector-c2');
      await setupFooterKeyboardNav();
      const [languageButton, marketButton] = block.querySelectorAll('.market-selector-button');
      precedingLink.focus();
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(languageButton);
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(marketButton);
      marketButton.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
      expect(marketButton.getAttribute('aria-expanded')).to.equal('true');
      precedingLink.focus();
      await sendKeys({ press: 'Escape' });
      expect(marketButton.getAttribute('aria-expanded')).to.equal('false');
      expect(marketButton.nextElementSibling.dataset.open).to.be.undefined;
      expect(document.activeElement).to.equal(marketButton);
      await new Promise(requestAnimationFrame);
      expect(marketButton.nextElementSibling.classList.contains('fixed-height')).to.equal(false);
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement).to.equal(followingLink);
    } finally {
      onCleanup.firstCall?.args[0]();
      style.remove();
      foundation.remove();
      await setViewport(originalViewport);
    }
  });

  it('closes the market popover when clicking outside', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    document.body.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    expect(popover.style.display).to.equal('none');
  });

  it('navigates market options with arrow keys', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-list');
    const first = list.querySelector('.market-selector-link');
    first.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).to.not.equal(first);
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).to.equal(first);
  });

  it('opens the language popover and lists locale options', async () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = langBtn.parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    expect(popover.querySelectorAll('.market-selector-link').length).to.be.greaterThan(0);
  });

  it('navigates from search to list with ArrowDown on language dropdown', async () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[0].querySelector('.search-input');
    searchInput.focus();
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement?.classList.contains('market-selector-link')).to.be.true;
  });

  describe('mobile drag to close', () => {
    async function openMarketPopover() {
      const buttons = document.querySelectorAll('.market-selector-button');
      buttons[1].click();
      await new Promise((r) => { setTimeout(r, 0); });
      const button = buttons[1];
      const popover = button.parentElement.querySelector('.market-selector-popover');
      return {
        button,
        popover,
        handle: popover.querySelector('.market-selector-drag-handle'),
        list: popover.querySelector('.market-selector-list'),
      };
    }

    function endPopoverTransition(popover) {
      popover.dispatchEvent(new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'transform',
      }));
    }

    it('moves the popover with the pointer while dragging the handle (mouse)', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 100, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 140, clientX: 20 }));
      expect(popover.style.transform).to.equal('translateY(40px)');
    });

    it('snaps the popover back when the handle drag ends below the close threshold', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 240, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 240 }));
      expect(popover.style.transform).to.equal('translateY(0px)');
      expect(popover.dataset.open).to.equal('true');
    });

    it('closes the popover after handle drag passes threshold and transition ends (mouse)', async () => {
      const { handle, popover, button } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 260, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 320 }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(popover.dataset.open).to.be.undefined;
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not close on handle mouseup if movement stayed within MIN_DRAG_PX', async () => {
      const { handle, popover } = await openMarketPopover();
      handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mousemove', { clientY: 202, clientX: 20 }));
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 250 }));
      expect(popover.dataset.open).to.equal('true');
      expect(popover.style.display).to.equal('block');
    });

    it('closes after drag-handle touch swipe past threshold', async function closesAfterDragHandleTouchSwipe() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { handle, popover, button } = await openMarketPopover();
      const id = 99;
      const docEl = document.documentElement;
      const tStart = new TouchCtor({ clientX: 30, clientY: 180, identifier: id, target: handle });
      handle.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 30, clientY: 300, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 30, clientY: 300, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('closes after list swipe down from top when scrollTop is 0', async function closesAfterListSwipeFromTop() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { list, popover, button } = await openMarketPopover();
      list.scrollTop = 0;
      const id = 77;
      const tStart = new TouchCtor({ clientX: 40, clientY: 100, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.style.transform).to.equal('translateY(100%)');
      endPopoverTransition(popover);
      expect(popover.style.display).to.equal('none');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('does not start list swipe-to-close when the list is scrolled away from top', async function doesNotSwipeCloseWhenListScrolled() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { list, popover } = await openMarketPopover();
      Object.defineProperty(list, 'scrollTop', { value: 40, configurable: true, writable: true });
      const id = 55;
      const tStart = new TouchCtor({ clientX: 40, clientY: 100, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      const tMove = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchmove', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tMove],
        composed: false,
        targetTouches: [tMove],
        touches: [tMove],
      }));
      const tEnd = new TouchCtor({ clientX: 40, clientY: 220, identifier: id, target: list });
      list.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      expect(popover.dataset.open).to.equal('true');
      expect(popover.style.display).to.equal('block');
    });

    it('drag handle touchend removes document touch listeners when popover closed early', async function dragHandleTouchEndWhenPopoverClosed() {
      let TouchEventCtor;
      let TouchCtor;
      try {
        TouchEventCtor = TouchEvent;
        TouchCtor = Touch;
      } catch (e) {
        this.skip?.();
        return;
      }
      if (typeof TouchEventCtor === 'undefined' || typeof TouchCtor === 'undefined') {
        this.skip?.();
        return;
      }
      const { handle, popover } = await openMarketPopover();
      const id = 88;
      const docEl = document.documentElement;
      const removeSpy = sinon.spy(document, 'removeEventListener');
      const tStart = new TouchCtor({ clientX: 10, clientY: 50, identifier: id, target: handle });
      handle.dispatchEvent(new TouchEventCtor('touchstart', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tStart],
        composed: false,
        targetTouches: [tStart],
        touches: [tStart],
      }));
      popover.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const tEnd = new TouchCtor({ clientX: 10, clientY: 50, identifier: id, target: docEl });
      document.dispatchEvent(new TouchEventCtor('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [tEnd],
        composed: false,
        targetTouches: [],
        touches: [],
      }));
      const touchRemovals = removeSpy.getCalls().filter((c) => (
        ['touchmove', 'touchend', 'touchcancel'].includes(c.args[0])
      ));
      removeSpy.restore();
      expect(touchRemovals.length).to.be.at.least(3);
    });
  });
});

describe('Market selector language helpers', () => {
  const locales = { '': { ietf: 'en-US' }, de: { ietf: 'de-DE' } };

  it('isIetfMatchForPrefix returns false without locales or empty prefix', () => {
    expect(isIetfMatchForPrefix('de', 'de', null)).to.be.false;
    expect(isIetfMatchForPrefix('de', 'de', undefined)).to.be.false;
    expect(isIetfMatchForPrefix('', 'en', locales)).to.be.false;
  });

  it('isIetfMatchForPrefix matches IETF substring for prefix key', () => {
    expect(isIetfMatchForPrefix('de', 'de-de', locales)).to.be.true;
    expect(isIetfMatchForPrefix('/de', 'de', locales)).to.be.true;
    expect(isIetfMatchForPrefix('de', 'xx', locales)).to.be.false;
  });

  it('isIetfMatchForPrefix returns false when locale entry has no ietf', () => {
    expect(isIetfMatchForPrefix('de', 'de', { de: {} })).to.be.undefined;
  });

  it('filterLang matches label, englishName, or IETF', () => {
    const item = { label: 'Deutsch', englishName: 'German', value: 'de' };
    expect(filterLang(item, 'deutsch', locales)).to.be.true;
    expect(filterLang(item, 'german', locales)).to.be.true;
    expect(filterLang(item, 'de-de', locales)).to.be.true;
    expect(filterLang(item, 'nope', locales)).to.be.false;
  });
});

describe('Market selector block – analytics', () => {
  let track;
  let oldSatellite;

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: { '': { ietf: 'en-US' }, de: { ietf: 'de-DE' } },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    // handleMarketSelect uses window.open(..., '_self'); real navigation tears down WTR.
    sinon.stub(window, 'open').returns(null);
    await init(document.querySelector('.market-selector'));
    await new Promise((r) => { setTimeout(r, 0); });
    oldSatellite = window._satellite;
    track = sinon.spy();
    window._satellite = { track };
  });

  afterEach(() => {
    window._satellite = oldSatellite;
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    sessionStorage.removeItem('akamai');
  });

  it('tracks market selector opened', async () => {
    track.resetHistory();
    document.querySelectorAll('.market-selector-button')[1].click();
    await Promise.resolve();
    expect(track.called).to.be.true;
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'market-selector:opened')).to.be.true;
  });

  it('tracks market selector dismissed', async () => {
    const btn = document.querySelectorAll('.market-selector-button')[1];
    btn.click();
    await Promise.resolve();
    track.resetHistory();
    btn.click();
    await Promise.resolve();
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'market-selector:dismissed')).to.be.true;
  });

  it('tracks language selector opened', async () => {
    track.resetHistory();
    document.querySelectorAll('.market-selector-button')[0].click();
    await Promise.resolve();
    expect(track.called).to.be.true;
    expect(track.getCalls().some((c) => c.args[1]?.data?.web?.webInteraction?.name === 'language-selector:opened')).to.be.true;
  });

  it('tracks market switch on item click', async () => {
    const btn = document.querySelectorAll('.market-selector-button')[1];
    btn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    track.resetHistory();
    const link = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-link');
    expect(link).to.exist;
    link.click();
    await Promise.resolve();
    const switched = track.getCalls().some(
      (c) => c.args[1]?.data?.web?.webInteraction?.name?.startsWith('market-switch:'),
    );
    expect(switched).to.be.true;
  });
});

describe('Market selector block — selection flows', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
    document.body.innerHTML = '';
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'international=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    sessionStorage.setItem('akamai', 'us');
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: {
        '': { ietf: 'en-US' },
        de: { ietf: 'de-DE' },
      },
      marketsConfig: {
        languages: {
          data: [
            {
              prefix: '',
              nativeName: 'English (US)',
              langName: 'English',
              group: 'English',
              supportedRegions: 'us,gb,de',
              defaultMarket: 'us',
            },
            {
              prefix: 'de',
              nativeName: 'Deutsch',
              langName: 'German',
              supportedRegions: 'de,at',
              defaultMarket: 'de',
            },
          ],
        },
      },
    });
    setupFetchStub();
    const block = document.querySelector('.market-selector');
    await init(block);
    await new Promise((r) => { setTimeout(r, 0); });
  });

  it('shows the globe icon on the language dropdown button', () => {
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    expect(langBtn.querySelector('.market-selector-globe')).to.exist;
  });

  it('does not show the globe icon on the market dropdown button', () => {
    const marketBtn = document.querySelectorAll('.market-selector-button')[1];
    expect(marketBtn.querySelector('.market-selector-globe')).to.be.null;
  });

  it('shows no-result text when market search matches nothing', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await clock.runAllAsync();
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    searchInput.value = 'zzzzz';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await clock.tickAsync(250);
    const noResult = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.no-search-result-text');
    expect(noResult).to.exist;
    clock.restore();
  });

  it('closes market popover when focus leaves', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    popover.dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body }));
    expect(popover.style.display).to.equal('none');
  });

  it('moves focus to search input on ArrowUp from first list item', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const list = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-list');
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    const first = list.querySelector('.market-selector-link');
    first.focus();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).to.equal(searchInput);
  });

  it('toggles popover closed when clicking the button a second time', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const popover = buttons[1].parentElement.querySelector('.market-selector-popover');
    expect(popover.dataset.open).to.equal('true');
    buttons[1].click();
    expect(popover.style.display).to.equal('none');
  });

  it('navigates to the selected market on link click', async () => {
    const openStub = sinon.stub(window, 'open');
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const link = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.market-selector-link');
    if (link) {
      link.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(openStub.called).to.be.true;
    }
    openStub.restore();
  });

  it('navigates to the selected language on link click', async () => {
    const openStub = sinon.stub(window, 'open');
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const link = document.querySelectorAll('.market-selector-dropdown')[0].querySelector('.market-selector-link');
    if (link) {
      link.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(openStub.called).to.be.true;
    }
    openStub.restore();
  });

  it('sets international cookie on language selection', async () => {
    const openStub = sinon.stub(window, 'open');
    const langBtn = document.querySelectorAll('.market-selector-button')[0];
    langBtn.click();
    await new Promise((r) => { setTimeout(r, 0); });
    const links = document.querySelectorAll('.market-selector-dropdown')[0].querySelectorAll('.market-selector-link');
    const nonSelectedLink = Array.from(links).find((l) => l.getAttribute('aria-selected') !== 'true');
    if (nonSelectedLink) {
      nonSelectedLink.click();
      await new Promise((r) => { setTimeout(r, 0); });
      expect(document.cookie).to.include('international=');
    }
    openStub.restore();
  });

  it('prevents space key from propagating in search input', async () => {
    const buttons = document.querySelectorAll('.market-selector-button');
    buttons[1].click();
    await new Promise((r) => { setTimeout(r, 0); });
    const searchInput = document.querySelectorAll('.market-selector-dropdown')[1].querySelector('.search-input');
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    const stopSpy = sinon.spy(spaceEvent, 'stopPropagation');
    searchInput.dispatchEvent(spaceEvent);
    expect(stopSpy.calledOnce).to.be.true;
  });

  it('does not return early when config has no languages', async () => {
    sinon.restore();
    document.body.innerHTML = await readFile({ path: './mocks/market-selector.html' });
    setConfig({
      origin: window.location.origin,
      locale: { prefix: '' },
      locales: { '': { ietf: 'en-US' } },
    });
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve({ languages: { data: [] } }),
    });
    const block = document.querySelector('.market-selector');
    await init(block);
    const wrapper = document.querySelector('.market-selector-wrapper');
    expect(wrapper).to.be.null;
  });

  it('adds feds-regionPicker-wrapper class to the block', () => {
    const block = document.querySelector('.market-selector');
    expect(block.classList.contains('feds-regionPicker-wrapper')).to.be.true;
  });
});
