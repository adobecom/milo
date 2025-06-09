import hasOwnProperty from './hasOwnProperty.js';

/**
 * Safely retrieves nested object properties without throwing errors
 * @param {Object} obj The object from which to retrieve the property.
 * @param {String} path The path to the nested property.
 * @example
 * // returns 'value'
 * this.getPropertySafely({prop1: {prop2: 'value'}}, 'prop1.prop2');
 * @example
 * // returns undefined
 * getPropertySafely({prop1: {prop2: 'value'}}, 'prop1.prop3.prop4');
 * @return {Boolean} The value of the nested property if it has been found OR
 * `undefined` if it doesn't exist.
 */
const getPropertySafely = (obj, path) => {
  let parsedPath;
  let i;
  let len;
  let current;

  if (obj && (typeof obj === 'object') && !Array.isArray(obj) && (typeof path === 'string') && !!Object.keys(obj).length && !!path.length) {
    parsedPath = path.split('.');
    len = parsedPath.length;
    current = obj;

    for (i = 0; i < len; i += 1) {
      if (hasOwnProperty(current, parsedPath[i])) {
        current = current[parsedPath[i]];
      } else {
        return undefined;
      }
    }
  }

  return current;
};

export default getPropertySafely;
