import { Menu, Search } from 'lucide-react';
import LiveClock from '../ui/LiveClock';
import Avatar from '../ui/Avatar';

function Topbar({ onMenu, onSearch, onHelp }) {
  return (
    <header className="glass-chrome flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-8 lg:h-16 lg:flex-nowrap lg:py-0">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-white/[0.05] hover:text-zinc-100 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <span className="shrink-0 text-[15px] font-semibold tracking-tight text-zinc-100 lg:hidden">
        LifeConsole
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onHelp}
          aria-label="Keyboard shortcuts"
          className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm text-zinc-400 hover:text-zinc-100"
        >
          <span aria-hidden="true">?</span>
        </button>

        <button
          type="button"
          onClick={onSearch}
          aria-label="Search sections"
          className="glass-control flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-white/[0.08] px-1 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline">Ctrl K</kbd>
        </button>
        <LiveClock />
        <Avatar />
      </div>
    </header>
  );
}

export default Topbar;
