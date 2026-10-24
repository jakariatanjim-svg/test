import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextVersion, parseVersion, releaseStatus } from '../src/version.js';
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
test('only strictly newer versions offer updates', () => {
  assert.equal(releaseStatus('1.0', 'v1.1', true), 'available');
  assert.equal(releaseStatus('1.0', 'v1.1', false), 'preparing');
  assert.equal(releaseStatus('1.1', 'v1.1', true), 'current');
  assert.equal(releaseStatus('2.0', 'v1.9', true), 'current');
  assert.equal(releaseStatus('1.0', 'bad', true), 'unknown');
});
