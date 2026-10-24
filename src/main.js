import { revealText } from './reveal.js';

revealText(document.querySelector('#title-text'), {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
});
