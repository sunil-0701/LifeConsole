import { describe, expect, it } from 'vitest';
import { isDayKey, localDay } from './calendar';

describe('calendar day keys', () => {
  it('formats local calendar fields with leading zeroes', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('accepts leap days only in leap years', () => {
    expect(isDayKey('2024-02-29')).toBe(true);
    expect(isDayKey('2025-02-29')).toBe(false);
    expect(isDayKey('1900-02-29')).toBe(false);
    expect(isDayKey('2000-02-29')).toBe(true);
  });

  it('rejects malformed keys and impossible dates', () => {
    for (const value of [null, undefined, 20260105, '', '2026-1-05', '2026-04-31', '2026-13-01']) {
      expect(isDayKey(value)).toBe(false);
    }
  });
});
