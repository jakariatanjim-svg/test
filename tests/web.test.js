import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('website has no release metadata, update checks or prompts', () => {
  const html = readFileSync('index.html', 'utf8');
  const main = readFileSync('src/main.js', 'utf8');
  const config = readFileSync('vite.config.js', 'utf8');
  assert.doesNotMatch(html, /id="(?:version|check|reload|status)"/);
  assert.doesNotMatch(main, /fetch\(|localStorage|__APP_VERSION__|__APP_SHA__|releaseStatus/);
  assert.doesNotMatch(config, /version\.json|APP_VERSION|APP_SHA|__REPOSITORY__/);
  assert.match(main, /revealText/);
});

test('workflows keep labels out of the website and use repository names', () => {
  for (const file of ['web-test.yml', 'web-release.yml']) {
    const workflow = readFileSync(`.github/workflows/${file}`, 'utf8');
    assert.doesNotMatch(workflow, /APP_VERSION|APP_SHA|npm pkg set/);
    assert.match(workflow, /GITHUB_REPOSITORY#\*\//);
  }
  const release = readFileSync('.github/workflows/web-release.yml', 'utf8');
  assert.match(release, /--target "\$GITHUB_SHA"/);
  assert.match(release, /--title "\$NAME — v\$VERSION" --generate-notes --latest/);
  assert.match(release, /cancel-in-progress: false/);
});
