// Day keys represent calendar dates, not instants or UTC conversions.
export function localDay(date = new Date()) {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isDayKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function shiftDay(day, amount) {
  if (!isDayKey(day) || !Number.isInteger(amount)) return null;
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  if (Number.isNaN(date.getTime())) return null;
  const result = date.toISOString().slice(0, 10);
  return isDayKey(result) ? result : null;
}

export function recentDays(day, count = 7) {
  if (!isDayKey(day) || !Number.isInteger(count) || count < 1 || count > 366) return [];
  return Array.from({ length: count }, (_, index) => shiftDay(day, index - count + 1)).filter(Boolean);
}

export function msUntilMidnight(date = new Date()) {
  const next = new Date(date);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - date.getTime();
}
