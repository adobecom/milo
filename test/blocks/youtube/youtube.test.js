/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { default: youtubeFunc } = await import('../../../libs/blocks/youtube/youtube.js');

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
describe('youtube', () => {
  it('Renders an iframe for both types of youtube links', async () => {
    document.head.innerHTML = await readFile({ path: './mocks/body.html' });
    const youtube = document.querySelectorAll('a');
    youtube.forEach(async (link) => {
      await youtubeFunc(link);
      expect(document.querySelector('iframe')).to.exist;
    });
  });
});
