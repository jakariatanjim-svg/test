import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync('src/theme.js', 'utf8').replace("import './style.css';", '');
function setup(saved, systemDark, blocked = false) {
  let listener;
  const values = new Map(saved ? [['testing-theme', saved]] : []);
  const toggle = { setAttribute(name, value) { this[name] = value; }, addEventListener(_, fn) { listener = fn; } };
  const root = { dataset: {} };
  const context = {
    document: { documentElement: root, querySelector: selector => selector === '#theme' ? toggle : {} },
    matchMedia: () => ({ matches: systemDark }),
    localStorage: {
      getItem: key => { if (blocked) throw Error('Blocked'); return values.get(key); },
      setItem: (key, value) => { if (blocked) throw Error('Blocked'); values.set(key, value); },
    },
  };
  runInNewContext(source, context);
  return { root, toggle, values, click: () => listener() };
}
test('system theme initializes, accessible switch persists choice', () => {
  const state = setup(null, true);
  assert.equal(state.root.dataset.theme, 'dark');
  assert.equal(state.toggle['aria-checked'], 'true');
  state.click();
  assert.equal(state.root.dataset.theme, 'light');
  assert.equal(state.values.get('testing-theme'), 'light');
});
test('saved theme overrides system; blocked storage still permits toggling', () => {
  assert.equal(setup('dark', false).root.dataset.theme, 'dark');
  const state = setup(null, false, true);
  state.click();
  assert.equal(state.root.dataset.theme, 'dark');
});
