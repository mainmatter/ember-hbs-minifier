/* eslint-env node */
'use strict';

// below are the encoded values of ' ', '\n' and '\t' to avoid collapsing multiple &nbsp; into a single whitespace.
const matchHorizontalTABAndNewLineBegin = /^(%20|%09|%0A)+/;
const matchHorizontalTABAndNewLineEnd = /(%20|%09|%0A)+$/;
const WHITESPACE = /^(%20|%09|%0A)+$/;

const isWhitespaceTextNode = function(node) {
  return node && node.type === 'TextNode' && WHITESPACE.test(encodeURIComponent(node.chars));
};

const hasLeadingOrTrailingWhiteSpace = function(chars) {
  chars = encodeURIComponent(chars);
  return matchHorizontalTABAndNewLineBegin.test(chars) || matchHorizontalTABAndNewLineEnd.test(chars);
};

const stripWhiteSpace = function(chars) {
  /*
    Replacing multiple ' '(leading/trailing), '\n' and '\t' into a single whitespace.
  */
  chars = encodeURIComponent(chars || '');
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

module.exports = {
  stripWhiteSpace,
  isWhitespaceTextNode,
  WHITESPACE,
  stripNoMinifyBlocks,
  hasLeadingOrTrailingWhiteSpace
};
