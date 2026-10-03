import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';

function NavItem({ to, icon: Icon, label, end = false, locked = false }) {
  if (locked) {
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-700"
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
        <span className="font-medium">{label}</span>
        <Lock className="ml-auto h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      </span>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors duration-150',
          isActive
            ? 'border-white/[0.08] bg-white/[0.07] text-white'
            : 'border-transparent text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={[
              'h-[18px] w-[18px] transition-colors duration-150',
              isActive ? 'text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-400',
            ].join(' ')}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default NavItem;
