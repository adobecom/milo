import { createIntersectionObserver, createTag } from '../../utils/utils.js';

export default function init(a) {
  const embedTiktok = () => {
    if (!a.origin?.includes('tiktok')) return;

    const url = new URL(a.href);

    const videoId = url.pathname.match(/[^/]+(?=\/$|$)/)[0];
    const anchor = createTag('a', { href: url });
    const wrapper = createTag('blockquote', {
      class: 'tiktok-embed',
      'data-video-id': videoId,
      cite: url,
      style: 'max-width: 605px;min-width: 325px;',
    }, anchor);
    const head = document.querySelector('head');
    const script = createTag('script', { src: 'https://www.tiktok.com/embed.js' });
    head.append(script);

    a.insertAdjacentElement('afterend', wrapper);
    a.remove();
  };

  createIntersectionObserver({ el: a, callback: embedTiktok });
}
