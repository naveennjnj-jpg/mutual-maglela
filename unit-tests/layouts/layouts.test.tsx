/** Layouts render their chrome plus the matched child route via <Outlet/>. */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import * as React from "react";
import { genericProps, collectComponents } from "../setup/helpers";

const modules = import.meta.glob("../../src/layouts/**/*.tsx", { eager: true });
const KNOWN_SOURCE_BUGS: Record<string, string> = {};

describe("layouts", () => {
  const items = collectComponents(modules, "../../src/layouts/");
  it("discovers layouts", () => expect(items.length).toBeGreaterThan(5));

  for (const c of items) {
    const known = KNOWN_SOURCE_BUGS[c.label];
    const run = known ? it.fails : it;
    run(`${c.label} renders`, () => {
      const err = vi.spyOn(console, "error").mockImplementation(() => {});
      const Comp = c.Component as React.ComponentType<any>;
      try {
        render(<MemoryRouter><Comp {...genericProps} /></MemoryRouter>);
      } finally {
        err.mockRestore();
      }
    });
  }

  for (const file of ["WebsiteLayout", "AuthLayout", "user/UserLayout", "admin/AdminLayout"]) {
    it(`${file} renders the child route through <Outlet/>`, async () => {
      const err = vi.spyOn(console, "error").mockImplementation(() => {});
      const mod: any = modules[`../../src/layouts/${file}.tsx`];
      const Layout = mod.default;
      render(
        <MemoryRouter initialEntries={["/child"]}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/child" element={<div>CHILD-CONTENT</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      expect(await screen.findByText("CHILD-CONTENT")).toBeInTheDocument();
      err.mockRestore();
    });
  }
});
