import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { nextVersion } from './release-version.js';
try {
  const tags = execFileSync('git', ['tag', '--list'], { encoding: 'utf8' }).trim().split('\n');
  const { version, lower } = nextVersion(tags, process.env.VERSION_OVERRIDE || '');
  if (lower) console.log('::warning::Override is lower than the highest tag. Future automatic releases still follow the highest tag.');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  console.log(version);
} catch (error) {
  console.error(`::error::${error.message}`);
  process.exit(1);
}
