/* eslint-env node */

const WHITESPACE = /^\s+$/;

module.exports = class {
  transform(ast) {
    let preStack = [];

    this.syntax.traverse(ast, {
      TextNode(node) {
        if (preStack.length === 0 && WHITESPACE.test(node.chars)) {
          node.chars = ' ';
        }
      },

      BlockStatement: {
        enter(node) {
          if (node.path.original === 'no-minify') {
            preStack.push(true);
          }
        },

        exit(node) {
          if (node.path.original === 'no-minify') {
            preStack.pop();
          }
        },
      },

      Program: {
        enter(node) {
          if (preStack.length !== 0) {
            return;
          }

          let firstChild = node.body[0];
          if (isWhitespaceTextNode(firstChild)) {
            node.body.shift();
          }

          let lastChild = node.body[node.body.length - 1];
          if (isWhitespaceTextNode(lastChild)) {
            node.body.pop();
          }
        },

        exit(node) {
          node.body = stripNoMinifyBlocks(node.body);
        },
      },

      ElementNode: {
        enter(node) {
          if (node.tag === 'pre') {
            preStack.push(true);
          }

          if (preStack.length !== 0) {
            return;
          }

          let firstChild = node.children[0];
          if (isWhitespaceTextNode(firstChild)) {
            node.children.shift();
          }

          let lastChild = node.children[node.children.length - 1];
          if (isWhitespaceTextNode(lastChild)) {
            node.children.pop();
          }
        },

        exit(node) {
          node.children = stripNoMinifyBlocks(node.children);

          if (node.tag === 'pre') {
            preStack.pop();
          }
        }
      },
    });

    return ast;
  }
};

function isWhitespaceTextNode(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(node.chars);
}

function stripNoMinifyBlocks(nodes) {
  return nodes.map(node => {
    if (node.type === 'BlockStatement' && node.path.original === 'no-minify') {
      return node.program.body;
    }
    return node;
  }).reduce((a, b) => a.concat(b), []);
}
