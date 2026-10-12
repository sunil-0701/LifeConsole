import { motion } from 'framer-motion';

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
      className="glass-panel pointer-events-none absolute top-1/2 left-full z-50 ml-6 hidden whitespace-nowrap rounded-lg bg-zinc-900/95 px-2.5 py-1.5 text-xs font-medium text-zinc-200 shadow-[0_6px_18px_rgb(0_0_0_/_0.25)] lg:block"
    >
      {label}
    </motion.span>
  );
}

export default NavTooltip;
