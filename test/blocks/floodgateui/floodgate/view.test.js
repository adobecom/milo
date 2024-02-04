import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { html, render } from '../../../../libs/deps/htm-preact.js';
import { waitForElement } from '../../../helpers/waitfor.js';
import Floodgate from '../../../../libs/blocks/floodgateui/floodgate/view.js';
import { setup } from '../../../../libs/blocks/floodgateui/floodgate/index.js';
import {
  loadHeadingCheck,
  heading,
  canRefresh,
  allowFindFragments,
  loadDetailsCheck,
  renderModal,
  shouldOpenModalOnMount,
  allActionStatus,
  copyStatusCheck,
} from '../../../../libs/blocks/floodgateui/utils/state.js';
import { account } from '../../../../libs/tools/sharepoint/state.js';
import { mockFetch } from '../../../helpers/generalHelpers.js';
import { ProjectStatus } from '../../../../libs/blocks/floodgateui/floodgate/projectStatus.js';
import { loadHeading, loadDetails, loadProjectSettings } from '../../../../libs/blocks/floodgateui/floodgate/index.js';
import { act } from 'preact/test-utils';
import { mockPayload, mockPayloadDelete, mockPayloadPromote } from './mockdata';

describe('Floodgate Index Functions', () => {
  it('load project settings sets heading values correctly (when project id is present)', () => {
    const projSettings = [
      { key: 'FloodgateIOEnv', value: 'production' },
      { key: 'FloodgateColor', value: 'blue' },
      { key: 'Project ID', value: '12345' },
    ];
    loadProjectSettings(projSettings);
    expect(heading.value.fgColor).to.equal('blue');
    expect(heading.value.env).to.equal('production');
    expect(canRefresh.value).to.not.equal(true);
    expect(allowFindFragments.value).to.not.equal(true);
  });

  it('load project settings sets heading values correctly (when project id is not present)', () => {
    const projSettings = [
      { key: 'FloodgateIOEnv', value: 'production' },
      { key: 'FloodgateColor', value: 'blue' },
    ];
    loadHeading();
    loadDetails();
    loadProjectSettings(projSettings);
    expect(heading.value.fgColor).to.equal('blue');
    expect(heading.value.env).to.equal('production');
    expect(canRefresh.value).to.equal(true);
    expect(allowFindFragments.value).to.equal(true);
  });
});

describe('Floodgate View Component', () => {
  it('renders without errors', () => {
    const container = document.createElement('div');
    render(html`<${Floodgate} />`, container);
    expect(container.innerHTML).to.not.be.empty;
  });

  it('displays login button when not logged in', async () => {
    const container = document.createElement('div');
    render(html`<${Floodgate} />`, container);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(container.innerHTML).to.include('Open login');
  });
});

describe('Floodgate Setup Functions', () => {
  it('calls setup function when login button is clicked', () => {
    const setupSpy = sinon.spy(setup);
    const container = document.createElement('div');
    render(html`<button class="fg-action" onClick=${setupSpy}>Open login</button>`, container);
    const loginButton = container.querySelector('.fg-action');
    loginButton.click();
    expect(setupSpy.calledOnce).to.be.true;
  });

  it('renders ProjectStatus components after setup', async () => {
    loadHeadingCheck.value = true;
    account.value.username = true;
    render(html`<${Floodgate} />`, document.body);
    const container = await waitForElement('.fgui-subprojects');
    expect(container.querySelectorAll('.fgui-subproject')).to.have.lengthOf(3);
  });

  it('displays PROJECT STATUS when logged in', async () => {
    const payload = mockPayload;
    window.fetch = await mockFetch({ payload });
    loadHeadingCheck.value = true;
    account.value.username = true;
    const container = document.createElement('div');
    render(html`<${Floodgate} />`, container);
    expect(container.innerHTML).to.include('PROJECT STATUS');
  });

  it('displays floodgate content when floodgate color is present', async () => {
    loadHeadingCheck.value = true;
    account.value.username = true;
    heading.value = { editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    const container = document.createElement('div');
    render(html`<${Floodgate} />`, container);
    expect(container.innerHTML).to.include('pink');
  });

  it('displays heading when heading value is present', async () => {
    loadHeadingCheck.value = true;
    loadDetailsCheck.value = true;
    account.value.username = true;
    heading.value = { editUrl: 'Heading Sample' };
    const container = document.createElement('div');
    render(html`<${Floodgate} />`, container);
    expect(container.innerHTML).to.include('Heading Sample');
  });

  it('displays Overall Data when error symbol is clicked in promote status modal', async () => {
    heading.value = {
      ...heading.value,
      env: 'stage',
    };
    const payload = mockPayloadPromote;
    window.fetch = await mockFetch({ payload });
    loadDetailsCheck.value = true;
    account.value.username = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value, editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    render(html`<${Floodgate} />`, document.body);
    const promoteErrorButton = document.querySelectorAll('.error-symbol');
    await promoteErrorButton[0].click();
    await new Promise(resolve => setTimeout(resolve, 100));
    const overallDataModal = document.querySelector('#overall-data-modal-overlay');
    expect(overallDataModal).to.exist;
  });

  it('displays failed pages for batch when error for the batch is clicked', async () => {
    heading.value = {
      ...heading.value,
      env: 'stage',
    };
    const payload = mockPayloadPromote;
    window.fetch = await mockFetch({ payload });
    loadDetailsCheck.value = true;
    account.value.username = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value, editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    render(html`<${Floodgate} />`, document.body);
    const promoteErrorButton = document.querySelectorAll('.error-symbol');
    promoteErrorButton[1].click();
    await new Promise(resolve => setTimeout(resolve, 100));
    const batchDataModal = document.querySelector('#failed-pages-modal-overlay');
    const batchClick = document.querySelectorAll('.batch-click');
    batchClick[0].click(1);
    expect(batchDataModal).to.exist;
  });
});

describe('Floodgate Setup Functions', () => {
  let clock;

  before(() => {
    clock = sinon.useFakeTimers();
  });

  after(() => {
    clock.restore();
  });

  it('check if action status is updated when project status is rendered', async () => {
    heading.value = {
      ...heading.value,
      env: 'stage',
    };
    const payload = mockPayload;
    window.fetch = await mockFetch({ payload });
    allActionStatus.value = payload;
    loadDetailsCheck.value = true;
    account.value.username = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value, editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    render(html`<${ProjectStatus} action="copy" />`, document.body);
    render(html`<${ProjectStatus} action="delete" />`, document.body);
    render(html`<${ProjectStatus} action="promote" />`, document.body);
    clock.tick(3000);
    expect(copyStatusCheck.value).to.equal('IN PROGRESS');
  });

  it('update the copy status every 30 seconds', async () => {
    heading.value = {
      ...heading.value,
      env: 'stage',
    };
    const payload = mockPayload;
    window.fetch = await mockFetch({ payload });
    allActionStatus.value = payload;

    loadDetailsCheck.value = true;
    account.value.username = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value, editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    const container = document.createElement('div');
    await act(async () => {
      render(html`<${ProjectStatus} action="copy" />`, container);
      await Promise.resolve();
    });
    clock.tick(30000);

    await act(async () => {
      await Promise.resolve();
    });
    expect(copyStatusCheck.value).to.equal('IN PROGRESS');
  });

  it('truncate message of project status when beyond threshold', async () => {
    heading.value = {
      ...heading.value,
      env: 'stage',
    };
    const payload = mockPayloadDelete;
    window.fetch = await mockFetch({ payload });
    allActionStatus.value = payload;

    loadDetailsCheck.value = true;
    account.value.username = true;
    renderModal.value = true;
    shouldOpenModalOnMount.value = true;
    heading.value = {
      ...heading.value, editUrl: 'Heading Sample' };
    heading.value = {
      ...heading.value,
      fgColor: 'pink',
    };
    heading.value.floodgate = 'Milo-pink';
    render(html`<${ProjectStatus} action="delete" />`, document.body);
    clock.tick(3000);
    const message = document.querySelector('.fgui-subproject-name[title]');
    expect(message.getAttribute('title')).to.equal('Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.');
    expect(message.textContent).to.equal('Deletion completed successfully.Deletion completed successfully.Deletion completed successfully.Deletion ...');
  });
});

