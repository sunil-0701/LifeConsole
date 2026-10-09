import { useEffect, useRef } from 'react';
import NavItem from '../navigation/NavItem';
import { PRIMARY_NAV, SETTINGS_NAV } from '../navigation/navItems';

function Sidebar({ open, onClose }) {
  const asideRef = useRef(null);

  // An open drawer is a modal surface: focus moves into it, Tab and Shift+Tab
  // cycle through its controls only, and closing it (Escape, scrim, choosing a
  // section) hands focus back to whatever opened it.
  useEffect(() => {
    if (!open) return undefined;

    const aside = asideRef.current;
    const trigger = document.activeElement;

    const focusables = () =>
      Array.from(
        aside.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0);

    focusables()[0]?.focus();

    const onKey = (event) => {
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    aside.addEventListener('keydown', onKey);

    return () => {
      aside.removeEventListener('keydown', onKey);
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, [open]);

  return (
    <>
      {/* Wordmark pinned above the desktop rail, in the top-left corner */}
      <span className="fixed top-4 left-4 z-40 hidden text-[15px] font-semibold tracking-tight text-zinc-100 lg:block">
        LifeConsole
      </span>

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
        ref={asideRef}
        className={[
          'fixed top-0 bottom-0 left-0 z-40 w-[17rem] p-3 lg:top-14 lg:w-[4.5rem] lg:p-2',
          'transition-transform duration-300 ease-out lg:translate-x-0 lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
          {/* Primary navigation */}
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
