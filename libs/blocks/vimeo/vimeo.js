import { createIntersectionObserver, createTag, isInTextNode } from '../../utils/utils.js';

export default function init(a) {
  if (isInTextNode(a)) return;
  const embedVimeo = () => {
    const url = new URL(a.href);
    let src = url.href;
    if (url.hostname !== 'player.vimeo.com') {
      const video = url.pathname.split('/')[1];
      src = `https://player.vimeo.com/video/${video}?app_id=122963`;
    }
    const iframe = createTag('iframe', {
      src,
      style: 'border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;',
      frameborder: '0',
      allow: 'autoplay; fullscreen; picture-in-picture',
      allowfullscreen: 'true',
      title: 'Content from Vimeo',
      loading: 'lazy',
    });
    const wrapper = createTag('div', { class: 'embed-vimeo' }, iframe);

    a.parentElement.replaceChild(wrapper, a);
  };

  createIntersectionObserver({ el: a, callback: embedVimeo });
}
