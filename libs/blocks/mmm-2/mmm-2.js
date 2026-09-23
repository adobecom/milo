import { html, render } from '../../deps/htm-preact.js';
import { loadStyle } from '../../utils/utils.js';
import MmmApp from './components/MmmApp.js';
import { parseData } from './utils.js';

export default async function init(el) {
  // Capture the authored "pages"/"geos" dropdown config from this block's own content
  // before wiping it out below - see the SearchView data-flow note in MmmApp.js.
  const searchConfig = parseData(el);

  // Preact's render() reconciles into the container but does not clear pre-existing,
  // non-Preact-managed children - without this the raw authored table markup would
  // stay visible alongside the rendered app.
  el.innerHTML = '';

  render(html`<${MmmApp} searchConfig=${searchConfig} />`, el);

  loadStyle('/libs/features/mep/mep-next/mep-next.css');
}
