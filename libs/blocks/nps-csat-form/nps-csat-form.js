/* eslint no-use-before-define:0 */
/* eslint no-multi-spaces:0 */
/* eslint object-curly-newline: 0 */
// type Form = {
//   title: string;
//   radioGroupLabel: string;
//   radioGroup: string[];
//   feedBackLabel: string;
//   contactMeString: string;
// }

import { getConfig, loadMartech } from '../../utils/utils.js';

/** Escapes strings for safe insertion into HTML text or double-quoted attributes. */
const escapeHtml = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const SURVEY_VERSION = '0.0.1';
const RTL_LANG_PREFIXES = ['ar', 'he', 'fa', 'ur'];
const NPS_DIGIT_BUFFER_TIMEOUT = 500;

// ############################################
// NPS Picker Web Component
// ############################################

let npsPickerIdCounter = 0;

class NpsPicker extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized === 'true') return;
    this.dataset.initialized = 'true';

    const options = Array.from(this.querySelectorAll('nps-picker-option')).map((option) => ({
      value: option.getAttribute('value') ?? '',
      text: option.textContent?.trim() ?? '',
    }));

    const uid = `nps-popover-${npsPickerIdCounter}`;
    npsPickerIdCounter += 1;
    const placeholder = this.getAttribute('placeholder') ?? 'Select an option';
    const labelledby = this.getAttribute('aria-labelledby') ?? '';
    const items = options
      .map((option, index) => `
        <div
          class="nps-popover-item"
          role="option"
          data-value="${escapeHtml(option.value)}"
          tabindex="${index === 0 ? '0' : '-1'}"
          aria-selected="false"
        >${escapeHtml(option.text)}</div>
      `).join('');

    this.innerHTML = `
      <button
        type="button"
        class="nps-picker-trigger"
        popovertarget="${uid}"
        aria-haspopup="listbox"
        aria-expanded="false"
        ${labelledby ? `aria-labelledby="${escapeHtml(labelledby)}"` : ''}
      >
        <span class="nps-picker-label">${escapeHtml(placeholder)}</span>
        <span class="nps-picker-chevron" aria-hidden="true"></span>
      </button>
      <div id="${uid}" class="nps-popover" popover="auto" role="listbox" ${labelledby ? `aria-labelledby="${escapeHtml(labelledby)}"` : ''}>
        ${items}
      </div>
      <input type="hidden" name="feedback" value="" ${this.hasAttribute('required') ? 'required' : ''} />
    `;

    this.#trigger = this.querySelector('.nps-picker-trigger');
    this.#label = this.querySelector('.nps-picker-label');
    this.#popover = this.querySelector('.nps-popover');
    this.#hiddenInput = this.querySelector('input[type="hidden"][name="feedback"]');
    this.#items = Array.from(this.querySelectorAll('.nps-popover-item'));
    this.#placeholder = placeholder;
    this.#supportsPopoverApi = typeof this.#popover.showPopover === 'function' && typeof this.#popover.hidePopover === 'function';
    if (!this.#supportsPopoverApi) {
      this.#popover.hidden = true;
    }

    this.#trigger.addEventListener('click', (event) => {
      if (this.#supportsPopoverApi) return;
      event.preventDefault();
      if (this.#popover.hidden) {
        this.#openPopover();
      } else {
        this.#closePopover();
      }
    });
    this.#trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && this.#isPopoverOpen()) {
        this.#closePopover();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        if (this.#isPopoverOpen()) {
          this.#focusSelectedItemOrFallback(0);
        } else {
          this.#focusItemOnOpenIndex = 0;
          this.#openPopover();
        }
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.#isPopoverOpen()) {
          this.#focusSelectedItemOrFallback(0);
        } else {
          this.#focusItemOnOpenIndex = 0;
          this.#openPopover();
        }
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.#isPopoverOpen()) {
          this.#focusSelectedItemOrFallback(this.#items.length - 1);
        } else {
          this.#focusItemOnOpenIndex = this.#items.length - 1;
          this.#openPopover();
        }
      }
    });

    this.#items.forEach((item) => {
      item.addEventListener('click', () => {
        this.#selectItem(item);
        this.#closePopover();
      });
      item.addEventListener('keydown', (event) => this.#onItemKeydown(event, item));
    });

    this.addEventListener('focusout', (event) => this.#onFocusOut(event));

    this.#popover.addEventListener('toggle', (event) => {
      const isOpen = event.newState === 'open';
      this.#trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        this.#positionPopover();
        this.#attachPopoverResize();
        if (Number.isInteger(this.#focusItemOnOpenIndex)) {
          const focusIndex = this.#focusItemOnOpenIndex;
          this.#focusItemOnOpenIndex = null;
          queueMicrotask(() => {
            if (this.#isPopoverOpen()) {
              this.#focusSelectedItemOrFallback(focusIndex);
            }
          });
        }
      } else {
        this.#focusItemOnOpenIndex = null;
        this.#detachPopoverResize();
      }
    });
  }

  get value() {
    return this.#hiddenInput?.value ?? '';
  }

  set value(nextValue) {
    const value = `${nextValue ?? ''}`;
    if (!value) {
      this.#hiddenInput.value = '';
      this.#label.textContent = this.#placeholder;
      this.#items.forEach((item, index) => {
        item.setAttribute('aria-selected', 'false');
        item.tabIndex = index === 0 ? 0 : -1;
      });
      return;
    }
    const selectedItem = this.#items.find((item) => item.dataset.value === value);
    if (selectedItem) this.#selectItem(selectedItem);
  }

  #trigger;

  #label;

  #popover;

  #hiddenInput;

  #items = [];

  #placeholder = '';

  #supportsPopoverApi = false;

  #outsideClickHandler = null;

  #escapeHandler = null;

  #popoverResizeHandler = null;

  #focusItemOnOpenIndex = null;

  #focusSelectedItemOrFallback(fallbackIndex) {
    const selectedItem = this.#items.find((item) => item.getAttribute('aria-selected') === 'true');
    const clampedIndex = Math.max(0, Math.min(fallbackIndex, this.#items.length - 1));
    const fallbackItem = this.#items[clampedIndex];
    (selectedItem ?? fallbackItem)?.focus();
  }

  #focusNextElementAfterTrigger() {
    const focusRoot = this.closest('form') ?? document;
    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(focusRoot.querySelectorAll(focusableSelector))
      .filter((element) => element === this.#trigger || !this.contains(element));
    const triggerIndex = focusableElements.indexOf(this.#trigger);
    focusableElements[triggerIndex + 1]?.focus();
  }

  #openPopover() {
    if (this.#supportsPopoverApi && typeof this.#popover.showPopover === 'function') {
      if (!this.#popover.matches(':popover-open')) {
        this.#popover.showPopover();
      }
      return;
    }
    if (this.#popover.hidden) {
      this.#openFallbackPopover();
    }
  }

  #isPopoverOpen() {
    if (this.#supportsPopoverApi && typeof this.#popover.matches === 'function') {
      return this.#popover.matches(':popover-open');
    }
    return !this.#popover.hidden;
  }

  #onFocusOut(event) {
    if (!this.#isPopoverOpen()) return;

    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.contains(nextTarget)) return;

    queueMicrotask(() => {
      const { activeElement } = document;
      if (activeElement instanceof Node && this.contains(activeElement)) return;
      this.#closePopover();
    });
  }

  #detachPopoverResize() {
    if (!this.#popoverResizeHandler) return;
    window.removeEventListener('resize', this.#popoverResizeHandler);
    this.#popoverResizeHandler = null;
  }

  #attachPopoverResize() {
    this.#detachPopoverResize();
    this.#popoverResizeHandler = () => this.#positionPopover();
    window.addEventListener('resize', this.#popoverResizeHandler);
  }

  #onItemKeydown(event, item) {
    const index = this.#items.indexOf(item);
    if (index === -1) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      this.#closePopover();
      if (event.shiftKey) {
        this.#trigger.focus();
      } else {
        this.#focusNextElementAfterTrigger();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = this.#items[(index + 1) % this.#items.length];
      next.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = this.#items[(index - 1 + this.#items.length) % this.#items.length];
      prev.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#selectItem(item);
      this.#closePopover();
    }
  }

  #selectItem(item) {
    const selectedValue = item.dataset.value ?? '';
    this.#hiddenInput.value = selectedValue;
    this.#label.textContent = item.textContent?.trim() ?? this.#placeholder;

    this.#items.forEach((option) => {
      const isSelected = option === item;
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      option.tabIndex = isSelected ? 0 : -1;
    });

    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #closePopover() {
    if (this.#supportsPopoverApi && typeof this.#popover.hidePopover === 'function') {
      if (this.#popover.matches(':popover-open')) {
        this.#detachPopoverResize();
        this.#popover.hidePopover();
      } else {
        this.#trigger.setAttribute('aria-expanded', 'false');
      }
      return;
    }
    this.#detachPopoverResize();
    this.#popover.hidden = true;
    this.#trigger.setAttribute('aria-expanded', 'false');
    if (this.#outsideClickHandler) {
      document.removeEventListener('mousedown', this.#outsideClickHandler);
      this.#outsideClickHandler = null;
    }
    if (this.#escapeHandler) {
      document.removeEventListener('keydown', this.#escapeHandler);
      this.#escapeHandler = null;
    }
  }

  #openFallbackPopover() {
    this.#popover.hidden = false;
    this.#trigger.setAttribute('aria-expanded', 'true');
    this.#positionPopover();
    this.#attachPopoverResize();
    this.#outsideClickHandler = (event) => {
      if (!this.contains(event.target)) {
        this.#closePopover();
      }
    };
    this.#escapeHandler = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.#closePopover();
      }
    };
    document.addEventListener('mousedown', this.#outsideClickHandler);
    document.addEventListener('keydown', this.#escapeHandler);
  }

  #positionPopover() {
    const triggerBox = this.#trigger.getBoundingClientRect();
    const popoverOffset = 4;
    const viewportPadding = 16;
    const availableBelow = Math.floor(
      window.innerHeight - (triggerBox.bottom + popoverOffset) - viewportPadding,
    );
    const constrainedHeight = Math.max(0, availableBelow);

    this.#popover.style.width = `${triggerBox.width}px`;
    this.#popover.style.top = `${triggerBox.bottom + window.scrollY + popoverOffset}px`;
    this.#popover.style.maxHeight = `${constrainedHeight}px`;
    this.#popover.style.overflowY = 'auto';
    const isRtl = this.closest('[dir="rtl"]') !== null;
    if (isRtl) {
      this.#popover.style.left = `${triggerBox.right + window.scrollX - triggerBox.width}px`;
    } else {
      this.#popover.style.left = `${triggerBox.left + window.scrollX}px`;
    }
  }
}

if (!customElements.get('nps-picker')) {
  customElements.define('nps-picker', NpsPicker);
}

// ############################################
// HTML
// ############################################

const buildForm = ({
  title,
  radioGroupLabel,
  radioGroup,
  npsOptions,
  feedbackLabel,
  textboxPlaceholder,
  contactMeString,
  cancelText,
  submitText,
  errorText,
  displayCross,
}) => `
  <form id="nps" novalidate>
    ${displayCross ? '<button type="button" class="nps-close" aria-label="Close">&times;</button>' : ''}
    <h2>${escapeHtml(title)}</h2>
    <fieldset class="nps-radio-group" aria-required="true" aria-describedby="feedback-error">
      <legend id="nps-question-label">${escapeHtml(radioGroupLabel)} *</legend>
      <div class="radio-options">
        ${options(radioGroup, npsOptions)}
      </div>
      <div class="error-message" id="feedback-error" aria-live="polite" aria-hidden="true">
        <span class="error-icon">⚠</span>
        <span class="error-text">${escapeHtml(errorText)}</span>
      </div>
    </fieldset>
    <fieldset class="nps-feedback-area">
      <legend>${escapeHtml(feedbackLabel)}</legend>
      <textarea
        id="explanation-input"
        name="explanation"
        placeholder="${escapeHtml(textboxPlaceholder)}"
        aria-label="${escapeHtml(feedbackLabel)}"
        rows="4"
      ></textarea>
    </fieldset>
    <fieldset class="nps-checkbox-area">
      <label for="contact-me">
        <input
          type="checkbox"
          id="contact-me"
          name="contact-me"
        />
        ${escapeHtml(contactMeString)}
      </label>
    </fieldset>
    <fieldset class="nps-submit-area">
      <button type="button" aria-label="Cancel" class="nps-cancel">${escapeHtml(cancelText)}</button>
      <button type="submit" aria-label="Submit" class="nps-submit">${escapeHtml(submitText)}</button>
    </fieldset>
  </form>
  `;

const options = (radioGroup, npsOptions) => {
  if (npsOptions) {
    const {
      defaultSelectOption,
      scoreOptions,
    } = npsOptions;
    const highestOption = scoreOptions[0];
    const lowestOption = scoreOptions[scoreOptions.length - 1];
    return `
      <div class="desktop-nps-radio">
         <span class="nps-scale-label nps-scale-label--low">${escapeHtml(lowestOption?.label ?? '')}</span>
         <div class="radio-options">
           ${scoreOptions.slice().reverse().map((scoreOption) => `
             <div class="radio-item">
               <label for="nps-${escapeHtml(scoreOption.value)}"><span>${escapeHtml(scoreOption.display)}</span></label>
               <input
                 type="radio"
                 id="nps-${escapeHtml(scoreOption.value)}"
                 name="feedback"
                 value="${escapeHtml(scoreOption.value)}"
                 data-display="${escapeHtml(scoreOption.display)}"
                 required
               />
             </div>
           `).join('')}
         </div>
         <span class="nps-scale-label nps-scale-label--high">${escapeHtml(highestOption?.label ?? '')}</span>
      </div>
      <div class="mobile-nps-select">
        <nps-picker class="nps-picker" placeholder="${escapeHtml(defaultSelectOption)}" aria-labelledby="nps-question-label" required>
          ${scoreOptions.map((scoreOption) => `<nps-picker-option value="${escapeHtml(scoreOption.value)}">${escapeHtml(scoreOption.label ? `${scoreOption.display} – ${scoreOption.label}` : scoreOption.display)}</nps-picker-option>`).join('')}
        </nps-picker>
      </div>
    `;
  }
  return radioGroup.map(radio).join('');
};

const radio = (label) => {
  const id = createIdForLabel(label);
  return `
  <div class="radio-item">
    <label for="${escapeHtml(id)}"><span>${escapeHtml(label)}</span></label>
    <input
      type="radio"
      id="${escapeHtml(id)}"
      name="feedback"
      value="${escapeHtml(id)}"
      required
    />
  </div>
  `;
};

const createIdForLabel = (label) => label
  .toLowerCase()
  .replaceAll(/\s/g, '-');

const cancelActions = (() => {
  let cancelActionsDone = false;
  return () => {
    if (cancelActionsDone) return;
    cancelActionsDone = true;
    const d = {
      score: -1,
      feedback: null,
      contactMe: false,
    };
    const isNPSForm = !!document.querySelector('form#nps nps-picker.nps-picker');
    const surveyType = isNPSForm ? 'NPS' : 'CSAT 5pt';
    const dataObj = buildDataObject(d, surveyType, CancelSurvey);
    window._satellite?.track?.('event', dataObj) // eslint-disable-line
  };
})();

// ############################################
// Keyboard Accessibility
// ############################################

const initKeyboardAccessibility = (form, sendMessage) => {
  const radioButtons = Array.from(form.querySelectorAll('input[type="radio"][name="feedback"]'));
  const checkbox = form.querySelector('#contact-me');
  const npsRadioButtons = Array.from(form.querySelectorAll('.desktop-nps-radio input[type="radio"][name="feedback"]'));
  const isElevenPointForm = !!form.closest('.nps-csat-form.eleven-point-nps');
  let npsDigitBuffer = '';
  let npsDigitBufferTimeout;

  const onElevenPointFormEnterCapture = (event) => {
    if (event.key !== 'Enter') return;
    const { target } = event;
    if (target instanceof HTMLTextAreaElement) return;
    if (target instanceof HTMLButtonElement && target.type === 'submit') return;
    if (target instanceof HTMLButtonElement && target.type === 'button') return;
    if (target instanceof HTMLElement && target.classList.contains('nps-popover-item')) return;

    if (target instanceof HTMLInputElement && target.type === 'radio' && target.name === 'feedback') {
      event.preventDefault();
      if (!target.checked) {
        target.checked = true;
        target.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    if (target instanceof HTMLInputElement && target.type === 'checkbox' && target.id === 'contact-me') {
      event.preventDefault();
      target.checked = !target.checked;
    }
  };

  const getTargetIndex = (key, index) => {
    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        return (index + 1) % radioButtons.length;
      case 'ArrowLeft':
      case 'ArrowDown':
        return (index - 1 + radioButtons.length) % radioButtons.length;
      default:
        return -1;
    }
  };

  radioButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      const targetIndex = getTargetIndex(e.key, index);
      if (targetIndex === -1) return;
      e.preventDefault();
      const targetRadio = radioButtons[targetIndex];
      targetRadio.focus();
      if (!isElevenPointForm) {
        targetRadio.checked = true;
        targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    if (!isElevenPointForm) {
      button.addEventListener('focus', () => {
        if (!button.checked) {
          button.checked = true;
          button.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  });

  if (checkbox) {
    checkbox.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  if (isElevenPointForm) {
    form.addEventListener('keydown', onElevenPointFormEnterCapture, true);
  }

  form.addEventListener('keydown', (e) => {
    if (
      isElevenPointForm
      && /^\d$/.test(e.key)
      && !(e.target instanceof HTMLTextAreaElement)
      && !(e.target instanceof HTMLInputElement && e.target.type !== 'radio')
    ) {
      clearTimeout(npsDigitBufferTimeout);
      npsDigitBuffer = `${npsDigitBuffer}${e.key}`.slice(-2);

      const candidateDisplays = npsDigitBuffer === '10' ? ['10'] : [e.key];
      const targetRadio = npsRadioButtons
        .find((inputEl) => candidateDisplays.includes(inputEl.dataset.display));
      if (targetRadio) {
        e.preventDefault();
        targetRadio.checked = true;
        targetRadio.focus();
        targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
      }

      npsDigitBufferTimeout = setTimeout(() => {
        npsDigitBuffer = '';
      }, NPS_DIGIT_BUFFER_TIMEOUT);
      return;
    }

    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      cancelActions();
      sendMessage(CANCEL);
    }
  });

  return () => {
    clearTimeout(npsDigitBufferTimeout);
    if (isElevenPointForm) {
      form.removeEventListener('keydown', onElevenPointFormEnterCapture, true);
    }
  };
};

// ############################################
// Marshalling Data
// ############################################

const SubmitSurvey = 'submitSurvey';
const CancelSurvey = 'cancelSurvey';

const buildDataObject = (formData, surveyType, eventType) => {
  const searchParams = new URLSearchParams(window.location.search);
  const data = {
    web: {
      webInteraction: {
        name: eventType,
      },
    },
    _adobe_corpnew: {
      digitalData: {
        primaryUser: {
          primaryProfile: {
            profileInfo: {
              fullProfileID: searchParams.get('source_user_guid'),
              fullAuthID: searchParams.get('source_user_guid'),
            },
          },
        },
        primaryEvent: {
          eventInfo: {
            eventName: eventType,
          },
        },
      },
      evolved_survey: {
        sourceUserGuid: searchParams.get('source_user_guid'),
        sourceName: searchParams.get('source_name'),
        sourceVersion: searchParams.get('source_version'),
        sourceLocale: searchParams.get('source_locale'),
        sourcePlatform: searchParams.get('source_platform'),
        userAgent: searchParams.get('source_user_agent'),
        sourceBuild: searchParams.get('source_build'),
        sourceAppCode: searchParams.get('source_app_code'),
        sourceOsVersion: searchParams.get('source_os_version'),
        sourceDevice: searchParams.get('source_device'),
        sourceColorTheme: searchParams.get('source_color_theme'),
        surveyName: window.location.pathname,
        surveyType,
        surveyVersion: SURVEY_VERSION,
        surveyScore: formData.score,
        collectionSurface: null,
        surveyFeedback: formData.feedback,
        adobeCanContact: formData.contactMe,
        doNotShow: false,
      },
    },
  };
  return {
    xdm: {
      identityMap: {
        adobeGUID: [{
          id: searchParams.get('source_user_guid'),
          authenticatedState: 'authenticated',
          primary: true,
        }],
      },
    },
    data,
  };
};

// ############################################
// Messages
// ############################################

const Ready        = 'Ready';
const Acknowledged = 'Acknowledged';
const Cancel       = 'Cancel';
const Submit       = 'Submit';
const ErrorMsg     = 'Error';

export const READY  = { type: Ready };
export const ACK    = { type: Acknowledged };
export const CANCEL = { type: Cancel };
export const ERROR  = (errorType) => (eventData, errorMessage) => ({
  type: ErrorMsg,
  errorType,
  message: {
    eventData,
    errorMessage,
  },
});
const MISSING_TYPE_ERROR      = ERROR('missingType');
const UNEXPECTED_TYPE_ERROR   = ERROR('unexpectedType');
const UNRECOGNIZED_TYPE_ERROR = ERROR('unrecognizedType');
const TIMEOUT_ERROR           = ERROR('timeoutErr');
const MALFORMED_JSON_ERROR    = ERROR('malformedJSON');
const MARTECH_LOAD_FAILED     = ERROR('martechLoadFailed');
export const SUBMIT = (data) => ({
  type: Submit,
  data,
});
export const MSG_TIMEOUT = 1000;

const STATE_BASE = 0;
const STATE_EXPECT_ACK = 1;

const initMessageClient = (registerCleanup = () => {}) => {
  let state = STATE_BASE;
  let timeout;

  const clearAckTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  const sendMessage = (() => {
    const parent = typeof window.uxpHost?.postMessage === 'function'
      ? window.uxpHost
      : window.parent;
    if (parent === window) {
      console.warn('No parent document found'); // eslint-disable-line
    }
    return (obj) => {
      switch (obj?.type) {
        case Cancel:
        case Ready: {
          state = STATE_EXPECT_ACK;
          clearAckTimeout();
          timeout = setTimeout(() => {
            sendMessage(TIMEOUT_ERROR(null, 'Timed out waiting for "Acknowledged"'));
            state = STATE_BASE;
            timeout = undefined;
          }, MSG_TIMEOUT);
          break;
        }
        case Acknowledged:
          break;
        case Submit:
          break;
        case ErrorMsg:
          break;
        default:
          break;
      }
      const message = JSON.stringify(obj);
      parent.postMessage(message, '*');
    };
  })();

  const onMessage = (event) => {
    if (typeof event.data !== 'string') {
      return;
    }

    const message = (() => {
      try {
        return JSON.parse(event.data);
      } catch (e) {
        return e;
      }
    })();
    if (message instanceof Error) {
      sendMessage(MALFORMED_JSON_ERROR(event.data, message));
      return;
    }
    if (!message.type) {
      sendMessage(MISSING_TYPE_ERROR(message, 'Message is missing the type property'));
      return;
    }
    switch (message.type) {
      case Cancel:
        if (state === STATE_EXPECT_ACK) {
          state = STATE_BASE;
          clearAckTimeout();
        }
        cancelActions();
        sendMessage(ACK);
        break;
      case Acknowledged: {
        if (state === STATE_EXPECT_ACK) {
          state = STATE_BASE;
          clearAckTimeout();
        }
        break;
      }
      case Ready:
      case Submit: {
        if (state === STATE_BASE) return;
        if (state === STATE_EXPECT_ACK) {
          sendMessage(UNEXPECTED_TYPE_ERROR(message, `Unexpected Message Type ${message.type}. Expected ${Acknowledged}`));
        }
        break;
      }
      case ErrorMsg:
        console.error(message.message); // eslint-disable-line
        break;
      default:
        sendMessage(UNRECOGNIZED_TYPE_ERROR(message, `Message type ${message.type} is wrong`));
    }
  };
  window.addEventListener('message', onMessage);
  registerCleanup(() => {
    clearAckTimeout();
    window.removeEventListener('message', onMessage);
  });
  return sendMessage;
};

// ############################################
// Utils
// ############################################

const readScore = (form) => {
  const isNPS = !!form.querySelector('.nps-picker');
  if (isNPS) {
    const desktopNpsRadio = form.querySelector('.desktop-nps-radio');
    const mobileNpsSelect = form.querySelector('.mobile-nps-select');
    const isDesktopVisible = !!desktopNpsRadio && window.getComputedStyle(desktopNpsRadio).display !== 'none';
    const isMobileVisible = !!mobileNpsSelect && window.getComputedStyle(mobileNpsSelect).display !== 'none';

    if (isDesktopVisible) {
      const checkedRadio = form.querySelector('.desktop-nps-radio input[type="radio"][name="feedback"]:checked');
      const score = parseInt(checkedRadio?.value, 10);
      return Number.isNaN(score) ? -1 : score;
    }

    if (isMobileVisible) {
      const selectedValue = form.querySelector('.mobile-nps-select nps-picker.nps-picker')?.value;
      const score = parseInt(selectedValue, 10);
      return Number.isNaN(score) ? -1 : score;
    }

    const fallbackScore = parseInt(new FormData(form).get('feedback'), 10);
    return Number.isNaN(fallbackScore) ? -1 : fallbackScore;
  }
  const radioButtons = Array.from(form.querySelectorAll('input[type="radio"]'));
  const idx = radioButtons.findIndex((r) => r.checked);
  return idx === -1 ? -1 : idx + 1;
};

const updateNpsAriaLabel = (form) => {
  const npsGroup = form.querySelector('.desktop-nps-radio .radio-options');
  if (!npsGroup) return;
  const selectedDisplay = form.querySelector('.desktop-nps-radio input[type="radio"][name="feedback"]:checked')?.dataset.display;
  const valueText = selectedDisplay ?? 'none selected';
  npsGroup.setAttribute('role', 'group');
  npsGroup.setAttribute('aria-label', `Overall rating (radio group) ${valueText} out of 10`);
};

// ############################################
// Main
// ############################################

export default async (block) => {
  // parsing the block
  if (!block) return;

  const cleanupCallbacks = [];
  const registerCleanup = (callback) => {
    cleanupCallbacks.push(callback);
  };
  let isCleanedUp = false;
  const runCleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;
    while (cleanupCallbacks.length) {
      const callback = cleanupCallbacks.pop();
      callback?.();
    }
  };

  const blockLifecycleObserver = new MutationObserver(() => {
    if (!block.isConnected) {
      runCleanup();
    }
  });
  blockLifecycleObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  registerCleanup(() => blockLifecycleObserver.disconnect());

  // We must not show the consent banner on the nps csat form
  const config = getConfig();
  if (config) {
    config.holdPrivacyBanner = true;
  }

  const [
    title,
    question,
    radioLabels,
    explanationString,
    textboxPlaceholder,
    contactMeString,
    cancelText,
    submitText,
    errorText,
    displayCross,
    removeBoxShadow,
    matchBackgroundColor,
  ] = [...block.children].map((c) => c
    .firstElementChild
    ?.nextElementSibling
    ?.textContent).map((x) => !!x ? x : null); // eslint-disable-line
  const searchParams = new URLSearchParams(window.location.search);
  const sourceLocale = searchParams.get('source_locale')?.toLowerCase() ?? '';

  if (searchParams.get('source_color_theme')?.toLowerCase() === 'dark') {
    block.classList.add('dark');
  }
  if (removeBoxShadow?.toLowerCase() === 'true') {
    block.classList.add('remove-box-shadow');
  }
  if (matchBackgroundColor?.toLowerCase() === 'true') {
    block.classList.add('match-background');
  }
  if (RTL_LANG_PREFIXES.some((prefix) => sourceLocale === prefix || sourceLocale.startsWith(`${prefix}-`))) {
    block.setAttribute('dir', 'rtl');
  }

  // Set zoom on the body to handle edgecases in illustrator
  // We do this only because this block is meant to be loaded in
  // standalone contexts on desktop apps.
  try {
    const scaleFactorString = searchParams.get('scale_factor');
    const scaleFactor = parseFloat(scaleFactorString);
    if (Number.isNaN(scaleFactor)) throw new Error('Invalid scale factor');
    document.body.style.zoom = scaleFactor;
  } catch (e) {
    console.warn(e);
  }
  const {
    radioGroupList,
    npsOptions,
  } = (() => {
    const [scale, optionList] = radioLabels?.split('::').map((x) => x.trim()) ?? [];
    if (scale !== '5' && scale !== '7' && scale !== '11') {
      console.warn('Invalid scale specified; defaulting to a 5 pt scale. The value of scale has to be either \'5\', \'7\', or \'11\'.');
    }
    switch (scale) {
      case '11': {
        block.classList.add('eleven-point-nps');
        const [defaultSelectValue, ...authoredScoreOptions] = optionList?.split(',').map((x) => x.trim()) ?? [];
        const parsedScoreOptions = authoredScoreOptions
          .map((token, index) => {
            if (!token) return null;
            const [rawDisplay, ...rawLabelParts] = token.split('-');
            const display = rawDisplay?.trim();
            if (!display) return null;
            const label = rawLabelParts.join('-').trim();
            return {
              value: String(authoredScoreOptions.length - 1 - index),
              display,
              label,
            };
          })
          .filter(Boolean);
        const fallbackScoreOptions = [
          { value: '10', display: '10', label: 'Extremely likely' },
          { value: '9', display: '9', label: '' },
          { value: '8', display: '8', label: '' },
          { value: '7', display: '7', label: '' },
          { value: '6', display: '6', label: '' },
          { value: '5', display: '5', label: '' },
          { value: '4', display: '4', label: '' },
          { value: '3', display: '3', label: '' },
          { value: '2', display: '2', label: '' },
          { value: '1', display: '1', label: '' },
          { value: '0', display: '0', label: 'Not at all likely' },
        ];
        return {
          radioGroupList: (parsedScoreOptions.length ? parsedScoreOptions : fallbackScoreOptions)
            .map((scoreOption) => scoreOption.display),
          npsOptions: {
            defaultSelectOption: defaultSelectValue ?? 'Select an Option',
            scoreOptions: parsedScoreOptions.length ? parsedScoreOptions : fallbackScoreOptions,
          },
        };
      }
      case '7': {
        block.classList.add('seven-point');
        const [
          minusThree,
          minusTwo,
          minusOne,
          zero,
          one,
          two,
          three,
        ] = optionList?.split(',').map((x) => x.trim()) ?? [];
        const sevenPointScale = [
          minusThree ?? 'Extremely dissatisfied',
          minusTwo   ?? 'Moderately dissatisfied',
          minusOne   ?? 'Slightly dissatisfied',
          zero       ?? 'Neutral',
          one        ?? 'Slightly satisfied',
          two        ?? 'Moderately satisfied',
          three      ?? 'Extremely satisfied',
        ];
        return {
          radioGroupList: sevenPointScale,
          npsOptions: null,
        };
      }
      case '5':
      default: {
        const [
          minusTwo,
          minusOne,
          zero,
          one,
          two,
        ] = optionList?.split(',').map((x) => x.trim()) ?? [];
        block.classList.add('five-point');
        const fivePointScale = [
          minusTwo ?? 'Very dissatisfied',
          minusOne ?? 'Dissatisfied',
          zero     ?? 'Neutral',
          one      ?? 'Satisfied',
          two      ?? 'Very satisfied',
        ];
        return {
          radioGroupList: fivePointScale,
          npsOptions: null,
        };
      }
    }
  })();
  const isNPSForm = !!npsOptions;
  const data = {
    title,
    radioGroupLabel: question,
    radioGroup: radioGroupList,
    npsOptions,
    feedbackLabel: explanationString,
    textboxPlaceholder,
    contactMeString,
    cancelText,
    submitText,
    errorText,
    displayCross: displayCross?.toLowerCase() === 'true',
  };

  const formFragment = document
    .createRange()
    .createContextualFragment(buildForm(data));
  block.replaceChildren(formFragment);

  const sendMessage = initMessageClient(registerCleanup);

  try {
    await loadMartech();
  } catch {
    sendMessage(
      MARTECH_LOAD_FAILED(
        null,
        'Data Ingestion will fail; Failed to load martech and/or launch',
      ),
    );
  }

  const form = block.querySelector('#nps');
  const cleanupKeyboardAccessibility = initKeyboardAccessibility(form, sendMessage);
  registerCleanup(cleanupKeyboardAccessibility);
  updateNpsAriaLabel(form);
  const firstInteractiveElement = form.querySelector('.nps-close, input[type="radio"], .nps-picker-trigger, textarea, #contact-me, .nps-cancel, .nps-submit');
  firstInteractiveElement?.focus();

  // The form will still be interactable in case
  // Acknowledgement fails
  sendMessage(READY);

  const radioGroup = block.querySelector('.nps-radio-group');
  const errorMessage = radioGroup.querySelector('#feedback-error');

  let submitted = false;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitted) return;
    block.classList.add('submit-clicked');

    const score = readScore(form);

    if (score === -1) {
      radioGroup.classList.add('show-error');
      radioGroup.setAttribute('aria-invalid', 'true');
      errorMessage?.setAttribute('aria-hidden', 'false');
      return;
    }

    radioGroup.removeAttribute('aria-invalid');
    errorMessage?.setAttribute('aria-hidden', 'true');
    submitted = true;
    const formData = new FormData(form);
    const feedback = formData.get('explanation');
    const contactMe = formData.get('contact-me') === 'on';
    const d = {
      score,
      feedback,
      contactMe,
    };
    const surveyType = isNPSForm ? 'NPS' : 'CSAT 5pt';
    const dataObj = buildDataObject(d, surveyType, SubmitSurvey);
    window._satellite?.track?.('event', dataObj) // eslint-disable-line
    sendMessage(SUBMIT(d));
  });

  const cancelButton = form.querySelector('button.nps-cancel');
  const closeButton = form.querySelector('button.nps-close');
  cancelButton?.addEventListener('click', () => {
    cancelActions();
    sendMessage(CANCEL);
  }, { once: true });
  cancelButton?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      cancelActions();
      sendMessage(CANCEL);
    }
  }, { once: true });
  closeButton?.addEventListener('click', () => {
    cancelActions();
    sendMessage(CANCEL);
  }, { once: true });
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((r) => {
    r.addEventListener('change', () => {
      updateNpsAriaLabel(form);
      if (block.classList.contains('submit-clicked')) {
        radioGroup.classList.remove('show-error');
        radioGroup.removeAttribute('aria-invalid');
        errorMessage?.setAttribute('aria-hidden', 'true');
      }
    });
  });
  form.querySelector('nps-picker.nps-picker')?.addEventListener('change', () => {
    updateNpsAriaLabel(form);
    if (block.classList.contains('submit-clicked')) {
      radioGroup.classList.remove('show-error');
      radioGroup.removeAttribute('aria-invalid');
      errorMessage?.setAttribute('aria-hidden', 'true');
    }
  });
};
