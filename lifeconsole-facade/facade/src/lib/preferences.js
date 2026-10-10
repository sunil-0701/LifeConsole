export const ACCENT_KEY = 'lc:accent';

export const DEFAULT_ACCENT = 'violet';

// Ids must match the [data-accent="…"] rules in index.css, which define the
// --accent-rgb triplet each option resolves to.
export const ACCENTS = [
  { id: 'violet', label: 'Violet' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
];

export function readAccent() {
  try {
    const stored = window.localStorage.getItem(ACCENT_KEY);
    return ACCENTS.some((option) => option.id === stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

export function writeAccent(id) {
  try {
    window.localStorage.setItem(ACCENT_KEY, id);
  } catch {
    // Storage unavailable — the choice still applies for this session.
  }
}

// Called before first paint (boot) and on every selection, so a reload never
// flashes the default colour.
export function applyAccent(id) {
  document.documentElement.dataset.accent = id;
}
