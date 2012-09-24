// Usage: node hyphenate.js [word] ...
var Hypher = require('hypher'),
    pattern = require('hyphenation.en-us'),
    h = new Hypher(pattern),
    words = process.argv.filter(function (_, i) {
        return i > 1;
    }),
    output = words.map(function (v) {
        return h.hyphenate(v).join('\u2027');
    });
    
console.log(output.join(' '));
