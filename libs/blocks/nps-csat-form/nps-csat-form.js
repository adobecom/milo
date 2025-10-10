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

const SURVEY_VERSION = '0.0.1';

// ############################################
// HTML
// ############################################

const buildForm = ({
  title,
  radioGroupLabel,
  radioGroup,
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
    <h2>${title}</h2>
    <fieldset class="nps-radio-group" role="radiogroup" aria-label="${radioGroupLabel}" aria-required="true" aria-describedby="feedback-error">
      <legend>${radioGroupLabel} *</legend>
      <div class="radio-options">
        ${radioGroup.map(radio).join('')}
      </div>
      <div class="error-message" id="feedback-error" aria-live="polite" aria-hidden="true">
        <span class="error-icon">⚠</span>
        <span class="error-text">${errorText}</span>
      </div>
    </fieldset>
    <fieldset class="nps-feedback-area">
      <legend>${feedbackLabel}</legend>
      <textarea
        id="explanation-input"
        name="explanation"
        placeholder="${textboxPlaceholder}"
        aria-label="${feedbackLabel}"
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
        ${contactMeString}
      </label>
    </fieldset>
    <fieldset class="nps-submit-area">
      <button type="button" aria-label="Cancel" class="nps-cancel">${cancelText}</button>
      <button type="submit" aria-label="Submit" class="nps-submit">${submitText}</button>
    </fieldset>
  </form>
  `;

const radio = (label) => {
  const id = createIdForLabel(label);
  return `
  <div class="radio-item">
    <label for="${id}"><span>${label}</span></label>
    <input
      type="radio"
      id="${id}"
      name="feedback"
      value="${id}"
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
    const radioButtons = Array.from(
      document.querySelectorAll('#nps input[type="radio"]'),
    );
    const surveyType = radioButtons.length === 7 ? '7pt' : '5pt';
    const dataObj = buildDataObject(d, surveyType, CancelSurvey);
    window._satellite?.track?.('event', { // eslint-disable-line
      xdm: {},
      data: dataObj,
    });
  };
})();

// ############################################
// Keyboard Accessibility
// ############################################

const initKeyboardAccessibility = (form, sendMessage) => {
  const radioButtons = Array.from(form.querySelectorAll('input[type="radio"][name="feedback"]'));
  const checkbox = form.querySelector('#contact-me');

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
    });
    button.addEventListener('focus', () => {
      if (!button.checked) button.click();
    });
  });

  if (checkbox) {
    checkbox.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  form.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      cancelActions();
      sendMessage(CANCEL);
    }
  });
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
  return data;
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

const initMessageClient = () => {
  let state = STATE_BASE;
  let timeout;

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
          timeout = setTimeout(() => {
            sendMessage(TIMEOUT_ERROR(null, 'Timed out waiting for "Acknowledged"'));
            state = STATE_BASE;
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

  window.addEventListener('message', (event) => {
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
          clearTimeout(timeout);
        }
        cancelActions();
        sendMessage(ACK);
        break;
      case Acknowledged: {
        if (state === STATE_EXPECT_ACK) {
          state = STATE_BASE;
          clearTimeout(timeout);
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
  });
  return sendMessage;
};

// ############################################
// Main
// ############################################

export default async (block) => {
  // parsing the block
  if (!block) return;

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
  ] = [...block.children].map((c) => c
    .firstElementChild
    ?.nextElementSibling
    ?.textContent).map((x) => !!x ? x : null); // eslint-disable-line
  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('source_color_theme')?.toLowerCase() === 'dark') {
    block.classList.add('dark');
  }
  const radioGroupList = (() => {
    const [scale, optionList] = radioLabels?.split('::').map((x) => x.trim()) ?? [];
    if (scale !== '5' && scale !== '7') {
      console.warn('Invalid scale specified; defaulting to a 5 pt scale. The value of scale has to be either \'5\' or \'7\'');
    }
    switch (scale) {
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
        return [
          minusThree ?? 'Extremely dissatisfied',
          minusTwo   ?? 'Moderately dissatisfied',
          minusOne   ?? 'Slightly dissatisfied',
          zero       ?? 'Neutral',
          one        ?? 'Slightly satisfied',
          two        ?? 'Moderately satisfied',
          three      ?? 'Extremely satisfied',
        ];
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
        return [
          minusTwo ?? 'Very dissatisfied',
          minusOne ?? 'Dissatisfied',
          zero     ?? 'Neutral',
          one      ?? 'Satisfied',
          two      ?? 'Very satisfied',
        ];
      }
    }
  })();
  const data = {
    title,
    radioGroupLabel: question,
    radioGroup: radioGroupList,
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

  const sendMessage = initMessageClient();

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
  initKeyboardAccessibility(form, sendMessage);

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

    const radioButtons = Array.from(form.querySelectorAll('input[type="radio"]'));
    const selectedRadio = radioButtons.findIndex((r) => r.checked);

    if (selectedRadio === -1) {
      radioGroup.classList.add('show-error');
      radioGroup.setAttribute('aria-invalid', 'true');
      errorMessage?.setAttribute('aria-hidden', 'false');
      return;
    }

    radioGroup.removeAttribute('aria-invalid');
    errorMessage?.setAttribute('aria-hidden', 'true');
    submitted = true;
    const formData = new FormData(form);
    const score = selectedRadio + 1;
    const feedback = formData.get('explanation');
    const contactMe = formData.get('contact-me') === 'on';
    const d = {
      score,
      feedback,
      contactMe,
    };
    const surveyType = radioButtons.length === 7 ? '7pt' : '5pt';
    const dataObj = buildDataObject(d, surveyType, SubmitSurvey);
    window._satellite?.track?.('event', { // eslint-disable-line
      xdm: {},
      data: dataObj,
    });
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
      if (block.classList.contains('submit-clicked')) {
        radioGroup.classList.remove('show-error');
        radioGroup.removeAttribute('aria-invalid');
        errorMessage?.setAttribute('aria-hidden', 'true');
      }
    });
  });
};
