import { html, render } from '../../deps/htm-preact.js';
import { loadStyle } from '../../utils/utils.js';
import MmmApp from './components/MmmApp.js';

export default async function init(el) {
  // Preact's render() reconciles into the container but does not clear pre-existing,
  // non-Preact-managed children - without this the raw authored table markup would
  // stay visible alongside the rendered app.
  el.innerHTML = '';

  render(html`<${MmmApp} />`, el);

  loadStyle('/libs/features/mep/mep-next/mep-next.css');
}
