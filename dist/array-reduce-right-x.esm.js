function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';
import toBoolean from 'to-boolean-x';
import requireObjectCoercible from 'require-object-coercible-x';
import methodize from 'simple-methodize-x';
var rr = [].reduceRight;
var nativeReduceR = typeof rr === 'function' && methodize(rr);

var test1 = function test1() {
  return attempt(function attemptee() {
    return nativeReduceR([], function iteratee(acc) {
      return acc;
    });
  }).threw;
};

var test2 = function test2() {
  var res = attempt(function attemptee() {
    return nativeReduceR(toObject('abc'), function iteratee(acc, c) {
      return acc + c;
    }, 'x');
  });
  return res.threw === false && res.value === 'xcba';
};

var test3 = function test3() {
  var res = attempt(function attemptee() {
    var args = function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }(1, 2, 3);

    return nativeReduceR(args, function iteratee(acc, arg) {
      return acc + arg;
    }, 1);
  });
  return res.threw === false && res.value === 7;
};

var test4 = function test4() {
  var res = attempt(function attemptee() {
    return nativeReduceR({
      0: 1,
      1: 2,
      3: 3,
      4: 4,
      length: 4
    }, function iteratee(acc, arg) {
      return acc + arg;
    }, 2);
  });
  return res.threw === false && res.value === 8;
};

var doc = typeof document !== 'undefined' && document;

var iteratee5 = function iteratee5(acc, node) {
  acc[acc.length] = node;
  return acc;
};

var test5 = function test5() {
  if (doc) {
    var fragment = doc.createDocumentFragment();
    var div = doc.createElement('div');
    fragment.appendChild(div);
    var res = attempt(function attemptee() {
      return nativeReduceR(fragment.childNodes, iteratee5, []);
    });
    return res.threw === false && res.value.length === 1 && res.value[0] === div;
  }

  return true;
};

var test6 = function test6() {
  var res = attempt(function attemptee() {
    return nativeReduceR('ab', function iteratee() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments[3];
    });
  });
  return res.threw === false && _typeof(res.value) === 'object';
}; // ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight


var isWorking = toBoolean(nativeReduceR) && test1() && test2() && test3() && test4() && test5() && test6();

var patchedReduceRight = function reduceRight(array, callBack
/* , initialValue */
) {
  requireObjectCoercible(array);
  assertIsFunction(callBack);
  /* eslint-disable-next-line prefer-rest-params */

  return arguments.length > 2 ? nativeReduceR(array, callBack, arguments[2]) : nativeReduceR(array, callBack);
};

export var implementation = function reduceRight(array, callBack
/* , initialValue */
) {
  var object = toObject(array); // If no callback function or if callback is not a callable function

  assertIsFunction(callBack);
  var iterable = splitIfBoxedBug(object);
  var length = toLength(iterable.length);
  var argsLength = arguments.length; // no value to return if no initial value, empty array

  if (length === 0 && argsLength < 3) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  var result;
  var i = length - 1;

  if (argsLength > 2) {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    result = arguments[2];
  } else {
    do {
      if (i in iterable) {
        result = iterable[i];
        i -= 1;
        break;
      } // if array contains no values, no initial value to return


      i -= 1;

      if (i < 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
    } while (true);
    /* eslint-disable-line no-constant-condition */

  }

  while (i >= 0) {
    if (i in iterable) {
      result = callBack(result, iterable[i], i, object);
    }

    i -= 1;
  }

  return result;
};
/**
 * This method applies a function against an accumulator and each value of the
 * array (from right-to-left) to reduce it to a single value..
 *
 * @param {Array} array - The array to iterate over.
 * @param {Function} callBack - Function to execute for each element.
 * @param {*} [initialValue] - Value to use as the first argument to the first
 *  call of the callback. If no initial value is supplied, the first element in
 *  the array will be used. Calling reduceRight on an empty array without an initial
 *  value is an error.
 * @throws {TypeError} If array is null or undefined.
 * @throws {TypeError} If callBack is not a function.
 * @throws {TypeError} If called on an empty array without an initial value.
 * @returns {*} The value that results from the reduction.
 */

var $reduceRight = isWorking ? patchedReduceRight : implementation;
export default $reduceRight;

//# sourceMappingURL=array-reduce-right-x.esm.js.map