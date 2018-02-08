/* eslint-env node */
'use strict';

const leadingWhiteSpace = /^[ \t\r\n]+/;
const trailingWhiteSpace = /[ \t\r\n]+$/;
const WHITESPACE = /^[ \t\r\n]+$/;

function isWhitespaceTextNode(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(node.chars);
}

function hasLeadingOrTrailingWhiteSpace(chars) {
  return leadingWhiteSpace.test(chars) || trailingWhiteSpace.test(chars);
}

function stripWhiteSpace(chars) {
  /*
    Replacing multiple ' ', '\n' and '\t'(leading/trailing) into a single whitespace.
  */
  chars = chars || '';
  return chars.replace(leadingWhiteSpace, ' ').replace(trailingWhiteSpace, ' ');
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

function canTrimUnnecessaryWhiteSpace(value, config) {
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
  if (config.classes === 'all') {
    return false;
  }
  let type = value.type;

  if (type === 'TextNode') {
    return !isClassIncluded(value.chars, config.classes);
  } else if (type === 'StringLiteral') {
    return !isClassIncluded(value.value, config.classes);
  } else if (type === 'PathExpression') {
    return false;
  } else if (type === 'MustacheStatement') {
    let canTrim = true;

    if (['if', 'unless'].indexOf(value.path.original) !== -1) {
      let params = value.params;
      for (let i = 1; i < params.length; i++) {
        canTrim = canTrimUnnecessaryWhiteSpace(params[i], config);
        if (!canTrim) {
          break;
        }
      }
    }
    return canTrim;
  } else if (type === 'ConcatStatement') {
    let parts = value.parts;

    return parts.every((part) => {
      return canTrimUnnecessaryWhiteSpace(part, config);
    });
  }
  return true;
}


const canTrimBlockStatementContent = function(node, config) {
  // If a block or all the blocks is/are skiped (or) named as 'no-minify' then we need to preserve the whitespace.
  let componentName = node.path.original;
  if (config.components.indexOf(componentName) !== -1 || componentName === 'no-minify' || config.components === 'all') {
    return false;
  }
  return true;
};

const canTrimElementNodeContent = function(node, config) {
  // If a element or all the element is/are skiped then we need to preserve the whitespace.
  if (config.elements.indexOf(node.tag) !== -1 || config.elements === 'all') {
    return false;
  }
  let classAttributes = getElementAttribute(node, 'class');
  return classAttributes ? canTrimUnnecessaryWhiteSpace(classAttributes, config) : true;
};

const assignDefaultValues = function(config) {
  config = config || {};
  let elements = config.elements || 'all';
  let classes = config.classes || 'all';
  let components = config.components || 'all';

  return {
    elements,
    classes,
    components
  };
};

module.exports = {
  stripWhiteSpace,
  isWhitespaceTextNode,
  stripNoMinifyBlocks,
  hasLeadingOrTrailingWhiteSpace,
  canTrimBlockStatementContent,
  canTrimElementNodeContent,
  assignDefaultValues
};
