import { render, html, useEffect, useState } from '../../deps/htm-preact.js';
import loadChat from './bc-chat.js';

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
    cardText: 'I\'m looking for the best tools to edit videos',
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
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const sendButton = document.querySelector('.bc-send-button');
      if (sendButton) {
        sendButton.addEventListener('click', () => {
          setShowCards(false);
        });
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const onLandingClick = (event) => {
    const { text } = event.target.dataset;
    const input = document.querySelector('.bc-chat-input');
    setUserInput(text);
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return html`
    <div class="branding"><img src="https://www.adobe.com/cc-shared/assets/img/uar/bc/adobe-logo.svg" /></div>
    <div class="bc-container">
      <div class="bc-views">
          <div class="landing-view">
            <div class="landing-heading">
              <h1>Not sure which apps are best for you? Take a minute. We'll help you figure it out.</h1>
              <h2>You can type in your idea or click on a suggestion to get started.</h2>
            </div>
            ${showCards && html`
              <div class="landing-cards">
                ${landingCardDetails.map((cardDetails) => html`
                  <${landingCard} cardDetails=${cardDetails} onLandingClick=${onLandingClick} />
                `)}
              </div>
            `}
            <div class="bc-input-container">
              <div id="adobe-brand-concierge-mount-point"></div>
            </div>
          </div>
      </div>
    </div>
  `;
};

export default async function init(el) {
  el.replaceChildren();
  render(html`<${App}}/>`, el);
  await loadChat();
}
