import { useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], description: 'Open the command palette' },
  { keys: ['↑', '↓'], description: 'Move through palette results' },
  { keys: ['Enter'], description: 'Jump to the highlighted section' },
  { keys: ['Esc'], description: 'Close the palette, drawer or this sheet' },
  { keys: ['?'], description: 'Show this list' },
  { keys: ['Tab'], description: 'First stop on a page is skip-to-content' },
];

// Reference sheet for the shortcuts MainLayout listens for. Escape is handled
// by the layout's overlay effect, same as the drawer and the palette.
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="absolute top-[15vh] left-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/95 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <Keyboard className="h-4 w-4 text-zinc-500" strokeWidth={1.75} aria-hidden="true" />
          <h2 className="text-sm font-medium text-zinc-200">Keyboard shortcuts</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="ml-auto rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
          >
            esc
          </button>
        </div>

        <ul className="p-2">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.description}
              className="flex items-center justify-between gap-4 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-zinc-400">{shortcut.description}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="min-w-6 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-center font-mono text-[11px] text-zinc-300"
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
