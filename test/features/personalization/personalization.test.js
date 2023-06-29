import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createTag, setConfig, getConfig, updateConfig } from '../../../libs/utils/utils.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { stubFetch } from '../../helpers/mockFetch.js';
import { applyPersonalization } from '../../../libs/features/personalization/personalization.js';

// document.body.innerHTML = await readFile({ path: './mocks/head.html' });

describe('Functional Test', () => {
  it('replaceContent should replace an element with a fragment', async () => {
    const manifestData = { test: true };
    stubFetch(manifestData);

    const loadedlinkParams = {};
    const loadLink = (url, options) => {
      loadedlinkParams.url = url;
      loadedlinkParams.options = options;
    };

    await applyPersonalization(
      // Path doesn't matter as we stub fetch above
      { persManifests: ['/path/to/manifest.json'] },
      { createTag, getConfig, updateConfig, loadLink, loadScript: () => {} },
    );

    expect(loadedlinkParams).to.deep({
      url: '/path/to/manifest.json',
      options: { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
    });
  });
});

