import { html, useEffect, useState } from '../../../deps/htm-preact.js';
import FragmentsSection from '../fragments/view.js';
import { nextStep, project, setProject } from '../store.js';
import StepControls from '../components/stepControls.js';
import {
  checkForErrors,
  validateForm,
  validateProjectName,
  validateUrls,
} from './index.js';

export default function InputUrls() {
  const [name, setName] = useState('');
  const [htmlFlow, setHtmlFlow] = useState(false);
  const [editBehavior, setEditBehavior] = useState('');
  const [urlsStr, setUrlsStr] = useState('');
  const [fragmentsEnabled, setFragmentsEnabled] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [noOfValidFrag, setNoOfValidfragments] = useState(0);
  const [errors, setErrors] = useState({
    name: '',
    editBehavior: '',
    urlsStr: '',
    fragments: '',
  });

  const errorPresent = checkForErrors(errors);

  function handleNameChange(ev) {
    const text = ev.target.value;
    const error = validateProjectName(text);
    setName(text);
    setErrors({ ...errors, name: error });
  }

  function handleeditBehaviorChange(ev) {
    setEditBehavior(ev.target.value);
    setErrors({ ...errors, editBehavior: '' });
  }

  function handleUrlsChange(ev) {
    const text = ev.target.value;
    const error = validateUrls(text);
    setUrlsStr(text);
    setErrors({ ...errors, urlsStr: error });
  }

  function handleFragmentsToggle() {
    setFragmentsEnabled(!fragmentsEnabled);
  }

  function handleFragmentsChange(_fragments) {
    setFragments(_fragments);
    setErrors({
      ...errors,
      fragments:
        fragmentsEnabled && noOfValidFrag > 0 && _fragments.length === 0,
    });
  }

  function handleNext() {
    const formErrors = validateForm({
      name,
      editBehavior,
      urlsStr,
      fragmentsEnabled,
      fragments,
      noOfValidFrag,
    });
    setErrors(formErrors);
    if (checkForErrors(formErrors)) {
      return;
    }

    setProject({
      name,
      htmlFlow,
      editBehavior,
      urls: urlsStr.split(/,|\n/),
      fragments,
    });
    nextStep();
  }

  useEffect(async () => {
    setName(project.value?.name || '');
    setHtmlFlow(project.value?.htmlFlow || false);
    setEditBehavior(project.value?.editBehavior || '');
    setUrlsStr(project.value?.urls?.join('\n') || '');
    setFragmentsEnabled(project.value?.fragments?.length > 0);
    setFragments(project.value?.fragments || []);
  }, []);

  return html`
    <div class="locui-form-container">
      <div class="locui-input-url-area">
        <div class="locui-title-bar">Localization</div>

        <div class="form-field">
          <div class="form-field-label">* Enter Project Name</div>
          <div>
            <input
              class=${`form-field-input ${errors.name && 'error'}`}
              value=${name}
              onInput=${handleNameChange}
            />
            ${errors.name &&
            html`<div class="form-field-error">${errors.name}</div>`}
          </div>
        </div>

        <div class="form-field">
          <div class="form-field-label">HTML Localization Flow</div>
          <input
            class="form-field-checkbox"
            type="checkbox"
            checked=${htmlFlow}
            onclick=${() => setHtmlFlow(!htmlFlow)}
          />
        </div>

        <div class="form-field">
          <div class="form-field-label">* Regional Edit Behavior</div>
          <div>
            <select
              value=${editBehavior}
              class=${`form-field-select ${errors.editBehavior && 'error'}`}
              onChange=${handleeditBehaviorChange}
            >
              <option value="" disabled selected hidden>Select</option>
              <option value="skip">Skip</option>
              <option value="merge">Merge</option>
              <option value="override">Override</option>
            </select>
            ${errors.editBehavior &&
            html`<div class="form-field-error">${errors.editBehavior}</div>`}
          </div>
        </div>

        <div class="form-field">
          <div class="form-field-label">* Enter the URLs</div>
          <div class="form-field-desc">
            (For multiple URLs, enter each on a new line)
          </div>
        </div>
        <textarea
          class=${`form-field-textarea ${errors.urlsStr && 'error'}`}
          rows="10"
          value=${urlsStr}
          onInput=${handleUrlsChange}
        />
        ${errors.urlsStr &&
        html`<div class="form-field-error">${errors.urlsStr}</div>`}

        <div class="form-field">
          <input
            class="form-field-checkbox"
            type="checkbox"
            name="includeFragments"
            checked=${fragmentsEnabled}
            disabled=${urlsStr.length === 0}
            onClick=${handleFragmentsToggle}
          />
          <span class="form-field-label">Include Fragments</span>
        </div>

        <div class="field-col">
          ${fragmentsEnabled &&
          html`
            <${FragmentsSection}
              urls=${urlsStr}
              fragments=${fragments}
              setFragments=${handleFragmentsChange}
              setNoOfValidfragments=${setNoOfValidfragments}
            />
          `}
        </div>
      </div>

      <div>
        <${StepControls} nextDisabled=${errorPresent} onNext=${handleNext} />
      </div>
    </div>
  `;
}
