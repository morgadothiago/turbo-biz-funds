import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base active");
  });

  it("should filter out falsy values", () => {
    const isActive = false;
    const result = cn("class1", isActive && "class2", null, undefined, "class3");
    expect(result).toBe("class1 class3");
  });

  it("should handle array of classes", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle object syntax for conditional classes", () => {
    const result = cn("base", { active: true, disabled: false });
    expect(result).toBe("base active");
  });

  it("should merge tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should return empty string for no inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle nested arrays", () => {
    const result = cn(["class1", ["class2", "class3"]], "class4");
    expect(result).toBe("class1 class2 class3 class4");
  });
});
