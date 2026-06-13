// tests/fingertricks/annotate.test.ts
import { describe, it, expect } from "vitest";
import { annotate } from "../../src/lib/fingertricks/annotate";

describe("指法標注", () => {
  it("sexy move 命中 trigger", () => {
    const hints = annotate("R U R' U'");
    expect(hints[0]).toEqual({ startIndex: 0, endIndex: 3, hint: expect.stringContaining("食指") });
  });
  it("最長優先：R U R' U' R U R' → sexy + 三連", () => {
    const hints = annotate("R U R' U' R U R'");
    expect(hints[0].endIndex).toBe(3);
    expect(hints[1]).toEqual({ startIndex: 4, endIndex: 6, hint: expect.any(String) });
  });
  it("未命中 move 用單鍵兜底", () => {
    expect(annotate("M2")[0].hint.length).toBeGreaterThan(0);
  });
  it("空 alg → 空陣列", () => {
    expect(annotate("")).toEqual([]);
  });
  it("整條 alg 被區間完整覆蓋且不重疊", () => {
    const hints = annotate("F R U' R' U' R U R' F' R U R' U' R' F R F'");
    let cursor = 0;
    for (const h of hints) {
      expect(h.startIndex).toBe(cursor);
      cursor = h.endIndex + 1;
    }
    expect(cursor).toBe(17);
  });
});
