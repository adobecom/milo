import { loadStyle, loadScript, createTag } from '../../utils/utils.js';


async function loadComponent() {
    await Promise.all([
        loadScript(`${window.location.origin}/libs/blocks/community-gallery/gallery.bundle.js`),
        loadStyle(`${window.location.origin}/libs/blocks/community-gallery/gallery.css`)
    ]);
}

export default async function init(el) {
  await Promise.all([
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-base.js`, 'module'),
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-lit-all.min.js`, 'module'),
      loadScript(`${window.location.origin}/libs/blocks/community-gallery/spectrum-theme.js`, 'module')
  ]);
  setTimeout(()=> {
    await loadComponent();
    const c = createTag('sp-theme', { dir: 'ltr', scale: 'medium', color: 'light'});
    el.insertAdjacentElement("afterend", c);
    c.append(el)
  }, 10000)
}
