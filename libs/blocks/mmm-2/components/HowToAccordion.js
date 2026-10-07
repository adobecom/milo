import { html } from '../../../deps/htm-preact.js';

/**
 * Native accordion for each tab's locally authored instructions.
 */
function HowToAccordion({ title, content }) {
  return html`
    <details class="mmm2-howto">
      <summary class="mmm2-howto-summary">${title}</summary>
      <div class="mmm2-howto-body" dangerouslySetInnerHTML=${{ __html: content }}></div>
    </details>
  `;
}

export default HowToAccordion;
