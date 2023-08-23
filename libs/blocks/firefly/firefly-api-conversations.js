const conversationOptions = {
  method: 'POST',
  headers: {
    'x-api-key': 'ce-firefall',
    'x-gw-ims-org-id': 'dsnp@AdobeOrg',
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEtc3RnMS1rZXktYXQtMS5jZXIiLCJraWQiOiJpbXNfbmExLXN0ZzEta2V5LWF0LTEiLCJpdHQiOiJhdCJ9.eyJpZCI6IjE2OTI3NjQxOTMxODBfNDFlNjM4MTQtMDBjYi00NjU3LWI0YTktMDRiYTNlNTU3MWJhX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjY3AtaGFrdW5hIiwidXNlcl9pZCI6ImNjcC1oYWt1bmFAQWRvYmVJRCIsImFzIjoiaW1zLW5hMS1zdGcxIiwiYWFfaWQiOiJjY3AtaGFrdW5hQEFkb2JlSUQiLCJjdHAiOjAsInBhYyI6ImNjcC1oYWt1bmFfc3RnIiwicnRpZCI6IjE2OTI3NjQxOTMxODBfNGY5NzA5MzAtODBjOC00MmMyLWFhZWYtODM4N2Q3MjZmZDkwX3VlMSIsIm1vaSI6ImY4NDE2YWQ0IiwicnRlYSI6IjE2OTM5NzM3OTMxODEiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTY5Mjc2NDE5MzE4MCIsInNjb3BlIjoic3lzdGVtIn0.aiZWBO3Dkk0dgT3-dsQRRm3oXOUTL627NPdq8v-3omvqosX0xdCvwJU-ZpvNOmj6XFwKV-HYIUbyT5hDXmz3xz7WuTOGdsdb3gehOpfRymT5VEgBTjTKY7Wy1D1hWX5_-jn6ZgtKzpK-n9p7cq7Nem-V0rzYMiOL-CW8wSM7hUCBD4GStITgIYOT5aNA-NlUmPWTw_Ncanrhy70DmWlFXI7wI4bMa17We7hYMv92oLDFitxTLbOzZ_s2jzuHYG1rJ3ywk7ws9Ybj71_phCbEfimFkzvYJGmVgVNRzn1Xivc1GOVqshMt6-k5fCYxCnWwLy607o2otHxCzVgnX8-8gg',
  },
  body: '{\n    "messages": [{\n        "role": "system",\n        "content": "You are an AI assistant that helps people find information."\n    }],\n    "llm_metadata": {\n        "model_name": "gpt-35-turbo",\n        "llm_type": "azure_chat_openai",\n        "temperature": 0.7,\n        "max_tokens": 800,\n        "top_p": 0.95,\n        "frequency_penalty": 0,\n        "presence_penalty": 0\n    },\n    "number_of_past_messages_to_include": 5,\n    "data_retention_days": 7\n}',
};

// const headersFunction = async ({ accessToken, x-api-key, ims-org-id }) => {
//   const options = {
//     method: 'POST',
//     headers: {
//     'x-api-key': 'ce-firefall',
//      'x-gw-ims-org-id': 'dsnp@AdobeOrg',
//       Authorization: `Bearer ${accessToken}`,
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
    headers: {
      'x-api-key': 'ce-firefall',
      'x-gw-ims-org-id': 'dsnp@AdobeOrg',
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEtc3RnMS1rZXktYXQtMS5jZXIiLCJraWQiOiJpbXNfbmExLXN0ZzEta2V5LWF0LTEiLCJpdHQiOiJhdCJ9.eyJpZCI6IjE2OTI3Njg1ODQxMzBfZDEyYTJlMDYtMDcyYy00NjM0LTg1OGEtZWE3YzgxZjA5NmZiX3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJjY3AtaGFrdW5hIiwidXNlcl9pZCI6ImNjcC1oYWt1bmFAQWRvYmVJRCIsImFzIjoiaW1zLW5hMS1zdGcxIiwiYWFfaWQiOiJjY3AtaGFrdW5hQEFkb2JlSUQiLCJjdHAiOjAsInBhYyI6ImNjcC1oYWt1bmFfc3RnIiwicnRpZCI6IjE2OTI3Njg1ODQxMzBfYTc2NDQxMDQtNjNiNC00OTIyLWE3OWYtMmE2NDZlYzk4ZWViX3VlMSIsIm1vaSI6ImMyYzQ5YzIwIiwicnRlYSI6IjE2OTM5NzgxODQxMzAiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJzY29wZSI6InN5c3RlbSIsImNyZWF0ZWRfYXQiOiIxNjkyNzY4NTg0MTMwIn0.Sw-l3Y5dWrF4Z9PcuBloFyvHM_3Wkxe-EqOCgqc1w5Chy3OE40km_zLgr1kWig9tCsqBDcnI1etYgXowIFvDqrmWvw_NVaZ_MYia-0rbZOZBYpujCIyO3KYP5EQ-_ySEfD5rL8GQUE58IFwT8f-eMtWYeZPBtt0pzB2SlGNSiWIth-C1nWHh4nSb6CKMUuz4hGzzjUuiWKBuhK6Log_89nBble4Zr5J83V5F3ph7Ts6eO0U0kFn5VkAgQpw5qMG6j4GavbI53zb1ms7D7XygCbVWP5c8GGwTNpCkt04rpNv-HaBde9nZ1Bkg1ajHwmv2saqRJmE-hXfnuuL_P1rP5w',
    },
    body: `{"conversation_identifier": 825926,"messages":[{"role": "user","content": "${article}"}]}`,
  };
  return options;
}

async function queryConversations(article) {
  // eslint-disable-next-line no-return-await, implicit-arrow-linebreak
  await fetch('https://firefall-stage.adobe.io/v1/chat/completions', queryConversationsOptions(article))
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}

async function init() {
  try {
    console.log('test!!!');
    //conversationsApi(); //testing with just query APIs
    queryConversations("List Keywords from Take the hassle out of collecting customer data with web forms they can fill out fast. Quickly edit PDF agreements and proposals and send them for e-signature to close the deal. With Acrobat, it's a walk in the park.");
  } catch {
    // leave it blank for now
  }
}

export default init;
