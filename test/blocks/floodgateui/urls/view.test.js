import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import Urls from '../../../../libs/blocks/floodgateui/urls/view.js';
import { urls } from '../../../../libs/blocks/floodgateui/utils/state.js';

describe('View', () => {
  it('should render urls', async () => {
    const review = html`<${Urls} />`;
    render(review, document.body);
  });

  it('when urls are greater than 500', async () => {
    const stringList = Array.from({ length: 500 }, () => 'trial');
    urls.value = stringList;
    const review = html`<${Urls} />`;
    render(review, document.body);
    const pageButton = document.querySelectorAll('.page-button');
    expect(pageButton.length).to.equal(14);
  });

  it('should handle search change', async () => {
    const objectsList = Array.from({ length: 500 }, (_, index) => ({ pathname: `trial${index + 1}` }));
    urls.value = objectsList;
    const review = html`<${Urls} />`;
    render(review, document.body);
    const searchInput = document.querySelector('.spectrum-search-field input');
    searchInput.value = 'example';
    searchInput.dispatchEvent(new Event('input'));
    const pageButton = document.querySelectorAll('.page-button');
    expect(pageButton.length).to.equal(14);
  });
});
