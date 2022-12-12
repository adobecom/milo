import { getConfig } from '../../../utils/utils.js';

export default function decorate(block) {
  const config = getConfig();
  const links = block.querySelectorAll('a');
  if (!links || links.length === 0) return;
  const { contentRoot } = config.locale;
  const path = window.location.href.replace(`${contentRoot}/`, '').replace('#langnav', '');

  links.forEach((l) => {
    const linkParts = l.getAttribute('href').split('/');
    const prefix = linkParts[1] || 'us';
    console.log(prefix);
    l.href += `${config.contentRoot || ''}${path}`;
    l.addEventListener('click', (e) => {
      e.preventDefault();
      document.cookie = `international=${prefix};path=/`;
      sessionStorage.setItem('international', prefix);
      fetch(l.href, { method: 'HEAD' }).then((resp) => {
        if (resp.ok) {
          window.location = l.href;
        } else {
          const prefixUrl = prefix ? `/${prefix}` : '';
          window.location = `${prefixUrl}${config.contentRoot || ''}/`;
        }
      });
    });
  });
}
