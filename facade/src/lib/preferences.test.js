import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ACCENT_KEY,
  ACCENTS,
  DEFAULT_ACCENT,
  applyAccent,
  readAccent,
  writeAccent,
} from './preferences';
import { withBrowser, withoutBrowser } from '../test/fakeBrowser';

beforeEach(withBrowser);
afterEach(withoutBrowser);

describe('readAccent', () => {
  it('falls back to the default when nothing is stored', () => {
    expect(readAccent()).toBe(DEFAULT_ACCENT);
  });

  it('rejects stored ids that have no matching css rule', () => {
    globalThis.window.localStorage.setItem(ACCENT_KEY, 'chartreuse');

    expect(readAccent()).toBe(DEFAULT_ACCENT);
  });

  it('returns a stored, valid id', () => {
    writeAccent('rose');

    expect(readAccent()).toBe('rose');
  });
});

describe('writeAccent', () => {
  it('persists under the exported key', () => {
    writeAccent('amber');

    expect(globalThis.window.localStorage.getItem(ACCENT_KEY)).toBe('amber');
  });

  it('never throws when storage is blocked', () => {
    globalThis.window.localStorage.setItem = () => {
      throw new Error('blocked');
    };

    expect(() => writeAccent('amber')).not.toThrow();
  });
});

describe('applyAccent', () => {
  it('sets the data attribute the stylesheet keys off', () => {
    applyAccent('emerald');

    expect(globalThis.document.documentElement.dataset.accent).toBe('emerald');
  });
});

describe('ACCENTS', () => {
  it('lists unique ids and includes the default', () => {
    const ids = ACCENTS.map((option) => option.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_ACCENT);
  });
});
