import { createTag, getConfig } from '../../utils/utils.js';

let destination, emailAddress = '';
let count = 10;

export default async function init(blockEl) {

  const wrapper = createTag('div', {class:'redirect-wrapper'});

  // Get the destination URL and user email from the request
  if(window.location.search.length > 1) {
    if(window.location.search.length > 1) {
      destination = getQueryVariable('frameURL');
      emailAddress = getQueryVariable('email');
      const header = createTag('h1');
      const timerMessage = createTag('text', {id:'timer'});

      if(destination && emailAddress) {
        header.innerHTML = "Sit back, we're taking you to the right place shortly";
        wrapper.append(header);
        wrapper.append(timerMessage);
        blockEl.append(wrapper);
        updateTimer();

      } else {
        header.innerHTML = "Oooops! Something bad happened";
        timerMessage.innerHTML = "The url and email parameters were not provided."
        wrapper.append(header);
        wrapper.append(timerMessage);
        blockEl.append(wrapper);
      }
		
		 }
  }

}

function updateTimer() {
  let element = document.getElementById('timer')
  if (count > 0) {
    count--;
    element.innerHTML = "This page will redirect in " + count + " seconds."; // Timer Message
    setTimeout("updateTimer()", 1000);
  } else {
    window.location.href = destination;
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
