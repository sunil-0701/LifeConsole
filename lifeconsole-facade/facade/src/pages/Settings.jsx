import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { ACCENTS, applyAccent, readAccent, writeAccent } from '../lib/preferences';

function SettingsPage() {
  const [accent, setAccent] = useState(readAccent);
  const current = ACCENTS.find((option) => option.id === accent) ?? ACCENTS[0];

  const select = (id) => {
    setAccent(id);
    writeAccent(id);
    applyAccent(id);
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

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-zinc-600">
        Account, sync, and notification settings are not implemented yet.
      </p>
    </div>
  );
}

export default SettingsPage;
