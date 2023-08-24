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
    submitButton.disabled = true;
    const url = 'http://localhost:80/translate';
    const body = {
      url: `${window.location.origin}${window.location.pathname}.plain.html`,
      selectedLocales
    };
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const response = await resp.json();
    const { status, data } = response;
    if (response.status === 200) {
      const downloads = createTag('div', { class: 'downloads' });
      const t = createTag('h4', { class: 'title' });
      t.textContent = "Your translated documents are ready";
      downloads.appendChild(t);
      selectedLocales.forEach(loc => {
        const link = createTag('a');
        const fail = createTag('span', { class: 'fail' });
        link.textContent = `Download the ${loc} translation`;
        link.href = data[loc].translatedDocUrl;
        fail.textContent = `The ${loc} translation failed`;
        downloads.appendChild(data[loc].success ? link : fail);
      });
      form.replaceChildren(downloads);
    } else {
      const callFailed = createTag('div');
      callFailed.textContent = 'Failed to make translate call. Status: ' + status 
      form.replaceChildren(callFailed);
    }
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
