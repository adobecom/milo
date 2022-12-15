import { createIntersectionObserver, createTag, loadScript } from '../../utils/utils.js';

export default function init(a) {
  const embedInstagram = async () => {
    const anchor = createTag('a', { href: a.href });
    const blockquote = createTag('blockquote', { class: 'instagram-media' }, anchor);
    const wrapper = createTag('div', { class: 'embed-instagram' }, blockquote);
    a.parentElement.replaceChild(wrapper, a);

    loadScript('https://www.instagram.com/embed.js');
  };

  createIntersectionObserver({ el: a, callback: embedInstagram });
}
