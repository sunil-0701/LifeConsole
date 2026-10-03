import { motion } from 'framer-motion';

// x: -4 gives the tooltip its small horizontal slide-in. y stays at -50%
// in both variants because framer writes the transform inline — Tailwind's
// -translate-y-1/2 would be overwritten.
const TOOLTIP_VARIANTS = {
  hidden: { opacity: 0, x: -4, y: '-50%' },
  visible: { opacity: 1, x: 0, y: '-50%' },
};

function NavTooltip({ label }) {
  return (
    <motion.span
      variants={TOOLTIP_VARIANTS}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-6 hidden whitespace-nowrap rounded-lg border border-white/[0.08] bg-zinc-900/90 px-2.5 py-1.5 text-xs font-medium text-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.3)] backdrop-blur-md lg:block"
    >
      {label}
    </motion.span>
  );
}

export default NavTooltip;
