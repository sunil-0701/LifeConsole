function Avatar({ name = 'Sunil', onClick }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const Element = onClick ? 'button' : 'span';

  return (
    <Element
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      role={onClick ? undefined : 'img'}
      aria-label={`Profile of ${name}`}
      title={name}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[rgb(var(--accent-rgb)/0.25)] bg-[rgb(var(--accent-rgb)/0.08)] text-[13px] font-semibold text-[rgb(var(--accent-rgb))] ${onClick ? 'transition-colors hover:bg-[rgb(var(--accent-rgb)/0.16)]' : ''}`}
    >
      {initial}
    </Element>
  );
}

export default Avatar;
