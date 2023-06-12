import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { stubLogin, stubFetchVersions, stubFetch, restoreFetch } from './mockFetch.js';

import View from '../../../libs/blocks/version-history/view.js';

describe('View', () => {
  const stubCreateTagFn = sinon.stub().returns('Created')
  before(() => {
    stubFetch();
    stubFetchVersions();
  })

  after(() => {
    restoreFetch();
  });

  beforeEach(async () => {
    const review = html`<${View} loginToSharePoint=${stubLogin} createHistoryTag=${stubCreateTagFn}/>`;
    render(review, document.body);
  });

  it('should display text area', async () => {
    const commentElem = await waitForElement('.comment-container');
    const textAreaElem = commentElem.querySelector('textarea');
    expect(textAreaElem).to.exist;
  });

  it('should set the comment when textarea onchange event', async () => {
    const element = await waitForElement('.container');
    const textAreaElem = element.querySelector('#comment');
    const onInputChange = new Event('change', { currentTarget: { value: 'New value'}});
    textAreaElem.dispatchEvent(onInputChange);
    expect(textAreaElem.value).to.be.empty;
  });

  it('should call create tag api when click of create button', async () => {
    const element = await waitForElement('.container');
    const createBtn = element.querySelector('#create');
    createBtn.dispatchEvent(new Event('click'));
    expect(stubCreateTagFn.calledOnce).to.be.true;
  });

  it('downloadVersionFile: should call anchor tag click on click of download button', async () => {
    const element = await waitForElement('.container');
    const tdElem = element.querySelector('.download');
    const clickSpy = sinon.spy(HTMLAnchorElement.prototype, 'click');
    tdElem.dispatchEvent(new Event('click'));
    expect(clickSpy.calledOnce).to.be.true;
    clickSpy.restore();
  });
  
});
