import { expect } from '@esm-bundle/chai';
import {
  toFragment,
  getFedsPlaceholderConfig,
  getAnalyticsValue,
  decorateCta,
  closeAllDropdowns,
  trigger,
  expandTrigger,
} from '../../../../libs/blocks/global-navigation/utilities/utilities.js';
import { setConfig } from '../../../../libs/utils/utils.js';

describe('global navigation utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('toFragment', () => {
    expect(toFragment).to.exist;
    const fragment = toFragment`<div>test</div>`;
    expect(fragment.tagName).to.equal('DIV');
    expect(fragment.innerHTML).to.equal('test');
    // also renders nested fragments
    const fragment2 = toFragment`<span>${fragment}</span>`;
    expect(fragment2.innerHTML).to.equal('<div>test</div>');
    expect(fragment2.tagName).to.equal('SPAN');
  });

  // TODO - no tests for using the the live url and .hlx. urls
  // as mocking window.location.origin is not possible
  describe('getFedsPlaceholderConfig', () => {
    it('should return contentRoot for localhost', () => {
      const locale = { ietf: 'en-US', prefix: '' };
      setConfig(locale);
      const { locale: { ietf, prefix, contentRoot } } = getFedsPlaceholderConfig();
      expect(ietf).to.equal('en-US');
      expect(prefix).to.equal('');
      expect(contentRoot).to.equal('http://localhost:2000');
    });

    it('should return a config object for a specific locale', () => {
      setConfig({
        locales: {
          '': { ietf: 'en-US' },
          fi: { ietf: 'fi-FI' },
        },
        pathname: '/fi/',
      });
      const { locale: { ietf, prefix, contentRoot } } = getFedsPlaceholderConfig();
      expect(ietf).to.equal('fi-FI');
      expect(prefix).to.equal('/fi');
      expect(contentRoot).to.equal('http://localhost:2000/fi');
    });
  });

  it('getAnalyticsValue should return a string', () => {
    expect(getAnalyticsValue('test')).to.equal('test');
    expect(getAnalyticsValue('test test')).to.equal('test_test');
    expect(getAnalyticsValue('test test 1', 2)).to.equal('test_test_1-2');
  });

  describe('decorateCta', () => {
    it('should return a fragment for a primary cta', () => {
      const elem = { href: 'test', textContent: 'test' };
      const el = decorateCta({ elem });
      expect(el.tagName).to.equal('DIV');
      expect(el.className).to.equal('feds-cta-wrapper');
      expect(el.children[0].tagName).to.equal('A');
      expect(el.children[0].className).to.equal('feds-cta feds-cta--primary');
      expect(el.children[0].getAttribute('href')).to.equal('test');
      expect(el.children[0].getAttribute('daa-ll')).to.equal('test');
      expect(el.children[0].textContent.trim()).to.equal('test');
    });

    it('should return a fragment for a secondary cta', () => {
      const elem = { href: 'test', textContent: 'test' };
      const el = decorateCta({ elem, type: 'secondaryCta' });
      expect(el.tagName).to.equal('DIV');
      expect(el.className).to.equal('feds-cta-wrapper');
      expect(el.children[0].tagName).to.equal('A');
      expect(el.children[0].className).to.equal('feds-cta feds-cta--secondary');
      expect(el.children[0].getAttribute('href')).to.equal('test');
      expect(el.children[0].getAttribute('daa-ll')).to.equal('test');
      expect(el.children[0].textContent.trim()).to.equal('test');
    });
  });

  it('closeAllDropdowns should close all dropdowns, respecting the globalNavSelector', () => {
    const openEl = toFragment`<div class="global-navigation"><div id="mock" class="feds-navLink" aria-expanded="true"></div></div>`;
    document.body.appendChild(openEl);
    expect(document.querySelectorAll('[aria-expanded="true"]').length).to.equal(1);
    closeAllDropdowns();
    expect(document.querySelector('#mock').getAttribute('daa-lh')).to.equal('header|Open');
    expect(document.querySelectorAll('[aria-expanded="true"]').length).to.equal(0);
  });

  it('trigger manages the aria-expanded state of a global-navigation element', () => {
    const openEl = toFragment`<div class="global-navigation"><div id="mock" class="feds-navLink"></div></div>`;
    document.body.appendChild(openEl);
    const element = document.querySelector('#mock');
    expect(trigger({ element })).to.equal(true);
    expect(element.getAttribute('daa-lh')).to.equal('header|Close');
    expect(element.getAttribute('aria-expanded')).to.equal('true');
    expect(trigger({ element })).to.equal(false);
    expect(element.getAttribute('daa-lh')).to.equal('header|Open');
    expect(element.getAttribute('aria-expanded')).to.equal('false');
  });

  it('expandTrigger opens a global-navigation element', () => {
    const openEl = toFragment`<div class="global-navigation"><div id="mock" class="feds-navLink"></div></div>`;
    document.body.appendChild(openEl);
    const element = document.querySelector('#mock');
    expandTrigger({ element });
    expect(element.getAttribute('daa-lh')).to.equal('header|Close');
    expandTrigger({ element });
    expect(element.getAttribute('daa-lh')).to.equal('header|Close');
  });
});
