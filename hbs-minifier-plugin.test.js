'use strict';

/* eslint-env jest */

const glimmer = require('@glimmer/syntax');
const HbsMinifierPlugin = require('./hbs-minifier-plugin');

it('1. collapses whitespace into single space character', () => {
  assert(`{{foo}}  \n\n   \n{{bar}}`);
});

it('2. strips leading and trailing whitespace from Program nodes', function() {
  assert(`        {{foo}}        `);
});

it('3. does not strip leading/trailing text from Program nodes', function() {
  assert(`x        {{foo}}     y   `);
});

it('4. strips leading and trailing whitespace from ElementNode nodes', function() {
  assert(`<div>        {{foo}}        </div>`);
});

it('5. does not strip leading/trailing text from ElementNode nodes', function() {
  assert(`<div>x        {{foo}}     y   </div>`);
});

it('6. does not strip inside of <pre> tags', function() {
  assert(`<pre>        {{foo}}        </pre>`);
});

it('7. does not collapse whitespace inside of <pre> tags', function() {
  assert(`<pre>  \n\n   \n</pre>`);
});

it('8. does not strip inside of {{#no-minify}} tags', function() {
  assert(`{{#no-minify}}        {{foo}}        {{/no-minify}}`);
});

it('9. does not strip inside of {{#no-minify}} tags in other tags', function() {
  assert(`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);
});

it('10. does not collapse whitespace inside of {{#no-minify}} tags in other tags', function() {
  assert(`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);
});

function assert(template) {
  let ast = process(template);
  expect(ast).toMatchSnapshot();

  let printed = glimmer.print(ast);
  expect(printed).toMatchSnapshot();
}

function process(template) {
  return glimmer.preprocess(template, {
    plugins: {
      ast: [HbsMinifierPlugin.createASTPlugin]
    }
  });
}
