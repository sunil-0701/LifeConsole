import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import NavTooltip from '../ui/NavTooltip';

function NavItem({ to, icon: Icon, label, end = false, locked = false }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Segment-wise match, identical to what NavLink computed — but rendered as
  // a button, so no href means Chrome shows no "localhost:5173" status chip.
  const isActive = !locked && matchPath({ path: to, end }, pathname) !== null;

  if (locked) {
    return (
      // initial/whileHover variants propagate to NavTooltip through context —
      // no React state, no re-renders on hover.
      <motion.div initial="hidden" whileHover="visible">
        <span
          aria-disabled="true"
          aria-label={label}
          className="relative flex cursor-not-allowed items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-700 lg:justify-center lg:px-1"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          <span className="font-medium lg:hidden">{label}</span>
          <Lock className="ml-auto h-3.5 w-3.5 lg:hidden" strokeWidth={1.75} aria-hidden="true" />
          <NavTooltip label={label} />
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" whileHover="visible">
      <button
        type="button"
        onClick={() => navigate(to)}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        style={
          isActive
            ? {
                borderColor: 'rgb(var(--accent-rgb) / 0.28)',
                backgroundColor: 'rgb(var(--accent-rgb) / 0.10)',
              }
            : undefined
        }
        className={[
          'group relative flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors duration-150 lg:justify-center lg:px-1',
          isActive
            ? 'text-white'
            : 'border-transparent text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200',
        ].join(' ')}
      >
        <Icon
          className={[
            'h-[18px] w-[18px] transition-colors duration-150',
            isActive ? 'text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-400',
          ].join(' ')}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="font-medium lg:hidden">{label}</span>
        <NavTooltip label={label} />
      </button>
    </motion.div>
  );
}

export default NavItem;
