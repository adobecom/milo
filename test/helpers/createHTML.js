export default function init(obj) {
  if (!obj) return '';
  const { type, props } = obj;
  const { children, ...attributes } = props;

  const attributeString = Object.keys(attributes)
    .map((key) => ` ${key}="${attributes[key]}"`)
    .join('');

  const childrenString = (children || [])
    .map((child) => init(child))
    .join('');

  return `<${type}${attributeString}>${childrenString}</${type}>`;
}
