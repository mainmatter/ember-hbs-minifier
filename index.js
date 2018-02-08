/* eslint-env node */
'use strict';
let objectHash = require('object-hash');

module.exports = {
  name: 'ember-hbs-minifier',

  _setupPreprocessorRegistry(app) {
    let registry = app.registry;
    let options = app.options || {};
    let config = options['ember-hbs-minifier'] || {};

    let HbsMinifierPlugin = require('./hbs-minifier-plugin')(config.skip || {});
    registry.add('htmlbars-ast-plugin', {
      name: 'hbs-minifier-plugin',
      plugin: HbsMinifierPlugin,
      baseDir() { return __dirname; },
      cacheKey() { return `ember-hbs-minifier-${objectHash.MD5(config)}`; }
    });
  },

  included(app) {
    this._super.included.apply(this, arguments);
    /*
      Calling setupPreprocessorRegistry in included hook since app.options is not accessible
      Refer PR: https://github.com/ember-cli/ember-cli/pull/7059
    */
    this._setupPreprocessorRegistry(app);
  }
};
