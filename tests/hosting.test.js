import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
test('Cloudflare output policies and SPA fallback are shipped as static assets', () => {
  const headers = readFileSync('public/_headers', 'utf8');
  assert.match(headers, /\/assets\/\*[\s\S]*immutable/);
  assert.match(headers, /\/index\.html\n  Cache-Control: no-store/);
  assert.match(headers, /\/sw\.js\n  Cache-Control: no-store/);
  assert.match(headers, /Content-Security-Policy:/);
  assert.equal(readFileSync('public/_redirects', 'utf8').trim(), '/* /index.html 200');
});
test('exactly two manual workflows with no deployment or hosting credentials', () => {
  const workflows = readdirSync('.github/workflows');
  assert.equal(workflows.length, 2);
  for (const file of workflows) {
    const source = readFileSync(`.github/workflows/${file}`, 'utf8');
    assert.match(source, /workflow_dispatch:/);
    assert.doesNotMatch(source, /actions\/deploy-pages|upload-pages-artifact|pages: write|CLOUDFLARE_API_TOKEN/);
    assert.doesNotMatch(source, /--base=/);
  }
});
