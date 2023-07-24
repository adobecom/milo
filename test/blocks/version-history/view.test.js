import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { stubFetchVersions, stubFetch, restoreFetch, stubCreateVersions, stubGetconfig, configJson } from './mockFetch.js';
import View from '../../../libs/blocks/version-history/view.js';
import { setStatus } from '../../../libs/tools/sharepoint/state.js';
import { siteConfig } from '../../../libs/tools/sharepoint/state.js'

describe('View', () => {
  before(() => {
    stubFetch();
    stubFetchVersions();
    stubCreateVersions();
    stubGetconfig();
    siteConfig.value = configJson;
    window.msal = {
      PublicClientApplication: function () {
        return {
          getAllAccounts: () => [{ username: 'test'}],
          loginPopup: sinon.stub().resolves(),
          acquireTokenSilent: sinon.stub().resolves({ accessToken: 'fake-access-token' }),
        };
      },
    };
  })

  after(() => {
    restoreFetch();
    delete window.msal;
  });

  beforeEach(async () => {
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display text area', async () => {
    const commentElem = await waitForElement('.comment-container');
    const textAreaElem = commentElem.querySelector('textarea');
    setStatus('config', 'info', 'displayed', '', 1000);
    expect(textAreaElem).to.exist;
  });

  it('should set the comment when textarea onchange event', async () => {
    const element = await waitForElement('.container');
    const textAreaElem = element.querySelector('#comment');
    const onInputChange = new Event('keyup', { currentTarget: { value: 'New value' } });
    textAreaElem.dispatchEvent(onInputChange);
    expect(textAreaElem.value).to.be.empty;
  });

  it('should call create version api with comment value', async () => {
    const element = await waitForElement('.container');
    const createBtn = element.querySelector('#create');
    stubCreateVersions('New comment', false);
    createBtn.dispatchEvent(new Event('click'));
  });

  it('should call create version api with empty comment', async () => {
    const element = await waitForElement('.container');
    const createBtn = element.querySelector('#create');
    stubCreateVersions('', true);
    createBtn.dispatchEvent(new Event('click'));
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
