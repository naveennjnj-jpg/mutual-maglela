import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import App from "@/App";

const renderAt = (path: string, ui = <AppRoutes />) =>
  render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);

describe("AppRoutes", () => {
  const paths = ["/", "/about", "/contact", "/pricing", "/login", "/forgot-password", "/user", "/user/projects", "/admin", "/admin/projects"];
  it.each(paths)("renders %s without throwing", (p) => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderAt(p)).not.toThrow();
    err.mockRestore();
  });

  it("App mounts the router tree", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = renderAt("/", <App />);
    expect(container.firstChild).not.toBeNull();
    err.mockRestore();
  });
});
