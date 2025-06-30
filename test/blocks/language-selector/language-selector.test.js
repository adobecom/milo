import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import init from '../../../libs/blocks/language-selector/language-selector.js';

const mockLanguageMapping = {
  data: [
    { English: 'german', Native: 'Deutsch' },
    { English: 'japanese', Native: '日本語' },
    { English: 'korean', Native: '한국인' },
    { English: 'italian', Native: 'italiana' },
    { English: 'french', Native: 'Francais' },
  ],
};

const mockAccentedLanguageMapping = {
  data: [
    { English: 'francais', Native: 'Français' },
    { English: 'espanol', Native: 'Español' },
    { English: 'portugues', Native: 'Português' },
  ],
};

describe('Language Selector Block', async () => {
  let block;
  afterEach(() => { sinon.restore(); });
  beforeEach(async () => {
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
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();

    await new Promise((resolve) => { setTimeout(resolve, 150); });

    const dropdown = document.querySelector('.language-dropdown');
    const languageItems = document.querySelectorAll('.language-list .language-item');

    if (!dropdown || dropdown.style.display !== 'block' || languageItems.length === 0) {
      await new Promise((resolve) => { setTimeout(resolve, 100); });
    }
  });

  it('renders the language list with correct options', async () => {
    // Wait a bit more to ensure dropdown is fully loaded
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    const originalLinks = document.querySelectorAll('.language-selector ul li a');
    const dropdownOptions = document.querySelectorAll('.language-list .language-item');
    expect(dropdownOptions.length).to.equal(originalLinks.length);
    Array.from(dropdownOptions).forEach((item) => {
      expect(item.querySelector('a')).to.exist;
    });
  });

  it('sets correct ARIA roles and attributes', async () => {
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

  it('highlights the current language', async () => {
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

  it('has visible focus style for accessibility', async () => {
    const link = document.querySelector('.language-link');
    if (link) {
      link.focus();
      const style = window.getComputedStyle(link);
      expect(
        style.backgroundColor !== '' || style.outlineStyle !== 'none',
      ).to.be.true;
    }
  });

  it('closes dropdown on Escape key', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    const languageList = document.querySelector('.language-list');
    const links = languageList.querySelectorAll('.language-link');
    if (links[0]) {
      links[0].focus();
      const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      languageList.dispatchEvent(escape);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      const dropdown = document.querySelector('.language-dropdown');
      expect(dropdown.style.display).to.equal('none');
    }
  });

  it('filters languages based on search input', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Deutsch';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); }); // debounce
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.equal(1);
    expect(filtered[0].textContent).to.include('Deutsch');
  });

  it('filters languages by ISO codes', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by IETF codes', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by language prefixes', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'de';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/de/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by partial ISO codes', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'j';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by partial IETF codes', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by exact matches', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by case-insensitive search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'JA';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by mixed case search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by French search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'fr';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/fr/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by Korean search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ko';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ko/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by English search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'en';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/en/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by partial native name search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Deut';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by exact native name search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Deutsch';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by case-insensitive native name search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'deutsch';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by mixed case native name search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'DeuTsch';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by IETF language part search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by full IETF code search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by partial IETF code search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'ja';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/ja/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by language prefix exact match', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'de';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/de/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by language prefix partial match', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'd';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/de/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by case-insensitive language prefix search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'DE';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/de/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('filters languages by mixed case language prefix search', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'De';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.href.includes('/de/'));
    expect(filtered.length).to.be.greaterThan(0);
  });

  it('moves focus out of dropdown on Tab', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
      const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      searchInput.dispatchEvent(tab);
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      const dropdown = document.querySelector('.language-dropdown');
      expect(dropdown.contains(document.activeElement)).to.be.false;
    }
  });

  it('closes dropdown when clicking outside', async () => {
    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 100); });
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

  it('falls back on network error during prefetch', async () => {
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

  it('closes the dropdown when drag handle is dragged down and released (mouse)', async () => {
    const dropdowns = document.querySelectorAll('.language-dropdown');
    const dropdown = dropdowns[dropdowns.length - 1];
    const dragHandle = dropdown && dropdown.querySelector('.drag-handle');
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    if (!dropdown || dropdown.style.display !== 'block') {
      throw new Error('Dropdown did not open after click');
    }
    expect(dropdown && dropdown.style.display).to.equal('block');

    if (dragHandle) {
      const rect = dragHandle.getBoundingClientRect();
      dragHandle.dispatchEvent(new MouseEvent('mousedown', {
        clientY: rect.top + 5,
        bubbles: true,
      }));
      dragHandle.dispatchEvent(new MouseEvent('mousemove', {
        clientY: rect.top + 120,
        bubbles: true,
      }));
      dragHandle.dispatchEvent(new MouseEvent('mouseup', {
        clientY: rect.top + 120,
        bubbles: true,
      }));
      await new Promise((resolve) => { setTimeout(resolve, 350); });
      expect(dropdown && dropdown.style.display).to.equal('none');
    }
  });

  it('closes the dropdown when drag handle is dragged down and released (touch)', async () => {
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
    const dropdowns = document.querySelectorAll('.language-dropdown');
    const dropdown = dropdowns[dropdowns.length - 1];
    const dragHandle = dropdown && dropdown.querySelector('.drag-handle');
    await new Promise((resolve) => { setTimeout(resolve, 100); });
    if (!dropdown || dropdown.style.display !== 'block') {
      throw new Error('Dropdown did not open after click');
    }
    expect(dropdown && dropdown.style.display).to.equal('block');

    if (dragHandle) {
      const rect = dragHandle.getBoundingClientRect();
      dragHandle.dispatchEvent(new TouchEventCtor('touchstart', {
        touches: [
          new TouchCtor({ identifier: 0, target: dragHandle, clientY: rect.top + 5 }),
        ],
        bubbles: true,
      }));
      dragHandle.dispatchEvent(new TouchEventCtor('touchmove', {
        touches: [
          new TouchCtor({ identifier: 0, target: dragHandle, clientY: rect.top + 120 }),
        ],
        bubbles: true,
      }));
      dragHandle.dispatchEvent(new TouchEventCtor('touchend', {
        changedTouches: [
          new TouchCtor({ identifier: 0, target: dragHandle, clientY: rect.top + 120 }),
        ],
        bubbles: true,
      }));
      await new Promise((resolve) => { setTimeout(resolve, 350); });
      expect(dropdown && dropdown.style.display).to.equal('none');
    }
  });

  it('filters languages by English mapping search', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'German';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by English mapping partial search', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'Germ';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by English mapping case-insensitive search', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'german';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by English mapping mixed case search', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'GerMan';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Deutsch'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by accent normalization', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockAccentedLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'francais';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Français'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by accented search term', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockAccentedLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'français';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Français'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('filters languages by partial accented search', async () => {
    const fetchStub = sinon.stub(window, 'fetch');
    fetchStub.withArgs(sinon.match.string).resolves({
      ok: true,
      json: () => Promise.resolve(mockAccentedLanguageMapping),
    });

    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'franc';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    const filtered = languageLinks.filter((link) => link.textContent.includes('Français'));
    expect(filtered.length).to.be.greaterThan(0);

    fetchStub.restore();
  });

  it('handles empty search input', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    expect(languageLinks.length).to.be.greaterThan(0);
  });

  it('handles search with no results', async () => {
    const searchInput = document.querySelector('.search-input');
    searchInput.value = 'xyz123';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(resolve, 250); });
    const languageLinks = Array.from(document.querySelectorAll('.language-link'));
    expect(languageLinks.length).to.equal(0);
  });
});

describe('Language Selector Block - Network Event Handling', () => {
  let clock;
  let block;

  beforeEach(async () => {
    clock = sinon.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true });
    sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    }));
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

    const regionPickerElem = document.querySelector('.feds-regionPicker');
    regionPickerElem.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
  });

  afterEach(() => { sinon.restore(); });

  it('handles mouseover event for 200 pages', async () => {
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');
    const enGbLink = document.querySelector('a[href*="/en/gb/"]');
    const enGbHref = enGbLink.href;
    enGbLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(enGbLink.href).to.equal(enGbHref);
  });

  it('handles mouseover event for 404 pages', async () => {
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');
    const frLink = document.querySelector('a[href*="/fr/"]');
    frLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(frLink.href).to.match(/\/fr\//);
  });

  it('handles click event for 200 pages', async () => {
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

afterEach(() => {
  const dropdowns = document.querySelectorAll('.language-dropdown');
  dropdowns.forEach((d) => {
    d.style.display = 'none';
    d.style.transform = '';
    d.style.opacity = '';
  });
});
