import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/blocks/language-selector/language-selector.js';

describe('Language Selector Block', async () => {
  let block;
  afterEach(() => { sinon.restore(); });
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/languages.html' });
    setConfig({
      languages: {
        en: {
          ietf: 'en',
          tk: 'hah7vzn.css',
          rootPath: '',
          regions: [
            { region: 'gb' },
            { region: 'apac' },
          ],
        },
        de: { ietf: 'de', tk: 'hah7vzn.css' },
        fr: { ietf: 'fr', tk: 'vrk5vyv.css' },
        ja: { ietf: 'ja', tk: 'dvg6awq', region: 'jp' },
        ko: { ietf: 'ko', tk: 'qjs5sfm', region: 'kr' },
      },
      locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
    });
    block = document.body.querySelector('.language-selector');
    await init(block);
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    // Simulate opening the dropdown to populate the language list
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
  });

  it('renders the language list with correct options', () => {
    const mockLinks = document.querySelectorAll('.language-selector a');
    const options = document.querySelectorAll('.language-list .language-item');
    expect(options.length).to.equal(mockLinks.length);
    Array.from(options).forEach((item) => {
      expect(item.querySelector('a')).to.exist;
    });
  });

  it('sets correct ARIA roles and attributes', () => {
    const list = document.querySelector('.language-list');
    expect(list.getAttribute('role')).to.equal('listbox');
    expect(list.getAttribute('aria-label')).to.exist;
    const options = document.querySelectorAll('.language-link');
    options.forEach((opt) => {
      expect(opt.getAttribute('role')).to.equal('option');
      expect(opt.hasAttribute('aria-selected')).to.be.true;
      expect(opt.hasAttribute('tabindex')).to.be.true;
    });
  });

  it('highlights the current language', () => {
    const selected = document.querySelector('.language-item.selected .language-link');
    expect(selected).to.exist;
    expect(selected.getAttribute('aria-selected')).to.equal('true');
  });

  it('changes language on click', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 200, ok: true }));
    const stub = sinon.stub(window, 'open');
    const languageLinks = document.querySelectorAll('.language-link');
    const secondOption = languageLinks[1];
    if (secondOption) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      secondOption.dispatchEvent(clickEvent);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(stub.called).to.be.true;
      expect(stub.firstCall.args[0]).to.include('/en/gb');
      expect(stub.firstCall.args[1]).to.equal('_self');
    } else {
      throw new Error('Second language link not found');
    }
    stub.restore();
  });

  it('has visible focus style for accessibility', () => {
    const link = document.querySelector('.language-link');
    link.focus();
    const style = window.getComputedStyle(link);
    expect(
      style.backgroundColor !== '' || style.outlineStyle !== 'none',
    ).to.be.true;
  });

  it('closes dropdown on Escape key', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const languageList = document.querySelector('.language-list');
    const links = languageList.querySelectorAll('.language-link');
    links[0].focus();
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    languageList.dispatchEvent(escape);
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const dropdown = document.querySelector('.language-dropdown');
    expect(dropdown.style.display).to.equal('none');
  });

  it('filters languages based on search input', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Deutsch';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); }); // debounce
    const visibleLinks = Array.from(document.querySelectorAll('.language-link'))
      .filter((link) => link.offsetParent !== null);
    expect(visibleLinks.length).to.equal(1);
    expect(visibleLinks[0].textContent).to.include('Deutsch');
  });

  it('moves focus out of dropdown on Tab', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const searchInput = document.querySelector('.search-input');
    searchInput.focus();
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    searchInput.dispatchEvent(tab);
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const dropdown = document.querySelector('.language-dropdown');
    expect(dropdown.contains(document.activeElement)).to.be.false;
  });

  it('closes dropdown when clicking outside', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    document.body.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    const dropdown = document.querySelector('.language-dropdown');
    expect(dropdown.style.display).to.equal('none');
  });

  it('opens language in new tab with Ctrl/Cmd click', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 200, ok: true }));
    const stub = sinon.stub(window, 'open');
    const languageLinks = document.querySelectorAll('.language-link');
    const secondOption = languageLinks[1];
    if (secondOption) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
      secondOption.dispatchEvent(clickEvent);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(stub.called).to.be.true;
      expect(stub.firstCall.args[1]).to.equal('_blank');
    }
    stub.restore();
  });

  it.skip('falls back on network error during prefetch', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.reject(new Error('fail')));
    const stub = sinon.stub(window, 'open');
    const languageLinks = document.querySelectorAll('.language-link');
    const frLink = Array.from(languageLinks).find((link) => link.href.includes('/fr/'));
    if (frLink) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      frLink.dispatchEvent(clickEvent);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      expect(stub.called).to.be.true;
      expect(stub.firstCall.args[0]).to.include('/fr/');
    }
    stub.restore();
  });
});

describe('Language Selector Block - Network Event Handling', () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
  });
  afterEach(() => { sinon.restore(); });

  it('handles mouseover event for 200 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 200, ok: true }));
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');
    const enGbLink = document.querySelector('a[href*="/en/gb/"]');
    const enGbHref = enGbLink.href;
    enGbLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(enGbLink.href).to.equal(enGbHref);
  });

  it('handles mouseover event for 404 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 404, ok: false }));
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');
    const frLink = document.querySelector('a[href*="/fr/"]');
    frLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(frLink.href).to.match(/\/fr\//);
  });

  it('handles click event for 200 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 200, ok: true }));
    const stub = sinon.stub(window, 'open');
    const languageLinks = document.querySelectorAll('.language-link');
    const jaLink = Array.from(languageLinks).find((link) => link.href.includes('/ja/'));
    if (jaLink) {
      jaLink.removeAttribute('href');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      jaLink.dispatchEvent(clickEvent);
      await clock.runAllAsync();
      expect(stub.called).to.be.true;
      expect(stub.firstCall.args[0]).to.include('/ja/');
      expect(stub.firstCall.args[1]).to.equal('_self');
    } else {
      throw new Error('jaLink not found');
    }
    stub.restore();
  });

  it('handles click event for 404 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ status: 404, ok: false }));
    const stub = sinon.stub(window, 'open');
    const languageLinks = document.querySelectorAll('.language-link');
    const deLink = Array.from(languageLinks).find((link) => link.href.includes('/de/'));
    if (deLink) {
      deLink.removeAttribute('href');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      deLink.dispatchEvent(clickEvent);
      await clock.runAllAsync();
      expect(stub.called).to.be.true;
      expect(stub.firstCall.args[0]).to.include('/de/');
      expect(stub.firstCall.args[1]).to.equal('_self');
    } else {
      throw new Error('deLink not found');
    }
    stub.restore();
  });
});
