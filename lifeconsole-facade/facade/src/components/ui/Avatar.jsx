function Avatar({ name = 'Sunil', onClick }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Profile of ${name}`}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[13px] font-medium text-zinc-300 transition-colors duration-150 hover:bg-white/[0.09] hover:text-white"
    >
      {initial}
    </button>
  );
}

export default Avatar;
