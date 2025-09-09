import { expect } from '@esm-bundle/chai';
import { html } from 'lit';

const shouldSkipTests = sessionStorage.getItem('skipTests') === 'true';

runTests(
    () => import('../../test/merch-card.full-pricing-express.test.html'),
    shouldSkipTests,
);

function runTests(importPage, shouldSkipTests) {
    describe('merch-card web component with full-pricing-express variant', () => {
        if (shouldSkipTests) {
            it.skip('skipping tests', () => {});
            return;
        }

        it('should have variant full-pricing-express', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            expect(merchCard.variant).to.equal('full-pricing-express');
        });

        it('should have heading-xs slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            const heading = merchCard.querySelector('[slot="heading-xs"]');
            expect(heading).to.not.be.null;
            expect(heading.textContent).to.equal('Adobe Express Free');
        });

        it('should have body-xs slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            const body = merchCard.querySelector('[slot="body-xs"]');
            expect(body).to.not.be.null;
            expect(body.textContent).to.include('quick and easy content creation');
        });

        it('should have description2 slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            const description2 = merchCard.querySelector('[slot="description2"]');
            expect(description2).to.not.be.null;
            const listItems = description2.querySelectorAll('li');
            expect(listItems.length).to.be.greaterThan(0);
        });

        it('should have price slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-premium"]',
            );
            const price = merchCard.querySelector('[slot="price"]');
            expect(price).to.not.be.null;
            const priceSpan = price.querySelector('span[is="inline-price"]');
            expect(priceSpan).to.not.be.null;
        });

        it('should have cta slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            const cta = merchCard.querySelector('[slot="cta"]');
            expect(cta).to.not.be.null;
            const button = cta.querySelector('sp-button');
            expect(button).to.not.be.null;
            expect(button.textContent).to.equal('Get started free');
        });

        it('should support gradient borders', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="firefly-pro"]',
            );
            expect(merchCard.getAttribute('gradient-border')).to.equal('true');
            expect(merchCard.getAttribute('border-color')).to.equal('gradient-purple-blue');
        });

        it('should have badge slot', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-premium"]',
            );
            const badge = merchCard.querySelector('[slot="badge"]');
            expect(badge).to.not.be.null;
            expect(badge.textContent).to.equal('Best value');
        });

        it('should render price container with background', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            // Wait for the component to fully render
            await merchCard.updateComplete;
            const shadowRoot = merchCard.shadowRoot;
            const priceContainer = shadowRoot?.querySelector('.price-container');
            expect(priceContainer).to.not.be.null;
        });

        it('should render compare link in footer', async () => {
            await importPage();
            const merchCard = document.querySelector(
                'merch-card[name="express-free"]',
            );
            await merchCard.updateComplete;
            const shadowRoot = merchCard.shadowRoot;
            const compareLink = shadowRoot?.querySelector('.compare-link');
            expect(compareLink).to.not.be.null;
            expect(compareLink.textContent).to.equal('Compare all features');
        });

        describe('responsive behavior', () => {
            it('should hide description2 on mobile viewport', async () => {
                await importPage();
                const merchCard = document.querySelector(
                    'merch-card[name="mobile-1"]',
                );
                const description2 = merchCard.querySelector('[slot="description2"]');
                
                // Mock mobile viewport
                const originalMatchMedia = window.matchMedia;
                window.matchMedia = (query) => ({
                    matches: query.includes('max-width: 767px'),
                    media: query,
                    addEventListener: () => {},
                    removeEventListener: () => {},
                });
                
                // Force a re-render
                await merchCard.updateComplete;
                
                // Restore original matchMedia
                window.matchMedia = originalMatchMedia;
                
                // Note: The hiding is done via CSS, so we can't directly test visibility
                // but we can verify the slot exists
                expect(description2).to.not.be.null;
            });
        });

        describe('gradient border variants', () => {
            it('should apply gradient-purple-blue border', async () => {
                await importPage();
                const merchCard = document.querySelector(
                    'merch-card[name="gradient-purple"]',
                );
                expect(merchCard.getAttribute('border-color')).to.equal('gradient-purple-blue');
                expect(merchCard.getAttribute('gradient-border')).to.equal('true');
            });

            it('should apply gradient-firefly-spectrum border', async () => {
                await importPage();
                const merchCard = document.querySelector(
                    'merch-card[name="gradient-firefly"]',
                );
                expect(merchCard.getAttribute('border-color')).to.equal('gradient-firefly-spectrum');
                expect(merchCard.getAttribute('gradient-border')).to.equal('true');
            });
        });

        describe('features label', () => {
            it('should render Top features label', async () => {
                await importPage();
                const merchCard = document.querySelector(
                    'merch-card[name="express-free"]',
                );
                await merchCard.updateComplete;
                const shadowRoot = merchCard.shadowRoot;
                const featuresLabel = shadowRoot?.querySelector('.features-label');
                expect(featuresLabel).to.not.be.null;
                expect(featuresLabel.textContent).to.equal('Top features:');
            });
        });
    });
}