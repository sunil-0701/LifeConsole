import { useEffect, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function TypedText({ text, delay = 0, speed = 45, className }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let frame = 0;
    let last = 0;
    const start = performance.now();

    // One frame loop on an absolute schedule: cadence stays locked to the
    // display refresh instead of drifting like a setTimeout chain, and
    // state updates only fire when a character actually lands.
    const tick = (now) => {
      const elapsed = now - start - delay;
      const index = Math.max(0, Math.min(text.length, Math.floor(elapsed / speed) + 1));

      if (index !== last) {
        last = index;
        setCount(index);
      }

      if (last < text.length) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, speed]);

  const done = count >= text.length;

  let content;
  if (done) {
    content = text;
  } else if (count === 0) {
    // Reserve the final width before the first character lands.
    content = <span className="invisible">{text}</span>;
  } else {
    content = text.slice(0, count);
  }

  return (
    <span className={className}>
      <span aria-hidden="true">{content}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default TypedText;
