import { createTag } from '../../utils/utils.js';

const locales = ["English", "French", "German", "Japanese"];

const createForm = () => {

  let selectedLocales = [];

  const selected = (loc) => selectedLocales.find(x => x === loc);

  const submitButton = document.createElement('button');
  submitButton.disabled = true;
  const setSubmitStatus = () => {
    submitButton.disabled = !selectedLocales.length;
  }

  const title = createTag('h4', { class: 'title' });
  title.textContent = 'Locales';

  const form = createTag('div', { class: 'form' });
  form.appendChild(title);
  const localesContainer = createTag('div', { class: 'locales-container' });

  locales.forEach(loc => {
    const button = createTag('button', { class: 'locale-button' });
    button.textContent = loc;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if(!selected(loc)) {
        button.classList.add('selected');
        selectedLocales.push(loc);
      } else {
        button.classList.remove('selected');
        selectedLocales = selectedLocales.filter(x => x !== loc);
      }
      setSubmitStatus();
    })
    localesContainer.appendChild(button);
  });

  submitButton.classList.add('submit');
  submitButton.textContent = "Submit";

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const url = 'http://localhost:80/translate';
    const data = {
      url: `${window.location.origin}${window.location.pathname}.plain.html`,
      selectedLocales
    };
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const response = resp.json();
  });

  form.appendChild(localesContainer);
  form.appendChild(submitButton);

  return form;
}

export default (block) => {
  const content = createTag('div', {class: 'locale-flow-form'});
  content.appendChild(createForm());
  block.insertAdjacentElement('afterbegin', content);
}; 
