import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export const getFiResults = async (endpoint, apiKey, input, numberOfItems, validFiCodes) => {
  const { env } = getConfig();
  const subdomain = env === 'prod' ? 'cchome-dev' : 'cchome-dev';
  const apiUrl = `https://${subdomain}.adobe.io/int/v1/models`;
  const params = {
    endpoint,
    contentType: 'application/json',
    payload: {
      data: {
        input,
        num_items: numberOfItems || 10,
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

  return result;
};

const handleInput = () => {
  const mlFieldText = document.querySelector('#ml-field-input').value;
  if (mlFieldText.length > 0) {
    const quizoptions = document.querySelectorAll('.quiz-option');
    quizoptions.forEach((option) => {
      option.classList.add('disabled');
    });
  } else {
    const quizoptions = document.querySelectorAll('.quiz-option');
    quizoptions.forEach((option) => {
      option.classList.remove('disabled');
    });
  }
};

export const mlField = ({ placeholderText }) => html`<div class="ml-field-container">
    <input id="ml-field-input" class="ml-input" type="textarea" placeholder="${placeholderText}" oninput="${handleInput}" />
  </div>`;
