/**
 * Smoke tests: every module under src/components renders without throwing.
 * Network, auth and heavy third-party libs are mocked (see vi.mock below).
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as React from "react";
import { genericProps, collectComponents } from "../setup/helpers";

vi.mock("@/context/AuthContext", async () => {
  const { mockAuth } = await import("../setup/mocks");
  return {
    useAuth: () => mockAuth,
    AuthProvider: ({ children }: any) => children,
    default: {},
  };
});

vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    isDark: false,
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => children,
}));

vi.mock("axios", () => {
  const ok = vi.fn().mockResolvedValue({
    data: { success: true, data: [] },
  });

  const inst: any = {
    get: ok,
    post: ok,
    put: ok,
    patch: ok,
    delete: ok,
    defaults: {},
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    create: () => inst,
  };

  return {
    default: inst,
    ...inst,
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }),
  Toaster: () => null,
}));

vi.mock("@react-pdf/renderer", () => {
  const P = ({ children }: any) => <div>{children}</div>;

  return {
    Document: P,
    Page: P,
    Text: P,
    View: P,
    Image: P,
    Link: P,
    PDFViewer: P,
    PDFDownloadLink: P,
    StyleSheet: { create: (s: any) => s },
    Font: { register: vi.fn() },
    pdf: vi.fn(),
    default: {},
  };
});

vi.mock("react-pdf", () => ({
  Document: ({ children }: any) => <div>{children}</div>,
  Page: () => <div />,
  pdfjs: {
    GlobalWorkerOptions: {},
    version: "3",
  },
}));

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {},
  getDocument: vi.fn(),
  version: "3",
}));

vi.mock("@tinymce/tinymce-react", () => ({
  Editor: () => <textarea data-testid="tinymce" />,
}));

vi.mock("react-calendly", () => ({
  InlineWidget: () => <div />,
  PopupButton: () => <button />,
  PopupWidget: () => <div />,
  useCalendlyEventListener: vi.fn(),
}));

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,"),
  },
  toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,"),
}));

vi.mock("react-markdown", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("recharts", async () => {
  const P = ({ children }: any) => <div>{children}</div>;

  return new Proxy(
    { ResponsiveContainer: P },
    {
      get: (t: any, k: string) => t[k] ?? P,
    }
  );
});

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => <div>{children}</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("swiper/modules", () => ({
  Navigation: {},
  Pagination: {},
  Autoplay: {},
  EffectFade: {},
  Thumbs: {},
  FreeMode: {},
  A11y: {},
}));

vi.mock("swiper", () => ({
  default: class {},
}));

const modules = import.meta.glob("../../src/components/**/*.tsx", {
  eager: true,
});

describe("components smoke", () => {
  const items = collectComponents(
    modules,
    "../../src/components/"
  );

  it("discovers components", () =>
    expect(items.length).toBeGreaterThan(50));

  for (const c of items) {
    it(`${c.label} renders`, () => {
      const err = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const Comp = c.Component as React.ComponentType<any>;

      try {
        render(
          <MemoryRouter>
            <Comp {...genericProps} />
          </MemoryRouter>
        );
      } finally {
        err.mockRestore();
      }
    });
  }
});