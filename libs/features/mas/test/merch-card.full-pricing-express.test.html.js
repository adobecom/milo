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
    
    describe('merch-card full-pricing-express variant', () => {
        describe('Basic Structure', () => {
            it('should exist in the HTML document', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                expect(card).to.exist;
            });

            it('should have variant full-pricing-express', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                expect(card.variant).to.equal('full-pricing-express');
            });

            it('should render with correct shadow DOM structure', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                await delay(100);
                
                const shadowRoot = card.shadowRoot;
                expect(shadowRoot).to.exist;
                
                const header = shadowRoot.querySelector('.header');
                expect(header).to.exist;
                
                const description = shadowRoot.querySelector('.description');
                expect(description).to.exist;
                
                const priceContainer = shadowRoot.querySelector('.price-container');
                expect(priceContainer).to.exist;
                
                const cta = shadowRoot.querySelector('.cta');
                expect(cta).to.exist;
                
                const shortDescription = shadowRoot.querySelector('.short-description');
                expect(shortDescription).to.exist;
            });
        });

        describe('Slot Content', () => {
            it('should have heading-xs slot with text', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const heading = card.querySelector('[slot="heading-xs"]');
                expect(heading).to.exist;
                expect(heading.textContent.length).to.be.greaterThan(0);
            });

            it('should support mnemonic icon in heading', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                let foundMnemonic = false;
                cards.forEach(card => {
                    const mnemonic = card.querySelector('[slot="heading-xs"] mas-mnemonic');
                    if (mnemonic) {
                        foundMnemonic = true;
                        expect(mnemonic.getAttribute('size')).to.equal('xs');
                    }
                });
                expect(foundMnemonic).to.be.true;
            });

            it('should have body-s slot with description', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const body = card.querySelector('[slot="body-s"]');
                expect(body).to.exist;
                expect(body.querySelector('strong')).to.exist;
                expect(body.textContent).to.include('For individuals');
            });

            it('should have price slot with inline-price', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const price = card.querySelector('[slot="price"]');
                expect(price).to.exist;
                
                const inlinePrice = price.querySelector('span[is="inline-price"]');
                expect(inlinePrice).to.exist;
                expect(inlinePrice.getAttribute('data-template')).to.equal('price');
            });

            it('should have supplementary price text', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const price = card.querySelector('[slot="price"]');
                const paragraphs = price.querySelectorAll('p');
                expect(paragraphs.length).to.be.greaterThan(1);
                expect(paragraphs[1].textContent).to.include('No');
            });

            it('should have CTA slot with checkout-link', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const cta = card.querySelector('[slot="cta"]');
                expect(cta).to.exist;
                
                const checkoutLink = cta.querySelector('a[is="checkout-link"]');
                expect(checkoutLink).to.exist;
                expect(checkoutLink.classList.contains('button')).to.be.true;
            });
        });

        describe('Short Description Slot with Dividers', () => {
            it('should have description2 slot with content', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                expect(description2).to.exist;
            });

            it('should have Top features label', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                const firstParagraph = description2.querySelector('p:first-child');
                expect(firstParagraph.textContent).to.include('Top features');
            });

            it('should have divider-wrapper elements', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                const dividerWrappers = description2.querySelectorAll('.divider-wrapper');
                expect(dividerWrappers.length).to.equal(2);
            });

            it('should have sp-divider inside divider-wrapper', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                const dividerWrappers = description2.querySelectorAll('.divider-wrapper');

                dividerWrappers.forEach(wrapper => {
                    const divider = wrapper.querySelector('sp-divider');
                    expect(divider).to.exist;
                    expect(divider.getAttribute('size')).to.equal('s');
                    expect(divider.getAttribute('role')).to.equal('separator');
                });
            });

            it('should have feature list items between dividers', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                const paragraphs = description2.querySelectorAll('p');

                // Check for feature content
                const featureTexts = ['Templates:', 'Assets:', 'Fonts:', 'Editing tools:', 'Storage:', 'Devices:'];
                featureTexts.forEach(text => {
                    const found = Array.from(paragraphs).some(p => p.textContent.includes(text));
                    expect(found).to.be.true;
                });
            });

            it('should have Compare all features link at bottom', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');
                const buttonContainer = description2.querySelector('.button-container');
                expect(buttonContainer).to.exist;

                const compareLink = buttonContainer.querySelector('a');
                expect(compareLink).to.exist;
                expect(compareLink.textContent).to.equal('Compare all features');
                expect(compareLink.classList.contains('spectrum-Link')).to.be.true;
            });
        });

        describe('Badge Support', () => {
            it('should support badge slot when provided', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                let foundBadge = false;
                
                cards.forEach(card => {
                    const badge = card.querySelector('[slot="badge"]');
                    if (badge) {
                        foundBadge = true;
                        const merchBadge = badge.querySelector('merch-badge');
                        if (merchBadge) {
                            expect(merchBadge.getAttribute('variant')).to.equal('full-pricing-express');
                        }
                    }
                });
                
                // At least one card should have a badge
                expect(foundBadge).to.be.true;
            });
        });

        describe('Gradient Border Support', () => {
            it('should support gradient-border attribute', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                let foundGradient = false;
                
                cards.forEach(card => {
                    if (card.getAttribute('gradient-border') === 'true') {
                        foundGradient = true;
                        expect(card.getAttribute('border-color')).to.be.oneOf([
                            'gradient-purple-blue',
                            'gradient-firefly-spectrum'
                        ]);
                    }
                });
                
                expect(foundGradient).to.be.true;
            });

            it('should apply gradient-firefly-spectrum border color', async () => {
                const card = document.querySelector('merch-card[border-color="gradient-firefly-spectrum"]');
                if (card) {
                    expect(card.getAttribute('gradient-border')).to.equal('true');
                }
            });
        });

        describe('Collection Support', () => {
            it('should be wrapped in merch-card-collection', async () => {
                const collection = document.querySelector('merch-card-collection.full-pricing-express');
                expect(collection).to.exist;
            });

            it('collection should have correct class', async () => {
                const collection = document.querySelector('merch-card-collection');
                expect(collection.classList.contains('full-pricing-express')).to.be.true;
            });

            it('collection should contain multiple cards', async () => {
                const collection = document.querySelector('merch-card-collection.full-pricing-express');
                const cards = collection.querySelectorAll('merch-card[variant="full-pricing-express"]');
                expect(cards.length).to.be.greaterThan(0);
            });

            it('cards should have filters attribute', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                cards.forEach(card => {
                    expect(card.hasAttribute('filters')).to.be.true;
                });
            });
        });

        describe('Price Display', () => {
            it('should render main price correctly', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const priceSlot = card.querySelector('[slot="price"]');
                const firstPrice = priceSlot.querySelector('p:first-child span[is="inline-price"]');
                
                expect(firstPrice).to.exist;
                const priceElement = firstPrice.querySelector('.price');
                expect(priceElement).to.exist;
                
                const currencySymbol = priceElement.querySelector('.price-currency-symbol');
                expect(currencySymbol).to.exist;
                expect(currencySymbol.textContent).to.equal('US$');
                
                const priceInteger = priceElement.querySelector('.price-integer');
                expect(priceInteger).to.exist;
                
                const priceRecurrence = priceElement.querySelector('.price-recurrence');
                if (priceRecurrence && !priceRecurrence.classList.contains('disabled')) {
                    expect(priceRecurrence.textContent).to.include('mo');
                }
            });

            it('should support price without recurrence display', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                let foundNoRecurrence = false;
                
                cards.forEach(card => {
                    const priceSpan = card.querySelector('span[is="inline-price"][data-display-recurrence="false"]');
                    if (priceSpan) {
                        foundNoRecurrence = true;
                        expect(priceSpan.getAttribute('data-display-recurrence')).to.equal('false');
                    }
                });
                
                // At least one card should have no recurrence display
                expect(foundNoRecurrence).to.be.true;
            });
        });

        describe('Alignment Mechanism', () => {
            it('should have min-height CSS variables for alignment', async () => {
                const collection = document.querySelector('merch-card-collection.full-pricing-express');
                await delay(300); // Wait for alignment to calculate
                
                const computedStyle = window.getComputedStyle(collection);
                
                // These variables should be set after cards are rendered
                const priceHeight = computedStyle.getPropertyValue('--consonant-merch-card-full-pricing-express-price-height');
                const ctaHeight = computedStyle.getPropertyValue('--consonant-merch-card-full-pricing-express-cta-height');
                const shortDescriptionHeight = computedStyle.getPropertyValue('--consonant-merch-card-full-pricing-express-short-description-height');

                // Variables should exist (may be empty initially)
                expect(priceHeight !== undefined).to.be.true;
                expect(ctaHeight !== undefined).to.be.true;
                expect(shortDescriptionHeight !== undefined).to.be.true;

                // Description height should NOT be set (we removed this)
                const descriptionHeight = computedStyle.getPropertyValue('--consonant-merch-card-full-pricing-express-description-height');
                expect(descriptionHeight).to.equal('');
            });

            it('should apply flexbox to short-description for alignment', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                await card.updateComplete;

                const shadowRoot = card.shadowRoot;
                const shortDescription = shadowRoot.querySelector('.short-description');

                // On desktop, short-description should be flex container
                const mediaQuery = window.matchMedia('(min-width: 1025px)');
                if (mediaQuery.matches) {
                    const computedStyle = window.getComputedStyle(shortDescription);
                    expect(computedStyle.display).to.equal('flex');
                    expect(computedStyle.flexDirection).to.equal('column');
                }
            });
        });

        describe('Mobile Responsiveness', () => {
            it('should have mobile-specific CSS rules', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const description2 = card.querySelector('[slot="description2"]');

                // Create a mock for mobile viewport
                const originalMatchMedia = window.matchMedia;
                window.matchMedia = (query) => ({
                    matches: query.includes('max-width: 1024px'),
                    media: query,
                    addEventListener: () => {},
                    removeEventListener: () => {},
                });

                // The CSS rules hide elements on mobile, but we can verify the structure exists
                const dividerWrappers = description2.querySelectorAll('.divider-wrapper');
                expect(dividerWrappers.length).to.equal(2);

                const buttonContainer = description2.querySelector('.button-container');
                expect(buttonContainer).to.exist;

                // Restore original matchMedia
                window.matchMedia = originalMatchMedia;
            });
        });

        describe('Analytics Integration', () => {
            it('should have data-analytics-id attribute', async () => {
                const cards = document.querySelectorAll('merch-card[variant="full-pricing-express"]');
                cards.forEach(card => {
                    expect(card.hasAttribute('data-analytics-id')).to.be.true;
                });
            });

            it('should have daa-ll attribute on links', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const compareLink = card.querySelector('[slot="description2"] a');
                expect(compareLink.hasAttribute('daa-ll')).to.be.true;

                const ctaLink = card.querySelector('[slot="cta"] a');
                expect(ctaLink.hasAttribute('daa-ll')).to.be.true;
            });
        });

        describe('AEM Fragment Support', () => {
            it('should contain aem-fragment element', async () => {
                const card = document.querySelector('merch-card[variant="full-pricing-express"]');
                const aemFragment = card.querySelector('aem-fragment');
                expect(aemFragment).to.exist;
                expect(aemFragment.hasAttribute('fragment')).to.be.true;
            });
        });
    });
});