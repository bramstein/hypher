# Hypher

A small and fast JavaScript hyphenation engine compatible with Hyphenator.js language objects.

## Usage
Simply create an instance of Hypher by giving it a language object and (optionally) an options object:

    var h = new Hypher(languageObject, options);

You can then call the hyphenate method:

    // returns ['hy', 'phen', 'ation']
    h.hyphenate('hyphenation');

Note that an instance of the `Hypher` class should only be created once for each language object.

The language object should contain:

    {
      // The minimum number of unhyphenated characters at the left of each word. (required)
      leftmin: <number>, 

      // The minimum number of unhyphenated characters at the right of each word. (required)
      rightmin: <number>,

      // A comma separated list of hyphenation exceptions. Custom hyphenations
      // can be specified using '=' as hyphenation character. (Optional)
      exceptions: <string>,

      // A patterns object (required)
      patterns: {}
    }

Note that language objects are identical to the format used by Hyphenator.js. The only difference is how they are used. Hypher requires you  to manually pass a language object, whereas Hyphenator.js automatically "registers" a language object. Language objects can be found in the [Hyphenator.js source repository](http://code.google.com/p/hyphenator/source/browse/trunk#trunk%2Fpatterns).

The options object may be empty or contain:

    {
      // The minimum length of a word to be considered for hyphenation. (Optional, defaults to 4)
      minLength: <number>,

      // An array of compound separators (Optional, defaults to: hyphen, hyphen-minus, and en-dash)
      compoundSeparators: Array.<string>,

      // The any character used in the pattern file (Optional, defaults to "_". Note that Hyphenator.js
      // uses "_", but many other pattern files use ".".)
      anyChar: <string>
    }

The hyphenation engine can also be used from Node.js:

    var hyphenation = new require('hypher'),
        en_usHyphenator = new hyphenation.Hypher(pattern);

## License
Licensed under the three clause BSD license (see BSD.txt.)

## See also
[Hyphenator.js](http://code.google.com/p/hyphenator/)
