import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  RECENTS_KEY,
  clearSectionRecents,
  recentSections,
  rememberSection,
} from './sectionRecents';
import { withBrowser, withoutBrowser } from '../test/fakeBrowser';

beforeEach(withBrowser);
afterEach(withoutBrowser);

describe('rememberSection', () => {
  it('keeps the newest visit first and drops duplicates', () => {
    rememberSection('/tasks');
    rememberSection('/journal');
    rememberSection('/tasks');

    expect(recentSections()).toEqual(['/tasks', '/journal']);
  });

  it('caps the history at five entries', () => {
    ['/a', '/b', '/c', '/d', '/e', '/f'].forEach((path) => rememberSection(path));

    expect(recentSections()).toEqual(['/f', '/e', '/d', '/c', '/b']);
  });

  it('treats corrupt storage as an empty list and recovers', () => {
    globalThis.window.localStorage.setItem(RECENTS_KEY, '{not json');
    expect(recentSections()).toEqual([]);

    rememberSection('/tasks');
    expect(recentSections()).toEqual(['/tasks']);
  });

  it('never throws when storage is blocked', () => {
    globalThis.window.localStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };

    expect(() => rememberSection('/tasks')).not.toThrow();
    expect(recentSections()).toEqual([]);
  });
});

describe('clearSectionRecents', () => {
  it('forgets the whole history', () => {
    rememberSection('/tasks');
    clearSectionRecents();

    expect(recentSections()).toEqual([]);
  });

  it('does not throw when there is nothing to clear', () => {
    expect(() => clearSectionRecents()).not.toThrow();
  });
});
