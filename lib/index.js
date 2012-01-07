var fs = require('fs'),
    Hypher = require('./hypher').Hypher;

module.exports = {
    Hypher: Hypher,
    languages: {}
};

fs.readdirSync('patterns').filter(function (path) {
    return /\.js$/g.test(path);
}).forEach(function (path) {
    var language = require('../patterns/' + path);
    if (typeof language.id === 'string') {
        language.id = [language.id];
    }
    language.id.forEach(function (id) {
        module.exports.languages[id] = language;
    });
});