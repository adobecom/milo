const regex = /^\d+\./gm;
const conversationOptions = {
  method: 'POST',
  headers: {},
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
    headers: {},
    body: `{"conversation_identifier": 825926,"messages":[{"role": "user","content": "List ${qty} keywords from ${article}"}]}`,
  };
  return options;
}

async function queryConversations(article, qty) {
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  return await fetch('https://firefall-stage.adobe.io/v1/chat/completions', queryConversationsOptions(article, qty))
    .then((response) => response.json())
    .then((data) => data?.generations[0]?.[0]?.message?.content.split('\n').map((eachKeyword) => eachKeyword.replace(regex, '')))
    .catch((err) => console.error(err));
}

async function init() {
  try {
    console.log('test!!!');
    //conversationsApi(); //testing with just query APIs
    const keywords = await queryConversations('Enterprises are adopting Express to enhance the productivity of creative teams and empower marketing organizations to quickly and easily create on-brand content that stands out', 3);
    console.log(keywords);
  } catch {
    // leave it blank for now
  }
}

export default init;
