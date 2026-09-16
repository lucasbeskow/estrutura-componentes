# Repository Guidelines

## Project Structure & Module Organization
`src/components/` contains the web components, usually grouped by domain and split into `.tsx`, `.scss`/`.css`, `readme.md`, and a local `test/` folder. Shared code lives in `src/global/` and `src/utils/`; global styles and fonts live in `src/styles/` and `src/assets/`. Cross-component test helpers are under `test/utils/`, and integration docs live in `docs/`.

`bth-app` is the application shell. Components outside `src/components/app/` must not import from it: shared contracts belong in `src/global/` (for example `eventos.interfaces.ts`), and the remaining coupling is by DOM event name. ESLint enforces this — see Coding Style below.

## Build, Test, and Development Commands
Use Yarn 4 with Node.js 22. The Yarn version is pinned in the `packageManager` field and installed by Corepack, which ships with Node; enable it once with `corepack enable`.

- `yarn` installs dependencies.
- `yarn start` runs the Stencil dev server at `http://localhost:3333`.
- `yarn build` creates the distributable package and generated component docs.
- `yarn docs.data` exports JSON docs to `docs/json/docs.json`.
- `yarn test` runs spec and e2e suites with coverage, matching CI.
- `yarn test.spec` runs unit/spec tests only.
- `yarn test.e2e` runs browser-based e2e tests.
- `yarn lint` checks `src/` with ESLint.
- `yarn generate` scaffolds a new component.

The `test.*` scripts pass `--max-workers=2`. Stencil defaults to one worker per core, which exhausts memory on 8 GB machines once coverage instrumentation is enabled.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, LF, 2 spaces, trailing whitespace removed. ESLint is configured in `eslint.config.mjs` (flat config) and enforces semicolons, single quotes, and sorted imports with grouped spacing. It also blocks relative imports into `src/components/app/` from other components. Keep Stencil decorators in the configured inline/multiline style and prefer one component export per file.

Component tags must use the `bth-` prefix, but class names and file names should not. Use lowercase names with hyphens for folders/files such as `menu-painel-lateral`. Named slots use lowercase with underscores like `menu_ferramentas`; DOM events use `camelCase`, preferably in the past tense.

## Testing Guidelines
Tests use Stencil's Jest-based `--spec` runner and Puppeteer-backed `--e2e` runner. Put unit tests next to the component in `test/*.spec.ts`; use `.e2e.ts` for browser flows. Reuse helpers from `test/utils/` and local `helper/` folders, keep scenarios small, and follow Arrange/Act/Assert. CI runs `yarn test` and `yarn build`, so touched components should keep coverage stable.

Suites that combine `jest.useFakeTimers()` with `newSpecPage()` must request the `'legacy'` implementation. The modern timers that became the default in Jest 27 intercept `queueMicrotask` and `process.nextTick`, which Stencil's internal task queue relies on, and the page never resolves.

Stencil has deprecated this integrated test runner and will remove it in v5, pointing to `@stencil/vitest` and `@stencil/playwright`. The build prints the warning on every run.

## Commit & Pull Request Guidelines
Recent history mixes concise imperative summaries with Conventional Commit prefixes, for example `feat: atualizado cores...` and `Adiciona possibilidade... (#19)`. Prefer short, descriptive subjects; add `feat:`/`chore:` when it fits, and include tracker or PR references when available.

PRs should describe the affected components, list verification steps, and link the issue or ticket. Include screenshots or GIFs for UI or responsive behavior changes, since this repository ships visual components.
