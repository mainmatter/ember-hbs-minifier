/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-hbs-minifier',

  isDevelopingAddon() {
    return false;
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let config;
      try {
        let path = this.isDevelopingAddon() ? `${this.project.root}/tests/dummy` : this.project.root;
        config = require(`${path}/.hbs-minifyrc.js`);
      } catch (error) {
        throw error;
      }
      let HbsMinifierPlugin = require('./hbs-minifier-plugin')(config.whiteList);
      registry.add('htmlbars-ast-plugin', {
        name: 'hbs-minifier-plugin',
        plugin: HbsMinifierPlugin,
        baseDir() { return __dirname; }
      });
    }
  },
};
