import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { suggestionsFor } from '../lib/suggestions';


function NotFound() {
  const { pathname } = useLocation();
  const suggestions = suggestionsFor(pathname);

  return (
    <div>
      <PageHeader
        title="Page not found"
        hint="That URL does not match anything in LifeConsole yet."
      />
      <div className="glass-panel flex min-h-72 max-w-2xl flex-col items-start justify-center rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgb(var(--accent-rgb)/0.1)]">
            <Compass className="h-6 w-6 text-[rgb(var(--accent-rgb))]" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="font-mono text-xs tracking-[0.2em] text-zinc-500">ERROR 404</span>
        </div>
        <code className="mt-4 max-w-full break-all rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-zinc-400">{pathname}</code>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
          The link may be out of date, or the section may have moved. Head back
          to the dashboard and pick up from there.
        </p>

        {suggestions.length > 0 ? (
          <div className="mt-5">
            <p className="font-mono text-xs tracking-wide text-zinc-400">Did you mean</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="glass-control inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:text-white"
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
          className="glass-control mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm text-zinc-200 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
