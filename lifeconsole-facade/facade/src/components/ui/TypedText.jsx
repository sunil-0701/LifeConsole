import { useEffect, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function Caret() {
  return <span className="caret" />;
}

function TypedText({ text, delay = 0, speed = 45, className }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let index = 0;
    let timer;

    const type = () => {
      index += 1;
      setCount(index);
      if (index < text.length) timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  const done = count >= text.length;

  let content;
  if (done) {
    content = text;
  } else if (count === 0) {
    // Reserve the final width before the first character lands.
    content = (
      <>
        <Caret />
        <span className="invisible">{text}</span>
      </>
    );
  } else {
    content = (
      <>
        {text.slice(0, count)}
        <Caret />
      </>
    );
  }

  return (
    <span className={className}>
      <span aria-hidden="true">{content}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default TypedText;
