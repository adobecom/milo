import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/video-rich-results/video-rich-results.js');

// npm run test:file test/blocks/video-rich-results/video-rich-results.test.js
describe('video-rich-results', () => {
  const blockQuery = '.video-rich-results';
  const jsonLdQuery = 'script[type="application/ld+json"]';

  const compareJSON = async (mockPath, expectedJSONPath) => {
    const expectedJSON = JSON.parse(await readFile({ path: expectedJSONPath }));
    document.body.innerHTML = await readFile({ path: mockPath });
    document.head.innerHTML = '';
    const blockEl = document.querySelector(blockQuery);
    init(blockEl);
    const scriptEl = document.querySelector(jsonLdQuery);
    const actualJSON = JSON.parse(scriptEl.innerHTML);
    expect(actualJSON).to.deep.equal(expectedJSON);
  };

  it('adds VideoObject for Adobe TV', async () => {
    await compareJSON('./mocks/body-adobe.html', './expected/video-object-adobe.json');
  });

  it('adds VideoObject', async () => {
    await compareJSON('./mocks/body.html', './expected/video-object.json');
  });

  it('adds VideoObject with BroadcastEvent', async () => {
    await compareJSON('./mocks/body-broadcast-event.html', './expected/video-object-broadcast-event.json');
  });

  it('adds VideoObject with Clip', async () => {
    await compareJSON('./mocks/body-clip.html', './expected/video-object-clip.json');
  });
});
