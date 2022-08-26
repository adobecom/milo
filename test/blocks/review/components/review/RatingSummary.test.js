/* eslint-disable no-unused-expressions */
/* global describe it beforeEach */
import { expect } from '@esm-bundle/chai';
// import { fireEvent, render, screen } from '@testing-library/preact';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../../helpers/selectors.js';

import RatingSummary from '../../../../../libs/blocks/review/components/review/RatingSummary.js';

describe('RatingSummary', () => {
  beforeEach(() => {
    const ratingSummary = html`<${RatingSummary}
      averageRating="4"
      maxRating="5"
      totalReviews="100"
      reviewString="Review"
      reviewStringPlural="Reviews"
    />`;
    render(ratingSummary, document.body);
  });

  it('should display rating summary', async () => {
    const reviewElement = await waitForElement('div.hlx-ReviewStats');
    expect(reviewElement).to.exist;
  });
});
