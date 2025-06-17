import { runTests } from '@web/test-runner-mocha';
import { expect } from '@esm-bundle/chai';
import {
    elementClick,
    delay,
    refreshElement,
    resetState,
    toggleLargeDesktop,
} from '../utils.js';
import '../../src/sidenav/merch-sidenav.js';
import '../../src/sidenav/merch-sidenav-list.js';
import '../../src/sidenav/merch-sidenav-checkbox-group.js';
import '../../src/merch-search.js';

const getFilters = () => document.querySelector('merch-sidenav-list');
const getItems = () => getFilters().querySelectorAll('sp-sidenav-item');
const click = async (value) => {
    const node = getFilters().querySelector(
        `sp-sidenav-item[value=${value}]`,
    );
    await elementClick(node);
};
const expectedSelection = (expectedValue) => {
    const item = getFilters().querySelector(
        `sp-sidenav-item[value=${expectedValue}]`,
    );
    expect(item).not.to.be.null;
    expect(item.getAttribute('selected')).to.equal(
        '',
        `${expectedValue} should be selected`,
    );
    expect(item.value).to.equal(expectedValue);
    return item;
};

const shouldSkipTests = sessionStorage.getItem('skipTests') ?? false;

runTests(async () => {
    const container = document.getElementById('merch-sidenav');
    await toggleLargeDesktop();
    if (shouldSkipTests === 'true') {
        return;
    }
    await import('../../src/mas.js');

    beforeEach(() => {
        window.location.hash = '';
        container.innerHTML = '';
    });

    const render = async () => {
        container.append(
            document
                .getElementById('merch-sidenav-template')
                .content.cloneNode(true),
        );
        await delay(10);
    };

    describe('Plans filters desktop sidenav', () => {
        it('renders navigation element', async () => {
            await render();
            expect(getFilters()).to.be.not.null;
        });

        it('renders navigation items element', async () => {
            await render();
            expect(getItems().length).to.equal(3); 
        });

        it('by default should be selected all', async () => {
            await render();
            expectedSelection('all');
        });

        it('clicking on a navigation item updates the icon & main nav selected text', async () => {
            await render();
            await click('creativitydesign');
            const item = expectedSelection('creativitydesign');
            expect(window.location.hash).to.equal('#filter=creativitydesign');
            expect(item.label).to.equal('Creativity And Design');
            expect(item.parentElement.parentElement.selectedText).to.equal('CREATE!');
        });

        it('updates the navigation item depending of state', async () => {
            window.location.hash = 'filter=pdfesignature';
            await render();
            await delay(100);
            expectedSelection('pdfesignature');
            window.location.hash = 'filter=creativitydesign';
            await delay(100);
            expectedSelection('creativitydesign');
        });
    });
});
