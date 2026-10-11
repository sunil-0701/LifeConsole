import { ALL_NAV } from '../components/navigation/navItems';

export function editDistance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = Math.min(
        previous[j] + 1,
        row[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = row;
  }

  return previous[b.length];
}

export function scoreSegment(needle, label) {
  const normalised = label.toLowerCase().replaceAll(/\s+/g, '-');

  if (normalised === needle) return 100;
  if (normalised.startsWith(needle) || needle.startsWith(normalised)) return 80;
  if (normalised.includes(needle) || needle.includes(normalised)) return 60;

  const distance = editDistance(needle, normalised);
  const budget = Math.max(2, Math.ceil(normalised.length / 4));
  return distance <= budget ? 40 - distance : null;
}

export function suggestionsFor(pathname) {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  if (segments.length === 0) return [];

  const best = new Map();

  for (const needle of segments) {
    for (const item of ALL_NAV) {
      if (!item.to || item.locked) continue;

      const score = scoreSegment(needle, item.label);
      if (score === null) continue;

      const current = best.get(item.to);
      if (current === undefined || score > current.score) {
        best.set(item.to, { item, score });
      }
    }
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);
}
