'use strict';

const levenshteinSSE = require('../');
const leven = require('leven');
const led = require('levenshtein-edit-distance');

const implementations = {
  'levenshtein-sse': levenshteinSSE,
  'leven': leven,
  'levenshtein-edit-distance': led
};

const sizes = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
const randomData1 = generateRandomString('ABCD', Math.max.apply(Math, sizes));
const randomData2 = generateRandomString('ABCD', Math.max.apply(Math, sizes));

for (let size of sizes) {
  const data1 = randomData1.substr(0, size);
  const data2 = randomData2.substr(0, size);
  
  suite('Random ' + size, function() {
    for (let impl of Object.keys(implementations)) {
      bench(impl, function() {
        const fn = implementations[impl];
        
        fn(data1, data2);
      });
    }
  });
}

function generateRandomString(characters, size) {
  if (!size) {
    return '';
  }
  
  const char = characters[Math.floor(Math.random() * characters.length)];
  
  return generateRandomString(characters, size-1) + char;
}
