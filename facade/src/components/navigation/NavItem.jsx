import { Link, matchPath, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import NavTooltip from '../ui/NavTooltip';
import { prefetchSection } from './sectionChunks';

function NavItem({ to, icon: Icon, label, end = false, locked = false }) {
  const { pathname } = useLocation();

  const isActive = !locked && matchPath({ path: to, end }, pathname) !== null;

  if (locked) {
    return (
      <motion.div initial="hidden" whileHover="visible">
        <span
          aria-disabled="true"
          aria-label={label}
          className="relative flex min-h-11 cursor-not-allowed items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-zinc-600 lg:justify-center lg:px-1"
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
      <Link
        to={to}
        onMouseEnter={() => prefetchSection(to)}
        onFocus={() => prefetchSection(to)}
        aria-label={label}
        aria-current={isActive ? 'page' : undefined}
        style={
          isActive
            ? {
                borderColor: 'rgb(var(--accent-rgb) / 0.24)',
                backgroundColor: 'rgb(var(--accent-rgb) / 0.12)',
                boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.06), 0 2px 10px rgb(0 0 0 / 0.12)',
              }
            : undefined
        }
        className={[
          'group relative flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors duration-150 lg:justify-center lg:px-1',
          isActive
            ? 'text-white'
            : 'border-transparent text-zinc-400 hover:border-white/[0.07] hover:bg-white/[0.045] hover:text-zinc-200',
        ].join(' ')}
      >
        <Icon
          className={[
            'h-[18px] w-[18px] shrink-0 transition-colors duration-150',
            isActive ? 'text-[rgb(var(--accent-rgb))]' : 'text-zinc-500 group-hover:text-zinc-300 group-focus-visible:text-zinc-300',
          ].join(' ')}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="font-medium lg:hidden">{label}</span>
        <NavTooltip label={label} />
      </Link>
    </motion.div>
  );
}

export default NavItem;
