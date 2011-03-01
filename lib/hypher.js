function Hypher(language, options) {
    this.trie = this.createTrie(language.patterns);
    this.leftMin = language.leftmin;
    this.rightMin = language.rightmin;

    this.minLength = (options && options.minLength) || 4;
}

Hypher.prototype.createTrie = function (patternObject) {
    var size = 0,
        tree = {},
        patterns;

    for (size in patternObject) {
        if (patternObject.hasOwnProperty(size)) {
            patterns = patternObject[size].match(new RegExp('.{1,' + (+size) + '}', 'g'));

            patterns.forEach(function (pattern) {
                var chars = pattern.replace(/[0-9]/g, '').split(''),
                    points = pattern.split(/\D/),
                    t = tree;

                chars.forEach(function (c) {
                    if (!t[c]) {
                        t[c] = {};
                    }
                    t = t[c];
                });

                points = points.map(function (p) {
                    return p || 0;
                });

                t._points = points;
            });
        }
    }
    return tree;
};

Hypher.prototype.hyphenate = function (word) {
    var characters,
        originalCharacters,
        i,
        j,
        k,
        node,
        points = [],
        wordLength,
        nodePoints,
        nodePointsLength,
        m = Math.max,
        trie = this.trie,
        result = [''],
        parts,
        part,
        hyphenatedParts,
        partsLength;

    if (word.length <= this.minLength) {
        return [word];
    }

    if (word.indexOf('\u00AD') !== -1) {
        return [word];
    }

    if (/[\u002D\u2010\u2013]/.test(word)) {
        parts = word.split(/([\u002D\u2010\u2013])/g);
        partsLength = parts.length;

        for (i = 0; i < partsLength; i += 1) {
            part = parts[i];
            if (['\u002D', '\u2010', '\u2013'].indexOf(part) === -1) {
                hyphenatedParts = this.hyphenate(part);
                for (j = 0; j < hyphenatedParts.length; j += 1) {
                    if (j === 0) {
                        result[result.length - 1] += hyphenatedParts[j];
                    } else {
                        result.push(hyphenatedParts[j]);
                    }
                }
            } else {
                result[result.length - 1] += part;
            }
        }
        return result;
    }

    word = '.' + word + '.';

    characters = word.toLowerCase().split('');
    originalCharacters = word.split('');
    wordLength = characters.length;

    for (i = 0; i < wordLength; i += 1) {
        points[i] = 0;
    }

    for (i = 0; i < wordLength; i += 1) {
        node = trie;
        for (j = i; j < wordLength; j += 1) {
            node = node[characters[j]];

            if (node) {
                nodePoints = node._points;
                if (nodePoints) {
                    for (k = 0, nodePointsLength = nodePoints.length; k < nodePointsLength; k += 1) {
                        points[i + k] = m(points[i + k], nodePoints[k]);
                    }
                }
            } else {
                break;
            }
        }
    }

    for (i = 1; i < wordLength - 1; i += 1) {
        if (i > this.leftMin && i < (wordLength - this.rightMin) && points[i] % 2) {
            result.push(originalCharacters[i]);
        } else {
            result[result.length - 1] += originalCharacters[i];
        }
    }

    return result;
};

/*global exports*/
if (typeof exports !== 'undefined') {
    exports.Hypher = Hypher;
}
