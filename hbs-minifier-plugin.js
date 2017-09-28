'use strict';

/* eslint-env node */
const {
  stripWhiteSpace,
  isWhitespaceTextNode,
  hasLeadingOrTrailingWhiteSpace,
  stripNoMinifyBlocks,
  canTrimBlockStatementContent,
  canTrimElementNodeContent,
  canTrimModule,
  assignDefaultValues
} = require('./utils/helpers');


class BasePlugin {
  constructor(env = {}) {
    this.moduleName = env.moduleName;
  }

  static createASTPlugin(config) {
    let visitor = {
      TextNode(node) {
        let chars = node.chars;
        if (preStack.length === 0 && hasLeadingOrTrailingWhiteSpace(chars)) {
          node.chars = stripWhiteSpace(chars);
        }
      },

      BlockStatement: {
        enter(node) {
          let canTrim = canTrimBlockStatementContent(node, config);
          if (!canTrim) {
            preStack.push(node);
          }
        },

        exit(node) {
          if (preStack[preStack.length - 1] === node) {
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
          let canTrim = canTrimElementNodeContent(node, config);

          if (!canTrim) {
            preStack.push(node);
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

          if (preStack[preStack.length - 1] === node) {
            preStack.pop();
          }
        }
      },
    };

    return { name: 'hbs-minifier-plugin', visitor };
  }
}

module.exports = function(config = {}) {
  config = assignDefaultValues(config);

  return class HBSMinifierPlugin extends BasePlugin {

    transform(ast) {

      if (canTrimModule(this.moduleName, config)) {
        let plugin = HBSMinifierPlugin.createASTPlugin(config);
        this.syntax.traverse(ast, plugin.visitor);
      }
      return ast;
    }
  };
};
