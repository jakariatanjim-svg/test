const symbols = '!<>-_?/\\[]{}=+*#________';

// A resolved prefix grows while the remaining letters scramble, then settles.
export function scrambleFrame(text, progress, random = Math.random) {
  if (progress >= 1) return text;
  const revealed = Math.floor(Math.max(0, progress) * text.length);
  return [...text].map((letter, index) => index < revealed || letter === ' '
    ? letter
    : symbols[Math.floor(random() * symbols.length) % symbols.length]).join('');
}

export function revealText(element, { reducedMotion = false, duration = 1400,
  requestFrame = requestAnimationFrame, random = Math.random } = {}) {
  const text = element.textContent;
  if (reducedMotion) return;
  let start;
  let previousFrame = -1;
  element.classList.add('revealing');
  function frame(time) {
    start ??= time;
    const progress = Math.min(1, (time - start) / duration);
    // Cap visual scrambling at 20 fps, rather than flashing at display refresh rate.
    const visualFrame = Math.floor((time - start) / 50);
    if (visualFrame !== previousFrame || progress === 1) {
      element.textContent = scrambleFrame(text, progress, random);
      previousFrame = visualFrame;
    }
    if (progress < 1) requestFrame(frame);
    else element.classList.remove('revealing');
  }
  requestFrame(frame);
}
