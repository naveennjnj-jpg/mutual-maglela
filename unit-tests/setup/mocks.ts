import { vi } from "vitest";
import * as React from "react";

// ---- Auth: authenticated admin by default so every guarded UI can render ----
export const mockAuth = {
  user: { id: "1", name: "Test User", email: "test@example.com", role: "admin", accountType: "individual", isVerified: true, createdAt: "2024-01-01", credits: 10 },
  loading: false, error: null, isAuthenticated: true,
  register: vi.fn().mockResolvedValue({ success: true }),
  login: vi.fn().mockResolvedValue({ success: true }),
  logout: vi.fn().mockResolvedValue(undefined),
  loadUser: vi.fn().mockResolvedValue(undefined),
  updateDetails: vi.fn().mockResolvedValue({ success: true }),
  AdminupdateDetails: vi.fn().mockResolvedValue({ success: true }),
  updatePassword: vi.fn().mockResolvedValue({ success: true }),
  setError: vi.fn(),
};

export const passthrough = (tag = "div") => (props: any) => React.createElement(tag, { "data-mock": true }, props?.children);
