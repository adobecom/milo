import { loadStyle, loadScript } from '../../utils/utils.js';

async function loadComponent() {
    await Promise.all([
        loadScript(`${window.location.origin}/libs/blocks/community-cards/featured.bundle.js`),
        loadStyle(`${window.location.origin}/libs/blocks/community-cards/featured.css`)
    ]);
}

export default async function init(el) {
  await Promise.all([
      loadScript('https://unpkg.com/react@18/umd/react.development.js'),
      loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js')
  ]);
  await loadComponent();
}
