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

module.exports = {
  stripWhiteSpace,
  isWhitespaceTextNode,
  stripNoMinifyBlocks,
  hasLeadingOrTrailingWhiteSpace
};
