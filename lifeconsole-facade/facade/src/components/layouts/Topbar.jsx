import { Menu } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import LiveClock from '../ui/LiveClock';
import Avatar from '../ui/Avatar';

function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#09090b]/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors duration-150 hover:bg-white/[0.05] hover:text-zinc-100 lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </button>

        <SearchBar />

        <div className="ml-auto flex items-center gap-5">
          <LiveClock />
          <Avatar />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
