import { html } from '../../../deps/htm-preact.js';

/**
 * Simple native <details>/<summary> accordion used to surface each tab's "How to use
 * this report" instructions. Content is ported from the marquee/text blocks authored
 * on that tab's original (pre-mmm-2) reference page - see REFERENCE_PAGES in utils.js -
 * minus any buttons/links that just redirected to one of the other reports, since those
 * reports are now tabs within this same page.
 */
function HowToAccordion({ title = 'How to use this report', children }) {
  return html`
    <details class="mmm2-howto">
      <summary class="mmm2-howto-summary">${title}</summary>
      <div class="mmm2-howto-body">
        ${children}
      </div>
    </details>
  `;
}

export default HowToAccordion;
