import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('HBS Minifier plugin', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setProperties({ foo: 'foo', bar: 'bar', baz: 'baz' });
  });

  test('collapses whitespace into single space character', async function(assert) {
    await render(hbs`{{foo}}  \n\n   \n{{bar}}`);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, ' ');
  });

  test('strips leading and trailing whitespace from Program nodes', async function(assert) {
    await render(hbs`        {{foo}}        `);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    assert.strictEqual(childNodes.length, 1);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, 'foo');
  });

  test('Collapse leading/trailing text from Program nodes into a single whitespace', async function(assert) {
    await render(hbs`x        {{foo}}     y   `);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, 'x ');
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, 'foo');
    assert.strictEqual(childNodes[2].nodeName, '#text');
    assert.strictEqual(childNodes[2].textContent, ' y ');
  });

  test('strips leading and trailing whitespace from ElementNode nodes', async function(assert) {
    await render(hbs`<div>        {{foo}}        </div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes.length, 1);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, 'foo');
  });

  test('Collapse leading/trailing text from ElementNode nodes', async function(assert) {
    await render(hbs`<div>x        {{foo}}     y   {{bar}}    z</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes.length, 5);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, 'x ');
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, 'foo');
    assert.strictEqual(childNodes[2].nodeName, '#text');
    assert.strictEqual(childNodes[2].textContent, ' y ');
    assert.strictEqual(childNodes[3].textContent, 'bar');
    assert.strictEqual(childNodes[4].textContent, ' z');
  });

  test('does not strip inside of <pre> tags', async function(assert) {
    await render(hbs`<pre>        {{foo}}        </pre>`);

    let childNodes = this.element.querySelector('pre').childNodes;
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, '        ');
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, 'foo');
    assert.strictEqual(childNodes[2].nodeName, '#text');
    assert.strictEqual(childNodes[2].textContent, '        ');
  });

  test('does not collapse whitespace inside of <pre> tags', async function(assert) {
    await render(hbs`<pre>  \n\n   \n</pre>`);

    let childNodes = this.element.querySelector('pre').childNodes;
    assert.strictEqual(childNodes.length, 1);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, '  \n\n   \n');
  });

  test('does not strip inside of {{#no-minify}} tags', async function(assert) {
    await render(hbs`{{#no-minify}}        {{foo}}        {{/no-minify}}`);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, '        ');
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, 'foo');
    assert.strictEqual(childNodes[2].nodeName, '#text');
    assert.strictEqual(childNodes[2].textContent, '        ');
  });

  test('does not strip inside of {{#no-minify}} tags in other tags', async function(assert) {
    await render(hbs`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, '        ');
    assert.strictEqual(childNodes[1].nodeName, '#text');
    assert.strictEqual(childNodes[1].textContent, 'foo');
    assert.strictEqual(childNodes[2].nodeName, '#text');
    assert.strictEqual(childNodes[2].textContent, '        ');
  });

  test('does not collapse whitespace inside of {{#no-minify}} tags in other tags', async function(assert) {
    await render(hbs`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes.length, 1);
    assert.strictEqual(childNodes[0].nodeName, '#text');
    assert.strictEqual(childNodes[0].textContent, '  \n\n   \n');
  });

  test('does not collapse multiple &nbsp; textNode into a single whitespace', async function(assert) {
    await render(hbs`<span>1</span>&nbsp;&nbsp;<span>2</span>`);
    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[1].nodeName, '#text');
    // checking for the length of the textNode is 2.
    assert.strictEqual(childNodes[1].nodeValue.length, 2);
    // ensuring the textNode contains only whitespaces
    assert.strictEqual(childNodes[1].nodeValue.trim(), '');
  });
  /*
    The following test is so much similar to the above one. But we need to make sure that the textNode in following templates results in
    '  1  ' and not ' 1 '.
  */
  test('does not collapse &nbsp; surrounding a text content into a single whitespace', async function(assert) {
    await render(hbs `
<div>
  <span>    &nbsp;1&nbsp;   </span>
  <span> 2   </span>
</div>`);
    let childNode = this.element.querySelectorAll('div span')[0].childNodes[0];
    assert.strictEqual(childNode.textContent.length, 5);
    assert.strictEqual(childNode.nodeName, '#text');
    // ensuring the textContent is surrounded by whitespaces
    assert.strictEqual(childNode.textContent.trim(), '1');
  });

  test('does not minify `tagNames` specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
<address>
  Box 564,
  <b>
    Disneyland
  </b>
  <br>
  <u> USA </u>
</address>`);

    let childNodes = this.element.querySelector('address').childNodes;
    assert.strictEqual(childNodes[0].textContent, '\n  Box 564,\n  ');
    // ensuring the textContent is surrounded by whitespaces
    assert.strictEqual(childNodes[1].textContent, '\n    Disneyland\n  ');
    assert.strictEqual(childNodes[2].textContent, '\n  ');
    assert.strictEqual(childNodes[4].textContent, '\n  ');
    assert.strictEqual(childNodes[5].textContent, ' USA ');
  });


  test('does not minify `classNames` specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
<div class="description">
  1
  <span>
    2
  </span>
</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes[0].textContent, '\n  1\n  ');
    assert.strictEqual(childNodes[1].textContent, '\n    2\n  ');
    assert.strictEqual(childNodes[2].textContent, '\n');
  });

  test('does not minify `component` boundaries specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
{{#foo-bar}}
  <span>
    yield content
  </span>
{{/foo-bar}}`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes[0].textContent, '1 ');
    assert.strictEqual(childNodes[1].textContent, ' 2 ');
    assert.strictEqual(childNodes[3].textContent, ' 3 ');
    assert.strictEqual(childNodes[4].textContent, ' ');
    assert.strictEqual(childNodes[5].textContent, '  ');
    assert.strictEqual(childNodes[6].textContent, '\n    yield content\n  ');
    assert.strictEqual(childNodes[7].textContent, '\n');
  });

  test('minify `tagNames` that are not specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
  <ul>
    <li>
      1
    </li>
    <li>
      2
    </li>
  </ul>`);

    let childNodes = this.element.querySelector('ul').childNodes;
    assert.strictEqual(childNodes.length, 3);
    assert.strictEqual(childNodes[0].textContent, ' 1 ');
    assert.strictEqual(childNodes[1].textContent, ' ');
    assert.strictEqual(childNodes[2].textContent, ' 2 ');
  });

  test('minifies `classNames` that are not specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
<div class="numbers">
  1
  <span>
    2
  </span>
</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(childNodes.length, 2);
    assert.strictEqual(childNodes[0].textContent, ' 1 ');
    assert.strictEqual(childNodes[1].textContent, ' 2 ');
  });

  test('minify `component` boundaries that are not specified in .hbs-minifyrc.js', async function(assert) {
    await render(hbs `
{{#x-button tagName="button"}}
  <div>
    yield content
  </div>
{{/x-button}}`);

    let childNodes = this.element.querySelector('button').childNodes;
    // removing the textNodes with content as '' since htmlbars adds text node boundaries (at the begining and the end) of a template file.
    assert.strictEqual([...childNodes].filter(node => node.textContent !== '').length, 2);
    assert.strictEqual(childNodes[0].textContent, 'save ');
    assert.strictEqual(childNodes[1].nodeName, 'DIV');
    let yieldElementChildNodes = this.element.querySelector('div').childNodes;
    assert.strictEqual(yieldElementChildNodes.length, 1);
    assert.strictEqual(yieldElementChildNodes[0].textContent, ' yield content ');
  });


});
