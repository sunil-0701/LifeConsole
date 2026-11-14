function PageHeader({ title, hint }) {
  return (
    <header className="mb-8 max-w-5xl border-b border-white/[0.06] pb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">{title}</h1>
      {hint ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-zinc-400">{hint}</p>
      ) : null}
    </header>
  );
}

export default PageHeader;
