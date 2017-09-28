'use strict';
/*eslint-env node */

const path = require('path');

module.exports = {
  description: 'Generate default configuration for ember-hbs-minifier.',

  normalizeEntityName() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  supportsAddon() {
    return true;
  },

  filesPath() {
    return path.join(this.path, 'default-config');
  }
};
