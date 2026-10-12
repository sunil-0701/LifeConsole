function Avatar({ name = 'Sunil', onClick }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Profile of ${name}`}
      className="glass-control grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-medium text-zinc-300 hover:text-white"
    >
      {initial}
    </button>
  );
}

export default Avatar;
