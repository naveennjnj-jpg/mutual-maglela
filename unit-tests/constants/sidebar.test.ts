import { describe, it, expect } from "vitest";
import { userSidebar } from "@/constants/userSidebar";
import { adminSidebar } from "@/constants/adminSidebar";

describe.each([
  ["userSidebar", userSidebar],
  ["adminSidebar", adminSidebar],
])("%s", (_name, items) => {
  it("is a non-empty array", () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });
  it("every item has a title and an absolute path", () => {
    for (const i of items as any[]) {
      expect(typeof i.title).toBe("string");
      expect(i.title.length).toBeGreaterThan(0);
      expect(i.path.startsWith("/")).toBe(true);
    }
  });
  it("has unique paths", () => {
    const paths = (items as any[]).map((i) => i.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
