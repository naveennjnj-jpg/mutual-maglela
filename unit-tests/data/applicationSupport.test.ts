import { describe, it, expect } from "vitest";
import { applicationSupportContent } from "@/data/applicationSupport";

describe("applicationSupportContent", () => {
  const entries = Object.entries(applicationSupportContent as Record<string, any>);

  it("has at least one entry", () => expect(entries.length).toBeGreaterThan(0));

  it.each(entries)("%s has all required fields", (_key, c) => {
    expect(c.title).toBeTruthy();
    expect(c.heroDescription).toBeTruthy();
    expect(c.heading).toBeTruthy();
    expect(c.price).toMatch(/^\$\d+/);
    expect(c.paragraphs.length).toBeGreaterThan(0);
    c.paragraphs.forEach((p: string) => expect(p.trim()).not.toBe(""));
    expect(Array.isArray(c.faqs)).toBe(true);
    c.faqs.forEach((f: any) => {
      expect(f.question).toBeTruthy();
      expect(f.answer).toBeTruthy();
    });
  });
});
