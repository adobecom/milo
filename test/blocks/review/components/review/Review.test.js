import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement, delay } from '../../../../helpers/waitfor.js';

import Review from '../../../../../libs/blocks/review/components/review/Review.js';

describe('Review', () => {
  beforeEach(() => {
    window.localStorage.setItem('/data/review', JSON.stringify({ rating: 5 }));
    const review = html`<${Review} averageRating="4" initialRating="4" />`;
    render(review, document.body);
  });

  it('should display review', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const titleElement = reviewElement.querySelector('.hlx-reviewTitle');
    expect(reviewElement).to.exist;
    expect(titleElement).to.exist;
  });

  it('should test ratings click above comment threshold', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingsElement = reviewElement.querySelectorAll(
      '.hlx-Review-ratingFields input',
    )[4];
    ratingsElement.dispatchEvent(new Event('click'));
    expect(ratingsElement.classList.contains('is-active')).to.be.false;
  });

  it('should test ratings click above comment threshold', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingsElement = reviewElement.querySelectorAll(
      '.hlx-Review-ratingFields input',
    )[1];
    ratingsElement.dispatchEvent(new Event('click'));
    expect(ratingsElement.classList.contains('is-active')).to.be.false;
  });

  it('should test for input change', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const commentElem = reviewElement.querySelector(
      '.hlx-Review-commentFields',
    );
    const textAreaElem = commentElem.querySelector('textarea');
    const onInputChange = new Event('input');
    textAreaElem.dispatchEvent(onInputChange);
    expect(textAreaElem.getAttribute('value')).to.be.null;
  });

  it('should test handle submit', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const formElement = reviewElement.querySelector('.hlx-Review');
    formElement.dispatchEvent(new Event('submit'));
    await delay(100);
    const thankYouElement = reviewElement.querySelector('.hlx-submitResponse');
    expect(thankYouElement).to.exist;
  });
});
