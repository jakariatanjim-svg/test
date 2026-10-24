import { releaseStatus } from './version.js';
const button = document.querySelector('#check');
const message = document.querySelector('#status');
const reload = document.querySelector('#reload');
document.querySelector('#version').textContent = `v${__APP_VERSION__} (${__APP_SHA__.slice(0, 7)})`;
const key = `testing-update-v1-${__APP_VERSION__}-${__APP_SHA__}`;
let running = false;
function readCache() {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function show(result, manual) {
  reload.hidden = !result.deployed;
  if (result.status === 'unknown') {
    message.textContent = manual ? "Couldn't check, try again later" : '';
  } else if (result.status === 'available') {
    message.textContent = result.deployed ? 'Update available. Reload to update.' : 'Update available; web deployment is preparing.';
  } else if (result.status === 'preparing') {
    message.textContent = 'Update preparing.';
  } else {
    message.textContent = manual ? 'You are up to date.' : '';
  }
}
async function check(manual = false) {
  if (running) return;
  const cached = readCache();
  if (!manual && cached && Date.now() - cached.time < 120000) {
    show(cached.result, false);
    return;
  }
  running = true;
  button.disabled = true;
  let result = { status: 'unknown', deployed: false };
  try {
    const response = await fetch(`https://api.github.com/repos/${__REPOSITORY__}/releases/latest`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Release check failed');
    const release = await response.json();
    const asset = release.assets?.some(a => /-web\.zip$/i.test(a.name));
    result.status = releaseStatus(__APP_VERSION__, release.tag_name, asset);
    if (result.status === 'available') {
      const deployed = await fetch(`${import.meta.env.BASE_URL}version.json?check=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (deployed.ok) {
        const metadata = await deployed.json();
        result.deployed = releaseStatus(__APP_VERSION__, metadata.version, true) === 'available' && metadata.sha !== __APP_SHA__;
      }
    }
  } catch { result = { status: 'unknown', deployed: false }; }
  finally {
    try { localStorage.setItem(key, JSON.stringify({ time: Date.now(), result })); } catch { /* Storage may be disabled. */ }
    show(result, manual);
    button.disabled = false;
    running = false;
  }
}
button.addEventListener('click', () => check(true));
reload.addEventListener('click', () => {
  const url = new URL(location.href);
  url.searchParams.set('update', Date.now());
  location.replace(url);
});
check();
