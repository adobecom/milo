import { html, signal, useEffect } from '../../../deps/htm-preact.js';

async function getResults() {
// do best practices checks
}

export default function Panel() {
  useEffect(() => { getResults(); }, []);
  return html`
    <div></div>`;
}
