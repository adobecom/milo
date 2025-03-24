import { decorateAnchorVideo } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';

export default function init(a) {
  a.classList.add('hide-video');
  const bgBlocks = ['aside', 'marquee', 'hero-marquee', 'long-form'];
  if (a.href.includes('.mp4') && bgBlocks.some((b) => a.closest(`.${b}`))) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    decorateAnchorVideo({
      src: a.href,
      anchorTag: a,
    });
  } else {
    const sectionMetadata = a.parentElement.parentElement.parentElement?.querySelector('.section-metadata');
    const title = sectionMetadata ? getMetadata(sectionMetadata)?.title.text : 'Adobe TV Video';

    const iframe = createTag('iframe', {
      src: a.href,
      class: 'adobetv',
      scrolling: 'no',
      allow: 'encrypted-media; fullscreen',
      title,
      loading: 'lazy',
    });
    const embed = createTag('div', { class: 'milo-video' }, iframe);
    a.insertAdjacentElement('afterend', embed);

    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://video.tv.adobe.com' || !event.data) return;
      const { state, id } = event.data;
      if (!['play', 'pause'].includes(state)
        || !Number.isInteger(id)
        || !iframe.src.startsWith(`${event.origin}/v/${id}`)) return;

      iframe.setAttribute('data-playing', state === 'play');
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting && target.getAttribute('data-playing') === 'true') {
          target.contentWindow?.postMessage({ type: 'mpcAction', action: 'pause' }, target.src);
        }
      });
    }, { rootMargin: '0px' });
    io.observe(iframe);

    a.remove();
  }
}
