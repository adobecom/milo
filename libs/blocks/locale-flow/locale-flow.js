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
        if(!notSelected(event.target.textContent)) {
          selectedLocales = selectedLocales.filter(x => x!==event.target.textContent);
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
  })
  form.appendChild(select);
  form.appendChild(selectedContainer);
  return form;
}

export default (block) => {
  const content = createTag('div', {class: 'locale-flow-form'});
  content.appendChild(createForm());
  block.insertAdjacentElement('afterbegin', content);
}; 
