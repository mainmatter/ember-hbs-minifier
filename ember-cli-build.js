'use strict';

/* eslint-env node */

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    'ember-hbs-minifier': {
      skip: {
        elements: ['pre', 'address'],
        classes: ['description'],
        components: ['foo-bar', 'no-minify'],
      },
    },

    'ember-cli-babel': {
      throwUnlessParallelizable: true,
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
