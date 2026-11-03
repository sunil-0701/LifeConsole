function PageFallback() {
  return (
    <div className="glass-panel flex min-h-64 max-w-2xl flex-col items-center justify-center gap-4 rounded-2xl p-8" role="status">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-white/15"
        style={{ borderTopColor: 'rgb(var(--accent-rgb))' }}
        aria-hidden="true"
      />
      <p className="font-mono text-xs tracking-wide text-zinc-400">Loading section…</p>
    </div>
  );
}

export default PageFallback;
