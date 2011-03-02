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
            return new hypher.Hypher(language);
        },
        'word: ': dictionary
    },
    'trie': {
        topic: function () {
            return new hypher.Hypher({
                patterns: {
                    "2": "a1b2",
                    "3": "a2bb3c"
                }
            });
        },
        'trie is correctly generated': function (h) {
            assert.deepEqual(h.trie, {
                "a": {
                    _points: [0, 1],
                    "b": {
                        _points: [0, 2, 0]
                    }
                },
                "b": {
                    _points: [0, 2],
                    "c": {
                        _points: [0, 3, 0]
                    }
                }
            });
        }
    },
    'hyphenate with soft hyphens': {
        topic: function () {
            return new hypher.Hypher(language);
        },
        'hyph\u00ADen': hyphenatesTo(['hyph\u00ADen'])
    },
    'hyphenate with en-dash, hyphen-minus or hyphen': {
        topic: function () {
            return new hypher.Hypher(language);
        },
        // The resulting hyphenation might look odd, but a minus-hyphen, en-dash, or hyphen will
        // be broken by the browser, so we don't need to insert a soft hyphen in that position.
        'bootstrapping-brainstorm': hyphenatesTo(['boot', 'strap', 'ping-brain', 'storm']),

        // hyphen-minus
        'bootstrapping\u002Dbrainstorm': hyphenatesTo(['boot', 'strap', 'ping\u002Dbrain', 'storm']),

        // hyphen
        'bootstrapping\u2010brainstorm': hyphenatesTo(['boot', 'strap', 'ping\u2010brain', 'storm']),

        // en-dash
        'bootstrapping\u2013brainstorm': hyphenatesTo(['boot', 'strap', 'ping\u2013brain', 'storm']),
    },
    'hyphenate with exceptions': {
        topic: function () {
            var l = Object.create(language);
            l.exceptions = 'bootstrapping, brainstorm';
            return new hypher.Hypher(l);
        },
        'bootstrapping': hyphenatesTo(['bootstrapping']),
        'brainstorm': hyphenatesTo(['brainstorm'])
    },
    'hyphenate with exceptions (without space)': {
        topic: function () {
            var l = Object.create(language);
            l.exceptions = 'bootstrapping,brainstorm';
            return new hypher.Hypher(l);
        },
        'bootstrapping': hyphenatesTo(['bootstrapping']),
        'brainstorm': hyphenatesTo(['brainstorm'])
    }
}).export(module);
