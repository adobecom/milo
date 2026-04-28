import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

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
          content.innerHTML = '<h3><strong>Resolved description</strong></h3><a href="https://www.adobe.com/">See terms</a>';
        } else if (field === 'ctas') {
          content.innerHTML = '<strong><a href="https://www.adobe.com/">Buy now</a></strong>';
        } else if (field === 'ctas-checkout') {
          // Simulates a plain commerce link (no em/strong from MAS — e.g. checkout-link)
          content.innerHTML = '<a is="checkout-link" href="https://commerce.adobe.com/">Buy now</a>';
        } else {
          content.textContent = 'Resolved inline value';
        }
        this.append(content);
      }
      return Promise.resolve(Boolean(this));
    }
  });
}

const { default: init } = await import('../../../libs/blocks/merch-card-autoblock/merch-card-autoblock.js');

const originalFetch = window.fetch;
const { adobeIMS } = window;
// const delay = (timeout = 100) => new Promise((resolve) => setTimeout(resolve, timeout));
async function mockIms(countryCode) {
  window.adobeIMS = {
    initialized: true,
    isSignedInUser: () => !!countryCode,
    async getProfile() {
      // await delay(1);
      return { countryCode };
    },
  };
}

function unmockIms() {
  window.adobeIMS = adobeIMS;
}

describe('merch-card-autoblock autoblock', () => {
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
          if (res.ok) {
            if (url.includes('/mas/io/fragment?id=1234')) {
              const responseBody = JSON.stringify(await res.json()).replaceAll('Creative Cloud All Apps', 'Creative Cloud All Apps PROMO');
              return new Response(responseBody, { status: 200 });
            }
            return res;
          }
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
    });

    it('creates card', async () => {
      const config = {
        codeRoot: '/libs',
        autoBlocks: [{ }],
      };
      setConfig(config);
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      content.append(a);
      document.body.append(content);
      await init(a);
      const card = document.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps');
      const openModalLink = card.querySelector('.should-open-modal');
      expect(openModalLink?.getAttribute('href')).to.equal('#cardmodal');
      expect(openModalLink?.getAttribute('data-modal-path')).to.equal('/test/fragments/modal');
      expect(openModalLink?.classList.contains('modal')).to.be.true;
    });

    it('override card if mep replace tells to do', async () => {
      setConfig({
        mep: {
          preview: true,
          inBlock: {
            mas: {
              fragments: {
                a657fd3d9f67: {
                  action: 'replace',
                  manifestId: 'promo1.json',
                  content: '1234',
                },
              },
            },
          },
        },
      });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=a657fd3d9f67');
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      content.append(a);
      document.body.append(content);
      await init(a);
      const card = document.querySelector('merch-card');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.equal('Creative Cloud All Apps PROMO');
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
      section.append(p);
      document.body.append(section);

      await init(a);

      expect(document.querySelector('mas-field')).to.not.exist;
      const link = p.querySelector('a.con-button');
      expect(link).to.exist;
      expect(link.classList.contains('blue')).to.be.true;
      expect(link.classList.contains('button-l')).to.be.true;
      expect(link.classList.contains('button-justified-mobile')).to.be.true;
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

      expect(document.querySelector('mas-field')).to.not.exist;
      const link = p.querySelector('a.con-button.blue.button-xl');
      expect(link).to.exist;
    });

    it('decorates two CTAs in the same paragraph correctly when processed concurrently', async () => {
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

      expect(document.querySelectorAll('mas-field').length).to.equal(0);
      // Both CTAs should be decorated — outline for em, blue for strong
      const outline = p.querySelector('a.con-button.outline');
      const blue = p.querySelector('a.con-button.blue');
      expect(outline).to.exist;
      expect(blue).to.exist;
      expect(outline.classList.contains('button-l')).to.be.true;
      expect(blue.classList.contains('button-l')).to.be.true;
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

  describe('Simplified Pricing Express Card', () => {
    beforeEach(() => {
      window.fetch.restore();
      sinon.stub(window, 'fetch').callsFake(async (url) => {
        let fileName = '';
        if (url.includes('/mas/io/fragment')) {
          if (url.includes('simplified-pricing-express-1')) {
            return new Response(JSON.stringify({
              fields: {
                variant: 'simplified-pricing-express',
                cardTitle: 'Express - Create standout content',
                description: 'Make amazing social content, flyers, and more. Stand out with Adobe Express.',
                badge: 'LIMITED TIME OFFER',
                badgeColor: '#000000',
                badgeBackgroundColor: '#FFD700',
                ctas: '<strong><a href="https://www.adobe.com/express/">Start for free</a></strong>',
              },
            }), { status: 200 });
          }
          if (url.includes('simplified-pricing-express-2')) {
            return new Response(JSON.stringify({
              fields: {
                variant: 'simplified-pricing-express',
                cardTitle: 'Express Premium',
                description: 'Unlock premium templates, fonts, and features. Create without limits.',
                badge: 'BEST VALUE',
                badgeColor: '#000000',
                badgeBackgroundColor: '#00C853',
                prices: '<span is="inline-price" data-display-per-unit="false" data-display-old-price="false" data-display-recurrence="true" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M">US$9.99/mo</span>',
                ctas: '<strong><a href="https://www.adobe.com/express/pricing">Get Premium</a></strong>',
              },
            }), { status: 200 });
          }
          if (url.includes('simplified-pricing-express-3')) {
            return new Response(JSON.stringify({
              fields: {
                variant: 'simplified-pricing-express',
                cardTitle: 'Express with AI',
                description: 'Create content faster with AI-powered tools and generative features.',
                badge: 'NEW',
                borderColor: '#E91E63',
                prices: '<span is="inline-price" data-display-per-unit="false" data-display-old-price="true" data-display-recurrence="true" data-wcs-osi="C1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574O">US$19.99/mo</span>',
                ctas: '<strong><a href="https://www.adobe.com/express/ai">Try AI features</a></strong>',
              },
            }), { status: 200 });
          }
          if (url.includes('simplified-pricing-express-4')) {
            return new Response(JSON.stringify({
              fields: {
                variant: 'simplified-pricing-express',
                cardTitle: 'Express for teams',
                description: 'Collaborate on content creation with advanced sharing and brand controls.',
                badge: 'EXCLUSIVE',
                badgeColor: '#FFFFFF',
                badgeBackgroundColor: '#1976D2',
                prices: '<span is="inline-price" data-display-per-unit="false" data-display-old-price="false" data-display-recurrence="true" data-wcs-osi="B1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574N">US$14.99/mo</span>',
                ctas: '<em><a href="https://www.adobe.com/express/learn/guide">Learn more</a></em> <strong><a href="https://www.adobe.com/express/business">Buy now</a></strong>',
              },
            }), { status: 200 });
          }
          fileName = 'fragment.json';
        }
        if (url.includes('/web_commerce_artifact')) {
          fileName = 'artifact.json';
        }
        const result = await originalFetch(`/test/blocks/merch-card-autoblock/mocks/${fileName}`).then(async (res) => {
          if (res.ok) {
            return res;
          }
          throw new Error(
            `Failed to get fragment: ${res.status} ${res.statusText}`,
          );
        });
        return result;
      });
    });

    it('Supports Simplified Pricing Express card', async () => {
      setConfig({ codeRoot: '/libs' });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=simplified-pricing-express-1');
      a.textContent = 'merch-card: Simplified Pricing Express';
      content.append(a);
      document.body.append(content);

      await init(a);
      const card = document.querySelector('merch-card');
      expect(card).to.exist;

      // Wait for the card to be fully hydrated
      await new Promise((resolve) => { setTimeout(resolve, 500); });

      expect(card.getAttribute('variant')).to.equal('simplified-pricing-express');
      expect(card.querySelector('[slot="heading-xs"]')?.textContent).to.include('Express - Create standout content');
      expect(card.querySelector('[slot="body-xs"]')?.textContent).to.include('Make amazing social content');
      // Badge is rendered as a merch-badge element in slot, not as attributes
      const badgeSlot = card.querySelector('[slot="badge"]');
      expect(badgeSlot).to.exist;
      const badge = badgeSlot.querySelector('merch-badge');
      expect(badge).to.exist;
      // merch-badge uses shadow DOM, check the text content in shadow
      const badgeText = badge.shadowRoot?.querySelector('.badge')?.textContent?.trim();
      expect(badgeText).to.equal('LIMITED TIME OFFER');
      expect(badge.getAttribute('background-color')).to.equal('#FFD700');
    });

    it('Supports Simplified Pricing Express card with price', async () => {
      document.body.innerHTML = ''; // Clear previous test content
      setConfig({ codeRoot: '/libs' });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=simplified-pricing-express-2');
      a.textContent = 'merch-card: Simplified Pricing Express with Price';
      content.append(a);
      document.body.append(content);

      await init(a);
      const card = document.querySelector('merch-card');
      expect(card).to.exist;

      await new Promise((resolve) => { setTimeout(resolve, 500); });

      expect(card.querySelector('[slot="price"]')).to.exist;
      // Badge is rendered as a merch-badge element
      const badgeSlot = card.querySelector('[slot="badge"]');
      expect(badgeSlot).to.exist;
      const badge = badgeSlot.querySelector('merch-badge');
      expect(badge).to.exist;
      const badgeText = badge.shadowRoot?.querySelector('.badge')?.textContent?.trim();
      expect(badgeText).to.equal('BEST VALUE');
      expect(badge.getAttribute('background-color')).to.equal('#00C853');
    });

    it('Supports Simplified Pricing Express card with custom border color', async () => {
      document.body.innerHTML = ''; // Clear previous test content
      setConfig({ codeRoot: '/libs' });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=simplified-pricing-express-3');
      a.textContent = 'merch-card: Simplified Pricing Express with Border';
      content.append(a);
      document.body.append(content);

      await init(a);
      const card = document.querySelector('merch-card');
      expect(card).to.exist;

      await new Promise((resolve) => { setTimeout(resolve, 500); });

      // Border color is set via borderColor field
      await new Promise((resolve) => { setTimeout(resolve, 500); });
      // Check if border color is set as a CSS variable or attribute
      const borderColor = card.getAttribute('border-color') || card.style.getPropertyValue('--merch-card-custom-border-color');
      expect(borderColor).to.exist;
      // Badge is rendered as a merch-badge element
      const badgeSlot = card.querySelector('[slot="badge"]');
      expect(badgeSlot).to.exist;
      const badge = badgeSlot.querySelector('merch-badge');
      expect(badge).to.exist;
      const badgeText = badge.shadowRoot?.querySelector('.badge')?.textContent?.trim();
      expect(badgeText).to.equal('NEW');
    });

    it('Supports Simplified Pricing Express card with multiple CTAs', async () => {
      document.body.innerHTML = ''; // Clear previous test content
      setConfig({ codeRoot: '/libs' });
      const content = document.createElement('div');
      content.classList.add('content');
      const a = document.createElement('a');
      a.setAttribute('href', 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&fragment=simplified-pricing-express-4');
      a.textContent = 'merch-card: Simplified Pricing Express with Multiple CTAs';
      content.append(a);
      document.body.append(content);

      await init(a);
      const card = document.querySelector('merch-card');
      expect(card).to.exist;

      await new Promise((resolve) => { setTimeout(resolve, 500); });

      // CTAs are processed into a single slot with multiple buttons/links
      const ctaSlot = card.querySelector('[slot="cta"]');
      expect(ctaSlot).to.exist;
      const ctaButtons = ctaSlot.querySelectorAll('a, button');
      expect(ctaButtons.length).to.equal(2);
      // Badge is rendered as a merch-badge element
      const badgeSlot = card.querySelector('[slot="badge"]');
      expect(badgeSlot).to.exist;
      const badge = badgeSlot.querySelector('merch-badge');
      expect(badge).to.exist;
      const badgeText = badge.shadowRoot?.querySelector('.badge')?.textContent?.trim();
      expect(badgeText).to.equal('EXCLUSIVE');
      expect(badge.getAttribute('background-color')).to.equal('#1976D2');
      // Badge color is disabled for simplified-pricing-express variant
    });
  });
});
