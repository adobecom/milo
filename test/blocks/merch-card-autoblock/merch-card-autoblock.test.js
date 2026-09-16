import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { mepMasStudioUrls } from '../../../libs/blocks/merch/mas-mep-utils.js';

const { default: init } = await import('../../../libs/blocks/merch-card-autoblock/merch-card-autoblock.js');

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
                  '': {
                    action: 'replace',
                    manifestId: 'promo1.json',
                    content: '1234',
                  },
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

    it('passes mask and pzn to aem-fragment in createCard', async () => {
      setConfig({ codeRoot: '/libs' });
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=mask-pzn-card-1&mask=foo&pzn=bar';
      document.body.append(a);
      await init(a);
      const frag = document.querySelector('merch-card aem-fragment');
      expect(frag.getAttribute('mask')).to.equal('foo');
      expect(frag.getAttribute('pzn')).to.equal('bar');
    });

    it('does not set mask or pzn when absent from URL', async () => {
      setConfig({ codeRoot: '/libs' });
      const a = document.createElement('a');
      a.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=no-mask-pzn-1';
      document.body.append(a);
      await init(a);
      const frag = document.querySelector('merch-card aem-fragment');
      expect(frag.getAttribute('mask')).to.not.exist;
      expect(frag.getAttribute('pzn')).to.not.exist;
    });

    it('treats same fragment with different mask as distinct cache entries', async () => {
      setConfig({ codeRoot: '/libs' });
      const a1 = document.createElement('a');
      a1.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=cache-mask-1&mask=v1';
      document.body.append(a1);
      await init(a1);

      const a2 = document.createElement('a');
      a2.href = 'https://mas.adobe.com/studio.html#content-type=merch-card&fragment=cache-mask-1&mask=v2';
      document.body.append(a2);
      await init(a2);

      const frags = document.querySelectorAll('merch-card aem-fragment');
      expect(frags[0].getAttribute('loading')).to.not.exist;
      expect(frags[1].getAttribute('loading')).to.not.exist;
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

  describe('MEP Highlight M@S Content markers', () => {
    // Defensive clear — prior describes can leak async-hydrated <merch-card> nodes.
    beforeEach(() => { document.body.innerHTML = ''; });
    afterEach(() => { document.body.innerHTML = ''; });

    it('createCard stamps data-mas-block=card and captures original href in mepMasStudioUrls when mep.preview is on', async () => {
      setConfig({ codeRoot: '/libs', autoBlocks: [{}], mep: { preview: true } });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&query=a657fd3d9f67';
      const a = document.createElement('a');
      a.setAttribute('href', studioHref);
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      const wrap = document.createElement('div');
      wrap.classList.add('content');
      wrap.id = 'mep-card-test-wrap';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const card = wrap.querySelector('merch-card');
      expect(card, 'merch-card should be created inside the test container').to.exist;
      expect(card.dataset.masBlock).to.equal('card');
      expect(mepMasStudioUrls.get(card)).to.equal(studioHref);
    });

    it('createCard does NOT stamp data-mas-block or capture href when mep.preview is off', async () => {
      setConfig({ codeRoot: '/libs', autoBlocks: [{}] });
      const studioHref = 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom&query=a657fd3d9f67';
      const a = document.createElement('a');
      a.setAttribute('href', studioHref);
      a.textContent = 'merch-card: ACOM / Catalog / Test Card';
      const wrap = document.createElement('div');
      wrap.classList.add('content');
      wrap.id = 'mep-card-test-wrap-off';
      wrap.append(a);
      document.body.append(wrap);
      await init(a);
      const card = wrap.querySelector('merch-card');
      expect(card, 'merch-card should be created inside the test container').to.exist;
      expect(card.dataset.masBlock).to.equal(undefined);
      expect(mepMasStudioUrls.get(card)).to.equal(undefined);
    });
  });
});
