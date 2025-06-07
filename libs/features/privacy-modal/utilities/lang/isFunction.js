/**
 * Checks whether a given argument is a function or not
 * @param {Function} fn The argument to check against
 * @return {Boolean} `True` if the argument is a function, `False` otherwise
 * @example
 * // returns false
 * isFunction([0]);
 * isFunction({a: 1});
 * // returns true
 * isFunction(function () {});
 * isFunction(isFunction);
 */
const isFunction = (fn) => (typeof fn === 'function');

export default isFunction;
