import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatsSection from "../../../src/components/Common/StatsSection";

describe("StatsSection", () => {
  it("renders the built-in default stats when none are provided", () => {
    render(<StatsSection />);

    expect(screen.getByText("3+")).toBeInTheDocument();
    expect(
      screen.getByText("Research Networks Served")
    ).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("12+")).toBeInTheDocument();
  });

  it("renders custom stats instead of the defaults when provided", () => {
    render(
      <StatsSection
        stats={[
          { id: 1, number: "100%", label: "Custom metric" },
          { id: 2, number: "5x", label: "Another metric" },
        ]}
      />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Custom metric")).toBeInTheDocument();
    expect(screen.getByText("5x")).toBeInTheDocument();
    expect(screen.getByText("Another metric")).toBeInTheDocument();
    expect(screen.queryByText("3+")).not.toBeInTheDocument();
  });

  it("renders exactly as many stat blocks as it is given", () => {
    const { container } = render(
      <StatsSection
        stats={[{ id: 1, number: "1", label: "One" }]}
      />
    );

    // Each stat renders as a ".text-center" block inside the grid.
    expect(container.querySelectorAll(".text-center")).toHaveLength(1);
  });
});
