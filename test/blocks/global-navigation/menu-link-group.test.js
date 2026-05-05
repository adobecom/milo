import { expect } from '@esm-bundle/chai';
import menuModule, { decorateLinkGroupWithEmbeddedMerch } from '../../../libs/blocks/global-navigation/utilities/menu/menu.js';

describe('menu link-group', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('decorateLinkGroupWithEmbeddedMerch', () => {
    it('uses the primary (non-merch) link for card href and title, and injects the price node into the description', () => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div class="link-group">
          <div>
            <div data-align="justify">
              <p><strong><a href="https://www.adobe.com/edu">Student community</a></strong></p>
              <p>Save — <a class="merch link-block" href="https://milo.adobe.com/tools/ost?osi=testosi&amp;type=discount">PLACEHOLDER PRICE</a> on Creative Cloud</p>
            </div>
          </div>
        </div>`;
      const linkGroupEl = wrap.querySelector('.link-group');
      const priceEl = document.createElement('span');
      priceEl.className = 'mock-inline-price';
      priceEl.textContent = '€42/mo';

      const result = decorateLinkGroupWithEmbeddedMerch(linkGroupEl, 1, priceEl);
      expect(result).to.be.instanceOf(HTMLElement);

      const navLink = result.matches('a.feds-navLink') ? result : result.querySelector('a.feds-navLink');
      expect(navLink?.getAttribute('href')).to.equal('https://www.adobe.com/edu');

      const title = result.querySelector('.feds-navLink-title');
      expect(title?.textContent.trim()).to.equal('Student community');

      const desc = result.querySelector('.feds-navLink-description');
      expect(desc?.querySelector('.mock-inline-price')).to.equal(priceEl);
      expect(desc?.querySelector('a.merch')).to.be.null;
      expect(desc?.textContent).to.include('€42/mo');
      expect(desc?.textContent).to.include('on Creative Cloud');
    });

    it('returns empty string when there is no anchor', () => {
      const div = document.createElement('div');
      div.className = 'link-group';
      expect(decorateLinkGroupWithEmbeddedMerch(div, 0, document.createElement('span'))).to.equal('');
    });
  });

  describe('decorateLinkGroup', () => {
    it('still keys the card off the first anchor in document order (legacy)', () => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div class="link-group">
          <div>
            <div data-align="justify">
              <p><strong><a href="https://www.adobe.com/edu">Student community</a></strong></p>
              <p>Save — <a class="merch link-block" href="https://milo.adobe.com/tools/ost?osi=x&amp;type=discount">PLACEHOLDER PRICE</a> on Creative Cloud</p>
            </div>
          </div>
        </div>`;
      const linkGroupEl = wrap.querySelector('.link-group');

      const result = menuModule.decorateLinkGroup(linkGroupEl, 1);
      expect(result).to.be.instanceOf(HTMLElement);

      const navLink = result.matches('a.feds-navLink') ? result : result.querySelector('a.feds-navLink');
      expect(navLink?.getAttribute('href')).to.equal('https://www.adobe.com/edu');

      const desc = result.querySelector('.feds-navLink-description');
      expect(desc?.textContent).to.include('PLACEHOLDER PRICE');
      expect(desc?.querySelector('a')).to.be.null;
    });
  });
});
