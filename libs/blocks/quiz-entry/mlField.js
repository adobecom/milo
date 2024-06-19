import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export const getMLResults = async (endpoint, apiKey, threshold, input, count, validFiCodes) => {
  const { env } = getConfig();
  const subdomain = env === 'prod' ? 'cchome' : 'cchome-dev';
  const apiUrl = `https://${subdomain}.adobe.io/int/v1/models`;
  const params = {
    endpoint,
    contentType: 'application/json',
    payload: {
      data: {
        input,
        num_items: count || 10,
        given_prod_list: validFiCodes,
      },
    },
  };

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .catch((error) => window.lana.log(`ERROR: Fetching fi codes ${error}`, { tags: 'errorType=info,module=quiz-entry' }));

  let value;
  let highestProb = null;
  if (result) {
    result.filtered = result?.data?.filter((item) => {
      let isValid = false;
      if (!highestProb) {
        highestProb = item.prob;
        isValid = true;
      } else if (item.prob / highestProb > threshold) {
        isValid = true;
      }
      return isValid;
    });
    value = result;
  } else {
    value = { errors: [{ title: 'Unable to fetch fi codes' }] };
  }
  return value;
};

export const mlField = ({ cardsUsed, onMLInput, onMLEnter, placeholderText, onClearClick }) => html`<input id="quiz-input" class="quiz-input" type="textarea" placeholder="${placeholderText}" oninput="${onMLInput}" onkeypress="${onMLEnter}" disabled="${cardsUsed}" autocomplete="off"/>
    <div id="quiz-input-clear" class="quiz-input-clear hidden" onClick="${onClearClick}"></div>`;
