import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

function NotFound() {
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
