/* eslint-disable react-hooks/exhaustive-deps */
import { html, useContext, useState, useEffect, useMemo } from '../../deps/htm-preact.js';
import { ConfiguratorContext } from './context.js';
import { Select } from '../../ui/controls/formControls.js';
import {
  STEP_PREF, byId, deriveBuckets, deriveStepCount, isRequired, filterValue,
  applyTemplate, moveField, toggleRequired, setFilter, setStepCount as redistributeSteps,
} from './field-map.js';

const STEP_COUNT_OPTIONS = { 1: '1', 2: '2', 3: '3' };
const bucketLabel = (bucket) => (bucket === 'hidden' ? 'Hidden' : `Step ${bucket}`);

const FieldChip = ({ id, bucket, onDragStart, onToggleRequired, onSetFilter }) => {
  const { state } = useContext(ConfiguratorContext);
  const field = byId[id];
  const inStep = bucket !== 'hidden';
  const showRequire = inStep && field.kind === 'visibility' && field.canRequire;
  const showFilter = inStep && field.kind === 'filter';

  return html`
    <div class="ff-chip" data-field=${id} draggable=${true} onDragStart=${(e) => onDragStart(e, id)}>
      <div class="ff-chip-row">
        <span class="ff-chip-handle" aria-hidden="true">⠿</span>
        <span class="ff-chip-label">${field.label}</span>
        ${showRequire && html`
          <label class="ff-chip-required">
            <input type="checkbox" checked=${isRequired(state, field)} onChange=${() => onToggleRequired(id)} />
            Required
          </label>`}
      </div>
      ${showFilter && html`
        <select class="ff-chip-filter" value=${filterValue(state, field)} onChange=${(e) => onSetFilter(id, e.target.value)}>
          ${field.filterOptions.map((o) => html`<option value=${o.value}>${o.label}</option>`)}
        </select>`}
    </div>`;
};

const Bucket = ({ bucket, ids, handlers }) => {
  const [isOver, setIsOver] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) handlers.onMove(id, bucket);
  };
  return html`
    <div
      class="ff-bucket ${isOver ? 'is-over' : ''} ${collapsed ? 'is-collapsed' : ''}"
      data-bucket=${bucket}
      onDragOver=${(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setIsOver(true); }}
      onDragLeave=${() => setIsOver(false)}
      onDrop=${onDrop}>
      <div class="ff-bucket-header" onClick=${() => setCollapsed(!collapsed)}>
        <h4 class="ff-bucket-title">${bucketLabel(bucket)}</h4>
        <button class="ff-bucket-toggle" aria-label="Toggle" aria-expanded=${!collapsed}>${collapsed ? '▸' : '▾'}</button>
      </div>
      ${!collapsed && html`
        <div class="ff-bucket-fields">
          ${ids.length === 0 && html`<p class="ff-bucket-empty">Drag fields here</p>`}
          ${ids.map((id) => html`<${FieldChip} key=${id} id=${id} bucket=${bucket} ...${handlers} />`)}
        </div>`}
    </div>`;
};

const FormFieldsPanel = ({ templateRules = {} }) => {
  const { state, dispatch } = useContext(ConfiguratorContext);
  const [stepCount, setStepCount] = useState(1);

  useEffect(() => {
    setStepCount(deriveStepCount(state));
  }, [state.reset]);

  const merge = (values) => { if (Object.keys(values).length) dispatch({ type: 'MERGE', values }); };

  // Seed buckets from the default template once rules load and nothing is placed yet.
  useEffect(() => {
    const template = state['form.template'];
    const placed = state[STEP_PREF] && Object.keys(state[STEP_PREF]).length;
    if (Object.keys(templateRules).length && template && templateRules[template] && !placed) {
      merge(applyTemplate(template, templateRules, 1));
    }
  }, [Object.keys(templateRules).length]);

  const onTemplate = (templateId) => merge(applyTemplate(templateId, templateRules, stepCount));

  const onStepCount = (value) => {
    const count = parseInt(value, 10);
    if (Number.isNaN(count)) return;
    setStepCount(count);
    merge(redistributeSteps(state, count));
  };

  const handlers = {
    onDragStart: (e, id) => {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    },
    onMove: (id, bucket) => merge(moveField(state, id, bucket)),
    onToggleRequired: (id) => merge(toggleRequired(state, id)),
    onSetFilter: (id, value) => merge(setFilter(state, id, value)),
  };

  const onReset = () => onTemplate(state['form.template']);

  const buckets = deriveBuckets(state);
  const templateOptions = useMemo(() => Object.fromEntries(
    Object.entries(templateRules).map(([id, r]) => [id, r.label || id]),
  ), [templateRules]);

  return html`
    <div class="form-fields-panel">
      <${Select} label="Template" name="form.template" options=${templateOptions}
        value=${state['form.template'] || ''} onChange=${onTemplate} isRequired=${true} />
      <${Select} label="Number of Steps" name="fldStepCount" options=${STEP_COUNT_OPTIONS}
        value=${stepCount} onChange=${onStepCount} />

      <${Bucket} bucket="hidden" ids=${buckets.hidden} handlers=${handlers} />
      ${[...Array(stepCount)].map((_, i) => html`
        <${Bucket} key=${`step-${i + 1}`} bucket=${i + 1} ids=${buckets[i + 1]} handlers=${handlers} />`)}

      <button class="ff-reset" onClick=${onReset}>Reset to Template</button>
    </div>`;
};

export default FormFieldsPanel;
