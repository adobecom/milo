import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: init } = await import('../../../libs/blocks/video-rich-results/video-rich-results.js');

// npm run test:file test/blocks/video-rich-results/video-rich-results.test.js
describe('video-rich-results', () => {
  const blockQuery = '.video-rich-results';
  const jsonLdQuery = 'script[type="application/ld+json"]';

  it('adds VideoObject with all required and some recommended fields', async () => {
    const mockPath = './mocks/body.html';
    const expectedJSON = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      // required
      description: 'Revisit Summit all year long!',
      name: 'Summit 2023 Highlights',
      thumbnailUrl: 'https://ec-prod.scene7.com/is/image/ECPROD/summithighlights_500x281_desktop_tablet?$pjpeg$&jpegSize=100&wid=500',
      uploadDate: '2023-03-22',
      // recommended
      embedUrl: 'https://video.tv.adobe.com/v/3416126',
      // expires should not be defined
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
