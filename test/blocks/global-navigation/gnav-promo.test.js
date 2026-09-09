/* eslint-disable no-restricted-syntax */
import { expect } from '@esm-bundle/chai';
import { createFullGlobalNavigation, unavVersion } from './test-utilities.js';
import { decoratePromo } from '../../../libs/blocks/global-navigation/utilities/menu/menu.js';
import { toFragment } from '../../../libs/blocks/global-navigation/utilities/utilities.js';

describe('Promo', () => {
  before(() => {
    document.head.innerHTML = `
    <link rel="icon" href="/libs/img/favicons/favicon.ico" size="any">
    <script type="importmap">
      {
        "imports": {
          "https://auth.services.adobe.com/imslib/imslib.min.js": "./mocks/imslib-mock.js",
          "https://stage.adobeccstatic.com/unav/${unavVersion}/UniversalNav.js": "./mocks/unav-mock.js"
        }
      }
    </script>
  `;
  });

  it('doesn\'t exist if metadata is not defined', async () => {
    const nav = await createFullGlobalNavigation();
    expect(nav.block.querySelector('.aside.promobar')).to.equal(null);
  });

  it('doesn\'t exist if metadata is not referencing a fragment', async () => {
    const wrongPromoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/path/to/promo">`;
    document.head.append(wrongPromoMeta);
    const nav = await createFullGlobalNavigation({ hasPromo: true, hasBreadcrumbs: false });
    expect(nav.block.classList.contains('has-promo')).to.be.false;
    expect(document.body.querySelector('.aside.promobar')).to.equal(null);
    wrongPromoMeta.remove();
  });

  it('doesn\'t exist if fragment doesn\'t contain an aside block', async () => {
    const promoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/fragments/wrong-promo-fragment">`;
    document.head.append(promoMeta);
    const nav = await createFullGlobalNavigation({ hasPromo: true, hasBreadcrumbs: false });
    expect(nav.block.classList.contains('has-promo')).to.be.false;
    expect(document.body.querySelector('.aside.promobar')).to.equal(null);
    promoMeta.remove();
  });

  it('is available if set up correctly', async () => {
    const promoMeta = toFragment`<meta name="gnav-promo-source" content="http://localhost:2000/fragments/correct-promo-fragment">`;
    document.head.append(promoMeta);
    const nav = await createFullGlobalNavigation({
      hasPromo: true,
      imsInitialized: true,
      hasBreadcrumbs: false,
    });
    expect(nav.block.classList.contains('has-promo')).to.be.true;
    const asideElem = document.body.querySelector('.aside.promobar');
    expect(asideElem).to.exist;
    expect(asideElem.getAttribute('daa-lh')).to.equal('Promo');
    asideElem.querySelectorAll('a').forEach((linkElem) => {
      expect(linkElem.hasAttribute('daa-ll')).to.be.true;
    });
    promoMeta.remove();
  });
});

describe('Promo mas-field CTAs', () => {
  it('hoists feds-cta class and daa-ll onto the resolved anchor on mas:ready', async () => {
    const promo = toFragment`<div class="gnav-promo"><div><div><p>Promo</p></div></div></div>`;
    await decoratePromo(promo, 0);
    const mf = toFragment`<mas-field class="feds-cta feds-cta--primary" daa-ll="buy-now"><a href="https://adobe.com/buy">Buy</a></mas-field>`;
    document.body.append(mf);

    mf.dispatchEvent(new Event('mas:ready', { bubbles: true }));

    const link = document.querySelector('a[href="https://adobe.com/buy"]');
    expect(link.className).to.equal('feds-cta feds-cta--primary');
    expect(link.getAttribute('daa-ll')).to.equal('buy-now');
    expect(document.querySelector('mas-field')).to.equal(null);
    link.remove();
  });

  it('keeps a bolded inline-price header as the heading, not a CTA', async () => {
    const promo = toFragment`<div class="gnav-promo"><div><div>
      <p><strong>Save now <a href="https://adobe.com/price">US$9.99/mo</a></strong></p>
    </div></div></div>`;
    await decoratePromo(promo, 0);

    const header = promo.querySelector('.feds-promo-header');
    expect(header).to.exist;
    const priceLink = header.querySelector('a[href="https://adobe.com/price"]');
    expect(priceLink).to.exist;
    expect(priceLink.classList.contains('feds-cta')).to.be.false;
  });
});
