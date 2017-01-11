/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-hbs-minifier',

  setupPreprocessorRegistry: function(type, registry) {
    if (type === 'parent') {
      var HbsMinifierPlugin = require('./hbs-minifier-plugin');

      registry.add('htmlbars-ast-plugin', {
        name: 'hbs-minifier-plugin',
        plugin: HbsMinifierPlugin,
        baseDir: function() { return __dirname; }
      });
    }
  },
};
