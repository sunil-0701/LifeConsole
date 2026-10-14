import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOCAL_DATA_KEYS, clearLocalData } from './localData';
import { NOTES_KEY } from './notes';
import { createHabit, HABITS_KEY } from './habits';
import { withBrowser, withoutBrowser } from '../test/fakeBrowser';

beforeEach(withBrowser);
afterEach(withoutBrowser);

describe('clearLocalData', () => {
  it('includes notes and removes all owned keys without touching unrelated data', () => {
    expect(LOCAL_DATA_KEYS).toContain(NOTES_KEY);
    for (const key of LOCAL_DATA_KEYS) window.localStorage.setItem(key, 'value');
    window.localStorage.setItem('another-app', 'keep');
    expect(clearLocalData()).toBe(true);
    for (const key of LOCAL_DATA_KEYS) expect(window.localStorage.getItem(key)).toBeNull();
    expect(window.localStorage.getItem('another-app')).toBe('keep');
  });

  it('is safe to repeat with empty storage', () => {
    expect(clearLocalData()).toBe(true);
    expect(clearLocalData()).toBe(true);
  });

  it('removes both active and archived habit histories', () => {
    const active = { ...createHabit('Walk', '2026-10-14'), completedDays: ['2026-10-14'] };
    const archived = { ...createHabit('Read', '2026-10-14'), archived: true };
    window.localStorage.setItem(HABITS_KEY, JSON.stringify([active, archived]));
    expect(LOCAL_DATA_KEYS).toContain(HABITS_KEY);
    expect(clearLocalData()).toBe(true);
    expect(window.localStorage.getItem(HABITS_KEY)).toBeNull();
  });

  it('reports failures while still attempting every owned key', () => {
    const remove = vi.fn((key) => {
      if (key === LOCAL_DATA_KEYS[0]) throw new Error('blocked');
    });
    window.localStorage.removeItem = remove;
    expect(clearLocalData()).toBe(false);
    expect(remove.mock.calls.map(([key]) => key)).toEqual(LOCAL_DATA_KEYS);
  });
});
