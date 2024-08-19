import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export const getMLResults = async (endpoint, apiKey, input) => {
  const { env } = getConfig();
  const subdomain = env === 'prod' ? 'cchome' : 'cchome-dev';
  const apiUrl = `https://${subdomain}.adobe.io/int/v1/models`;
  const params = {
    endpoint,
    contentType: 'application/json',
    streaming: true,
    payload: {
      inputs: input,
      parameters: {
        max_new_tokens: 300,
        do_sample: false,
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
    .then((response) => response.text())
    .catch((error) => window.lana.log(`ERROR: Fetching chat ${error}`, { tags: 'errorType=info,module=quiz-chat' }));

  let value;
  if (result) {
    value = result;
  } else {
    value = { errors: [{ title: 'Unable to fetch fi codes' }] };
  }
  return value;
};

export const mlField = ({ cardsUsed, onMLInput, onMLEnter, placeholderText }) => html`<input id="quiz-input" class="quiz-input" type="textarea" placeholder="${placeholderText}" oninput="${onMLInput}" onkeypress="${onMLEnter}" disabled="${cardsUsed}" autocomplete="off"/>`;
