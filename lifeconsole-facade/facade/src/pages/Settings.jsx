import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { ACCENTS, ACCENT_KEY, applyAccent, readAccent, writeAccent } from '../lib/preferences';
import { RECENTS_KEY, clearSectionRecents, recentSections } from '../lib/sectionRecents';
import { TASKS_KEY } from '../lib/tasks';
import { useStoredState } from '../lib/useStoredState';

const NO_TASKS = [];

function SettingsPage() {
  const [accent, setAccent] = useState(readAccent);
  const [recentCount, setRecentCount] = useState(() => recentSections().length);
  const [tasks] = useStoredState(TASKS_KEY, NO_TASKS);
  const current = ACCENTS.find((option) => option.id === accent) ?? ACCENTS[0];

  const select = (id) => {
    setAccent(id);
    writeAccent(id);
    applyAccent(id);
  };

  const clearRecents = () => {
    clearSectionRecents();
    setRecentCount(0);
  };

  const wipe = () => {
    const confirmed = window.confirm(
      'Delete all local data on this device? The accent, recent sections and every task will be lost.',
    );
    if (!confirmed) return;

    try {
      [ACCENT_KEY, RECENTS_KEY, TASKS_KEY].forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Storage unreachable — there is nothing left to delete anyway.
    }
    window.location.reload();
  };

  return (
    <div>
      <PageHeader title="Settings" hint="How LifeConsole behaves for you." />

      <section className="max-w-xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h2 className="text-base font-medium text-zinc-300">Appearance</h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-600">
          The accent tints focus rings, the active rail item and the palette
          selection. Saved on this device — no account needed.
        </p>

        <div className="mt-4 flex items-center gap-3">
          {ACCENTS.map((option) => (
            <button
              key={option.id}
              type="button"
              data-accent={option.id}
              onClick={() => select(option.id)}
              aria-pressed={accent === option.id}
              aria-label={`${option.label} accent`}
              title={option.label}
              className={[
                'h-8 w-8 rounded-full border-2 p-[3px] transition-colors duration-150',
                accent === option.id
                  ? 'border-white/70'
                  : 'border-white/10 hover:border-white/40',
              ].join(' ')}
            >
              {/* Coloured by the swatch's own data-accent, so each button
                  previews its option, not the current one. */}
              <span
                className="block h-full w-full rounded-full"
                style={{ backgroundColor: 'rgb(var(--accent-rgb))' }}
              />
            </button>
          ))}

          <span className="ml-1 font-mono text-xs text-zinc-600">{current.label}</span>
        </div>
      </section>

      <section className="mt-6 max-w-xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h2 className="text-base font-medium text-zinc-300">Data</h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-600">
          Everything LifeConsole remembers lives in this browser&rsquo;s local
          storage — no account, no server, nothing sent anywhere. This is what
          it is holding right now.
        </p>

        <dl className="mt-4 space-y-1.5 font-mono text-xs text-zinc-600">
          <div className="flex items-center justify-between gap-3">
            <dt>Recent sections</dt>
            <dd className="tabular-nums text-zinc-400">{recentCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt>Tasks</dt>
            <dd className="tabular-nums text-zinc-400">{tasks.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt>Accent</dt>
            <dd className="text-zinc-400">{current.label}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearRecents}
            disabled={recentCount === 0}
            className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-zinc-500 transition-colors duration-150 hover:bg-white/[0.05] hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Clear recent sections
          </button>
          <button
            type="button"
            onClick={wipe}
            className="rounded-lg border border-red-500/25 px-3 py-1.5 text-xs text-red-400/80 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
          >
            Delete all local data
          </button>
        </div>
      </section>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-zinc-600">
        Account, sync, and notification settings are not implemented yet.
      </p>
    </div>
  );
}

export default SettingsPage;
