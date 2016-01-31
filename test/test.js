// Some test strings from https://github.com/sindresorhus/leven/blob/master/test.js
// (Sindre Sorhus, MIT)

'use strict';

const levenshtein = require('../');
const fs = require('fs');
const assert = require('assert');

const TypedArrays = {
  "Int8Array":         Int8Array,
  "Uint8Array":        Uint8Array,
  "Uint8ClampedArray": Uint8ClampedArray,
  "Int16Array":        Int16Array,
  "Uint16Array":       Uint16Array,
  "Int32Array":        Int32Array,
  "Uint32Array":       Uint32Array,
  "Float32Array":      Float32Array,
  "Float64Array":      Float64Array
};

const strings = [
  { a: 'a', b: 'b', r: 1 },
  { a: 'ab', b: 'ac', r: 1 },
  { a: 'ac', b: 'bc', r: 1 },
  { a: 'abc', b: 'axc', r: 1 },
  { a: 'kitten', b: 'sitting', r: 3 },
  { a: 'xabxcdxxefxgx', b: '1ab2cd34ef5g6', r: 6 },
  { a: 'cat', b: 'cow', r: 2 },
  { a: 'xabxcdxxefxgx', b: 'abcdefg', r: 6 },
  { a: 'javawasneat', b: 'scalaisgreat', r: 7 },
  { a: 'example', b: 'samples', r: 3 },
  { a: 'sturgeon', b: 'urgently', r: 6 },
  { a: 'levenshtein', b: 'frankenstein', r: 6 },
  { a: 'distance', b: 'difference', r: 5 },
  { a: '因為我是中國人所以我會說中文', b: '因為我是英國人所以我會說英文', r: 2 },
];

const primes = [ 2, 3, 5, 7, 11, 13, 17, 19 ];
const odds   = [ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19 ];

const lipsum1 = fs.readFileSync('test/assets/loremipsum-1.txt');
const lipsum2 = fs.readFileSync('test/assets/loremipsum-2.txt');

const longStrings = [
  { a: lipsum1, b: lipsum2, r: 3072 },
  { a: lipsum1.toString('utf8'), b: lipsum2.toString('utf8'), r: 3071 }
];

describe('sync', function() {
  it('can compute Levenshtein distances of strings', function() {
    for (let info of strings) {
      assert.strictEqual(levenshtein(info.a, info.b), info.r);
      assert.strictEqual(levenshtein.sync(info.a, info.b), info.r);
    }
  });
  
  it('can compute Levenshtein distances of long strings', function() {
    this.timeout(10000);
    
    for (let info of longStrings) {
      assert.strictEqual(levenshtein(info.a, info.b), info.r);
      assert.strictEqual(levenshtein.sync(info.a, info.b), info.r);
    }
  });
  
  it('can compute Levenshtein distances of Array instances', function() {
    assert.strictEqual(levenshtein(primes, odds), 3);
  });
  
  describe('can compute Levenshtein distances of typed arrays', function() {
    for (let name in TypedArrays) {
      it('can work with ' + name, function() {
        const primes_ = new TypedArrays[name](primes);
        const odds_   = new TypedArrays[name](odds);
        
        assert.strictEqual(levenshtein(primes_, odds_), 3);
      });
    }
  });
});

describe('asyncPromise', function() {
  it('can compute Levenshtein distances of strings', function() {
    return Promise.all(strings.map(info => {
      return levenshtein.asyncPromise(info.a, info.b).then(result => {
        assert.strictEqual(result, info.r);
      });
    }));
  });
  
  it('can compute Levenshtein distances of long strings', function() {
    this.timeout(10000);
    
    return Promise.all(longStrings.map(info => {
      return levenshtein.asyncPromise(info.a, info.b).then(result => {
        assert.strictEqual(result, info.r);
      });
    }));
  });
  
  it('can compute Levenshtein distances of Array instances', function() {
    return levenshtein.asyncPromise(primes, odds).then(res =>
      assert.strictEqual(res, 3));
  });
  
  describe('can compute Levenshtein distances of typed arrays', function() {
    for (let name in TypedArrays) {
      it('can work with ' + name, function() {
        const primes_ = new TypedArrays[name](primes);
        const odds_   = new TypedArrays[name](odds);
        
        return levenshtein.asyncPromise(primes_, odds_).then(res =>
          assert.strictEqual(res, 3));
      });
    }
  });
});

describe('async', function() {
  it('can compute Levenshtein distances of Array instances', function(done) {
    levenshtein.async(primes, odds, (err, res) => {
      assert.strictEqual(res, 3);
      done();
    });
  });
  
  describe('can compute Levenshtein distances of typed arrays', function() {
    for (let name in TypedArrays) {
      it('can work with ' + name, function(done) {
        const primes_ = new TypedArrays[name](primes);
        const odds_   = new TypedArrays[name](odds);
        
        levenshtein.async(primes_, odds_, (err, res) => {
          assert.strictEqual(res, 3);
          done();
        });
      });
    }
  });
});
