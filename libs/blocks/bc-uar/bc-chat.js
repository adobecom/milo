const loadChat = async () => {
  const script = document.createElement('script');
  script.src = 'https://assets.adobedtm.com/1281f6ff0c59/dc38a8a8cf5c/launch-29c7dabd5722-development.min.js';
  script.async = true;
  document.head.appendChild(script);
};

export default loadChat;
