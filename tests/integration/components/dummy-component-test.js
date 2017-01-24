import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('HBS Minifier plugin', function() {
  setupComponentTest('dummy-component', { integration: true });

  beforeEach(function() {
    this.setProperties({ foo: 'foo', bar: 'bar', baz: 'baz' });
  });

  it('collapses whitespace into single space character', function() {
    this.render(hbs`{{foo}}  \n\n   \n{{bar}}`);

    let childNodes = this.$()[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', ' ');
  });

  it('strips leading and trailing whitespace from Program nodes', function() {
    this.render(hbs`        {{foo}}        `);

    let childNodes = this.$()[0].childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'foo');
  });

  it('does not strip leading/trailing text from Program nodes', function() {
    this.render(hbs`x        {{foo}}     y   `);

    let childNodes = this.$()[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'x        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '     y   ');
  });

  it('strips leading and trailing whitespace from ElementNode nodes', function() {
    this.render(hbs`<div>        {{foo}}        </div>`);

    let childNodes = this.$('div')[0].childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'foo');
  });

  it('does not strip leading/trailing text from ElementNode nodes', function() {
    this.render(hbs`<div>x        {{foo}}     y   </div>`);

    let childNodes = this.$('div')[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'x        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '     y   ');
  });

  it('does not strip inside of <pre> tags', function() {
    this.render(hbs`<pre>        {{foo}}        </pre>`);

    let childNodes = this.$('pre')[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not collapse whitespace inside of <pre> tags', function() {
    this.render(hbs`<pre>  \n\n   \n</pre>`);

    let childNodes = this.$('pre')[0].childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '  \n\n   \n');
  });
});
