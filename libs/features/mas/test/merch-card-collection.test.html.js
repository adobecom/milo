import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';

import { pushState } from '../src/deeplink.js';

import {
    appendMiloStyles,
    delay,
    oneEvent,
    toggleDesktop,
    toggleLargeDesktop,
    toggleMobile,
} from './utils.js';

import '../src/sidenav/merch-sidenav.js';
import '../src/merch-card-collection.js';

import { withWcs } from './mocks/wcs.js';
import { withAem } from './mocks/aem.js';
import '../src/mas.js';

const searchParams = new URLSearchParams(document.location.search);

const prepareTemplate = (
    id,
    updateSearch = true,
    content = document.getElementById('content'),
) => {
    content.innerHTML = '';
    const template = document.getElementById(id);
    const templateContent = template.content.cloneNode(true);
    const merchCards = templateContent.querySelector('merch-card-collection');
    const header =  templateContent.querySelector('merch-card-collection-header');
    return [
        merchCards,
        () => {
            content.appendChild(templateContent);
            if (updateSearch && id !== searchParams.get('template')) {
                searchParams.set('template', id);
                document.location.search = searchParams.toString();
            }
        },
        header
    ];
};

window['prepareTemplate'] = prepareTemplate;

const sidenav = document.getElementById('sidenav');
if (sidenav) {
    const templates = [...document.getElementsByTagName('template')].map(
        ({ id, title }) =>
            `<button onclick="(prepareTemplate('${id}')[1])()">${title}</button>`,
    );
    sidenav.appendChild(
        document.createRange().createContextualFragment(templates.join('\n')),
    );
    const currentTemplate = searchParams.get('template');
    if (currentTemplate) {
        const [, render] = prepareTemplate(currentTemplate);
        render();
    }
}
const visibleCards = (index) => {
    const cards = Array.from(document.querySelectorAll('merch-card'))
        .filter((card) => card.style.display !== 'none')
        .sort((a, b) => Number(a.style.order) - Number(b.style.order));
    if (isNaN(index)) {
        return cards;
    } else {
        return cards[index];
    }
};

let merchCards, header;
const shouldSkipTests = sessionStorage.getItem('skipTests') ? 'true' : 'false';
runTests(async () => {
    let render;
    appendMiloStyles();
    mockLana();
    await mockFetch(withWcs, withAem);

    if (shouldSkipTests === 'true') return;

    describe('merch-card-collection-header web component', () => {
        const renderWithSidenav = async () => {
            render();
            await delay(100);
            const sidenav = document.querySelector('merch-sidenav');
            merchCards.sidenav = sidenav;
            header.collection = merchCards;
            header.requestUpdate();
            await header.updateComplete;
        }

        before(async () => {
            await toggleMobile();
        });

        beforeEach(() => {
            [merchCards, render, header] = prepareTemplate('catalogCollectionWithHeader', false);
        });

        afterEach(() => {
            document.querySelector('merch-sidenav').removeAttribute('modal');
            document.body.classList.remove('merch-modal');
        })

        it('sets the class for modal when opening filters in a modal', async () => {
            await renderWithSidenav();
            expect(document.body.classList.contains('merch-modal')).to.be.false;
            header.shadowRoot.querySelector('#filter').click();
            await delay(100);
            expect(document.body.classList.contains('merch-modal')).to.be.true;
        });

        it('removes the class for modal when closing the filters modal by clicking the "Close" button', async () => {
            await renderWithSidenav();
            header.shadowRoot.querySelector('#filter').click();
            await delay(100);
            document
                .querySelector('merch-sidenav')
                .shadowRoot.querySelector('#sidenav')
                .querySelector('sp-link')
                .click();
            expect(document.body.classList.contains('merch-modal')).to.be.false;
        });

        it('removes the class for modal when closing the filters modal by clicking outside the modal', async () => {
            await renderWithSidenav();
            header.shadowRoot.querySelector('#filter').click();
            await delay(100);
            document
                .querySelector('merch-sidenav')
                .shadowRoot.querySelector('sp-overlay')
                .dispatchEvent(new CustomEvent('close'));
            await delay(100);
            expect(document.body.classList.contains('merch-modal')).to.be.false;
        });

        it('should refine result on search with multiple words', async () => {
            await renderWithSidenav();
            document.location.hash = '';
            pushState({ search: 'Connect' });
            await delay(100);
            expect(header.resultSlotName).to.equal('searchResultMobileText');
        });

        it('should refine result on search', async () => {
            await renderWithSidenav();
            document.location.hash = '';
            pushState({ search: 'acrobat' });
            await delay(100);
            expect(visibleCards().length).to.equal(2);
            expect(header.resultSlotName).to.equal('searchResultsMobileText');
            pushState({ search: 'stager' });
            await delay(100);
            expect(visibleCards().length).to.equal(1);
            expect(header.resultSlotName).to.equal('searchResultMobileText');
            pushState({ search: 'cafebabe' });
            await delay(100);
            expect(visibleCards().length).to.equal(0);
            expect(header.resultSlotName).to.equal(
                'noSearchResultsMobileText',
            );
        });
    })

    describe('merch-card-collection web component on desktop', () => {
        before(async () => {
            await toggleLargeDesktop();
        });

        beforeEach(async () => {
            document.location.hash = '';
            [merchCards, render] = prepareTemplate('catalogCards', false);
        });

        it('renders merch-card-collection element', async () => {
            document.location.hash = '';
            render();
            await delay(100);
            expect(visibleCards().length).to.equal(93);
        });

        it('observes/applies deep link parameters', async () => {
            document.location.hash = 'filter=photo';
            render();
            await delay(100);
            expect(visibleCards().length).to.equal(5);
            expect(visibleCards(0).size).to.equal('super-wide');
            document.location.hash = 'filter=photo&types=web';
            await delay(100);
            expect(visibleCards().length).to.equal(4);
            document.location.hash = 'filter=photo&types=web,desktop';
            await delay(100);
            expect(visibleCards().length).to.equal(5);
        });

        it('should make single_app card the second card', async () => {
            document.location.hash = 'single_app=illustrator';
            render();
            await delay(100);
            expect(visibleCards(1).name).to.equal('illustrator');
        });

        it('should display a Show More button', async () => {
            merchCards.setAttribute('limit', 16);
            merchCards.setAttribute('page', 1);
            render();
            await delay(100);
            expect(visibleCards().length).to.equal(16);
            const showMoreButton =
                merchCards.shadowRoot.querySelector('#footer sp-button');
            expect(showMoreButton.isConnected).to.be.true;
            showMoreButton.click();
            await delay(100);
            showMoreButton.click();
            await delay(100);
            expect(visibleCards().length).to.equal(48);
            pushState({ page: 6 });
            await delay(100);
            expect(showMoreButton.isConnected).to.be.false;
        });
    });

    describe('merch-card-collection autoblock features', () => {
        let collectionElement;

        beforeEach(async () => {
            document.location.hash = '';
            [collectionElement, render] = prepareTemplate('collectionAutoblock', false);
        });

        it('should hydrate from child aem-fragment', async () => {
            render();
            await collectionElement.checkReady();
            const merchCard = collectionElement.querySelector('merch-card');
            expect(merchCard).to.exist;
        });

        it('should populate filters in hydration', async () => {
            render();
            await collectionElement.checkReady();
            const merchCard = collectionElement.querySelector('merch-card[id="ca835d11-fe6b-40f8-96d1-50ac800c9f70"]');
            expect(merchCard.getAttribute('filters')).to.equal('all:4:wide,cloud:2:wide,subcategory:1:wide');
        });
    })

    describe('merch-card-collection override feature', () => {
      let collectionElement;

      beforeEach(async () => {
          document.location.hash = '';
          [collectionElement, render] = prepareTemplate('override', false);
      });

      it('should hydrate from child aem-fragment, with overriden ids', async () => {
        render();
        const aemFragment = customElements.get('aem-fragment');
        await collectionElement.checkReady();
        const fragment1 = collectionElement.querySelector('aem-fragment[fragment="cafe-bebebe"]');
        expect(fragment1).to.exist;
        const filters1 = fragment1.parentNode.filters;
        expect(filters1).to.exist;
        expect(filters1.all?.order).to.equal(1);
        const fragment2 = collectionElement.querySelector('aem-fragment[fragment="bebe-cafe"]');
        const filters2 = fragment2.parentNode.filters;
        expect(filters2).to.exist;
        expect(filters2.all?.order).to.equal(3);
        expect(filters2.cloud?.order).to.equal(1);
        expect(collectionElement.querySelector('merch-card > aem-fragment[fragment="e58f8f75-b882-409a-9ff8-8826b36a8368"]')).to.not.exist;
        expect(collectionElement.querySelector('merch-card > aem-fragment[fragment="e58f8f75-b882-409a-9ff8-8826b36a8368"]')).to.not.exist;
        aemFragment.cache.clear();
    });

    describe('merch-card-collection plans features', () => {
        it('handles wide card minification on small desktop', async () => {
            await toggleDesktop();
            [merchCards, render] = prepareTemplate('plansWideReflow', false);
            render();
            await merchCards.checkReady();
            const sidenav = document.querySelector('merch-sidenav');
            merchCards.attachSidenav(sidenav, false);
            await delay(100);
            const secondCard = merchCards.querySelector('merch-card:nth-child(2)');
            expect(secondCard.getAttribute('data-size')).to.equal('wide');
        });
    });
  })
});

document.getElementById('showMore').addEventListener('click', () => {
    document.location.hash = '';
    const [merchCards, render] = prepareTemplate('catalogCards');
    merchCards.setAttribute('limit', 16);
    merchCards.setAttribute('page', 1);
    render();
});
