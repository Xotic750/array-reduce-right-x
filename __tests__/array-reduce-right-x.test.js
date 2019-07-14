let reduceRight;

if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');

  if (typeof JSON === 'undefined') {
    JSON = {};
  }

  require('json3').runInContext(null, JSON);
  require('es6-shim');
  const es7 = require('es7-shim');
  Object.keys(es7).forEach(function(key) {
    const obj = es7[key];

    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  reduceRight = require('../../index.js');
} else {
  reduceRight = returnExports;
}

const createArrayLike = function(arr) {
  const o = {};
  Array.prototype.forEach.call(arr, function(e, i) {
    o[i] = e;
  });

  o.length = arr.length;

  return o;
};

const canDistinguish = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.
const undefinedIfNoSparseBug = canDistinguish
  ? undefined
  : {
      valueOf() {
        return 0;
      },
    };

describe('array', function() {
  let testSubject;

  beforeEach(function() {
    testSubject = [2, 3, undefinedIfNoSparseBug, true, 'hej', null, false, 0];
    delete testSubject[1];
  });

  describe('reduceRight', function() {
    beforeEach(function() {
      testSubject = [1, 2, 3];
    });

    it('is a function', function() {
      expect(typeof reduceRight).toBe('function');
    });

    it('should throw when array is null or undefined', function() {
      expect(function() {
        reduceRight();
      }).toThrow();

      expect(function() {
        reduceRight(void 0);
      }).toThrow();

      expect(function() {
        reduceRight(null);
      }).toThrow();
    });

    describe('array', function() {
      it('should pass the correct arguments to the callback', function() {
        const spy = jasmine.createSpy().andReturn(0);
        reduceRight(testSubject, spy);
        expect(spy.calls[0].args).toStrictEqual([3, 2, 1, testSubject]);
      });

      it('should start with the right initialValue', function() {
        const spy = jasmine.createSpy().andReturn(0);
        reduceRight(testSubject, spy, 0);
        expect(spy.calls[0].args).toStrictEqual([0, 3, 2, testSubject]);
      });

      it('should not affect elements added to the array after it has begun', function() {
        const arr = [1, 2, 3];
        let i = 0;
        reduceRight(arr, function(a, b) {
          i += 1;

          if (i <= 4) {
            arr.push(a + 3);
          }

          return b;
        });

        expect(arr).toStrictEqual([1, 2, 3, 6, 5]);

        expect(i).toBe(2);
      });

      it('should work as expected for empty arrays', function() {
        const spy = jasmine.createSpy();
        expect(function() {
          reduceRight([], spy);
        }).toThrow();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should work as expected for empty arrays with an initial value', function() {
        const spy = jasmine.createSpy();
        let result;

        result = reduceRight([], spy, '');
        expect(spy).not.toHaveBeenCalled();
        expect(result).toBe('');
      });

      it('should throw correctly if no callback is given', function() {
        expect(function() {
          reduceRight(testSubject);
        }).toThrow();
      });

      it('should return the expected result', function() {
        expect(
          reduceRight(testSubject, function(a, b) {
            return String(a || '') + String(b || '');
          }),
        ).toBe('321');
      });

      it('should not directly affect the passed array', function() {
        const copy = testSubject.slice();
        reduceRight(testSubject, function(a, b) {
          return a + b;
        });

        expect(testSubject).toStrictEqual(copy);
      });

      it('should skip non-set values', function() {
        delete testSubject[1];
        const visited = {};
        reduceRight(testSubject, function(a, b) {
          if (a) {
            visited[a] = true;
          }

          if (b) {
            visited[b] = true;
          }

          return 0;
        });

        expect(visited).toStrictEqual({1: true, 3: true});
      });

      it('should have the right length', function() {
        expect(testSubject.reduceRight).toHaveLength(1);
      });
    });

    describe('array-like objects', function() {
      beforeEach(function() {
        testSubject = createArrayLike(testSubject);
      });

      it('should pass the correct arguments to the callback', function() {
        const spy = jasmine.createSpy().andReturn(0);
        reduceRight(testSubject, spy);
        expect(spy.calls[0].args).toStrictEqual([3, 2, 1, testSubject]);
      });

      it('should start with the right initialValue', function() {
        const spy = jasmine.createSpy().andReturn(0);
        reduceRight(testSubject, spy, 0);
        expect(spy.calls[0].args).toStrictEqual([0, 3, 2, testSubject]);
      });

      it('should not affect elements added to the array after it has begun', function() {
        const arr = createArrayLike([1, 2, 3]);

        let i = 0;
        reduceRight(arr, function(a, b) {
          i += 1;

          if (i <= 4) {
            arr[i + 2] = a + 3;
          }

          return b;
        });

        expect(arr).toStrictEqual({
          0: 1,
          1: 2,
          2: 3,
          3: 6,
          4: 5,
          length: 3, // does not get updated on property assignment
        });

        expect(i).toBe(2);
      });

      it('should work as expected for empty arrays', function() {
        const spy = jasmine.createSpy();
        expect(function() {
          reduceRight({length: 0}, spy);
        }).toThrow();
        expect(spy).not.toHaveBeenCalled();
      });

      it('should throw correctly if no callback is given', function() {
        expect(function() {
          reduceRight(testSubject);
        }).toThrow();
      });

      it('should return the expected result', function() {
        expect(
          reduceRight(testSubject, function(a, b) {
            return String(a || '') + String(b || '');
          }),
        ).toBe('321');
      });

      it('should not directly affect the passed array', function() {
        const copy = createArrayLike(testSubject);
        reduceRight(testSubject, function(a, b) {
          return a + b;
        });

        expect(testSubject).toStrictEqual(copy);
      });

      it('should skip non-set values', function() {
        delete testSubject[1];
        const visited = {};
        reduceRight(testSubject, function(a, b) {
          if (a) {
            visited[a] = true;
          }

          if (b) {
            visited[b] = true;
          }

          return 0;
        });

        expect(visited).toStrictEqual({1: true, 3: true});
      });
    });

    it('should have a boxed object as list argument of callback', function() {
      let actual;
      // eslint-disable-next-line max-params
      reduceRight('foo', function(accumulator, item, index, list) {
        actual = list;
      });

      expect(typeof actual).toBe('object');
      expect(Object.prototype.toString.call(actual)).toBe('[object String]');
    });
  });
});
