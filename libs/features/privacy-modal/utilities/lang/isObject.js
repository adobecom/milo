/**
 * Checks whether a given argument is an object or not
 * @param {Object} obj The argument to check the object type for
 * @return {Boolean} `True` if the argument is an object, `False` otherwise
 * @example
 * // returns false
 * isObject(0);
 * isObject([1]);
 * isObject('a');
 * isObject(null);
 * isObject(undefined);
 * isObject(isObject);
 * // returns true
 * isObject({});
 * isObject({a: 1});
 */
const isObject = (obj) => {
  const val = (typeof obj === 'object') && !Array.isArray(obj) && obj !== null;

  return val;
};

export default isObject;