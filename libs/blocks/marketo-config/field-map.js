/*
 * Canonical field table + pure placement helpers for the combined Form Fields panel.
 * Single source of truth linking the two Marketo vocabularies:
 *   - stepName  → the raw field name stored in `form.fldStepPref`
 *   - prop      → the `field_visibility.*` / `field_filters.*` key emitted to the data layer
 * Step distribution is driven by step count + each field's `defaultStep` (mirrors the
 * groupings of the retired step-panel), not by the template preset.
 * See ~/repos/bmarshal/context/plans/2026-08-30-marketo-configurator-form-fields.md
 */

export const HIDDEN = 'hidden';
export const STEP_PREF = 'form.fldStepPref';

// kind: 'locked' (always in a step) | 'visibility' | 'filter' | 'synced'
export const FIELDS = [
  { id: 'email', label: 'Email', stepName: 'email', kind: 'locked', defaultStep: 1 },
  { id: 'country', label: 'Country', stepName: 'country', kind: 'locked', defaultStep: 1 },

  {
    id: 'name', label: 'First and Last Name', stepName: 'name', kind: 'visibility', canRequire: true, defaultStep: 2,
  },
  {
    id: 'phone', label: 'Phone', stepName: 'phone', kind: 'visibility', canRequire: true, defaultStep: 2,
  },
  {
    id: 'company', label: 'Company', stepName: 'company', kind: 'visibility', canRequire: true, defaultStep: 3,
  },
  {
    id: 'website', label: 'Website', stepName: 'mktodemandbaseWebsite', kind: 'visibility', canRequire: true, defaultStep: 2,
  },
  {
    id: 'state', label: 'State', stepName: 'state', kind: 'visibility', canRequire: true, defaultStep: 3,
  },
  {
    id: 'postcode', label: 'Postal Code', stepName: 'postcode', kind: 'visibility', canRequire: true, defaultStep: 3,
  },
  {
    id: 'company_size', label: 'Company Size', stepName: 'mktoDemandbaseEmployeeRange', kind: 'visibility', canRequire: true, defaultStep: 2,
  },
  {
    id: 'comments', label: 'Comments', stepName: 'mktoFormsComments', kind: 'visibility', canRequire: false, defaultStep: 3,
  },
  {
    id: 'demo', label: 'Demo Request', stepName: 'mktoRequestProductDemo', kind: 'visibility', canRequire: false, defaultStep: 3,
  },

  {
    id: 'job_role',
    label: 'Job Title or Role',
    stepName: 'mktoFormsJobTitle',
    kind: 'filter',
    defaultStep: 2,
    filterOptions: [
      { value: 'Combined', label: 'DMe & DX Combined Roles' },
      { value: 'DX', label: 'DX Specific Roles' },
      { value: 'DMe', label: 'DMe Specific Roles' },
      { value: 'DALP', label: 'DALP Specific Roles' },
    ],
  },
  {
    id: 'functional_area',
    label: 'Functional Area',
    stepName: 'mktoFormsFunctionalArea',
    kind: 'filter',
    defaultStep: 2,
    filterOptions: [
      { value: 'Functional Area-Combined', label: 'Combined' },
      { value: 'Functional Area-DX', label: 'DX' },
      { value: 'Functional Area-DMe', label: 'DMe' },
      { value: 'Functional Area-DALP', label: 'DALP' },
    ],
  },
  {
    id: 'products',
    label: 'Product / Area of Interest',
    stepName: 'mktoFormsPrimaryProductInterest',
    kind: 'filter',
    defaultStep: 3,
    filterOptions: [
      { value: 'POI-Combined', label: 'DMe & DX Combined Products' },
      { value: 'POI-Dxonly', label: 'DX Products' },
      { value: 'POI-DMe', label: 'DMe Products' },
      { value: 'POI-DALP', label: 'DALP Products' },
    ],
  },
  {
    id: 'industry',
    label: 'Industry',
    stepName: 'mktodemandbaseIndustry',
    kind: 'filter',
    defaultStep: 3,
    filterOptions: [
      { value: 'all', label: 'Show Field' },
      { value: 'Industry-Gov-Edu', label: 'Gov Education' },
      { value: 'Industry-Edu', label: 'Education' },
      { value: 'Industry-Finance', label: 'Finance' },
      { value: 'Industry-Manufacturing', label: 'Manufacturing' },
    ],
  },

  // No Marketo-side visibility key; follows `products` placement + visibility.
  {
    id: 'company_type', label: 'Company Type', stepName: 'mktoFormsCompanyType', kind: 'synced', syncWith: 'products', defaultStep: 3,
  },
];

export const byId = Object.fromEntries(FIELDS.map((f) => [f.id, f]));

const propFor = (field) => (field.kind === 'filter' ? `field_filters.${field.id}` : `field_visibility.${field.id}`);

const defaultFilter = (field) => field.filterOptions?.[0]?.value ?? HIDDEN;

const isShown = (state, field) => {
  if (field.kind === 'locked') return true;
  if (field.kind === 'synced') return isShown(state, byId[field.syncWith]);
  return (state[propFor(field)] ?? HIDDEN) !== HIDDEN;
};

const emptySteps = () => ({ 1: [], 2: [], 3: [] });

const removeFromSteps = (stepPref, stepName) => {
  [1, 2, 3].forEach((s) => { stepPref[s] = stepPref[s].filter((n) => n !== stepName); });
};

/* Keep `company_type` glued to `products`: same step, or absent when products is hidden. */
function syncCompanyType(stepPref) {
  const ct = byId.company_type;
  removeFromSteps(stepPref, ct.stepName);
  const productsStep = [1, 2, 3].find((s) => stepPref[s].includes(byId.products.stepName));
  if (productsStep) stepPref[productsStep].push(ct.stepName);
}

const cloneSteps = (state) => {
  const src = state[STEP_PREF] || {};
  return { 1: [...(src[1] || [])], 2: [...(src[2] || [])], 3: [...(src[3] || [])] };
};

/* Distribute every shown field across `count` steps by its defaultStep (higher steps collapse). */
const getDefaultDistribution = (state, count) => {
  const stepPref = emptySteps();
  FIELDS.forEach((field) => {
    if (field.kind === 'synced' || !isShown(state, field)) return;
    stepPref[Math.min(field.defaultStep, count)].push(field.stepName);
  });
  syncCompanyType(stepPref);
  return stepPref;
};

/* Derive the render model (which bucket each field sits in) from flat emitted state. */
export const deriveBuckets = (state) => {
  const stepPref = state[STEP_PREF] || {};
  const buckets = { hidden: [], 1: [], 2: [], 3: [] };
  const stepOf = (field) => [1, 2, 3].find((s) => stepPref[s]?.includes(field.stepName)) || 1;
  FIELDS.forEach((field) => {
    if (field.kind === 'synced') return; // rendered implicitly with its parent
    if (!isShown(state, field)) buckets.hidden.push(field.id);
    else buckets[stepOf(field)].push(field.id);
  });
  return buckets;
};

export const deriveStepCount = (state) => {
  const stepPref = state[STEP_PREF] || {};
  return [1, 2, 3].reduce((max, s) => (stepPref[s]?.length ? s : max), 1);
};

export const isRequired = (state, field) => {
  if (field.kind === 'filter') return isShown(state, field); // shown ⇒ required
  return state[propFor(field)] === 'required';
};

export const filterValue = (state, field) => state[propFor(field)] ?? HIDDEN;

/* Build a full flat state patch from a template preset at the given step count. */
export const applyTemplate = (templateId, templateRules, count = 1) => {
  const rule = templateRules?.[templateId];
  if (!rule) return {};
  const patch = {
    'form.template': templateId,
    'form.id': rule.formId ?? '',
    'form.subtype': rule.purpose ?? '',
    'form.success.type': rule.successType ?? '',
  };
  FIELDS.forEach((field) => {
    if (field.kind === 'locked' || field.kind === 'synced') return;
    const source = field.kind === 'filter' ? rule.field_filters : rule.field_visibility;
    patch[propFor(field)] = source?.[field.id] ?? HIDDEN;
  });
  patch[STEP_PREF] = getDefaultDistribution(patch, count);
  return patch;
};

/* Move a field into a bucket ('hidden' | 1 | 2 | 3). Returns a flat state patch. */
export const moveField = (currentState, id, bucket) => {
  const field = byId[id];
  if (!field || field.kind === 'synced') return {};
  const patch = {};
  const stepPref = cloneSteps(currentState);

  if (bucket === 'hidden') {
    if (field.kind === 'locked') return {}; // locked fields can't be hidden
    patch[propFor(field)] = HIDDEN;
    removeFromSteps(stepPref, field.stepName);
  } else {
    const s = Number(bucket);
    if (field.kind === 'visibility' && (currentState[propFor(field)] ?? HIDDEN) === HIDDEN) {
      patch[propFor(field)] = 'visible';
    } else if (field.kind === 'filter' && (currentState[propFor(field)] ?? HIDDEN) === HIDDEN) {
      patch[propFor(field)] = defaultFilter(field);
    }
    removeFromSteps(stepPref, field.stepName);
    stepPref[s].push(field.stepName);
  }
  syncCompanyType(stepPref);
  patch[STEP_PREF] = stepPref;
  return patch;
};

export const toggleRequired = (currentState, id) => {
  const field = byId[id];
  if (field?.kind !== 'visibility' || !field.canRequire) return {};
  const current = currentState[propFor(field)];
  if (current === HIDDEN || current === undefined) return {};
  return { [propFor(field)]: current === 'required' ? 'visible' : 'required' };
};

export const setFilter = (currentState, id, value) => {
  const field = byId[id];
  if (field?.kind !== 'filter') return {};
  if (value === HIDDEN) return moveField(currentState, id, 'hidden');
  return { [propFor(field)]: value };
};

/* Re-default the step distribution for a new step count (mirrors the old panel). */
export const setStepCount = (currentState, count) => (
  { [STEP_PREF]: getDefaultDistribution(currentState, count) }
);
