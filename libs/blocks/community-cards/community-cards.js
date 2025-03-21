import { loadStyle, loadScript } from `${window.location.origin}/libs/utils/utils.js`

// function loadScript(src) {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = src;
//         script.onload = resolve;
//         script.onerror = reject;
//         document.head.appendChild(script);
//     });
// }

async function loadReact() {
    await Promise.all([
        loadScript('https://unpkg.com/react@18/umd/react.development.js'),
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js'),
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
