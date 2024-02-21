import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../../helpers/waitfor.js';
import { loadStyle } from '../../../../../libs/utils/utils.js';

import Ratings from '../../../../../libs/blocks/review/components/review/Ratings.js';

const loadStyles = (path) => new Promise((resolve) => {
  loadStyle(`../../../../libs/${path}`, resolve);
});

describe('Ratings keypress', () => {
  let mockFn;
  before(async () => {
    loadStyles('../../../../libs/blocks/review/review.css');
  });
  beforeEach(() => {
    mockFn = sinon.spy();
    const ratings = html`<${Ratings}
        count="5"
        isInteractive="true"
        onClick=${mockFn}
        onRatingHover=${mockFn}
        rating="0"
        starsLegend="Choose a star rating"
        starString="star"
        starStringPlural="stars"
        tooltips=${['Poor', 'Bad', 'Good', 'Very good', 'Excellent']}
        tooltipDelay="5"
      />`;
    render(ratings, document.body);
  });

  it('should test keypress on ratings', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    await new Promise((resolve) => { setTimeout(() => resolve(), 20); });
    const stars = ratingElement.querySelectorAll('input');
    stars[0].focus();
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(stars[1]);
    await sendKeys({ press: 'ArrowRight' });
    expect(document.activeElement).to.equal(stars[2]);
    await sendKeys({ press: 'Enter' });
    await new Promise((resolve) => { setTimeout(() => resolve(), 100); });
    expect(stars[2].getAttribute('aria-checked')).to.equal('true');
  });
});

describe('Ratings', () => {
  let mockFn;
  before(async () => {
    loadStyles('../../../../libs/blocks/review/review.css');
  });
  beforeEach(() => {
    mockFn = sinon.spy();
    const ratings = html`<${Ratings}
        count="5"
        isInteractive="true"
        onClick=${mockFn}
        onRatingHover=${mockFn}
        rating="2"
        starsLegend="Choose a star rating"
        starString="star"
        starStringPlural="stars"
        tooltips=${['Poor', 'Bad', 'Good', 'Very good', 'Excellent']}
        tooltipDelay="5"
      />`;
    render(ratings, document.body);
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should display ratings', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    expect(ratingElement).to.exist;
  });

  it('should call onClick when a rating star is clicked', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const stars = ratingElement.querySelectorAll('input');
    const first = stars[0];
    const second = stars[1];
    first.click();
    await new Promise((resolve) => { setTimeout(() => resolve(), 100); });
    expect(first.getAttribute('aria-checked')).to.equal('true');
    expect(second.getAttribute('aria-checked')).to.equal('false');
    second.click();
    await new Promise((resolve) => { setTimeout(() => resolve(), 100); });
    expect(first.getAttribute('aria-checked')).to.equal('false');
    expect(second.getAttribute('aria-checked')).to.equal('true');
  });

  it('should call focus and blur', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const stars = ratingElement.querySelectorAll('input');
    const third = stars[2];
    third.focus();
    await new Promise((resolve) => { setTimeout(() => resolve(), 10); });
    expect(document.activeElement).to.equal(third);
    third.blur();
    expect(document.activeElement).not.to.equal(third);
    ratingElement.blur();
  });

  it('should have correct tooltip data on a rating star', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    await new Promise((resolve) => { setTimeout(() => resolve(), 100); });
    const star = ratingElement.querySelectorAll('input')[2]; // For example, the third star
    const tooltipText = star.getAttribute('data-tooltip');
    await new Promise((resolve) => { setTimeout(() => resolve(), 10); });
    expect(tooltipText).to.equal('Good');
  });
  it('should handle mouseover, mouseout, and onMouseDown', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    const stars = ratingElement.querySelectorAll('input');
    const forth = stars[3];
    const fifth = stars[4];
    forth.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(() => resolve(), 150); });
    expect(forth.classList.contains('is-hovering')).to.be.true;
    forth.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    forth.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(() => resolve(), 150); });
    expect(forth.classList.contains('is-hovering')).to.be.false;
    fifth.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    fifth.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await new Promise((resolve) => { setTimeout(() => resolve(), 150); });
    expect(fifth.classList.contains('is-Active')).to.be.true;
    forth.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    forth.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  });
});

describe('Ratings when not interactive', () => {
  before(async () => {
    await loadStyles('../../../../libs/blocks/review/review.css');
  });

  beforeEach(() => {
    const ratings = html`<${Ratings}
      count="5"
      isInteractive=${false}
      onClick=${() => {}}
      onRatingHover=${() => {}}
      rating="3"
      starsLegend="Choose a star rating"
      starString="star"
      starStringPlural="stars"
      tooltips=${['Poor', 'Bad', 'Good', 'Very good', 'Excellent']}
      tooltipDelay="5"
    />`;
    render(ratings, document.body);
  });

  it('should not respond to mouse events', async () => {
    const ratingElement = await waitForElement('.hlx-Review-ratingFields');
    if (!ratingElement) throw new Error('Rating element not found');
    const stars = ratingElement.querySelectorAll('input');
    const testStar = stars[2];
    testStar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    testStar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    testStar.click();
    await new Promise((resolve) => { setTimeout(() => resolve(), 200); });
    expect(testStar.classList.contains('interaction-class')).to.be.false;
  });
});
