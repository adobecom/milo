import { createTag } from '../../utils/utils.js';

// eslint-disable-next-line func-names
window.resizeIframe = function (obj) {
  const checkHeight = setInterval(() => {
    if (obj.contentWindow.document.body.scrollHeight !== 0) {
      clearInterval(checkHeight);
      obj.style.height = `${obj.contentWindow.document.body.scrollHeight}px`;
    }
  }, 100);
};

export default function init(el) {
  const url = el.href ?? el.querySelector('a')?.href;
  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  if (!url) return;

  const iframeProperties = { src: url, allowfullscreen: true };
  if (el.classList.contains('lazy-load')) {
    iframeProperties.loading = 'lazy';
    // iframeProperties.style = 'height: 100vh';
    // iframeProperties.onload = 'resizeIframe(this)';
  }
  if (el.classList.contains('auto-height')) {
    iframeProperties.scrolling = 'no';
    iframeProperties.style = 'height: 100%';
    iframeProperties.onload = 'resizeIframe(this)';
  }
  const iframe = createTag('iframe', iframeProperties);
  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  if (el.classList.contains('auto-height')) {
    window.addEventListener('scroll', () => {
      window.resizeIframe(iframe);
    });
  }

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
