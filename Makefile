.PHONY : all clean

all: dist/jquery.hypher.js

dist/jquery.hypher.js: lib/hypher.browser.pre.js lib/hypher.js lib/hypher.browser.post.js lib/jquery.hypher.js
	@mkdir -p dist
	cat $+ > $@ 

clean:
	rm -rf dist
