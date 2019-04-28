'use strict';

/* eslint-env node */

const leadingWhiteSpace = /^[ \t\r\n]+/;
const trailingWhiteSpace = /[ \t\r\n]+$/;
const WHITESPACE = /^[ \t\r\n]+$/;

function createGlimmerPlugin(config) {
  // in this stack we track the nodes that cause us to skip the minification
  // e.g. `{{#no-minify}} ... {{/no-minify}}` blocks or `<pre></pre>` tags
  // depending on the configuration
  let skipStack = [];

  return {
    name: 'hbs-minifier-plugin',

    visitor: {
      TextNode(node) {
        if (skipStack.length === 0) {
          // replace leading and trailing whitespace with a single whitespace character
          node.chars = node.chars.replace(leadingWhiteSpace, ' ').replace(trailingWhiteSpace, ' ');
        }
      },

      BlockStatement: {
        enter(node) {
          let canTrim = canTrimBlockStatementContent(node, config);
          if (!canTrim) {
            skipStack.push(node);
          }
        },

        exit(node) {
          if (skipStack[skipStack.length - 1] === node) {
            skipStack.pop();
          }
        },
      },

      Program: {
        enter(node) {
          if (skipStack.length !== 0) {
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
            skipStack.push(node);
          }

          if (skipStack.length !== 0) {
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

          if (skipStack[skipStack.length - 1] === node) {
            skipStack.pop();
          }
        }
      },
    }
  };
}

function createRegistryPlugin(config) {
  return class HBSMinifierPlugin {
    transform(ast) {
      let startLoc = ast.loc ? ast.loc.start : {};
      /*
        Checking for line and column to avoid registering the plugin for ProgramNode inside a BlockStatement since transform is called for all ProgramNodes in Ember 2.15.X. Removing this would result in minifying all the TextNodes.
      */
      if (startLoc.line !== 1 || startLoc.column !== 0) {
        return ast;
      }

      let plugin = createGlimmerPlugin(config);
      this.syntax.traverse(ast, plugin.visitor);
      return ast;
    }
  };
}

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

function getElementAttribute(node, attrName) {
  let attribute = node.attributes.find((attr) => {
    return attr.type === 'AttrNode' && attr.name === attrName;
  });
  return (attribute || {}).value;
}

function isClassIncluded(chars, classes) {
  chars = (chars || '').trim().split(' ');

  return chars.some((char) => {
    return classes.indexOf(char) !== -1;
  });
}

function canTrimWhiteSpaceBasedOnClassNames(value, configClassNames) {
  /*
    1. If no value is provided for class, the we can minify the content.
    2. If all classNames need to be preserved, then we must preserve the whitespace.
    3. If a string specified(class) contains a class which needs to be skipped then we must preserve the whitespace.
        For instance:
          <div class="foo bar">
            baz
          </div>
    4. If a PathExpression is provided as mentioned below, we should preserve the whitespace since the value is known only at runtime.
        For instance:
          <div class={{foo}}>
            bar
          <div>
    5. If a MustacheStatement is provided as mentioned below. Incase if its a helper if/unless, we need to preserve if any class that needs to be skipped is specified which can be found by following steps 1 to 4.
        For instance:
          <div class={{if foo 'bar' 'baz'}}>
            qux
          <div>
    6. If a ConcatStatement is provided, for instance,
        <div class="foo {{bar}} qux">
          bar
        <div>
       we need to preserve the whitespace if any class that needs to be skipped is specified which can be found by following steps 1 to 4.
  */
  if (!value) {
    return true;
  }
  if (configClassNames === 'all') {
    return false;
  }
  let type = value.type;

  if (type === 'TextNode') {
    return !isClassIncluded(value.chars, configClassNames);
  } else if (type === 'StringLiteral') {
    return !isClassIncluded(value.value, configClassNames);
  } else if (type === 'PathExpression') {
    return false;
  } else if (type === 'MustacheStatement') {
    let canTrim = true;

    if (['if', 'unless'].indexOf(value.path.original) !== -1) {
      let params = value.params;
      for (let i = 1; i < params.length; i++) {
        canTrim = canTrimWhiteSpaceBasedOnClassNames(params[i], configClassNames);
        if (!canTrim) {
          break;
        }
      }
    }
    return canTrim;
  } else if (type === 'ConcatStatement') {
    let parts = value.parts;

    return parts.every((part) => {
      return canTrimWhiteSpaceBasedOnClassNames(part, configClassNames);
    });
  }
  return true;
}


function canTrimBlockStatementContent(node, config) {
  // If a block or all the blocks is/are skiped (or) named as 'no-minify' then we need to preserve the whitespace.
  let componentName = node.path.original;
  let components = config.components;
  return components.indexOf(componentName) === -1 && components !== 'all';
}

function canTrimElementNodeContent(node, config) {
  // If a element or all the element is/are skiped then we need to preserve the whitespace.
  let elements = config.elements;
  let tag = node.tag;
  if (elements.indexOf(tag) !== -1 || elements === 'all') {
    return false;
  }
  let classAttributes = getElementAttribute(node, 'class');
  return classAttributes ? canTrimWhiteSpaceBasedOnClassNames(classAttributes, config.classes) : true;
}

module.exports = {
  createGlimmerPlugin,
  createRegistryPlugin,
};
