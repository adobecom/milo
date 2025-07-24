import { createTag, getConfig } from '../../utils/utils.js';
import { getModal } from '../modal/modal.js';

function initModal(el) {
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  el.appendChild(button);
  button.addEventListener('click', () => {
    const mountEl = document.createElement('div');
    mountEl.id = 'brand-concierge-mount';
    getModal(null, {
      id: 'brand-concierge-modal',
      content: mountEl,
      closeEvent: 'closeModal', // Megan TODO: Fix this
    });

    // Temporary way to load chat from stage
    const devScript = document.createElement('script');
    devScript.src = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/dev.js';
    devScript.async = true;
    document.head.appendChild(devScript);

    // const devCss = document.createElement('link');
    // devCss.rel = 'stylesheet';
    // devCss.href = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/dev.css';
    // document.head.appendChild(devCss);

    const mainScript = document.createElement('script');
    mainScript.src = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
    mainScript.async = true;
    document.head.appendChild(mainScript);
  });
}

export default async function init(el) {
  console.log(el);

  initModal(el);
}
