function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-start justify-center py-16 text-left">
      {Icon ? (
        <Icon className="h-5 w-5 text-zinc-600" strokeWidth={1.5} aria-hidden="true" />
      ) : null}
      <h2 className="mt-4 text-base font-medium text-zinc-300">{title}</h2>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-600">{hint}</p>
    </div>
  );
}

export default EmptyState;
