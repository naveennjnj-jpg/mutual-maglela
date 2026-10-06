# Unit tests

Run from the project root (same level as `src/`):

    npm install -D @testing-library/dom      # peer dependency of @testing-library/react (missing from package.json)
    npm test                                  # vitest run
    npm run test:coverage

Layout (mirrors `src/`):

    unit-tests/
      setup/        setup.ts (jsdom polyfills), commonMocks.tsx (axios, sonner, auth, pdf, charts...), helpers.ts
      mocks/ui/     stand-ins for shadcn `components/ui/*` (only used if src/components/ui is missing)
      lib/ utils/ constants/ data/   pure logic tests
      context/      AuthContext + ThemeContext (real behaviour, axios mocked)
      components/   ProtectedRoute behaviour + smoke render of every component
      layouts/      smoke render + <Outlet/> check
      pages/        smoke render of every page
      routes/       AppRoutes / App

New components, pages and layouts are picked up automatically (import.meta.glob).
`KNOWN_SOURCE_BUGS` in components/smoke.test.tsx lists real bugs found in src (marked `it.fails`).
