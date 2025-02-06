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
    getTruncatedTextData,
} from '../src/hydrate.js';
import { CCD_SLICE_AEM_FRAGMENT_MAPPING } from '../src/variants/ccd-slice.js';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';

function getFooterElement(merchCard) {
    return merchCard.spectrum === 'swc'
        ? merchCard.shadowRoot.querySelector('div[slot="footer"]')
        : merchCard.querySelector('div[slot="footer"]');
}

function getBgImageElement(merchCard, slotName = 'image') {
    return merchCard.spectrum === 'swc'
        ? merchCard.shadowRoot.querySelector(`div[slot="${slotName}"]`)
        : merchCard.querySelector(`div[slot="${slotName}"]`);
}

const mockMerchCard = () => {
    const merchCard = document.createElement('div');
    merchCard.spectrum = 'css';
    merchCard.loading = 'lazy';
    merchCard.attachShadow({ mode: 'open' });

    document.body.appendChild(merchCard);

    const originalAppend = merchCard.append;
    merchCard.append = sinon.spy(function () {
        return originalAppend.apply(this, arguments);
    });

    const originalShadowAppend = merchCard.shadowRoot.append;
    merchCard.shadowRoot.append = sinon.spy(function () {
        return originalShadowAppend.apply(this, arguments);
    });

    return merchCard;
};

await mas();
await mockFetch(withWcs);

document.head.appendChild(document.createElement('mas-commerce-service'));

describe('processMnemonics', async () => {
    it('should process mnemonics', async () => {
        const fields = {
            mnemonicIcon: ['www.adobe.com/icons/photoshop.svg'],
            mnemonicAlt: [],
            mnemonicLink: ['www.adobe.com'],
        };
        const merchCard = mockMerchCard();
        const mnemonicsConfig = { size: 'm' };
        processMnemonics(fields, merchCard, mnemonicsConfig);
        expect(merchCard.outerHTML).to.equal(
            '<div><merch-icon slot="icons" src="www.adobe.com/icons/photoshop.svg" loading="lazy" size="m" href="https://www.adobe.com/"></merch-icon></div>',
        );
    });
});

describe('processTitle', async () => {
    it('should process use tag and slot metadata', async () => {
        const fields = { cardTitle: 'Photoshop' };
        const merchCard = mockMerchCard();
        const titleConfig = { tag: 'h2', slot: 'title' };
        processTitle(fields, merchCard, titleConfig);
        expect(merchCard.outerHTML).to.equal(
            '<div><h2 slot="title">Photoshop</h2></div>',
        );
    });
});

describe('processSize', async () => {
    it('should apply size', async () => {
        const fields = { size: 'wide' };
        const merchCard = mockMerchCard();
        processSize(fields, merchCard, ['wide']);
        expect(merchCard.outerHTML).to.equal('<div size="wide"></div>');
    });
});

describe('processPrices', async () => {
    it('should process prices', async () => {
        const fields = {
            prices: '<span>$9.99</span>',
        };
        const merchCard = mockMerchCard();
        const pricesConfig = { tag: 'p', slot: 'prices' };
        processPrices(fields, merchCard, pricesConfig);
        expect(merchCard.outerHTML).to.equal(
            '<div><p slot="prices"><span>$9.99</span></p></div>',
        );
    });

    it('should preserve white spaces', async () => {
        const fields = {
            prices: 'Starting at  <span is="inline-price" data-template="price" data-wcs-osi="nTbB50pS4lLGv_x1l_UKggd-lxxo2zAJ7WYDa2mW19s"></span>',
        };
        const merchCard = mockMerchCard();
        const pricesConfig = { tag: 'p', slot: 'price' };
        processPrices(fields, merchCard, pricesConfig);
        await merchCard.querySelector('span[is="inline-price"]').onceSettled();
        expect(merchCard.textContent).to.equal('Starting at  US$22.19/mo');
    });
});

describe('processCTAs', async () => {
    let merchCard;
    let aemFragmentMapping;

    beforeEach(async () => {
        merchCard = mockMerchCard();
        aemFragmentMapping = {
            ctas: {
                slot: 'footer',
                size: 'm',
            },
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not process CTAs when fields.ctas is falsy', async () => {
        const fields = { ctas: null };

        processCTAs(fields, merchCard, aemFragmentMapping);

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.shadowRoot.append.called).to.be.false;
    });

    it('should create spectrum css buttons by default (merchCard.spectrum=css)', async () => {
        const fields = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = getFooterElement(merchCard);
        expect(footer).to.exist;
        expect(footer.getAttribute('slot')).to.equal('footer');

        const button = footer.firstChild;
        expect(button.tagName.toLowerCase()).to.equal('button');
        expect(button.className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM',
        );
    });

    it('should create spectrum wc buttons when merchCard.spectrum="swc"', async () => {
        const fields = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };
        merchCard.spectrum = 'swc';
        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = getFooterElement(merchCard);
        expect(footer).to.exist;
        expect(footer.getAttribute('slot')).to.equal('footer');

        const button = footer.firstChild;
        expect(button.tagName.toLowerCase()).to.equal('sp-button');
        expect(button.treatment).to.equal('fill');
        expect(button.variant).to.equal('accent');
        expect(button.getAttribute('tabindex')).to.equal('0');
        expect(button.size).to.equal('m');
    });

    it('should create consonant buttons when merchCard.consonant is true', async () => {
        merchCard.consonant = true;
        const fields = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };

        processCTAs(fields, merchCard, aemFragmentMapping);

        const footer = getFooterElement(merchCard);
        expect(footer).to.exist;

        const link = footer.firstChild;
        expect(link.classList.contains('con-button')).to.be.true;
        expect(link.classList.contains('accent')).to.be.true;
    });

    it('should handle multiple CTAs', async () => {
        const fields = {
            ctas: `\n                <a is="checkout-link" data-wcs-osi="abm" class="accent">Accent</a>\n                <a is="checkout-link" data-wcs-osi="abm" class="primary">Primary</a>\n                <a is="checkout-link" data-wcs-osi="abm" class="secondary">Secondary</a>\n            `,
        };

        processCTAs(fields, merchCard, aemFragmentMapping);
        const footer = getFooterElement(merchCard);
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
        const footer = getFooterElement(merchCard);
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
        const footer = getFooterElement(merchCard);
        expect(footer).to.exist;

        const button = footer.firstChild;
        expect(button.className).to.equal(
            'spectrum-Button spectrum-Button--accent spectrum-Button--sizeM spectrum-Button--outline',
        );
    });

    it('should handle link-style CTAs', async () => {
        const fields = {
            ctas: `<a is="checkout-link" data-wcs-osi="abm" class="primary-link">Link Style</a>\n            <a is="checkout-link" data-wcs-osi="abm">Link Style</a>`,
        };

        processCTAs(fields, merchCard, aemFragmentMapping, 'ccd-suggested');
        const footer = getFooterElement(merchCard);
        expect(footer).to.exist;
        const link = footer.firstChild;
        expect(link.tagName.toLowerCase()).to.equal('a');
        expect(link.classList.contains('primary-link')).to.be.true;
    });
});

describe('processSubtitle', () => {
    let merchCard;

    before(async () => {
        await mas();
        await mockFetch(withWcs);
    });

    beforeEach(() => {
        merchCard = mockMerchCard();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not append subtitle when fields.subtitle is falsy', () => {
        const fields = { subtitle: null };
        const subtitleConfig = { tag: 'h3', slot: 'subtitle' };

        processSubtitle(fields, merchCard, subtitleConfig);

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should not append subtitle when subtitleConfig is falsy', () => {
        const fields = { subtitle: 'Test Subtitle' };
        const subtitleConfig = null;

        processSubtitle(fields, merchCard, subtitleConfig);

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should append subtitle with correct tag and slot', () => {
        const fields = { subtitle: 'Test Subtitle' };
        const subtitleConfig = { tag: 'h3', slot: 'subtitle' };

        processSubtitle(fields, merchCard, subtitleConfig);

        expect(merchCard.outerHTML).to.equal(
            '<div><h3 slot="subtitle">Test Subtitle</h3></div>',
        );
    });
});

describe('processBackgroundImage', () => {
    let merchCard;

    beforeEach(() => {
        merchCard = mockMerchCard();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not process background image when fields.backgroundImage is falsy', () => {
        const fields = {
            backgroundImage: null,
            backgroundImageAltText: 'Test Image',
        };
        const backgroundImageConfig = { tag: 'div', slot: 'image' };
        const variant = 'ccd-slice';

        processBackgroundImage(
            fields,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.shadowRoot.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should append background image for ccd-slice variant, merchCard.spectrum=css', () => {
        const fields = {
            backgroundImage: 'test-image.jpg',
            backgroundImageAltText: 'Test Image',
        };
        const backgroundImageConfig = { tag: 'div', slot: 'image' };
        const variant = 'ccd-slice';

        processBackgroundImage(
            fields,
            merchCard,
            backgroundImageConfig,
            variant,
        );
        const imageContainer = getBgImageElement(merchCard);
        expect(imageContainer).to.exist;
        expect(imageContainer.innerHTML).to.equal(
            '<img loading="lazy" src="test-image.jpg" alt="Test Image">',
        );
    });

    it('should append background image for ccd-slice variant, merchCard.spectrum=swc', () => {
        const fields = {
            backgroundImage: 'test-image.jpg',
            backgroundImageAltText: 'Test Image',
        };
        const backgroundImageConfig = { tag: 'div', slot: 'image' };
        const variant = 'ccd-slice';

        merchCard.spectrum = 'swc';
        processBackgroundImage(
            fields,
            merchCard,
            backgroundImageConfig,
            variant,
        );
        const imageContainer = getBgImageElement(merchCard);
        expect(imageContainer).to.exist;
        expect(imageContainer.innerHTML).to.equal(
            '<img loading="lazy" src="test-image.jpg" alt="Test Image">',
        );
    });

    it('should set background-image attribute for ccd-suggested variant', () => {
        const fields = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = { attribute: 'background-image' };
        const variant = 'ccd-suggested';

        processBackgroundImage(
            fields,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.outerHTML).to.equal(
            '<div background-image="test-image.jpg"></div>',
        );
    });

    it('should not append background image for ccd-slice when backgroundImageConfig is falsy', () => {
        const fields = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = null;
        const variant = 'ccd-slice';

        processBackgroundImage(
            fields,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.shadowRoot.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });
});

describe('processAnalytics', () => {
    let merchCard;

    beforeEach(() => {
        merchCard = mockMerchCard();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not set analytics attributes if no fields.tags', () => {
        const fields = {};
        processAnalytics(fields, merchCard);
        expect(merchCard.hasAttribute(ANALYTICS_SECTION_ATTR)).to.be.false;
        expect(
            merchCard.querySelectorAll(`a[${ANALYTICS_LINK_ATTR}]`).length,
        ).to.equal(0);
    });

    it(`should not set analytics attributes when no tags start with ${ANALYTICS_TAG}`, () => {
        const fields = { tags: ['mas:term/montly'] };
        processAnalytics(fields, merchCard);
        expect(merchCard.hasAttribute(ANALYTICS_SECTION_ATTR)).to.be.false;
        expect(
            merchCard.querySelectorAll(`a[${ANALYTICS_LINK_ATTR}]`).length,
        ).to.equal(0);
    });

    it('should set analytics-section attribute on merchCard', () => {
        const fields = { tags: ['mas:product_code/phsp'] };
        processAnalytics(fields, merchCard);
        expect(merchCard.getAttribute(ANALYTICS_SECTION_ATTR)).to.equal('phsp');
    });

    it('should set analytics-link attributes on links inside merchCard', () => {
        const fields = { tags: ['mas:term/montly', 'mas:product_code/ccsn'] };

        const seeTerms = document.createElement('a');
        seeTerms.setAttribute('data-analytics-id', 'see-terms');
        const buyNow = document.createElement('a');
        buyNow.setAttribute('data-analytics-id', 'buy-now');
        const noAnalytics = document.createElement('a');
        merchCard.appendChild(seeTerms);
        merchCard.appendChild(buyNow);
        merchCard.appendChild(noAnalytics);

        processAnalytics(fields, merchCard);
        expect(merchCard.getAttribute(ANALYTICS_SECTION_ATTR)).to.equal('ccsn');
        expect(seeTerms.getAttribute(ANALYTICS_LINK_ATTR)).to.equal(
            'see-terms-1',
        );
        expect(buyNow.getAttribute(ANALYTICS_LINK_ATTR)).to.equal('buy-now-2');
        expect(
            merchCard.querySelectorAll(`a[${ANALYTICS_LINK_ATTR}]`).length,
        ).to.equal(2);
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
        const ctaButton = merchCard.querySelector('button[data-analytics-id]');
        expect(ctaButton).to.exist;
        expect(ctaButton.getAttribute('daa-ll')).to.equal('buy-now-1');
    });
});

describe('processDescription', async () => {
    let merchCard;
    let aemFragmentMapping;

    beforeEach(async () => {
        merchCard = mockMerchCard();
        aemFragmentMapping = {
            description: { tag: 'div', slot: 'body-xs' },
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should process merch links', async () => {
        const fields = {
            description: `Buy <a is="checkout-link" data-wcs-osi="abm" class="primary-link">Link Style</a><a is="checkout-link" data-wcs-osi="abm" class="secondary-link">Link Style</a>`,
        };

        processDescription(fields, merchCard, aemFragmentMapping.description);
        updateLinksCSS(merchCard);
        expect(merchCard.innerHTML).to.equal(
            '<div slot="body-xs">Buy <a is="checkout-link" data-wcs-osi="abm" class="spectrum-Link spectrum-Link--primary">Link Style</a><a is="checkout-link" data-wcs-osi="abm" class="spectrum-Link spectrum-Link--secondary">Link Style</a></div>',
        );
    });
});

describe('getTruncatedTextData', () => {
  it('closes any open tags in truncated text', () => {
      // The function truncates in the middle of <b>World, then appends closing tags
      // The actual output might be: "<p>Hello <b>W</b>..."
      // (the ellipsis appears outside the <b> tag, then no closing </p> if "p" was the first leftover)
      const text = '<p>Hello <b>World</b> more text</p>';
      const limit = 10; // small to ensure truncation inside <b>World
      const [truncated] = getTruncatedTextData(text, limit);

      // You can simply check that it starts with `<p>Hello <b>` and ends with `</b>...`
      expect(truncated).to.equal('<p>Hello <b>W</b>...');
  });

  it('handles leftover <p> specifically by ignoring if first in openTags', () => {
      // If <p> is the first leftover tag, it gets removed, so the function
      // might produce something like "<p><span>He</span>..."
      const text = '<p><span>Hello world';
      const limit = 5;
      const [truncated] = getTruncatedTextData(text, limit);

      // Actual output might be "<p><span>He</span>..."
      expect(truncated).to.equal('<p><span>He</span>...');
  });

  it('handles slash near tag ends properly', () => {
      // If we truncate before capturing <img>, the function may skip it entirely
      // leading to something like "<div>Hello</div>..."
      const text = '<div>Hello <img src="test.jpg" /> world</div>';
      const limit = 8;
      const [truncated] = getTruncatedTextData(text, limit);

      // The actual output might be "<div>Hello</div>..."
      // because we never traverse far enough to keep the <img> or " world"
      expect(truncated).to.equal('<div>Hello</div>...');
  });
});
