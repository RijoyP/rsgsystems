import { formatTimestamp } from "./date";

describe("formatTimestamp", () => {
  it("returns a readable timestamp string", () => {
    const result = formatTimestamp("2026-05-28T08:15:00Z");

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
