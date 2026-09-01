import { describe, expect, it } from "vitest";
import { cn } from "../../../src/lib/utils";

describe("cn()", () => {
  it("joins simple string class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values (undefined, null, false, empty string)", () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("supports conditional object syntax from clsx", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("merges conflicting Tailwind utility classes, keeping the last one", () => {
    // tailwind-merge should resolve the conflict between p-2 and p-4,
    // keeping only the later class.
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("merges conflicting text color utilities but keeps unrelated classes", () => {
    expect(cn("text-sm text-red-500", "text-blue-500")).toBe(
      "text-sm text-blue-500"
    );
  });

  it("handles arrays of class names", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("returns an empty string when given nothing usable", () => {
    expect(cn()).toBe("");
    expect(cn(undefined, null, false)).toBe("");
  });
});
