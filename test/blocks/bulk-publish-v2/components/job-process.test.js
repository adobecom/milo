import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../../libs/utils/utils.js';

setConfig({ miloLibs: 'http://localhost:2000/libs' });

const { retriesPending, mergeRetriedResources } = await import('../../../../libs/blocks/bulk-publish-v2/components/job-process.js');

describe('job-process: retriesPending', () => {
  it('returns false for an empty queue', () => {
    expect(retriesPending([])).to.be.false;
  });

  it('returns true while a 503 entry still has retries left', () => {
    expect(retriesPending([{ path: '/a', status: 503, count: 1 }])).to.be.true;
    expect(retriesPending([{ path: '/a', status: 503, count: 3 }])).to.be.true;
  });

  it('returns false once retries are exhausted', () => {
    expect(retriesPending([{ path: '/a', status: 503, count: 4 }])).to.be.false;
  });

  it('returns false once the retry succeeded', () => {
    expect(retriesPending([{ path: '/a', status: 200, count: 2 }])).to.be.false;
  });
});

describe('job-process: mergeRetriedResources', () => {
  it('returns resources unchanged when nothing was retried', () => {
    const resources = [{ path: '/a', status: 200 }];
    expect(mergeRetriedResources(resources, [])).to.deep.equal(resources);
  });

  it('folds a successful retry status back into the matching resource by path', () => {
    const resources = [
      { path: '/a', status: 200 },
      { path: '/b', status: 503 },
    ];
    const queue = [{ path: '/b', status: 200, count: 2 }];
    expect(mergeRetriedResources(resources, queue)).to.deep.equal([
      { path: '/a', status: 200 },
      { path: '/b', status: 200 },
    ]);
  });

  it('matches on webPath when path is absent', () => {
    const resources = [{ webPath: '/b', status: 503 }];
    const queue = [{ webPath: '/b', status: 200, count: 2 }];
    expect(mergeRetriedResources(resources, queue)).to.deep.equal([
      { webPath: '/b', status: 200 },
    ]);
  });

  it('leaves a permanently-failed retry as its final (still-failing) status', () => {
    const resources = [{ path: '/b', status: 503 }];
    const queue = [{ path: '/b', status: 503, count: 4 }];
    expect(mergeRetriedResources(resources, queue)).to.deep.equal([
      { path: '/b', status: 503 },
    ]);
  });
});
