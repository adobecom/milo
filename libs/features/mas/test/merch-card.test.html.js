// @ts-nocheck
import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';


import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import { delay } from './utils.js';
import { mockIms } from './mocks/ims.js';
import { withWcs } from './mocks/wcs.js';
import { EVENT_MERCH_QUANTITY_SELECTOR_CHANGE } from '../src/constants';

const skipTests = sessionStorage.getItem('skipTests');

runTests(async () => {
    mockIms();
    mockLana();
    await mockFetch(withWcs);
    await import('../src/mas.js');
    describe('merch-card web component', () => {
        it('should exist in the HTML document', async () => {
            expect(document.querySelector('merch-card')).to.exist;
        });
        it('should exist segment card in HTML document', async () => {
            expect(document.querySelector('merch-card[variant="segment"]')).to
                .exist;
        });
        it('should exist a plans card in HTML document', async () => {
            expect(document.querySelector('merch-card[variant="plans"]')).to
                .exist;
        });
        it('should exist an image card in HTML document', async () => {
            expect(document.querySelector('merch-card[variant="image"]')).to
                .exist;
        });
        it('should exist an inline heading card in HTML document', async () => {
            expect(
                document.querySelector('merch-card[variant="inline-heading"]'),
            ).to.exist;
        });
        it('should exist an inline heading card in HTML document with CTA button', async () => {
            expect(
                document.querySelector(
                    'merch-card[variant="inline-heading"] div[slot="footer"] a.con-button.blue',
                ),
            ).to.exist;
        });
        it('should have stock trial checkbox', async () => {
            const plansCard = document.querySelector(
                'merch-card[variant="plans"]',
            );
            const stockCheckbox =
                plansCard.shadowRoot.getElementById('stock-checkbox');
            expect(stockCheckbox).to.exist;
            expect(plansCard.price.dataset.wcsOsi).to.equal('m2m');
            expect(plansCard.checkoutLinks[0].dataset.wcsOsi).to.equal('m2m');
            stockCheckbox.querySelector('input').click();
            await delay(100);
            expect(plansCard.checkoutLinks[0].dataset.wcsOsi).to.equal(
                'm2m,stock-m2m',
            );
        });

        it('should have and interact with quantity-selector', async () => {
            const plansCard = document.querySelector('merch-card[type="q-ty"]');
            const quantitySelect = plansCard.querySelector(
                'merch-quantity-select',
            );
            expect(quantitySelect).to.exist;
            await quantitySelect.updateComplete;
            const inputField =
                quantitySelect.shadowRoot.querySelector('.text-field-input');
            inputField.value = '3';
            const event = new KeyboardEvent('keyup', {
                key: '3',
                bubbles: true,
            });
            event.composedPath = () => [quantitySelect];
            inputField.dispatchEvent(event);
            await delay(100);
            expect(quantitySelect.selectedValue).to.equal(1);
            const button = plansCard.querySelector('.con-button');
            expect(button.getAttribute('data-quantity')).to.equal('1');
        });

        it('should support quantity based promotions', async () => {
            const card = document.querySelector('.quantity-based-promotion merch-card');
            const button = card.querySelector('.con-button.has-promo');
            const buttonNoPromo = card.querySelector('.con-button.no-promo');
            const buttonOtherPromo = card.querySelector('.con-button.other-promo');
            const quantitySelect = card.querySelector('merch-quantity-select');
            expect(quantitySelect).to.exist;
            await quantitySelect.updateComplete;

            expect(card.price.dataset.promotionCode).to.be.undefined;
            expect(button.getAttribute('data-promotion-code')).to.be.null;
            expect(buttonNoPromo.getAttribute('data-promotion-code')).to.be.null;
            expect(buttonOtherPromo.getAttribute('data-promotion-code')).to.equal('OTHER_TEST_PROMO');

            quantitySelect.dispatchEvent(new CustomEvent(
                EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
                {
                    detail: { option: 4 },
                    bubbles: true,
                },
            ));

            await delay(100);
            expect(button.getAttribute('data-promotion-code')).to.equal('TEST_PROMO');
            expect(buttonNoPromo.getAttribute('data-promotion-code')).to.be.null;
            expect(buttonOtherPromo.getAttribute('data-promotion-code')).to.equal('OTHER_TEST_PROMO');
            expect(card.price.dataset.promotionCode).to.equal('TEST_PROMO');

            quantitySelect.dispatchEvent(new CustomEvent(
                EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
                {
                    detail: { option: 2 },
                    bubbles: true,
                },
            ));

            await delay(100);
            expect(button.getAttribute('data-promotion-code')).to.be.null;
            expect(buttonNoPromo.getAttribute('data-promotion-code')).to.be.null;
            expect(buttonOtherPromo.getAttribute('data-promotion-code')).to.equal('OTHER_TEST_PROMO');
            expect(card.price.dataset.promotionCode).to.be.undefined;
        });
    });

    it('should return title for segment card', async () => {
        const title = document.querySelector(
            'merch-card[variant="segment"]',
        ).title;
        expect(title).to.equal('Individuals');
    });

    it('should have custom border color for segment card', async () => {
        const segmentCard = document.querySelector(
            'merch-card[variant="segment"].custom-border-color',
        );
        const borderColor = segmentCard.getAttribute('border-color');
        expect(borderColor).to.exist;
        expect(borderColor).to.not.equal('');
    });
});
