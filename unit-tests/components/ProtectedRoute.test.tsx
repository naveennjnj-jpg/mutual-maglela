import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

vi.mock("@/context/AuthContext", () => ({ useAuth: vi.fn() }));

const renderAt = (props: { adminOnly?: boolean } = {}) =>
  render(
    <MemoryRouter initialEntries={["/secret"]}>
      <Routes>
        <Route path="/secret" element={<ProtectedRoute {...props}><div>secret</div></ProtectedRoute>} />
        <Route path="/login" element={<div>login page</div>} />
        <Route path="/user" element={<div>user home</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  it("shows a spinner while loading", () => {
    (useAuth as any).mockReturnValue({ loading: true, isAuthenticated: false, user: null });
    const { container } = renderAt();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(screen.queryByText("secret")).toBeNull();
  });
  it("redirects unauthenticated users to /login", () => {
    (useAuth as any).mockReturnValue({ loading: false, isAuthenticated: false, user: null });
    renderAt();
    expect(screen.getByText("login page")).toBeInTheDocument();
  });
  it("renders children for authenticated users", () => {
    (useAuth as any).mockReturnValue({ loading: false, isAuthenticated: true, user: { role: "user" } });
    renderAt();
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
  it("redirects non-admins away from adminOnly routes", () => {
    (useAuth as any).mockReturnValue({ loading: false, isAuthenticated: true, user: { role: "user" } });
    renderAt({ adminOnly: true });
    expect(screen.getByText("user home")).toBeInTheDocument();
  });
  it("lets admins into adminOnly routes", () => {
    (useAuth as any).mockReturnValue({ loading: false, isAuthenticated: true, user: { role: "admin" } });
    renderAt({ adminOnly: true });
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});
