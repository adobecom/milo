import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export const getMLResults = async (endpoint, apiKey, threshold, input, count, validFiCodes) => {
  const { env } = getConfig();
  const subdomain = env === 'prod' ? 'cchome-dev' : 'cchome-dev';
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
    .catch((error) => window.lana.log(`ERROR: Fetching fi codes ${error}`));

  let highestProb = null;
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
  return result;
};

export const mlField = ({ cardsUsed, onMLInput, onMLEnter, placeholderText }) => html`<div class="ml-field-container">
    <input id="ml-field-input" class="ml-input" type="textarea" placeholder="${placeholderText}" oninput="${onMLInput}" onkeypress="${onMLEnter}" disabled="${cardsUsed}" />
  </div>`;
