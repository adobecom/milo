import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../../helpers/waitfor.js';

import Ratings from '../../../../../libs/blocks/review/components/review/Ratings.js';

describe('Ratings', () => {
  beforeEach(() => {
    const mockFn = () => {};
    const ratings = html`<${Ratings}
        count="5"
        isInteractive="true"
        onClick=${mockFn}
        onRatingHover=${mockFn}
        rating="4"
        starsLegend="Choose a star rating"
        starString="star"
        starStringPlural="stars"
      />
      tooltips=['This sucks', 'Meh', "It's OK", 'I like it', 'Best thing ever']
      tooltipDelay=5000 />`;
    render(ratings, document.body);
  });

  it('should display ratings', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    expect(ratingElement).to.exist;
  });

  it('should test keypress on ratings', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const inputElements = ratingElement.querySelectorAll('input');
    const keyPressEvent = new KeyboardEvent('keypress', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    inputElements[3].dispatchEvent(keyPressEvent);
    expect(inputElements[3].classList.contains('is-Active')).to.be.true;
  });

  it('should test mouse events on fieldset', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const mouseDownEvent = document.createEvent('MouseEvents');
    mouseDownEvent.initEvent('mousedown', true, true);
    ratingElement.dispatchEvent(mouseDownEvent);
    const inputElement = ratingElement.querySelectorAll('input')[0];
    expect(inputElement.classList.contains('is-Active')).to.be.true;
  });

  it('should test focus on ratings', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const inputElements = ratingElement.querySelectorAll('input');
    ratingElement.dispatchEvent(new Event('focus'));
    expect(inputElements[3].classList.contains('is-Active')).to.be.true;
  });

  it('should test click on ratings input', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const inputElements = ratingElement.querySelectorAll('input');
    inputElements[3].dispatchEvent(new Event('click'));
    expect(inputElements[3].classList.contains('is-Active')).to.be.true;
  });
});
