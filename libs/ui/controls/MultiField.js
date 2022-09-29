import { html, useEffect, useState } from '../../deps/htm-preact.js';
import cloneElement from '../../deps/cloneElement.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
loadStyle(`${miloLibs || codeRoot}/ui/controls/multifield.css`);

const FieldSet = ({ fields, onDelete }) => html`
    <div class="multifield-set">
      <div class="multifield-fields">${fields}</div>
      <button class="multifield-delete" onClick=${onDelete}></button>
    </div>
  `;

const getFieldNameOrId = (fields) => fields.map((field) => field.props.name || field.props.id);

const getEmptyDataObj = (keys) => keys.reduce((obj, key) => {
  obj[key] = '';
  return obj;
}, {});

const populateFieldValues = (fields, value) => fields.map((field) => {
  field.props.value = value[field.props.name || field.props.id];
  return cloneElement(field);
});

// MultiField assumes that Fields have `name || id`, `onChange`, and `value` props.
const MultiField = ({ children, className = '', values = [], onChange, subTitle, title }) => {
  const [fieldSets, setFieldSets] = useState([]);
  const [keys] = useState(getFieldNameOrId(Array.isArray(children) ? children : [children]));

  const onMultifieldChange = (name, idx) => (val, e) => {
    const newVals = [...values];
    const value = e?.target.type === 'checkbox'
      ? e.target.checked
      : val;

    newVals[idx][name] = value;
    onChange(newVals);
  };

  const addMultifieldChangeListener = (sets) => sets.map(
    (fieldSet, fieldSetIndex) => fieldSet.map((field) => {
      field.props.onChange = onMultifieldChange(
        field.props.name || field.props.id,
        fieldSetIndex,
      );
      return cloneElement(field);
    }),
  );

  const addFields = () => {
    onChange([...values, getEmptyDataObj(keys)]);
  };

  const deleteFields = (fieldSetIdx) => () => {
    const newVals = [...values];
    newVals.splice(fieldSetIdx, 1);
    onChange(newVals);
  };

  useEffect(() => {
    const newFieldSets = [];
    values.forEach((value) => {
      const newFields = Array.isArray(children) ? [...children] : [children];

      newFieldSets.push(populateFieldValues(newFields, value));
    });

    setFieldSets(addMultifieldChangeListener(newFieldSets));
  }, [values]);

  return html`
    <div class=${`multifield ${className}`}>
      <div class=${`multifield-header ${className}`}>
        <h3>${title}</h3>
        <button class=${`multifield-add ${className}`} onClick=${addFields}>Add</button>
        ${subTitle && html`<h5>${subTitle}</h5>`}
      </div>
      ${fieldSets.map(
    (fields, idx) => html`<${FieldSet} key=${idx} fields=${fields} onDelete=${deleteFields(idx)} />`,
  )}
    </div>
  `;
};

export default MultiField;
