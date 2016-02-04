levenshtein-sse
===============

[![NPM Version](https://img.shields.io/npm/v/levenshtein-sse.svg?style=flat)](https://npmjs.org/package/levenshtein-sse)
[![NPM Downloads](https://img.shields.io/npm/dm/levenshtein-sse.svg?style=flat)](https://npmjs.org/package/levenshtein-sse)
[![Build Status](https://travis-ci.org/addaleax/node-levenshtein-sse.svg?style=flat&branch=master)](https://travis-ci.org/addaleax/node-levenshtein-sse?branch=master)
[![Dependency Status](https://david-dm.org/addaleax/node-levenshtein-sse.svg?style=flat)](https://david-dm.org/addaleax/node-levenshtein-sse)
[![devDependency Status](https://david-dm.org/addaleax/node-levenshtein-sse/dev-status.svg?style=flat)](https://david-dm.org/addaleax/node-levenshtein-sse#info=devDependencies)

Node.js bindings for the [levenshtein-sse](https://github.com/addaleax/levenshtein-sse) lib.

Calculates the Levenshtein distance in native code, as fast as it gets.
Supports:
 * Strings, Buffers, Typed Arrays, Arrays, etc.
 * SIMD instructions support (when available)
 * Fallback to a very fast JS implementation
 * Async functions with callbacks or Promises

Usage
=====

```js
const levenshtein = require('levenshtein-sse');

levenshtein('levenshtein', 'frankenstein') // => 6
levenshtein.async('levenshtein', 'frankenstein', (err, result) => ...)
levenshtein.asyncPromise('levenshtein', 'frankenstein').then(result => ...)
```

License
=======

MIT
