# Repo Radar

An Nx monorepo managed with Yarn workspaces.

## Layout

```
.
├── apps/
│   └── repo-radar/        React 19 + Vite app (routes, pages, entry point)
├── packages/
│   └── ui/                @repo-radar/ui — shared MUI component library
├── eslint.config.js       shared flat ESLint config
├── nx.json                Nx targets, caching, task inputs
├── tsconfig.base.json     shared compiler options + path aliases
└── package.json           workspace root
```

`@repo-radar/ui` is consumed directly from TypeScript source — there is no build
step for the library. Vite compiles it as part of the app, so edits to a
component hot-reload immediately. The alias is declared in two places that must
stay in sync: `paths` in `tsconfig.base.json` (for the type checker) and the
Yarn workspace symlink (for Vite's resolver).

## Commands

Run from the repo root:

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `yarn dev`        | start the Vite dev server for the app         |
| `yarn build`      | production build into `apps/repo-radar/dist`  |
| `yarn preview`    | serve the production build                    |
| `yarn typecheck`  | `tsc` across every project                    |
| `yarn lint`       | ESLint across every project                   |
| `yarn graph`      | open the Nx project graph                     |

Target a single project with `npx nx <target> <project>`, e.g.
`npx nx lint @repo-radar/ui`.

## Adding a package

1. Create `packages/<name>/` with a `package.json` named `@repo-radar/<name>`,
   `"private": true`, and `"exports": { ".": "./src/index.ts" }`.
2. Add a `tsconfig.json` extending `../../tsconfig.base.json`.
3. Add the alias to `paths` in `tsconfig.base.json`.
4. Add it to the consuming app's `dependencies` and run `yarn install`.
