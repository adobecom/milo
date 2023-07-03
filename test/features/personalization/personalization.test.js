import { expect } from '@esm-bundle/chai';
import { createTag, getConfig, updateConfig } from '../../../libs/utils/utils.js';
import { stubFetch } from '../../helpers/mockFetch.js';
import { applyPers } from '../../../libs/features/personalization/personalization.js';

// document.body.innerHTML = await readFile({ path: './mocks/head.html' });

describe('Functional Test', () => {
  it.skip('replaceContent should replace an element with a fragment', async () => {
    const manifestData = [{ test: true }];
    stubFetch(manifestData);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    await applyPers(
      // Path doesn't matter as we stub fetch above
      ['/path/to/manifest.json'],
      { createTag, getConfig, updateConfig, loadLink, loadScript: () => {} },
    );

    expect(loadedlinkParams).to.deep.equal({
      url: '/path/to/manifest.json',
      options: { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
    });
  });
});
