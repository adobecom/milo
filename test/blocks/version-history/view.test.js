import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { stubLogin, stubFetchVersions, stubFetch, restoreFetch } from './mockFetch.js';
import View from '../../../libs/blocks/version-history/view.js';

describe('View', () => {

  before(() => {
    stubFetch();
    stubFetchVersions();
  })

  after(() => {
    restoreFetch();
  });

  beforeEach(async () => {
    const review = html`<${View} loginToSharePoint=${stubLogin}/>`;
    render(review, document.body);
  });

  it('should display text area', async () => {

    const commentElem = await waitForElement('.comment-container');
    const textAreaElem = commentElem.querySelector('textarea');
    expect(textAreaElem).to.exist;
  });

  it('should test comment textarea onchange', async () => {
    const element = await waitForElement('.container');
    const textAreaElem = element.querySelector('#comment');
    textAreaElem.value = 'New value';
    const onInputChange = new Event('change');
    textAreaElem.dispatchEvent(onInputChange);
    expect(textAreaElem.value).to.equal('New value');
    const createBtn = element.querySelector('#create');
    createBtn.dispatchEvent(new Event('click'));
  });

  it('downloadVersionFile: should test comment textarea onchange', async () => {
    const element = await waitForElement('.container');
    const tdElem = element.querySelector('.download');
    tdElem.dispatchEvent(new Event('click'));
  });
  
});
