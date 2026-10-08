import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ALL_NAV } from '../navigation/navItems';

// Palette of every unlocked section. Mounted only while open, so query and
// highlight start fresh every time; opened with Cmd/Ctrl+K or the topbar
// button, and the input owns the keyboard (arrows, enter, escape).
function CommandPalette({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const items = ALL_NAV.filter((item) => item.to && !item.locked);
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => item.label.toLowerCase().includes(needle));
  }, [query]);

  // Steal focus on mount so typing starts filtering immediately.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const safeActive = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  const run = (item) => {
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index + 1) % results.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (results.length === 0 ? 0 : (index - 1 + results.length) % results.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = results[safeActive];
      if (item) run(item);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search LifeConsole"
        className="absolute top-[15vh] left-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/95 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section…"
            aria-label="Search sections"
            className="h-12 w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:block">
            esc
          </kbd>
        </div>

        <ul role="listbox" aria-label="Sections" className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-6 text-center text-sm text-zinc-600">
              No section matches &ldquo;{query.trim()}&rdquo;.
            </li>
          ) : (
            results.map((item, index) => (
              <li key={item.to} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === safeActive}
                  onClick={() => run(item)}
                  onMouseEnter={() => setActive(index)}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-100',
                    index === safeActive
                      ? 'bg-white/[0.07] text-white'
                      : 'text-zinc-400 hover:text-zinc-200',
                  ].join(' ')}
                >
                  <item.icon
                    className={[
                      'h-4 w-4',
                      index === safeActive ? 'text-zinc-200' : 'text-zinc-600',
                    ].join(' ')}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto font-mono text-[11px] text-zinc-600">{item.to}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default CommandPalette;
