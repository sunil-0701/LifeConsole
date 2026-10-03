import {
  Home,
  NotebookPen,
  ListChecks,
  Target,
  Wallet,
  Repeat,
  StickyNote,
  Image,
  FileText,
  Heart,
  BarChart3,
  Settings,
  SquareTerminal,
} from 'lucide-react';
import NavItem from '../navigation/NavItem';

const PRIMARY_NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/finance', label: 'Finance', icon: Wallet },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/sticky-notes', label: 'Sticky Notes', icon: StickyNote },
  { label: 'Gallery', icon: Image, locked: true },
  { label: 'Documents', icon: FileText, locked: true },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile scrim */}
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={[
          'fixed inset-0 z-30 bg-black/60 transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-[17rem] p-3',
          'transition-transform duration-300 ease-out lg:translate-x-0 lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
          {/* Branding */}
          <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-white/[0.1] bg-white/[0.06]">
              <SquareTerminal
                className="h-4 w-4 text-zinc-300"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <span className="text-[15px] font-medium tracking-tight text-zinc-100">
              LifeConsole
            </span>
          </div>

          {/* Primary navigation */}
          <nav
            aria-label="Primary"
            onClick={onClose}
            className="flex-1 space-y-0.5 overflow-y-auto px-3"
          >
            {PRIMARY_NAV.map((item) => (
              <NavItem key={item.locked ? item.label : item.to} {...item} />
            ))}
          </nav>

          {/* Bottom navigation */}
          <div onClick={onClose} className="space-y-3 border-t border-white/[0.06] px-3 py-4">
            <NavItem to="/settings" label="Settings" icon={Settings} />
            <p className="px-3 font-mono text-[11px] leading-relaxed text-zinc-600">
              &ldquo;A better you, every day.&rdquo;
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
