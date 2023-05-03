import { html } from '../../deps/htm-preact.js';

export const OptionCard = ({
  text, title, coverImage, cardIcon, options, disabled, selected,
}) => {
  const cardIconHtml = html`<div class="consonant-OneHalfCard-image">
    <img src="${cardIcon}" alt="Video" class="icon" />
  </div>`;

  const coverImageHtml = html`
    <div class="consonant-OneHalfCard-cover" 
      style="background-image: url('${coverImage}') !important;">
    </div>`;

  return html`<div class="card half-card border consonant-Card consonant-OneHalfCard quiz-option ${disabled} ${selected}" 
                    data-card-name="${options}">
        <div class="consonant-OneHalfCard-inner">
          ${cardIcon && cardIconHtml}
          ${coverImage && coverImageHtml}
        <div data-valign="middle">  
          <h3 id="lorem-ipsum-dolor-sit-amet-3" class="consonant-OneHalfCard-title">${title}</h3>
          <p class="consonant-OneHalfCard-text">${text}</p>
        </div>
      </div>
    </div>`;
};

export const CreateOptions = ({
  options, handleCardSelection, selectedCards, countSelectedCards = 0, maxSelections,
  getOptionsIcons,
}) => html`
      ${options.data.map((option, index) => (
    html`<div key=${index} onClick=${handleCardSelection(option)}>
          <${OptionCard} 
            text=${option.text}
            title=${option.title} 
            cardIcon=${getOptionsIcons(option.options, 'image')}
            coverImage=${getOptionsIcons(option.options, 'cover')}
            options=${option.options}
            selected=${selectedCards[option.options] ? 'selected' : ''}
            disabled=${(countSelectedCards > 0 && !selectedCards[option.options] && countSelectedCards >= maxSelections) ? 'disabled' : '' }/>
        </div>`
  ))}`;

export const GetQuizOption = ({
  btnText, options, minSelections, maxSelections, selectedCards,
  handleOnNextClick, onOptionClick, countSelectedCards, getOptionsIcons,
}) => html`
    <div class="milo-card-wrapper consonant-Wrapper consonant-Wrapper--1200MaxWidth">
        <div class="consonant-Wrapper-collection">
            <div class="consonant-CardsGrid consonant-CardsGrid--options consonant-CardsGrid--5up consonant-CardsGrid--with4xGutter quiz-options-container">
              <${CreateOptions} 
                options=${options} 
                selectedCards=${selectedCards} 
                countSelectedCards=${countSelectedCards} 
                maxSelections=${maxSelections}
                getOptionsIcons=${getOptionsIcons}
                handleCardSelection=${onOptionClick} />
              </div>
          </div>
          <div class="quiz-button-container">
            <button 
              disabled=${countSelectedCards < minSelections && 'disabled'}
              aria-label="Next" 
              data-quiz-button="" 
              class="spectrum-Button spectrum-Button--outline spectrum-Button--sizeXL quiz-btn" 
              daa-ll="Filters|cc:app-reco|Q#1/Photo"
              onClick=${() => {
    handleOnNextClick(selectedCards);
  }}>
                <span class="quiz-Button-label">${btnText}</span>
            </button>
          </div>
      </div>`;
