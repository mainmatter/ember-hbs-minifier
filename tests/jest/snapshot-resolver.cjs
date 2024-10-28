'use strict';

const path = require('path');

/* eslint-env node */

const hasOptionalChain = process.versions.node.split('.')[0] !== '12';

function ext(snapshotExtension) {
  return hasOptionalChain ? `${snapshotExtension}.newer` : `${snapshotExtension}.node12`;
}

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const base = path.basename(testPath);
    const dir = path.join(path.dirname(testPath), '__snapshots__');

    return path.join(dir, base) + ext(snapshotExtension);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    snapshotExtension = ext(snapshotExtension);

    let normalPath = snapshotFilePath.replace(snapshotExtension, '').replace(`__snapshots__/`, '');

    return normalPath;
  },
  testPathForConsistencyCheck: 'some.test.js',
};
