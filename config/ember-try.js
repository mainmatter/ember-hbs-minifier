/* eslint-env node */
module.exports = {
  command: 'yarn run ember test',
  useVersionCompatibility: true,
  usePnpm: true,
  scenarios: [{
    name: 'ember-release',
    allowedToFail: true,
  }]
};
