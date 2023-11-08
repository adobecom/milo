import { html } from '../../deps/htm-preact.js';

export const OptionCard = ({
  text, title, coverImage, cardIcon, options, disabled, selected,
}) => {
  const cardIconHtml = html`<div class="quiz-option-icon">
    <img src="${cardIcon}" alt="Quiz Option Icon" />
  </div>`;

  const coverImageHtml = html`
    <div class="quiz-option-image" 
      style="background-image: url('${coverImage}')">
    </div>`;

  if (options == 'fi_code')
  return html`<button class="quiz-option ${disabled}${selected}" data-option-name="${options}" id="${options}" 
        data-option-type="${cardIcon ? 'icon' : ''}${coverImage ? 'cover-image' : ''}"
        aria-pressed="${!!selected}" tabindex="${disabled ? '-1' : '0'}">
        ${cardIcon && cardIconHtml}
        ${coverImage && coverImageHtml}
        <div class="quiz-option-text-container">  
          <h3 class="quiz-option-title">${title}</h3>
          <p class="quiz-option-text">${text}</p>
          <input type="text" placeholder="${text}"/>
        </div>
    </button>`;
  else return html`<button class="quiz-option ${disabled}${selected}" data-option-name="${options}" id="${options}" 
        data-option-type="${cardIcon ? 'icon' : ''}${coverImage ? 'cover-image' : ''}"
        aria-pressed="${!!selected}" tabindex="${disabled ? '-1' : '0'}">
        ${cardIcon && cardIconHtml}
        ${coverImage && coverImageHtml}
        <div class="quiz-option-text-container">  
          <h3 class="quiz-option-title">${title}</h3>
          <p class="quiz-option-text">${text}</p>
        </div>
    </button>`;
};

export const CreateOptions = ({
  options, handleCardSelection, selectedCards, countSelectedCards = 0, maxSelections,
  getOptionsIcons,
}) => html`
      ${options?.data.map((option, index) => (
    html`<div key=${index} onClick=${handleCardSelection(option)}>
          <${OptionCard} 
            text=${option.text}
            title=${option.title} 
            cardIcon=${getOptionsIcons(option.options, 'image')}
            coverImage=${getOptionsIcons(option.options, 'cover')}
            options=${option.options}
            selected=${selectedCards[option.options] ? 'selected' : ''}
            disabled=${((selectedCards.fi_code && option.options !== 'fi_code') || (countSelectedCards > 0 && !selectedCards.fi_code && option.options == 'fi_code') || (!selectedCards.fi_code  && countSelectedCards > 0 && !selectedCards[option.options] && countSelectedCards >= maxSelections)) ? 'disabled' : ''}/>
        </div>`
  ))}`;

export const GetQuizOption = ({
  btnText, options, minSelections, maxSelections, selectedCards,
  handleOnNextClick, onOptionClick, countSelectedCards, getOptionsIcons,
  btnAnalyticsData,
}) => html`
  <div class="quiz-question">
      <div class="quiz-options-container">
        <${CreateOptions} 
          options=${options} 
          selectedCards=${selectedCards}
          countSelectedCards=${countSelectedCards} 
          maxSelections=${maxSelections}
          getOptionsIcons=${getOptionsIcons}
          handleCardSelection=${onOptionClick} />
      </div>
      <div class="quiz-button-container">
        <button 
          disabled=${countSelectedCards < minSelections && 'disabled'}
          aria-label="Next" 
          class="quiz-button" 
          daa-ll="${btnAnalyticsData}"
          onClick=${() => { handleOnNextClick(selectedCards); }}>
            <span class="quiz-button-label">${btnText}</span>
        </button>
      </div>
  </div>`;
