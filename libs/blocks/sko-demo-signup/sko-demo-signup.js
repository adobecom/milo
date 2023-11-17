import { createTag } from '../../utils/utils.js';

let _fileContents;

export default async function init(blockEl) {
  blockEl.classList.add('content');
  const formFields = await fetch('/signup-form-fields.json');
  const results = await formFields.json();
  //console.log(data.data);
  const fieldList = results.data;

  const wrapper = createTag('div', { class: 'sko-form spectrum-form' });
  console.log(fieldList);
  fieldList.forEach(item => {
    decorateFormField(item, wrapper);
  })

  
  
  window.addEventListener('onImsLibInstance',getCreds);
  
  /*
  const fieldNames = blockEl.querySelectorAll(':scope > div div');
  
    fieldNames.forEach((item, i) => {
      const fieldWapper = createTag('div');
      const spectrumLabel = createTag('label', {class: 'sko-form-label'},item.innerText);
      let formField;
      const fieldID = generateFieldName(item.innerText);
      if(item.innerText.startsWith('Picture')) {
        formField = createTag('input', {id: fieldID, class: 'sko-form-input spectrum-Textfield-input',type:"file", accept:".png, .jpg",capture:"camera" });
        formField.addEventListener("change", getBase64, false);
      } else {
        
        formField= createTag('input', {id: fieldID, class: 'sko-form-input spectrum-Textfield-input'});
      }
      const inputWrapper = createTag('div');
      inputWrapper.append(formField);
      fieldWapper.append(spectrumLabel)
      fieldWapper.append(inputWrapper);
      wrapper.append(fieldWapper);
      item.remove();
  });
  */
  const buttonWapper = createTag('div', {class:'submit-button'});
  const submitButton = createTag('button', {class:'con-button blue button-justified-mobile'},'Submit')
  submitButton.addEventListener('click', onSubmit);
  buttonWapper.append(submitButton);
  wrapper.append(buttonWapper);
  blockEl.append(wrapper);
}

function decorateFormField(fieldJson, el) {
  const fieldWapper = createTag('div');
  const fieldLabel = createTag('label', {class: 'sko-form-label'},fieldJson.label);
  const fieldID = fieldJson.id;
  let formField;
  switch (fieldJson.type) {
    case 'text':
      formField = createTag('input', {id: fieldID, class: 'sko-form-input', type:'text'});
      break;
    case 'email':
      formField = createTag('input', {id: fieldID, class: 'sko-form-input', type:'email'});
      break;
    case 'dropdown':
      if(fieldJson.options !== '') {
        formField = createTag('select', {id: fieldID, class: 'sko-form-input', placeholder:'Please select one...'});
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
      break;
  }

  fieldWapper.append(fieldLabel);
  const inputWrapper = createTag('div');
  inputWrapper.append(formField);
  fieldWapper.append(inputWrapper);
  el.append(fieldWapper);
}


async function onSubmit() {
  const fieldCollection = document.querySelectorAll('.sko-form-input');
  const payload = {};
  fieldCollection.forEach(item => {
    if(item.id === 'picture') {
      payload[item.id] = _fileContents;
    } else {
      payload[item.id] = item.value;
    }
    
  }); 
  const response = await fetch("https://prod-148.westus.logic.azure.com:443/workflows/b99189fde390438f82ea53b71daed118/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aHHtKCMxZ0vLxQzQDoOlJdDE3l6su8a7uJRnxtAcbdE", {
				  method: "POST",
				  body: JSON.stringify(payload),
				  headers: {
				    "Content-type": "application/json; charset=UTF-8"
				  }
				});

        if(response.ok) {
          const wrapper = document.querySelector('.sko-form');
          const parent = wrapper.parentNode;
          wrapper.remove();
          const message = createTag('h1',{},'Thank you for your submission ' + payload.firstName);
          parent.append(message);
        }
}

const getCreds = () => {
  if(window.adobeIMS.isSignedInUser()) {
    getProfileInfo()
  }

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

function generateFieldName(str) {
  const concatString = str.replace(/\s/g, "");
  return concatString[0].toLowerCase() + concatString.slice(1);
}

async function getProfileInfo() {
  const profile = await window.adobeIMS.getProfile();
  document.getElementById('firstName').value = profile.first_name;
  document.getElementById('lastName').value = profile.last_name;
  document.getElementById('email').value = profile.email;
}
