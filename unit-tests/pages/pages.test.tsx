/** Smoke tests: every page under src/pages renders inside a router without throwing. */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as React from "react";
import { genericProps, collectComponents } from "../setup/helpers";

const modules = import.meta.glob("../../src/pages/**/*.tsx", { eager: true });

/** Add `"path/File.tsx": "reason"` for pages with a known source bug (marked it.fails). */
const KNOWN_SOURCE_BUGS: Record<string, string> = {};

describe("pages smoke", () => {
  const items = collectComponents(modules, "../../src/pages/");
  it("discovers pages", () => expect(items.length).toBeGreaterThan(50));

  for (const c of items) {
    const known = KNOWN_SOURCE_BUGS[c.label];
    const run = known ? it.fails : it;
    run(`${c.label} renders${known ? ` (known bug: ${known})` : ""}`, async () => {
      const err = vi.spyOn(console, "error").mockImplementation(() => {});
      const Comp = c.Component as React.ComponentType<any>;
      try {
        render(
          <MemoryRouter initialEntries={["/"]}>
            <Comp {...genericProps} />
          </MemoryRouter>
        );
      } finally {
        err.mockRestore();
      }
    });
  }
});
