import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eraser, Keyboard, Palette, Search } from 'lucide-react';
import { ALL_NAV } from '../navigation/navItems';
import { prefetchSection } from '../navigation/sectionChunks';
import { clearSectionRecents, recentSections } from '../../lib/sectionRecents';
import { ACCENTS, applyAccent, readAccent, writeAccent } from '../../lib/preferences';

// Palette of every unlocked section plus the utility commands that belong at
// arm's reach — shortcuts, appearance, storage. Mounted only while open, so
// query and highlight start fresh every time; opened with Cmd/Ctrl+K or the
// topbar button, and the input owns the keyboard (arrows, enter, escape).
function CommandPalette({ onClose, onShowHelp }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  // Held as state rather than read fresh in the memo, so "clear recents"
  // can rebuild the list the moment it runs.
  const [recents, setRecents] = useState(() => recentSections());

  const cycleAccent = useCallback(() => {
    const index = Math.max(0, ACCENTS.findIndex((option) => option.id === readAccent()));
    const next = ACCENTS[(index + 1) % ACCENTS.length];
    writeAccent(next.id);
    applyAccent(next.id);
  }, []);

  const clearRecents = useCallback(() => {
    clearSectionRecents();
    setRecents(recentSections());
  }, []);

  const actions = useMemo(
    () => [
      {
        id: 'help',
        label: 'Show keyboard shortcuts',
        icon: Keyboard,
        hint: 'sheet',
        run: onShowHelp,
      },
      {
        id: 'accent',
        label: 'Cycle accent colour',
        icon: Palette,
        hint: 'appearance',
        run: cycleAccent,
      },
      {
        id: 'clear',
        label: 'Clear recent sections',
        icon: Eraser,
        hint: 'storage',
        run: clearRecents,
      },
    ],
    [onShowHelp, cycleAccent, clearRecents],
  );

  // No query: sections you visited recently float to the top, flagged as
  // such, with the commands trailing the list. A query filters both lists.
  const results = useMemo(() => {
    const sections = ALL_NAV.filter((item) => item.to && !item.locked);
    const needle = query.trim().toLowerCase();

    const asSection = (item, recent) => ({
      key: item.to,
      kind: 'section',
      icon: item.icon,
      label: item.label,
      hint: item.to,
      recent,
      path: item.to,
    });

    const asAction = (action) => ({
      key: `action:${action.id}`,
      kind: 'action',
      icon: action.icon,
      label: action.label,
      hint: action.hint,
      recent: false,
      action,
    });

    if (needle) {
      return [
        ...sections
          .filter((item) => item.label.toLowerCase().includes(needle))
          .map((item) => asSection(item, false)),
        ...actions
          .filter((action) => action.label.toLowerCase().includes(needle))
          .map(asAction),
      ];
    }

    const recentItems = sections
      .filter((item) => recents.includes(item.to))
      .sort((a, b) => recents.indexOf(a.to) - recents.indexOf(b.to))
      .map((item) => asSection(item, true));
    const rest = sections
      .filter((item) => !recents.includes(item.to))
      .map((item) => asSection(item, false));

    return [...recentItems, ...rest, ...actions.map(asAction)];
  }, [query, recents, actions]);

  // Steal focus on mount so typing starts filtering immediately.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const safeActive = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  // Warm the chunk for whatever section row is highlighted, so pressing
  // Enter (or clicking) resolves from cache instead of the network. Command
  // rows have no chunk and are skipped.
  useEffect(() => {
    const entry = results[safeActive];
    if (entry) prefetchSection(entry.path);
  }, [results, safeActive]);

  const activate = (entry) => {
    onClose();
    if (entry.kind === 'action') entry.action.run();
    else navigate(entry.path);
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
      const entry = results[safeActive];
      if (entry) activate(entry);
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
            placeholder="Jump to a section or run a command…"
            aria-label="Search sections and commands"
            className="h-12 w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:block">
            esc
          </kbd>
        </div>

        <ul role="listbox" aria-label="Sections and commands" className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-6 text-center text-sm text-zinc-600">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.key} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={index === safeActive}
                  onClick={() => activate(entry)}
                  onMouseEnter={() => setActive(index)}
                  style={
                    index === safeActive
                      ? { backgroundColor: 'rgb(var(--accent-rgb) / 0.14)' }
                      : undefined
                  }
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-100',
                    index === safeActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200',
                  ].join(' ')}
                >
                  <entry.icon
                    className={[
                      'h-4 w-4',
                      index === safeActive ? 'text-zinc-200' : 'text-zinc-600',
                    ].join(' ')}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{entry.label}</span>
                  <span className="ml-auto flex items-center gap-2">
                    {entry.recent ? (
                      <span className="font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                        recent
                      </span>
                    ) : null}
                    <span
                      className={[
                        'font-mono',
                        entry.kind === 'action' ? 'text-[10px] tracking-wider uppercase' : 'text-[11px]',
                        index === safeActive ? 'text-zinc-400' : 'text-zinc-600',
                      ].join(' ')}
                    >
                      {entry.hint}
                    </span>
                  </span>
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
