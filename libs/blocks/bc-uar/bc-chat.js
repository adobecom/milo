const loadChat = () => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = '/libs/blocks/bc-uar/launch-29c7dabd5722-development.min.js';
  script.async = true;

  // Add load and error handlers
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Failed to load chat script'));

  document.head.appendChild(script);
});

export default loadChat;
