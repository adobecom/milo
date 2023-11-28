import { html, useEffect, useState } from '../../deps/htm-preact.js';
import cloneElement from '../../deps/cloneElement.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
loadStyle(`${miloLibs || codeRoot}/ui/controls/multifield.css`);

const FieldSet = ({ fields, onDelete, onMoveUp, onMoveDown }) => html`
    <div class="multifield-set">
      <div class="up-down">
        <button class="move-up" title="Move Up" onClick=${onMoveUp}>▲</button>
        <button class="move-down" title="Move Down" onClick=${onMoveDown}>▲</button>
      </div>
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
const MultiField = ({
  children,
  className = '',
  values,
  onChange,
  subTitle,
  title,
  parentValues,
  parentIndex,
  name,
  addBtnLabel = 'Add',
  addBtnTitle,
}) => {
  const [fieldValues, setFieldValues] = useState(
    (values && [...values])
    || [...(parentValues[parentIndex][name] ?? [])],
  );
  const [fieldSets, setFieldSets] = useState([]);
  const [keys] = useState(getFieldNameOrId(Array.isArray(children) ? children : [children]));

  const onMultifieldChange = (mfName, idx) => (val, e) => {
    const newVals = [...fieldValues];
    const value = e?.target.type === 'checkbox'
      ? e.target.checked
      : val;
    newVals[idx][mfName] = value;
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
    const newVals = [...fieldValues, getEmptyDataObj(keys)];
    onChange(newVals);
  };

  const deleteFields = (fieldSetIdx) => () => {
    const newVals = [...fieldValues];
    newVals.splice(fieldSetIdx, 1);
    onChange(newVals);
  };

  const moveFieldUp = (index) => () => {
    if (index === 0) return;
    const newVals = [...fieldValues];
    [newVals[index], newVals[index - 1]] = [newVals[index - 1], newVals[index]];
    onChange(newVals);
  };

  const moveFieldDown = (index) => () => {
    if (index === fieldValues.length - 1) return;
    const newVals = [...fieldValues];
    [newVals[index], newVals[index + 1]] = [newVals[index + 1], newVals[index]];
    onChange(newVals);
  };

  useEffect(() => {
    if (parentValues) {
      setFieldValues([...parentValues[parentIndex][name] ?? []]);
    } else if (values) {
      setFieldValues([...values]);
    }
  }, [values, parentValues]);

  useEffect(() => {
    const newFieldSets = [];
    fieldValues.forEach((value) => {
      const newFields = Array.isArray(children) ? [...children] : [children];

      newFieldSets.push(populateFieldValues(newFields, value));
    });

    setFieldSets(addMultifieldChangeListener(newFieldSets));
  }, [fieldValues]);

  return html`
    <div class=${`multifield ${className}`}>
      <div class=${`multifield-header ${className}`}>
        <h3>${title}</h3>
        <button class=${`multifield-add ${className}`} onClick=${addFields} title=${addBtnTitle}>${addBtnLabel}</button>
        ${subTitle && html`<h5>${subTitle}</h5>`}
      </div>
      ${fieldSets.map(
    (fields, idx) => {
      fields.forEach((field) => (field.props.parentIndex = idx));
      return html`<${FieldSet} key=${idx} fields=${fields} onDelete=${deleteFields(idx)}
      onMoveUp=${moveFieldUp(idx)} onMoveDown=${moveFieldDown(idx)} />`;
    },
  )}
    </div>
  `;
};

export default MultiField;
