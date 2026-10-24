import './style.css';
const preference = matchMedia('(prefers-color-scheme: dark)');
let stored;
try { stored = localStorage.getItem('testing-theme'); } catch { /* Private browsing may block storage. */ }
let theme = stored === 'dark' || stored === 'light' ? stored : preference.matches ? 'dark' : 'light';
function apply() {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#11131c' : '#f8f9ff';
  document.querySelector('#theme').setAttribute('aria-checked', String(theme === 'dark'));
}
apply();
document.querySelector('#theme').addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('testing-theme', theme); } catch { /* Use in-memory preference if unavailable. */ }
  apply();
});
