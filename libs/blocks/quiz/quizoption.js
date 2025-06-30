import { html } from '../../deps/htm-preact.js';
import { removeLeftToRightMark } from './utils.js';

export const OptionCard = ({
  text, title, image, icon, iconTablet, iconDesktop, options, disabled, selected, background,
}) => {
  const getOptionClass = () => {
    let className = 'no-track ';
    if (icon || iconTablet || iconDesktop) className += 'has-icon ';
    if (image) className += 'has-image ';
    if (background) className += 'has-background ';
    if (disabled) className += disabled;
    if (selected) className += selected;
    return className;
  };

  const getIconClass = () => {
    let className = '';
    if (!icon) className += 'no-icon-default ';
    if (!iconTablet && (icon || iconDesktop)) className += 'no-icon-tablet ';
    return className;
  };

  const getIconHtml = () => html`<div class="quiz-option-icon ${getIconClass()}">
    <picture>
      ${iconDesktop && html`<source media="(min-width: 1024px)" srcset="${removeLeftToRightMark(iconDesktop)}" />`}
      ${iconTablet && html`<source media="(min-width: 600px)" srcset="${removeLeftToRightMark(iconTablet)}" />`}
      <img src="${removeLeftToRightMark(icon)}" alt="" loading="lazy" />
    </picture>
  </div>`;

  const imageHtml = html`
    <div class="quiz-option-image" 
      style="background-image: url('${removeLeftToRightMark(image)}'); background-size: cover" loading="lazy">
    </div>`;

  const titleHtml = html`
    <p class="quiz-option-title">${title}</p>
  `;

  const textHtml = html`
    <p class="quiz-option-text">${text}</p>
  `;

  const unChecked = html`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="0.999023" width="12" height="12" rx="2" fill="white" stroke="#2C2C2C" stroke-width="2"/>
    </svg>
  `;

  const unCheckedDisabled = html`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="0.999023" width="12" height="12" rx="2" stroke="#686868" stroke-width="2"/>
    </svg>
  `;

  const checked = html`
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect y="-0.000976562" width="14" height="14" rx="3" fill="#292929"/>
    <g clip-path="url(#clip0_6091_1191)">
      <path d="M5.8146 10.6886C5.54116 10.6886 5.28189 10.5666 5.10659 10.3566L3.21548 8.08806C2.8898 7.69744 2.94253 7.11638 3.33364 6.79021C3.72426 6.46501 4.30532 6.51775 4.63149 6.90837L5.7936 8.30192L9.35415 3.77067C9.66811 3.37028 10.2477 3.29997 10.6481 3.6154C11.0485 3.92985 11.1178 4.50895 10.8034 4.90935L6.53921 10.3361C6.36733 10.5549 6.1061 10.6838 5.82778 10.6887L5.8146 10.6886Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_6091_1191">
      <rect width="10" height="10" fill="white" transform="translate(2 1.99902)"/>
    </clipPath>
    </defs>
  </svg>
`;

  return html`<button class="quiz-option ${getOptionClass()}" data-option-name="${options}" 
        role="checkbox" aria-checked="${!!selected}" disabled="${disabled}">
        ${(icon || iconTablet || iconDesktop) && getIconHtml()}
        ${image && imageHtml}
        <div class="quiz-option-text-container">  
          ${title && titleHtml}
          ${text && textHtml}
        </div>
        <div class="quiz-option-checkbox">
          ${selected && checked}
          ${!selected && !disabled && unChecked}
          ${!selected && disabled && unCheckedDisabled}
        </div>
    </button>`;
};

export const CreateOptions = ({
  options, handleCardSelection, selectedCards, countSelectedCards = 0, maxSelections,
  getOptionsIcons, background,
}) => html`
      ${options?.data.map((option, index) => (
    html`<div key=${index} onClick=${handleCardSelection(option)}>
          <${OptionCard} 
            text=${option.text}
            title=${option.title} 
            icon=${getOptionsIcons(option.options, 'icon')}
            iconTablet=${getOptionsIcons(option.options, 'icon-tablet')}
            iconDesktop=${getOptionsIcons(option.options, 'icon-desktop')}
            image=${getOptionsIcons(option.options, 'image')}
            background=${background}
            options=${option.options}
            selected=${selectedCards[option.options] ? 'selected' : ''}
            disabled=${(countSelectedCards > 0 && !selectedCards[option.options] && countSelectedCards >= maxSelections) ? 'disabled' : ''}/>
        </div>`
  ))}`;

export const GetQuizOption = ({
  btnText, options, minSelections, maxSelections, selectedCards,
  handleOnNextClick, onOptionClick, countSelectedCards, getOptionsIcons,
  btnAnalyticsData, background,
}) => html`
  <div class="quiz-question">
      <div class="quiz-options-container" role="group" aria-labelledby="question">
        <${CreateOptions} 
          options=${options} 
          selectedCards=${selectedCards}
          countSelectedCards=${countSelectedCards} 
          maxSelections=${maxSelections}
          getOptionsIcons=${getOptionsIcons}
          handleCardSelection=${onOptionClick}
          background=${background} />
      </div>
      <div class="quiz-button-container">
        <button 
          disabled=${countSelectedCards < minSelections && 'disabled'}
          aria-label="${btnText}" 
          class="quiz-button" 
          daa-ll="${btnAnalyticsData}"
          onClick=${() => { handleOnNextClick(); }}>
            <span class="quiz-button-label">${btnText}</span>
        </button>
      </div>
  </div>`;
