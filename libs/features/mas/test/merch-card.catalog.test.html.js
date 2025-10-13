// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { sendKeys } from '@web/test-runner-commands';
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
    describe('merch-card web component', () => {
        it('should exist in the HTML document', async () => {
            expect(document.querySelector('merch-card')).to.exist;
        });

        it('should display action menu icon on hover for catalog variant', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );

            expect(actionMenuContent.classList.contains('hidden')).to.be.true;

            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);

            expect(actionMenu.classList.contains('hidden')).to.be.false;
            expect(actionMenu.classList.contains('always-visible')).to.be.true;
            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
            expect(actionMenu).to.exist;
            expect(actionMenuContent).to.exist;
        });

        it('action menu keyboard navigation for catalog variant', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );
            const slottedContent = catalogCard.querySelector('[slot="action-menu-content"]');

            catalogCard.dispatchEvent(
                new FocusEvent('focusin', { bubbles: true }),
            );
            await delay(100);
            expect(actionMenu.classList.contains('hidden')).to.be.false;
            expect(actionMenu.classList.contains('always-visible')).to.be.true;

            actionMenu.click();
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;
            expect(actionMenu.getAttribute('aria-expanded')).to.equal('true');

            expect(slottedContent.getAttribute('tabindex')).to.equal('0');

            catalogCard.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
            );
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
            expect(actionMenu.getAttribute('aria-expanded')).to.equal('false');
        });

        it('should toggle menu content when action icon is clicked', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);
            const actionMenu =
                catalogCard.shadowRoot.querySelector('.action-menu');
            const actionMenuContent = catalogCard.shadowRoot.querySelector(
                '.action-menu-content',
            );

            await actionMenu.click();
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;

            await actionMenu.click();
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
        });

        it('should hide icon on mouse leave when menu is closed (desktop only)', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');

            const isMobile = window.matchMedia('(max-width: 1024px)').matches;
            if (isMobile) {
                expect(actionMenu.classList.contains('always-visible')).to.be.true;
                return;
            }

            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);
            expect(actionMenu.classList.contains('hidden')).to.be.false;

            catalogCard.dispatchEvent(
                new MouseEvent('mouseleave', { bubbles: true }),
            );
            await delay(100);
            expect(actionMenu.classList.contains('hidden')).to.be.true;
            expect(actionMenu.classList.contains('always-visible')).to.be.false;
        });

        it('should close menu when focus leaves slotted content', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );
            const slottedContent = catalogCard.querySelector('[slot="action-menu-content"]');
            const link = slottedContent?.querySelector('a');

            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);
            actionMenu.click();
            await delay(200); // Increased delay to allow auto-focus
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;

            if (link) {
                expect(document.activeElement).to.equal(link);
            }

            link?.dispatchEvent(
                new FocusEvent('focusout', {
                    bubbles: true,
                    relatedTarget: document.body
                }),
            );
            await delay(100);

            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
        });

        it('should keep menu open when tabbing from button to content', async () => {
            const catalogCard = document.querySelector(
                'merch-card[variant="catalog"]',
            );
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );
            const slottedContent = catalogCard.querySelector('[slot="action-menu-content"]');
            const link = slottedContent?.querySelector('a');

            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);
            actionMenu.click();
            await delay(200);
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;

            actionMenu.dispatchEvent(
                new FocusEvent('blur', {
                    bubbles: true,
                    relatedTarget: link
                }),
            );
            await delay(100);

            expect(actionMenuContent.classList.contains('hidden')).to.be.false;
        });

        it('should close menu when shift-tabbing backwards from button', async () => {
            const catalogCard = document.querySelectorAll(
                'merch-card[variant="catalog"]',
            )[1]; // Use second card for fresh state
            const shadowRoot = catalogCard.shadowRoot;
            const actionMenu = shadowRoot.querySelector('.action-menu');
            const actionMenuContent = shadowRoot.querySelector(
                '.action-menu-content',
            );

            actionMenuContent.classList.add('hidden');
            actionMenu.classList.add('hidden');
            await delay(50);

            catalogCard.dispatchEvent(
                new MouseEvent('mouseenter', { bubbles: true }),
            );
            await delay(100);

            actionMenu.focus();
            await delay(50);
            actionMenu.click();
            await delay(100);
            expect(actionMenuContent.classList.contains('hidden')).to.be.false;

            actionMenu.dispatchEvent(
                new FocusEvent('blur', {
                    bubbles: true,
                    relatedTarget: document.body
                }),
            );
            await delay(100);

            expect(actionMenuContent.classList.contains('hidden')).to.be.true;
        });
    });
});
