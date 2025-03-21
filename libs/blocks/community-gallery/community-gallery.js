import { loadStyle, loadScript } from '../../utils/utils.js';


async function loadComponent() {
    await Promise.all([
        loadScript(`${window.location.origin}/libs/blocks/community-gallery/gallery.bundle.js`),
        loadStyle(`${window.location.origin}/libs/blocks/community-gallery/gallery.css`)
    ]);
}

export default async function init(el) {
  await loadComponent();
}
