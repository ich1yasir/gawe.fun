import { describe, expect, it, vi, afterEach } from "vitest";
import { generateQueueCode, getQueueDisplayCode, normalizeQueueCode } from "./queue";

describe("queue utils", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes queue code by trimming and uppercasing", () => {
    expect(normalizeQueueCode("  ab-c12  ")).toBe("AB-C12");
  });

  it("generates queue code with prefix and uppercase random part", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.123456789);

    expect(generateQueueCode("A")).toBe("A-4FZZZX");
  });

  it("keeps provided prefix in generated queue code", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const generated = generateQueueCode("Counter");
    expect(generated.startsWith("Counter-")).toBe(true);
    expect(generated).toMatch(/^Counter-[A-Z0-9]{6}$/);
  });

  it("uses public code for display when available", () => {
    expect(getQueueDisplayCode({ prefixCode: "A", publicCode: "A-XYZ123" })).toBe("A-XYZ123");
  });

  it("falls back to prefix unset display when public code is missing", () => {
    expect(getQueueDisplayCode({ prefixCode: "B" })).toBe("B-UNSET");
  });
});
