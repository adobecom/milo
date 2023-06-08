import { loadStyle } from '../../utils/utils.js';

const jsonpGist = (url, callback) => {
  // Setup a unique name that cane be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  const script = document.createElement('script');
  script.src = `${url}?callback=${callbackName}`;

  // The function the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  document.body.appendChild(script);
};

export default function init(el) {
  const { href } = el;
  const url = `${href}on`;

  jsonpGist(url, (data) => {
    loadStyle(data.stylesheet);
    el.insertAdjacentHTML('afterend', data.div);
    el.remove();
  });
}
