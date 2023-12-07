import sanitizeComment from '../../utils/sanitizeComment.js';
import { createTag } from '../../utils/utils.js';

const RULE_OPERATORS = {
  equal: '=',
  notEqual: '!=',
  lessThan: '<',
  lessThanOrEqual: '<=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
};

function createSelect({ Field, Placeholder, Options, Default, Required }) {
  const select = createTag('select', { id: Field });
  if (Placeholder) select.append(createTag('option', { selected: '', disabled: '' }, Placeholder));
  Options.split(',').forEach((o) => {
    const text = o.trim();
    const option = createTag('option', { value: text }, text);
    select.append(option);
    if (Default === text) select.value = text;
  });
  if (Required === 'x') select.setAttribute('required', 'required');
  return select;
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type.match(/(?:checkbox|radio)/)) {
      if (fe.checked) {
        payload[fe.name] = payload[fe.name] ? `${fe.value}, ${payload[fe.name]}` : fe.value;
      } else if (!payload[fe.name] && fe.closest('.group-container').classList.contains('required')) {
        payload[fe.name] = 'required-not-checked';
      }
      return;
    }
    payload[fe.id] = fe.value;
  });
  return payload;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  const keys = Object.keys(payload);
  payload.timestamp = new Date().toJSON();
  for (const key of keys) {
    if (payload[key] === 'required-not-checked') {
      const el = form.querySelector(`input[name="${key}"]`);
      el.setCustomValidity('This box must be checked');
      el.reportValidity();
      const cb = () => {
        el.setCustomValidity('');
        el.reportValidity();
        el.removeEventListener('input', cb);
      };
      el.addEventListener('input', cb);
      return false;
    }
    payload[key] = sanitizeComment(payload[key]);
  }
  /* c8 ignore next 7 */
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return payload;
}

function clearForm(form) {
  [...form.elements].forEach((fe) => {
    if (fe.type.match(/(?:checkbox|radio)/)) {
      fe.checked = false;
    } else {
      fe.value = '';
    }
  });
}

function createButton({ Type, Label }, thankYou) {
  const button = createTag('button', { class: 'button' }, Label);
  if (Type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', '');
        const submission = await submitForm(form);
        button.removeAttribute('disabled');
        if (!submission) return;
        clearForm(form);
        const handleThankYou = thankYou.querySelector('a') ? thankYou.querySelector('a').href : thankYou.innerHTML;
        if (!thankYou.innerHTML.includes('href')) {
          const thanksText = createTag('h4', { class: 'thank-you' }, handleThankYou);
          form.append(thanksText);
          setTimeout(() => thanksText.remove(), 2000);
          /* c8 ignore next 3 */
        } else {
          window.location.href = handleThankYou;
        }
      }
    });
  }
  if (Type === 'clear') {
    button.classList.add('outline');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const form = button.closest('form');
      clearForm(form);
    });
  }
  return button;
}

function createHeading({ Label }, el) {
  return createTag(el, {}, Label);
}

function createInput({ Type, Field, Placeholder, Required, Default }) {
  const input = createTag('input', { type: Type, id: Field, placeholder: Placeholder, value: Default });
  if (Required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createTextArea({ Field, Placeholder, Required, Default }) {
  const input = createTag('textarea', { id: Field, placeholder: Placeholder, value: Default });
  if (Required === 'x') input.setAttribute('required', 'required');
  return input;
}

function createLabel({ Field, Label, Required }) {
  return createTag('label', { for: Field, class: Required ? 'required' : '' }, Label);
}

function createCheckItem(item, type, id, def) {
  const itemKebab = item.toLowerCase().replaceAll(' ', '-');
  const defList = def.split(',').map((defItem) => defItem.trim());
  const pseudoEl = createTag('span', { class: `check-item-button ${type}-button` });
  const label = createTag('label', { class: `check-item-label ${type}-label`, for: `${id}-${itemKebab}` }, item);
  const input = createTag(
    'input',
    { type, name: id, value: item, class: `check-item-input ${type}-input`, id: `${id}-${itemKebab}` },
  );
  if (item && defList.includes(item)) input.setAttribute('checked', '');
  return createTag('div', { class: `check-item-wrap ${type}-input-wrap` }, [input, pseudoEl, label]);
}

function createCheckGroup({ Options, Field, Default, Required }, type) {
  const options = Options.split(',').map((item) => createCheckItem(item.trim(), type, Field, Default));
  return createTag(
    'div',
    { class: `group-container ${type}-group-container${Required === 'x' ? ' required' : ''}` },
    options,
  );
}

function processNumRule(tf, operator, a, b) {
  /* c8 ignore next 3 */
  if (!tf.dataset.type.match(/(?:number|date)/)) {
    throw new Error(`Comparison field must be of type number or date for ${operator} rules`);
  }
  const { type } = tf.dataset;
  const a2 = type === 'number' ? parseInt(a, 10) : Date.parse(a);
  const b2 = type === 'number' ? parseInt(b, 10) : Date.parse(b);
  return [a2, b2];
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    const fw = form.querySelector(`[data-field-id=${field.fieldId}]`);
    const tf = form.querySelector(`[data-field-id=${key}]`);
    let force = false;
    switch (operator) {
      case RULE_OPERATORS.equal:
        force = (payload[key] === value);
        break;
      case RULE_OPERATORS.notEqual:
        force = (payload[key] !== value);
        break;
      case RULE_OPERATORS.lessThan:
        if (payload[key] === '') {
          force = true;
          break;
        }
        try {
          const [a, b] = processNumRule(tf, operator, payload[key], value);
          force = a < b;
          /* c8 ignore next 5 */
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Invalid rule, ${e}`);
          return false;
        }
        break;
      case RULE_OPERATORS.lessThanOrEqual:
        if (payload[key] === '') {
          force = true;
          break;
        }
        try {
          const [a, b] = processNumRule(tf, operator, payload[key], value);
          force = a <= b;
          /* c8 ignore next 5 */
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Invalid rule, ${e}`);
          return false;
        }
        break;
      case RULE_OPERATORS.greaterThan:
        if (payload[key] === '') {
          force = true;
          break;
        }
        try {
          const [a, b] = processNumRule(tf, operator, payload[key], value);
          force = a > b;
          /* c8 ignore next 5 */
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Invalid rule, ${e}`);
          return false;
        }
        break;
      case RULE_OPERATORS.greaterThanOrEqual:
        if (payload[key] === '') {
          force = true;
          break;
        }
        try {
          const [a, b] = processNumRule(tf, operator, payload[key], value);
          force = a >= b;
          /* c8 ignore next 5 */
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Invalid rule, ${e}`);
          return false;
        }
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unsupported operator ${operator}`);
        return false;
    }
    fw.classList.toggle(type, force);
    return false;
  });
}

async function createForm(formURL, thankYou, formData) {
  const { pathname } = new URL(formURL);
  let json = formData;
  /* c8 ignore next 4 */
  if (!formData) {
    const resp = await fetch(pathname);
    json = await resp.json();
  }
  const form = createTag('form');
  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  json.data.forEach((fd) => {
    fd.Type = fd.Type || 'text';
    const style = fd.Extra ? ` form-${fd.Extra}` : '';
    const fieldWrapper = createTag(
      'div',
      { class: `field-wrapper form-${fd.Type}-wrapper${style}`, 'data-field-id': fd.Field, 'data-type': fd.Type },
    );
    switch (fd.Type) {
      case 'select':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case 'heading':
        fieldWrapper.append(createHeading(fd, 'h3'));
        break;
      case 'legal':
        fieldWrapper.append(createHeading(fd, 'p'));
        break;
      case 'checkbox':
      case 'checkbox-group':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createCheckGroup(fd, 'checkbox'));
        fieldWrapper.classList.add('field-group-wrapper');
        break;
      case 'radio-group':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createCheckGroup(fd, 'radio'));
        fieldWrapper.classList.add('field-group-wrapper');
        break;
      case 'text-area':
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextArea(fd));
        break;
      case 'submit':
      case 'clear':
        fieldWrapper.classList.add('field-button-wrapper');
        fieldWrapper.append(createButton(fd, thankYou));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId: fd.Field, rule: JSON.parse(fd.Rules) });
        /* c8 ignore next 4 */
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  form.addEventListener('input', () => applyRules(form, rules));
  applyRules(form, rules);
  return (form);
}

export default async function decorate(block, formData = null) {
  const form = block.querySelector('a[href$=".json"]');
  const thankYou = block.querySelector(':scope > div:last-of-type > div');
  thankYou.remove();
  if (form) form.replaceWith(await createForm(form.href, thankYou, formData));
}
