/* eslint-disable react-hooks/exhaustive-deps */
import {
  html, useContext, useState, useEffect, useLayoutEffect, useRef,
} from '../../deps/htm-preact.js';
import { ConfiguratorContext } from './context.js';
import { Select } from '../../ui/controls/formControls.js';
import { HIDDEN, STEPS } from './field-map.js';

const bucketLabel = (bucket) => (bucket === HIDDEN ? 'Available fields' : `Step ${bucket}`);

const FieldChip = ({ id, bucket, stepCount, fieldMap, handlers }) => {
  const { state } = useContext(ConfiguratorContext);
  const { byId, isRequired } = fieldMap;
  const field = byId[id];
  const inStep = bucket !== HIDDEN;
  const value = state[field.prop] ?? HIDDEN;

  return html`
    <li class="ff-chip" data-field=${id}
      draggable="true" onDragStart=${(e) => handlers.onDragStart(e, id)} onDragEnd=${handlers.onDragEnd}>
      <span class="ff-chip-handle" aria-hidden="true">⠿</span>
      <div class="ff-chip-row">
        <div class="ff-chip-info">
          <span class="ff-chip-label">${field.label}</span>
          ${inStep && field.canRequire && field.kind === 'visibility' && html`
            <label class="ff-chip-required">
              <input type="checkbox" aria-label=${`${field.label} required`}
                checked=${isRequired(state, field)} onChange=${() => handlers.onToggleRequired(id)} />
              Required
            </label>`}
          ${inStep && field.alwaysRequired && html`
            <span class="ff-chip-locked">Always required</span>`}
        </div>
        <select class="ff-chip-placement" id=${`ff-placement-${id}`}
          aria-label=${`${field.label} placement`} value=${String(bucket)}
          disabled=${field.kind === 'locked' && stepCount === 1}
          onChange=${(e) => handlers.onMove(id, e.currentTarget.value, true)}>
          ${field.kind !== 'locked' && html`<option value="hidden">Not shown</option>`}
          ${STEPS.slice(0, stepCount).map((step) => html`
            <option value=${String(step)}>Step ${step}</option>`)}
        </select>
      </div>
      ${inStep && field.kind === 'filter' && html`
        <div class="ff-chip-row">
          <label for=${`ff-filter-${id}`}>Filter</label>
          <select class="ff-chip-filter" id=${`ff-filter-${id}`}
            aria-label=${`${field.label} filter options`} value=${value}
            onChange=${(e) => handlers.onSetFilter(id, e.target.value)}>
            ${!field.filterOptions.some((option) => option.value === value) && html`
              <option value=${value}>${value} (saved value)</option>`}
            ${field.filterOptions.map((o) => html`<option value=${o.value}>${o.label}</option>`)}
          </select>
        </div>`}
    </li>`;
};

const Bucket = ({
  bucket, ids, stepCount, draggingId, handlers, fieldMap, collapsed, onToggle,
}) => {
  const [isOver, setIsOver] = useState(false);
  const blocked = bucket === HIDDEN && fieldMap.byId[draggingId]?.kind === 'locked';
  const onDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (blocked) return;
    const id = e.dataTransfer.getData('text/plain');
    if (id) handlers.onMove(id, bucket);
  };
  let overClass = '';
  if (isOver) overClass = blocked ? 'is-blocked' : 'is-over';
  return html`
    <details class="ff-bucket ${overClass}" data-bucket=${bucket} open=${!collapsed}
      onToggle=${(e) => onToggle(bucket, e.currentTarget.open)}
      onDragOver=${(e) => { e.preventDefault(); e.dataTransfer.dropEffect = blocked ? 'none' : 'move'; setIsOver(true); }}
      onDragLeave=${() => setIsOver(false)}
      onDrop=${onDrop}>
      <summary>
        <span class="ff-bucket-title">${bucketLabel(bucket)}</span>
        <span class="ff-bucket-count" aria-label=${`${ids.length} fields`}>${ids.length}</span>
      </summary>
      <ul class="ff-bucket-fields">
        ${ids.length === 0 && html`
          <li class="ff-bucket-empty">${bucket === HIDDEN
    ? 'All fields are in use.' : 'No fields yet. Choose a field\u2019s placement to add it.'}</li>`}
        ${ids.map((id) => html`
          <${FieldChip} key=${id} id=${id} bucket=${bucket} stepCount=${stepCount}
            fieldMap=${fieldMap} handlers=${handlers} />`)}
      </ul>
    </details>`;
};

const FormFieldsPanel = ({ templateRules = {}, fieldMap }) => {
  const { state, dispatch } = useContext(ConfiguratorContext);
  const {
    deriveBuckets, deriveStepCount, applyTemplate, moveField, toggleRequired, setFilter,
    setStepCount: redistributeSteps,
  } = fieldMap;
  const [stepCount, setStepCount] = useState(() => deriveStepCount(state));
  const [draggingId, setDraggingId] = useState(null);
  const [collapsedBuckets, setCollapsedBuckets] = useState({ hidden: true });
  const [announcement, setAnnouncement] = useState('');
  const panelRef = useRef(null);
  const pendingFocus = useRef(null);

  useEffect(() => {
    setStepCount(deriveStepCount(state));
  }, [state.reset]);

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const chip = [...panelRef.current.querySelectorAll('.ff-chip')]
      .find((element) => element.dataset.field === pendingFocus.current);
    chip?.querySelector('.ff-chip-placement')?.focus();
    pendingFocus.current = null;
  }, [state, collapsedBuckets]);

  const merge = (values) => { if (Object.keys(values).length) dispatch({ type: 'MERGE', values }); };

  const onTemplate = (templateId) => merge(applyTemplate(templateId, templateRules, stepCount));

  const onStepCount = (count) => {
    setStepCount(count);
    merge(redistributeSteps(state, count));
  };

  const handlers = {
    onDragStart: (e, id) => {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
      setDraggingId(id);
    },
    onDragEnd: () => setDraggingId(null),
    onMove: (id, bucket, restoreFocus = false) => {
      const values = moveField(state, id, bucket);
      if (!Object.keys(values).length) return;
      if (restoreFocus) pendingFocus.current = id;
      setCollapsedBuckets((current) => ({ ...current, [bucket]: false }));
      const destination = bucket === 'hidden' ? 'not shown on the form' : `moved to Step ${bucket}`;
      setAnnouncement(`${fieldMap.byId[id].label}: ${destination}.`);
      merge(values);
    },
    onToggleRequired: (id) => merge(toggleRequired(state, id)),
    onSetFilter: (id, value) => merge(setFilter(state, id, value)),
  };

  const buckets = deriveBuckets(state);
  const onBucketToggle = (bucket, open) => {
    setCollapsedBuckets((current) => (Boolean(current[bucket]) === !open
      ? current : { ...current, [bucket]: !open }));
  };
  const templateOptions = Object.fromEntries(
    Object.entries(templateRules).map(([id, r]) => [id, r.label || id]),
  );

  return html`
    <div class="form-fields-panel" ref=${panelRef}>
      <${Select} label="Template" name="form.template" options=${templateOptions}
        value=${state['form.template'] || ''} onChange=${onTemplate} isRequired=${true} />
      <div class="ff-step-count">
        <span class="ff-step-count-label">Number of Steps</span>
        <div class="ff-step-count-group" role="group" aria-label="Number of Steps">
          ${STEPS.map((count) => html`
            <button
              key=${count}
              type="button"
              class="ff-step-count-btn ${stepCount === count ? 'is-active' : ''}"
              aria-pressed=${stepCount === count}
              onClick=${() => onStepCount(count)}>${count}</button>`)}
        </div>
      </div>

      ${[HIDDEN, ...STEPS.slice(0, stepCount)].map((bucket) => html`
        <${Bucket} key=${bucket} bucket=${bucket} ids=${buckets[bucket]} stepCount=${stepCount}
          draggingId=${draggingId} handlers=${handlers} fieldMap=${fieldMap}
          collapsed=${Boolean(collapsedBuckets[bucket])}
          onToggle=${onBucketToggle} />`)}
      <button type="button" class="ff-reset"
        onClick=${() => onTemplate(state['form.template'])}>Reset to Template</button>
      <span class="ff-status" role="status" aria-live="polite" aria-atomic="true">${announcement}</span>
    </div>`;
};

export default FormFieldsPanel;
