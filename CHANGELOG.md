# Changelog

## Release (2024-11-15)

ember-hbs-minifier 1.3.0 (minor)

#### :rocket: Enhancement
* `ember-hbs-minifier`
  * [#720](https://github.com/mainmatter/ember-hbs-minifier/pull/720) Fix DEPRECATION: The 'Program' visitor node is deprecated. Use 'Template' or 'Block' instead (node was 'Block') ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* `ember-hbs-minifier`
  * [#737](https://github.com/mainmatter/ember-hbs-minifier/pull/737) remove old release workflow file ([@mansona](https://github.com/mansona))
  * [#735](https://github.com/mainmatter/ember-hbs-minifier/pull/735) start using release-plan ([@mansona](https://github.com/mansona))
  * [#731](https://github.com/mainmatter/ember-hbs-minifier/pull/731) Split snapshot files between node12 and not-node-12, to support dependencies that have dropped node 12 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#730](https://github.com/mainmatter/ember-hbs-minifier/pull/730) Add another ignore for prettier support ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#723](https://github.com/mainmatter/ember-hbs-minifier/pull/723) Enforce some formatting ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#724](https://github.com/mainmatter/ember-hbs-minifier/pull/724) update github actions and use packageManager in package.json and fix CI ([@mansona](https://github.com/mansona))
  * [#574](https://github.com/mainmatter/ember-hbs-minifier/pull/574) Rebrand simplabs to Mainmatter ([@BobrImperator](https://github.com/BobrImperator))

#### Committers: 3
- Bartlomiej Dudzik ([@BobrImperator](https://github.com/BobrImperator))
- Chris Manson ([@mansona](https://github.com/mansona))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v1.2.0 (2022-04-13)

#### :rocket: Enhancement
* [#501](https://github.com/Mainmatter/ember-hbs-minifier/pull/501) Enable parallel file processing for `ember-cli-babel` ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v1.1.0 (2022-04-12)

#### :rocket: Enhancement
* [#498](https://github.com/Mainmatter/ember-hbs-minifier/pull/498) Ensure plugin works for inline template compilation and co-located components ([@boris-petrov](https://github.com/boris-petrov))

#### Committers: 1
- Boris Petrov ([@boris-petrov](https://github.com/boris-petrov))


## v1.0.0 (2022-04-11)

#### :boom: Breaking Change
* [#496](https://github.com/Mainmatter/ember-hbs-minifier/pull/496) Update peer requirements ([@Turbo87](https://github.com/Turbo87))
* [#235](https://github.com/Mainmatter/ember-hbs-minifier/pull/235) Adjust Ember.js support matrix to `~3.4.0 || ~3.8.0 || ~3.12.0 || >= 3.16.0` ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#495](https://github.com/Mainmatter/ember-hbs-minifier/pull/495) tests: Add `this.` prefix to templates ([@Turbo87](https://github.com/Turbo87))
* [#460](https://github.com/Mainmatter/ember-hbs-minifier/pull/460) Replace deprecated class-based AST transform plugin ([@Turbo87](https://github.com/Turbo87))
* [#459](https://github.com/Mainmatter/ember-hbs-minifier/pull/459) Enable Ember Octane features ([@Turbo87](https://github.com/Turbo87))
* [#458](https://github.com/Mainmatter/ember-hbs-minifier/pull/458) Add `ember-auto-import` dev dependency ([@Turbo87](https://github.com/Turbo87))
* [#457](https://github.com/Mainmatter/ember-hbs-minifier/pull/457) Remove unused `ember-cli-htmlbars-inline-precompile` dependency ([@Turbo87](https://github.com/Turbo87))
* [#451](https://github.com/Mainmatter/ember-hbs-minifier/pull/451) renovate: Update `pnpm` version automatically ([@Turbo87](https://github.com/Turbo87))
* [#447](https://github.com/Mainmatter/ember-hbs-minifier/pull/447) Replace Mocha with QUnit ([@Turbo87](https://github.com/Turbo87))
* [#446](https://github.com/Mainmatter/ember-hbs-minifier/pull/446) renovate: Disable for `@glimmer/syntax-*` dependencies ([@Turbo87](https://github.com/Turbo87))
* [#424](https://github.com/Mainmatter/ember-hbs-minifier/pull/424) Use `pnpm` package manager ([@Turbo87](https://github.com/Turbo87))
* [#425](https://github.com/Mainmatter/ember-hbs-minifier/pull/425) Update `ember-try` to v2 ([@Turbo87](https://github.com/Turbo87))
* [#423](https://github.com/Mainmatter/ember-hbs-minifier/pull/423) Remove unmaintained `multidep` dependency ([@Turbo87](https://github.com/Turbo87))
* [#418](https://github.com/Mainmatter/ember-hbs-minifier/pull/418) CI: Remove schedule trigger ([@Turbo87](https://github.com/Turbo87))
* [#419](https://github.com/Mainmatter/ember-hbs-minifier/pull/419) ember-try: Disable Ember.js 4.x scenarios ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v0.5.0 (2020-02-17)

#### :boom: Breaking Change
* [#221](https://github.com/Mainmatter/ember-hbs-minifier/pull/221) Drop support for Node 8 ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#195](https://github.com/Mainmatter/ember-hbs-minifier/pull/195) testem: Increase `browser_start_timeout` ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v0.4.1 (2019-11-23)

#### :rocket: Enhancement
* [#180](https://github.com/Mainmatter/ember-hbs-minifier/pull/180) Collapse whitespace in `class` attributes ([@Turbo87](https://github.com/Turbo87))

#### :bug: Bug Fix
* [#177](https://github.com/Mainmatter/ember-hbs-minifier/pull/177) Fix unintended attribute minification ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal
* [#178](https://github.com/Mainmatter/ember-hbs-minifier/pull/178) Update `ember-mocha` to v0.16.2 ([@Turbo87](https://github.com/Turbo87))
* [#181](https://github.com/Mainmatter/ember-hbs-minifier/pull/181) ESLint: Fix tests config ([@Turbo87](https://github.com/Turbo87))
* [#179](https://github.com/Mainmatter/ember-hbs-minifier/pull/179) Replace TravisCI with GitHub Actions ([@Turbo87](https://github.com/Turbo87))
* [#110](https://github.com/Mainmatter/ember-hbs-minifier/pull/110) CI: Skip unnecessary steps for `npm publish` job ([@Turbo87](https://github.com/Turbo87))

#### Committers: 1
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v0.4.0 (2019-04-29)

#### :boom: Breaking Change
* [#95](https://github.com/Mainmatter/ember-hbs-minifier/pull/95) Drop support for Ember.js below v3.4.0 ([@Turbo87](https://github.com/Turbo87))
* [#93](https://github.com/Mainmatter/ember-hbs-minifier/pull/93) Drop support for Node.js 6 ([@Turbo87](https://github.com/Turbo87))
* [#35](https://github.com/Mainmatter/ember-hbs-minifier/pull/35) Drop support for Node.js 4 ([@Turbo87](https://github.com/Turbo87))
* [#34](https://github.com/Mainmatter/ember-hbs-minifier/pull/34) CI: Change Node.js to v6 ([@mike-north](https://github.com/mike-north))

#### :memo: Documentation
* [#109](https://github.com/Mainmatter/ember-hbs-minifier/pull/109) Update `package.json` metadata ([@Turbo87](https://github.com/Turbo87))
* [#97](https://github.com/Mainmatter/ember-hbs-minifier/pull/97) README: Add "Compatibility" section ([@Turbo87](https://github.com/Turbo87))
* [#33](https://github.com/Mainmatter/ember-hbs-minifier/pull/33) Add repo url ([@ctjhoa](https://github.com/ctjhoa))

#### :house: Internal
* [#107](https://github.com/Mainmatter/ember-hbs-minifier/pull/107) Replace `object-hash` with `hash-obj` ([@Turbo87](https://github.com/Turbo87))
* [#106](https://github.com/Mainmatter/ember-hbs-minifier/pull/106) Cleanup `package.json` file ([@Turbo87](https://github.com/Turbo87))
* [#105](https://github.com/Mainmatter/ember-hbs-minifier/pull/105) Specify individual AST plugin config per test ([@Turbo87](https://github.com/Turbo87))
* [#104](https://github.com/Mainmatter/ember-hbs-minifier/pull/104) CI: Run unit tests with coverage reporting ([@Turbo87](https://github.com/Turbo87))
* [#103](https://github.com/Mainmatter/ember-hbs-minifier/pull/103) Simplifications ([@Turbo87](https://github.com/Turbo87))
* [#102](https://github.com/Mainmatter/ember-hbs-minifier/pull/102) Include original template in snapshot ([@Turbo87](https://github.com/Turbo87))
* [#101](https://github.com/Mainmatter/ember-hbs-minifier/pull/101) Remove the unnecessary `loc` properties from the AST snapshots ([@Turbo87](https://github.com/Turbo87))
* [#100](https://github.com/Mainmatter/ember-hbs-minifier/pull/100) Use `multidep` to test against multiple `@glimmer/syntax` versions ([@Turbo87](https://github.com/Turbo87))
* [#99](https://github.com/Mainmatter/ember-hbs-minifier/pull/99) Replace `ember-cli-eslint` with regular ESLint ([@Turbo87](https://github.com/Turbo87))
* [#98](https://github.com/Mainmatter/ember-hbs-minifier/pull/98)  CI: Use dedicated jobs for Node.js and Ember tests  ([@Turbo87](https://github.com/Turbo87))
* [#96](https://github.com/Mainmatter/ember-hbs-minifier/pull/96) Remove jQuery usage ([@Turbo87](https://github.com/Turbo87))
* [#94](https://github.com/Mainmatter/ember-hbs-minifier/pull/94) Update tests to "new" testing APIs ([@Turbo87](https://github.com/Turbo87))
* [#46](https://github.com/Mainmatter/ember-hbs-minifier/pull/46) Improve CI configuration ([@Turbo87](https://github.com/Turbo87))
* [#32](https://github.com/Mainmatter/ember-hbs-minifier/pull/32) Update `ember-cli` to v2.18.2 ([@Turbo87](https://github.com/Turbo87))
* [#31](https://github.com/Mainmatter/ember-hbs-minifier/pull/31) Update `ember-cli-eslint` to v4.2.3 ([@Turbo87](https://github.com/Turbo87))
* [#30](https://github.com/Mainmatter/ember-hbs-minifier/pull/30) Update secondary dependencies ([@Turbo87](https://github.com/Turbo87))
* [#29](https://github.com/Mainmatter/ember-hbs-minifier/pull/29) Remove unused dependencies ([@Turbo87](https://github.com/Turbo87))

#### Committers: 3
- Camille TJHOA ([@ctjhoa](https://github.com/ctjhoa))
- Mike North ([@mike-north](https://github.com/mike-north))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))


## v0.3.0 (2018-03-14)

#### :rocket: Enhancement
* [#14](https://github.com/Mainmatter/ember-hbs-minifier/pull/14) Minify Templates based on a white list ([@siva-sundar](https://github.com/siva-sundar))

#### Committers: 1
- sivakumar ([@siva-sundar](https://github.com/siva-sundar))


## v0.2.0 (2018-02-05)

#### :rocket: Enhancement
* [#17](https://github.com/Mainmatter/ember-hbs-minifier/pull/17) Move ember-cli-babel to devDependencies ([@topaxi](https://github.com/topaxi))
* [#16](https://github.com/Mainmatter/ember-hbs-minifier/pull/16) Collapse multiple leading and trailing whitespaces into a single whitespace / Does not collapse multiple &nbsp; ([@siva-sundar](https://github.com/siva-sundar))

#### :memo: Documentation
* [#19](https://github.com/Mainmatter/ember-hbs-minifier/pull/19) fix copyright notice ([@marcoow](https://github.com/marcoow))
* [#1](https://github.com/Mainmatter/ember-hbs-minifier/pull/1) Update README.md ([@xomaczar](https://github.com/xomaczar))

#### :house: Internal
* [#27](https://github.com/Mainmatter/ember-hbs-minifier/pull/27) Use RFC176 imports ([@Turbo87](https://github.com/Turbo87))
* [#23](https://github.com/Mainmatter/ember-hbs-minifier/pull/23) Update `ember-cli-mocha` to v0.15.0 ([@Turbo87](https://github.com/Turbo87))
* [#25](https://github.com/Mainmatter/ember-hbs-minifier/pull/25) Update `ember-cli` to v2.12.3 ([@Turbo87](https://github.com/Turbo87))
* [#26](https://github.com/Mainmatter/ember-hbs-minifier/pull/26) Update `ember-cli-mocha` to v0.14.5 ([@Turbo87](https://github.com/Turbo87))
* [#24](https://github.com/Mainmatter/ember-hbs-minifier/pull/24) Update `ember-cli-babel` to v6.11.0 ([@Turbo87](https://github.com/Turbo87))
* [#20](https://github.com/Mainmatter/ember-hbs-minifier/pull/20) test with headless chrome ([@marcoow](https://github.com/marcoow))
* [#11](https://github.com/Mainmatter/ember-hbs-minifier/pull/11) Use Jest to run tests in Node ([@Turbo87](https://github.com/Turbo87))
* [#12](https://github.com/Mainmatter/ember-hbs-minifier/pull/12) Use Yarn instead of outdated npm ([@Turbo87](https://github.com/Turbo87))
* [#8](https://github.com/Mainmatter/ember-hbs-minifier/pull/8) Update "ember-cli" to v2.11.0 ([@Turbo87](https://github.com/Turbo87))
* [#7](https://github.com/Mainmatter/ember-hbs-minifier/pull/7) CI: Automatically publish tags to NPM ([@Turbo87](https://github.com/Turbo87))
* [#5](https://github.com/Mainmatter/ember-hbs-minifier/pull/5) ESLint: Use "eslint-config-Mainmatter" ([@Turbo87](https://github.com/Turbo87))

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
