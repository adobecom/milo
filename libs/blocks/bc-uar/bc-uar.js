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

const handleScroll = () => {
  const scrollButton = document.querySelector('.bc-scroll-button');
  if (scrollButton) {
    const isAtBottom = window.scrollY
    + window.innerHeight === document.body.getBoundingClientRect().height;

    if (isAtBottom) scrollButton.classList.remove('active');
    else scrollButton.classList.add('active');
  }
};

const landingCard = ({ cardDetails, onLandingClick }) => {
  const { cardText, cardImage, cardColor } = cardDetails;
  return html`
    <button class="landing-card" data-text="${cardText}" style="--card-color: ${cardColor};" onClick=${onLandingClick}>
      <div class="card-image" style="--card-image: url('${cardImage}')" loading="lazy"></div>
      <div class="card-text"><span class="text">${cardText}</span></div>
    </button>
  `;
};

function addFavicon() {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'https://www.adobe.com/creativecloud/img/favicons/favicon.ico';
  document.head.appendChild(link);
}

const App = () => {
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sendButton = document.querySelector('.bc-send-button');
      const input = document.querySelector('.bc-chat-input');

      if (sendButton && input) {
        sendButton.addEventListener('click', () => {
          setShowCards(false);
        });

        // Add Enter key handler for both input and button
        const handleEnter = (event) => {
          if (event.key === 'Enter') {
            setShowCards(false);
            sendButton.click(); // Trigger the send button click
          }
        };

        input.addEventListener('keydown', handleEnter);
        sendButton.addEventListener('keydown', handleEnter);

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
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.bc-send-button').click();
  };

  const onScrollClick = () => {
    window.scrollTo({
      top: document.body.getBoundingClientRect().height,
      behavior: 'smooth',
    });
  };

  return html`
    <div class="bc-container${showCards === false ? ' bc-active' : ''}">
      <div class="branding"><img src="https://www.adobe.com/cc-shared/assets/img/uar/bc/adobe-logo.svg" /></div>
      <div class="bc-content">
          ${showCards && html`
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
          </div>
          `}
          <div class="bc-mount-container">
            <div id="adobe-brand-concierge-mount-point"></div>
            ${!showCards && html`<button class="bc-scroll-button" onClick=${onScrollClick}></button>`}
          </div>
      </div>
    </div>
  `;
};

export default async function init(el) {
  el.replaceChildren();
  await loadChat(); // Wait for chat to load first
  addFavicon();
  document.addEventListener('scroll', () => handleScroll());
  render(html`<${App}/>`, el);
}
