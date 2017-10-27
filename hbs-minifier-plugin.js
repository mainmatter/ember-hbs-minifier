'use strict';

/* eslint-env node */
const Util = require('./utils/helpers');
const stripWhiteSpace = Util.stripWhiteSpace;
const isWhitespaceTextNode = Util.isWhitespaceTextNode;
const hasLeadingOrTrailingWhiteSpace = Util.hasLeadingOrTrailingWhiteSpace;
const stripNoMinifyBlocks = Util.stripNoMinifyBlocks;

class HBSMinifierPlugin {

  static createASTPlugin() {
    let preStack = [];
    let visitor = {
      TextNode(node) {
        let chars = node.chars;
        if (preStack.length === 0 && hasLeadingOrTrailingWhiteSpace(chars)) {
          node.chars = stripWhiteSpace(chars);
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
    };

    return { name: 'hbs-minifier-plugin', visitor };
  }

  transform(ast) {
    let plugin = HBSMinifierPlugin.createASTPlugin();

    this.syntax.traverse(ast, plugin.visitor);

    return ast;
  }

}

module.exports = HBSMinifierPlugin;
