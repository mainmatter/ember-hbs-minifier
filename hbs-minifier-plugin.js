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
        if (isWhitespaceTextNode(firstChild)) {
          node.body.shift();
        }

        let lastChild = node.body[node.body.length - 1];
        if (isWhitespaceTextNode(lastChild)) {
          node.body.pop();
        }
      },

      ElementNode(node) {
        let firstChild = node.children[0];
        if (isWhitespaceTextNode(firstChild)) {
          node.children.shift();
        }

        let lastChild = node.children[node.children.length - 1];
        if (isWhitespaceTextNode(lastChild)) {
          node.children.pop();
        }
      },
    });

    return ast;
  }
};

function isWhitespaceTextNode(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(node.chars)
}
