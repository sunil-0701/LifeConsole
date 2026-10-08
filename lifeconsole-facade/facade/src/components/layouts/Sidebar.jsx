import NavItem from '../navigation/NavItem';
import { PRIMARY_NAV, SETTINGS_NAV } from '../navigation/navItems';

function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Wordmark pinned above the desktop rail, in the top-left corner */}
      <span className="fixed top-4 left-4 z-40 hidden text-[15px] font-semibold tracking-tight text-zinc-100 lg:block">
        LifeConsole
      </span>

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
          'fixed top-0 bottom-0 left-0 z-40 w-[17rem] p-3 lg:top-14 lg:w-[4.5rem] lg:p-2',
          'transition-transform duration-300 ease-out lg:translate-x-0 lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
          <nav
            aria-label="Primary"
            onClick={onClose}
            className="flex-1 space-y-0.5 overflow-y-auto px-3 pt-4 lg:overflow-visible lg:px-2 lg:pt-5"
          >
            {PRIMARY_NAV.map((item) => (
              <NavItem key={item.locked ? item.label : item.to} {...item} />
            ))}
          </nav>

          <div onClick={onClose} className="border-t border-white/[0.06] px-3 py-4 lg:px-2">
            <NavItem {...SETTINGS_NAV} />
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
