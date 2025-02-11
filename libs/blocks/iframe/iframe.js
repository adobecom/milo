import { createTag } from '../../utils/utils.js';

window.resizeIframe = function resizeIframe(obj) {
  const checkHeight = setInterval(() => {
    const { scrollHeight } = obj.contentWindow.document.body;
    if (scrollHeight !== 0) {
      clearInterval(checkHeight);
      const newHeight = `${scrollHeight}px`;
      obj.style.height = newHeight;
      if (obj.parentElement) obj.parentElement.style.height = newHeight;
    }
  }, 100);
};

export default async function init(el) {
  const url = el.href ?? el.querySelector('a')?.href;
  el.classList.remove('iframe');

  if (!url) return;
  const classes = [...el.classList].join(' ');

  const iframeProperties = {
    src: url,
    allowfullscreen: true,
    ...(el.classList.contains('lazy-load') && { loading: 'lazy' }),
    ...(el.classList.contains('auto-height') && {
      scrolling: 'no',
      style: 'height: 100%',
      onload() { window.resizeIframe(this); },
    }),
  };

  const iframe = createTag('iframe', iframeProperties);
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  if (el.classList.contains('auto-height')) {
    const { debounce } = await import('../../utils/action.js');
    window.addEventListener('resize', debounce(() => window.resizeIframe(iframe), 100));
  }

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
