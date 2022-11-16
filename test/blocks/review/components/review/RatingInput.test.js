import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../../helpers/waitfor.js';

import RatingInput from '../../../../../libs/blocks/review/components/review/RatingInput.js';

describe('RatingInput', () => {
  beforeEach(() => {
    const mockFn = () => {};
    const ratingInput = html`<${RatingInput}
      index="1"
      isInteractive="true"
      onClick=${mockFn}
      hasKeyboardFocus="true"
      isActive="true"
      isHovering="true"
      starString="star"
      starStringPlural="stars"
      tooltip="bad"
    />`;
    render(ratingInput, document.body);
  });

  it('should display rating Input', async (done) => {
    done();
    const ratingInputElement = await waitForElement('.hlx-Review-ratingFields');
    expect(ratingInputElement).to.exist;
  });

  it('should test keypress event', async (done) => {
    done();
    const ratingInputElement = await waitForElement(
      '.hlx-Review-ratingFields input',
    );
    expect(ratingInputElement.classList.contains('has-keyboard-focus')).to.be
      .true;
  });
});
