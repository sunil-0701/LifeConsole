import { motion } from 'framer-motion';

function greetingFor(date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function Home() {
  const greeting = greetingFor(new Date());

  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-mono text-[13px] tracking-[0.3em] text-zinc-500 uppercase"
          >
            {greeting},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
            className="mt-4 font-serif text-6xl leading-[0.95] font-medium text-white sm:text-7xl lg:text-8xl"
          >
            Sunil.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
            className="mt-6 font-mono text-sm tracking-wide text-zinc-500"
          >
            Small steps today. A stronger tomorrow.
          </motion.p>
        </div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xs font-mono text-[13px] leading-relaxed text-zinc-400 lg:mt-2"
        >
          <p>
            &ldquo;Discipline is choosing what you want most over what you want
            now.&rdquo;
          </p>
          <footer className="mt-3 text-zinc-600">&mdash; James Clear</footer>
        </motion.blockquote>
      </section>

      <section className="mt-14 border-t border-white/[0.06] pt-6 sm:mt-20">
        <p className="font-mono text-xs text-zinc-600">
          Today&rsquo;s focus, quick actions, and area overviews will appear
          here.
        </p>
      </section>
    </div>
  );
}

export default Home;
