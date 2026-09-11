import { expect } from '@esm-bundle/chai';
import { getUniqueSelector, getFilteredElements } from '../../../../libs/blocks/preflight/accessibility/helper.js';

describe('preflight accessibility helper', () => {
  describe('getUniqueSelector', () => {
    it('returns empty string for null/undefined', () => {
      expect(getUniqueSelector(null)).to.equal('');
      expect(getUniqueSelector(undefined)).to.equal('');
    });

    it('prefers the element id', () => {
      const el = document.createElement('div');
      el.id = 'my-id';
      el.className = 'ignored';
      expect(getUniqueSelector(el)).to.equal('#my-id');
    });

    it('builds a tag.class selector when classes are present', () => {
      const el = document.createElement('section');
      el.className = 'foo bar';
      expect(getUniqueSelector(el)).to.equal('section.foo.bar');
    });

    it('falls back to the tag name when there is no id or className', () => {
      const fake = { tagName: 'SPAN', id: '', className: null };
      expect(getUniqueSelector(fake)).to.equal('span');
    });
  });

  describe('getFilteredElements', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      container.id = 'a11y-helper-fixture';
      container.innerHTML = `
        <div class="keep"><p class="keep-child">a</p></div>
        <div class="drop"><span class="drop-child">b</span></div>
      `;
      document.body.append(container);
    });

    afterEach(() => container.remove());

    it('includes matched elements and their descendants', () => {
      const els = getFilteredElements(['#a11y-helper-fixture .keep']);
      expect(els).to.include(container.querySelector('.keep'));
      expect(els).to.include(container.querySelector('.keep-child'));
    });

    it('returns included elements untouched when no exclude selectors given', () => {
      const els = getFilteredElements(['#a11y-helper-fixture .drop']);
      expect(els.length).to.be.greaterThan(0);
    });

    it('removes excluded elements and their descendants', () => {
      const els = getFilteredElements(
        ['#a11y-helper-fixture'],
        ['#a11y-helper-fixture .drop'],
      );
      expect(els).to.include(container.querySelector('.keep'));
      expect(els).to.not.include(container.querySelector('.drop'));
      expect(els).to.not.include(container.querySelector('.drop-child'));
    });
  });
});
