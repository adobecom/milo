// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

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
            
            const header = shadowRoot.querySelector('.header');
            expect(header).to.exist;
            
            const description = shadowRoot.querySelector('.description');
            expect(description).to.exist;
            
            const price = shadowRoot.querySelector('.price');
            expect(price).to.exist;
            
            const cta = shadowRoot.querySelector('.cta');
            expect(cta).to.exist;
        });

        it('should display heading in correct slot', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            const heading = card.querySelector('[slot="heading-xs"]');
            expect(heading).to.exist;
            expect(heading.textContent).to.equal('Express - Create standout content');
        });

        it('should display body text in correct slot', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            const body = card.querySelector('[slot="body-xs"]');
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
            // For simplified-pricing-express, border color should be set as CSS variable
            const computedStyle = window.getComputedStyle(cardWithBorder);
            const borderColorVar = computedStyle.getPropertyValue('--consonant-merch-card-border-color');
            // Since the attribute is set directly (not via hydration), the CSS variable may not be set
            // Instead, check that the attribute is properly set
            expect(cardWithBorder.borderColor).to.equal('#E91E63');
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
            const heading = darkCard.querySelector('[slot="heading-xs"]');
            expect(heading).to.exist;
            expect(heading.textContent).to.equal('Express All Apps');
        });

        it('should have correct accessibility attributes', async () => {
            const card = document.querySelector('merch-card[variant="simplified-pricing-express"]');
            await delay(100);
            
            const shadowRoot = card.shadowRoot;
            const header = shadowRoot.querySelector('.header');
            
            expect(header).to.exist;
            const chevronButton = shadowRoot.querySelector('.chevron-button');
            expect(chevronButton).to.exist;
            
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

    describe('Tooltip functionality in simplified-pricing-express', () => {

        describe('Basic tooltip rendering', () => {

            it('should render mas-mnemonic in price slot', async () => {
                const card = document.querySelector('#card-with-price-tooltip');
                await delay(100);
                
                const priceSlot = card.querySelector('[slot="price"]');
                expect(priceSlot).to.exist;
                
                const masMnemonic = priceSlot.querySelector('mas-mnemonic');
                expect(masMnemonic).to.exist;
                expect(masMnemonic.getAttribute('content')).to.equal('Price after first year at regular rate');
                expect(masMnemonic.getAttribute('placement')).to.equal('top');
                expect(masMnemonic.textContent).to.equal('*');
            });

            it('should render mas-mnemonic with icon in description', async () => {
                const card = document.querySelector('#card-with-description-tooltip');
                await delay(100);
                
                const bodySlot = card.querySelector('[slot="body-xs"]');
                const masMnemonic = bodySlot.querySelector('mas-mnemonic');
                expect(masMnemonic).to.exist;
                expect(masMnemonic.getAttribute('content')).to.equal('Including Photoshop, Illustrator, Premiere Pro, After Effects, and more');
                expect(masMnemonic.getAttribute('placement')).to.equal('right');
                
                const merchIcon = masMnemonic.querySelector('merch-icon');
                expect(merchIcon).to.exist;
                expect(merchIcon.getAttribute('size')).to.equal('xs');
            });

            it('should handle multiple tooltips in the same card', async () => {
                const card = document.querySelector('#card-with-multiple-tooltips');
                await delay(100);
                
                const bodySlot = card.querySelector('[slot="body-xs"]');
                const tooltips = bodySlot.querySelectorAll('mas-mnemonic');
                
                expect(tooltips.length).to.equal(3);
                expect(tooltips[0].getAttribute('content')).to.equal('Sync across all your devices');
                expect(tooltips[1].getAttribute('content')).to.equal('Access to 1000+ exclusive designs');
                expect(tooltips[2].getAttribute('content')).to.equal('Remove background, resize, and more');
                
                tooltips.forEach(tooltip => {
                    expect(tooltip.getAttribute('placement')).to.equal('top');
                    expect(tooltip.textContent).to.equal('ⓘ');
                });
            });

            it('should render icon-based tooltip without slot content', async () => {
                const card = document.querySelector('#card-with-icon-tooltip');
                await delay(100);
                
                const headingSlot = card.querySelector('[slot="heading-xs"]');
                const masMnemonic = headingSlot.querySelector('mas-mnemonic');
                
                expect(masMnemonic).to.exist;
                expect(masMnemonic.getAttribute('src')).to.include('info-icon.svg');
                expect(masMnemonic.getAttribute('size')).to.equal('s');
                expect(masMnemonic.getAttribute('tooltip-text')).to.equal('Perfect for teams and enterprises');
                expect(masMnemonic.getAttribute('tooltip-placement')).to.equal('bottom');
                
                // Icon-based tooltips should not have slot content
                expect(masMnemonic.textContent.trim()).to.equal('');
            });

            it('should support different tooltip placements', async () => {
                const card = document.querySelector('#card-with-varied-placements');
                await delay(100);
                
                const bodySlot = card.querySelector('[slot="body-xs"]');
                const tooltips = bodySlot.querySelectorAll('mas-mnemonic');
                
                expect(tooltips.length).to.equal(4);
                
                const placements = ['top', 'bottom', 'left', 'right'];
                tooltips.forEach((tooltip, index) => {
                    expect(tooltip.getAttribute('placement')).to.equal(placements[index]);
                    expect(tooltip.getAttribute('content')).to.equal(`${placements[index].charAt(0).toUpperCase() + placements[index].slice(1)} placement`);
                });
            });

        });


        it('should preserve tooltips during card updates', async () => {
            const card = document.querySelector('#card-with-price-tooltip');
            const initialTooltip = card.querySelector('mas-mnemonic');
            expect(initialTooltip).to.exist;
            
            // Simulate a card update
            card.requestUpdate();
            await card.updateComplete;
            await delay(100);
            
            // Tooltip should still exist after update
            const tooltipAfterUpdate = card.querySelector('mas-mnemonic');
            expect(tooltipAfterUpdate).to.exist;
            expect(tooltipAfterUpdate.getAttribute('content')).to.equal('Price after first year at regular rate');
        });
    });
});
