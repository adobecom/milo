import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '../../spectrum-web-components/dist/button.js';
import mas from './mas.js';
import {
    hydrate,
    processMnemonics,
    processTitle,
    processSize,
    processPrices,
    processBackgroundImage,
    processCTAs,
    processSubtitle,
    processAnalytics,
    ANALYTICS_TAG,
    ANALYTICS_LINK_ATTR,
    ANALYTICS_SECTION_ATTR,
    processDescription,
    updateLinksCSS,
} from '../src/hydrate.js';
import { CCD_SLICE_AEM_FRAGMENT_MAPPING } from '../src/variants/ccd-slice.js';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';

const mockMerchCard = () => {
    const merchCard = document.createElement('div');
    merchCard.spectrum = 'css';
    merchCard.loading = 'lazy';
    merchCard.attachShadow({ mode: 'open' }); // ✅ Ensure shadowRoot is available
    document.body.appendChild(merchCard);
    const originalAppend = merchCard.append;
    merchCard.append = sinon.spy(function () {
        return originalAppend.apply(this, arguments);
    });
    return merchCard;
};

await mas();
await mockFetch(withWcs);

document.head.appendChild(document.createElement('mas-commerce-service'));

describe('processCTAs', async () => {
    let merchCard;
    let aemFragmentMapping;

    beforeEach(async () => {
        merchCard = mockMerchCard();
        aemFragmentMapping = {
            ctas: {
                slot: 'cta',  // ✅ Updated slot to 'cta'
                size: 'm',
            },
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create spectrum css buttons by default', async () => {
        const fields = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(footer).to.exist;

        const button = footer.firstChild;
        expect(button.tagName.toLowerCase()).to.equal('button');  // ✅ Updated expectation
        expect(button.className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM',
        );
    });

    it('should handle multiple CTAs', async () => {
        const fields = {
            ctas: `
                <a is="checkout-link" data-wcs-osi="abm" class="accent">Accent</a>
                <a is="checkout-link" data-wcs-osi="abm" class="primary">Primary</a>
                <a is="checkout-link" data-wcs-osi="abm" class="secondary">Secondary</a>
            `,
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(footer).to.exist;

        const buttons = footer.children;
        expect(buttons).to.have.lengthOf(3);

        expect(buttons[0].className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM',
        );
        expect(buttons[1].className).to.equal(
            'spectrum-Button spectrum-Button--primary spectrum-Button--sizeM',
        );
        expect(buttons[2].className).to.equal(
            'spectrum-Button spectrum-Button--secondary spectrum-Button--sizeM',
        );
    });

    it('should handle strong wrapped CTAs', async () => {
        const fields = {
            ctas: '<strong><a is="checkout-link" data-wcs-osi="abm" class="accent">Strong CTA</a></strong>',
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(footer).to.exist;

        const button = footer.firstChild;
        expect(button.className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM',
        );
    });

    it('should handle outline CTAs', async () => {
        const fields = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent-outline">Outline CTA</a>',
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(footer).to.exist;

        const button = footer.firstChild;
        expect(button.className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM spectrum-Button--outline',
        );
    });

    it('should handle link-style CTAs', async () => {
        const fields = {
            ctas: `<a is="checkout-link" data-wcs-osi="abm" class="primary-link">Link Style</a>
            <a is="checkout-link" data-wcs-osi="abm">Link Style</a>`,
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(footer).to.exist;

        const link = footer.firstChild;
        expect(link.tagName.toLowerCase()).to.equal('a');
        expect(link.classList.contains('primary-link')).to.be.true;
    });
});

describe('hydrate', () => {
    let merchCard;

    beforeEach(() => {
        merchCard = mockMerchCard();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should hydrate a ccd-slice merch card', async () => {
        const fragment = {
            fields: {
                variant: 'ccd-slice',
                mnemonicIcon: ['www.adobe.com/icons/photoshop.svg'],
                mnemonicAlt: [],
                mnemonicLink: ['www.adobe.com'],
                backgroundImage: 'test-image.jpg',
                ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent" data-analytics-id="buy-now">Click me</a>',
                tags: ['mas:term/montly', 'mas:product_code/ccsn'],
            },
        };

        merchCard.variantLayout = {
            aemFragmentMapping: CCD_SLICE_AEM_FRAGMENT_MAPPING,
        };

        await hydrate(fragment, merchCard);

        expect(merchCard.getAttribute(ANALYTICS_SECTION_ATTR)).to.equal('ccsn');

        const ctaSlot = merchCard.shadowRoot?.querySelector('div[slot="cta"]');
        expect(ctaSlot).to.exist;

        const ctaButton = ctaSlot.querySelector('button[data-analytics-id]');
        expect(ctaButton.getAttribute('daa-ll')).to.equal('buy-now-1');
    });
});
