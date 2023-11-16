import { createTag } from '../../utils/utils.js';

let _fileContents;

export default async function init(blockEl) {
  blockEl.classList.add('content');
  const wrapper = createTag('div', { class: 'sko-form spectrum-form' });
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

  const submitButton = createTag('button', {class:'con-button blue button-justified-mobile'},'Submit')
  submitButton.addEventListener('click', onSubmit);
  wrapper.append(submitButton);
  blockEl.append(wrapper);
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
