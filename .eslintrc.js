/* eslint-env node */

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  extends: 'simplabs',
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        // conflicts with prettier
        'space-before-function-paren': 0,
        indent: 0,
      },
    },
  ],
};
