import { html } from '../../deps/htm-preact.js';
import { getConfig } from '../../utils/utils.js';

export async function* getMLResults(endpoint, apiKey, input) {
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
        max_new_tokens: 1024,
        do_sample: false,
      },
    },
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n');
    for (const part of parts.slice(0, -1)) {
      if (part.trim()) {
        yield part;
      }
    }
    buffer = parts[parts.length - 1];
  }

  if (buffer.trim()) {
    yield buffer;
  }
}

export const mlField = ({ cardsUsed, onMLInput, onMLEnter, placeholderText }) => html`
  <textarea 
    id="quiz-input" 
    class="quiz-input" 
    placeholder="${placeholderText}" 
    oninput=${onMLInput} 
    onkeypress=${onMLEnter} 
    disabled=${cardsUsed} 
    autocomplete="off"
  ></textarea>
`;
