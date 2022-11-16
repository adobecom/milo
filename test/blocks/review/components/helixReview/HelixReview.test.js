import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement, delay } from '../../../../helpers/waitfor.js';

import HelixReview from '../../../../../libs/blocks/review/components/helixReview/HelixReview.js';
import {
  stubFetch,
  stubFetchError,
  stubEmptyResponse,
} from './mockHelixData.js';

describe('HelixReview', () => {
  stubFetch();
  beforeEach(() => {
    const strings = {
      tooltipdelay: 5,
      postUrl: '',
    };
    window.localStorage.setItem('/data/review', JSON.stringify({ rating: 5 }));
    const helixReview = html`<${HelixReview}
      clickTimeout="5000"
      commentThreshold="3"
      hideTitleOnReload="true"
      lang="en"
      reviewTitle="Review"
      strings=${strings}
      tooltipDelay=${strings.tooltipdelay}
      postUrl=${strings.postUrl}
      visitorId=""
      reviewPath="/data/review"
      onRatingSet=${(/* { rating, comment } */) => {}}
      onRatingHover=${(/* { rating } */) => {}}
      onReviewLoad=${(/* { hasRated, rating } */) => {}}
      productJson="{}"
    />`;
    render(helixReview, document.body);
  });

  it('should display review', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const titleElement = reviewElement.querySelector('.hlx-reviewTitle');
    expect(reviewElement).to.exist;
    expect(titleElement).to.exist;
  });

  it('should test handle submit', async () => {
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    const formElement = reviewElement.querySelector('.hlx-Review');
    formElement.dispatchEvent(new Event('submit'));
    await delay(100);
    const thankYouElement = reviewElement.querySelector('.hlx-submitResponse');
    expect(thankYouElement).to.exist;
  });

  it('should test the review without review path', async () => {
    stubEmptyResponse();
    const strings = {
      tooltipdelay: 5,
      postUrl: '',
    };
    const helixReview = html`<${HelixReview}
      clickTimeout="5000"
      commentThreshold="3"
      hideTitleOnReload="true"
      lang="en"
      reviewTitle="Review"
      strings=${strings}
      tooltipDelay=${strings.tooltipdelay}
      postUrl=${strings.postUrl}
      visitorId=""
      reviewPath="/data/review"
      onRatingSet=${(/* { rating, comment } */) => {}}
      onRatingHover=${(/* { rating } */) => {}}
      onReviewLoad=${(/* { hasRated, rating } */) => {}}
      productJson="{}"
    />`;
    render(helixReview, document.body);
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    expect(reviewElement).to.exist;
  });

  it('should test the review without review path', async () => {
    stubFetchError();
    window.localStorage.removeItem('/data/review');
    const strings = {
      tooltipdelay: 5,
      postUrl: '',
    };
    const helixReview = html`<${HelixReview}
      clickTimeout="5000"
      commentThreshold="3"
      hideTitleOnReload="true"
      lang="en"
      reviewTitle="Review"
      strings=${strings}
      tooltipDelay=${strings.tooltipdelay}
      postUrl=${strings.postUrl}
      visitorId=""
      reviewPath="/data/review"
      onRatingSet=${(/* { rating, comment } */) => {}}
      onRatingHover=${(/* { rating } */) => {}}
      onReviewLoad=${(/* { hasRated, rating } */) => {}}
      productJson="{}"
    />`;
    render(helixReview, document.body);
    const reviewElement = await waitForElement('.hlx-ReviewWrapper');
    expect(reviewElement).to.exist;
  });
});
