'use strict';

/* eslint-env jest */
/* eslint-disable no-inner-declarations */

const DEP_PREFIX = '@glimmer/syntax';
const DEPS = Object.keys(require('./package.json').devDependencies).filter(it =>
  it.startsWith(DEP_PREFIX)
);

// Remove the unnecessary `loc` properties from the AST snapshots and replace
// the `Object` prefix with the node `type`
expect.addSnapshotSerializer({
  test(val) {
    return val && val.hasOwnProperty('type') && val.hasOwnProperty('loc');
  },

  print(val, serialize) {
    let clone = Object.assign({}, val);
    delete clone.loc;
    delete clone.type;
    return serialize(clone).replace(/^Object {/, `${val.type} {`);
  },
});

const originalWarn = console.warn;
let loggedDeprecations = [];
function expectNoDeprecations() {
  beforeEach(() => {
    loggedDeprecations = [];

    // See @glimmer/util's deprecation() implementation
    console.warn = (...args) => {
      if (args[0]?.includes('DEPRECATION')) {
        loggedDeprecations.push(args[0]);
      }
    };
  });
  afterEach(() => {
    expect(loggedDeprecations).toHaveLength(0);
    console.warn = originalWarn;
  });
}

for (let dep of DEPS) {
  let moduleName = 'HBS Minifier plugin';
  if (dep !== DEP_PREFIX) {
    moduleName += ` (with @glimmer/syntax v${dep.slice(DEP_PREFIX.length + 1)})`;
  }

  describe(moduleName, () => {
    const glimmer = require(dep);

    expectNoDeprecations();

    it('collapses whitespace into single space character', () => {
      assert(`{{foo}}  \n\n   \n{{bar}}`);
    });

    it('strips leading and trailing whitespace from Program nodes', function () {
      assert(`        {{foo}}        `);
    });

    it('does not strip leading/trailing text from Program nodes', function () {
      assert(`x        {{foo}}     y   `);
    });

    it('strips leading and trailing whitespace from ElementNode nodes', function () {
      assert(`<div>        {{foo}}        </div>`);
    });

    it('does not strip leading/trailing text from ElementNode nodes', function () {
      assert(`<div>x        {{foo}}     y   </div>`);
    });

    it('does not strip inside of <pre> tags', function () {
      assert(`<pre>        {{foo}}        </pre>`);
    });

    it('does not collapse whitespace inside of <pre> tags', function () {
      assert(`<pre>  \n\n   \n</pre>`);
    });

    it('does not strip inside of {{#no-minify}} tags', function () {
      assert(`{{#no-minify}}        {{foo}}        {{/no-minify}}`);
    });

    it('does not strip inside of {{#no-minify}} tags in other tags', function () {
      assert(`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);
    });

    it('does not collapse whitespace inside of {{#no-minify}} tags in other tags', function () {
      assert(`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);
    });

    it('does not collapse multiple &nbsp; textNode into a single whitespace', function () {
      assert(`<span>1</span>&nbsp;&nbsp;<span>2</span>`);
    });

    it('does not collapse &nbsp; surrounding a text content into a single whitespace', function () {
      assert(`<div>
  <span>    &nbsp;1&nbsp;   </span>
  <span> 2   </span>
</div>`);
    });

    it('does not minify `tagNames` specified in .hbs-minifyrc.js', function () {
      let config = {
        skip: { elements: ['address'] },
      };

      assert(
        `<address>
  Box 564,
  <b>
    Disneyland
  </b>
  <br>
  <u> USA </u>
</address>`,
        config
      );
    });

    it('does not minify `classNames` specified in .hbs-minifyrc.js', function () {
      let config = {
        skip: { classes: ['description'] },
      };

      assert(
        `<div class="description">
  1
  <span>
    2
  </span>
</div>`,
        config
      );
    });

    it('does not minify `components` specified in .hbs-minifyrc.js', function () {
      let config = {
        skip: { components: ['foo-bar'] },
      };

      assert(
        `{{#foo-bar}}
  <span>
    yield content
  </span>
{{/foo-bar}}`,
        config
      );
    });

    it('minifies `tagNames` that are not specified in .hbs-minifyrc.js', function () {
      assert(`<section>
  Box 564,
  <b>
    Disneyland
  </b>
  <br>
  <u> USA </u>
</section>`);
    });

    it('minifies `classNames` that are not specified in .hbs-minifyrc.js', function () {
      assert(`<div class="contact-details">
  John Smith
  <i>
    (Entrepreneur)
  </i>
</div>`);
    });

    it('minifies `components` that are not specified in .hbs-minifyrc.js', function () {
      assert(`{{#my-component}}
  <span>
    yield content
  </span>
{{/my-component}}`);
    });

    it('skips whitespace in regular attributes', function () {
      assert(`<div title="    foo    " />`);
    });

    it('skips whitespace in concatenated attributes', function () {
      assert(`<div title="    foo  {{if this.bar "BAR"}}  " />`);
    });

    it('collapses whitespace in regular `class` attributes', function () {
      assert(`
        <button
          class="
            btn
            btn--primary
            btn--blue
          "
        />
      `);
    });

    it('collapses whitespace in concatenated `class` attributes', function () {
      assert(`
        <button
          class="
            btn
            {{if this.isPrimary "btn--primary"}}
            {{if @stretch "btn--stretch"}}
          "
        />
      `);

      assert(`<button class="   foo   {{@bar}}  baz  "/>`);

      assert(`<button class="{{@foo}}   bar   {{@baz}}"/>`);

      assert(`<button class="   {{@foo}}   "/>`);
    });

    function assert(template, config = {}) {
      let ast = process(template, config);
      expect(ast).toMatchSnapshot();

      let printed = glimmer.print(ast);
      expect(`${template}\n---\n${printed}`).toMatchSnapshot();
    }

    function process(template, config) {
      let plugin = () => {
        return require('./hbs-minifier-plugin').createGlimmerPlugin(config);
      };
      return glimmer.preprocess(template, {
        plugins: {
          ast: [plugin],
        },
      });
    }
  });
}
