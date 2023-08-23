const conversationOptions = {
  method: 'POST',
  headers: {},
  body: '{\n    "messages": [{\n        "role": "system",\n        "content": "You are an AI assistant that helps people find information."\n    }],\n    "llm_metadata": {\n        "model_name": "gpt-35-turbo",\n        "llm_type": "azure_chat_openai",\n        "temperature": 0.7,\n        "max_tokens": 800,\n        "top_p": 0.95,\n        "frequency_penalty": 0,\n        "presence_penalty": 0\n    },\n    "number_of_past_messages_to_include": 5,\n    "data_retention_days": 7\n}',
};

// const headersFunction = async ({ accessToken, x-api-key, ims-org-id }) => {
//   const options = {
//     method: 'POST',
//     headers: {
//     },
//   };

const conversationsApi = async () =>
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  await fetch('https://firefall-stage.adobe.io/v1/chat/completions/conversations?=', conversationOptions)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

function queryConversationsOptions(article) {
  const options = {
    method: 'POST',
    headers: {},
    body: `{"conversation_identifier": 825926,"messages":[{"role": "user","content": "${article}"}]}`,
  };
  return options;
}

export async function queryConversations(article) {
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  await fetch('https://firefall-stage.adobe.io/v1/chat/completions', queryConversationsOptions(article))
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

async function init() {
  try {
    console.log('test!!!');
    // conversationsApi(); //testing with just query APIs
    queryConversations("List Keywords from Take the hassle out of collecting customer data with web forms they can fill out fast. Quickly edit PDF agreements and proposals and send them for e-signature to close the deal. With Acrobat, it's a walk in the park.");
  } catch {
    // leave it blank for now
  }
}

export default init;
