export function parseVersion(value) {
  const match = /^v?([1-9]\d*)\.([0-9])$/.exec(value || '');
  return match ? Number(match[1]) * 10 + Number(match[2]) : null;
}
export function nextVersion(tags, override = '') {
  const highest = Math.max(9, ...tags.map(parseVersion).filter(v => v !== null));
  if (override && !/^[1-9]\d*(\.[0-9])?$/.test(override)) throw new Error('Version override must be a major number or X.Y (minor 0–9).');
  const value = override ? parseVersion(override.includes('.') ? override : `${override}.0`) : highest + 1;
  const version = `${Math.floor(value / 10)}.${value % 10}`;
  if (tags.includes(`v${version}`)) throw new Error(`Tag v${version} already exists. Choose an unused version.`);
  return { version, lower: value < highest };
}
export function releaseStatus(built, release, assetPresent) {
  const current = parseVersion(built);
  const latest = parseVersion(release);
  if (current === null || latest === null) return 'unknown';
  if (latest <= current) return 'current';
  return assetPresent ? 'available' : 'preparing';
}
