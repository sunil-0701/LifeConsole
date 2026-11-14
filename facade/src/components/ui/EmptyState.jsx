function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="glass-panel mt-6 flex min-h-64 max-w-2xl flex-col items-start justify-center rounded-2xl px-6 py-10 text-left sm:px-8 sm:py-12">
      {Icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[rgb(var(--accent-rgb)/0.2)] bg-[rgb(var(--accent-rgb)/0.08)]">
          <Icon className="h-5 w-5 text-[rgb(var(--accent-rgb))]" strokeWidth={1.5} aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="mt-5 text-lg font-medium tracking-tight text-zinc-200">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">{hint}</p>
    </div>
  );
}

export default EmptyState;
