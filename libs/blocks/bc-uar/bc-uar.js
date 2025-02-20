import { render, html, useEffect, useState } from '../../deps/htm-preact.js';

const landingCardDetails = [
  {
    cardText: 'I want to edit and enhance my photos',
    cardImage: 'https://www.adobe.com/cc-shared/assets/img/uar/bc/ideas-to-get-started-1-edit-photos.png',
    cardColor: '#66BFE7',
  },
  {
    cardText: 'I need to design a logo for my business',
    cardImage: 'https://www.adobe.com/cc-shared/assets/img/uar/bc/ideas-to-get-started-2-create-logo.png',
    cardColor: '#F0BD7C',
  },
  {
    cardText: 'I’m looking for the best tools to edit videos',
    cardImage: 'https://www.adobe.com/cc-shared/assets/img/uar/bc/ideas-to-get-started-3-edit-videos.png',
    cardColor: '#B89FF0',
  },
  {
    cardText: 'I want to edit a PDF and add my signature.',
    cardImage: 'https://www.adobe.com/cc-shared/assets/img/uar/bc/ideas-to-get-started-4-edit-pdf.png',
    cardColor: '#B7CC4D',
  },
];

const landingCard = ({ cardDetails, onLandingClick }) => {
  const { cardText, cardImage, cardColor } = cardDetails;
  return html`
    <button class="landing-card" data-text="${cardText}" style="--card-color: ${cardColor};" onClick=${onLandingClick}>
      <div class="card-image" style="--card-image: url('${cardImage}')" loading="lazy"></div>
      <div class="card-text"><span class="text">${cardText}</span></div>
    </button>
  `;
};

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [currentView, setcurrentView] = useState('');

  const handleInput = async (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    // put JS to invoke chat view here, including submission text in a callback
    const input = document.querySelector('#bcInput');
    if (userInput === '') setUserInput(input.value);
    setcurrentView('chat');
  };

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const onLandingClick = (event) => {
    const { text } = event.target.dataset;
    const input = document.querySelector('#bcInput');
    setUserInput(text);
    input.value = text;
    handleSubmit();
  };

  return html`
    <div class="branding"><img src="https://www.adobe.com/cc-shared/assets/img/uar/bc/adobe-logo.svg" /></div>
    <div class="bc-container">
      <div class="bc-views">
        ${currentView !== 'chat' && html`
          <div class="landing-view">
            <div class="landing-heading">
              <h1>Not sure which apps are best for you? Take a minute. We'll help you figure it out.</h1>
              <h2>You can type in your idea or click on a suggestion to get started.</h2>
            </div>
            <div class="landing-cards">
              ${landingCardDetails.map((cardDetails) => html`
                <${landingCard} cardDetails=${cardDetails} onLandingClick=${onLandingClick} />
              `)}
            </div>
            <div class="bc-input-container">
              <input type="text" 
                id="bcInput" 
                class="bc-input" 
                placeholder="Describe what you want to create" 
                oninput=${handleInput} 
                onkeypress=${handleEnter} 
                autocomplete="off"
              ></input>
              <button id="submitButton" onClick=${handleSubmit} class="con-button blue">Submit</button>
            </div>
          </div>
        `}
        ${currentView === 'chat' && html`
          <div class="chat-view">
            <div>Chat View HERE. Text input was: ${userInput || 'empty'}</div>
            <button onClick=${() => { setcurrentView(''); setUserInput(''); }} class="con-button blue">Reset</button>
          </div>
        `}
      </div>
    </div>
  `;
};

export default async function init(el) {
  el.replaceChildren();
  render(html`<${App}}/>`, el);
}
