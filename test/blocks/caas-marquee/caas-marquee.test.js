import { expect } from '@esm-bundle/chai';
import {
  getBackgroundContent,
  getResponsiveImageHtml,
} from '../../../libs/blocks/caas-marquee/caas-marquee.js';

describe('CaaS marquee responsive background', () => {
  const sources = {
    mobile: '/media/mobile.jpg',
    tablet: '/media/tablet.jpg',
    desktop: '/media/desktop.png',
  };

  it('uses viewport sources with one prioritized image', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = getResponsiveImageHtml(sources);

    const picture = wrapper.querySelector('picture');
    const img = picture.querySelector('img');
    const pictureSources = picture.querySelectorAll('source');

    expect(pictureSources.length).to.equal(5);
    expect(picture.querySelectorAll('img').length).to.equal(1);
    expect(pictureSources[0].media).to.equal('(min-width: 1200px)');
    expect(pictureSources[0].srcset).to.include('/media/desktop.png');
    expect(pictureSources[2].media).to.equal('(min-width: 600px)');
    expect(pictureSources[2].srcset).to.include('/media/tablet.jpg');
    expect(pictureSources[4].srcset).to.include('/media/mobile.jpg');
    expect(img.loading).to.equal('eager');
    expect(img.getAttribute('fetchpriority')).to.equal('high');
    expect(img.decoding).to.equal('async');
  });

  it('selects the responsive picture path only when every source is an image', () => {
    const imageContent = getBackgroundContent(sources);
    expect(imageContent.match(/<picture/g).length).to.equal(1);
    expect(imageContent.match(/<img/g).length).to.equal(1);

    const videoContent = getBackgroundContent({
      ...sources,
      mobile: '/media/mobile.mp4',
    });
    expect(videoContent).to.include('<video');
    expect(videoContent).to.include('tablet-only');
    expect(videoContent).to.include('desktop-only');
  });
});
