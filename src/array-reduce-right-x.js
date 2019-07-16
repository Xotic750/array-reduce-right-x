import attempt from 'attempt-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import toLength from 'to-length-x';
import toObject from 'to-object-x';
import assertIsFunction from 'assert-is-function-x';

const ArrayCtr = [].constructor;
const castObject = {}.constructor;
const nativeReduceR = typeof ArrayCtr.prototype.reduceRight === 'function' && ArrayCtr.prototype.reduceRight;

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
let isWorking;

if (nativeReduceR) {
  isWorking = attempt.call([], nativeReduceR, (acc) => {
    return acc;
  }).threw;

  let res;

  if (isWorking) {
    res = attempt.call(
      castObject('abc'),
      nativeReduceR,
      (acc, c) => {
        return acc + c;
      },
      'x',
    );

    isWorking = res.threw === false && res.value === 'xcba';
  }

  if (isWorking) {
    res = attempt.call(
      (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })(1, 2, 3),
      nativeReduceR,
      (acc, arg) => {
        return acc + arg;
      },
      1,
    );

    isWorking = res.threw === false && res.value === 7;
  }

  if (isWorking) {
    res = attempt.call(
      {
        0: 1,
        1: 2,
        3: 3,
        4: 4,
        length: 4,
      },
      nativeReduceR,
      (acc, arg) => {
        return acc + arg;
      },
      2,
    );

    isWorking = res.threw === false && res.value === 8;
  }

  if (isWorking) {
    const doc = typeof document !== 'undefined' && document;

    if (doc) {
      const fragment = doc.createDocumentFragment();
      const div = doc.createElement('div');
      fragment.appendChild(div);
      res = attempt.call(
        fragment.childNodes,
        nativeReduceR,
        (acc, node) => {
          acc[acc.length] = node;

          return acc;
        },
        [],
      );

      isWorking = res.threw === false && res.value.length === 1 && res.value[0] === div;
    }
  }

  if (isWorking) {
    res = attempt.call('ab', nativeReduceR, (_, __, ___, list) => {
      return list;
    });

    isWorking = res.threw === false && typeof res.value === 'object';
  }
}

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
let $reduceRight;

if (nativeReduceR && isWorking) {
  $reduceRight = function reduceRight(array, callBack /* , initialValue */) {
    const args = [callBack];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeReduceR.apply(array, args);
  };
} else {
  $reduceRight = function reduceRight(array, callBack /* , initialValue */) {
    const object = toObject(array);
    // If no callback function or if callback is not a callable function
    assertIsFunction(callBack);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);
    const argsLength = arguments.length;

    // no value to return if no initial value, empty array
    if (length === 0 && argsLength < 3) {
      throw new TypeError('reduceRight of empty array with no initial value');
    }

    let result;
    let i = length - 1;

    if (argsLength > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      result = arguments[2];
    } else {
      do {
        if (i in iterable) {
          result = iterable[i];
          i -= 1;
          break;
        }

        // if array contains no values, no initial value to return
        i -= 1;

        if (i < 0) {
          throw new TypeError('reduceRight of empty array with no initial value');
        }
      } while (true); /* eslint-disable-line no-constant-condition */
    }

    while (i >= 0) {
      if (i in iterable) {
        result = callBack(result, iterable[i], i, object);
      }

      i -= 1;
    }

    return result;
  };
}

const rr = $reduceRight;

export default rr;
