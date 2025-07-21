import { html, useContext, useState, useEffect } from '../../deps/htm-preact.js';
import { ConfiguratorContext } from './context.js';
import { Select } from '../../ui/controls/formControls.js';
import TagSelect from '../../ui/controls/TagSelector.js';

const STEP_OPTIONS = { 1: 'one', 2: 'multi-2', 3: 'multi-3' };
const FORM_FIELDS = [
  { name: 'name', label: 'First and Last Name', step: 1 },
  { name: 'email', label: 'Email', step: 1 },
  { name: 'phone', label: 'Phone', step: 1 },
  { name: 'company', label: 'Company', step: 1 },
  { name: 'country', label: 'Country', step: 1 },
  { name: 'state', label: 'State', step: 1 },
  { name: 'postalCode', label: 'Postal Code', step: 1 },
  { name: 'mktoFormsJobTitle', label: 'Job Title', step: 2 },
  { name: 'mktoFormsCompanyType', label: 'Company Type', step: 2 },
  { name: 'mktoFormsFunctionalArea', label: 'Functional Area', step: 2 },
  { name: 'mktoFormsRevenue', label: 'Annual Revenue', step: 2 },
  { name: 'mktoFormsEmployeeRange', label: 'Employee Range', step: 2 },
  { name: 'mktoFormsPrimaryProductInterest', label: 'Primary Product Interest', step: 3 },
  { name: 'mktoFormsComments', label: 'Comments', step: 3 },
  { name: 'mktoRequestProductDemo', label: 'Request Product Demo', step: 3 },
];

const createFieldMaps = (fields) => ({
  allOptions: fields.reduce((acc, field) => ({ ...acc, [field.name]: field.label }), {}),
  defaultFields: fields.reduce((acc, field) => {
    if (!acc[field.step]) acc[field.step] = [];
    acc[field.step].push(field.name);
    return acc;
  }, {}),
});

const getUnselectedOptions = (allOptions, stepPreferences) => Object.fromEntries(
  Object.entries(allOptions).filter(([key]) => !Object.keys(STEP_OPTIONS)
    .slice(1).some((step) => stepPreferences?.[step]?.includes(key))),
);

const ReadonlyTagSelect = ({ options, value, label }) => html`
  <div class="tagselect">
    <label>${label}</label>
    <div class="tagselect-input">
      <div class="tagselect-values">
        ${value.map((val) => html`
          <div class="tagselect-tag">
            <span class="tagselect-tag-text">${options[val]}</span>
          </div>`)}
      </div>
    </div>
  </div>
`;

const StepPanel = () => {
  const { state, dispatch } = useContext(ConfiguratorContext);
  const [stepCount, setStepCount] = useState(1);
  const [unselected, setUnselected] = useState({});
  const { allOptions, defaultFields } = createFieldMaps(FORM_FIELDS);

  useEffect(() => {
    const stepPreferences = state['form.fldStepPref'] || {};
    const filteredSteps = Object.keys(STEP_OPTIONS)
      .filter((key) => stepPreferences?.[key]?.length > 0);

    setStepCount(Math.max(1, ...filteredSteps.map(Number)));
    setUnselected(getUnselectedOptions(allOptions, stepPreferences));
  }, []);

  const setFieldStepPreferences = (fieldStepPreferences) => {
    dispatch({
      type: 'SET_VALUE',
      prop: 'form.fldStepPref',
      value: fieldStepPreferences,
    });
  };

  const getDefaultFieldSteps = (count) => {
    switch (count) {
      case 1:
        return { 1: defaultFields[1].concat(defaultFields[2], defaultFields[3]), 2: [], 3: [] };
      case 2:
        return { 1: defaultFields[1], 2: defaultFields[2].concat(defaultFields[3]), 3: [] };
      default:
        return { 1: defaultFields[1], 2: defaultFields[2], 3: defaultFields[3] };
    }
  };

  const setDefaultFieldSteps = (count) => {
    const defaultFieldSteps = getDefaultFieldSteps(count);
    setFieldStepPreferences(defaultFieldSteps);
    setUnselected(getUnselectedOptions(allOptions, defaultFieldSteps));
  };

  const stepPreferences = state['form.fldStepPref'];

  const getStepOptions = (index) => {
    const currentStep = index + 1;
    const stepValues = stepPreferences?.[currentStep] || [];
    const currentStepOptions = Object.entries(allOptions).reduce((acc, [key, label]) => {
      if (stepValues.includes(key)) {
        acc[key] = label;
      }
      return acc;
    }, getUnselectedOptions(allOptions, stepPreferences));

    const onChange = (newValue) => {
      const newFldStepPref = { ...stepPreferences, [currentStep]: newValue };
      // Step 1 should always have all unselected options
      const newUnselected = getUnselectedOptions(allOptions, newFldStepPref);
      newFldStepPref[1] = Object.keys(newUnselected);
      setFieldStepPreferences(newFldStepPref);
      setUnselected(newUnselected);
    };

    return html`
      <div class="step-field" key=${`step-${currentStep}-${stepValues.length}-${currentStepOptions.length}`}>
        <${TagSelect} options=${currentStepOptions} label="Fields for step ${currentStep}" value=${stepValues} onChange=${onChange} />
      </div>
    `;
  };

  const handleStepCountChange = (value) => {
    const count = parseInt(value, 10);
    if (Number.isNaN(count)) return;

    setStepCount(count);
    setDefaultFieldSteps(count);
  };

  return html`
    <div class="step-panel">
      <div class="steps-config">
        <${Select} label="Number of Steps" name="fldStepCount" options=${STEP_OPTIONS} value=${stepCount} onChange=${handleStepCountChange} />
        <div class="step-field" key=${`step-1-${unselected.length}`}>
          <${ReadonlyTagSelect} options=${unselected} label="Fields for step 1 (default)" value=${Object.keys(unselected)} />
        </div>
        ${[...Array(stepCount - 1)].map((_, i) => getStepOptions(i + 1))}
        <button class="resetToDefaultState" onClick=${() => setDefaultFieldSteps(stepCount)}>Reset steps</button>
      </div>
    </div>`;
};

export default StepPanel;
