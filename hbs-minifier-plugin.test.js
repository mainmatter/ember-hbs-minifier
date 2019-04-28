'use strict';

/* eslint-env jest */
/* eslint-disable no-inner-declarations */

const multidepRequire = require('multidep')('multidep.json');

const DEFAULT = 'default';
const versions = [DEFAULT];
multidepRequire.forEachVersion('@glimmer/syntax', function(version) {
  versions.push(version);
});

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

const defaultConfig = {
  skip: {
    elements: ['pre', 'address'],
    classes: ['description'],
    components: ['foo-bar', 'no-minify']
  }
};

const HbsMinifierPlugin = require('./hbs-minifier-plugin')(defaultConfig);

for (let version of versions) {
  let moduleName = 'HBS Minifier plugin';
  if (version !== DEFAULT) {
    moduleName += ` (with @glimmer/syntax v${version})`;
  }

  describe(moduleName, () => {
    const glimmer = version === DEFAULT ?
      require('@glimmer/syntax') :
      multidepRequire('@glimmer/syntax', version);

    it('collapses whitespace into single space character', () => {
      assert(`{{foo}}  \n\n   \n{{bar}}`);
    });

    it('strips leading and trailing whitespace from Program nodes', function() {
      assert(`        {{foo}}        `);
    });

    it('does not strip leading/trailing text from Program nodes', function() {
      assert(`x        {{foo}}     y   `);
    });

    it('strips leading and trailing whitespace from ElementNode nodes', function() {
      assert(`<div>        {{foo}}        </div>`);
    });

    it('does not strip leading/trailing text from ElementNode nodes', function() {
      assert(`<div>x        {{foo}}     y   </div>`);
    });

    it('does not strip inside of <pre> tags', function() {
      assert(`<pre>        {{foo}}        </pre>`);
    });

    it('does not collapse whitespace inside of <pre> tags', function() {
      assert(`<pre>  \n\n   \n</pre>`);
    });

    it('does not strip inside of {{#no-minify}} tags', function() {
      assert(`{{#no-minify}}        {{foo}}        {{/no-minify}}`);
    });

    it('does not strip inside of {{#no-minify}} tags in other tags', function() {
      assert(`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);
    });

    it('does not collapse whitespace inside of {{#no-minify}} tags in other tags', function() {
      assert(`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);
    });

    it('does not collapse multiple &nbsp; textNode into a single whitespace', function() {
      assert(`<span>1</span>&nbsp;&nbsp;<span>2</span>`);
    });

    it('does not collapse &nbsp; surrounding a text content into a single whitespace', function() {
      assert(`<div>
  <span>    &nbsp;1&nbsp;   </span>
  <span> 2   </span>
</div>`);
    });

    it('does not minify `tagNames` specified in .hbs-minifyrc.js', function() {
      assert(`<address>
  Box 564,
  <b>
    Disneyland
  </b>
  <br>
  <u> USA </u>
</address>`);
    });

    it('does not minify `classNames` specified in .hbs-minifyrc.js', function() {
      assert(`<div class="description">
  1
  <span>
    2
  </span>
</div>`);
    });

    it('does not minify `components` specified in .hbs-minifyrc.js', function() {
      assert(`{{#foo-bar}}
  <span>
    yield content
  </span>
{{/foo-bar}}`);
    });

    it('minifies `tagNames` that are not specified in .hbs-minifyrc.js', function() {
      assert(`<section>
  Box 564,
  <b>
    Disneyland
  </b>
  <br>
  <u> USA </u>
</section>`);
    });

    it('minifies `classNames` that are not specified in .hbs-minifyrc.js', function() {
      assert(`<div class="contact-details">
  John Smith
  <i>
    (Entrepreneur)
  </i>
</div>`);
    });

    it('minifies `components` that are not specified in .hbs-minifyrc.js', function() {
      assert(`{{#my-component}}
  <span>
    yield content
  </span>
{{/my-component}}`);
    });

    function assert(template) {
      let ast = process(template);
      expect(ast).toMatchSnapshot();

      let printed = glimmer.print(ast);
      expect(printed).toMatchSnapshot();
    }

    function process(template) {
      let plugin = () => {
        return HbsMinifierPlugin.createASTPlugin(defaultConfig.skip);
      };
      return glimmer.preprocess(template, {
        plugins: {
          ast: [plugin]
        }
      });
    }
  });
}
