import { useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], description: 'Open the command palette' },
  { keys: ['↑', '↓'], description: 'Move through palette results' },
  { keys: ['Enter'], description: 'Jump to the highlighted section' },
  { keys: ['Ctrl/⌘', 'Enter'], description: 'Add or save a note while typing' },
  { keys: ['Esc'], description: 'Close the palette, drawer or this sheet' },
  { keys: ['?'], description: 'Show this list' },
  { keys: ['Tab'], description: 'First stop on a page is skip-to-content' },
];

function ShortcutHelp({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close shortcuts"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="glass-panel glass-overlay absolute top-[15vh] left-1/2 max-h-[75dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-y-auto overscroll-contain rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <Keyboard className="h-4 w-4 text-zinc-500" strokeWidth={1.75} aria-hidden="true" />
          <h2 className="text-sm font-medium text-zinc-200">Keyboard shortcuts</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="glass-control ml-auto grid h-10 min-w-10 place-items-center rounded-lg px-2 font-mono text-xs text-zinc-400 transition-colors duration-150 hover:text-zinc-200"
          >
            esc
          </button>
        </div>

        <ul className="p-2">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.description}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg px-3 py-3 odd:bg-white/[0.025]"
            >
              <span className="text-sm text-zinc-400">{shortcut.description}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-md border border-b-2 border-white/[0.12] bg-white/[0.05] px-2 py-1 text-center font-mono text-[11px] text-zinc-200"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ShortcutHelp;
