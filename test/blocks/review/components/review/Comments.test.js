import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../../libs/deps/htm-preact.js';
import { waitForElement, delay } from '../../../../helpers/waitfor.js';

import Comments from '../../../../../libs/blocks/review/components/review/Comments.js';

describe('Comments', () => {
  beforeEach(() => {
    const mockFn = () => {};
    const comment = html`<${Comments}
      label=""
      comment=""
      handleCommentChange=${mockFn}
    />`;
    render(comment, document.body);
  });
  it('should display text area', async () => {
    const commentElem = await waitForElement(
      'fieldset.hlx-Review-commentFields',
    );
    const textAreaElem = commentElem.querySelector('textarea');
    expect(textAreaElem).to.exist;
  });

  it('could be focussed', async () => {
    const commentElem = await waitForElement(
      'fieldset.hlx-Review-commentFields',
    );
    const ctaCoverElem = commentElem.querySelector('#ctaCover');
    const textAreaElem = commentElem.querySelector('textarea');
    ctaCoverElem.click();

    const isSelected = textAreaElem === document.activeElement;
    expect(isSelected).to.be.true;
    expect(commentElem.classList.contains('has-focus')).to.be.true;
  });

  it('should test for input blur', async () => {
    const commentElem = await waitForElement('.hlx-Review-commentFields');
    const textAreaElem = commentElem.querySelector('textarea');
    const onBlurEvent = new Event('blur');
    textAreaElem.dispatchEvent(onBlurEvent);
    await delay(100);
    expect(commentElem.classList.contains('has-focus')).to.be.false;
  });

  it('should test for input change', async () => {
    const commentElem = await waitForElement('.hlx-Review-commentFields');
    const textAreaElem = commentElem.querySelector('textarea');
    const onInputChange = new Event('input');
    textAreaElem.dispatchEvent(onInputChange);
    expect(textAreaElem.getAttribute('value')).to.be.null;
  });
});
