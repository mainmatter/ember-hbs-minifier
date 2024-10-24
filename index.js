/* eslint-env node */
'use strict';

const hashObj = require('hash-obj');

module.exports = {
  name: 'ember-hbs-minifier',

  _setupPreprocessorRegistry(app) {
    let registry = app.registry;
    let options = app.options || {};
    let config = options['ember-hbs-minifier'] || {};

    let pluginObj = this._buildPlugin(config);

    pluginObj.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildPlugin',
      params: config
    };

    registry.add('htmlbars-ast-plugin', pluginObj);
  },

  included(app) {
    this._super.included.apply(this, arguments);
    /*
      Calling setupPreprocessorRegistry in included hook since app.options is not accessible
      Refer PR: https://github.com/ember-cli/ember-cli/pull/7059
    */
    this._setupPreprocessorRegistry(app);
  },

  _buildPlugin(config) {
    let HbsMinifierPlugin = require('./hbs-minifier-plugin').createRegistryPlugin(config);

    return {
      name: 'hbs-minifier-plugin',
      plugin: HbsMinifierPlugin,
      baseDir() {
        return __dirname;
      },
      cacheKey() {
        return cacheKeyForConfig(config);
      }
    };
  }
};

function cacheKeyForConfig(config) {
  let configHash = hashObj(config, {
    encoding: 'base64',
    algorithm: 'md5'
  });

  return `ember-hbs-minifier-${configHash}`;
}
