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
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 hidden whitespace-nowrap rounded-xl border border-white/[0.15] bg-zinc-950 px-3 py-2 text-xs font-medium tracking-wide text-zinc-100 shadow-[0_8px_24px_rgb(0_0_0_/_0.4)] lg:block"
    >
      {label}
    </motion.span>
  );
}

export default NavTooltip;
