# Changelog

## v0.4.0 (2019-04-29)

#### :boom: Breaking Change
* [#95](https://github.com/simplabs/ember-hbs-minifier/pull/95) Drop support for Ember.js below v3.4.0 ([@Turbo87](https://github.com/Turbo87))
* [#93](https://github.com/simplabs/ember-hbs-minifier/pull/93) Drop support for Node.js 6 ([@Turbo87](https://github.com/Turbo87))
* [#35](https://github.com/simplabs/ember-hbs-minifier/pull/35) Drop support for Node.js 4 ([@Turbo87](https://github.com/Turbo87))
* [#34](https://github.com/simplabs/ember-hbs-minifier/pull/34) CI: Change Node.js to v6 ([@mike-north](https://github.com/mike-north))

#### :memo: Documentation
* [#109](https://github.com/simplabs/ember-hbs-minifier/pull/109) Update `package.json` metadata ([@Turbo87](https://github.com/Turbo87))
* [#97](https://github.com/simplabs/ember-hbs-minifier/pull/97) README: Add "Compatibility" section ([@Turbo87](https://github.com/Turbo87))
* [#33](https://github.com/simplabs/ember-hbs-minifier/pull/33) Add repo url ([@ctjhoa](https://github.com/ctjhoa))

#### :house: Internal
* [#107](https://github.com/simplabs/ember-hbs-minifier/pull/107) Replace `object-hash` with `hash-obj` ([@Turbo87](https://github.com/Turbo87))
* [#106](https://github.com/simplabs/ember-hbs-minifier/pull/106) Cleanup `package.json` file ([@Turbo87](https://github.com/Turbo87))
* [#105](https://github.com/simplabs/ember-hbs-minifier/pull/105) Specify individual AST plugin config per test ([@Turbo87](https://github.com/Turbo87))
* [#104](https://github.com/simplabs/ember-hbs-minifier/pull/104) CI: Run unit tests with coverage reporting ([@Turbo87](https://github.com/Turbo87))
* [#103](https://github.com/simplabs/ember-hbs-minifier/pull/103) Simplifications ([@Turbo87](https://github.com/Turbo87))
* [#102](https://github.com/simplabs/ember-hbs-minifier/pull/102) Include original template in snapshot ([@Turbo87](https://github.com/Turbo87))
* [#101](https://github.com/simplabs/ember-hbs-minifier/pull/101) Remove the unnecessary `loc` properties from the AST snapshots ([@Turbo87](https://github.com/Turbo87))
* [#100](https://github.com/simplabs/ember-hbs-minifier/pull/100) Use `multidep` to test against multiple `@glimmer/syntax` versions ([@Turbo87](https://github.com/Turbo87))
* [#99](https://github.com/simplabs/ember-hbs-minifier/pull/99) Replace `ember-cli-eslint` with regular ESLint ([@Turbo87](https://github.com/Turbo87))
* [#98](https://github.com/simplabs/ember-hbs-minifier/pull/98)  CI: Use dedicated jobs for Node.js and Ember tests  ([@Turbo87](https://github.com/Turbo87))
* [#96](https://github.com/simplabs/ember-hbs-minifier/pull/96) Remove jQuery usage ([@Turbo87](https://github.com/Turbo87))
* [#94](https://github.com/simplabs/ember-hbs-minifier/pull/94) Update tests to "new" testing APIs ([@Turbo87](https://github.com/Turbo87))
* [#46](https://github.com/simplabs/ember-hbs-minifier/pull/46) Improve CI configuration ([@Turbo87](https://github.com/Turbo87))
* [#32](https://github.com/simplabs/ember-hbs-minifier/pull/32) Update `ember-cli` to v2.18.2 ([@Turbo87](https://github.com/Turbo87))
* [#31](https://github.com/simplabs/ember-hbs-minifier/pull/31) Update `ember-cli-eslint` to v4.2.3 ([@Turbo87](https://github.com/Turbo87))
* [#30](https://github.com/simplabs/ember-hbs-minifier/pull/30) Update secondary dependencies ([@Turbo87](https://github.com/Turbo87))
* [#29](https://github.com/simplabs/ember-hbs-minifier/pull/29) Remove unused dependencies ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Camille TJHOA ([@ctjhoa](https://github.com/ctjhoa))
- Mike North ([@mike-north](https://github.com/mike-north))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v0.3.0 (2018-03-14)

#### :rocket: Enhancement
* [#14](https://github.com/simplabs/ember-hbs-minifier/pull/14) Minify Templates based on a white list ([@siva-sundar](https://github.com/siva-sundar))

#### Committers: 1
- sivakumar ([@siva-sundar](https://github.com/siva-sundar))


## v0.2.0 (2018-02-05)

#### :rocket: Enhancement
* [#17](https://github.com/simplabs/ember-hbs-minifier/pull/17) Move ember-cli-babel to devDependencies ([@topaxi](https://github.com/topaxi))
* [#16](https://github.com/simplabs/ember-hbs-minifier/pull/16) Collapse multiple leading and trailing whitespaces into a single whitespace / Does not collapse multiple &nbsp; ([@siva-sundar](https://github.com/siva-sundar))

#### :memo: Documentation
* [#19](https://github.com/simplabs/ember-hbs-minifier/pull/19) fix copyright notice ([@marcoow](https://github.com/marcoow))
* [#1](https://github.com/simplabs/ember-hbs-minifier/pull/1) Update README.md ([@xomaczar](https://github.com/xomaczar))

#### :house: Internal
* [#27](https://github.com/simplabs/ember-hbs-minifier/pull/27) Use RFC176 imports ([@Turbo87](https://github.com/Turbo87))
* [#23](https://github.com/simplabs/ember-hbs-minifier/pull/23) Update `ember-cli-mocha` to v0.15.0 ([@Turbo87](https://github.com/Turbo87))
* [#25](https://github.com/simplabs/ember-hbs-minifier/pull/25) Update `ember-cli` to v2.12.3 ([@Turbo87](https://github.com/Turbo87))
* [#26](https://github.com/simplabs/ember-hbs-minifier/pull/26) Update `ember-cli-mocha` to v0.14.5 ([@Turbo87](https://github.com/Turbo87))
* [#24](https://github.com/simplabs/ember-hbs-minifier/pull/24) Update `ember-cli-babel` to v6.11.0 ([@Turbo87](https://github.com/Turbo87))
* [#20](https://github.com/simplabs/ember-hbs-minifier/pull/20) test with headless chrome ([@marcoow](https://github.com/marcoow))
* [#11](https://github.com/simplabs/ember-hbs-minifier/pull/11) Use Jest to run tests in Node ([@Turbo87](https://github.com/Turbo87))
* [#12](https://github.com/simplabs/ember-hbs-minifier/pull/12) Use Yarn instead of outdated npm ([@Turbo87](https://github.com/Turbo87))
* [#8](https://github.com/simplabs/ember-hbs-minifier/pull/8) Update "ember-cli" to v2.11.0 ([@Turbo87](https://github.com/Turbo87))
* [#7](https://github.com/simplabs/ember-hbs-minifier/pull/7) CI: Automatically publish tags to NPM ([@Turbo87](https://github.com/Turbo87))
* [#5](https://github.com/simplabs/ember-hbs-minifier/pull/5) ESLint: Use "eslint-config-simplabs" ([@Turbo87](https://github.com/Turbo87))

#### Committers: 5
- Andrey Khomenko ([@xomaczar](https://github.com/xomaczar))
- Damian Senn ([@topaxi](https://github.com/topaxi))
- Marco Otte-Witte ([@marcoow](https://github.com/marcoow))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
- sivakumar ([@siva-sundar](https://github.com/siva-sundar))


## v0.1.0 (2017-01-24)

:rocket: Initial Release

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))
