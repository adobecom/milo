import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init } = await import('../../../libs/blocks/youtube/youtube.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('youtube', () => {
  it('Renders an iframe for both types of youtube links', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const youtube = document.querySelectorAll('a');
    youtube.forEach(async (link) => {
      init(link);
      const iframe = await waitForElement('iframe');
      expect(iframe).to.exist;
    });
  });
});
