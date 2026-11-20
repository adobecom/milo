export const HIDDEN = 'hidden';
export const STEPS = [1, 2, 3];
export const STEP_PREF = 'form.fldStepPref';
export const VISIBILITY_PREFIX = 'field_visibility.';
export const FILTER_PREFIX = 'field_filters.';
export const META_KEYS = ['form.template', 'form.id', 'form.subtype', 'form.success.type'];

export const parseOptions = (options = '') => {
  try {
    return JSON.parse(options);
  } catch {
    return Object.fromEntries(options.split(',').map((item) => {
      const [key, val] = item.trim().split(':');
      return key.trim() ? [key.trim(), `${(val || key).trim()}`] : ['', 'Choose an option...'];
    }));
  }
};

export const getTemplateRules = (rows = [], preferences = []) => {
  if (!rows.length) return {};
  const definitions = Object.fromEntries(preferences.map((field) => [field.prop, field]));
  const labels = parseOptions(definitions['form.template']?.options);
  const meta = { 'form.id': 'formId', 'form.subtype': 'purpose', 'form.success.type': 'successType' };
  const rules = {};
  const seen = new Set();
  rows.forEach(({ template, prop, value }) => {
    if (!Object.hasOwn(labels, template)) throw new Error(`Unknown template: ${template}`);
    const key = `${template}:${prop}`;
    if (seen.has(key)) throw new Error(`Duplicate template rule: ${key}`);
    seen.add(key);
    const isField = [VISIBILITY_PREFIX, FILTER_PREFIX].some((prefix) => prop?.startsWith(prefix));
    if (!Object.hasOwn(meta, prop) && !(isField && Object.hasOwn(definitions, prop))) {
      throw new Error(`Unknown template property: ${prop}`);
    }
    const definition = definitions[prop];
    if (definition?.options && !Object.hasOwn(parseOptions(definition.options), value)) {
      throw new Error(`Invalid template value: ${key}=${value}`);
    }
    rules[template] ??= { label: labels[template], field_visibility: {}, field_filters: {} };
    const rule = rules[template];
    if (Object.hasOwn(meta, prop)) rule[meta[prop]] = String(value ?? '');
    else {
      const [prefix, id] = prop.split('.');
      rule[prefix][id] = value;
    }
  });
  Object.keys(labels).filter(Boolean).forEach((template) => {
    Object.entries(meta).forEach(([prop, key]) => {
      if (!Object.hasOwn(rules[template] || {}, key)) {
        throw new Error(`Missing template rule: ${template}:${prop}`);
      }
    });
  });
  return rules;
};

export const createFieldMap = (preferences = []) => {
  const fields = preferences.flatMap((field) => {
    const prefix = [VISIBILITY_PREFIX, FILTER_PREFIX]
      .find((value) => field.prop?.startsWith(value));
    const defaultStep = Number(field.defaultstep);
    if (!prefix || !field.stepname?.trim() || !STEPS.includes(defaultStep)
      || !['always', 'toggle', 'never'].includes(field.requiredpolicy)) return [];
    const filterOptions = Object.entries(parseOptions(field.options))
      .filter(([value]) => value && value !== HIDDEN)
      .map(([value, label]) => ({ value, label }));
    return [{
      id: field.prop.slice(prefix.length),
      prop: field.prop,
      label: field.label,
      stepName: field.stepname.trim(),
      kind: prefix === FILTER_PREFIX ? 'filter' : 'visibility',
      alwaysRequired: field.requiredpolicy === 'always',
      canRequire: field.requiredpolicy === 'toggle',
      defaultStep,
      defaultValue: field.default ?? HIDDEN,
      filterOptions,
      linkedStepName: field.linkedstepname?.trim(),
    }];
  });
  ['email', 'country'].forEach((id) => fields.push({
    id, label: id === 'email' ? 'Email' : 'Country', stepName: id, kind: 'locked', alwaysRequired: true, defaultStep: 1,
  }));
  const linkedFields = fields.filter((field) => field.linkedStepName).map((field) => ({
    id: field.linkedStepName,
    stepName: field.linkedStepName,
    kind: 'synced',
    syncWith: field.id,
  }));
  const allFields = [...fields, ...linkedFields];
  if (['id', 'stepName'].some((key) => (
    new Set(allFields.map((field) => field[key])).size !== allFields.length
  ))) {
    throw new Error('Duplicate field identifier or step placement');
  }
  const byId = Object.fromEntries(allFields.map((field) => [field.id, field]));
  const isShown = (state, field) => field.kind === 'locked'
    || (state[field.prop] ?? HIDDEN) !== HIDDEN;
  const cloneSteps = (state = {}) => Object.fromEntries(
    STEPS.map((step) => [step, [...(state[STEP_PREF]?.[step] || [])]]),
  );

  const removeFromSteps = (stepPref, stepName) => {
    STEPS.forEach((s) => { stepPref[s] = stepPref[s].filter((n) => n !== stepName); });
  };

  function syncLinkedFields(stepPref) {
    linkedFields.forEach((field) => {
      removeFromSteps(stepPref, field.stepName);
      const parentStep = STEPS.find((s) => stepPref[s].includes(byId[field.syncWith].stepName));
      if (parentStep) stepPref[parentStep].push(field.stepName);
    });
  }

  const getDefaultDistribution = (state, count) => {
    const stepPref = cloneSteps();
    fields.filter((field) => isShown(state, field)).forEach((field) => {
      stepPref[Math.min(field.defaultStep, count)].push(field.stepName);
    });
    syncLinkedFields(stepPref);
    return stepPref;
  };

  const deriveBuckets = (state) => {
    const stepPref = state[STEP_PREF] || {};
    const buckets = { hidden: [], ...cloneSteps() };
    fields.forEach((field) => {
      const step = STEPS.find((s) => stepPref[s]?.includes(field.stepName)) || 1;
      buckets[isShown(state, field) ? step : HIDDEN].push(field.id);
    });
    return buckets;
  };

  const applyTemplate = (templateId, templateRules, count = 1) => {
    const rule = templateRules?.[templateId];
    if (!rule) return {};
    const patch = {
      'form.template': templateId,
      'form id': rule.formId ?? '',
      'form.id': rule.formId ?? '',
      'form.subtype': rule.purpose ?? '',
      'form.success.type': rule.successType ?? '',
    };
    fields.forEach((field) => {
      if (!field.prop) return;
      const source = field.kind === 'filter' ? rule.field_filters : rule.field_visibility;
      const value = source?.[field.id] ?? field.defaultValue;
      patch[field.prop] = field.alwaysRequired && value !== HIDDEN ? 'required' : value;
    });
    patch[STEP_PREF] = getDefaultDistribution(patch, count);
    return patch;
  };

  const moveField = (currentState, id, bucket) => {
    const field = byId[id];
    if (!field || field.kind === 'synced') return {};
    if (field.kind === 'locked' && bucket === 'hidden') return {};
    const patch = {};
    const stepPref = cloneSteps(currentState);
    removeFromSteps(stepPref, field.stepName);

    if (bucket === HIDDEN) {
      patch[field.prop] = HIDDEN;
    } else {
      if (!isShown(currentState, field)) {
        const shownValue = field.alwaysRequired ? 'required' : 'visible';
        patch[field.prop] = field.kind === 'filter'
          ? field.filterOptions[0]?.value ?? HIDDEN : shownValue;
      }
      stepPref[Number(bucket)].push(field.stepName);
    }
    syncLinkedFields(stepPref);
    return { ...patch, [STEP_PREF]: stepPref };
  };

  const toggleRequired = (currentState, id) => {
    const field = byId[id];
    if (field?.kind !== 'visibility' || !field.canRequire) return {};
    const current = currentState[field.prop];
    if (current === HIDDEN || current === undefined) return {};
    return { [field.prop]: current === 'required' ? 'visible' : 'required' };
  };

  const setFilter = (id, value) => {
    const field = byId[id];
    if (field?.kind !== 'filter') return {};
    return { [field.prop]: value };
  };

  return {
    fields: allFields,
    byId,
    deriveBuckets,
    deriveStepCount: (state) => STEPS.reduce((max, s) => (
      state[STEP_PREF]?.[s]?.length ? s : max
    ), 1),
    applyTemplate,
    moveField,
    toggleRequired,
    setFilter,
    setStepCount: (state, count) => ({ [STEP_PREF]: getDefaultDistribution(state, count) }),
  };
};
