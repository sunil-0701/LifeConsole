export const ACCENT_KEY = 'lc:accent';

export const DEFAULT_ACCENT = 'violet';

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
  }
}

export function applyAccent(id) {
  document.documentElement.dataset.accent = id;
}
