import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { createTag, getConfig, MILO_EVENTS } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const ARROW_NEXT_IMG = `<img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16">`;
const ARROW_PREVIOUS_IMG = `<img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16">`;
// document.documentElement.dir = 'rtl';
function decorateNextPreviousBtns() {
  const previousBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-previous',
      'aria-label': 'Previous',
      'data-toggle': 'previous',
    },
    ARROW_PREVIOUS_IMG,
  );

  const nextBtn = createTag(
    'button',
    {
      class: 'carousel-button carousel-next',
      'aria-label': 'Next',
      'data-toggle': 'next',
    },
    ARROW_NEXT_IMG,
  );
  return [previousBtn, nextBtn];
}

const nextPreviousBtns = decorateNextPreviousBtns();
const previousBtn = nextPreviousBtns[0];
const nextBtn = nextPreviousBtns[1];

export const OptionCard = ({
  text, title, image, icon, iconTablet, iconDesktop, options, disabled, selected, background, onClick,
}) => {
  const getOptionClass = () => {
    let className = '';
    if (icon || iconTablet || iconDesktop) className += 'has-icon ';
    if (image) className += 'has-image ';
    if (background) className += 'has-background ';
    if (disabled) className += 'disabled ';
    if (selected) className += 'selected ';
    return className;
  };

  const getIconHtml = () => html`<div class="quiz-option-icon">
    <picture>
      ${iconDesktop && html`<source media="(min-width: 1024px)" srcset="${iconDesktop}" />`}
      ${iconTablet && html`<source media="(min-width: 600px)" srcset="${iconTablet}" />`}
      <img src="${icon}" alt="${`Icon - ${title || text}`}" loading="lazy" />
    </picture>
  </div>`;

  const imageHtml = image ? html`<div class="quiz-option-image" style="background-image: url('${image}'); background-size: cover" loading="lazy"></div>` : null;
  const titleHtml = title ? html`<h2 class="quiz-option-title">${title}</h2>` : null;
  const textHtml = text ? html`<p class="quiz-option-text">${text}</p>` : null;

  return html`<button class="quiz-option ${getOptionClass()}" data-option-name="${options}" 
        role="checkbox" aria-checked="${selected ? 'true' : 'false'}" disabled="${disabled}" onclick=${onClick}>
        ${(icon || iconTablet || iconDesktop) && getIconHtml()}
        ${image && imageHtml}
        <div class="quiz-option-text-container">  
          ${title && titleHtml}
          ${text && textHtml}
        </div>
    </button>`;
};

export const GetQuizOption = ({
  options, maxSelections, selectedCards,
  onOptionClick, countSelectedCards, getOptionsValue,
  background, mlInputUsed,
}) => {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth >= 600 ? 5 : 2.5);
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

  useEffect(() => {
    const handleResize = () => setVisibleCount(window.innerWidth >= 600 ? 5 : 2.5);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    if (index + visibleCount < options.data.length) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      isRTL ? prev() : next();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      isRTL ? next() : prev();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Directly use the target element to trigger the click event
      if (e.target && e.target.click) {
        e.target.click();
      }
    }
  };

  useEffect(() => {
    const entry = document.querySelector('.quiz-entry');
    if (entry && entry.querySelector('.no-carousel')) {
      entry.removeChild(entry.querySelector('.no-carousel'));
    }
  }, []);

  return html`
    <div class="quiz-question" tabindex="0" onkeydown=${handleKey}>
        <div class="quiz-options-container" role="group" aria-labelledby="question">
          ${index > 0 && html`<button tabIndex="-1" onClick=${prev} class="carousel-arrow-prev ${isRTL ? 'rtl' : ''}"></button>`}
          <div class="carousel-slides">
            ${options.data.slice(index, index + visibleCount).map((option, idx) => html`
              <${OptionCard} 
                key=${idx}
                text=${option.text}
                title=${option.title} 
                icon=${getOptionsValue(option.options, 'icon')}
                iconTablet=${getOptionsValue(option.options, 'icon-tablet')}
                iconDesktop=${getOptionsValue(option.options, 'icon-desktop')}
                image=${getOptionsValue(option.options, 'image')}
                background=${background}
                options=${option.options}
                selected=${selectedCards[option.options] ? 'selected' : ''}
                disabled=${(countSelectedCards > 0 && !selectedCards[option.options] && countSelectedCards >= maxSelections) || mlInputUsed ? 'disabled' : ''}
                onClick=${onOptionClick(option)}
                />`)}
          </div>
          ${(index + visibleCount < options.data.length) && html`<button tabIndex="-1" onClick=${next} class="carousel-arrow-next ${isRTL ? 'rtl' : ''}"></button>`}
        </div>
    </div>`;
};
