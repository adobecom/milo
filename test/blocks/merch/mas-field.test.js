import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';

// TODO: Remove once mas-field is published to @adobecom/mas-platform.
// All other MAS components (merch-card, merch-quantity-select, etc.) resolve via the import map
// in web-test-runner.config.mjs: https://www.adobe.com/mas/libs/ → node_modules.
// mas-field isn't in the npm package yet, so we register a stub to prevent loadMasComponent
// from failing. Once published, replace this block with a static import like the others.
if (!customElements.get('mas-field')) {
  customElements.define('mas-field', class extends HTMLElement {
    checkReady() {
      if (!this.querySelector('[data-role="mas-field-content"]')) {
        const content = document.createElement('span');
        content.setAttribute('data-role', 'mas-field-content');
        const field = this.getAttribute('field');
        if (field === 'description') {
          content.innerHTML = '<h3><strong>Resolved description</strong></h3><a href="https://www.adobe.com/">See terms</a><a href="https://main--milo--adobecom.aem.live/test/fragments/modal#cardmodal">Open modal</a>';
        } else if (field === 'ctas') {
          content.innerHTML = '<strong><a href="https://www.adobe.com/">Buy now</a></strong><em><a href="https://main--milo--adobecom.aem.page/some/test/page">Go</a></em>';
        } else if (field === 'ctas-checkout') {
          // Simulates a plain commerce link (no em/strong from MAS — e.g. checkout-link)
          content.innerHTML = '<a is="checkout-link" href="https://commerce.adobe.com/">Buy now</a>';
        } else if (field === 'ctas-promo') {
          // Pre-stamped like real mas-field; asserts the unwrap preserves it.
          content.innerHTML = '<a is="checkout-link" data-wcs-osi="OSI-CTA" data-promotion-code="PROMO26" href="https://commerce.adobe.com/">Buy now</a>';
        } else if (field === 'prices-promo') {
          // Price + terms link triggers the unwrap; promo pre-stamped on the span.
          content.innerHTML = '<span is="inline-price" data-template="price" data-wcs-osi="OSI-X" data-promotion-code="PROMO26"></span> <a href="https://www.adobe.com/">See terms</a>';
        } else {
          content.textContent = 'Resolved inline value';
        }
        this.append(content);
      }
      return Promise.resolve(Boolean(this));
    }
  });
}

const { initMasField: init, holdCtaUntilPrice } = await import('../../../libs/blocks/merch/merch.js');

const originalFetch = window.fetch;
const { adobeIMS } = window;
async function mockIms(countryCode) {
  window.adobeIMS = {
    initialized: true,
    isSignedInUser: () => !!countryCode,
    async getProfile() {
      return { countryCode };
    },
  };
}

function unmockIms() {
  window.adobeIMS = adobeIMS;
}

describe('mas-field', () => {
  describe('init method', () => {
    before(async () => {
      await mockIms();
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        let fileName = '';
        if (url.includes('/mas/io/fragment')) {
          fileName = 'fragment.json';
        }
        if (url.includes('/web_commerce_artifact')) {
          fileName = 'artifact.json';
        }
        const result = await originalFetch(`/test/blocks/merch-card-autoblock/mocks/${fileName}`).then(async (res) => {
          if (res.ok) return res;
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    after(() => {
      unmockIms();
      sinon.restore();
    });

    it('mep replace on one headless field does not affect other fields sharing the same source fragment', async () => {
      setConfig({
        mep: {
          inBlock: {
            mas: {
              fragments: {
                'field-scope-1': {
                  cardTitle: {
                    action: 'replace',
                    content: '1234',
                  },
                },
              },
            },
          },
        },
      });
      const title = document.createElement('a');
      title.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=field-scope-1&field=cardTitle';
      title.textContent = '[[field-scope-test:cardTitle]]';
      const description = document.createElement('a');
      description.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=field-scope-1&field=description';
      description.textContent = '[[field-scope-test:description]]';
      document.body.append(title, description);
      await init(title);
      await init(description);
      const masFields = [...document.querySelectorAll('mas-field')];
      const titleField = masFields.find((mf) => mf.getAttribute('field') === 'cardTitle');
      const descriptionField = masFields.find((mf) => mf.getAttribute('field') === 'description');
      expect(titleField.querySelector('aem-fragment').getAttribute('fragment')).to.equal('1234');
      expect(descriptionField.querySelector('aem-fragment').getAttribute('fragment')).to.equal('field-scope-1');
    });

    it('creates mas-field wrapping aem-fragment with correct attributes', async () => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=9de46774-dafe-4f3e-badd-0cbeed37ea08&field=prices';
      a.textContent = '[[my-card:prices]]';
      p.append(a);
      document.body.append(p);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.getAttribute('field')).to.equal('prices');
      const frag = masField.querySelector('aem-fragment');
      expect(frag).to.exist;
      expect(frag.getAttribute('fragment')).to.equal('9de46774-dafe-4f3e-badd-0cbeed37ea08');
      expect(frag.getAttribute('field')).to.not.exist;
    });

    it('creates mas-field with description field', async () => {
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=abc-123&field=description';
      a.textContent = '[[my-card:description]]';
      document.body.append(a);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.getAttribute('field')).to.equal('description');
      const frag = masField.querySelector('aem-fragment');
      expect(frag).to.exist;
    });

    it('decorates modal links inside inline mas-field content', async () => {
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=modal-link-1&field=description';
      a.textContent = '[[modal-link-test:description]]';
      document.body.append(a);
      await init(a);
      const modalLink = document.querySelector('mas-field a[href="#cardmodal"]');
      expect(modalLink.classList.contains('modal')).to.be.true;
      expect(modalLink.getAttribute('data-modal-path')).to.equal('/test/fragments/modal');
    });

    it('returns early for inline fragment when fragment is missing', async () => {
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&field=prices';
      a.textContent = '[[no-id]]';
      document.body.append(a);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.not.exist;
    });

    it('unwraps parent <p> when inline fragment resolves to block content', async () => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=unwrap-789&field=description';
      a.textContent = '[[unwrap-test:description]]';
      p.append(a);
      document.body.append(p);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.parentElement).to.equal(document.body);
      expect(document.querySelector('p')).to.not.exist;
    });

    it('preserves parent <p> and its Milo classes when inline fragment renders inline content', async () => {
      const p = document.createElement('p');
      p.classList.add('body-m');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=inline-body-1&field=prices';
      a.textContent = '[[inline-body-test:prices]]';
      p.append(a);
      document.body.append(p);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.parentElement).to.equal(p);
      expect(p.classList.contains('body-m')).to.be.true;
    });

    it('preserves parent <p> for inline fragment when link has siblings', async () => {
      const p = document.createElement('p');
      const span = document.createElement('span');
      span.textContent = 'sibling';
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=sibling-101&field=prices';
      a.textContent = '[[sibling-test:prices]]';
      p.append(span, a);
      document.body.append(p);
      await init(a);
      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.parentElement).to.equal(p);
      expect(p.querySelector('span')).to.exist;
    });

    it('unwraps heading wrappers when inline fragment resolves to block content', async () => {
      const heading = document.createElement('h3');
      heading.id = 'inline-fragment-heading';
      heading.classList.add('heading-xxl');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=heading-unwrap-1&field=description';
      a.textContent = '[[heading-unwrap-test:description]]';
      strong.append(a);
      heading.append(strong);
      document.body.append(heading);

      await init(a);

      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.parentElement).to.equal(document.body);
      expect(document.querySelector('#inline-fragment-heading > mas-field')).to.not.exist;
      const resolvedHeading = masField.querySelector('[data-role="mas-field-content"] h3');
      expect(resolvedHeading).to.exist;
      expect(resolvedHeading.id).to.equal('inline-fragment-heading');
      expect(resolvedHeading.classList.contains('heading-xxl')).to.be.true;
    });

    it('preserves heading wrappers when inline fragment stays inline', async () => {
      const heading = document.createElement('h3');
      heading.id = 'inline-price-heading';
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=heading-inline-1&field=prices';
      a.textContent = '[[heading-inline-test:prices]]';
      strong.append(a);
      heading.append(strong);
      document.body.append(heading);

      await init(a);

      const masField = document.querySelector('mas-field');
      expect(masField).to.exist;
      expect(masField.closest('#inline-price-heading')).to.exist;
    });

    it('decorates ctas using sibling button context (size + utility classes)', async () => {
      const section = document.createElement('div');

      // Simulate already-decorated sibling button (block ran decorateButtons before our checkReady)
      const siblingBtn = document.createElement('a');
      siblingBtn.classList.add('con-button', 'blue', 'button-l', 'button-justified-mobile');
      section.append(siblingBtn);

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=ctas-inherit-1&field=ctas';
      a.textContent = '[[cta-test:ctas]]';
      strong.append(a);
      p.append(strong);

      const em = document.createElement('em');
      const a2 = document.createElement('a');
      a2.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=ctas-inherit-2&field=ctas';
      a2.textContent = '[[cta-test:ctas]]';
      a2.classList.add('some-class', 'merch', 'link-block');
      em.append(a2);
      p.append(em);

      section.append(p);
      document.body.append(section);

      await init(a);

      const masField = p.querySelector('mas-field');
      expect(masField).to.exist;
      const link = masField.querySelector('a.con-button');
      expect(link).to.exist;
      expect(link.classList.contains('blue')).to.be.true;
      expect(link.classList.contains('button-l')).to.be.true;
      expect(link.classList.contains('button-justified-mobile')).to.be.true;

      const linkNotDecorated = p.querySelector('a.some-class');
      expect(linkNotDecorated).to.exist;
      expect(linkNotDecorated.className).to.equal('some-class merch link-block');
    });

    it('preserves the stamped promo code on inline prices through unwrapping', async () => {
      const section = document.createElement('div');
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=promo-1&field=prices-promo';
      a.textContent = '[[promo-test:prices-promo]]';
      p.append(a);
      section.append(p);
      document.body.append(section);

      await init(a);

      const masField = p.querySelector('mas-field');
      expect(masField).to.exist;
      const price = masField.querySelector('span[is="inline-price"]');
      expect(price).to.exist;
      expect(price.getAttribute('data-promotion-code')).to.equal('PROMO26');
    });

    it('preserves the stamped promo code on checkout links through unwrapping', async () => {
      const section = document.createElement('div');
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=promo-3&field=ctas-promo';
      a.textContent = '[[promo-cta-test:ctas-promo]]';
      p.append(a);
      section.append(p);
      document.body.append(section);

      await init(a);

      const masField = section.querySelector('mas-field');
      expect(masField).to.exist;
      const cta = masField.querySelector('a[is="checkout-link"]');
      expect(cta).to.exist;
      expect(cta.getAttribute('data-promotion-code')).to.equal('PROMO26');
    });

    it('loads merch.css when unwrapping price content', async () => {
      const section = document.createElement('div');
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=promo-2&field=prices-promo';
      a.textContent = '[[promo-css-test:prices-promo]]';
      p.append(a);
      section.append(p);
      document.body.append(section);

      await init(a);

      expect(document.head.querySelector('link[href*="blocks/merch/merch.css"]')).to.exist;
    });

    it('holds the CTA action area hidden until the card price is ready', async () => {
      const card = document.createElement('div');
      const pricing = document.createElement('p');
      const price = document.createElement('mas-field');
      price.setAttribute('field', 'prices');
      let resolvePrice;
      price.checkReady = () => new Promise((r) => { resolvePrice = r; });
      pricing.append(price);
      const actionArea = document.createElement('p');
      actionArea.append(document.createElement('a'));
      card.append(pricing, actionArea);

      holdCtaUntilPrice(actionArea);
      expect(actionArea.style.visibility).to.equal('hidden');

      resolvePrice(true);
      await new Promise((r) => { setTimeout(r); });
      expect(actionArea.style.visibility).to.equal('');
    });

    it('does not hide the CTA action area when the card has no price', () => {
      const card = document.createElement('div');
      const actionArea = document.createElement('p');
      actionArea.append(document.createElement('a'));
      card.append(actionArea);

      holdCtaUntilPrice(actionArea);
      expect(actionArea.style.visibility).to.equal('');
    });

    it('reveals the CTA after the field timeout when the price never resolves', async () => {
      const clock = sinon.useFakeTimers();
      try {
        const card = document.createElement('div');
        const pricing = document.createElement('p');
        const price = document.createElement('mas-field');
        price.setAttribute('field', 'prices');
        price.checkReady = () => new Promise(() => {}); // never resolves
        pricing.append(price);
        const actionArea = document.createElement('p');
        actionArea.append(document.createElement('a'));
        card.append(pricing, actionArea);

        holdCtaUntilPrice(actionArea);
        expect(actionArea.style.visibility).to.equal('hidden');

        await clock.tickAsync(5000); // mirrors FIELD_TIMEOUT in merch.js
        expect(actionArea.style.visibility).to.equal('');
      } finally {
        clock.restore();
      }
    });

    it('does not hold the CTA when the only price is outside the block (walk stops at .section)', () => {
      const section = document.createElement('div');
      section.classList.add('section');
      // Price sits directly under the section, not inside the CTA's block subtree.
      const otherPricing = document.createElement('p');
      const price = document.createElement('mas-field');
      price.setAttribute('field', 'prices');
      price.checkReady = () => new Promise(() => {});
      otherPricing.append(price);

      const block = document.createElement('div');
      const actionArea = document.createElement('p');
      actionArea.append(document.createElement('a'));
      block.append(actionArea);

      section.append(otherPricing, block);
      document.body.append(section);

      holdCtaUntilPrice(actionArea);
      expect(actionArea.style.visibility).to.equal('');

      section.remove();
    });

    it('upgrades plain commerce links and decorates using block context', async () => {
      const section = document.createElement('div');
      const siblingBtn = document.createElement('a');
      siblingBtn.classList.add('con-button', 'blue', 'button-xl');
      section.append(siblingBtn);

      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=checkout-1&field=ctas-checkout';
      a.textContent = '[[checkout-test:ctas-checkout]]';
      strong.append(a);
      p.append(strong);
      section.append(p);
      document.body.append(section);

      await init(a);

      const masField = p.querySelector('mas-field');
      expect(masField).to.exist;
      const link = masField.querySelector('a.con-button.blue.button-xl');
      expect(link).to.exist;
    });

    it('adds button-justified-mobile to a hero-marquee CTA with no decorated sibling', async () => {
      setConfig({ codeRoot: '/libs' });
      const section = document.createElement('div');
      section.classList.add('section');
      const block = document.createElement('div');
      block.classList.add('hero-marquee');

      // Single headless CTA, no already-decorated sibling button in the block.
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=hero-solo-cta-1&field=ctas';
      a.textContent = '[[hero-cta:ctas]]';
      strong.append(a);
      p.append(strong);
      block.append(p);
      section.append(block);
      document.body.append(section);

      await init(a);

      const masField = p.querySelector('mas-field');
      expect(masField).to.exist;
      const link = masField.querySelector('a.con-button');
      expect(link).to.exist;
      expect(link.classList.contains('button-xl')).to.be.true;
      expect(link.classList.contains('button-justified-mobile')).to.be.true;
    });

    it('keeps button-xl on late CTAs when a sibling con-button has no size class', async () => {
      // A pre-existing unsized con-button (e.g. a mas-field footer CTA, self-styled with
      // con-button but no size) must NOT be used as the size reference, or button-xl is
      // dropped. Two unsized con-buttons resolving late stand in for that case.
      setConfig({ codeRoot: '/libs' });
      const section = document.createElement('div');
      section.classList.add('section');
      const block = document.createElement('div');
      block.classList.add('hero-marquee');
      const p = document.createElement('p');
      p.innerHTML = `
        <em><mas-field field="ctas[0]"><span data-role="mas-field-content"><a class="button con-button outline" is="checkout-link" href="https://commerce.adobe.com/">Free trial</a></span></mas-field></em>
        <strong><mas-field field="ctas[1]"><span data-role="mas-field-content"><a class="button con-button blue" is="checkout-link" href="https://commerce.adobe.com/">Buy now</a></span></mas-field></strong>`;
      block.append(p);
      section.append(block);
      document.body.append(section);

      // watchMasFieldCtas is registered on first init (module-level); prior tests did that.
      // Dispatch the late mas:ready from each mas-field, as the real component does.
      [...p.querySelectorAll('mas-field')].forEach((mf) => {
        mf.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true, composed: true }));
      });
      await new Promise((resolve) => { setTimeout(resolve, 0); });

      expect(p.querySelectorAll('mas-field').length).to.equal(2);
      const links = [...p.querySelectorAll('mas-field a.con-button')];
      expect(links.length).to.equal(2);
      links.forEach((link) => expect(link.classList.contains('button-xl')).to.be.true);
    });

    it('upgrades a late plain commerce CTA to checkout-link on mas:ready (MWPW-201497)', async () => {
      // Regression: a CTA that resolves after its block decorated fires mas:ready and is
      // hoisted, but the late path skipped upgradeCommerceLinks — so the anchor got button
      // classes yet no is="checkout-link", leaving it unhydrated (no href, no modal).
      setConfig({ codeRoot: '/libs' });
      const section = document.createElement('div');
      section.classList.add('section');
      const block = document.createElement('div');
      block.classList.add('hero-marquee');
      const p = document.createElement('p');
      p.innerHTML = '<em><mas-field field="ctas[0]"><span data-role="mas-field-content">'
        + '<a data-wcs-osi="abc" data-checkout-workflow="UCv3" data-modal="twp">Free trial</a>'
        + '</span></mas-field></em>';
      block.append(p);
      section.append(block);
      document.body.append(section);

      // Late resolution: the component fires mas:ready after the block already decorated.
      p.querySelector('mas-field').dispatchEvent(
        new CustomEvent('mas:ready', { bubbles: true, composed: true }),
      );
      await new Promise((resolve) => { setTimeout(resolve, 0); });

      expect(p.querySelectorAll('mas-field').length).to.equal(1);
      const link = p.querySelector('mas-field a[data-wcs-osi]');
      expect(link, 'CTA anchor should be hoisted').to.exist;
      expect(link.outerHTML).to.include('is="checkout-link"');
      expect(link.classList.contains('con-button')).to.be.true;
    });

    it('decorates two CTAs in the same paragraph correctly when processed concurrently', async () => {
      setConfig({ codeRoot: '/libs' });
      const section = document.createElement('div');
      const siblingBtn = document.createElement('a');
      siblingBtn.classList.add('con-button', 'blue', 'button-l');
      section.append(siblingBtn);

      // Two CTA mas-field links in the same <p> — mirrors the marquee pattern
      const p = document.createElement('p');
      // Use ctas-checkout which renders a plain <a> — same as real MAS checkout links
      const em = document.createElement('em');
      const a1 = document.createElement('a');
      a1.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=two-ctas-1&field=ctas-checkout';
      a1.textContent = '[[cta1]]';
      em.append(a1);

      const strong = document.createElement('strong');
      const a2 = document.createElement('a');
      a2.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=two-ctas-1&field=ctas-checkout';
      a2.textContent = '[[cta2]]';
      strong.append(a2);

      p.append(em, strong);
      section.append(p);
      document.body.append(section);

      await Promise.all([init(a1), init(a2)]);

      expect(document.querySelectorAll('mas-field').length).to.equal(2);
      // Both CTAs should be decorated — outline for em, blue for strong
      const outline = p.querySelector('mas-field a.con-button.outline');
      const blue = p.querySelector('mas-field a.con-button.blue');
      expect(outline).to.exist;
      expect(blue).to.exist;
      expect(outline.classList.contains('button-l')).to.be.true;
      expect(blue.classList.contains('button-l')).to.be.true;
    });

    it('passes mask and pzn to aem-fragment in createInline', async () => {
      setConfig({ codeRoot: '/libs' });
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=mask-pzn-inline-1&mask=baz&pzn=qux&field=prices';
      document.body.append(a);
      await init(a);
      const frag = document.querySelector('mas-field aem-fragment');
      expect(frag.getAttribute('mask')).to.equal('baz');
      expect(frag.getAttribute('pzn')).to.equal('qux');
    });

    it('make preview links relative in createInline', async () => {
      setConfig({ codeRoot: '/libs' });
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=mask-pzn-inline-1&field=ctas';
      const div = document.createElement('div');
      div.appendChild(a);
      document.body.append(div);
      await init(a);
      expect(document.querySelector('.con-button.outline').getAttribute('href')).to.equal('/some/test/page');
    });

    it('preserves Milo typography classes on parent heading when inline fragment stays inline', async () => {
      const heading = document.createElement('h1');
      heading.id = 'heading-milo-class-test';
      heading.classList.add('heading-xxxl');
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=milo-class-inline-1&field=prices';
      a.textContent = '[[milo-class-inline-test:prices]]';
      heading.append(a);
      document.body.append(heading);

      await init(a);

      const heading1 = document.querySelector('#heading-milo-class-test');
      expect(heading1).to.exist;
      expect(heading1.classList.contains('heading-xxxl')).to.be.true;
    });
  });

  describe('MEP Highlight M@S Content markers', () => {
    // Defensive clear — prior describes can leak async-hydrated <mas-field> nodes.
    beforeEach(() => { document.body.innerHTML = ''; });
    afterEach(() => { document.body.innerHTML = ''; });

    it('createInline stamps data-mas-block=inline and captures original href on the mas-field wrapper when mep.preview is on', async () => {
      setConfig({ codeRoot: '/libs', autoBlocks: [{}], mep: { preview: true } });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&query=9de46774-dafe-4f3e-badd-0cbeed37ea08&field=description';
      const a = document.createElement('a');
      a.href = studioHref;
      a.textContent = '[[my-card:description]]';
      const wrap = document.createElement('div');
      wrap.id = 'mep-inline-test-wrap';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const masField = wrap.querySelector('mas-field');
      expect(masField, 'mas-field should be created inside the test container').to.exist;
      expect(masField.dataset.masBlock).to.equal('inline');
      expect(mepMasStudioUrls.get(masField)).to.equal(studioHref);
    });

    it('createInline does NOT stamp data-mas-block or capture href when mep.preview is off', async () => {
      setConfig({ codeRoot: '/libs', autoBlocks: [{}] });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&query=9de46774-dafe-4f3e-badd-0cbeed37ea08&field=description';
      const a = document.createElement('a');
      a.href = studioHref;
      a.textContent = '[[my-card:description]]';
      const wrap = document.createElement('div');
      wrap.id = 'mep-inline-test-wrap-off';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const masField = wrap.querySelector('mas-field');
      expect(masField, 'mas-field should be created inside the test container').to.exist;
      expect(masField.dataset.masBlock).to.equal(undefined);
      expect(mepMasStudioUrls.get(masField)).to.equal(undefined);
    });
  });
});
