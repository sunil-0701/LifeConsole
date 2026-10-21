# LifeConsole — facade

The front-end shell for LifeConsole: a personal dashboard for journal, tasks,
goals, habits, finance and friends-in-progress sections, in one dark,
keyboard-friendly console.

Right now this is the **facade** — routing, layout, navigation and the shared
UI pieces are done, appearance is configurable, and Tasks, Sticky Notes and
Habits work against local storage. Other data-backed sections still render
empty states until the data layer reaches them.

## Stack

| Piece | Choice |
| --- | --- |
| Build | Vite 8 + React 19 |
| Routing | React Router 7 (one layout route, nested children) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Animation | framer-motion |
| Icons | lucide-react |
| Lint | ESLint flat config |
| Tests | Vitest 5 — node environment, no DOM |

## Getting started

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Structure

```
src/
  App.jsx
  index.css
  lib/
    calendar.js
    habits.js
    localData.js
    notes.js
    preferences.js
    sectionRecents.js
    suggestions.js
    tasks.js
    useStoredState.js
    useTasks.js
    useNotes.js
    useHabits.js
    useToday.js
    *.test.js
  components/
    layouts/
    navigation/
    ui/
  pages/
  test/
    fakeBrowser.js
public/
  favicon.svg
```

`components/navigation/navItems.js` is the single source of truth for which
sections exist: the sidebar renders it, the command palette filters it, and
`navItemForPath()` maps the current URL to it (which is how the tab title
knows where you are).

## Routes

| Path | Section |
| --- | --- |
| `/` | Home — greeting hero, quick actions, task focus, habit progress, note previews, area cards |
| `/tasks` | add, edit, complete, search, filter, clear and delete tasks |
| `/sticky-notes` | local note board: create, edit, pin, search, delete |
| `/habits` | daily check-ins, streaks, recent history, name editing/search and archived routines |
| `/journal` `/goals` `/finance` | the other sections (empty states) |
| `/wishlist` `/analytics` `/career` `/projects` | the rest (empty states) |
| `/settings` | appearance and data — accent colour (pinned at the bottom of the rail) |
| `*` | 404 with closest-section suggestions and a way back |

## Keyboard

- <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> — command palette: type to
  filter sections and commands, <kbd>↑</kbd>/<kbd>↓</kbd> to move,
  <kbd>Enter</kbd> to run. With an empty query, recently visited sections are
  listed first and the commands (shortcut sheet, cycle accent, clear recents)
  trail the list
- <kbd>?</kbd> — this list, in-product (also the <kbd>?</kbd> button in the
  topbar)
- <kbd>Esc</kbd> — dismiss the palette, the shortcut sheet or the mobile
  drawer
- <kbd>Tab</kbd> from the top — "Skip to main content" jumps past the rail
- <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> in a note textarea — add
  the note or save an edit; plain Enter still inserts a line break
- <kbd>Enter</kbd> saves task edits and habit names; <kbd>Esc</kbd> cancels
  these inline editors and returns focus to the edit control

## Data and storage

Everything persists in `localStorage`, behind guards so blocked storage never
throws (private windows, quotas); `useStoredState` adds JSON handling and
cross-tab sync on top for the pieces that behave like state:

| Key | Holds |
| --- | --- |
| `lc:accent` | accent colour id — restored in `main.jsx` before first paint |
| `lc:recent-sections` | last five section paths, most recent first |
| `lc:tasks` | the task list — add, complete, filter, delete, clear |
| `lc:notes` | multiline notes, pin state, creation and edit timestamps |
| `lc:habits` | daily habit names, creation dates, archive state and completed days |

Settings shows the live counts and can clear the recents or wipe all five
keys behind a confirmation. The reset only removes LifeConsole's keys, leaves
unrelated browser data alone and reports storage-access failures without
pretending the reset succeeded. The accent resolves to `--accent-rgb` in
`index.css`, which the focus ring, background washes, active rail item,
palette selection, spinner, task checkboxes and skip link all read.

### Tasks

- Add a task with Enter or **Add**. Creating one clears stale search and
  completion filters so the new task is visible immediately.
- **Edit** changes the text without changing the id, creation time or
  completion state. **Save** commits the draft; **Cancel** or Escape discards it.
- Search matches every whitespace-separated term, ignoring case, and combines
  with All/Open/Done. **Show all tasks** recovers from an empty result.
- Single-task deletion is immediate. **Clear completed** requires confirmation
  and removes all completed tasks, including those hidden by search or filters.
- `useTasks` validates stored rows and duplicate ids consistently in Tasks,
  Home and Settings. Invalid stored rows are omitted from the usable list.

### Sticky Notes

- Add a multiline note (up to 5,000 characters) with **Add note**. Blank text
  is rejected and the composer regains focus after submission.
- **Edit** opens an inline draft. **Save** commits it; **Cancel** or
  <kbd>Esc</kbd> discards it and returns focus to the edit button.
- Pin reminders to keep them above unpinned notes. Within each group, the
  most recently edited notes come first. Pinning does not change the edit date.
- Search matches every whitespace-separated term, ignoring case and looking
  across line breaks. **Pinned only** combines with the text query; **Clear
  filters** recovers from an empty result.
- Home previews up to three notes in the same pinned-first order.
- Ctrl/⌘+Enter submits the composer or editor. It does not trigger during IME
  composition. New notes clear search/pinned filters so they remain visible.
- Deleting a note is immediate and permanent; there is no undo or backup yet.

`useNotes` filters malformed stored rows, duplicate ids and invalid timestamps
before any consumer renders them. Notes update across same-origin browser tabs
through the storage event. This is not account sync: simultaneous edits remain
last-write-wins. If storage is blocked or full, changes may only survive in
memory until the page reloads; they are not uploaded or backed up elsewhere.

### Habits

- Add a daily habit with a name up to 120 characters. Blank names are rejected.
- **Rename** edits active or archived names without resetting history, streaks
  or archive state. Search matches all name terms within the selected
  Active/Archived view; **Clear search** restores that view's full list.
- **Complete today** records a check-in; **Done today** undoes it. The button
  exposes its pressed state to assistive technology.
- The seven-day strip ends on today. Select a date to correct a recent
  check-in; dates before the habit was created are disabled. Future check-ins
  are not allowed.
- **Current streak** counts consecutive completed days through today, or
  through yesterday if today is still open. Missing yesterday breaks the
  current streak. **Best streak** and the check-in total retain past progress.
- **Archive** removes a habit from the active routine without deleting its
  history. Archived check-ins are read-only until **Restore** is selected;
  names can still be edited.
  Permanent deletion requires confirmation and cannot be undone.
- Home shows daily progress and up to three habits, prioritizing those not
  yet completed. Archived and not-yet-started habits do not count toward the
  daily total. Settings shows active/archived counts, and a full data reset
  removes both groups and their histories.

Day keys use the browser's **local calendar date**, not a UTC timestamp.
Calendar arithmetic avoids treating every day as a fixed 24-hour interval.
The current day refreshes at local midnight and when the window regains focus
or visibility. Changing timezones does not rewrite existing check-in dates.
Only daily routines are supported: custom schedules, reminders and
older history editing are not implemented. Storage and cross-tab limitations
are the same as for notes; there is no server backup or account sync.

## Verification

Run `npm run lint` and `npm run build` before committing feature changes.
The node-based Vitest suite covers note validation, immutable edits, pin
ordering, search and safe local-data reset alongside the existing logic tests.
It does not exercise React interactions in a browser.

Manual smoke checklist for `/sticky-notes`:

1. Add multiline text, reload and check it survives.
2. Save an edit; cancel another with Escape and check the saved text is unchanged.
3. Pin an older note and verify it leads both the board and Home previews.
4. Combine search and pinned-only filtering, then recover with Clear filters.
5. Open a second tab and check add/edit/delete changes propagate.
6. Check narrow-screen wrapping, keyboard controls and focus after Save/Cancel.
7. Verify Settings counts notes and that cancelling the reset leaves data intact.

## Performance and resilience

- Sections are `React.lazy` chunks behind a `Suspense` boundary inside the
  layout, so the shell never unmounts while a chunk loads; Home stays eager.
  The loaders all live in `navigation/sectionChunks.js`, which the rail also
  prefetches on hover and focus and the palette warms for the highlighted row.
- An `ErrorBoundary` wraps the router: a thrown render error or a failed
  chunk download shows the error text with Try again / Reload instead of a
  white screen.

## Design notes

- Dark only: zinc-on-near-black with a faint accent wash and an accent
  focus ring (`:focus-visible`); the colour comes from Settings.
- Desktop rail is icon-only with hover tooltips; mobile gets a labelled
  drawer with a scrim that traps focus and hands it back on close.
- Reduced motion is respected end to end — `TypedText` skips its typing loop,
  framer runs with `reducedMotion="user"`, and a media query flattens CSS
  transitions.
- The top-bar clock is railway time (00–23) and re-arms itself to flip on the
  second boundary rather than drifting with `setInterval`; a hidden tab
  freezes it entirely, with a catch-up on return.
- Navigating moves focus to the new page's main region, resets scroll, and
  speaks the section name through a polite live region.

## Status

- [x] Shell: layout, routing, nav config, 404 with suggestions
- [x] Command palette with recents, quick actions, area overview
- [x] Accessibility: skip link, focus hand-off, drawer focus trap, live region, reduced motion
- [x] Performance: code splitting with chunk prefetch, top-level error boundary, hidden-tab clock
- [x] Settings: persisted accent colour, shortcut sheet, data counts and wipe
- [x] Tasks: validated local-first list with editing, search, confirmed bulk cleanup and Home focus
- [x] Sticky Notes: local-first board, editing, pinning, search and Home previews
- [x] Habits: daily check-ins, streaks, name editing/search, recent history, archiving and Home progress
- [x] Tests: vitest over the pure logic in `lib/`
- [ ] Remaining sections: journal, goals, finance, wishlist, analytics, career, projects (empty states)
- [ ] Gallery and Documents (locked in the rail)
- [ ] Remaining settings: account, sync, notifications
