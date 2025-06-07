import isObject from './isObject.js';

/**
 * Checks if an object has a particular (non-inherited) property
 * @param {Object} obj The object that should be checked for properties
 * @param {String} prop The property name that should be defined in the object
 * @return {Boolean} `True` if the object has the property, `False` otherwise
 * @example
 * const obj = {a: 1, b: 2};
 * // returns false
 * hasOwnProperty(obj, '');
 * hasOwnProperty(obj, 'c');
 * hasOwnProperty(obj, 'hasOwnProperty'); // 'hasOwnProperty' is inherited
 * // returns true
 * hasOwnProperty(obj, 'a');
 */
const hasOwnProperty = (obj, prop) => {
  const areArgumentsValid = (isObject(obj) || Array.isArray(obj)) && (typeof prop === 'string') && !!prop.length;
  const val = areArgumentsValid ? Object.prototype.hasOwnProperty.call(obj, prop) : false;

  return val;
};

export default hasOwnProperty;
