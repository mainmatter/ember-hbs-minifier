/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-hbs-minifier',

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let HbsMinifierPlugin = require('./hbs-minifier-plugin');

      registry.add('htmlbars-ast-plugin', {
        name: 'hbs-minifier-plugin',
        plugin: HbsMinifierPlugin,
        baseDir() { return __dirname; }
      });
    }
  },
};
