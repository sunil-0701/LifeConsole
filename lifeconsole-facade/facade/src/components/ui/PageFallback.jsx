function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading section">
      <span
        className="h-6 w-6 animate-spin rounded-full border-2 border-white/15"
        style={{ borderTopColor: 'rgb(var(--accent-rgb))' }}
        aria-hidden="true"
      />
    </div>
  );
}

export default PageFallback;
