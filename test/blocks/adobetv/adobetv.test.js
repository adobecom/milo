import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';
import { updateCaptionsLang } from '../../../libs/blocks/adobetv/adobetv.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
setConfig({});
const { default: init } = await import('../../../libs/blocks/adobetv/adobetv.js');

describe('adobetv autoblock', () => {
  it('creates video block', async () => {
    const wrapper = document.body.querySelector('.adobe-tv');
    const a = wrapper.querySelector(':scope > a');

    await init(a);
    const iframe = await waitForElement('.adobe-tv iframe');
    expect(wrapper.querySelector(':scope > a')).to.be.null;
    expect(iframe).to.be.exist;
  });

  it('adobetv as bg', async () => {
    const wrapper = document.body.querySelector('#adobetvAsBg');
    const a = wrapper.querySelector(':scope a[href*=".mp4"]');

    await init(a);
    const video = await waitForElement('#adobetvAsBg video');
    expect(wrapper.querySelector(':scope a[href*=".mp4"]')).to.be.null;
    expect(video).to.be.exist;
  });
});

describe('updateCaptionsParam', () => {
  it('should update captions parameter for known geo', () => {
    const url = 'https://video.tv.adobe.com/v/123456?captions=eng';
    const result = updateCaptionsLang(url, 'fr');
    expect(result).to.equal('https://video.tv.adobe.com/v/123456?captions=fre_fr%2Ceng');
  });

  it('should not modify captions for unknown geo', () => {
    const url = 'https://video.tv.adobe.com/v/123456?captions=eng';
    const result = updateCaptionsLang(url, 'unknown_geo');
    expect(result).to.equal(url);
  });

  it('should not add captions parameter if not present', () => {
    const url = 'https://video.tv.adobe.com/v/123456';
    const result = updateCaptionsLang(url, 'fr');
    expect(result).to.equal(url);
  });

  it('should handle multiple query parameters', () => {
    const url = 'https://video.tv.adobe.com/v/123456?autoplay=true&captions=eng';
    const result = updateCaptionsLang(url, 'jp');
    expect(result).to.equal('https://video.tv.adobe.com/v/123456?autoplay=true&captions=jpn%2Ceng');
  });

  it('should handle caption parameters for Brazil', () => {
    const url = 'https://video.tv.adobe.com/v/123456?autoplay=true&captions=eng';
    const result = updateCaptionsLang(url, 'br');
    expect(result).to.equal('https://video.tv.adobe.com/v/123456?autoplay=true&captions=por_br%2Cpor_pt%2Ceng');
  });

  it('should handle caption parameters for Portugal', () => {
    const url = 'https://video.tv.adobe.com/v/123456?autoplay=true&captions=eng';
    const result = updateCaptionsLang(url, 'pt');
    expect(result).to.equal('https://video.tv.adobe.com/v/123456?autoplay=true&captions=por_br%2Cpor_pt%2Ceng');
  });

  it('should preserve other query parameters when updating captions', () => {
    const url = 'https://video.tv.adobe.com/v/123456?captions=eng&quality=hd&autoplay=true';
    const result = updateCaptionsLang(url, 'de');
    expect(result).to.equal('https://video.tv.adobe.com/v/123456?captions=ger%2Ceng&quality=hd&autoplay=true');
  });
});
