import secrets from './secrets.js';

const regex = /^\d+\./gm;
const conversationOptions = {
  method: 'POST',
  headers: { ...secrets },
  body: '{\n    "messages": [{\n        "role": "system",\n        "content": "You are an AI assistant that helps people find information."\n    }],\n    "llm_metadata": {\n        "model_name": "gpt-35-turbo",\n        "llm_type": "azure_chat_openai",\n        "temperature": 0.7,\n        "max_tokens": 800,\n        "top_p": 0.95,\n        "frequency_penalty": 0,\n        "presence_penalty": 0\n    },\n    "number_of_past_messages_to_include": 5,\n    "data_retention_days": 7\n}',
};

const conversationsApi = async () =>
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  await fetch('https://firefall-stage.adobe.io/v1/chat/completions/conversations?=', conversationOptions)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

function queryConversationsOptions(article, qty) {
  const options = {
    method: 'POST',
    headers: { ...secrets },
    body: JSON.stringify({
      llm_metadata: { model_name: 'gpt-4', llm_type: 'azure_chat_openai' },
      messages: [
        {
          role: 'system',
          content: `Prompt for Image Ideas based on Article Content. Based on the essence, themes, and tone of the article, provide distinct and vivid image ideas that can enhance the reader's understanding and engagement with the article. The image descriptions should be creative, evocative, and resonate with the core message of the article. Example image descriptions to emulate:
          - Sleeping bear in nightgown and nightcap.
          - A human hat made of green, yellow, blue, green, purple orchids, set against a jungle background.
          - Ultra HD, Cat wearing a yellow beanie, wearing sunglasses, eating a hamburger, modelling in a studio.
          - Close-up of a mystic cat, akin to a phoenix, with red and black colors.
          - Futuristic, inspired border town with neon lights on the edge of a calm reflecting lake on Mars, illuminated by bioluminescent plants and rocks at night.
          - An old cottage overgrown with ancient trees.`,
        },
        {
          role: 'system',
          content: `Your output will be a JS array of ${qty} images ['...', '...', ...] make sure to only pass the array and no additional text`,
        },
        {
          role: 'user',
          content: article,
        },
      ],
    }),
  };
  return options;
}

function toArray(input) {
  // First, try to parse it as JSON, this will handle the majority of correctly formatted cases.
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    // If it fails, proceed to regex extraction.
  }

  // Match anything between double or single quotes.
  // This assumes no double or single quotes within the strings themselves.
  const regex = /["']([^"']+)["']/g;
  let match;
  const result = [];

  while ((match = regex.exec(input)) !== null) {
    result.push(match[1]);
  }

  return result;
}

export async function queryConversations(article, qty) {
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  return await fetch('https://firefall-stage.adobe.io/v1/chat/completions', queryConversationsOptions(article, qty))
    .then((response) => response.json())
    .then((data) => toArray(data.generations[0][0].message.content))
    .catch((err) => console.error(err));
}

async function init() {
  try {
    console.log('test!!!');
    // conversationsApi(); //testing with just query APIs
    const keywords = await queryConversations('Enterprises are adopting Express to enhance the productivity of creative teams and empower marketing organizations to quickly and easily create on-brand content that stands out', 3);
    console.log(keywords);
  } catch {
    // leave it blank for now
  }
}

export default init;
