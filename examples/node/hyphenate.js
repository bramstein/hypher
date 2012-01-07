// Usage: node hyphenate.js [word] ...
var hypher = require('../../lib/hypher'),
    en_us = require('../../patterns/en-us'),
    h = new hypher.Hypher(en_us),
    words = process.argv.filter(function (_, i) {
        return i > 1;
    }),
    output = words.map(function (v) {
        return h.hyphenate(v).join('\u2022');
    });
    
console.log(output.join(' '));