# LifeConsole — facade

The front-end shell for LifeConsole: a personal dashboard for journal, tasks,
goals, habits, finance and friends-in-progress sections, in one dark,
keyboard-friendly console.

Right now this is the **facade** — routing, layout, navigation and the shared
UI pieces are done, and every section renders its empty state until the data
layer lands.

## Stack

| Piece | Choice |
| --- | --- |
| Build | Vite 8 + React 19 |
| Routing | React Router 7 (one layout route, nested children) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Animation | framer-motion |
| Icons | lucide-react |
| Lint | ESLint flat config |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
npm run lint     # eslint .
```

## Structure

```
src/
  App.jsx                    # route table, wrapped in MotionConfig
  index.css                  # tailwind import + base layer (fonts, scrollbars, motion)
  components/
    layouts/                 # MainLayout (shell), Sidebar (rail + drawer), Topbar
    navigation/              # NavItem, NavTooltip, navItems.js — the shared nav config
    ui/                      # Avatar, CommandPalette, EmptyState, LiveClock,
                             # PageHeader, TypedText
  pages/                     # one file per route
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
| `/` | Home — greeting hero, quick actions, area cards |
| `/journal` `/tasks` `/goals` `/finance` `/habits` | the working sections |
| `/sticky-notes` `/wishlist` `/analytics` `/career` `/projects` | the rest |
| `/settings` | preferences (pinned at the bottom of the rail) |
| `*` | 404 with a way back |

## Keyboard

- <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> — command palette: type to
  filter sections, <kbd>↑</kbd>/<kbd>↓</kbd> to move, <kbd>Enter</kbd> to go
- <kbd>Esc</kbd> — dismiss the palette or the mobile drawer
- <kbd>Tab</kbd> from the top — "Skip to main content" jumps past the rail

## Design notes

- Dark only: zinc-on-near-black with a faint violet wash and a violet
  focus ring (`:focus-visible`).
- Desktop rail is icon-only with hover tooltips; mobile gets a labelled
  drawer with a scrim.
- Reduced motion is respected end to end — `TypedText` skips its typing loop,
  framer runs with `reducedMotion="user"`, and a media query flattens CSS
  transitions.
- The top-bar clock is railway time (00–23) and re-arms itself to flip on the
  second boundary rather than drifting with `setInterval`.
- Navigating moves focus to the new page's main region and resets scroll.

## Status

- [x] Shell: layout, routing, nav config, 404
- [x] Command palette, quick actions, area overview
- [x] Accessibility pass: skip link, focus hand-off, reduced motion
- [ ] Data layer for each section (all currently empty states)
- [ ] Gallery and Documents (locked in the rail)
- [ ] Settings (preferences screen)
