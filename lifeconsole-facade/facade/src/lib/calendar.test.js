import { describe, expect, it } from 'vitest';
import { isDayKey, localDay, shiftDay } from './calendar';

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

describe('shiftDay', () => {
  it('crosses year and leap-month boundaries in either direction', () => {
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDay('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftDay('2024-02-28', 1)).toBe('2024-02-29');
    expect(shiftDay('2024-03-01', -1)).toBe('2024-02-29');
    expect(shiftDay('2026-06-15', 0)).toBe('2026-06-15');
  });

  it('rejects invalid dates and non-integer shifts', () => {
    expect(shiftDay('2026-02-30', 1)).toBeNull();
    for (const amount of [0.5, NaN, Infinity, '1']) {
      expect(shiftDay('2026-01-01', amount)).toBeNull();
    }
    expect(shiftDay('9999-12-31', 1)).toBeNull();
  });
});
