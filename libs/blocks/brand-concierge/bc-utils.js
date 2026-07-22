import { createTag } from '../../utils/utils.js';
import { getAnalyticsLabel } from './bc-analytics.js';

export const submitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"></path></svg>';
export const aiIcon = (svgId, svgClass, svgTitle, svgSize = 16) => `<svg class="${svgClass}" ${svgTitle ? `title="${svgTitle}"` : ''} width="${svgSize}" height="${svgSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.91819 13.2491C9.69944 13.2491 9.47874 13.1924 9.27952 13.0772C8.79807 12.7989 8.55491 12.2471 8.67307 11.7041L9.40061 8.33011L7.08225 5.77249C6.7092 5.36038 6.64475 4.76077 6.92307 4.27933C7.20139 3.79691 7.75803 3.55374 8.29612 3.67288L11.6701 4.40042L14.2278 2.08206C14.6409 1.70706 15.2405 1.64554 15.7209 1.92288C16.2024 2.2012 16.4455 2.75296 16.3274 3.29593L15.5998 6.66995L17.9182 9.22757C18.2912 9.6387 18.3547 10.2383 18.0774 10.7198C17.7991 11.2002 17.2493 11.4453 16.7053 11.3282L13.3313 10.5987L10.7727 12.918C10.5315 13.1368 10.2258 13.2491 9.91819 13.2491ZM10.8918 8.53324L10.2873 11.333L12.4094 9.40921C12.7121 9.1348 13.1301 9.02151 13.5315 9.10745L16.3332 9.71292L14.4094 7.59085C14.134 7.28616 14.0217 6.86526 14.1096 6.46487L14.7131 3.66702L12.5911 5.59085C12.2864 5.86624 11.8664 5.97757 11.4651 5.89065L8.66722 5.28713L10.5911 7.4092C10.8664 7.71291 10.9787 8.13285 10.8918 8.53324Z" fill="url(#${svgId}-1)"/>
<path d="M3.34569 18.252C3.21678 18.252 3.08788 18.2188 2.97069 18.1514C2.68846 17.9883 2.54393 17.6622 2.61229 17.3438L2.91893 15.9258L1.94432 14.8516C1.72557 14.6104 1.68748 14.2549 1.85057 13.9727C2.01366 13.6905 2.34178 13.5498 2.65819 13.6143L4.07616 13.9209L5.15038 12.9463C5.39257 12.7266 5.74608 12.6895 6.02929 12.8526C6.31152 13.0157 6.45605 13.3418 6.38769 13.6602L6.08105 15.0782L7.05566 16.1524C7.27441 16.3936 7.3125 16.7491 7.14941 17.0313C6.98632 17.3135 6.65722 17.4522 6.34179 17.3897L4.92382 17.0831L3.8496 18.0577C3.708 18.1856 3.52733 18.252 3.34569 18.252Z" fill="url(#${svgId}-2)"/>
<defs>
  <linearGradient id="${svgId}-1" x1="6.75122" y1="1.75085" x2="19.2946" y2="3.03523" gradientUnits="userSpaceOnUse">
  <stop stop-color="#D73220"/>
  <stop offset="0.33" stop-color="#D92361"/>
  <stop offset="1" stop-color="#7155FA"/>
  </linearGradient>
  <linearGradient id="${svgId}-2" x1="1.75" y1="12.7517" x2="7.75027" y2="13.3661" gradientUnits="userSpaceOnUse">
  <stop stop-color="#D73220"/>
  <stop offset="0.33" stop-color="#D92361"/>
  <stop offset="1" stop-color="#7155FA"/>
  </linearGradient>
  </defs>
</svg>`;
export const expandIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="expand-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.22432 8.77579C6.98995 8.54141 6.61026 8.54141 6.37588 8.77579L2.8001 12.3516V10.4059C2.8001 10.0746 2.53135 9.80587 2.2001 9.80587C1.86885 9.80587 1.6001 10.0746 1.6001 10.4059V13.8C1.6001 14.1313 1.86885 14.4 2.2001 14.4H5.59424C5.92549 14.4 6.19424 14.1313 6.19424 13.8C6.19424 13.4688 5.92549 13.2 5.59424 13.2H3.64854L7.22432 9.62423C7.4587 9.38985 7.4587 9.01016 7.22432 8.77579Z" fill="#292929"/>  <path d="M14.4001 2.20001V5.59415C14.4001 5.9254 14.1313 6.19415 13.8001 6.19415C13.4688 6.19415 13.2001 5.9254 13.2001 5.59415V3.64845L9.62431 7.22423C9.50713 7.34141 9.35361 7.40001 9.2001 7.40001C9.04658 7.40001 8.89306 7.34142 8.77588 7.22423C8.5415 6.98985 8.5415 6.61017 8.77588 6.37579L12.3517 2.80001H10.406C10.0747 2.80001 9.80596 2.53125 9.80596 2.20001C9.80596 1.86876 10.0747 1.60001 10.406 1.60001H13.8001C14.1314 1.60001 14.4001 1.86876 14.4001 2.20001Z" fill="#292929"/></svg>';

const chatLabelText = 'Ask';
const variants = {};

const getTargetHeight = (target) => {
  const { marginBottom } = window.getComputedStyle(target);
  return target.scrollHeight + (parseFloat(marginBottom) * 2);
};

export function updateReplicatedValue(textareaWrapper, textarea) {
  if (!textareaWrapper || !textarea) return;
  textareaWrapper.dataset.replicatedValue = textarea.value || textarea.placeholder;
}

export function waitForCondition(checkFn, timeout = 5000, interval = 100) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const check = () => {
      if (checkFn()) {
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        resolve(false);
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}

export function floatingElement(targetEl, el, focusableEl = null) {
  const hideFloating = () => {
    if (focusableEl) {
      focusableEl.setAttribute('aria-hidden', 'true');
      focusableEl.setAttribute('tabindex', '-1');
      focusableEl.blur();
    }
    targetEl.classList.add('bc-floating-hidden');
    targetEl.classList.remove('bc-floating-show');
  };

  const showFloating = () => {
    if (focusableEl) {
      focusableEl.removeAttribute('aria-hidden');
      focusableEl.removeAttribute('tabindex');
    }
    targetEl.classList.remove('bc-floating-hidden');
    targetEl.classList.add('bc-floating-show');
  };

  const mainElement = document.querySelector('main');
  const mainTop = mainElement.offsetTop;
  const hasDelay = variants.isHero || variants.floatingDelay || variants.floatingAnchorDelay;
  const anchorDelay = variants.floatingAnchorDelay ? variants.floatingAnchorDelayAmount : 0;
  let mainHeight = mainElement.scrollHeight;
  let targetHeight = getTargetHeight(targetEl);
  let elHeight = el.scrollHeight;

  const floatingSpacer = createTag('div', { class: 'bc-spacer' });
  floatingSpacer.style.cssText = 'height:0; pointer-events:none;';
  mainElement.appendChild(floatingSpacer);

  targetEl.classList.add('bc-floating-element');

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const size = Math.floor(entry.borderBoxSize?.[0]?.blockSize);
      switch (entry.target) {
        case el: elHeight = size ?? el.scrollHeight; break;
        case mainElement: mainHeight = size ?? mainElement.scrollHeight; break;
        case targetEl: targetHeight = getTargetHeight(targetEl); break;
        default: break;
      }
    }
  });
  ro.observe(el);
  ro.observe(mainElement);
  ro.observe(targetEl);

  if (variants.isHero || variants.floatingDelay) {
    hideFloating();
  }

  const handleScroll = (target) => {
    // only values that need to be calculated on scroll are here, to optimize performance
    const threshold = window.scrollY + window.innerHeight - mainTop;
    const topDelay = variants.floatingDelay ? variants.floatingDelayAmount : elHeight;
    const bottomValue = threshold - mainHeight;

    // if the spacer is not the last element in main, move it to the end
    if (mainElement.children[mainElement.children.length - 1] !== floatingSpacer) {
      mainElement.appendChild(floatingSpacer);
    }

    if (threshold > mainHeight) {
      target.style.bottom = `${bottomValue}px`;
      if (variants.isFloatingAnchorHide || variants.floatingAnchorDelay) {
        hideFloating();
      } else {
        floatingSpacer.style.cssText = `height: ${targetHeight}px; pointer-events: none;`;
      }
    } else {
      showFloating();
      target.style.bottom = '0';
    }
    if (hasDelay) {
      if (window.scrollY > topDelay && threshold <= mainHeight) {
        showFloating();
      }
      if (window.scrollY < topDelay
        || (variants.floatingAnchorDelay && threshold > mainHeight - anchorDelay)) {
        hideFloating();
      }
    }
  };

  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      handleScroll(targetEl);
      scrollPending = false;
    });
  }, { passive: true });

  return floatingSpacer;
}

export function getBetaLabel() {
  return createTag('span', { class: 'bc-beta-label' }, 'Beta');
}

export function decorateBackground(el, background) {
  const bgValue = background.textContent.trim();
  if (bgValue) {
    el.classList.add('has-bg-color');
    el.style.setProperty('--brand-concierge-bg', bgValue);
  } else {
    const bgImage = background.querySelector('img');
    if (bgImage) {
      // remove query string to prevent blurry images.
      const rawImage = bgImage.src.slice(0, bgImage.src.indexOf('?'));
      el.classList.add('has-bg-image');
      el.style.setProperty('--brand-concierge-bg', `url(${rawImage})`);
    }
  }
}

export function decorateHeader(el, header) {
  const hTag = header.querySelector('h1, h2, h3, h4, h5, h6');
  const subTitle = header.querySelector('p');
  const headerSection = createTag('section', { class: 'bc-header' });

  if (hTag) {
    hTag.classList.add('bc-header-title');
    headerSection.append(hTag);
  }
  if (subTitle) {
    subTitle.classList.add('bc-header-subtitle');
    headerSection.append(subTitle);
  }
  if (!hTag && !subTitle) {
    headerSection.append(createTag('p', { class: 'bc-header-subtitle' }, header.textContent.trim()));
  }

  el.append(headerSection);

  return headerSection;
}

export function decorateCards(
  el,
  cards,
  promptEvents,
  iconPrefix = '',
  analyticsType = 'inline',
) {
  const cardSection = createTag('section', { class: 'bc-prompt-cards' });
  const cardRows = cards.querySelectorAll(':scope > div');
  cardRows.forEach((card, index) => {
    const cardImage = card.querySelector('picture');
    const cardText = createTag('div', { class: 'prompt-card-text' }, `${aiIcon(`${iconPrefix}card-icon-${index + 1}`, 'card-icon', null, 16)} <p>${card.textContent.trim()}</p>`);
    const cardButton = createTag('button', {
      class: 'prompt-card-button no-track',
      'daa-ll': getAnalyticsLabel(`1|BC-suggested_prompt_clicked|${analyticsType}|${cardText.textContent.trim()}`),
      'aria-label': cardText.textContent.trim(),
    });
    if (cardImage) {
      cardButton.append(cardImage);
      cardImage.classList.add('prompt-card-image');
    }
    if (card.textContent !== '') cardButton.append(cardText);
    cardSection.append(cardButton);

    cardButton.addEventListener('click', (event) => {
      const input = el.querySelector('.bc-input-field textarea');

      input.value = cardText.textContent.trim();
      // openChatModal(input.value, el);
      promptEvents.handle(input.value, cardSection, event);
    });
    if (promptEvents.down) {
      cardButton.addEventListener('mousedown', () => {
        promptEvents.down();
      });
    }
    if (promptEvents.up) {
      cardButton.addEventListener('mouseup', () => {
        promptEvents.up();
      });
    }
  });

  el.append(cardSection);

  return cardSection;
}

export function decorateInput(el, input, inputEvents, iconPrefix = '') {
  const fieldSection = createTag('section', { class: 'bc-input-field' });
  const fieldLabel = createTag('label', {
    for: 'bc-input-field',
    class: 'bc-input-field-label',
    'aria-describedby': 'bc-label-tooltip',
    tabindex: 0,
  }, `${aiIcon(`${iconPrefix}ai-icon-input`, 'input-icon', chatLabelText, 20)}`);
  const fieldLabelToolTip = createTag('div', { id: 'bc-label-tooltip', class: 'bc-input-tooltip', role: 'tooltip' }, chatLabelText);

  fieldLabel.append(fieldLabelToolTip);

  const fieldInput = createTag('textarea', {
    id: 'bc-input-field',
    rows: 1,
    placeholder: input.textContent.trim(),
  });
  const fieldButton = createTag('button', {
    class: 'input-field-button no-track',
    disabled: true,
    'aria-label': 'Send Message',
    'daa-ll': getAnalyticsLabel('1'),
  }, submitIcon);
  const textareaWrapper = createTag('div', { class: 'bc-textarea-grow-wrap' }, fieldInput);
  const fieldContainer = createTag('div', { class: 'bc-input-field-container' }, [fieldLabel, fieldLabelToolTip, textareaWrapper, fieldButton]);

  fieldSection.append(fieldContainer);
  el.append(fieldSection);
  updateReplicatedValue(textareaWrapper, fieldInput);

  fieldInput.addEventListener('input', () => {
    if (fieldInput.value && fieldInput.value.trim() !== '') {
      fieldButton.disabled = false;
    } else {
      fieldButton.disabled = true;
    }
    updateReplicatedValue(textareaWrapper, fieldInput);
  });

  fieldInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fieldButton.click();
    }
  });

  fieldButton.addEventListener('click', (event) => {
    if (!fieldInput.value || fieldInput.value.trim() === '') return;
    // openChatModal(fieldInput.value, el);
    inputEvents.handle(fieldInput.value, fieldSection, event);
  });

  return fieldSection;
}

export function decorateLegal(el, legal) {
  const legalSection = createTag('section', { class: 'bc-legal' });
  const legalContent = createTag('p', {}, legal.querySelector('div').innerHTML);
  legalSection.append(legalContent);
  el.append(legalSection);

  return legalSection;
}

export function decorateFloatingButton(el, input, handleFloatingButton, iconPrefix = '') {
  const floatingButton = createTag('section', { class: 'bc-floating-button' });
  const floatingIcon = createTag('div', { class: 'bc-floating-icon' }, aiIcon(`${iconPrefix}ai-icon-floating`, 'floating-icon', chatLabelText, 20));
  const floatingInput = createTag('div', { class: 'bc-floating-input' }, input.textContent);
  const floatingSubmit = createTag('div', { class: 'bc-floating-submit' }, submitIcon);
  const floatingContainer = createTag('button', { class: 'bc-floating-button-container no-track', 'daa-ll': getAnalyticsLabel('floating-bc') }, [floatingIcon, floatingInput, floatingSubmit]);

  floatingButton.append(floatingContainer);
  el.append(floatingButton);

  floatingButton.addEventListener('click', () => {
    // debounce the click to prevent double opening of the modal
    floatingButton.classList.add('active');
    const cleanup = setTimeout(() => {
      floatingButton.classList.remove('active');
      clearTimeout(cleanup);
    }, 500);
    // openChatModal(null, el);
    handleFloatingButton(el);
  });

  const floater = floatingElement(floatingButton, el, floatingContainer);

  return { float: floatingButton, spacer: floater };
}

export function decorateFloatingInput(el, cards, input) {
  if (variants.isFloatingInputOnly) {
    el.classList.add('floating-input');
  }
  function updatePillVisibility(target) {
    const prompts = target.querySelector('.bc-prompt-cards');
    if (!prompts) return;

    const buttons = [...prompts.querySelectorAll('.prompt-card-button')];
    buttons.forEach((btn) => { btn.style.display = ''; });

    requestAnimationFrame(() => {
      const { left: containerLeft, right: containerRight } = prompts.getBoundingClientRect();

      buttons.forEach((btn) => {
        const { left, right } = btn.getBoundingClientRect();

        if (right > containerRight || left < containerLeft) {
          btn.style.display = 'none';
        }
      });
    });
  }

  const floatingInput = createTag('section', { class: 'bc-floating-input' });
  decorateInput(floatingInput, input);
  decorateCards(floatingInput, cards);
  el.append(floatingInput);

  const updateLayout = () => {
    updatePillVisibility(floatingInput);
  };

  window.addEventListener('resize', updateLayout);
  requestAnimationFrame(updateLayout);
  floatingElement(floatingInput, el, el.querySelector('.bc-input-field'));

  return floatingInput;
}
