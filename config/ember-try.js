/* eslint-env node */
module.exports = {
  command: 'pnpm ember test',
  useVersionCompatibility: true,
  usePnpm: true,
  scenarios: [
    {
      name: 'ember-release',
      allowedToFail: true,
    },
  ],
};
