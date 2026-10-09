import { Menu, Search } from 'lucide-react';
import LiveClock from '../ui/LiveClock';
import Avatar from '../ui/Avatar';

function Topbar({ onMenu, onSearch, onHelp }) {
  return (
    <header className="flex h-16 items-center gap-4 px-5 sm:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-white/[0.05] hover:text-zinc-100 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <span className="text-[15px] font-semibold tracking-tight text-zinc-100 lg:hidden">
        LifeConsole
      </span>

      <div className="ml-auto flex items-center gap-5">
        <button
          type="button"
          onClick={onHelp}
          aria-label="Keyboard shortcuts"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-100"
        >
          <span aria-hidden="true">?</span>
        </button>

        <button
          type="button"
          onClick={onSearch}
          aria-label="Search sections"
          className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-zinc-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-zinc-100"
        >
          <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden font-mono text-[10px] text-zinc-600 sm:inline">Ctrl K</kbd>
        </button>
        <LiveClock />
        <Avatar />
      </div>
    </header>
  );
}

export default Topbar;
