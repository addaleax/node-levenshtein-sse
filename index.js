'use strict';

let native = null;
try {
  native = require('./build/Release/levenshtein_sse');
} catch (e) {}

const leven = require('./leven/');
let sync, async;

if (!native) {
  sync = leven;
  async = (a, b, cb) => cb(null, leven(a, b));
} else {
  sync = (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return native.levenshteinSyncStr(a, b);
    }
    
    if (Buffer.isBuffer(a) && Buffer.isBuffer(b) && a instanceof Uint8Array) {
      // Since Node.js v4, Buffers are Uint8Array instances
      return native.levenshteinSyncUint8(a, b);
    }
    
    const objNameA = Object.prototype.toString.call(a);
    const objNameB = Object.prototype.toString.call(b);
    
    if (objNameA !== objNameB) {
      return leven(a, b);
    }
    
    switch (objNameA.toLowerCase()) {
      case '[object int8array]':
      case '[object uint8clampedarray]':
      case '[object uint8array]':   return native.levenshteinSyncUint8 (a, b);
      case '[object int16array]':
      case '[object uint16array]':  return native.levenshteinSyncUint16(a, b);
      case '[object int32array]':
      case '[object uint32array]':  return native.levenshteinSyncUint32(a, b);
      case '[object float32array]': return native.levenshteinSyncFloat32(a, b);
      case '[object float64array]': return native.levenshteinSyncFloat64(a, b);
      default: return leven(a, b);
    }
  };
  
  async = (a, b, cb) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return native.levenshteinAsyncStr(a, b, cb);
    }
    
    if (Buffer.isBuffer(a) && Buffer.isBuffer(b) && a instanceof Uint8Array) {
      // Since Node.js v4, Buffers are Uint8Array instances
      return native.levenshteinAsyncUint8(a, b, cb);
    }
    
    const objNameA = Object.prototype.toString.call(a);
    const objNameB = Object.prototype.toString.call(b);
    
    if (objNameA !== objNameB) {
      return cb(null, leven(a, b));
    }
    
    switch (objNameA.toLowerCase()) {
      case '[object int8array]':
      case '[object uint8clampedarray]':
      case '[object uint8array]':   return native.levenshteinAsyncUint8 (a, b, cb);
      case '[object int16array]':
      case '[object uint16array]':  return native.levenshteinAsyncUint16(a, b, cb);
      case '[object int32array]':
      case '[object uint32array]':  return native.levenshteinAsyncUint32(a, b, cb);
      case '[object float32array]': return native.levenshteinAsyncFloat32(a, b, cb);
      case '[object float64array]': return native.levenshteinAsyncFloat64(a, b, cb);
      default: return cb(null, leven(a, b));
    }
  };
  
} 

module.exports = sync;
module.exports.sync = sync;
module.exports.async = async;
module.exports.asyncPromise = (a, b) => 
  new Promise((resolve, reject) => async(a, b,
    (err, res) => err ? reject(err) : resolve(res)));
