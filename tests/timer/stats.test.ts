import { describe, it, expect } from "vitest";
import { effectiveMs, aoN, best, sessionMean, formatMs, type Solve } from "../../src/lib/timer/stats";

const s = (ms: number, penalty: Solve["penalty"] = null): Solve =>
  ({ id: String(ms) + Math.random(), ms, scramble: "", ts: 0, penalty });

describe("timer stats（WCA 規則）", () => {
  it("+2 加 2000ms，DNF 無效", () => {
    expect(effectiveMs(s(10000, "+2"))).toBe(12000);
    expect(effectiveMs(s(10000, "DNF"))).toBe(Infinity);
  });
  it("ao5：去最好最差取中間 3 平均", () => {
    expect(aoN([8, 10, 12, 14, 100].map((x) => s(x * 1000)), 5)).toBe(12000);
  });
  it("ao5 含 1 DNF：DNF 當最差去掉", () => {
    expect(aoN([s(8000), s(10000), s(12000), s(14000), s(9000, "DNF")], 5)).toBe(12000);
  });
  it("ao5 含 2 DNF → Infinity（顯示 DNF）", () => {
    expect(aoN([s(8000), s(10000), s(12000), s(9000, "DNF"), s(7000, "DNF")], 5)).toBe(Infinity);
  });
  it("不足 N 筆 → null；ao100 去頭尾各 5", () => {
    expect(aoN([s(1000)], 5)).toBeNull();
    const hundred = Array.from({ length: 100 }, (_, i) => s((i + 1) * 1000));
    expect(aoN(hundred, 100)).toBe(50500); // 6..95 平均
  });
  it("formatMs：mm:ss.xx 與 ss.xx", () => {
    expect(formatMs(9870)).toBe("9.87");
    expect(formatMs(69870)).toBe("1:09.87");
    expect(formatMs(Infinity)).toBe("DNF");
  });
});
