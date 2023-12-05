import { createTag, getConfig } from '../../utils/utils.js';

let destination, emailAddress = null ;
let count = 10;
const headerWrapper = createTag('div');
const header = createTag('h1');
headerWrapper.append(header);
const timerMessage = createTag('div', {id:'timer'});




export default async function init(blockEl) {

  const wrapper = createTag('div', {class:'redirect-wrapper'});


  // Get the destination URL and user email from the request
  if(window.location.search.length > 1) {
      destination = getQueryVariable('frameURL');
      emailAddress = getQueryVariable('email');
      

      if(destination && emailAddress) {
        header.innerHTML = "Sit back, we're taking you to the right place shortly";
    
        const manualButton = createTag('button', {class:'con-button blue button-justified-mobile'},'Take me now');
        manualButton.addEventListener("click", redirect);


        wrapper.append(headerWrapper);
        wrapper.append(timerMessage);
        wrapper.append(manualButton);

        blockEl.append(wrapper);
        //updateTimer();

      } else {
        decorateError(wrapper, blockEl);
        
      }
		
		} else {
      decorateError(wrapper, blockEl);
    }
}

function redirect() {
  window.location.href = destination;
}


function decorateError (wrapper, blockEl){
  header.innerHTML = "Oooops! Something bad happened";
  timerMessage.innerHTML = "The frameURL and email parameters were not provided."
  wrapper.append(headerWrapper);
  wrapper.append(timerMessage);
  blockEl.append(wrapper);
}

export function updateTimer() {
  let element = document.getElementById('timer')
  if (count > 0) {
    count--;
    element.innerHTML = "This page will redirect in " + count + " seconds."; // Timer Message
    setTimeout(updateTimer, 1000);
  } else {
    redirect();
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}
