/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./exports.js":
/*!********************!*\
  !*** ./exports.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./index.js\");\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_index_js__WEBPACK_IMPORTED_MODULE_0__);\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_index_js__WEBPACK_IMPORTED_MODULE_0___default()));\n\n\n//# sourceURL=webpack://unist-diff/./exports.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar array = __webpack_require__(/*! x-is-array */ \"./node_modules/x-is-array/index.js\")\nvar object = __webpack_require__(/*! is-object */ \"./node_modules/is-object/index.js\")\nvar proto = __webpack_require__(/*! getprototypeof */ \"./node_modules/getprototypeof/index.js\")\nvar size = __webpack_require__(/*! unist-util-size */ \"./node_modules/unist-util-size/index.js\")\n\nvar objectProto = Object.prototype\n\nvar ignoredKeys = ['type', 'children', 'value']\n\nmodule.exports = diff\n\nfunction diff(left, right) {\n  var patch = {left: left}\n  walk(left, right, patch, 0)\n  return patch\n}\n\nfunction walk(left, right, patch, index) {\n  var apply = patch[index]\n\n  if (left === right) {\n    return\n  }\n\n  if (!right) {\n    apply = append(apply, {type: 'remove', left: left, right: null})\n  } else if (!left) {\n    apply = append(apply, {type: 'insert', left: null, right: right})\n  } else if (left.type === right.type) {\n    apply = diffProperties(apply, left, right)\n\n    /* Nodes of the same type must be of the same kind: if `right` is a\n     * text, so is `left`. */\n    if (text(right)) {\n      apply = diffText(apply, left, right)\n    } else if (parent(right)) {\n      apply = diffChildren(apply, left, right, patch, index)\n    }\n  } else {\n    apply = append(apply, {type: 'replace', left: left, right: right})\n  }\n\n  if (apply) {\n    patch[index] = apply\n  }\n}\n\nfunction diffText(apply, left, right) {\n  return left.value === right.value\n    ? apply\n    : append(apply, {type: 'text', left: left, right: right})\n}\n\nfunction diffChildren(apply, left, right, patch, offset) {\n  var leftChildren = left.children\n  var ordered = reorder(leftChildren, right.children)\n  var children = ordered.children\n  var length = children.length\n  var index = -1\n  var leftChild\n  var rightChild\n\n  while (++index < length) {\n    leftChild = leftChildren[index]\n    rightChild = children[index]\n    offset++\n\n    if (leftChild) {\n      walk(leftChild, rightChild, patch, offset)\n    } else {\n      /* Excess nodes in `right` need to be added */\n      apply = append(apply, {type: 'insert', left: null, right: rightChild})\n    }\n\n    offset += size(leftChild)\n  }\n\n  if (ordered.moves) {\n    /* Reorder nodes last */\n    apply = append(apply, {type: 'order', left: left, right: ordered.moves})\n  }\n\n  return apply\n}\n\nfunction diffProperties(apply, left, right) {\n  var diff = diffObjects(left, right)\n  return diff ? append(apply, {type: 'props', left: left, right: diff}) : apply\n}\n\nfunction diffObjects(left, right) {\n  var diff\n  var leftKey\n  var rightKey\n  var leftValue\n  var rightValue\n  var objectDiff\n\n  for (leftKey in left) {\n    if (ignoredKeys.indexOf(leftKey) !== -1) {\n      continue\n    }\n\n    if (!(leftKey in right)) {\n      diff = diff || {}\n      diff[leftKey] = undefined\n    }\n\n    leftValue = left[leftKey]\n    rightValue = right[leftKey]\n\n    if (leftValue === rightValue) {\n      continue\n    }\n\n    if (\n      object(leftValue) &&\n      object(rightValue) &&\n      proto(rightValue) === objectProto &&\n      proto(leftValue) === objectProto\n    ) {\n      objectDiff = diffObjects(leftValue, rightValue)\n\n      if (objectDiff) {\n        diff = diff || {}\n        diff[leftKey] = objectDiff\n      }\n    } else {\n      diff = diff || {}\n      diff[leftKey] = rightValue\n    }\n  }\n\n  for (rightKey in right) {\n    if (ignoredKeys.indexOf(rightKey) !== -1) {\n      continue\n    }\n\n    if (!(rightKey in left)) {\n      diff = diff || {}\n      diff[rightKey] = right[rightKey]\n    }\n  }\n\n  return diff\n}\n\nfunction append(apply, patch) {\n  if (!apply) {\n    return patch\n  }\n\n  if (array(apply)) {\n    apply.push(patch)\n    return apply\n  }\n\n  return [apply, patch]\n}\n\n/* List diff, naive left to right reordering */\nfunction reorder(leftChildren, rightChildren) {\n  var leftChildIndex = keyIndex(leftChildren)\n  var leftKeys = leftChildIndex.key\n  var leftIndex = leftChildIndex.index\n  var rightChildIndex = keyIndex(rightChildren)\n  var rightKeys = rightChildIndex.key\n  var rightIndex = rightChildIndex.index\n  var leftLength = leftChildren.length\n  var rightLength = rightChildren.length\n  var leftOffset = 0\n  var rightOffset = 0\n  var rightMoved = []\n  var leftMoved = []\n  var removes = []\n  var inserts = []\n  var next = []\n  var index = -1\n  var leftKey\n  var rightKey\n\n  while (++index < leftLength) {\n    leftKey = leftIndex[index]\n\n    if (leftKey in rightKeys) {\n      next.push(rightChildren[rightKeys[leftKey]])\n    } else {\n      next.push(null)\n    }\n  }\n\n  index = -1\n\n  while (++index < rightLength) {\n    if (!(rightIndex[index] in leftKeys)) {\n      next.push(rightChildren[index])\n    }\n  }\n\n  leftChildren = next\n  leftChildIndex = keyIndex(leftChildren)\n  leftKeys = leftChildIndex.key\n  leftIndex = leftChildIndex.index\n  leftLength = leftChildren.length\n  rightKey = rightIndex[rightOffset]\n  leftKey = leftIndex[leftOffset]\n\n  while (leftOffset < leftLength || rightOffset < rightLength) {\n    /* The left node moved already. */\n    if (leftMoved.indexOf(leftOffset) !== -1) {\n      removes.push({left: leftChildren[leftOffset], right: leftOffset})\n      leftKey = leftIndex[++leftOffset]\n      /* The right node moved already. */\n    } else if (rightMoved.indexOf(rightOffset) !== -1) {\n      removes.push({\n        left: rightChildren[rightOffset],\n        right: leftKeys[rightKey]\n      })\n      rightKey = rightIndex[++rightOffset]\n    } else if (!rightKey) {\n      leftKey = leftIndex[++leftOffset]\n    } else if (!leftKey) {\n      rightKey = rightIndex[++rightOffset]\n    } else if (rightKey === leftKey) {\n      leftKey = leftIndex[++leftOffset]\n      rightKey = rightIndex[++rightOffset]\n    } else if (\n      leftKeys[rightKey] - leftOffset >=\n      rightKeys[leftKey] - rightOffset\n    ) {\n      inserts.push({left: rightChildren[rightOffset], right: rightOffset})\n      leftMoved.push(leftKeys[rightKey])\n      rightKey = rightIndex[++rightOffset]\n    } else {\n      inserts.push({left: leftChildren[leftOffset], right: rightKeys[leftKey]})\n      rightMoved.push(rightKeys[leftKey])\n      leftKey = leftIndex[++leftOffset]\n    }\n  }\n\n  if (removes.length === 0 && inserts.length === 0) {\n    return {children: leftChildren, moves: null}\n  }\n\n  return {\n    children: leftChildren,\n    moves: {removes: removes, inserts: inserts}\n  }\n}\n\nfunction keyIndex(children) {\n  var keys = {}\n  var indices = []\n  var length = children.length\n  var counts = {}\n  var index = -1\n  var child\n  var key\n\n  while (++index < length) {\n    child = children[index]\n\n    if (!child) {\n      continue\n    }\n\n    key = syntheticKey(child)\n\n    if (key in counts) {\n      key = key + ':' + counts[key]++\n    } else {\n      counts[key] = 1\n    }\n\n    indices[index] = key\n    keys[key] = index\n  }\n\n  return {key: keys, index: indices}\n}\n\nfunction syntheticKey(node) {\n  var props = {}\n  var key\n\n  for (key in node) {\n    if (ignoredKeys.indexOf(key) === -1) {\n      props[key] = node[key]\n    }\n  }\n\n  return node.type + ':' + JSON.stringify(props)\n}\n\nfunction parent(value) {\n  return node(value) && 'children' in value\n}\n\nfunction text(value) {\n  return node(value) && 'value' in value\n}\n\nfunction node(value) {\n  return object(value) && 'type' in value\n}\n\n\n//# sourceURL=webpack://unist-diff/./index.js?");

/***/ }),

/***/ "./node_modules/getprototypeof/index.js":
/*!**********************************************!*\
  !*** ./node_modules/getprototypeof/index.js ***!
  \**********************************************/
/***/ ((module) => {

eval("/* eslint-env node, browser */\n/* eslint no-proto: 0 */\nmodule.exports = function (object) {\n    \"use strict\";\n    var proto = object.__proto__;\n    if (proto || proto === null) {\n        return proto;\n    } else if (object.constructor) {\n        return object.constructor.prototype;\n    } else {\n        return Object.prototype;\n    }\n};\n\n\n//# sourceURL=webpack://unist-diff/./node_modules/getprototypeof/index.js?");

/***/ }),

/***/ "./node_modules/is-object/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-object/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function isObject(x) {\n\treturn typeof x === 'object' && x !== null;\n};\n\n\n//# sourceURL=webpack://unist-diff/./node_modules/is-object/index.js?");

/***/ }),

/***/ "./node_modules/unist-util-is/convert.js":
/*!***********************************************!*\
  !*** ./node_modules/unist-util-is/convert.js ***!
  \***********************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = convert\n\nfunction convert(test) {\n  if (test == null) {\n    return ok\n  }\n\n  if (typeof test === 'string') {\n    return typeFactory(test)\n  }\n\n  if (typeof test === 'object') {\n    return 'length' in test ? anyFactory(test) : allFactory(test)\n  }\n\n  if (typeof test === 'function') {\n    return test\n  }\n\n  throw new Error('Expected function, string, or object as test')\n}\n\n// Utility assert each property in `test` is represented in `node`, and each\n// values are strictly equal.\nfunction allFactory(test) {\n  return all\n\n  function all(node) {\n    var key\n\n    for (key in test) {\n      if (node[key] !== test[key]) return false\n    }\n\n    return true\n  }\n}\n\nfunction anyFactory(tests) {\n  var checks = []\n  var index = -1\n\n  while (++index < tests.length) {\n    checks[index] = convert(tests[index])\n  }\n\n  return any\n\n  function any() {\n    var index = -1\n\n    while (++index < checks.length) {\n      if (checks[index].apply(this, arguments)) {\n        return true\n      }\n    }\n\n    return false\n  }\n}\n\n// Utility to convert a string into a function which checks a given node’s type\n// for said string.\nfunction typeFactory(test) {\n  return type\n\n  function type(node) {\n    return Boolean(node && node.type === test)\n  }\n}\n\n// Utility to return true.\nfunction ok() {\n  return true\n}\n\n\n//# sourceURL=webpack://unist-diff/./node_modules/unist-util-is/convert.js?");

/***/ }),

/***/ "./node_modules/unist-util-size/index.js":
/*!***********************************************!*\
  !*** ./node_modules/unist-util-size/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar convert = __webpack_require__(/*! unist-util-is/convert */ \"./node_modules/unist-util-is/convert.js\")\n\nmodule.exports = size\n\nfunction size(node, test) {\n  var is = convert(test)\n  return fastSize(node)\n\n  function fastSize(node) {\n    var children = node && node.children\n    var count = 0\n    var index = -1\n\n    if (children && children.length) {\n      while (++index < children.length) {\n        if (is(children[index], index, node)) count++\n        count += fastSize(children[index])\n      }\n    }\n\n    return count\n  }\n}\n\n\n//# sourceURL=webpack://unist-diff/./node_modules/unist-util-size/index.js?");

/***/ }),

/***/ "./node_modules/x-is-array/index.js":
/*!******************************************!*\
  !*** ./node_modules/x-is-array/index.js ***!
  \******************************************/
/***/ ((module) => {

eval("var nativeIsArray = Array.isArray\nvar toString = Object.prototype.toString\n\nmodule.exports = nativeIsArray || isArray\n\nfunction isArray(obj) {\n    return toString.call(obj) === \"[object Array]\"\n}\n\n\n//# sourceURL=webpack://unist-diff/./node_modules/x-is-array/index.js?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./exports.js");
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__default as default };
/******/ 
