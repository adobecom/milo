import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement, delay } from '../../../../helpers/waitfor.js';

import Review from '../../../../../libs/blocks/review/components/review/Review.js';

describe('Review', () => {
  beforeEach(() => {
    window.localStorage.setItem('/data/review', JSON.stringify({ rating: 5 }));
    const review = html`<${Review} averageRating="5" initialRating="5" />`;
    render(review, document.body);
  });
  afterEach(() => {
    localStorage.removeItem('/data/review');
  });

  it('should display review', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const titleElement = reviewElement.querySelector('.hlx-reviewTitle');
    expect(reviewElement).to.exist;
    expect(titleElement).to.exist;
  });

  it('should test ratings active decoration ', async () => {
    await delay(100);
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingElements = reviewElement.querySelectorAll('.hlx-Review-ratingFields input');
    await delay(100);
    ratingElements.forEach((rating) => {
      expect(rating.classList.contains('is-Active')).to.be.true;
    });
    await delay(100);
  });

  it('should test ratings click above comment threshold', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingElement = reviewElement.querySelectorAll('.hlx-Review-ratingFields input')[4];
    ratingElement.dispatchEvent(new Event('click'));
    await delay(100);
    const comments = reviewElement.querySelector('#rating-comments');
    expect(ratingElement.getAttribute('aria-checked')).to.equal('true');
    expect(comments).not.to.exist;
  });

  it('should test click ratings below comment threshold', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingElement = reviewElement.querySelectorAll('.hlx-Review-ratingFields input')[1];
    ratingElement.dispatchEvent(new Event('click'));
    await delay(100);
    const comments = reviewElement.querySelector('#rating-comments');
    expect(ratingElement.getAttribute('aria-checked')).to.equal('true');
    expect(comments).to.exist;
  });

  it('should test click ratings equal comment threshold', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const ratingElement = reviewElement.querySelectorAll('.hlx-Review-ratingFields input')[2];
    ratingElement.dispatchEvent(new Event('click'));
    await delay(100);
    const comments = reviewElement.querySelector('#rating-comments');
    expect(ratingElement.getAttribute('aria-checked')).to.equal('true');
    expect(comments).to.exist;
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
