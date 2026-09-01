# unit-tests

Unit tests for `../src`, using your project's own `node_modules` — no
nested/duplicate install. Nothing in `src/` is modified by any of this.

## What changed from the standalone version

The tests originally shipped with their own `unit-tests/package.json` and
`unit-tests/node_modules`. That caused two real bugs once tests actually
exercised `src/` code:

1. **`vi.mock("axios", ...)` silently didn't apply** — Vitest loads real
   npm packages via plain Node `require` ("externalizing"), which
   resolves by walking up from the *importing file*. Since `src/`'s own
   files sit outside `unit-tests`, that walk landed on your project
   root's `node_modules/axios` instead of the mocked one, so tests hit
   real network calls (`ECONNREFUSED`).
2. **Two copies of React** — `unit-tests/node_modules/react` (used by the
   test files) and the root's `node_modules/react` (used by
   `react-router-dom` inside `src/`) were different module instances,
   breaking hooks with `Cannot read properties of null (reading
   'useContext')`.

Both go away once there's exactly one `node_modules` for the whole
project. So now:

- **`vitest.config.ts` lives at the project root**, as a sibling of your
  existing `vite.config.ts` (which is untouched — Vitest prefers
  `vitest.config.ts` when both exist, so `npm run dev` / `npm run build`
  behave exactly as before).
- **Dependencies are added to the root `package.json`** (`vitest`,
  `jsdom`, `@vitest/ui`, `@vitest/coverage-v8`) alongside everything you
  already had — nothing existing was removed, including the unused
  `jest`/`ts-jest` packages already in your `devDependencies` (left alone
  in case something else depends on them; delete them yourself if not).
- **`unit-tests/` no longer has its own `package.json` or
  `node_modules`** — just the tests themselves plus a lightweight
  `tsconfig.json` for editor IntelliSense (not used to actually run
  tests; Vitest transpiles via esbuild, not `tsc`).

## Install & run

From your project root (where `package.json` and `vite.config.ts` live):

```bash
npm install        # picks up the newly added vitest/jsdom/etc.
npm test           # run once
npm run test:watch # watch mode
npm run test:ui    # Vitest's browser UI
npm run test:coverage
```

## What's covered

| Test file | What it tests |
|---|---|
| `__tests__/lib/cn.test.ts` | `cn()` class-name merge utility (`src/lib/utils.ts`) |
| `__tests__/context/AuthContext.test.tsx` | `AuthProvider` / `useAuth` — login, register, logout, loadUser, updateDetails, updatePassword, error handling (axios mocked, no real network calls) |
| `__tests__/context/ThemeContext.test.tsx` | `ThemeProvider` / `useTheme` — theme resolution from localStorage/API, `toggleTheme`, DOM class/attribute updates |
| `__tests__/components/ProtectedRoute.test.tsx` | Loading state, redirect-to-login, admin-only gating, rendering protected children |
| `__tests__/components/TestimonialQuote.test.tsx` | Conditional rendering, quote formatting, brand line toggle |
| `__tests__/components/StatsSection.test.tsx` | Default vs. custom stats rendering |

This is a starting suite, not full coverage of the whole app. Use these
files as the pattern to extend coverage.

## Mocking conventions used here

- **`axios` is always mocked** with `vi.mock("axios", ...)` — no test
  makes a real HTTP request. This only works correctly because
  `vitest.config.ts` and its tests now share the project's one
  `node_modules` (see above) — a nested/duplicate install would silently
  bypass the mock again.
- **`window.matchMedia`** is stubbed in `setup/setupTests.ts` since jsdom
  doesn't implement it, and `ThemeContext` depends on it for the
  "system" theme.
- **`localStorage`** is cleared before every test so token/theme state
  can't leak between tests.
- Context hooks (`useAuth`, `useTheme`) are tested with
  `@testing-library/react`'s `renderHook`, wrapped in their real
  provider — except in `ProtectedRoute.test.tsx`, where `useAuth` itself
  is mocked so the routing logic can be tested in isolation.

## Adding more tests

1. Create a new file under `__tests__/<area>/<Thing>.test.tsx`.
2. Import the real module from `src` with a relative path
   (`../../../src/...`).
3. If it calls `axios`, add a `vi.mock("axios", ...)` block like the ones
   in `AuthContext.test.tsx` / `ThemeContext.test.tsx`.
4. If it renders a component that calls `useAuth()`/`useTheme()`, either
   wrap it in the real provider or mock the hook the way
   `ProtectedRoute.test.tsx` does.
