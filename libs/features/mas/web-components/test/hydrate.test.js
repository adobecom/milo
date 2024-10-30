import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import mas from './mas.js';
import {
    processBackgroundImage,
    processCTAs,
    processSubtitle,
} from '../src/hydrate.js';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';

const mockMerchCard = () => {
    const merchCard = document.createElement('div');
    document.body.appendChild(merchCard);
    const originalAppend = merchCard.append;
    merchCard.append = sinon.spy(function () {
        return originalAppend.apply(this, arguments);
    });
    return merchCard;
};

describe('processCTAs', async () => {
    let merchCard;
    let aemFragmentMapping;

    before(async () => {
        await mas();
        await mockFetch(withWcs);
    });

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

    it('should not process CTAs when fragment.ctas is falsy', async () => {
        const fragment = { ctas: null };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        expect(merchCard.append.called).to.be.false;
    });

    it('should create spectrum buttons when merchCard.consonant is false', async () => {
        const fragment = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const appendCall = merchCard.append.firstCall;
        expect(appendCall).to.exist;

        const footer = appendCall.args[0];
        expect(footer.getAttribute('slot')).to.equal('footer');

        const button = footer.firstChild;
        expect(button.tagName.toLowerCase()).to.equal('sp-button');
        expect(button.getAttribute('treatment')).to.equal('fill');
        expect(button.getAttribute('variant')).to.equal('accent');
        expect(button.getAttribute('size')).to.equal('m');
    });

    it('should create consonant buttons when merchCard.consonant is true', async () => {
        // when a merch-card with a fragment is rendered in a Milo page.
        merchCard.consonant = true;
        const fragment = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent">Click me</a>',
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const appendCall = merchCard.append.firstCall;
        expect(appendCall).to.exist;

        const footer = appendCall.args[0];
        const link = footer.firstChild;
        expect(link.classList.contains('con-button')).to.be.true;
        expect(link.classList.contains('accent')).to.be.true;
    });

    it('should handle multiple CTAs', async () => {
        const fragment = {
            ctas: `
                <a is="checkout-link" data-wcs-osi="abm" class="accent">Accent</a>
                <a is="checkout-link" data-wcs-osi="abm" class="primary">Primary</a>
                <a is="checkout-link" data-wcs-osi="abm" class="secondary">Secondary</a>
            `,
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const footer = merchCard.append.firstCall.args[0];
        const buttons = footer.children;
        expect(buttons).to.have.lengthOf(3);

        expect(buttons[0].getAttribute('variant')).to.equal('accent');
        expect(buttons[1].getAttribute('variant')).to.equal('primary');
        expect(buttons[2].getAttribute('variant')).to.equal('secondary');
    });

    it('should handle strong wrapped CTAs', async () => {
        const fragment = {
            ctas: '<strong><a is="checkout-link" data-wcs-osi="abm" class="accent">Strong CTA</a></strong>',
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const footer = merchCard.append.firstCall.args[0];
        const button = footer.firstChild;
        expect(button.getAttribute('variant')).to.equal('accent');
    });

    it('should handle outline CTAs', async () => {
        const fragment = {
            ctas: '<a is="checkout-link" data-wcs-osi="abm" class="accent-outline">Outline CTA</a>',
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const footer = merchCard.append.firstCall.args[0];
        const button = footer.firstChild;
        expect(button.getAttribute('treatment')).to.equal('outline');
        expect(button.getAttribute('variant')).to.equal('accent');
    });

    it('should handle link-style CTAs', async () => {
        const fragment = {
            ctas: `<a is="checkout-link" data-wcs-osi="abm" class="primary-link">Link Style</a>
            <a is="checkout-link" data-wcs-osi="abm">Link Style</a>`,
        };

        processCTAs(fragment, merchCard, aemFragmentMapping, 'ccd-suggested');

        const footer = merchCard.append.firstCall.args[0];
        const link = footer.firstChild;
        expect(link.tagName.toLowerCase()).to.equal('a');
        expect(link.classList.contains('primary-link')).to.be.true;
    });

    it('should handle click events on spectrum buttons', async () => {
        const fragment = {
            ctas: '<a is="checkout-link" href="#" data-wcs-osi="abm" class="accent"><span>Click me</span></a>',
        };

        processCTAs(fragment, merchCard, aemFragmentMapping);

        const footer = merchCard.append.firstCall.args[0];
        const button = footer.firstChild;
        const link = button.firstChild;
        const span = link.firstChild;

        let target;
        link.addEventListener('click', (e) => {
            target = e.target;
            e.preventDefault(); // prevent infinite loop
        });

        const customEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        span.dispatchEvent(customEvent);
        expect(target).to.equal(link);
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

    it('should not append subtitle when fragment.subtitle is falsy', () => {
        const fragment = { subtitle: null };
        const subtitleConfig = { tag: 'h3', slot: 'subtitle' };

        processSubtitle(fragment, merchCard, subtitleConfig);

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should not append subtitle when subtitleConfig is falsy', () => {
        const fragment = { subtitle: 'Test Subtitle' };
        const subtitleConfig = null;

        processSubtitle(fragment, merchCard, subtitleConfig);

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should append subtitle with correct tag and slot', () => {
        const fragment = { subtitle: 'Test Subtitle' };
        const subtitleConfig = { tag: 'h3', slot: 'subtitle' };

        processSubtitle(fragment, merchCard, subtitleConfig);

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

    it('should not process background image when fragment.backgroundImage is falsy', () => {
        const fragment = { backgroundImage: null };
        const backgroundImageConfig = { tag: 'div', slot: 'background' };
        const variant = 'ccd-slice';

        processBackgroundImage(
            fragment,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should append background image for ccd-slice variant', () => {
        const fragment = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = { tag: 'div', slot: 'background' };
        const variant = 'ccd-slice';

        processBackgroundImage(
            fragment,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.outerHTML).to.equal(
            '<div><div slot="background"><img loading="lazy" src="test-image.jpg"></div></div>',
        );
    });

    it('should set background-image attribute for ccd-suggested variant', () => {
        const fragment = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = { tag: 'div', slot: 'background' };
        const variant = 'ccd-suggested';

        processBackgroundImage(
            fragment,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.outerHTML).to.equal(
            '<div background-image="test-image.jpg"></div>',
        );
    });

    it('should not process background image for unknown variant', () => {
        const fragment = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = { tag: 'div', slot: 'background' };
        const variant = 'unknown-variant';

        processBackgroundImage(
            fragment,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });

    it('should not append background image for ccd-slice when backgroundImageConfig is falsy', () => {
        const fragment = { backgroundImage: 'test-image.jpg' };
        const backgroundImageConfig = null;
        const variant = 'ccd-slice';

        processBackgroundImage(
            fragment,
            merchCard,
            backgroundImageConfig,
            variant,
        );

        expect(merchCard.append.called).to.be.false;
        expect(merchCard.outerHTML).to.equal('<div></div>');
    });
});
