/* eslint-env node */

module.exports = {
  extends: 'simplabs/configs/ember-qunit',
  parserOptions: {
    ecmaVersion: 2017,
  },
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
