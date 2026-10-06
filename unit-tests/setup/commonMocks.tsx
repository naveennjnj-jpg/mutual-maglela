// Global mocks, loaded for every test file via vitest.config.ts -> setupFiles.
import { vi } from "vitest";

vi.mock("@/context/AuthContext", async () => {
  const { mockAuth } = await import("./mocks");
  return { useAuth: () => mockAuth, AuthProvider: ({ children }: any) => children, default: {} };
});
vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", isDark: false, toggleTheme: vi.fn(), setTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => children,
}));
vi.mock("axios", () => {
  const ok = vi.fn().mockResolvedValue({ data: { success: true, data: [] } });
  const inst: any = { get: ok, post: ok, put: ok, patch: ok, delete: ok, defaults: {}, interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }, create: () => inst };
  return { default: inst, ...inst };
});
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn(), loading: vi.fn(), dismiss: vi.fn() }), Toaster: () => null }));
vi.mock("@react-pdf/renderer", () => {
  const P = ({ children }: any) => <div>{children}</div>;
  return { Document: P, Page: P, Text: P, View: P, Image: P, Link: P, PDFViewer: P, PDFDownloadLink: P, StyleSheet: { create: (s: any) => s }, Font: { register: vi.fn() }, pdf: vi.fn(), default: {} };
});
vi.mock("react-pdf", () => ({ Document: ({ children }: any) => <div>{children}</div>, Page: () => <div />, pdfjs: { GlobalWorkerOptions: {}, version: "3" } }));
vi.mock("pdfjs-dist", () => ({ GlobalWorkerOptions: {}, getDocument: vi.fn(), version: "3" }));
vi.mock("@tinymce/tinymce-react", () => ({ Editor: () => <textarea data-testid="tinymce" /> }));
vi.mock("react-calendly", () => ({ InlineWidget: () => <div />, PopupButton: () => <button />, PopupWidget: () => <div />, useCalendlyEventListener: vi.fn() }));
vi.mock("qrcode", () => ({ default: { toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,") }, toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,") }));
vi.mock("react-markdown", () => ({ default: ({ children }: any) => <div>{children}</div> }));
vi.mock("recharts", () => {
  const P = ({ children }: any) => <div data-mock="recharts">{children}</div>;
  const names = ["ResponsiveContainer","LineChart","Line","AreaChart","Area","BarChart","Bar","PieChart","Pie","Cell","XAxis","YAxis","CartesianGrid","Tooltip","Legend","RadarChart","Radar","PolarGrid","PolarAngleAxis","PolarRadiusAxis","ComposedChart","ScatterChart","Scatter","ReferenceLine","LabelList","Label","Brush","Treemap","Funnel","FunnelChart","RadialBar","RadialBarChart"];
  return Object.fromEntries(names.map((n) => [n, P]));
});
vi.mock("swiper/react", () => ({ Swiper: ({ children }: any) => <div>{children}</div>, SwiperSlide: ({ children }: any) => <div>{children}</div> }));
vi.mock("swiper/modules", () => ({ Navigation: {}, Pagination: {}, Autoplay: {}, EffectFade: {}, Thumbs: {}, FreeMode: {}, A11y: {} }));
vi.mock("swiper", () => ({ default: class {} }));

