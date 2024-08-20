import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { html, signal, useMemo, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import Url from '../../../../libs/blocks/floodgateui/url/view.js';
import { urls } from '../../../../libs/blocks/floodgateui/utils/state.js';
import Tabs, { TabPanel } from '../../../../libs/blocks/floodgateui/url/tabs.js';
import { handleAction, setActions } from '../../../../libs/blocks/floodgateui/url/index.js';
import View from '../../../../libs/blocks/floodgateui/heading/view.js';
import { docUrls, mockPayload, sampleItem } from './urls-mockdata.js';
import { mockFetch } from '../../../helpers/generalHelpers.js';

function useSignal(value) {
  return useMemo(() => signal(value), []);
}

describe('Url - View', () => {
  before(async () => {
    const review = html`<${View} item=${docUrls[0]} idx=${0} />`;
    urls.value = [...docUrls];
    render(review, document.body);
  });

  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render the Url component with sourcePath', async () => {
    const payload = mockPayload;
    window.fetch = await mockFetch({ payload });
    const item = { pathname: '/drafts/Soujanya/pdfviewsdk', langstore: { pathname: '/drafts/Soujanya/pdfviewsdk' } };
    const suffix = ['source'];
    const idx = 0;
    const urlComponent = html`<${Url} suffix=${suffix} item=${item} idx=${idx} />`;
    render(urlComponent, document.body);

    const urlPathElem = await waitForElement('.fgui-url-path');
    expect(urlPathElem.textContent).to.equal('/drafts/Soujanya/pdfviewsdk');
    window.dispatchEvent(new Event('scroll'));
    clock.tick(2000);

    const TestComponent = () => {
      const itemPath = useSignal({ path: '/drafts/Soujanya/pdfviewsdk' });
      setActions(itemPath, 'floodgate', idx);
      clock.tick(2000);
      return html`<div>${itemPath}</div>`;
    };
    expect(document.body.innerHTML).contains('Actions');
    render(html`<${TestComponent} />`, document.body);
  });

  it('should render the Tabs component for sourcePath', async () => {
    const suffix = 'source';
    const path = '/drafts/Soujanya/pdfviewsdk';
    const idx = 0;
    window.dispatchEvent(new Event('scroll'));
    clock.tick(2000);
    const tabsComponent = html`<${Tabs} suffix=${suffix} path=${path} idx=${idx} />`;
    render(tabsComponent, document.body);
    const tabButtonsContainer = await waitForElement('.fgui-tab-buttons');
    const tabButtons = tabButtonsContainer.querySelectorAll('.fgui-url-tab-button');
    expect(tabButtons.length).to.equal(2);
  });

  it('should render the Tabs panel component with actions for sourcePath', async () => {
    const item = sampleItem;
    const suffix = 'source';
    const idx = 0;
    const tab = { title: 'Actions', selected: true };
    const tabsComponent = html`<${TabPanel} suffix=${suffix} idx=${idx} tab=${tab} item=${item} />`;
    render(tabsComponent, document.body);
    expect(document.body.innerHTML).contains('Live');
    expect(document.body.innerHTML).to.not.contains('Live Time');
  });

  it('should render the Tabs panel component with details for sourcePath', async () => {
    const item = sampleItem;
    const suffix = 'source';
    const idx = 0;
    const tab = { title: 'Details', selected: true };
    const tabsComponent = html`<${TabPanel} suffix=${suffix} idx=${idx} tab=${tab} item=${item} />`;
    render(tabsComponent, document.body);
    expect(document.body.innerHTML).contains('Preview Time');
  });

  it('should handle action and open URL in a new tab', async () => {
    const url = 'https://example.com';
    const windowOpenStub = sinon.stub(window, 'open');
    handleAction(url);
    expect(windowOpenStub.calledWith(url, '_blank')).to.be.true;
    windowOpenStub.restore();
  });
});
