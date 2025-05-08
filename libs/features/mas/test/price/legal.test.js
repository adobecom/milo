import { expect } from '../utilities.js';
import * as snapshots from './__snapshots__/legal.snapshots.js';
import { legalTemplate } from '../../src/price/legal.js';

const root = document.createElement('div');
document.body.append(root);

function renderAndComparePrice(id, html) {
    const el = document.createElement('p', { id });
    el.setAttribute('id', id);
    el.innerHTML = html;
    root.append(el);
    expect(el.innerHTML).to.be.html(snapshots[id]);
}

describe('function "createLegalTemplate"', () => {
    it('displays tax & legal texts in parentheses when unit label is present', () => {
        renderAndComparePrice(
            'createLegalTemplate1',
            legalTemplate(
                {
                    country: 'FR',
                    language: 'fr',
                    displayPerUnit: true,
                    displayTax: true,
                    displayPlanType: true,
                    literals: {
                        taxInclusiveLabel: 'incl. VAT',
                        planTypeLabel: 'Annuel, facturé mensuellement',
                    },
                },
                {
                    taxDisplay: 'TAX_INCLUSIVE_DETAILS',
                    taxTerm: 'VAT',
                    planType: 'ABM',
                },
                {},
            ),
        );
    });

    it('displays legal template with tax and plan type texts', () => {
        renderAndComparePrice(
            'createLegalTemplate2',
            legalTemplate(
                {
                    country: 'FR',
                    language: 'fr',
                    displayTax: true,
                    displayPlanType: true,
                    literals: {
                        taxInclusiveLabel: 'incl. VAT',
                        planTypeLabel: 'Annuel, facturé mensuellement',
                    },
                },
                {
                    taxDisplay: 'TAX_INCLUSIVE_DETAILS',
                    taxTerm: 'VAT',
                    planType: 'ABM',
                },
                {},
            ),
        );
    });

    it('displays legal template with plan type text and hides tax text when country is US and language is en', () => {
        renderAndComparePrice(
            'createLegalTemplate3',
            legalTemplate(
                {
                    country: 'US',
                    language: 'en',
                    displayTax: true,
                    displayPlanType: true,
                    literals: {
                        taxInclusiveLabel: 'Exclusive of VAT',
                        planTypeLabel: 'Annual, paid monthly.',
                    },
                },
                {
                    taxDisplay: 'TAX_EXCLUSIVE',
                    taxTerm: 'TAX',
                    planType: 'ABM',
                },
                {},
            ),
        );
    });
});
