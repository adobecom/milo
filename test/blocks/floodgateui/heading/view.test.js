import { expect } from '@esm-bundle/chai';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import View from '../../../../libs/blocks/floodgateui/heading/view.js';
import { heading, projectStatus, renderSignal, urls, statuses, shouldOpenModalOnMount } from '../../../../libs/blocks/floodgateui/utils/state.js';
import { account } from '../../../../libs/tools/sharepoint/state.js';

describe('View', () => {
  before(async () => {
    heading.value = {
      name: 'fBook_001234d3ffplpbn',
      editUrl: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc={B117D213-406A-4B68-A1D0-73DD5E5B56BE}',
      path: '/drafts/blaishram/fbook-001234d3ffplpbn',
      source: 'milo',
      floodgate: 'milo-pink',
    };
    account.value = {
      name: 'Nethraa Sivakumar'
    };
    projectStatus.value = { projectStatusText: 'Waiting' };
    const review = html`<${View} />`;
    render(review, document.body);
  });

  it('should display the correct title', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const firstTitleElem = container.querySelector('h2').textContent;
    expect(firstTitleElem).to.equal('Project');
  });

  it('should display the correct project name', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const projectNameElem = container.querySelector('.fgui-project-details-project span').textContent;
    expect(projectNameElem).to.equal('fBook_001234d3ffplpbn');
  });

  it('should have an "Edit" link with the correct href', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const editLinkElem = container.querySelector('.fgui-project-details-edit');
    expect(editLinkElem).to.exist;
    expect(editLinkElem.getAttribute('href')).to.equal('https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc={B117D213-406A-4B68-A1D0-73DD5E5B56BE}');
  });

  it('should have a "Refresh" button', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const refreshButtonElem = container.querySelector('.fgui-project-details-refresh');
    expect(refreshButtonElem).to.exist;
    expect(refreshButtonElem.textContent.trim()).to.equal('Refresh');
  });

  it('should display the correct source content', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const sourceContentElem = container.querySelector('.fgui-project-details-name span').textContent;
    expect(sourceContentElem).to.equal('milo');
  });

  it('should display the correct floodgate content', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const floodgateContentElem = container.querySelectorAll('.fgui-project-details-name span')[1].textContent;
    expect(floodgateContentElem).to.equal('milo-pink');
  });

  it('should display the correct logged-in user name', async () => {
    const container = await waitForElement('.fgui-project-heading');
    const loggedInUserElem = container.querySelectorAll('.fgui-project-details-name span')[2].textContent;
    expect(loggedInUserElem).to.equal('Nethraa Sivakumar');
  });

  it('should not rerender heading after clicking "Refresh" button when projectId exists', async () => {
    heading.value.projectId = 'someProjectId';
    const renderSignalBefore = renderSignal.value;
    const refreshButton = document.querySelector('.fgui-project-details-refresh');
    refreshButton.click();
    await waitForElement('.fgui-project-heading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const renderSignalAfter = renderSignal.value;
    expect(renderSignalAfter).to.equal(renderSignalBefore);
  });

  it('should rerender the heading after clicking "Refresh" button when projectId does not exist', async () => {
    heading.value.projectId = null;
    const renderSignalBefore = renderSignal.value;
    const refreshButton = document.querySelector('.fgui-project-details-refresh');
    refreshButton.click();
    await waitForElement('.fgui-project-heading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const renderSignalAfter = renderSignal.value;
    expect(renderSignalAfter).to.equal(renderSignalBefore + 1);
  });

  it('should set urls, statuses, and shouldOpenModalOnMount appropriately after clicking "Refresh" button when projectId is not present', async () => {
    heading.value.projectId = null;
    const refreshButton = document.querySelector('.fgui-project-details-refresh');
    refreshButton.click();
    await waitForElement('.fgui-project-heading');
    expect(urls.value).to.be.an('array').that.is.empty;
    expect(statuses.value).to.deep.equal({});
    expect(shouldOpenModalOnMount.value).to.be.false;
  });

});
