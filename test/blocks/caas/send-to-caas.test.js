import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import { checkUrl } from '../../../tools/send-to-caas/send-utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Metadata', () => {
  it('Renders with card-metadata class', async () => {
    const cardMetadata = document.querySelector('.card-metadata');
    expect(cardMetadata).to.exist;
  });

  it('Renders card-metadata elements', async () => {
    const cardMetadataValues = document.querySelectorAll('.card-metadata div');
    expect(cardMetadataValues).to.exist;
  });

  it('Flattens URLs', async () => {
    const expectedResults = [
      'https://milo.adobe.com/index.html',
      'https://www.youtube.com/watch?v=9H5S4Cc5SgM'
    ];
    const cardMetadataValues = document.querySelectorAll('.card-metadata a');

    const miloUrl = await checkUrl(cardMetadataValues[0].toString());
    expect(miloUrl).to.equal(expectedResults[0]);

    const youtubeUrl = await checkUrl(cardMetadataValues[1].toString());
    expect(youtubeUrl).to.equal(expectedResults[1]);
    
  });
});
