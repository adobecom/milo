import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';

import { mockLana } from './mocks/lana.js';
import { mockFetch } from './mocks/fetch.js';
import { mockConfig } from './mocks/config.js';

import { pushState } from '../src/deeplink.js';

import {
    appendMiloStyles,
    delay,
    keyDown,
    toggleLargeDesktop,
} from './utils.js';

import '../src/sidenav/merch-sidenav.js';
import '../src/merch-card-collection.js';

import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP } from '../src/focus.js';
import { withWcs } from './mocks/wcs.js';
import { withLiterals } from './mocks/literals.js';
import mas from './mocks/mas.js';

const searchParams = new URLSearchParams(document.location.search);

const prepareTemplate = (
    id,
    updateSearch = true,
    content = document.getElementById('content'),
) => {
    content.innerHTML = '';
    const template = document.getElementById(id);
    const templateContent = template.content.cloneNode(true);
    return [
        templateContent.querySelector('merch-card-collection'),
        () => {
            content.appendChild(templateContent);
            if (updateSearch && id !== searchParams.get('template')) {
                searchParams.set('template', id);
                document.location.search = searchParams.toString();
            }
        },
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

let merchCards;

const shouldSkipTests =
    sessionStorage.getItem('skipTests') ?? window.innerWidth < 1200
        ? 'true'
        : 'false';
runTests(async () => {
    await toggleLargeDesktop();
    mockLana();
    await mockFetch(withWcs, withLiterals);
    await mas();
    if (shouldSkipTests !== 'true') {
        describe('merch-card-collection web component', () => {
            let render;
            beforeEach(() => {
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

            it('should refine result on search with multiple words', async () => {
                document.location.hash = '';
                render();
                await delay(100);
                pushState({ search: 'All Apps' });
                await delay(100);
                expect(visibleCards().length).to.equal(1);
                expect(merchCards.resultTextSlotName).to.equal(
                    'searchResultText',
                );
            });

            it('should refine result on search', async () => {
                document.location.hash = '';
                render();
                await delay(100);
                pushState({ search: 'acrobat' });
                await delay(100);
                expect(visibleCards().length).to.equal(10);
                expect(merchCards.resultTextSlotName).to.equal(
                    'searchResultsText',
                );
                pushState({ search: 'stager' });
                await delay(100);
                expect(visibleCards().length).to.equal(1);
                expect(merchCards.resultTextSlotName).to.equal(
                    'searchResultText',
                );
                pushState({ search: 'cafebabe' });
                await delay(100);
                expect(visibleCards().length).to.equal(0);
                expect(merchCards.resultTextSlotName).to.equal(
                    'noSearchResultsText',
                );
            });

            it('should support navigation by keyboard', async () => {
                document.location.hash = '';
                render();
                await delay(100);
                const acrobat = visibleCards(2);
                acrobat.focus();
                await keyDown(ARROW_RIGHT);
                expect(document.activeElement.title).to.equal('Premiere Pro');
                await keyDown(ARROW_RIGHT);
                expect(document.activeElement.title).to.equal('Premiere Pro');
                await keyDown(ARROW_DOWN);
                await keyDown(ARROW_LEFT);
                expect(document.activeElement.title).to.equal('Adobe Express');
                await keyDown(ARROW_UP);
                expect(document.activeElement.title).to.equal('Photoshop');
                await keyDown(ARROW_DOWN);
                await keyDown(ARROW_DOWN);
                expect(document.activeElement.title).to.equal(
                    'Lightroom (1TB)',
                );
                await keyDown(ARROW_LEFT);
                expect(document.activeElement.title).to.equal('After Effects');
                await keyDown(ARROW_DOWN);
                expect(document.activeElement.title).to.equal('Dreamweaver');
                // Tab click cannot be simulated
            });

            it('alphabetical: should support navigation by keyboard', async () => {
                pushState({ sort: 'alphabetical' });
                render();
                await delay(100);
                const acrobat = visibleCards(2);
                acrobat.focus();
                await keyDown(ARROW_RIGHT);
                expect(document.activeElement.title).to.equal('Acrobat Pro');
                await keyDown(ARROW_RIGHT);
                expect(document.activeElement.title).to.equal('Acrobat Pro');
                await keyDown(ARROW_DOWN);
                await keyDown(ARROW_LEFT);
                expect(document.activeElement.title).to.equal('Acrobat Reader');
                await keyDown(ARROW_UP);
                expect(document.activeElement.title).to.equal(
                    'Acrobat PDF Pack',
                );
                await keyDown(ARROW_DOWN);
                await keyDown(ARROW_DOWN);
                expect(document.activeElement.title).to.equal(
                    'Acrobat Standard',
                );
                await keyDown(ARROW_DOWN);
                expect(document.activeElement.title).to.equal(
                    'Adobe Embedded Print Engine',
                );
                await keyDown(ARROW_RIGHT);
                expect(document.activeElement.title).to.equal('Adobe Express');
            });
        });
    } else {
        appendMiloStyles();
    }
});

document.getElementById('showMore').addEventListener('click', () => {
    document.location.hash = '';
    const [merchCards, render] = prepareTemplate('catalogCards');
    merchCards.setAttribute('limit', 16);
    merchCards.setAttribute('page', 1);
    render();
});
