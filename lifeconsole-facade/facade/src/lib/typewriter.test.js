import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scheduleTyping } from './typewriter';

describe('scheduleTyping', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('does no work during the initial delay', () => {
    const onCount = vi.fn();
    const cancel = scheduleTyping(3, 220, 60, onCount);

    vi.advanceTimersByTime(219);
    expect(onCount).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(1);
    expect(onCount).toHaveBeenCalledExactlyOnceWith(1);
    cancel();
  });

  it('wakes once per character and stops after completion', () => {
    const onCount = vi.fn();
    scheduleTyping(3, 220, 60, onCount);

    vi.advanceTimersByTime(1000);

    expect(onCount.mock.calls).toEqual([[1], [2], [3]]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('catches up to elapsed time instead of replaying missed characters', () => {
    const onCount = vi.fn();
    scheduleTyping(20, 100, 60, onCount);
    vi.spyOn(performance, 'now').mockReturnValue(1000);

    vi.advanceTimersByTime(100);

    expect(onCount).toHaveBeenCalledExactlyOnceWith(16);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('cancels pending work when the component unmounts', () => {
    const onCount = vi.fn();
    const cancel = scheduleTyping(10, 100, 60, onCount);

    vi.advanceTimersByTime(100);
    cancel();
    vi.advanceTimersByTime(1000);

    expect(onCount).toHaveBeenCalledExactlyOnceWith(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not schedule work for empty text', () => {
    const onCount = vi.fn();
    scheduleTyping(0, 100, 60, onCount)();

    expect(onCount).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clamps delayed callbacks at the full text length', () => {
    const onCount = vi.fn();
    scheduleTyping(3, 100, 60, onCount);
    vi.spyOn(performance, 'now').mockReturnValue(1000);

    vi.advanceTimersByTime(100);

    expect(onCount).toHaveBeenCalledExactlyOnceWith(3);
    expect(vi.getTimerCount()).toBe(0);
  });
});
