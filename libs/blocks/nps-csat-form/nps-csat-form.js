/* eslint no-use-before-define:0 */
/* eslint no-multi-spaces:0 */
// type Form = {
//   title: string;
//   radioGroupLabel: string;
//   radioGroup: string[];
//   feedBackLabel: string;
//   contactMeString: string;
// }

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
        sendMessage(ACK);
        cancelActions();
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

const cancelActions = (() => {
  let cancelActionsDone = false;
  return () => {
    if (cancelActionsDone) return;
    cancelActionsDone = true;
  };
})();

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
  <form id="nps" method="get" action="/an/endpoint" novalidate>
    ${displayCross ? '<button type="button" class="nps-close" aria-label="Close">&times;</button>' : ''}
    <h2>${title}</h2>
    <fieldset class="nps-radio-group">
      <legend>${radioGroupLabel} *</legend>
      <div class="radio-options">
        ${radioGroup.map(radio).join('')}
      </div>
      <div class="error-message" id="feedback-error">
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
      <button type="button" class="nps-cancel">${cancelText}</button>
      <button type="submit" class="nps-submit">${submitText}</button>
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

export default async (block) => {
  // parsing the block
  if (!block) return;
  const [
    title,
    question,
    scale,
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
  if (searchParams.get('source_color_theme') === 'dark') {
    block.classList.add('dark');
  }
  const radioGroupList = (() => {
    if (scale !== '5' && scale !== '7') {
      console.warn('Invalid scale specified; defaulting to a 5 pt scale. The value of scale has to be either \'5\' or \'7\'');
    }
    switch (scale) {
      case '7': {
        block.classList.add('seven-point');
        return [
          'Extremely Dissatisfied',
          'Moderately Dissatisfied',
          'Slightly Dissatisfied',
          'Neutral',
          'Slightly Satisfied',
          'Moderately Satisfied',
          'Extremely Satisfied',
        ];
      }
      case '5':
      default: {
        block.classList.add('five-point');
        return [
          'Very Dissatisfied',
          'Dissatisfied',
          'Neutral',
          'Satisfied',
          'Very Satisfied',
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
  // The form will still be interactable in case
  // Acknowledgement fails
  sendMessage(READY);

  // Add form validation handler - only show errors after submit attempt
  const form = block.querySelector('#nps');
  const radioGroup = block.querySelector('.nps-radio-group');

  let submitted = false;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitted) return;
    block.classList.add('submit-clicked');

    const radioButtons = form.querySelectorAll('input[type="radio"]');
    const isRadioSelected = Array.from(radioButtons).some((r) => r.checked);

    if (!isRadioSelected) {
      radioGroup.classList.add('show-error');
      return;
    }

    submitted = true;
    const formData = new FormData(form);
    const feedback = formData.get('feedback');
    const explanation = formData.get('explanation');
    const contactMe = formData.get('contact-me') === 'on';
    const d = {
      feedback,
      explanation,
      contactMe,
    };
    sendMessage(SUBMIT(d));
    console.log(d);
  });

  const cancelButton = form.querySelector('button.nps-cancel');
  const closeButton = form.querySelector('button.nps-close');
  cancelButton?.addEventListener('click', () => {
    cancelActions();
    sendMessage(CANCEL);
  }, { once: true });
  closeButton?.addEventListener('click', () => {
    cancelActions();
    sendMessage(CANCEL);
  }, { once: true });
  // Remove error when radio button is selected (after submission attempt)
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((r) => {
    r.addEventListener('change', () => {
      if (block.classList.contains('submit-clicked')) {
        radioGroup.classList.remove('show-error');
      }
    });
  });
};
