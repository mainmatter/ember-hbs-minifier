/* eslint-env node */
'use strict';

const matchHorizontalTABAndNewLineBegin = /^(%20|%09|%0A)+/g;
const matchHorizontalTABAndNewLineEnd = /(%20|%09|%0A)+$/g;
const WHITESPACE = /^(%20|%09|%0A)+$/;

const isWhitespaceTextNode = function(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(encodeURIComponent(node.chars));
};
const getElementAttribute = function(node, attrName) {
  let attribute = node.attributes.find((attr) => {
    return attr.type === 'AttrNode' && attr.name === attrName;
  });

  return (attribute || {}).value;
};

const hasLeadingOrTrailingWhiteSpace = function(chars) {
  chars = encodeURIComponent(chars);
  return matchHorizontalTABAndNewLineEnd.test(chars) || matchHorizontalTABAndNewLineEnd.test(chars);
};

const stripWhiteSpace = function(chars = '') {
  chars = encodeURIComponent(chars);
  chars = chars.replace(matchHorizontalTABAndNewLineBegin, ' ')
   .replace(matchHorizontalTABAndNewLineEnd, ' ');
  return decodeURIComponent(chars);
};

const stripNoMinifyBlocks = function(nodes) {
  return nodes.map(node => {
    if (node.type === 'BlockStatement' && node.path.original === 'no-minify') {
      return node.program.body;
    }
    return node;
  }).reduce((a, b) => a.concat(b), []);
};

const isComponentIncluded = function(componentName, components) {
  return components.includes(componentName);
};

const isTemplateIncluded = function(templateName, templates) {
  return templates.includes(templateName);
};

const canTrimModule = function(modulePath, config) {
  if (!modulePath) {
    return true;
  }
  let path = modulePath.match(/templates\/.*(?=\.hbs)/)[0];

  if (path.startsWith('templates/components/')) {
    let componentName = path.replace('templates/components/', '');
    return !isComponentIncluded(componentName, config.components);
  } else {
    let templateName = path.replace('templates/', '');
    return !isTemplateIncluded(templateName, config.templates);
  }
};

const isClassIncluded = function(chars = '', elementClassNames) {
  chars = chars.trim().split(' ');

  return chars.some((char) => {
    return elementClassNames.includes(char);
  });
};

const canTrimUnnecessaryWhiteSpace = function(value, config) {
  if (!value) {
    return true;
  }
  let { type } = value;

  if (type === 'TextNode') {
    return !isClassIncluded(value.chars, config.elementClassNames);
  } else if (type === 'StringLiteral') {
    return !isClassIncluded(value.value, config.elementClassNames);
  } else if (type === 'MustacheStatement') {
    let canTrim = true;

    if (['if', 'unless'].includes(value.path.original)) {
      let params = value.params;
      for (let i = 1; i < params.length; i++) {
        canTrim = canTrimUnnecessaryWhiteSpace(params[i], config);
        if (!canTrim) {
          break;
        }
      }
    }
    return canTrim;
  } else if (type === 'PathExpression') {
    return false;
  } else if (type === 'ConcatStatement') {
    let { parts } = value;

    return parts.every((part) => {
      return canTrimUnnecessaryWhiteSpace(part, config);
    });
  }
  return true;
};


const canTrimBlockStatementContent = function(node, config) {
  let componentName = node.path.original;
  if (config.components.includes(componentName)) {
    return false;
  }
  return true;
};

const canTrimElementNodeContent = function(node, config) {
  if (config.elementNodes.includes(node.tag)) {
    return false;
  }
  let classAttributes = getElementAttribute(node, 'class');
  return classAttributes ? canTrimUnnecessaryWhiteSpace(classAttributes, config) : true;
};

const assignDefaultValues = function(config = {}) {
  let elementNodes = config.elementNodes || [];
  let elementClassNames = config.elementClassNames || [];
  let components = config.components || [];
  let templates = config.templates || [];

  return {
    elementNodes,
    elementClassNames,
    components,
    templates
  };
};

module.exports = {
  stripWhiteSpace,
  isWhitespaceTextNode,
  WHITESPACE,
  stripNoMinifyBlocks,
  hasLeadingOrTrailingWhiteSpace,
  canTrimBlockStatementContent,
  canTrimElementNodeContent,
  canTrimModule,
  assignDefaultValues
};
