/* eslint-disable no-unused-expressions */
/* global describe it beforeEach */
import { expect } from '@esm-bundle/chai';
// import { fireEvent, render, screen } from '@testing-library/preact';
import { html, render } from '../../../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../../../helpers/selectors.js';

import Comments from '../../../../../../libs/blocks/review/components/review/Comments.js';

describe('Comments', () => {
  beforeEach(() => {
    const comment = html`<${Comments} label="" comment="" />`;
    render(comment, document.body);
  });
  it('should display text area', async () => {
    const commentElem = await waitForElement(
      'fieldset.hlx-Review-commentFields'
    );
    const textAreaElem = commentElem.querySelector('textarea');
    expect(textAreaElem).to.exist;
  });

  it('could be focussed', async () => {
    const commentElem = await waitForElement(
      'fieldset.hlx-Review-commentFields'
    );
    const ctaCoverElem = commentElem.querySelector('#ctaCover');
    const textAreaElem = commentElem.querySelector('textarea');
    ctaCoverElem.click();

    const isSelected = textAreaElem === document.activeElement;
    expect(isSelected).to.be.true;
    expect(commentElem.classList.contains('has-focus')).to.be.true;
  });
});
