function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="glass-panel flex min-h-[40vh] max-w-2xl flex-col items-start justify-center rounded-2xl px-6 py-16 text-left sm:px-8">
      {Icon ? (
        <span className="glass-control grid h-10 w-10 place-items-center rounded-xl">
          <Icon className="h-5 w-5 text-zinc-400" strokeWidth={1.5} aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="mt-4 text-base font-medium text-zinc-300">{title}</h2>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500">{hint}</p>
    </div>
  );
}

export default EmptyState;
