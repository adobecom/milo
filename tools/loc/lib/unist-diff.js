(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.unistDiff = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* eslint-env node, browser */
/* eslint no-proto: 0 */
module.exports = function (object) {
    "use strict";
    var proto = object.__proto__;
    if (proto || proto === null) {
        return proto;
    } else if (object.constructor) {
        return object.constructor.prototype;
    } else {
        return Object.prototype;
    }
};

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function isObject(x) {
	return typeof x === 'object' && x !== null;
};

},{}],3:[function(require,module,exports){
'use strict'

module.exports = convert

function convert(test) {
  if (test == null) {
    return ok
  }

  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory(test) : allFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

// Utility assert each property in `test` is represented in `node`, and each
// values are strictly equal.
function allFactory(test) {
  return all

  function all(node) {
    var key

    for (key in test) {
      if (node[key] !== test[key]) return false
    }

    return true
  }
}

function anyFactory(tests) {
  var checks = []
  var index = -1

  while (++index < tests.length) {
    checks[index] = convert(tests[index])
  }

  return any

  function any() {
    var index = -1

    while (++index < checks.length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string into a function which checks a given node’s type
// for said string.
function typeFactory(test) {
  return type

  function type(node) {
    return Boolean(node && node.type === test)
  }
}

// Utility to return true.
function ok() {
  return true
}

},{}],4:[function(require,module,exports){
'use strict'

var convert = require('unist-util-is/convert')

module.exports = size

function size(node, test) {
  var is = convert(test)
  return fastSize(node)

  function fastSize(node) {
    var children = node && node.children
    var count = 0
    var index = -1

    if (children && children.length) {
      while (++index < children.length) {
        if (is(children[index], index, node)) count++
        count += fastSize(children[index])
      }
    }

    return count
  }
}

},{"unist-util-is/convert":3}],5:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],6:[function(require,module,exports){
'use strict'

var array = require('x-is-array')
var object = require('is-object')
var proto = require('getprototypeof')
var size = require('unist-util-size')

var objectProto = Object.prototype

var ignoredKeys = ['type', 'children', 'value']

module.exports = diff

function diff(left, right) {
  var patch = {left: left}
  walk(left, right, patch, 0)
  return patch
}

function walk(left, right, patch, index) {
  var apply = patch[index]

  if (left === right) {
    return
  }

  if (!right) {
    apply = append(apply, {type: 'remove', left: left, right: null})
  } else if (!left) {
    apply = append(apply, {type: 'insert', left: null, right: right})
  } else if (left.type === right.type) {
    apply = diffProperties(apply, left, right)

    /* Nodes of the same type must be of the same kind: if `right` is a
     * text, so is `left`. */
    if (text(right)) {
      apply = diffText(apply, left, right)
    } else if (parent(right)) {
      apply = diffChildren(apply, left, right, patch, index)
    }
  } else {
    apply = append(apply, {type: 'replace', left: left, right: right})
  }

  if (apply) {
    patch[index] = apply
  }
}

function diffText(apply, left, right) {
  return left.value === right.value
    ? apply
    : append(apply, {type: 'text', left: left, right: right})
}

function diffChildren(apply, left, right, patch, offset) {
  var leftChildren = left.children
  var ordered = reorder(leftChildren, right.children)
  var children = ordered.children
  var length = children.length
  var index = -1
  var leftChild
  var rightChild

  while (++index < length) {
    leftChild = leftChildren[index]
    rightChild = children[index]
    offset++

    if (leftChild) {
      walk(leftChild, rightChild, patch, offset)
    } else {
      /* Excess nodes in `right` need to be added */
      apply = append(apply, {type: 'insert', left: null, right: rightChild})
    }

    offset += size(leftChild)
  }

  if (ordered.moves) {
    /* Reorder nodes last */
    apply = append(apply, {type: 'order', left: left, right: ordered.moves})
  }

  return apply
}

function diffProperties(apply, left, right) {
  var diff = diffObjects(left, right)
  return diff ? append(apply, {type: 'props', left: left, right: diff}) : apply
}

function diffObjects(left, right) {
  var diff
  var leftKey
  var rightKey
  var leftValue
  var rightValue
  var objectDiff

  for (leftKey in left) {
    if (ignoredKeys.indexOf(leftKey) !== -1) {
      continue
    }

    if (!(leftKey in right)) {
      diff = diff || {}
      diff[leftKey] = undefined
    }

    leftValue = left[leftKey]
    rightValue = right[leftKey]

    if (leftValue === rightValue) {
      continue
    }

    if (
      object(leftValue) &&
      object(rightValue) &&
      proto(rightValue) === objectProto &&
      proto(leftValue) === objectProto
    ) {
      objectDiff = diffObjects(leftValue, rightValue)

      if (objectDiff) {
        diff = diff || {}
        diff[leftKey] = objectDiff
      }
    } else {
      diff = diff || {}
      diff[leftKey] = rightValue
    }
  }

  for (rightKey in right) {
    if (ignoredKeys.indexOf(rightKey) !== -1) {
      continue
    }

    if (!(rightKey in left)) {
      diff = diff || {}
      diff[rightKey] = right[rightKey]
    }
  }

  return diff
}

function append(apply, patch) {
  if (!apply) {
    return patch
  }

  if (array(apply)) {
    apply.push(patch)
    return apply
  }

  return [apply, patch]
}

/* List diff, naive left to right reordering */
function reorder(leftChildren, rightChildren) {
  var leftChildIndex = keyIndex(leftChildren)
  var leftKeys = leftChildIndex.key
  var leftIndex = leftChildIndex.index
  var rightChildIndex = keyIndex(rightChildren)
  var rightKeys = rightChildIndex.key
  var rightIndex = rightChildIndex.index
  var leftLength = leftChildren.length
  var rightLength = rightChildren.length
  var leftOffset = 0
  var rightOffset = 0
  var rightMoved = []
  var leftMoved = []
  var removes = []
  var inserts = []
  var next = []
  var index = -1
  var leftKey
  var rightKey

  while (++index < leftLength) {
    leftKey = leftIndex[index]

    if (leftKey in rightKeys) {
      next.push(rightChildren[rightKeys[leftKey]])
    } else {
      next.push(null)
    }
  }

  index = -1

  while (++index < rightLength) {
    if (!(rightIndex[index] in leftKeys)) {
      next.push(rightChildren[index])
    }
  }

  leftChildren = next
  leftChildIndex = keyIndex(leftChildren)
  leftKeys = leftChildIndex.key
  leftIndex = leftChildIndex.index
  leftLength = leftChildren.length
  rightKey = rightIndex[rightOffset]
  leftKey = leftIndex[leftOffset]

  while (leftOffset < leftLength || rightOffset < rightLength) {
    /* The left node moved already. */
    if (leftMoved.indexOf(leftOffset) !== -1) {
      removes.push({left: leftChildren[leftOffset], right: leftOffset})
      leftKey = leftIndex[++leftOffset]
      /* The right node moved already. */
    } else if (rightMoved.indexOf(rightOffset) !== -1) {
      removes.push({
        left: rightChildren[rightOffset],
        right: leftKeys[rightKey]
      })
      rightKey = rightIndex[++rightOffset]
    } else if (!rightKey) {
      leftKey = leftIndex[++leftOffset]
    } else if (!leftKey) {
      rightKey = rightIndex[++rightOffset]
    } else if (rightKey === leftKey) {
      leftKey = leftIndex[++leftOffset]
      rightKey = rightIndex[++rightOffset]
    } else if (
      leftKeys[rightKey] - leftOffset >=
      rightKeys[leftKey] - rightOffset
    ) {
      inserts.push({left: rightChildren[rightOffset], right: rightOffset})
      leftMoved.push(leftKeys[rightKey])
      rightKey = rightIndex[++rightOffset]
    } else {
      inserts.push({left: leftChildren[leftOffset], right: rightKeys[leftKey]})
      rightMoved.push(rightKeys[leftKey])
      leftKey = leftIndex[++leftOffset]
    }
  }

  if (removes.length === 0 && inserts.length === 0) {
    return {children: leftChildren, moves: null}
  }

  return {
    children: leftChildren,
    moves: {removes: removes, inserts: inserts}
  }
}

function keyIndex(children) {
  var keys = {}
  var indices = []
  var length = children.length
  var counts = {}
  var index = -1
  var child
  var key

  while (++index < length) {
    child = children[index]

    if (!child) {
      continue
    }

    key = syntheticKey(child)

    if (key in counts) {
      key = key + ':' + counts[key]++
    } else {
      counts[key] = 1
    }

    indices[index] = key
    keys[key] = index
  }

  return {key: keys, index: indices}
}

function syntheticKey(node) {
  var props = {}
  var key

  for (key in node) {
    if (ignoredKeys.indexOf(key) === -1) {
      props[key] = node[key]
    }
  }

  return node.type + ':' + JSON.stringify(props)
}

function parent(value) {
  return node(value) && 'children' in value
}

function text(value) {
  return node(value) && 'value' in value
}

function node(value) {
  return object(value) && 'type' in value
}

},{"getprototypeof":1,"is-object":2,"unist-util-size":4,"x-is-array":5}]},{},[6])(6)
});
