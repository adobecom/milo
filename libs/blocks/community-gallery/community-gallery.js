import { loadStyle, loadScript, createTag } from '../../utils/utils.js';


async function loadComponent() {
    await Promise.all([
        loadScript(`${window.location.origin}/libs/blocks/community-gallery/gallery.bundle.js`),
        loadStyle(`${window.location.origin}/libs/blocks/community-gallery/main.css`)
    ]);
}

export default async function init(el) {
  await Promise.all([
      loadScript('https://unpkg.com/react@18/umd/react.development.js'),
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js'),
      loadScript(`${window.location.origin}/libs/features/spectrum-web-components/dist/theme.js`, 'module'),
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-base.js`, 'module'),
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-lit-all.min.js`, 'module'),
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-theme.js`, 'module')
  ]);
  await loadComponent();
  const c = createTag('sp-theme', { dir: 'ltr', scale: 'medium', color: 'light'});
  el.insertAdjacentElement("afterend", c);
  c.append(el)
}
