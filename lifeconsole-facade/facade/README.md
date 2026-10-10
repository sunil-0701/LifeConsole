# LifeConsole — facade

The front-end shell for LifeConsole: a personal dashboard for journal, tasks,
goals, habits, finance and friends-in-progress sections, in one dark,
keyboard-friendly console.

Right now this is the **facade** — routing, layout, navigation and the shared
UI pieces are done, appearance is configurable, and Tasks is fully working
against local storage. Every other data-backed section still renders an empty
state until the data layer reaches it.

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
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
npm run lint     # eslint .
npm run test     # vitest — 30 cases over lib/
```

## Structure

```
src/
  App.jsx                    # lazy route table, wrapped in ErrorBoundary + MotionConfig
  index.css                  # tailwind import + base layer (fonts, accent, motion)
  lib/
    preferences.js           # accent colour: read/write/apply (localStorage)
    sectionRecents.js        # last-visited sections for the palette (localStorage)
    suggestions.js           # 404 typo scoring: bounded Levenshtein, best three
    tasks.js                 # pure task helpers: create, toggle, remove, clear
    useStoredState.js        # localStorage-backed React state, synced across tabs
    *.test.js                # vitest specs, one per module
  components/
    layouts/                 # MainLayout (shell), Sidebar (rail + drawer), Topbar
    navigation/              # navItems.js — the shared nav config; NavItem,
                             # NavTooltip, sectionChunks.js (lazy loaders + prefetch)
    ui/                      # Avatar, CommandPalette, EmptyState, ErrorBoundary,
                             # LiveClock, PageFallback, PageHeader, ShortcutHelp,
                             # TaskRow, TypedText
  pages/                     # one file per route (all lazy except Home)
  test/
    fakeBrowser.js           # window/document stand-ins for the node test env
public/
  favicon.svg                # prompt-caret mark
```

`components/navigation/navItems.js` is the single source of truth for which
sections exist: the sidebar renders it, the command palette filters it, and
`navItemForPath()` maps the current URL to it (which is how the tab title
knows where you are).

## Routes

| Path | Section |
| --- | --- |
| `/` | Home — greeting hero, quick actions, today's focus, area cards |
| `/tasks` | the working list: add, complete, filter, clear, delete |
| `/journal` `/goals` `/finance` `/habits` | the other sections (empty states) |
| `/sticky-notes` `/wishlist` `/analytics` `/career` `/projects` | the rest |
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

## Data and storage

Everything persists in `localStorage`, behind guards so blocked storage never
throws (private windows, quotas); `useStoredState` adds JSON handling and
cross-tab sync on top for the pieces that behave like state:

| Key | Holds |
| --- | --- |
| `lc:accent` | accent colour id — restored in `main.jsx` before first paint |
| `lc:recent-sections` | last five section paths, most recent first |
| `lc:tasks` | the task list — add, complete, filter, delete, clear |

Settings shows the live counts and can clear the recents or wipe all three
keys behind a confirmation. The accent resolves to `--accent-rgb` in
`index.css`, which the focus ring, background washes, active rail item,
palette selection, spinner, task checkboxes and skip link all read.

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
- [x] Tasks: local-first list (add, complete, filter, clear, delete) plus Home focus
- [x] Tests: vitest over the pure logic in `lib/`
- [ ] Remaining sections: journal, goals, finance, habits, sticky notes (empty states)
- [ ] Gallery and Documents (locked in the rail)
- [ ] Remaining settings: account, sync, notifications
