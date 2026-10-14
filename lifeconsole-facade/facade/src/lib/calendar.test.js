import { describe, expect, it } from 'vitest';
import { isDayKey, localDay, msUntilMidnight, recentDays, shiftDay } from './calendar';

describe('calendar dates', () => {
  it('uses local components rather than a UTC date string', () => {
    expect(localDay(new Date(2026, 9, 14, 0, 5))).toBe('2026-10-14');
    expect(localDay(new Date(2026, 0, 2, 23, 55))).toBe('2026-01-02');
  });

  it('validates real, padded calendar dates', () => {
    expect(isDayKey('2024-02-29')).toBe(true);
    for (const day of ['2026-02-29', '2026-13-01', '2026-1-01', '2026-04-31', '', null]) {
      expect(isDayKey(day)).toBe(false);
    }
  });

  it('moves across month, year and leap-day boundaries', () => {
    expect(shiftDay('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftDay('2024-03-01', -1)).toBe('2024-02-29');
    expect(shiftDay('2026-03-08', 1)).toBe('2026-03-09');
    expect(shiftDay('bad', 1)).toBeNull();
    expect(shiftDay('2026-01-01', 0.5)).toBeNull();
  });

  it('returns an oldest-first week ending on the requested date', () => {
    expect(recentDays('2026-01-03')).toEqual([
      '2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31',
      '2026-01-01', '2026-01-02', '2026-01-03',
    ]);
    expect(recentDays('bad')).toEqual([]);
    expect(recentDays('2026-01-03', 0)).toEqual([]);
  });

  it('schedules against the next local midnight', () => {
    expect(msUntilMidnight(new Date(2026, 9, 14, 23, 59, 59, 500))).toBe(500);
    const now = new Date(2026, 9, 14, 13);
    expect(msUntilMidnight(now)).toBe(new Date(2026, 9, 15).getTime() - now.getTime());
  });
});
