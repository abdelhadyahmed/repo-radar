# Repo Radar

Search GitHub for repositories, track the ones you care about, and watch their
stars, open issues and latest commit on one dashboard.

**Live demo:** <https://repo-radar-siemens-repo-radar.vercel.app>

React 19 + Vite + Redux Toolkit + MUI, in an Nx monorepo on Yarn workspaces.

## Setup

You need **Node 20.19+ or 22.12+** and **Yarn 1** (`npm i -g yarn`).

```bash
yarn install
yarn dev          # http://localhost:5173
```

No API key or `.env` is needed.

| Command          | What it does                                 |
| ---------------- | -------------------------------------------- |
| `yarn dev`       | start the dev server                         |
| `yarn build`     | production build into `apps/repo-radar/dist` |
| `yarn preview`   | serve the production build                   |
| `yarn typecheck` | `tsc` across every project                   |
| `yarn lint`      | ESLint across every project                  |

## Architecture

```
apps/repo-radar/      pages, routes, theme, useDebounce
packages/types/       shared types — depends on nothing
packages/store/       Redux state
packages/github-repo/       The GitHub API
packages/ui/          shared MUI components
packages/plots/          shared plots
```

Dependencies point one way: `ui` and `store` use `types`, and the app uses all
three. The packages have no build step — Vite compiles them from TypeScript
source with the app, so edits hot-reload. Each alias is declared twice and both
must agree: `paths` in `tsconfig.base.json` for the type checker, and the Yarn
workspace link for Vite.

**Decisions worth knowing:**

- **Requests carry an id.** A response whose id is no longer the current one is
  discarded, so a slow reply cannot overwrite a newer one. Superseded requests
  are also aborted.
- **The debounce is a React hook, not store code.** `useDebounce` lives in the
  app and the search page dispatches `runSearch` when typing settles. Timers in
  the store would be module-level state shared by every store instance.
- **Each tracked repo owns its `status` and `error`.** Refreshing all of them
  dispatches one thunk per repo, so one failure never blocks the others.
- **The tracked reducers write to `localStorage` themselves.** This makes them
  impure — DevTools time-travel will rewrite storage — in exchange for keeping
  the save next to the change instead of in a store subscription.
- **Repos are keyed by lowercase `owner/name`,** not GitHub's numeric id, so
  the same repo cannot be tracked twice under different capitalisation.
- **One axios interceptor** turns failures into readable messages, so no call
  site handles errors.
- **Optimize the build chunks and load time using lazy loading** keep the app faster in loading and download the needed chunks only once we need it!
keeps the app more frindly at the first run of the website.


## Assumptions and limitations

- **Unauthenticated GitHub: 60 requests an hour.** A search costs one, a
  refresh costs two. "Refresh all" over 30 repos exhausts the hour. Adding a
  token would raise this to 5,000 but is not implemented.
- **Tracked repos live in `localStorage`.** They are per-browser: no account,
  no sync across devices, and clearing site data loses them. Unreadable or
  corrupt storage is treated as empty rather than failing.
- **Search returns the first 20 results.** There is no pagination.
- **Nothing refreshes on its own.** Tracked data is whatever was last fetched
  until you press refresh.
- **No test suite is set up** — `yarn typecheck` and `yarn lint` are the only
  automated checks.
- **Renamed repositories** keep refreshing (GitHub redirects) and the card
  shows the new name, but the entry keeps its original key. Searching for the
  new name shows it as untracked, and tracking it again adds a duplicate.