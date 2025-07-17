// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import { appendMiloStyles, delay } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await import('../src/mas.js');
    
    if (skipTests !== null) {
        appendMiloStyles();
        return;
    }
    
    describe('merch-card simplified-pricing-express variant', () => {
        it('should exist in the HTML document', async () => {
            expect(document.querySelector('merch-card[variant="simplified-pricing-express"]')).to.exist;
        });

        it('should render with correct structure', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            await delay(100);
            
            const shadowRoot = card.shadowRoot;
            expect(shadowRoot).to.exist;
            
            // Check for variant-specific structure
            const container = shadowRoot.querySelector('.body');
            expect(container).to.exist;
            
            // Check for badge
            const badge = shadowRoot.querySelector('.badge');
            expect(badge).to.exist;
        });

        it('should display heading in correct slot', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            const heading = card.querySelector('[slot="heading-l"]');
            expect(heading).to.exist;
            expect(heading.textContent).to.equal('Express - Create standout content');
        });

        it('should display body text in correct slot', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            const body = card.querySelector('[slot="body-s"]');
            expect(body).to.exist;
            expect(body.textContent).to.include('Make amazing social content');
        });

        it('should display badge with custom colors', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            expect(card.getAttribute('badge-background-color')).to.equal('#FFD700');
            expect(card.getAttribute('badge-color')).to.equal('#000000');
            expect(card.getAttribute('badge-text')).to.equal('LIMITED TIME');
        });

        it('should display price when provided', async () => {
            const cardWithPrice = document.querySelectorAll('merch-card[variant="simplified-pricing-express"]')[1];
            const price = cardWithPrice.querySelector('[slot="price"]');
            expect(price).to.exist;
            expect(price.getAttribute('is')).to.equal('inline-price');
        });

        it('should support custom border color', async () => {
            const cardWithBorder = document.querySelector('merch-card[border-color="#E91E63"]');
            expect(cardWithBorder).to.exist;
            expect(cardWithBorder.getAttribute('border-color')).to.equal('#E91E63');
            
            await delay(100);
            const shadowRoot = cardWithBorder.shadowRoot;
            const style = shadowRoot.querySelector('style');
            expect(style.textContent).to.include('--merch-card-border-color: #E91E63');
        });

        it('should support multiple CTAs', async () => {
            const cardWithMultipleCtas = document.querySelectorAll('merch-card[variant="simplified-pricing-express"]')[2];
            const ctas = cardWithMultipleCtas.querySelectorAll('[slot="cta"]');
            expect(ctas.length).to.equal(2);
            expect(ctas[0].textContent).to.equal('Learn more');
            expect(ctas[1].textContent).to.equal('Buy now');
        });

        it('should handle badge when no background color provided', async () => {
            const cardNoBadgeBg = document.querySelector('merch-card[border-color="#FF5722"]');
            expect(cardNoBadgeBg.hasAttribute('badge-background-color')).to.be.false;
            
            await delay(100);
            const shadowRoot = cardNoBadgeBg.shadowRoot;
            const badge = shadowRoot.querySelector('.badge');
            expect(badge).to.not.exist; // No badge should render without text
        });

        it('should work in dark theme', async () => {
            const darkCard = document.querySelector('.dark merch-card[variant="simplified-pricing-express"]');
            expect(darkCard).to.exist;
            
            // Verify the card still renders correctly in dark theme
            const heading = darkCard.querySelector('[slot="heading-l"]');
            expect(heading).to.exist;
            expect(heading.textContent).to.equal('Express All Apps');
        });

        it('should have correct accessibility attributes', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            await delay(100);
            
            const shadowRoot = card.shadowRoot;
            const container = shadowRoot.querySelector('.body');
            
            // Check for semantic structure
            expect(container).to.exist;
            
            // Verify focusable elements
            const links = card.querySelectorAll('a[slot="cta"]');
            links.forEach(link => {
                expect(link.hasAttribute('href')).to.be.true;
            });
        });

        it('should return title from heading slot', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            const title = card.title;
            expect(title).to.equal('Express - Create standout content');
        });
    });
});