var hypher = require('../lib/hypher.js'),
    vows = require('vows'),
    assert = require('assert'),
    data = require('./data.js'),
    words = data.words,
    language = data.language,
    dictionary = {};

function assertHyphenation(hyphenation) {
    return function (topic) {
        assert.deepEqual(topic, hyphenation);
    };
}

function hyphenate(word) {
    return function (h) {
        return h.hyphenate(word);
    };
}

function hyphenatesTo(hyphenation, i) {
    var context = {
        topic: function (h) {
            return h.hyphenate(this.context.name);
        }
    };

    context['Should hyphenate to: ' + hyphenation.join('\u2022')] = assertHyphenation(hyphenation);

    return context;
}

words.forEach(function (word) {
    var w = word.split('=');
    dictionary[w.join('')] = hyphenatesTo(w);
});

vows.describe('Hypher').addBatch({
    'hyphenate ': {
        topic: function () {
            return new hypher.Hypher(language, {
                minLength: 4
            });
        },
        'word: ': dictionary
    }
}).export(module);
