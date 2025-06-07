import isObject from './isObject.js';

/**
 * Checks whether a given argument is a non-empty object
 * @param {Object} obj The object that should be checked for properties
 * @return {Boolean} `True` if the object is empty (or not an object),
 * `False` otherwise
 * @example
 * // returns false
 * isEmptyObject({a: 1});
 * // returns true
 * isEmptyObject();
 * isEmptyObject(0);
 * isEmptyObject([]);
 * isEmptyObject([1]);
 * isEmptyObject(null);
 */
const isEmptyObject = (obj) => {
  const val = isObject(obj) ? Object.keys(obj).length === 0 : true;

  return val;
};

export default isEmptyObject;