import { stub } from 'sinon';
import { expect } from '@esm-bundle/chai';
import { sendKeys, readFile, sendMouse } from '@web/test-runner-commands';
import { delay, waitForRemoval } from '../../helpers/waitfor.js';
import './mocks/mock-sidekick.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/bulk-publish/bulk-publish.js');

const testPageUrl = 'https://main--milo--adobecom.hlx.page/drafts/sarchibeque/bulk-publish-test';

const setFetchResponse = (data, type = 'json', status = 200) => {
  window.fetch = stub().returns(
    new Promise((resolve) => {
      resolve({
        status,
        ok: status === 200,
        [type]: () => JSON.parse(data),
      });
    }),
  );
};

const clickEl = async (elem) => {
  const pos = elem?.getBoundingClientRect();
  await sendMouse({
    type: 'click',
    button: 'left',
    position: [
      parseInt((pos?.left ?? 0) + 1, 10),
      parseInt((pos?.top ?? 0) + 1, 10),
    ],
  });
};

describe('Bulk Publish Tool', () => {
  init(document.querySelector('.bulk-publish'));

  const bulkPub = document.querySelector('bulk-publish');
  const rootEl = bulkPub.shadowRoot;

  it('can render bulk publish tool', () => {
    expect(bulkPub).to.exist;
  });

  it('can prompt user to open sidekick', () => {
    const prompt = rootEl.querySelector('.login-prompt');
    expect(prompt).to.exist;
    expect(prompt.innerText).to.equal('Please open AEM sidekick to continue');
  });

  it('can close sign-in prompt', async () => {
    const mocksidekick = document.querySelector('helix-sidekick');
    mocksidekick.openMockSidekick();
    mocksidekick.setMockUserStatus();
    await waitForRemoval('.login-prompt');
    expect(rootEl.querySelector('.login-prompt')).to.not.exist;
  });

  it('can toggle ui mode', async () => {
    const toggleBtn = rootEl.querySelector('.switch.half');
    await clickEl(toggleBtn);
    delay(200);
    const pub = rootEl.querySelector('.bulk-publisher');
    expect(pub).to.exist;
  });

  it('can select process type', async () => {
    const selector = '#ProcessSelect';
    const testValue = 'preview';
    const select = rootEl.querySelector(selector);
    select.focus();
    await sendKeys({ type: testValue });
    expect(rootEl.querySelector(selector).value).to.equal(testValue);
  });

  it('can validate urls and disable form', async () => {
    const urlTextArea = rootEl.querySelector('#Urls');
    urlTextArea.focus();
    await sendKeys({ type: 'not_a_url' });
    urlTextArea.blur();
    const errors = rootEl.querySelector('.errors');
    expect(errors.querySelector('strong').innerText).to.equal('Invalid Url');
  });

  it('can handle api error response', async () => {
    const urlTextArea = rootEl.querySelector('#Urls');
    urlTextArea.focus();
    await sendKeys({ type: 'https://main--milo--adobecom.hlx.page/not/a/valid/path' });
    urlTextArea.blur();
    await delay(200);
    const errorData = await readFile({ path: './mocks/error-response.json' });
    setFetchResponse(errorData, 'json', 401);
    const submitBtn = rootEl.querySelector('#RunProcess');
    await clickEl(submitBtn);
    const errors = rootEl.querySelector('.errors');
    expect(errors.querySelector('strong').innerText).to.equal('Unauthorized');
  });

  it('can validate milo urls and enable form', async () => {
    const urlTextArea = rootEl.querySelector('#Urls');
    urlTextArea.focus();
    await sendKeys({ type: testPageUrl });
    urlTextArea.blur();
    await delay(200);
    const submitBtn = rootEl.querySelector('#RunProcess');
    expect(submitBtn.getAttribute('disable')).to.equal('false');
  });

  it('can submit valid bulk preview job', async () => {
    const jobData = await readFile({ path: './mocks/preview-response.json' });
    setFetchResponse(jobData);
    const submitBtn = rootEl.querySelector('#RunProcess');
    await clickEl(submitBtn);
    const statusData = await readFile({ path: './mocks/preview-status-response.json' });
    setFetchResponse(statusData);
    expect(rootEl.querySelector('job-process')).to.exist;
  });

  it('can open result page url', async () => {
    await delay(1500);
    const jobProcess = rootEl.querySelector('job-process');
    const jobItem = jobProcess.shadowRoot.querySelector('.result');
    await clickEl(jobItem);
    expect(jobItem.classList.contains('opened')).to.be.true;
  });

  it('can submit valid bulk unpublish job', async () => {
    const jobData = await readFile({ path: './mocks/unpub-response.json' });
    setFetchResponse(jobData);
    const submitBtn = rootEl.querySelector('#RunProcess');
    await clickEl(submitBtn);
    const statusData = await readFile({ path: './mocks/unpub-status-response.json' });
    setFetchResponse(statusData);
    expect(rootEl.querySelector('job-process')).to.exist;
  });
});
