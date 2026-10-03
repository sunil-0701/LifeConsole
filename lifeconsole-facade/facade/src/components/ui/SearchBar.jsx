import { Search } from 'lucide-react';

function SearchBar() {
  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative w-full max-w-lg"
    >
      <label htmlFor="global-search" className="sr-only">
        Search anything
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-600"
        aria-hidden="true"
      />
      <input
        id="global-search"
        type="search"
        placeholder="Search anything..."
        className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pr-20 pl-9 text-sm text-zinc-200 transition-colors duration-150 placeholder:text-zinc-600 hover:border-white/[0.12] focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
      />
      <span className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 md:flex">
        <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-sans text-[11px] text-zinc-600">
          Ctrl
        </kbd>
        <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-sans text-[11px] text-zinc-600">
          K
        </kbd>
      </span>
    </form>
  );
}

export default SearchBar;
