import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as icons from "@/utils/svgicons";

describe("svgicons", () => {
  const entries = Object.entries(icons).filter(([, v]) => typeof v === "function") as [string, () => JSX.Element][];
  it("exports at least one icon", () => expect(entries.length).toBeGreaterThan(0));
  it.each(entries)("%s renders an <svg>", (_n, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
