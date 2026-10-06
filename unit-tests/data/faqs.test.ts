import { describe, it, expect } from "vitest";
import { faqCategories, allFaqs } from "@/data/faqs";

describe("faqs data", () => {
  it("has categories with unique ids", () => {
    expect(faqCategories.length).toBeGreaterThan(0);
    const ids = faqCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every category has a title and non-empty faqs", () => {
    for (const c of faqCategories) {
      expect(c.title).toBeTruthy();
      expect(c.faqs.length).toBeGreaterThan(0);
    }
  });
  it("every faq has a question and an answer", () => {
    for (const f of allFaqs) {
      expect(f.question.trim()).not.toBe("");
      expect(f.answer.trim()).not.toBe("");
    }
  });
  it("allFaqs is the flattened list of all category faqs", () => {
    const total = faqCategories.reduce((n, c) => n + c.faqs.length, 0);
    expect(allFaqs).toHaveLength(total);
  });
});
