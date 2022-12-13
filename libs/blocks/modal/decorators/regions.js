import { getConfig } from '../../../utils/utils.js';

function handleEvent(prefix, link, config) {
  document.cookie = `international=${prefix};path=/`;
  sessionStorage.setItem('international', prefix);
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    if (resp.ok) {
      window.location = link.href;
    } else {
      const prefixUrl = prefix ? `/${prefix}` : '';
      window.location = `${prefixUrl}${config.contentRoot || ''}/`;
    }
  });
}

function decorateLink(link, config, path) {
  const linkParts = link.getAttribute('href').split('/');
  const prefix = linkParts[1] || 'us';
  let { href } = link;
  if (href.endsWith('/')) href = href.slice(0, -1);
  link.href = `${href}${config.contentRoot || ''}${path}`;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    handleEvent(prefix, link, config);
  });
}

export default function decorate(block) {
  const config = getConfig();
  const regionSelectorBlock = block.querySelector('.region-selector');
  const links = regionSelectorBlock?.querySelectorAll('a');
  if (!links || !links.length) return;
  const { contentRoot } = config.locale;
  const path = window.location.href.replace(`${contentRoot}`, '').replace('#langnav', '');

  links.forEach((l) => decorateLink(l, config, path));
}
