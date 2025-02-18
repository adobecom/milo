import {
  render, html, useEffect, useState } from '../../deps/htm-preact.js';

const App = () => {
  const [userInput, setUserInput] = useState('');

  const handleInput = async (event) => {
    setUserInput(event.target.value);
    console.log('input: ', userInput);
  };

  const handleSubmit = async () => {
    const input =  document.querySelector('#bcInput');
    console.log('your input was: ', userInput);
    input.value = '';
  };

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      console.log('you have pressed enter');
      handleSubmit();
    }
  };

  return html`
    <div class="bc-wrapper">
      <input type="text" 
        id="bcInput" 
        class="bc-input" 
        placeholder="Enter a prompt" 
        oninput=${handleInput} 
        onkeypress=${handleEnter} 
        autocomplete="off"
      ></input>
      <button id="submitButton" onClick=${handleSubmit} class="con-button blue">Submit</button>
    </div>
  `;
};

export default async function init(el) {
  el.replaceChildren();
  render(html`<${App}}/>`, el);
}
