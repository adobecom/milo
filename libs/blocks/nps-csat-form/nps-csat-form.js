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
export const ERROR  = (message) => ({
  type: ErrorMsg,
  message,
});
export const SUBMIT = (data) => ({
  type: Submit,
  data,
});
const MSG_TIMEOUT = 1000;

export const recieveMessage = (timeoutMessage) => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    if (timeoutMessage) reject(new Error(timeoutMessage));
  }, MSG_TIMEOUT);
  const handler = (event) => {
    clearTimeout(timeout);
    const message = (() => {
      try {
        return JSON.parse(event.data);
      } catch (e) {
        reject(new Error(`Failed to parse message: ${e.message}`));
      }
      return '';
    })();
    resolve(message);
  };
  window.addEventListener('message', handler, { once: true });
});

// Alternative approach: Use a generator function to
// get a stream of events, but the current use case
// does't justify doing it that way yet.
export const expectMessage = async (m, timeoutMessage = null) => {
  if (!m.type) throw new Error('Not a valid message');
  // Cancel is handled by the general message listener
  if (m.type === Cancel) return m;

  const message = await recieveMessage(timeoutMessage);
  // Cancel is handled by the general message listener
  // So no need to error out
  if (message.type === Cancel) {
    return message;
  }
  if (m.type !== message?.type) {
    const em = `Unexpected message ${message.type}. Expected ${m.type}`;
    throw new Error(em);
  }
  return message;
};

const acknowledgement = () => expectMessage(ACK, 'Timeout waiting for ACK');

const sendMessage = (() => {
  const parent = typeof window.uxpHost?.postMessage === 'function'
    ? window.uxpHost
    : window.parent;
  if (parent === window) {
    console.warn('No parent document found'); // eslint-disable-line
  }
  return (obj) => {
    const message = JSON.stringify(obj);
    parent.postMessage(message, '*');
  };
})();

const sendMessageAndWaitForAck = async (obj) => {
  sendMessage(obj);
  await acknowledgement();
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
  contactMeString,
}) => `
  <form id="nps" method="get" action="/an/endpoint" novalidate>
    <button type="button" class="nps-close" aria-label="Close">&times;</button>
    <h2>${title}</h2>
    <fieldset class="nps-radio-group">
      <legend>${radioGroupLabel} *</legend>
      <div class="radio-options">
        ${radioGroup.map(radio).join('')}
      </div>
      <div class="error-message" id="feedback-error">
        <span class="error-icon">⚠</span>
        <span class="error-text">Select your feedback</span>
      </div>
    </fieldset>
    <fieldset class="nps-feedback-area">
      <legend>${feedbackLabel}</legend>
      <textarea
        id="explanation-input"
        name="explanation"
        placeholder="Share your thoughts here..."
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
      <button type="button" class="nps-cancel">Cancel</button>
      <button type="submit" class="nps-submit">Submit</button>
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
  const data = {
    title: 'Help us improve [Product Name]',
    radioGroupLabel: 'Overall how satisfied are you with [Product Name]?',
    radioGroup: [
      'Very Dissatisfied',
      'Dissatisfied',
      'Neutral',
      'Satisfied',
      'Very Satisfied',
    ],
    feedbackLabel: 'Kindly explain your rating',
    contactMeString: 'Adobe can contact me about my rating',
  };
  const formFragment = document
    .createRange()
    .createContextualFragment(buildForm(data));
  block.append(formFragment);

  // The form will still be interactable in case
  // Acknowledgement fails
  sendMessageAndWaitForAck(READY).catch((e) => {
    const errorMessage = e?.message || e?.toString() || 'Unknown error occurred';
    sendMessage(ERROR(errorMessage));
    console.error(e); // eslint-disable-line
  });

  window.addEventListener('message', (event) => {
    const message = (() => {
      try {
        return JSON.parse(event.data);
      } catch (e) {
        const errorMessage = e?.message || e?.toString() || 'Unknown error occurred';
        sendMessage(ERROR(`Malformed JSON; ${event.data};  ${errorMessage}`));
        return e;
      }
    })();
    if (message instanceof Error) return;
    switch (message?.type) {
      case Cancel:
        sendMessage(ACK);
        cancelActions();
        break;
      case Ready:
      case Acknowledged:
      case Submit:
        break;
      case ErrorMsg:
        console.error(message.message); // eslint-disable-line
        break;
      default:
        sendMessage(ERROR(`Unexpected Message: ${JSON.stringify(message)}`));
    }
  });

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
    sendMessageAndWaitForAck(CANCEL);
  }, { once: true });
  closeButton?.addEventListener('click', () => {
    cancelActions();
    sendMessageAndWaitForAck(CANCEL);
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
