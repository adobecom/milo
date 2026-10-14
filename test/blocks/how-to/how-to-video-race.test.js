import { expect } from '@esm-bundle/chai';
import {
  setConfig,
  decorateImageLinks,
  decorateLinksAsync,
} from '../../../libs/utils/utils.js';

setConfig({});
const { default: init } = await import('../../../libs/blocks/how-to/how-to.js');

// Builds a how-to block whose media cell is a video poster image link
// (alt = "url | | :play:"), mirroring how authored frictionless/how-to pages
// deliver the landing video.
function buildHowToWithPoster() {
  const el = document.createElement('div');
  el.className = 'how-to large-image';
  el.innerHTML = `
    <div>
      <div data-valign="middle">
        <h3>How to recreate the video race</h3>
        <p>Follow these steps.</p>
        <p>
          <picture>
            <img loading="lazy" alt="https://www.adobe.com | | :play:" src="./mock.png" class="">
          </picture>
        </p>
      </div>
    </div>
    <div>
      <div data-valign="middle">
        <ul>
          <li>Step one.</li>
          <li>Step two.</li>
        </ul>
      </div>
    </div>`;
  document.body.append(el);
  return el;
}

describe('How To video poster race', () => {
  it('drops the video when the how-to block runs before image-video-link decoration resolves', async () => {
    const block = buildHowToWithPoster();

    // Synchronous phase of link decoration only: the empty `.image-link`
    // anchor is inserted, but the async image-video-link import that builds
    // `.modal-img-link` (picture + play button) has NOT resolved yet.
    const imageVideoLinkPromises = decorateImageLinks(block);
    expect(imageVideoLinkPromises.length).to.equal(1);
    expect(block.querySelector('.modal-img-link')).to.not.exist;

    // The how-to block decorates in the same tick, grabbing the empty
    // `.image-link` and removing the cell that still holds the <picture>.
    init(block);

    const media = block.querySelector('.how-to-media');
    expect(media).to.exist;
    // Symptom: the poster/video is gone from the landing media slot.
    expect(media.querySelector('picture')).to.not.exist;

    // Flush the pending import so it cannot leak into other tests.
    await Promise.all(imageVideoLinkPromises);
  });

  it('keeps the video when link decoration is awaited before the how-to block runs', async () => {
    const block = buildHowToWithPoster();

    // decorateLinksAsync awaits the image-video-link promises, so
    // `.modal-img-link` (picture + play button) exists before the block runs.
    await decorateLinksAsync(block);
    expect(block.querySelector('.modal-img-link')).to.exist;

    init(block);

    const media = block.querySelector('.how-to-media');
    expect(media).to.exist;
    // Fixed: the poster/video survives into the landing media slot.
    expect(media.querySelector('.modal-img-link')).to.exist;
    expect(media.querySelector('picture')).to.exist;
  });
});
