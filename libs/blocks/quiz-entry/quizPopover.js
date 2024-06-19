import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export const getSuggestions = async (endpoint, clientId, input, scope) => {
  const { locale } = getConfig();
  const localeCode = locale?.ietf ? `${locale.ietf}`.replace('-', '_') : 'en_us';
  const apiUrl = `https://adobesearch.adobe.io/${endpoint}/completions?q[text]=${input}&q[locale]=${localeCode}&scope=${scope}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'x-api-key': clientId },
  });

  if (!response.ok) {
    window.lana.log('Failed to fetch suggestions', { tags: 'errorType=info,module=quiz-entry' });
    return '';
  }

  const data = await response.json();
  return data;
};

export const quizPopover = ({ suggestions, position = 'bottom', onSuggestionClick }) => html`<div class="popover-container popover-${position}">
    <div class="popover-content">
      ${suggestions.map((suggestion, index) => html`
        <div key=${index} class="popover-item" onClick=${onSuggestionClick(suggestion)}>
          ${suggestion.name}
        </div>
      `)}
    </div>
</div>`;
