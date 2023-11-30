import { createTag, getConfig } from '../../utils/utils.js';

let _fileContents = null;

export default async function init(blockEl) {
  blockEl.classList.add('content');
  const formFields = await fetch('/signup-form-fields.json');
  const results = await formFields.json();
  const fieldList = results.data;

  const wrapper = createTag('form', { class: 'sko-form spectrum-form', action:'https://prod-149.westus.logic.azure.com:443/workflows/9617d5afd2e844159486024231f5dd75/trigger[…]1.0&sig=aH81nljMBnWzitSFGzYYkghXmPrwZl9j3reURjF30Wo', method:'post' });

  fieldList.forEach(item => {
    decorateFormField(item, wrapper);
  })
  
  window.addEventListener('onImsLibInstance',getCreds);
  
  //const submit = createTag('input',{type:'submit', value:'Submit'});
  //wrapper.append(submit);
  blockEl.append(wrapper);

  const buttonWapper = createTag('div', {class:'submit-button'});
  const submitButton = createTag('button', {class:'con-button blue button-justified-mobile'},'Submit')
  submitButton.addEventListener('click', onSubmit);
  buttonWapper.append(submitButton);
  blockEl.append(buttonWapper);
}

function decorateFormField(fieldJson, el) {
  const fieldWapper = createTag('div', {class:'field-group'});
  const fieldLabel = createTag('label', {class: 'sko-form-label'},fieldJson.label + " *");
  const fieldID = fieldJson.id;
  let formField;
  switch (fieldJson.type) {
    case 'text':
      formField = createTag('input', {id: fieldID, class: 'sko-form-input', required:true, type:'text'});
      break;
    case 'email':
      formField = createTag('input', {id: fieldID, class: 'sko-form-input', type:'email'});
      break;
    case 'dropdown':
      if(fieldJson.options !== '') {
        formField = createTag('select', {type:'select', id: fieldID, class: 'sko-form-input', placeholder:'Please select one...'});
        const options = fieldJson.options.split(',');
        const placeholder = createTag('option', {value:'', disabled:true, selected:true, required:true, hidden:true}, 'Select one...');
        formField.append(placeholder);
        options.forEach((item) => {
          const ddOption = createTag('option', {value:item},item);
          formField.append(ddOption);
        });
      }
      break;
    case 'file':
      formField = createTag('input', {id: fieldID, class: 'sko-form-input',type:'file', accept:'.png, .jpg',capture:'camera'});
      formField.addEventListener("change", getBase64, false);
      break;
  }

  //const submit = createTag('form', {action:'https://prod-149.westus.logic.azure.com/workflows/9617d5afd2e844159486024231f5dd75/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aH81nljMBnWzitSFGzYYkghXmPrwZl9j3reURjF30Wo', method:'post'})

  fieldWapper.append(fieldLabel);
  const inputWrapper = createTag('div');
  inputWrapper.append(formField);
  fieldWapper.append(inputWrapper);
  el.append(fieldWapper);
}


async function onSubmit() {
  const fieldCollection = document.querySelectorAll('.sko-form-input');
  let isValid = true;
  const payload = {};
  fieldCollection.forEach(item => {
    if(item.type === 'file') {
      if(_fileContents !== null) {
        item.classList.remove('invalid')
        payload[item.id] = _fileContents;
      } else {
        item.classList.add('invalid')
        isValid = false;
      }
    } else {
      if(item.value !== "" && item.value !== null) {
        item.classList.remove('invalid')
        payload[item.id] = item.value;
      } else {
        item.classList.add('invalid')
        isValid = false;
      }
      
    }
    
  }); 
    if(isValid) {
      const submitButton = document.querySelector('.submit-button > button');
      submitButton.label='Submitting...';
      submitButton.disabled = true;
      submitButton.classList.add('submitted');

      
      try {
        const response = await fetch("https://prod-149.westus.logic.azure.com/workflows/9617d5afd2e844159486024231f5dd75/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aH81nljMBnWzitSFGzYYkghXmPrwZl9j3reURjF30Wo", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if(response.ok) {
        const wrapper = document.querySelector('.sko-demo-signup');
        const parent = wrapper.parentNode;
        wrapper.remove();
        const message = {
          heading:'Thank you for your submission ' + payload.firstName,
          subHeading: 'A bunch of stuff is happening which we will tell you all about at SKO.',
          image: 'success.png'
        }
        displayMessage(message, parent)
      }

    } catch (e) {
        const wrapper = document.querySelector('.sko-demo-signup');
          const parent = wrapper.parentNode;
          wrapper.remove();

          const message = {
            heading:'Oops... This is embarrassing.',
            subHeading: 'Something bad must have happened. Let us know so we can fix it.',
            image: 'error.png'
          }
          displayMessage(message, parent);
      }
      
    }
    
}

function displayMessage(message, parent) {
  const { codeRoot } = getConfig();
  const marqueeWrapper = createTag('div', {class:'marquee light'});
  const container = createTag('div', {class:'foreground container'});
  const text = createTag('div', {class:'text', 'data-valign':'middle'});
  const heading = createTag('h2', {class: 'heading-xl'},message.heading);
  const subHeading = createTag('p', {class:'body-m'},message.subHeading);

  text.append(heading);
  text.append(subHeading);

  const image = createTag('div', {class:'media image', 'data-valign':'middle'});
  const picture = createTag('img',{src:`${codeRoot}/blocks/sko-demo-signup/img/${message.image}`});

  image.append(picture)
  container.append(text);
  container.append(image);
  marqueeWrapper.append(container);
  parent.append(marqueeWrapper);
}


const getCreds = () => {
  if(window.adobeIMS.isSignedInUser()) {
    getProfileInfo()
  }
}

async function getProfileInfo() {
  const profile = await window.adobeIMS.getProfile();
  document.getElementById('firstName').value = profile.first_name;
  document.getElementById('lastName').value = profile.last_name;
  document.getElementById('email').value = profile.email;
}

function getBase64() {      
  var reader = new FileReader();   
  reader.readAsDataURL(this.files[0]);  
  reader.onload = function () {  
    _fileContents = reader.result;
  };  
  reader.onerror = function (error) {  
      console.log('Error: ', error);  
  };   
}


