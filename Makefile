.PHONY : all clean

patterns := $(wildcard patterns/*.js)

all: dist/jquery.hypher.js $(patterns)

dist/jquery.hypher.js: lib/hypher.browser.pre.js lib/hypher.js lib/hypher.browser.post.js lib/jquery.hypher.js
	@mkdir -p dist
	cat $+ > $@ 

$(patterns): lib/patterns.browser.pre.js lib/patterns.browser.post.js
	@mkdir -p dist/patterns
	cat lib/patterns.browser.pre.js $@ lib/patterns.browser.post.js > dist/$@ 

clean:
	rm -rf dist
