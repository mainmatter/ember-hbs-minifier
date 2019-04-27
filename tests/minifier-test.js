import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('HBS Minifier plugin', function() {
  setupRenderingTest();

  beforeEach(function() {
    this.setProperties({ foo: 'foo', bar: 'bar', baz: 'baz' });
  });

  it('collapses whitespace into single space character', async function() {
    await render(hbs`{{foo}}  \n\n   \n{{bar}}`);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    expect(childNodes.length).to.equal(3);
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', ' ');
  });

  it('strips leading and trailing whitespace from Program nodes', async function() {
    await render(hbs`        {{foo}}        `);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'foo');
  });

  it('Collapse leading/trailing text from Program nodes into a single whitespace', async function() {
    await render(hbs`x        {{foo}}     y   `);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'x ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', ' y ');
  });

  it('strips leading and trailing whitespace from ElementNode nodes', async function() {
    await render(hbs`<div>        {{foo}}        </div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'foo');
  });

  it('Collapse leading/trailing text from ElementNode nodes', async function() {
    await render(hbs`<div>x        {{foo}}     y   {{bar}}    z</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes.length).to.equal(5);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'x ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', ' y ');
    expect(childNodes[3]).to.have.a.property('textContent', 'bar');
    expect(childNodes[4]).to.have.a.property('textContent', ' z');
  });

  it('does not strip inside of <pre> tags', async function() {
    await render(hbs`<pre>        {{foo}}        </pre>`);

    let childNodes = this.element.querySelector('pre').childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not collapse whitespace inside of <pre> tags', async function() {
    await render(hbs`<pre>  \n\n   \n</pre>`);

    let childNodes = this.element.querySelector('pre').childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '  \n\n   \n');
  });

  it('does not strip inside of {{#no-minify}} tags', async function() {
    await render(hbs`{{#no-minify}}        {{foo}}        {{/no-minify}}`);

    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not strip inside of {{#no-minify}} tags in other tags', async function() {
    await render(hbs`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not collapse whitespace inside of {{#no-minify}} tags in other tags', async function() {
    await render(hbs`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '  \n\n   \n');
  });

  it('does not collapse multiple &nbsp; textNode into a single whitespace', async function() {
    await render(hbs`<span>1</span>&nbsp;&nbsp;<span>2</span>`);
    let childNodes = [...this.element.childNodes].filter(it => it.textContent !== '');
    expect(childNodes.length).to.equal(3);
    expect(childNodes[1]).to.be.a('text');
    // checking for the length of the textNode is 2.
    expect(childNodes[1].nodeValue.length).to.equal(2);
    // ensuring the textNode contains only whitespaces
    expect(childNodes[1].nodeValue.trim()).to.equal('');
  });
  /*
    The following test is so much similar to the above one. But we need to make sure that the textNode in following templates results in
    '  1  ' and not ' 1 '.
  */
  it('does not collapse &nbsp; surrounding a text content into a single whitespace', async function() {
    await render(hbs `
<div>
  <span>    &nbsp;1&nbsp;   </span>
  <span> 2   </span>
</div>`);
    let childNode = this.element.querySelectorAll('div span')[0].childNodes[0];
    expect(childNode.textContent.length).to.equal(5);
    expect(childNode).to.be.a('text');
    // ensuring the textContent is surrounded by whitespaces
    expect(childNode.textContent.trim()).to.equal('1');
  });

  it('does not minify `tagNames` specified in .hbs-minifyrc.js', async function() {
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
    expect(childNodes[0].textContent).to.equal('\n  Box 564,\n  ');
    // ensuring the textContent is surrounded by whitespaces
    expect(childNodes[1].textContent).to.equal('\n    Disneyland\n  ');
    expect(childNodes[2].textContent).to.equal('\n  ');
    expect(childNodes[4].textContent).to.equal('\n  ');
    expect(childNodes[5].textContent).to.equal(' USA ');
  });


  it('does not minify `classNames` specified in .hbs-minifyrc.js', async function() {
    await render(hbs `
<div class="description">
  1
  <span>
    2
  </span>
</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes[0].textContent).to.equal('\n  1\n  ');
    expect(childNodes[1].textContent).to.equal('\n    2\n  ');
    expect(childNodes[2].textContent).to.equal('\n');
  });

  it('does not minify `component` boundaries specified in .hbs-minifyrc.js', async function() {
    await render(hbs `
{{#foo-bar}}
  <span>
    yield content
  </span>
{{/foo-bar}}`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes[0].textContent).to.equal('1 ');
    expect(childNodes[1].textContent).to.equal(' 2 ');
    expect(childNodes[3].textContent).to.equal(' 3 ');
    expect(childNodes[4].textContent).to.equal(' ');
    expect(childNodes[5].textContent).to.equal('  ');
    expect(childNodes[6].textContent).to.equal('\n    yield content\n  ');
    expect(childNodes[7].textContent).to.equal('\n');
  });

  it('minify `tagNames` that are not specified in .hbs-minifyrc.js', async function() {
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
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0].textContent).to.equal(' 1 ');
    expect(childNodes[1].textContent).to.equal(' ');
    expect(childNodes[2].textContent).to.equal(' 2 ');
  });

  it('minifies `classNames` that are not specified in .hbs-minifyrc.js', async function() {
    await render(hbs `
<div class="numbers">
  1
  <span>
    2
  </span>
</div>`);

    let childNodes = this.element.querySelector('div').childNodes;
    expect(childNodes.length).to.equal(2);
    expect(childNodes[0].textContent).to.equal(' 1 ');
    expect(childNodes[1].textContent).to.equal(' 2 ');
  });

  it('minify `component` boundaries that are not specified in .hbs-minifyrc.js', async function() {
    await render(hbs `
{{#x-button tagName="button"}}
  <div>
    yield content
  </div>
{{/x-button}}`);

    let childNodes = this.element.querySelector('button').childNodes;
    // removing the textNodes with content as '' since htmlbars adds text node boundaries (at the begining and the end) of a template file.
    expect([...childNodes].filter(node => node.textContent !== '').length).to.equal(2);
    expect(childNodes[0].textContent).to.equal('save ');
    expect(childNodes[1].nodeName).to.equal('DIV');
    let yieldElementChildNodes = this.element.querySelector('div').childNodes;
    expect(yieldElementChildNodes.length).to.equal(1);
    expect(yieldElementChildNodes[0].textContent).to.equal(' yield content ');
  });


});
