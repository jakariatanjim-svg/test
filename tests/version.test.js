import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextVersion, parseVersion } from '../scripts/release-version.js';
test('first version and numeric rollover', () => {
  assert.equal(nextVersion([]).version, '1.0');
  assert.equal(nextVersion(['v1.9', 'v1.2', 'junk']).version, '2.0');
  assert.equal(nextVersion(['v9.9', 'v10.0']).version, '10.1');
});
test('overrides and collisions', () => {
  assert.equal(nextVersion([], '3').version, '3.0');
  assert.equal(nextVersion(['v3.0'], '1.4').lower, true);
  assert.throws(() => nextVersion(['v1.0'], '1'));
  assert.throws(() => nextVersion([], '1.10'));
  assert.equal(parseVersion('v1.2.3'), null);
});
test('only canonical vX.Y tags affect release numbering', () => {
  assert.equal(nextVersion(['9.9', 'v01.2', 'v1.10', 'v2.3.4']).version, '1.0');
  assert.equal(nextVersion(['v2.9', 'v10.0', 'v9.9']).version, '10.1');
});
