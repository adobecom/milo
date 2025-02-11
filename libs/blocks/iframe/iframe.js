import { createTag } from '../../utils/utils.js';

const updateHeight = (obj) => {
  const { scrollHeight } = obj.contentWindow.document.body;
  if (scrollHeight !== 0) {
    const newHeight = `${scrollHeight}px`;
    obj.style.height = newHeight;
    if (obj.parentElement) obj.parentElement.style.height = newHeight;
  }
};
const onloadHandler = function onloadHandler() {
  updateHeight(this);
  const observer = new MutationObserver(() => updateHeight(this));
  observer.observe(this.contentWindow.document.body, { childList: true, subtree: true });
};

export default async function init(el) {
  const url = el.href ?? el.querySelector('a')?.href;
  if (!url) return;

  el.classList.remove('iframe');
  const classes = [...el.classList].join(' ');

  const iframeProperties = {
    src: url,
    allowfullscreen: true,
    ...(el.classList.contains('lazy-load') && { loading: 'lazy' }),
    scrolling: el.classList.contains('auto-height') ? 'no' : 'auto',
  };

  const iframe = createTag('iframe', iframeProperties);

  const embed = createTag('div', { class: `milo-iframe ${classes}` }, iframe);

  if (el.classList.contains('auto-height')) {
    const { debounce } = await import('../../utils/action.js');
    iframe.addEventListener('load', onloadHandler);
    const debouncedResize = debounce(() => updateHeight(iframe), 100);
    window.addEventListener('resize', debouncedResize);
  }

  el.insertAdjacentElement('afterend', embed);
  el.remove();
}
