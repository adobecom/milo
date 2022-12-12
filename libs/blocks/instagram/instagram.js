import { createIntersectionObserver, createTag } from '../../utils/utils.js';

export default function init(a) {
  const embedInstagram = () => {
    if (!a.origin?.includes('instagram')) return;

    const anchor = createTag('a', { href: a.href });
    const blockquote = createTag('blockquote', { class: 'instagram-media' }, anchor);
    const wrapper = createTag('div', { class: 'embed-instagram' }, blockquote);
    const head = document.querySelector('head');
    const script = createTag('script', { src: 'https://www.instagram.com/embed.js' });
    head.append(script);

    a.insertAdjacentElement('afterend', wrapper);
    a.remove();
  };

  createIntersectionObserver({ el: a, callback: embedInstagram });
}
