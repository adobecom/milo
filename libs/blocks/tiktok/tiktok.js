import { createIntersectionObserver, createTag, loadScript } from '../../utils/utils.js';

export default function init(a) {
  if (a.parentElement.firstChild.nodeType === Node.TEXT_NODE) return;
  const embedTiktok = () => {
    const url = new URL(a.href);

    const videoId = url.pathname.match(/[^/]+(?=\/$|$)/)[0];
    const anchor = createTag('a', { href: url });
    const wrapper = createTag('blockquote', {
      class: 'tiktok-embed',
      'data-video-id': videoId,
      cite: url,
      style: 'max-width: 605px;min-width: 325px;',
    }, anchor);
    a.parentElement.replaceChild(wrapper, a);

    loadScript('https://www.tiktok.com/embed.js');
  };

  createIntersectionObserver({ el: a, callback: embedTiktok });
}
