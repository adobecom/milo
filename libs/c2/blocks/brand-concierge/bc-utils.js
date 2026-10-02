import { createTag } from '../../../utils/utils.js';
import { getAnalyticsLabel } from './bc-analytics.js';

export const submitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.6219 5.97354L8.41951 2.77588C8.18435 2.54072 7.80467 2.54229 7.57107 2.77588L4.37341 5.97354C4.13904 6.20791 4.13904 6.5876 4.37341 6.82198C4.4906 6.93916 4.64373 6.99776 4.79763 6.99776C4.95153 6.99776 5.10466 6.93917 5.22185 6.82198L7.40075 4.64307V12.6001C7.40075 12.9314 7.6695 13.2001 8.00075 13.2001C8.332 13.2001 8.60075 12.9314 8.60075 12.6001V4.65302L10.7734 6.82197C11.0086 7.05713 11.3882 7.05556 11.6218 6.82197C11.8562 6.58759 11.8562 6.20714 11.6219 5.97354Z"/></svg>';
export const aiIcon = (svgId, svgClass, svgTitle, svgSize = 16) => `<svg xmlns="http://www.w3.org/2000/svg" class="${svgClass}" ${svgTitle ? `title="${svgTitle}"` : ''} width="${svgSize}" height="${svgSize}" viewBox="0 0 20 20" fill="none">
  <path d="M10 3.3557C11.4765 3.3557 11.6779 3.15436 11.6779 1.67785C11.6779 0.201342 11.4765 0 10 0C8.52349 0 8.32215 0.201342 8.32215 1.67785C8.32215 3.15436 8.52349 3.3557 10 3.3557ZM1.67785 11.6779C3.15436 11.6779 3.3557 11.4765 3.3557 10C3.3557 8.52349 3.15436 8.32215 1.67785 8.32215C0.201342 8.32215 0 8.52349 0 10C0 11.4765 0.201342 11.6779 1.67785 11.6779ZM18.3221 11.6779C19.7987 11.6779 20 11.4765 20 10C20 8.52349 19.7987 8.32215 18.3221 8.32215C16.8456 8.32215 16.6443 8.52349 16.6443 10C16.6443 11.4765 16.8456 11.6779 18.3221 11.6779ZM10 20C11.4765 20 11.6779 19.7987 11.6779 18.3221C11.6779 16.8456 11.4765 16.6443 10 16.6443C8.52349 16.6443 8.32215 16.8456 8.32215 18.3221C8.32215 19.7987 8.52349 20 10 20ZM5.57047 16.085V15.302C5.57047 14.7204 5.83893 14.4743 6.26398 14.4743H7.04698C8.41163 14.4743 8.5906 14.2953 8.5906 12.9306C8.5906 11.566 8.41163 11.387 7.04698 11.387C5.68233 11.387 5.50336 11.566 5.50336 12.9306V13.7136C5.50336 14.34 5.25727 14.4072 4.67562 14.4072H3.89262C2.41611 14.4072 2.21477 14.6085 2.21477 16.085C2.21477 17.5615 2.41611 17.7629 3.89262 17.7629C5.36913 17.7629 5.57047 17.5615 5.57047 16.085ZM14.4072 3.93736V4.72036C14.4072 5.30201 14.1387 5.5481 13.7136 5.5481H12.9306C11.566 5.5481 11.387 5.72707 11.387 7.09172C11.387 8.45638 11.566 8.63535 12.9306 8.63535C14.2953 8.63535 14.4743 8.45638 14.4743 7.09172V6.30872C14.4743 5.68233 14.7204 5.61521 15.302 5.61521H16.085C17.5615 5.61521 17.7629 5.41387 17.7629 3.93736C17.7629 2.46085 17.5615 2.25951 16.085 2.25951C14.6085 2.25951 14.4072 2.46085 14.4072 3.93736ZM5.57047 3.93736C5.57047 2.46085 5.36913 2.25951 3.89262 2.25951C2.41611 2.25951 2.21477 2.46085 2.21477 3.93736C2.21477 5.41387 2.41611 5.61521 3.89262 5.61521H4.67562C5.25727 5.61521 5.50336 5.68233 5.50336 6.30872V7.09172C5.50336 8.45638 5.68233 8.63535 7.04698 8.63535C8.41163 8.63535 8.5906 8.45638 8.5906 7.09172C8.5906 5.72707 8.41163 5.5481 7.04698 5.5481H6.26398C5.83893 5.5481 5.57047 5.30201 5.57047 4.72036V3.93736ZM14.4072 16.085C14.4072 17.5615 14.6085 17.7629 16.085 17.7629C17.5615 17.7629 17.7629 17.5615 17.7629 16.085C17.7629 14.6085 17.5615 14.4072 16.085 14.4072H15.302C14.7204 14.4072 14.4743 14.34 14.4743 13.7136V12.9306C14.4743 11.566 14.2953 11.387 12.9306 11.387C11.566 11.387 11.387 11.566 11.387 12.9306C11.387 14.2953 11.566 14.4743 12.9306 14.4743H13.7136C14.1387 14.4743 14.4072 14.7204 14.4072 15.302V16.085Z" fill="#FF513D"/>
  <path d="M10 3.3557C11.4765 3.3557 11.6779 3.15436 11.6779 1.67785C11.6779 0.201342 11.4765 0 10 0C8.52349 0 8.32215 0.201342 8.32215 1.67785C8.32215 3.15436 8.52349 3.3557 10 3.3557ZM1.67785 11.6779C3.15436 11.6779 3.3557 11.4765 3.3557 10C3.3557 8.52349 3.15436 8.32215 1.67785 8.32215C0.201342 8.32215 0 8.52349 0 10C0 11.4765 0.201342 11.6779 1.67785 11.6779ZM18.3221 11.6779C19.7987 11.6779 20 11.4765 20 10C20 8.52349 19.7987 8.32215 18.3221 8.32215C16.8456 8.32215 16.6443 8.52349 16.6443 10C16.6443 11.4765 16.8456 11.6779 18.3221 11.6779ZM10 20C11.4765 20 11.6779 19.7987 11.6779 18.3221C11.6779 16.8456 11.4765 16.6443 10 16.6443C8.52349 16.6443 8.32215 16.8456 8.32215 18.3221C8.32215 19.7987 8.52349 20 10 20ZM5.57047 16.085V15.302C5.57047 14.7204 5.83893 14.4743 6.26398 14.4743H7.04698C8.41163 14.4743 8.5906 14.2953 8.5906 12.9306C8.5906 11.566 8.41163 11.387 7.04698 11.387C5.68233 11.387 5.50336 11.566 5.50336 12.9306V13.7136C5.50336 14.34 5.25727 14.4072 4.67562 14.4072H3.89262C2.41611 14.4072 2.21477 14.6085 2.21477 16.085C2.21477 17.5615 2.41611 17.7629 3.89262 17.7629C5.36913 17.7629 5.57047 17.5615 5.57047 16.085ZM14.4072 3.93736V4.72036C14.4072 5.30201 14.1387 5.5481 13.7136 5.5481H12.9306C11.566 5.5481 11.387 5.72707 11.387 7.09172C11.387 8.45638 11.566 8.63535 12.9306 8.63535C14.2953 8.63535 14.4743 8.45638 14.4743 7.09172V6.30872C14.4743 5.68233 14.7204 5.61521 15.302 5.61521H16.085C17.5615 5.61521 17.7629 5.41387 17.7629 3.93736C17.7629 2.46085 17.5615 2.25951 16.085 2.25951C14.6085 2.25951 14.4072 2.46085 14.4072 3.93736ZM5.57047 3.93736C5.57047 2.46085 5.36913 2.25951 3.89262 2.25951C2.41611 2.25951 2.21477 2.46085 2.21477 3.93736C2.21477 5.41387 2.41611 5.61521 3.89262 5.61521H4.67562C5.25727 5.61521 5.50336 5.68233 5.50336 6.30872V7.09172C5.50336 8.45638 5.68233 8.63535 7.04698 8.63535C8.41163 8.63535 8.5906 8.45638 8.5906 7.09172C8.5906 5.72707 8.41163 5.5481 7.04698 5.5481H6.26398C5.83893 5.5481 5.57047 5.30201 5.57047 4.72036V3.93736ZM14.4072 16.085C14.4072 17.5615 14.6085 17.7629 16.085 17.7629C17.5615 17.7629 17.7629 17.5615 17.7629 16.085C17.7629 14.6085 17.5615 14.4072 16.085 14.4072H15.302C14.7204 14.4072 14.4743 14.34 14.4743 13.7136V12.9306C14.4743 11.566 14.2953 11.387 12.9306 11.387C11.566 11.387 11.387 11.566 11.387 12.9306C11.387 14.2953 11.566 14.4743 12.9306 14.4743H13.7136C14.1387 14.4743 14.4072 14.7204 14.4072 15.302V16.085Z" fill="url(#${svgId})"/>
  <defs>
    <radialGradient id="${svgId}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.21429 1.78571) rotate(45) scale(18.6878 37.3756)">
      <stop offset="0.08" stop-color="#EC69FF"/>
      <stop offset="1" stop-color="#EC69FF" stop-opacity="0"/>
    </radialGradient>
  </defs>
</svg>`;

export const expandIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="expand-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.22432 8.77579C6.98995 8.54141 6.61026 8.54141 6.37588 8.77579L2.8001 12.3516V10.4059C2.8001 10.0746 2.53135 9.80587 2.2001 9.80587C1.86885 9.80587 1.6001 10.0746 1.6001 10.4059V13.8C1.6001 14.1313 1.86885 14.4 2.2001 14.4H5.59424C5.92549 14.4 6.19424 14.1313 6.19424 13.8C6.19424 13.4688 5.92549 13.2 5.59424 13.2H3.64854L7.22432 9.62423C7.4587 9.38985 7.4587 9.01016 7.22432 8.77579Z" fill="#292929"/>  <path d="M14.4001 2.20001V5.59415C14.4001 5.9254 14.1313 6.19415 13.8001 6.19415C13.4688 6.19415 13.2001 5.9254 13.2001 5.59415V3.64845L9.62431 7.22423C9.50713 7.34141 9.35361 7.40001 9.2001 7.40001C9.04658 7.40001 8.89306 7.34142 8.77588 7.22423C8.5415 6.98985 8.5415 6.61017 8.77588 6.37579L12.3517 2.80001H10.406C10.0747 2.80001 9.80596 2.53125 9.80596 2.20001C9.80596 1.86876 10.0747 1.60001 10.406 1.60001H13.8001C14.1314 1.60001 14.4001 1.86876 14.4001 2.20001Z" fill="#292929"/></svg>';

const chatLabelText = 'Ask';

const getTargetHeight = (target) => {
  const { marginBottom } = window.getComputedStyle(target);
  return target.scrollHeight + (parseFloat(marginBottom) * 2);
};

const BC_SESSION_COOKIE = 'kndctr_9E1005A551ED61CA0A490D45_AdobeOrg_bc_session_id';

export function hasChatCookie() {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i].trim();
    if (cookie.includes(BC_SESSION_COOKIE)) {
      return true;
    }
  }
  return false;
}

/** Get session ID used to correlate analytics events */
export function getChatSessionId() {
  const match = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${BC_SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(BC_SESSION_COOKIE.length + 1)) : '';
}

export function setCssGnavHeight() {
  const gnav = document.querySelector('header.global-navigation');
  const localGnav = document.querySelector('div.feds-localnav');
  const localNavStyle = localGnav ? getComputedStyle(localGnav) : null;
  const localNavOn = localGnav && localNavStyle ? localNavStyle.display !== 'none' : false;

  if (!gnav) return;
  const rootStyles = getComputedStyle(document.documentElement);
  const gnavHeight = Number(rootStyles.getPropertyValue('--global-height-nav').trim().slice(0, -2));
  const localNavHeight = Number(rootStyles.getPropertyValue('--feds-localnav-height').trim().slice(0, -2));
  const newHeight = gnavHeight + (localGnav && localNavOn ? localNavHeight : 0);
  document.documentElement.style.setProperty('--bc-gnav-height', `${newHeight}px`);
}

export function handleConsent(el) {
  if (!window.adobePrivacy) return;
  const cookieGrp = window.adobePrivacy.activeCookieGroups();
  if (!cookieGrp?.includes('C0002')) {
    el.classList.add('hide-block');
    window.lana?.log('Block hidden because user has not consented to cookies', { tags: 'brand-concierge' });
  }
}

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

export function floatingElement(targetEl, el, variants, focusableEl = null) {
  // handleScroll calls these unconditionally on most scroll frames; bail out
  // when the target is already in the requested state to avoid a style
  // recalc (classList + attribute writes) on every single rAF tick.
  const hideFloating = () => {
    if (targetEl.classList.contains('bc-floating-hidden')) return;
    if (focusableEl) {
      focusableEl.setAttribute('aria-hidden', 'true');
      focusableEl.setAttribute('tabindex', '-1');
      focusableEl.blur();
    }
    targetEl.classList.add('bc-floating-hidden');
    targetEl.classList.remove('bc-floating-show');
  };

  const showFloating = () => {
    if (targetEl.classList.contains('bc-floating-show')) return;
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

  let lastBottomPx = null;
  let lastSpacerCssText = null;
  const handleScroll = (target) => {
    // only values that need to be calculated on scroll are here, to optimize performance
    // scrollY is read once and reused below — re-reading it after the style writes further
    // down in this function would force a synchronous layout flush of those writes.
    const { scrollY } = window;
    const threshold = scrollY + window.innerHeight - mainTop;
    const topDelay = variants.floatingDelay ? variants.floatingDelayAmount : elHeight;
    const bottomValue = threshold - mainHeight;

    // if the spacer is not the last element in main, move it to the end
    if (mainElement.children[mainElement.children.length - 1] !== floatingSpacer) {
      mainElement.appendChild(floatingSpacer);
    }

    if (threshold > mainHeight) {
      if (lastBottomPx !== bottomValue) {
        target.style.bottom = `${bottomValue}px`;
        lastBottomPx = bottomValue;
      }
      if (variants.isFloatingAnchorHide || variants.floatingAnchorDelay) {
        hideFloating();
      } else {
        const spacerCssText = `height: ${targetHeight}px; pointer-events: none; display: block;`;
        if (lastSpacerCssText !== spacerCssText) {
          floatingSpacer.style.cssText = spacerCssText;
          lastSpacerCssText = spacerCssText;
        }
      }
    } else {
      showFloating();
      if (lastBottomPx !== 0) {
        target.style.bottom = '0';
        lastBottomPx = 0;
      }
    }
    if (hasDelay) {
      if (scrollY > topDelay && threshold <= mainHeight) {
        showFloating();
      }
      if (scrollY < topDelay
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

export function decorateMarqueeBackground(el, background) {
  const pictures = [...background.querySelectorAll('picture')];
  if (!pictures.length) {
    decorateBackground(el, background);
    return;
  }
  const backgroundLayer = createTag('div', { class: 'background' });
  if (pictures.length === 1) {
    backgroundLayer.append(pictures[0]);
  } else {
    const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
    pictures.forEach((picture, index) => {
      backgroundLayer.append(createTag('div', { class: viewports[index] || 'mobile-only' }, picture));
    });
  }
  el.prepend(backgroundLayer);
}

export function decorateHeader(el, header, { eyebrow: withEyebrow = false } = {}) {
  const headerSection = createTag('section', { class: 'bc-header' });

  const headings = header.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const useEyebrow = withEyebrow && headings.length > 1;
  const [eyebrow, title] = useEyebrow ? headings : [null, headings[0]];
  const subTitle = header.querySelector('p');

  if (eyebrow) {
    eyebrow.classList.add('bc-header-eyebrow');
    headerSection.append(eyebrow);
  }
  if (title) {
    title.classList.add('bc-header-title');
    headerSection.append(title);
  }
  if (subTitle) {
    subTitle.classList.add('bc-header-subtitle');
    headerSection.append(subTitle);
  }
  if (!eyebrow && !title && !subTitle) {
    headerSection.append(createTag('p', { class: 'bc-header-subtitle' }, header.textContent.trim()));
  }

  el.append(headerSection);
}

export function decorateCards(
  el,
  cards,
  promptEvents,
  analyticsType = 'inline',
) {
  const cardSection = createTag('section', { class: 'bc-prompt-cards' });
  const cardRows = cards.querySelectorAll(':scope > div');
  cardRows.forEach((card) => {
    const cardImage = card.querySelector('picture');
    const cardText = createTag('div', { class: 'prompt-card-text' }, `<p>${card.textContent.trim()}</p>`);
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
      promptEvents.handle(card.textContent.trim(), cardSection, event);
    });
    if (promptEvents?.down) {
      cardButton.addEventListener('mousedown', () => {
        promptEvents.down();
      });
    }
    if (promptEvents?.up) {
      cardButton.addEventListener('mouseup', () => {
        promptEvents.up();
      });
    }
  });

  el.append(cardSection);

  return cardSection;
}

export function decorateInput(el, input, inputEvents, iconPrefix = '') {
  const inputId = `bc-input-field-${Math.random().toString(36).substring(2, 9)}`;
  const fieldSection = createTag('section', { class: 'bc-input-field' });
  const fieldLabel = createTag('label', {
    for: inputId,
    class: 'bc-input-field-label',
    'aria-describedby': 'bc-label-tooltip',
    tabindex: 0,
  }, `${aiIcon(`${iconPrefix}ai-icon-input`, 'input-icon', chatLabelText, 20)}`);
  const fieldLabelToolTip = createTag('div', { id: 'bc-label-tooltip', class: 'bc-input-tooltip', role: 'tooltip' }, chatLabelText);

  fieldLabel.append(fieldLabelToolTip);

  const fieldInput = createTag('textarea', {
    id: inputId,
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

export function decorateFloatingButton(el, input, handleFloatingButton, variants) {
  const floatingButton = createTag('section', { class: 'bc-floating-button' });
  const floatingIcon = createTag('div', { class: 'bc-floating-icon' }, aiIcon('ai-icon-floating', 'floating-icon', chatLabelText, 20));
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
    handleFloatingButton(el);
  });

  floatingElement(floatingButton, el, variants, floatingContainer);
}

export function decorateFloatingInput(el, cards, input, floatingInputEvents, variants) {
  if (variants.isFloatingInputOnly) {
    el.classList.add('floating-input');
  }
  let pillVisibilityRaf;
  function updatePillVisibility(target) {
    const prompts = target.querySelector('.bc-prompt-cards');
    if (!prompts) return;

    const buttons = [...prompts.querySelectorAll('.prompt-card-button')];
    buttons.forEach((btn) => { btn.style.display = ''; });

    if (pillVisibilityRaf) cancelAnimationFrame(pillVisibilityRaf);
    pillVisibilityRaf = requestAnimationFrame(() => {
      pillVisibilityRaf = null;
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
  decorateInput(floatingInput, input, { handle: floatingInputEvents.inputHandle });
  decorateCards(floatingInput, cards, { handle: floatingInputEvents.cardHandle }, false);
  el.append(floatingInput);

  const updateLayout = () => updatePillVisibility(floatingInput);

  window.addEventListener('resize', updateLayout);
  updateLayout();
  floatingElement(floatingInput, el, variants, el.querySelector('.bc-input-field'));

  return floatingInput;
}
