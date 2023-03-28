import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/video-rich-results/video-rich-results.js');

// npm run test:file test/blocks/video-rich-results/video-rich-results.test.js
describe('video-rich-results', () => {
  const blockQuery = '.video-rich-results';
  const jsonLdQuery = 'script[type="application/ld+json"]';

  it('adds VideoObject as ld+json', async () => {
    const mockPath = './mocks/body.html';
    const expectedJSON = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      // TODO: Should I make my own examples or just use Google's?
    };
    document.head.innerHTML = '';
    document.body.innerHTML = await readFile({ path: mockPath });
    const blockEl = document.querySelector(blockQuery);
    init(blockEl);
    const scriptEl = document.querySelector(jsonLdQuery);
    const actualJSON = JSON.parse(scriptEl.innerHTML);
    expect(actualJSON).to.deep.equal(expectedJSON);
  });
});
