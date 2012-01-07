// Usage: node hyphenate.js [word] ...
var hypher = require('../../lib/index'),
    en = hypher.languages['en'],
    h = new hypher.Hypher(en),
    words = process.argv.filter(function (_, i) {
        return i > 1;
    }),
    output = words.map(function (v) {
        return h.hyphenate(v).join('\u2022');
    });
    
console.log(output.join(' '));