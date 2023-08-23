import { createTag } from '../../utils/utils.js';

const locales = ["English", "French", "German", "Japanese"];

const createForm = () => {

  let selectedLocales = [];
  const notSelected = (loc) => !selectedLocales.some(x => x === loc);

  const form = document.createElement('form');
  const formId = 'translation-form';
  form.setAttribute('id', formId);
  const select = document.createElement('select');
  select.setAttribute('form', formId);
  locales.forEach(loc => {
    const opt = document.createElement('option');
    opt.setAttribute('value', loc);
    opt.textContent = loc;
    select.appendChild(opt);
  });
  const selectedContainer = document.createElement('div');
  selectedContainer.classList.add('selected-container');
  
  
  const redrawSelected = () => {
    const createSelected = (name) => {
      const selected = document.createElement('div');
      selected.classList.add('selected');
      const text = document.createElement('span');
      text.textContent = name;
      const cross = document.createElement('span');
      cross.textContent = 'x';
      selected.addEventListener('click', (event) => {
        const lang = selected.children[0].textContent
        if(!notSelected(lang)) {
          selectedLocales = selectedLocales.filter(x => x !== lang);
          selected.remove();
        }
      });
      selected.replaceChildren(text, cross)
      return selected;
    }
    selectedContainer.innerHTML = '';
    selectedLocales.forEach(l => {
      selectedContainer.appendChild(createSelected(l));
    });
  };

  select.addEventListener('change', (event) => {
    event.preventDefault();
    const l = event.target.value;
    if(notSelected(l)) {
      selectedLocales.push(l);
      redrawSelected();
    }
  });

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit');
  submitButton.textContent = "Submit";

  submitButton.addEventListener('click', async (event) => {
    const url = 'http://localhost:80/translate';
    const data = {
      url: `${window.location.origin}${window.location.pathname}.md`,
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
    console.info(response);
  });

  form.appendChild(select);
  form.appendChild(selectedContainer);
  form.appendChild(submitButton);

  return form;
}

export default (block) => {
  const content = createTag('div', {class: 'locale-flow-form'});
  content.appendChild(createForm());
  block.insertAdjacentElement('afterbegin', content);
}; 
