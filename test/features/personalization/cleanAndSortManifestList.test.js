import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { cleanAndSortManifestList } from '../../../libs/features/personalization/personalization.js';

// Note that the manifestPath doesn't matter as we stub the fetch
describe('replace action', () => {
  it('with a CSS Selector, it should replace an element with a fragment', async () => {
    let manifestJson = await readFile({ path: './mocks/actions/manifestReplace.json' });
    manifestJson = JSON.parse(manifestJson);
    const manifestList = cleanAndSortManifestList(manifestJson);
    console.log(manifestList);
  });
});
