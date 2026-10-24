import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrambleFrame, revealText } from '../src/reveal.js';
test('scramble progressively resolves the original text', () => {
  assert.equal(scrambleFrame('testing', 0, () => 0), '!!!!!!!');
  assert.equal(scrambleFrame('testing', 0.5, () => 0), 'tes!!!!');
  assert.equal(scrambleFrame('testing', 1), 'testing');
  assert.equal(scrambleFrame('a b', 0, () => 0), '! !');
});
function element() {
  const classes = new Set();
  return { textContent: 'testing', classes, classList: {
    add: value => classes.add(value), remove: value => classes.delete(value),
  } };
}
test('reveal runs once, ends with original text and schedules no more frames', () => {
  const heading = element();
  const queue = [];
  revealText(heading, { requestFrame: callback => queue.push(callback), random: () => 0 });
  queue.shift()(0);
  assert.equal(heading.textContent, '!!!!!!!');
  queue.shift()(700);
  assert.equal(heading.textContent, 'tes!!!!');
  queue.shift()(1400);
  assert.equal(heading.textContent, 'testing');
  assert.equal(heading.classes.size, 0);
  assert.equal(queue.length, 0);
});
test('reduced motion preserves text without scheduling animation', () => {
  const heading = element();
  revealText(heading, { reducedMotion: true, requestFrame: () => assert.fail('Animation scheduled') });
  assert.equal(heading.textContent, 'testing');
  assert.equal(heading.classes.size, 0);
});
