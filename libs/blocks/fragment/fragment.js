import { decorateArea, loadLazy } from '../../utils/utils.js';

export default async function init(a, parent) {
  const resp = await fetch(`${a.href}.plain.html`);
  if (resp.ok) {
    try {
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const fragment = doc.querySelector('div');
      fragment.className = 'fragment';

      const blocks = decorateArea(fragment);
      await loadLazy(blocks, fragment);

      if (parent) {
        a.remove();
        parent.append(fragment);
      } else if (a.parentElement) {
        a.parentElement.replaceChild(fragment, a);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Could not make fragment');
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Could not get fragment');
  }
}
