export function scheduleTyping(length, delay, speed, onCount) {
  if (length === 0) return () => {};

  const start = performance.now() + Math.max(0, delay);
  const cadence = Math.max(1, speed);
  let timer;
  let cancelled = false;

  const tick = () => {
    if (cancelled) return;

    const count = Math.min(length, Math.floor((performance.now() - start) / cadence) + 1);
    onCount(count);

    if (!cancelled && count < length) {
      timer = setTimeout(tick, Math.max(1, start + count * cadence - performance.now()));
    }
  };

  timer = setTimeout(tick, Math.max(0, delay));

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}
