import { Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { ALL_NAV } from '../components/navigation/navItems';

// Bounded Levenshtein — enough to catch "/stiky-notes" or "/tsaks" without
// pulling in a fuzzy-match dependency.
function editDistance(a, b) {
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

// Score one path segment against one section label ("Sticky Notes" is
// normalised to "sticky-notes" first): exact beats prefix beats substring,
// and anything within a small edit distance is still worth suggesting.
function scoreSegment(needle, label) {
  const normalised = label.toLowerCase().replaceAll(/\s+/g, '-');

  if (normalised === needle) return 100;
  if (normalised.startsWith(needle) || needle.startsWith(normalised)) return 80;
  if (normalised.includes(needle) || needle.includes(normalised)) return 60;

  const distance = editDistance(needle, normalised);
  const budget = Math.max(2, Math.ceil(normalised.length / 4));
  return distance <= budget ? 40 - distance : null;
}

// Every segment is scored, so "/jornal/entry" still finds Journal — then the
// best three sections win, deduped by path.
function suggestionsFor(pathname) {
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

function NotFound() {
  const { pathname } = useLocation();
  const suggestions = suggestionsFor(pathname);

  return (
    <div>
      <PageHeader
        title="Page not found"
        hint="That URL does not match anything in LifeConsole yet."
      />
      <div className="flex min-h-[30vh] flex-col items-start justify-center py-10">
        <Compass className="h-5 w-5 text-zinc-600" strokeWidth={1.5} aria-hidden="true" />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
          The link may be out of date, or the section may have moved. Head back
          to the dashboard and pick up from there.
        </p>

        {suggestions.length > 0 ? (
          <div className="mt-5">
            <p className="font-mono text-xs tracking-wide text-zinc-600">Did you mean</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-300 transition-colors duration-150 hover:bg-white/[0.08] hover:text-white"
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-sm text-zinc-200 transition-colors duration-150 hover:bg-white/[0.09] hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
