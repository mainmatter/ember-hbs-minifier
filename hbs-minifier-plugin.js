'use strict';

/* eslint-env node */

const leadingWhiteSpace = /^[ \t\r\n]+/;
const trailingWhiteSpace = /[ \t\r\n]+$/;
const WHITESPACE = /^[ \t\r\n]+$/;

function createGlimmerPlugin(config) {
  normalizeConfig(config);

  // in this stack we track the nodes that cause us to skip the minification
  // e.g. `{{#no-minify}} ... {{/no-minify}}` blocks or `<pre></pre>` tags
  // depending on the configuration
  let skipStack = [];

  function insideSkipBlock() {
    return skipStack.length !== 0;
  }

  return {
    name: 'hbs-minifier-plugin',

    visitor: {
      TextNode(node) {
        if (!insideSkipBlock()) {
          // replace leading and trailing whitespace with a single whitespace character
          node.chars = node.chars.replace(leadingWhiteSpace, ' ').replace(trailingWhiteSpace, ' ');
        }
      },

      AttrNode: {
        enter(node) {
          skipStack.push(node);

          if (node.name === 'class') {
            if (node.value.type === 'TextNode') {
              node.value.chars = node.value.chars
                .replace(leadingWhiteSpace, '')
                .replace(trailingWhiteSpace, '')
                .replace(/[ \t\r\n]+/g, ' ');
            } else if (node.value.type === 'ConcatStatement') {
              let { parts } = node.value;

              parts.forEach((part, i) => {
                if (part.type === 'TextNode') {
                  let isFirst = i === 0;
                  let isLast = i === parts.length - 1;

                  part.chars = part.chars
                    .replace(leadingWhiteSpace, isFirst ? '' : ' ')
                    .replace(trailingWhiteSpace, isLast ? '' : ' ')
                    .replace(/[ \t\r\n]+/g, ' ');
                }
              });

              node.value.parts = node.value.parts.filter(
                part => part.type !== 'TextNode' || part.chars !== ''
              );
            }
          }
        },

        exit(node) {
          if (skipStack[skipStack.length - 1] === node) {
            skipStack.pop();
          }
        },
      },

      BlockStatement: {
        enter(node) {
          if (shouldSkipBlockStatement(node, config)) {
            skipStack.push(node);
          }
        },

        exit(node) {
          if (skipStack[skipStack.length - 1] === node) {
            skipStack.pop();
          }
        },
      },

      Template: {
        enter(node) {
          if (!insideSkipBlock()) {
            removeSurroundingWhitespaceNodes(node.body);
          }
        },

        exit(node) {
          node.body = stripNoMinifyBlocks(node.body);
        },
      },
      Block: {
        enter(node) {
          if (!insideSkipBlock()) {
            removeSurroundingWhitespaceNodes(node.body);
          }
        },

        exit(node) {
          node.body = stripNoMinifyBlocks(node.body);
        },
      },

      ElementNode: {
        enter(node) {
          if (shouldSkipElementNode(node, config) || shouldSkipClass(node, config)) {
            skipStack.push(node);
          }

          if (!insideSkipBlock()) {
            removeSurroundingWhitespaceNodes(node.children);
          }
        },

        exit(node) {
          node.children = stripNoMinifyBlocks(node.children);

          if (skipStack[skipStack.length - 1] === node) {
            skipStack.pop();
          }
        },
      },
    },
  };
}

function createRegistryPlugin(config) {
  let plugin = createGlimmerPlugin(config);
  return () => plugin;
}

function isWhitespaceTextNode(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(node.chars);
}

function stripNoMinifyBlocks(nodes) {
  return nodes
    .map(node => {
      if (node.type === 'BlockStatement' && node.path.original === 'no-minify') {
        return node.program.body;
      }
      return node;
    })
    .reduce((a, b) => a.concat(b), []);
}

function removeSurroundingWhitespaceNodes(nodes) {
  // remove leading text node if it contains only whitespace
  if (isWhitespaceTextNode(nodes[0])) {
    nodes.shift();
  }

  // remove trailing text node if it contains only whitespace
  if (isWhitespaceTextNode(nodes[nodes.length - 1])) {
    nodes.pop();
  }
}

function isClassIncluded(chars, classes) {
  chars = (chars || '').trim().split(' ');

  return chars.some(char => {
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

    return parts.every(part => {
      return canTrimWhiteSpaceBasedOnClassNames(part, configClassNames);
    });
  }
  return true;
}

function shouldSkipBlockStatement(node, config) {
  let components = config.skip.components;
  if (components === 'all') {
    return true;
  }

  // If a block or all the blocks is/are skiped (or) named as 'no-minify' then we need to preserve the whitespace.
  let componentName = node.path.original;
  return components.indexOf(componentName) !== -1;
}

function shouldSkipElementNode(node, config) {
  let elements = config.skip.elements;
  if (elements === 'all') {
    return true;
  }

  // If a element or all the element is/are skiped then we need to preserve the whitespace.
  let tag = node.tag;
  return elements.indexOf(tag) !== -1;
}

function shouldSkipClass(node, config) {
  let classAttrNode = node.attributes.find(attr => attr.name === 'class');
  if (!classAttrNode) {
    return false;
  }

  return !canTrimWhiteSpaceBasedOnClassNames(classAttrNode.value, config.skip.classes);
}

function normalizeConfig(config = {}) {
  config.skip = config.skip || {};
  config.skip.elements = config.skip.elements || ['pre'];
  config.skip.classes = config.skip.classes || [];
  config.skip.components = config.skip.components || ['no-minify'];
}

module.exports = {
  createGlimmerPlugin,
  createRegistryPlugin,
};
