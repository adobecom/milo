import {
  html,
  useCallback,
  useEffect,
  useState,
} from '../../../deps/htm-preact.js';
import FragmentsSection from '../fragments/view.js';
import {
  authenticated,
  createDraftProject,
  initByParams,
  nextStep,
  project,
  projectCreated,
  setProject,
  updateDraftProject,
  userWorkflowType,
} from '../store.js';
import StepControls from '../components/stepControls.js';
import { origin } from '../../locui/utils/franklin.js';
import {
  checkForErrors,
  validateForm,
  validateProjectName,
  validateUrls,
  findFragments,
  validateFragments,
  getInitialName,
} from './index.js';
import { getUrls } from '../../locui/loc/index.js';
import { PROJECT_TYPES, PROJECT_TYPE_LABELS, URL_SEPARATOR_PATTERN, WORKFLOW } from '../utils/constant.js';
import Toast from '../components/toast.js';

export default function InputUrls() {
  const [type, setType] = useState(PROJECT_TYPES.translation);
  const [name, setName] = useState(getInitialName(type));
  const [htmlFlow, setHtmlFlow] = useState(true);
  const [editBehavior, setEditBehavior] = useState('');
  const [urlsStr, setUrlsStr] = useState('');
  const [fragmentsEnabled, setFragmentsEnabled] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [noOfValidFrag, setNoOfValidFragments] = useState(0);
  const [allFragments, setAllFragments] = useState([]);
  const [isFragmentsLoading, setFragmentsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    editBehavior: '',
    urlsStr: '',
    fragments: '',
  });
  const [apiError, setApiError] = useState('');

  const errorPresent = checkForErrors(errors);

  const fetchFragments = async (urls, selectAll = false) => {
    if (urls && !errors.urlsStr) {
      const inputUrls = urls
        .split(URL_SEPARATOR_PATTERN)
        .filter((url) => url)
        .map((url) => new URL(url));
      setFragmentsLoading(true);
      const found = await findFragments(getUrls(inputUrls));
      setAllFragments(found || []);
      const validFrags = found?.filter((frag) => !frag?.valid);
      setNoOfValidFragments(
        (found?.filter((frag) => !frag?.valid) ?? []).length,
      );
      if (selectAll) {
        setFragments(validFrags.map(({ pathname }) => pathname));
      }
      setFragmentsLoading(false);
    }
  };

  function handleTypeChange(_type) {
    setType(_type);
    setErrors({ ...errors, editBehavior: '' });
    if (!projectCreated.value) {
      setName(getInitialName(_type));
    }
  }

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
    if (!fragmentsEnabled) {
      if (!errors.urlsStr) {
        fetchFragments(urlsStr, true);
      }
    } else {
      setErrors((prev) => ({ ...prev, fragments: '' }));
      setAllFragments([]);
      setNoOfValidFragments(0);
      setFragments([]);
    }
  }

  const handleFragmentsChange = useCallback(
    (_fragments) => {
      setFragments(_fragments);
      const error = validateFragments(
        fragmentsEnabled,
        noOfValidFrag,
        _fragments,
      );
      setErrors((prev) => ({
        ...prev,
        fragments: error,
      }));
    },
    [fragmentsEnabled, noOfValidFrag],
  );

  async function handleNext() {
    const formErrors = validateForm({
      type,
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
      type,
      name,
      htmlFlow: type === PROJECT_TYPES.translation ? htmlFlow : false,
      editBehavior: type === PROJECT_TYPES.rollout ? editBehavior : '',
      urls: urlsStr.split(/,|\n/),
      fragments,
    });
    let error = '';
    if (!projectCreated.value) {
      error = await createDraftProject();
    } else {
      error = await updateDraftProject();
    }
    setApiError(error);
    if (error) {
      return;
    }
    nextStep();
  }

  useEffect(() => {
    if (project.value) {
      setType(project.value?.type);
      setName(project.value?.name);
      setHtmlFlow(project.value?.htmlFlow ?? true);
      setEditBehavior(project.value?.editBehavior || '');
      setUrlsStr(project.value?.urls?.join('\n'));
      setFragmentsEnabled(project.value?.fragments?.length > 0);
      setFragments(project.value?.fragments ?? []);
      if (
        project.value?.fragments?.length > 0
        && project.value?.urls.length > 0
      ) {
        fetchFragments(project.value?.urls?.join('\n'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.value]);

  const handleUrlsBlur = () => {
    if (urlsStr && !errors.urlsStr) {
      const splittedUrls = urlsStr
        .split(URL_SEPARATOR_PATTERN)
        .filter((url) => url);
      const uniqueUrls = Array.from(new Set(splittedUrls)).join('\n');
      setUrlsStr(uniqueUrls);
      if (fragmentsEnabled) {
        fetchFragments(uniqueUrls, true);
      }
    } else {
      setFragmentsEnabled(false);
      setAllFragments([]);
      setNoOfValidFragments(0);
      setErrors((prev) => ({ ...prev, fragments: '' }));
      setFragments([]);
    }
  };

  return html`
    <div class="locui-form-container">
      <div class="locui-input-form-area">
        <div class="locui-title-bar">
          Localization${' '}
          <span>- ${PROJECT_TYPE_LABELS[type]}</span>
        </div>
        <div class="locui-form-body">
          ${(WORKFLOW[userWorkflowType.value]?.switcher) && html`
            <div class="segment-ctrl pb-12">
              ${[PROJECT_TYPES.translation, PROJECT_TYPES.rollout].map((pType) => html`
                <div
                  key=${pType}
                  class=${`${type === pType && 'active'}`}
                  onclick=${() => handleTypeChange(pType)}
                >
                  ${PROJECT_TYPE_LABELS[pType]}
                </div>
              `)}
            </div>
          `}  

          <div class="form-field">
            <div class="form-field-label">* Project Name</div>
            <div>
              <input
                class=${`form-field-input ${errors.name && 'error'}`}
                value=${name}
                disabled=${projectCreated.value}
                onInput=${handleNameChange}
                placeholder="Enter letters, alphabet and hyphens only"
              />
              ${errors.name
              && html`<div class="form-field-error">${errors.name}</div>`}
            </div>
          </div>

          ${type === PROJECT_TYPES.translation
          && html`
            <div class="form-field">
              <div class="form-field-label">HTML Localization Flow</div>
              <input
                class="form-field-checkbox"
                type="checkbox"
                checked=${htmlFlow}
                onclick=${() => setHtmlFlow(!htmlFlow)}
              />
            </div>
          `}
          ${type === PROJECT_TYPES.rollout
          && html`
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
                  <option value="overwrite">Overwrite</option>
                  <option value="custom-merge">Custom Merge (.xlsx)</option>
                </select>
                ${errors.editBehavior
                && html`<div class="form-field-error">
                  ${errors.editBehavior}
                </div>`}
              </div>
            </div>
          `}

          <div class="form-field pb-8">
            <div class="form-field-label">* List of URLs</div>
            <div class="form-field-desc">
              (for multiple URLs, enter each on a new line.)
            </div>
          </div>
          <textarea
            class=${`form-field-textarea ${errors.urlsStr && 'error'} pl-14`}
            rows="10"
            value=${urlsStr}
            onInput=${handleUrlsChange}
            onBlur=${handleUrlsBlur}
            placeholder=${`Enter the full URL. E.g, ${origin}/drafts/localization/projects/raga/image-test-one`}
            disabled=${!WORKFLOW[userWorkflowType.value]?.urls}
          />
          ${errors.urlsStr
          && html`<div class="form-field-error">${errors.urlsStr}</div>`}

          <div class="form-field flex-items-center">
            <input
              class="form-field-switch"
              type="checkbox"
              id="includeFragments"
              name="includeFragments"
              checked=${fragmentsEnabled}
              disabled=${urlsStr.length === 0 || errors?.urlsStr?.length > 0 || userWorkflowType.value === 'promoteRollout'}
              onClick=${handleFragmentsToggle}
            />
            <label
              class="form-field-switch-label"
              for="includeFragments"
            ></label>
            <span class="form-field-label">Include Fragments</span>
          </div>

          <div class="field-col">
            ${fragmentsEnabled
            && html`
              <${FragmentsSection}
                allFragments=${allFragments}
                selectedFragments=${fragments}
                setSelectedFragments=${handleFragmentsChange}
                isLoading=${isFragmentsLoading}
                formErrors=${errors.fragments}
              />
            `}
            ${errors.fragments
            && html`<div class="form-field-error">${errors.fragments}</div>`}
          </div>
        </div>
      </div>

      ${apiError
      && html`<${Toast}
        message=${apiError}
        type="error"
        onClose=${() => setApiError('')}
      />`}

      <div>
        <${StepControls}
          nextDisabled=${!authenticated.value || errorPresent}
          onNext=${handleNext}
        />
      </div>
    </div>
  `;
}
