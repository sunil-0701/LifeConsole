function PageHeader({ title, hint }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
      {hint ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">{hint}</p>
      ) : null}
    </header>
  );
}

export default PageHeader;
