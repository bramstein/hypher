var Hypher = require('../lib/hypher'),
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

function hyphenatesTextTo(hyphenation) {
    var context = {
        topic: function (h) {
            return h.hyphenateText(this.context.name).split('\u00AD');
        }
    };

    context['Should hyphenate to: ' + hyphenation.join('\u2022')] = assertHyphenation(hyphenation);

    return context;
}

function hyphenatesTo(hyphenation) {
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
            return new Hypher(language);
        },
        'word: ': dictionary
    },
    'trie': {
        topic: function () {
            return new Hypher({
                patterns: {
                    "2": "a1b2",
                    "3": "a2bb3c"
                }
            });
        },
        'trie is correctly generated': function (h) {
            assert.deepEqual(h.trie, {
                97: {
                    _points: [0, 1],
                    98: {
                        _points: [0, 2, 0]
                    }
                },
                98: {
                    _points: [0, 2],
                    99: {
                        _points: [0, 3, 0]
                    }
                },
                _points: []
            });
        }
    },
    'hyphenate with soft hyphens': {
        topic: function () {
            return new Hypher(language);
        },
        'hyph\u00ADen': hyphenatesTo(['hyph\u00ADen'])
    },
    'hyphenate with en-dash, hyphen-minus, hyphen, or ZWNJ': {
        topic: function () {
            return new Hypher(language);
        },
        // The resulting hyphenation might look odd, but a minus-hyphen, en-dash, or hyphen will
        // be broken by the browser, so we don't need to insert a soft hyphen in that position.
        'bootstrapping-brainstorm-victories': hyphenatesTextTo(['boot', 'strap', 'ping-brain', 'storm-vic', 'to', 'ries']),

        // hyphen-minus
        'bootstrapping\u002Dbrainstorm-victories': hyphenatesTextTo(['boot', 'strap', 'ping\u002Dbrain', 'storm-vic', 'to', 'ries']),

        // hyphen
        'bootstrapping\u2010brainstorm-victories': hyphenatesTextTo(['boot', 'strap', 'ping\u2010brain', 'storm-vic', 'to', 'ries']),

        // en-dash
        'bootstrapping\u2013brainstorm-victories': hyphenatesTextTo(['boot', 'strap', 'ping\u2013brain', 'storm-vic', 'to', 'ries']),

        // ZWNJ
        'bootstrapping\u200Cbrainstorm-victories': hyphenatesTextTo(['boot', 'strap', 'ping\u200Cbrain', 'storm-vic', 'to', 'ries'])
    },
    'hyphenate, preserve case and punctuation': {
        topic: function () {
            return new Hypher(language);
        },
        'Hyphenation': hyphenatesTo(['Hy', 'phen', 'ation']),
        '!!!!!!!!': hyphenatesTo(['!!!!!!!!']),
        'Hyphenation!': hyphenatesTo(['Hy', 'phen', 'ation!'])
    },
    'hyphenate with exceptions': {
        topic: function () {
            var l = Object.create(language);
            l.exceptions = 'bootstrapping, brainstorm';
            return new Hypher(l);
        },
        'bootstrapping': hyphenatesTo(['bootstrapping']),
        'brainstorm': hyphenatesTo(['brainstorm'])
    },
    'hyphenate with exceptions (without space)': {
        topic: function () {
            var l = Object.create(language);
            l.exceptions = 'bootstrapping,brainstorm';
            return new Hypher(l);
        },
        'bootstrapping': hyphenatesTo(['bootstrapping']),
        'brainstorm': hyphenatesTo(['brainstorm'])
    },
    'hyphenate with custom points': {
        topic: function () {
            var l = Object.create(language);
            l.exceptions = 'bo=otstr=apping, brai-nstorm';
            return new Hypher(l);
        },
        'bootstrapping': hyphenatesTo(['bo', 'otstr', 'apping']),
        'brainstorm': hyphenatesTo(['brai', 'nstorm'])
    }
}).export(module);
