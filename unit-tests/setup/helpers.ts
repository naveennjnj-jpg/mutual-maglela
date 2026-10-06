import { vi } from "vitest";

/** Props that satisfy the common shapes (modals, forms, steps, lists). */
export const genericProps: Record<string, any> = {
  open: true, isOpen: true, show: true, visible: true,
  onClose: vi.fn(), onOpenChange: vi.fn(), onSubmit: vi.fn(), onNext: vi.fn(), onBack: vi.fn(),
  onSuccess: vi.fn(), onChange: vi.fn(), onSelect: vi.fn(), onSave: vi.fn(), onCancel: vi.fn(),
  setStep: vi.fn(), setFormData: vi.fn(), setData: vi.fn(), updateFormData: vi.fn(),
  formData: {}, data: {}, user: { id: "1", name: "Test", email: "t@e.com" },
  title: "Title", description: "Description", subtitle: "Subtitle", heading: "Heading",
  getInitials: (n: string) => (n || "").split(" ").map((p) => p[0]).join(""),
  formatDate: (d: string) => String(d), getStatusColor: () => "text-green-600", getStatusLabel: (a: boolean) => (a ? "Active" : "Inactive"),
  onToggleStatus: vi.fn(), onUserUpdated: vi.fn(),
  menuItems: [{ title: "Dashboard", path: "/user" }], userName: "Test User", userEmail: "t@e.com", userInitials: "TU",
  children: null, className: "",
  items: [], stats: [], list: [], steps: [], testimonials: [], faqs: [], cards: [], team: [],
};

type Found = { label: string; Component: unknown };

/** Collect every exported React component (function / forwardRef / memo) from a glob result. */
export function collectComponents(modules: Record<string, any>, stripPrefix: string): Found[] {
  const out: Found[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const base = path.replace(stripPrefix, "");
    const isComp = (v: any) =>
      typeof v === "function" || (v && typeof v === "object" && ("$$typeof" in v));
    const name = (k: string) => (k === "default" ? base : `${base} › ${k}`);
    for (const [k, v] of Object.entries(mod)) {
      // Component names start with an uppercase letter or are the default export
      if (isComp(v) && (k === "default" || /^[A-Z]/.test(k))) out.push({ label: name(k), Component: v });
    }
  }
  return out;
}
