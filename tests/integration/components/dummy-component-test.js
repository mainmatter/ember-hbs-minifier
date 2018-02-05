import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

// imported from https://github.com/emberjs/ember-test-helpers/blob/v0.7.16/addon-test-support/%40ember/test-helpers/has-ember-version.js
function hasEmberVersion(major, minor) {
  let numbers = Ember.VERSION.split('-')[0].split('.');
  let actualMajor = parseInt(numbers[0], 10);
  let actualMinor = parseInt(numbers[1], 10);
  return actualMajor > major || (actualMajor === major && actualMinor >= minor);
}

describe('HBS Minifier plugin', function() {
  setupComponentTest('dummy-component', { integration: true });

  beforeEach(function() {
    this.setProperties({ foo: 'foo', bar: 'bar', baz: 'baz' });
  });

  it('collapses whitespace into single space character', function() {
    this.render(hbs`{{foo}}  \n\n   \n{{bar}}`);

    let childNodes = this.$()[0].childNodes;

    if (hasEmberVersion(2, 10)) {
      expect(childNodes.length).to.equal(3);
      expect(childNodes[1]).to.be.a('text');
      expect(childNodes[1]).to.have.a.property('textContent', ' ');
    } else {
      expect(childNodes.length).to.equal(5);
      expect(childNodes[2]).to.be.a('text');
      expect(childNodes[2]).to.have.a.property('textContent', ' ');
    }
  });

  it('strips leading and trailing whitespace from Program nodes', function() {
    this.render(hbs`        {{foo}}        `);

    let childNodes = this.$()[0].childNodes;
    if (hasEmberVersion(2, 10)) {
      expect(childNodes.length).to.equal(1);
      expect(childNodes[0]).to.be.a('text');
      expect(childNodes[0]).to.have.a.property('textContent', 'foo');
    } else {
      expect(childNodes.length).to.equal(3);
      expect(childNodes[0]).to.be.a('text');
      expect(childNodes[0]).to.have.a.property('textContent', '');
      expect(childNodes[1]).to.be.a('text');
      expect(childNodes[1]).to.have.a.property('textContent', 'foo');
      expect(childNodes[2]).to.be.a('text');
      expect(childNodes[2]).to.have.a.property('textContent', '');
    }
  });

  it('Collapse leading/trailing text from Program nodes into a single whitespace', function() {
    this.render(hbs`x        {{foo}}     y   `);

    let childNodes = this.$()[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'x ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', ' y ');
  });

  it('strips leading and trailing whitespace from ElementNode nodes', function() {
    this.render(hbs`<div>        {{foo}}        </div>`);

    let childNodes = this.$('div')[0].childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', 'foo');
  });

  it('Collapse leading/trailing text from ElementNode nodes', function() {
    this.render(hbs`<div>x        {{foo}}     y   {{bar}}    z</div>`);

    let childNodes = this.$('div')[0].childNodes;
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

  it('does not strip inside of {{#no-minify}} tags', function() {
    this.render(hbs`{{#no-minify}}        {{foo}}        {{/no-minify}}`);

    let childNodes = this.$()[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not strip inside of {{#no-minify}} tags in other tags', function() {
    this.render(hbs`<div>{{#no-minify}}        {{foo}}        {{/no-minify}}</div>`);

    let childNodes = this.$('div')[0].childNodes;
    expect(childNodes.length).to.equal(3);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '        ');
    expect(childNodes[1]).to.be.a('text');
    expect(childNodes[1]).to.have.a.property('textContent', 'foo');
    expect(childNodes[2]).to.be.a('text');
    expect(childNodes[2]).to.have.a.property('textContent', '        ');
  });

  it('does not collapse whitespace inside of {{#no-minify}} tags in other tags', function() {
    this.render(hbs`<div>{{#no-minify}}  \n\n   \n{{/no-minify}}</div>`);

    let childNodes = this.$('div')[0].childNodes;
    expect(childNodes.length).to.equal(1);
    expect(childNodes[0]).to.be.a('text');
    expect(childNodes[0]).to.have.a.property('textContent', '  \n\n   \n');
  });

  it('does not collapse multiple &nbsp; textNode into a single whitespace', function() {
    this.render(hbs`<span>1</span>&nbsp;&nbsp;<span>2</span>`);
    let childNodes = this.$()[0].childNodes;
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
  it('does not collapse &nbsp; surrounding a text content into a single whitespace', function() {
    this.render(hbs `
<div>
  <span>    &nbsp;1&nbsp;   </span>
  <span> 2   </span>
</div>`);
    let childNode = this.$('div span:eq(0)')[0].childNodes[0];
    expect(childNode.textContent.length).to.equal(5);
    expect(childNode).to.be.a('text');
    // ensuring the textContent is surrounded by whitespaces
    expect(childNode.textContent.trim()).to.equal('1');
  });

});
