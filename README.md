<a
  href="https://travis-ci.org/Xotic750/array-reduce-right-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/array-reduce-right-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a
  href="https://david-dm.org/Xotic750/array-reduce-right-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-reduce-right-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/array-reduce-right-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-reduce-right-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a
  href="https://badge.fury.io/js/array-reduce-right-x"
  title="npm version">
<img src="https://badge.fury.io/js/array-reduce-right-x.svg"
  alt="npm version" height="18">
</a>
<a
  href="https://www.jsdelivr.com/package/npm/array-reduce-right-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/array-reduce-right-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>
<a
  href="https://bettercodehub.com/results/Xotic750/array-reduce-right-x"
  title="bettercodehub score">
<img src="https://bettercodehub.com/edge/badge/Xotic750/array-reduce-right-x?branch=master"
  alt="bettercodehub score" height="18">
</a>
<a
  href="https://coveralls.io/github/Xotic750/array-reduce-right-x?branch=master"
  title="Coverage Status">
<img src="https://coveralls.io/repos/github/Xotic750/array-reduce-right-x/badge.svg?branch=master"
  alt="Coverage Status" height="18">
</a>

<a name="module_array-reduce-right-x"></a>

## array-reduce-right-x

Reduce an array (from right to left) to a single value.

<a name="exp_module_array-reduce-right-x--module.exports"></a>

### `module.exports` ⇒ <code>\*</code> ⏏

This method applies a function against an accumulator and each value of the
array (from right-to-left) to reduce it to a single value..

**Kind**: Exported member  
**Returns**: <code>\*</code> - The value that results from the reduction.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.
- <code>TypeError</code> If callBack is not a function.
- <code>TypeError</code> If called on an empty array without an initial value.

| Param          | Type                  | Description                                                                                                                                                                                                                     |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| array          | <code>array</code>    | The array to iterate over.                                                                                                                                                                                                      |
| callBack       | <code>function</code> | Function to execute for each element.                                                                                                                                                                                           |
| [initialValue] | <code>\*</code>       | Value to use as the first argument to the first call of the callback. If no initial value is supplied, the first element in the array will be used. Calling reduceRight on an empty array without an initial value is an error. |

**Example**

```js
import reduceRight from 'array-reduce-right-x';

console.log(
  reduceRight(
    [0, 1, 2, 3],
    function(a, b) {
      return a + b;
    },
    0,
  ),
); // sum is 6
```
