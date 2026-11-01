import { useState } from 'react';
import { Check } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { ACCENTS, applyAccent, readAccent, writeAccent } from '../lib/preferences';
import { clearSectionRecents, recentSections } from '../lib/sectionRecents';
import { useTasks } from '../lib/useTasks';
import { useNotes } from '../lib/useNotes';
import { useHabits } from '../lib/useHabits';
import { clearLocalData } from '../lib/localData';

function SettingsPage() {
  const [accent, setAccent] = useState(readAccent);
  const [recentCount, setRecentCount] = useState(() => recentSections().length);
  const [tasks] = useTasks();
  const [notes] = useNotes();
  const [habits] = useHabits();
  const activeHabits = habits.filter((habit) => !habit.archived).length;
  const [dataError, setDataError] = useState('');
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
      'Delete all local data on this device? The accent, recent sections, tasks, notes, journal entries and all habit histories (including archived habits) will be lost.',
    );
    if (!confirmed) return;

    if (!clearLocalData()) {
      setDataError('Some local data could not be removed. Check browser storage permissions and try again.');
      return;
    }
    window.location.reload();
  };

  return (
    <div>
      <PageHeader title="Settings" hint="How LifeConsole behaves for you." />

      <section className="glass-panel max-w-xl rounded-2xl p-6">
        <h2 className="text-base font-medium text-zinc-300">Appearance</h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500">
          The accent tints focus rings, the active rail item and the palette
          selection. Saved on this device — no account needed.
        </p>

        <div role="group" aria-label="Accent colour" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                'inline-flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors duration-150',
                accent === option.id
                  ? 'border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.08)] text-zinc-100'
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:bg-white/[0.03] hover:text-zinc-200',
              ].join(' ')}
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: 'rgb(var(--accent-rgb))' }}
              >
                {accent === option.id ? <Check className="h-3.5 w-3.5 text-zinc-950" strokeWidth={2.5} aria-hidden="true" /> : null}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-panel mt-6 max-w-xl rounded-2xl p-6">
        <h2 className="text-base font-medium text-zinc-300">Data</h2>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-500">
          Everything LifeConsole remembers lives in this browser&rsquo;s local
          storage — no account, no server, nothing sent anywhere. This is what
          it is holding right now.
        </p>

        <dl className="mt-4 divide-y divide-white/[0.05] font-mono text-xs text-zinc-400">
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt>Recent sections</dt>
            <dd className="tabular-nums text-zinc-400">{recentCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt>Tasks</dt>
            <dd className="tabular-nums text-zinc-400">{tasks.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt>Notes</dt>
            <dd className="tabular-nums text-zinc-400">{notes.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt>Habits (active / archived)</dt>
            <dd className="tabular-nums text-zinc-400">{activeHabits} / {habits.length - activeHabits}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt>Accent</dt>
            <dd className="text-zinc-400">{current.label}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
          <button
            type="button"
            onClick={clearRecents}
            disabled={recentCount === 0}
            className="glass-control min-h-10 rounded-lg px-3 py-2 text-xs text-zinc-400 enabled:hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear recent sections
          </button>
          <button
            type="button"
            onClick={wipe}
            className="min-h-10 rounded-lg border border-red-500/25 px-3 py-2 text-xs text-red-400 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
          >
            Delete all local data
          </button>
        </div>
        {dataError ? <p role="alert" className="mt-3 text-sm text-red-300">{dataError}</p> : null}
      </section>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-zinc-600">
        Account, sync, and notification settings are not implemented yet.
      </p>
    </div>
  );
}

export default SettingsPage;
