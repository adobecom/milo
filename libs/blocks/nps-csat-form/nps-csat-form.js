/* eslint no-use-before-define:0 */
// type Form = {
//   title: string;
//   radioGroupLabel: string;
//   radioGroup: string[];
//   feedBackLabel: string;
//   contactMeString: string;
// }

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
      <legend>${radioGroupLabel}</legend>
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

export default (block) => {
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

  // Add form validation handler - only show errors after submit attempt
  const form = block.querySelector('#nps');
  const radioGroup = block.querySelector('.nps-radio-group');

  form.addEventListener('submit', (e) => {
    // Mark that form has been submitted
    block.classList.add('submitted');

    const radioButtons = form.querySelectorAll('input[type="radio"]');
    const isRadioSelected = Array.from(radioButtons).some((r) => r.checked);

    if (!isRadioSelected) {
      e.preventDefault();
      radioGroup.classList.add('show-error');
    }
  });

  // Remove error when radio button is selected (after submission attempt)
  const radioButtons = form.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((r) => {
    r.addEventListener('change', () => {
      if (block.classList.contains('submitted')) {
        radioGroup.classList.remove('show-error');
      }
    });
  });
};
