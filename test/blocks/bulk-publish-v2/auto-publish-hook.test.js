import { expect } from '@esm-bundle/chai';
import {
  collectSuccessfulPaths,
  runAutoPublishForJob,
} from '../../../libs/blocks/bulk-publish-v2/auto-publish-hook.js';

describe('bulk-publish-v2 auto-publish-hook: collectSuccessfulPaths', () => {
  it('returns [] when jobStatus is missing or malformed', () => {
    expect(collectSuccessfulPaths(null)).to.deep.equal([]);
    expect(collectSuccessfulPaths({})).to.deep.equal([]);
    expect(collectSuccessfulPaths({ data: {} })).to.deep.equal([]);
    expect(collectSuccessfulPaths({ data: { resources: 'nope' } })).to.deep.equal([]);
  });

  it('returns webPath of resources with 2xx status', () => {
    const jobStatus = {
      data: {
        resources: [
          { status: 200, webPath: '/a' },
          { status: 204, webPath: '/b' },
          { status: 404, webPath: '/c' },
          { status: 503, webPath: '/d' },
        ],
      },
    };
    expect(collectSuccessfulPaths(jobStatus)).to.deep.equal(['/a', '/b']);
  });

  it('falls back to .path when .webPath is missing', () => {
    const jobStatus = {
      data: {
        resources: [
          { status: 200, path: '/x' },
          { status: 200, webPath: '/y', path: '/ignored' },
        ],
      },
    };
    expect(collectSuccessfulPaths(jobStatus)).to.deep.equal(['/x', '/y']);
  });

  it('drops resources with neither path nor webPath', () => {
    const jobStatus = { data: { resources: [{ status: 200 }, { status: 200, path: '/ok' }] } };
    expect(collectSuccessfulPaths(jobStatus)).to.deep.equal(['/ok']);
  });
});

describe('bulk-publish-v2 auto-publish-hook: runAutoPublishForJob', () => {
  const job = { origin: 'https://main--bacom--adobecom.aem.live' };
  const jobStatus = (topic, resources) => ({
    state: 'stopped',
    topic,
    data: { resources },
  });

  it('returns [] when job has no origin', async () => {
    const result = await runAutoPublishForJob({
      job: {},
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/x' }]),
    });
    expect(result).to.deep.equal([]);
  });

  it('returns [] when topic is unsupported (unpublish/delete/index)', async () => {
    for (const topic of ['unpublish', 'delete', 'index']) {
      // eslint-disable-next-line no-await-in-loop
      const result = await runAutoPublishForJob({
        job,
        jobStatus: jobStatus(topic, [{ status: 200, webPath: '/x' }]),
      });
      expect(result, `topic=${topic}`).to.deep.equal([]);
    }
  });

  it('returns [] when no resources succeeded', async () => {
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [{ status: 503, webPath: '/x' }]),
      optedIn: async () => true,
      getToken: async () => 'never-asked',
    });
    expect(result).to.deep.equal([]);
  });

  it('returns [] when site is not opted in (no config or empty rules)', async () => {
    const publish = () => { throw new Error('should not be called'); };
    const getToken = async () => { throw new Error('should not load IMS'); };
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/x' }]),
      optedIn: async () => false,
      getToken,
      publish,
    });
    expect(result).to.deep.equal([]);
  });

  it('returns [] when token cannot be obtained', async () => {
    const publish = () => { throw new Error('should not be called'); };
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/x' }]),
      optedIn: async () => true,
      getToken: async () => null,
      publish,
    });
    expect(result).to.deep.equal([]);
  });

  it('survives a thrown getToken — does not propagate', async () => {
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/x' }]),
      optedIn: async () => true,
      getToken: async () => { throw new Error('ims down'); },
    });
    expect(result).to.deep.equal([]);
  });

  it('invokes publish for each successful resource and forwards correct args', async () => {
    const calls = [];
    const publish = async (args) => {
      calls.push(args);
      return { skipped: false, results: [{ ok: true }] };
    };
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [
        { status: 200, webPath: '/a' },
        { status: 200, webPath: '/b' },
        { status: 404, webPath: '/skip' },
      ]),
      optedIn: async () => true,
      getToken: async () => 'tok-abc',
      publish,
    });

    expect(calls).to.have.lengthOf(2);
    expect(result).to.have.lengthOf(2);

    expect(calls[0].action).to.equal('publish');
    expect(calls[0].path).to.equal('/a');
    expect(calls[0].url).to.equal('https://main--bacom--adobecom.aem.live/a');
    expect(calls[0].origin).to.equal('https://main--bacom--adobecom.aem.live');
    expect(calls[0].repo).to.equal('bacom');
    expect(await calls[0].getAuthToken()).to.equal('tok-abc');
  });

  it('passes preview action through unchanged', async () => {
    const calls = [];
    const publish = async (args) => { calls.push(args); return { skipped: true }; };
    await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('preview', [{ status: 200, webPath: '/a' }]),
      optedIn: async () => true,
      getToken: async () => 'tok',
      publish,
    });
    expect(calls[0].action).to.equal('preview');
  });

  it('isolates a thrown publish — surfaces error in that entry, others still run', async () => {
    const publish = async ({ path }) => {
      if (path === '/boom') throw new Error('explode');
      return { skipped: false, results: [{ ok: true }] };
    };
    const result = await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [
        { status: 200, webPath: '/ok' },
        { status: 200, webPath: '/boom' },
      ]),
      optedIn: async () => true,
      getToken: async () => 'tok',
      publish,
    });
    expect(result).to.have.lengthOf(2);
    const errored = result.find((r) => r.error);
    expect(errored).to.exist;
    expect(errored.error).to.match(/explode/);
    expect(errored.path).to.equal('/boom');
  });

  it('parses repo/owner from a malformed origin defensively', async () => {
    const calls = [];
    const publish = async (args) => { calls.push(args); return {}; };
    await runAutoPublishForJob({
      job: { origin: 'not-a-url' },
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/a' }]),
      optedIn: async () => true,
      getToken: async () => 'tok',
      publish,
    });
    // Malformed origin → no repo derived; call still made with empty strings.
    expect(calls[0].repo).to.equal('');
  });

  it('does not invoke getToken when site is not opted in (avoids IMS load)', async () => {
    let tokenCalled = false;
    const publish = () => { throw new Error('should not be called'); };
    await runAutoPublishForJob({
      job,
      jobStatus: jobStatus('publish', [{ status: 200, webPath: '/a' }]),
      optedIn: async () => false,
      getToken: async () => { tokenCalled = true; return 'tok'; },
      publish,
    });
    expect(tokenCalled).to.be.false;
  });
});
