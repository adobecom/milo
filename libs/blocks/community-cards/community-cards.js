import { loadStyle, loadScript } from '../../utils/utils.js';

async function loadReact() {
    await Promise.all([
        loadScript('https://unpkg.com/react@16.14.0/umd/react.development.js'),
        loadScript('https://unpkg.com/react-dom@16.14.0/umd/react-dom.development.js'),
        loadScript(`${window.location.origin}/libs/blocks/community-cards/featured.bundle.js`),
        loadStyle(`${window.location.origin}/libs/blocks/community-cards/featured.css`)
    ]);
}

export default async function init(el) {
  await loadReact();
  ReactDOM.render(
    React.createElement('FeaturedPostWrapper', {
      'locale': 'en-US',
      'environment': 'stage',
      'categoryId': 'ct-adobe-firefly'
      }), el);
}
