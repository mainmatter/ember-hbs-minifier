/* eslint-env node */

const WHITESPACE = /^\s+$/;

module.exports = class {
  transform(ast) {
    this.syntax.traverse(ast, {
      TextNode(node) {
        if (WHITESPACE.test(node.chars)) {
          node.chars = ' ';
        }
      },

      Program(node) {
        let firstChild = node.body[0];
        if (firstChild && firstChild.type === 'TextNode' && WHITESPACE.test(firstChild.chars)) {
          node.body.shift();
        }

        let lastChild = node.body[node.body.length - 1];
        if (lastChild && lastChild.type === 'TextNode' && WHITESPACE.test(lastChild.chars)) {
          node.body.pop();
        }
      },

      ElementNode(node) {
        let firstChild = node.children[0];
        if (firstChild && firstChild.type === 'TextNode' && WHITESPACE.test(firstChild.chars)) {
          node.children.shift();
        }

        let lastChild = node.children[node.children.length - 1];
        if (lastChild && lastChild.type === 'TextNode' && WHITESPACE.test(lastChild.chars)) {
          node.children.pop();
        }
      },
    });

    return ast;
  }
};
