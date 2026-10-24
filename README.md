# vite-testing

A minimal Vite web app with centered “testing”, a Material 3–inspired UI, and a light/dark switch. No UI framework, remote fonts, native APIs or service worker.

```sh
npm ci
npm run dev
npm run check && npm test && npm run build
```

## Build and release

Exactly two manual Actions workflows, in this order when desired:

1. **Web — Test Build**: select any branch. Runs syntax checks/tests, builds with the next-version label, uploads an artifact for 7 days. Never publishes a release or deployment.
2. **Web — Release**: select the default branch; other branches require the **confirm** checkbox. Optionally set **version_override** to `2.0` or `3` (meaning `3.0`). It tests, builds, packages `vite-testing-web.zip`, then creates an unused tag at the exact built SHA and a Latest release titled `vite-testing — vX.Y` with GitHub's auto-generated notes only. No merging is required for an explicitly confirmed branch release.

Versions start at `v1.0`, advance numerically through `v1.9` to `v2.0`, and ignore malformed tags. No source version bumps are committed. CI injects package version `X.Y.0`, display version `X.Y` and commit SHA. A lower override warns; the next automatic release still follows the highest valid tag. Existing tags/releases are never reused or overwritten. Release runs are serialized globally and never cancel an active release. GitHub may replace pending runs, so request releases one at a time.

Only the workflow's built-in `GITHUB_TOKEN` needs `contents: write`. No personal token, Cloudflare token, Pages permission or signing key is needed. Node 22 and the npm dependency cache are used. No persistent compile cache is needed for this tiny Vite build.

[Latest release and downloads](https://github.com/jakariatanjim-svg/test/releases/latest)

## Cloudflare Pages — deploy yourself

Download the web ZIP from the latest release and extract it. Upload its **contents** to Cloudflare Pages (the root must contain `index.html`, not an outer directory). The build uses `/` as its base. Neither workflow deploys anything; there are no GitHub Pages steps.

The output includes:

- `_redirects`: SPA fallback to `/index.html`.
- `_headers`: security headers, a restrictive CSP, uncached HTML/metadata/service-worker paths, and immutable one-year caching for hashed `/assets/*`.
- `version.json`: build version and commit SHA, used for deployment detection.

There is no service worker to cache stale content. If adding one later, keep its script at a path covered by the no-store policy. Deploy the complete build atomically so HTML and hashed assets match. Release publication alone does not update the live site.

## Updates, theme and data

Each page load checks the latest GitHub release unless a saved result is less than two minutes old. **Check for updates** always checks immediately and is disabled during the request. No polling, focus/resume hooks or background timers. Automatic offline/403/429 failures are silent; manual failures show “Couldn't check, try again later”.

Only a strictly newer valid version qualifies. A forgiving web-ZIP name match distinguishes `available` from `preparing`; other states are `current` and `unknown`. Before offering Reload, the app fetches uncached deployment metadata and confirms that a newer build is actually live. Reload uses a cache-busting URL. Users receive the update only after you deploy it.

Browser localStorage holds the last check time/result and `testing-theme` preference. First visit follows the system theme; the switch persists the chosen mode. There are no native data folders, user files or signing requirements for this web-only project.
