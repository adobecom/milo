import { createIntersectionObserver, createTag, isInTextNode } from '../../utils/utils.js';

export default function init(a) {
  if (isInTextNode(a)) return;
  const embedSlideshare = () => {
    const iframe = createTag('iframe', {
      src: a.href,
      style: 'border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%; top: 0; left: 0; width: 100%; height: 100%; position: absolute;',
      frameborder: '0',
      marginwidth: '0',
      marginheight: '0',
      scrolling: 'no',
      allowfullscreen: 'true',
      loading: 'lazy',
    });

    const wrapper = createTag('div', {
      style: 'left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;',
      id: 'slideshare',
    }, iframe);

    a.parentElement.replaceChild(wrapper, a);
  };

  createIntersectionObserver({ el: a, callback: embedSlideshare });
}
