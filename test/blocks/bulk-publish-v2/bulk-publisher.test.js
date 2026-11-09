import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { mockFetch, mockShare, unmockFetch, unmockShare } from './mocks/fetch.js';
import { setConfig } from '../../../libs/utils/utils.js';
import './mocks/authentication.js';

setConfig({ miloLibs: 'http://localhost:2000/libs' });

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
await import('../../../libs/blocks/bulk-publish-v2/bulk-publish-v2.js');

const payload = '<img src=x onerror="window.bulkPublisherXss = true">';
const jobName = 'xss-job';
const makeJobs = () => [{ result: { job: { name: jobName, data: { paths: [] } } } }];

describe('Bulk Publisher', () => {
  let publisher;

  before(async () => {
    await mockFetch();
    await mockShare();
    publisher = document.createElement('bulk-publish');
    document.body.append(publisher);
    await publisher.updateComplete;
    publisher.jobs = makeJobs();
  });

  after(() => {
    unmockFetch();
    unmockShare();
    publisher.remove();
    delete window.bulkPublisherXss;
  });

  const progressOf = () => publisher.renderRoot.querySelector('#progress');

  it('renders URL-derived HTML as inert text', async () => {
    publisher.setJobProgress({ detail: { name: jobName, progress: { processed: payload } } });
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    const progress = progressOf();
    expect(progress.querySelector('img')).to.be.null;
    expect(progress.children.length).to.equal(0);
    expect(progress.textContent).to.contain(payload);
    expect(window.bulkPublisherXss).to.be.undefined;
  });

  it('renders the processed count as plain text for normal input', () => {
    publisher.setJobProgress({ detail: { name: jobName, progress: { processed: 7 } } });
    expect(progressOf().textContent).to.equal('7');
  });

  it('resets the progress count to 0 when all jobs stop', () => {
    publisher.jobs = makeJobs();
    publisher.setJobStopped({ detail: { name: jobName } });
    expect(progressOf().textContent).to.equal('0');
  });
});
